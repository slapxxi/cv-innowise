import { useMemo } from 'react';
import type { User } from '~/shared';

type FormType = {
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  positionId?: string;
};

export const useFormIsChanged = (form: FormType, user: User): boolean => {
  return useMemo(() => {
    return (
      form.firstName !== (user.profile?.firstName || '') ||
      form.lastName !== (user.profile?.lastName || '') ||
      form.departmentId !== (user.department?.id || '') ||
      form.positionId !== (user.position?.id || '')
    );
  }, [form, user]);
};
