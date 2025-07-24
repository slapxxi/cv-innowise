import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Close as CloseIcon, DeleteForever } from '@mui/icons-material';
import { Checkbox, IconButton } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { Fragment, useReducer } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { useAuth } from '~/app';
import { AddSkillForm, skillsOptions, UpdateSkillForm, useDeleteProfileSkills, useUser } from '~/features';
import { Button, Count, Modal, SkillBar, Text, type SkillMastery } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/skills')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    return { breadcrumb: { title: 'Skills', pathname: `/users/${params.userId}/skills` } };
  },
  loader: ({ context }) => {
    const { auth, queryClient } = context;
    queryClient.prefetchQuery(skillsOptions({ accessToken: auth!.accessToken }));
  },
});

const deleteSkillsSchema = z.object({
  skills: z.string().array().min(1),
});

type Action = { type: 'add' } | { type: 'delete' } | { type: 'update'; skill: SkillMastery } | { type: 'cancel' };

type State = {
  status: 'idle' | 'adding' | 'updating' | 'deleting';
  context?: {
    skill: SkillMastery;
  };
};

function routeReducer(state: State, action: Action): State {
  if (action.type === 'cancel') {
    return { status: 'idle' };
  }

  switch (state.status) {
    case 'idle':
      if (action.type === 'add') {
        return { status: 'adding' };
      }
      if (action.type === 'delete') {
        return { status: 'deleting' };
      }
      if (action.type === 'update') {
        return { status: 'updating', context: { skill: action.skill } };
      }
      return state;
    default:
      return state;
  }
}

function RouteComponent() {
  const params = Route.useParams();
  const { t } = useTranslation();
  const auth = useAuth();
  const { user, invalidateUser } = useUser({ id: params.userId });
  const multipleForm = useForm({
    resolver: zodResolver(deleteSkillsSchema),
  });
  const [state, send] = useReducer(routeReducer, { status: 'idle' });
  const { deleteProfileSkills } = useDeleteProfileSkills({
    onSuccess: () => {
      handleCancel();
      invalidateUser();
    },
  });
  const isOwner = user.id === auth!.user.id;

  const selectedSkills = multipleForm.watch('skills');

  function handleUpdate(skill: SkillMastery) {
    send({ type: 'update', skill });
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
    send({ type: 'cancel' });
  }

  return (
    <div className="px-6 py-4">
      <Text asChild variant="light">
        <h2>{t('Skills')}</h2>
      </Text>

      <Modal open={state.status === 'adding'} title="Add Skill" onClose={handleCancel}>
        <AddSkillForm
          onSuccess={() => {
            handleCancel();
            invalidateUser();
          }}
          onCancel={handleCancel}
        />
      </Modal>

      <Modal open={state.status === 'updating'} title="Update Skill" onClose={handleCancel}>
        {state.status === 'updating' && (
          <UpdateSkillForm
            skill={state.context!.skill}
            onSuccess={() => {
              handleCancel();
              invalidateUser();
            }}
            onCancel={handleCancel}
          />
        )}
      </Modal>

      <form className="relative mx-auto xl:max-w-[900px]" onSubmit={multipleForm.handleSubmit(handleMultipleDelete)}>
        {user.skillsByCategories &&
          Object.entries(user.skillsByCategories)
            .sort()
            .map(([categoryName, skills]) => (
              <section key={categoryName} className="my-8">
                <h2 className="mb-4">{categoryName}</h2>

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
                          <Checkbox id={`skill-${s.name}`} value={s.name} {...multipleForm.register('skills')} />
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
                Cancel
              </Button>
            ) : (
              <Button variant="text" startIcon={<Add />} onClick={() => send({ type: 'add' })} key="add-skill">
                Add Skill
              </Button>
            )}

            {state.status === 'deleting' ? (
              <Button
                variant="contained"
                type="submit"
                key="remove-multiple"
                endIcon={<Count value={selectedSkills?.length ?? 0} className="xl:ml-5" />}
              >
                Delete
              </Button>
            ) : (
              <Button
                key="remove"
                variant="text"
                startIcon={<DeleteForever />}
                onClick={() => send({ type: 'delete' })}
                dangerous
              >
                Remove Skills
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
