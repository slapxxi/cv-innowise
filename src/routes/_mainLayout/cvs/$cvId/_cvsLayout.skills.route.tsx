import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Close as CloseIcon, DeleteForever } from '@mui/icons-material';
import { Checkbox, IconButton } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { Fragment } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { AddCvSkillForm, skillsOptions, UpdateCvSkillForm, useAuth, useCv, useDeleteCvSkills } from '~/features';
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

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/skills')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Skills', to: location.pathname }),
    };
  },
  loader: ({ context }) => {
    const { auth, queryClient } = context;
    queryClient.prefetchQuery(skillsOptions({ accessToken: auth.accessToken! }));
  },
});

const deleteSkillsSchema = z.object({
  skills: z.string().array().min(1),
});

function RouteComponent() {
  const params = Route.useParams();
  const { t } = useTranslation();
  const auth = useAuth();
  const { cv, invalidateCv } = useCv({ id: params.cvId });
  const deleteMultipleForm = useForm({
    resolver: zodResolver(deleteSkillsSchema),
  });
  const { state, update, del, add, cancel } = useEditingState<{ skill: SkillMastery }>();
  const { deleteCvSkills } = useDeleteCvSkills({
    onSuccess: () => {
      handleCancel();
      invalidateCv();
    },
  });

  const isOwner = cv.user?.id === auth.user!.id;
  const selectedSkills = deleteMultipleForm.watch('skills');

  function handleUpdate(skill: SkillMastery) {
    if (isOwner) {
      update({ skill });
    }
  }

  function handleDelete(skill: SkillMastery) {
    deleteCvSkills({
      cvId: params.cvId,
      skillNames: [skill.name],
    });
  }

  const handleMultipleDelete: SubmitHandler<z.infer<typeof deleteSkillsSchema>> = async (data) => {
    deleteCvSkills({
      cvId: params.cvId,
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
        <AddCvSkillForm
          onSuccess={() => {
            cancel();
            invalidateCv();
          }}
          onCancel={handleCancel}
        />
      </Modal>

      <Modal open={state.status === 'updating'} title={t('Update Skill')} onClose={handleCancel}>
        {state.status === 'updating' && (
          <UpdateCvSkillForm
            skill={state.context!.skill}
            onSuccess={() => {
              cancel();
              invalidateCv();
            }}
            onCancel={handleCancel}
          />
        )}
      </Modal>

      <form className="relative mx-auto xl:max-w-4xl" onSubmit={deleteMultipleForm.handleSubmit(handleMultipleDelete)}>
        {cv.skillsByCategories &&
          Object.entries(cv.skillsByCategories)
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
