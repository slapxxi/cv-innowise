import { zodResolver } from '@hookform/resolvers/zod';
import { Add as AddIcon, Close as CloseIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import { Checkbox, IconButton } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';
import { sortBy } from 'lodash';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { AddLanguageForm, UpdateLanguageForm, useDeleteProfileLanguages } from '~/features/languages';
import { useAuth, useEditingState } from '~/shared/hooks';
import type { LanguageProficiency } from '~/shared/types';
import { Button, Count, Modal, PageTitle, UserLanguageProficiency } from '~/shared/ui';
import { deleteLanguagesSchema } from '../models';
import { useUser } from '../services';

const routeApi = getRouteApi('/_mainLayout/users/$userId/_userLayout/languages');

export function UserLanguagesPage() {
  const { t } = useTranslation();
  const params = routeApi.useParams();
  const auth = useAuth();
  const { user, invalidateUser } = useUser({ id: params.userId });
  const { state, update, del, add, cancel } = useEditingState<{ language: LanguageProficiency }>();
  const deleteMultipleForm = useForm({
    resolver: zodResolver(deleteLanguagesSchema),
  });
  const { deleteProfileLanguages } = useDeleteProfileLanguages({
    onSuccess: () => {
      handleCancel();
      invalidateUser();
    },
  });

  const isOwner = user.id === auth.user!.id;
  const selectedLanguages = deleteMultipleForm.watch('languages');

  function handleUpdate(lp: LanguageProficiency) {
    if (isOwner) {
      update({ language: lp });
    }
  }

  function handleDelete(lp: LanguageProficiency) {
    deleteProfileLanguages({
      userId: params.userId,
      languageNames: [lp.name],
    });
  }

  const handleDeleteMultiple: SubmitHandler<z.infer<typeof deleteLanguagesSchema>> = (data) => {
    deleteProfileLanguages({
      userId: params.userId,
      languageNames: data.languages,
    });
  };

  function handleCancel() {
    cancel();
  }

  return (
    <div className="px-6 py-4">
      <PageTitle>{t('Languages')}</PageTitle>

      <Modal open={state.status === 'adding'} title={t('Add Skill')} onClose={handleCancel}>
        <AddLanguageForm
          onSuccess={() => {
            cancel();
            invalidateUser();
          }}
          onCancel={handleCancel}
        />
      </Modal>

      <Modal open={state.status === 'updating'} title={t('Update Skill')} onClose={handleCancel}>
        {state.status === 'updating' && (
          <UpdateLanguageForm
            language={state.context!.language}
            onSuccess={() => {
              cancel();
              invalidateUser();
            }}
            onCancel={handleCancel}
          />
        )}
      </Modal>

      <form className="mx-auto max-w-4xl" onSubmit={deleteMultipleForm.handleSubmit(handleDeleteMultiple)}>
        <div className="grid auto-rows-[minmax(50px,auto)] grid-cols-2 items-center gap-2 xl:gap-8">
          {sortBy(user.profile.languages, 'name').map((lp) => (
            <div key={lp.name} className="group flex items-center gap-2">
              <UserLanguageProficiency
                value={lp}
                className="max-w-xs cursor-pointer flex-1"
                onClick={() => handleUpdate(lp)}
              />

              {state.status === 'deleting' ? (
                <Checkbox id={`lp-${lp.name}`} value={lp.name} {...deleteMultipleForm.register('languages')} />
              ) : (
                isOwner && (
                  <IconButton className="invisible text-primary group-hover:visible" onClick={() => handleDelete(lp)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )
              )}
            </div>
          ))}
        </div>

        {isOwner && (
          <div className="sticky bottom-16 z-20 ml-auto flex w-max justify-end bg-bg xl:bottom-4 xl:mt-20 xl:gap-15 dark:bg-bg-dark">
            {state.status === 'deleting' ? (
              <Button variant="outlined" onClick={handleCancel} key="cancel">
                {t('Cancel')}
              </Button>
            ) : (
              <Button variant="text" startIcon={<AddIcon />} onClick={() => add()} key="add-skill">
                {t('Add language')}
              </Button>
            )}

            {state.status === 'deleting' ? (
              <Button
                variant="contained"
                type="submit"
                key="remove-multiple"
                endIcon={<Count value={selectedLanguages?.length ?? 0} className="xl:ml-5" />}
              >
                {t('Delete')}
              </Button>
            ) : (
              <Button key="remove" variant="text" startIcon={<DeleteForeverIcon />} onClick={() => del()} dangerous>
                {t('Remove languages')}
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
