import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Close as CloseIcon, DeleteForever } from '@mui/icons-material';
import { Checkbox, IconButton } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { Fragment } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { AddSkillForm, skillsOptions, UpdateSkillForm, useAuth, useDeleteProfileSkills, useUser } from '~/features';
import {
  Button,
  Count,
  mergeBreadcrumbs,
  Modal,
  PageTitle,
  SkillBar,
  useEditingState,
  type SkillMastery,
} from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/skills')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Skills', to: '/users/$userId/skills' }),
    };
  },
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(skillsOptions());
  },
});

const deleteSkillsSchema = z.object({
  skills: z.string().array().min(1),
});

function RouteComponent() {
  const params = Route.useParams();
  const { t } = useTranslation();
  const auth = useAuth();
  const { user, invalidateUser } = useUser({ id: params.userId });
  const deleteMultipleForm = useForm({
    resolver: zodResolver(deleteSkillsSchema),
  });
  const { state, update, del, add, cancel } = useEditingState<{ skill: SkillMastery }>();
  const { deleteProfileSkills } = useDeleteProfileSkills({
    onSuccess: () => {
      handleCancel();
      invalidateUser();
    },
  });

  const isOwner = user.id === auth.user!.id;
  const selectedSkills = deleteMultipleForm.watch('skills');

  function handleUpdate(skill: SkillMastery) {
    if (isOwner) {
      update({ skill });
    }
  }

  function handleDelete(skill: SkillMastery) {
    deleteProfileSkills({
      userId: params.userId,
      skillNames: [skill.name],
    });
  }

  const handleMultipleDelete: SubmitHandler<z.infer<typeof deleteSkillsSchema>> = async (data) => {
    deleteProfileSkills({
      userId: params.userId,
      skillNames: data.skills,
    });
  };

  function handleCancel() {
    cancel();
  }

  return (
    <div className="px-6 py-4">
      <PageTitle>{t('Skills')}</PageTitle>

      <Modal open={state.status === 'adding'} title={t('Add Skill')} onClose={handleCancel}>
        <AddSkillForm
          onSuccess={() => {
            cancel();
            invalidateUser();
          }}
          onCancel={handleCancel}
        />
      </Modal>

      <Modal open={state.status === 'updating'} title={t('Update Skill')} onClose={handleCancel}>
        {state.status === 'updating' && (
          <UpdateSkillForm
            skill={state.context!.skill}
            onSuccess={() => {
              cancel();
              invalidateUser();
            }}
            onCancel={handleCancel}
          />
        )}
      </Modal>

      <form className="relative mx-auto xl:max-w-4xl" onSubmit={deleteMultipleForm.handleSubmit(handleMultipleDelete)}>
        {user.skillsByCategories &&
          Object.entries(user.skillsByCategories)
            .sort()
            .map(([categoryName, skills]) => (
              <section key={categoryName} className="my-8">
                <h2 className="mb-4">{t(categoryName)}</h2>

                <div className="grid auto-rows-[minmax(50px,auto)] grid-cols-2 gap-4 xl:grid-cols-3">
                  {skills.map((s, i) => (
                    <Fragment key={s.name}>
                      <div className="group flex items-center gap-2 select-none" key={i}>
                        <label
                          htmlFor={`skill-${s.name}`}
                          className="flex cursor-pointer gap-2"
                          onClick={() => handleUpdate(s)}
                        >
                          <SkillBar mastery={s.mastery} className="max-w-[100px]" />
                          <span>{s.name}</span>
                        </label>

                        {state.status === 'deleting' ? (
                          <Checkbox id={`skill-${s.name}`} value={s.name} {...deleteMultipleForm.register('skills')} />
                        ) : (
                          isOwner && (
                            <IconButton
                              className="invisible text-primary group-hover:visible"
                              onClick={() => handleDelete(s)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          )
                        )}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </section>
            ))}

        {isOwner && (
          <div className="z-20 flex justify-end bg-bg xl:mt-20 xl:gap-15 dark:bg-bg-dark sticky bottom-16 xl:bottom-4 w-max ml-auto">
            {state.status === 'deleting' ? (
              <Button variant="outlined" onClick={handleCancel} key="cancel">
                {t('Cancel')}
              </Button>
            ) : (
              <Button variant="text" startIcon={<Add />} onClick={() => add()} key="add-skill">
                {t('Add Skill')}
              </Button>
            )}

            {state.status === 'deleting' ? (
              <Button
                variant="contained"
                type="submit"
                key="remove-multiple"
                endIcon={<Count value={selectedSkills?.length ?? 0} className="xl:ml-5" />}
              >
                {t('Delete')}
              </Button>
            ) : (
              <Button key="remove" variant="text" startIcon={<DeleteForever />} onClick={() => del()} dangerous>
                {t('Remove Skills')}
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
