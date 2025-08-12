import { type ChangeEvent, useState } from 'react';
import type { FormType } from '../types';

export const useUserForm = (initialState: FormType) => {
  const [form, setForm] = useState<FormType>(initialState);

  const handleChange = (field: keyof FormType) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return { form, setForm, handleChange };
};
