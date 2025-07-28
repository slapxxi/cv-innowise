import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { FormType } from '~/entities/user/types';
import type { Department, Position } from '~/shared';

type UserFormFieldsProps = {
  className?: string;
  form: FormType;
  fields: (keyof FormType)[];
  setForm: Dispatch<SetStateAction<FormType>>;
  departments?: Department[];
  positions?: Position[];
  onChange: (field: keyof FormType) => (e: ChangeEvent<HTMLInputElement>) => void;
  isOwner?: boolean;
};

const FIELD_LABELS: Record<keyof FormType, string> = {
  firstName: 'First Name',
  lastName: 'Last Name',
  departmentId: 'Department',
  positionId: 'Position',
  email: 'Email',
  password: 'Password',
  role: 'Role',
  departmentName: '',
  positionName: '',
};

export const UserFormFields = ({
  form,
  fields,
  setForm,
  departments = [],
  positions = [],
  onChange,
  isOwner = false,
  className = '',
}: UserFormFieldsProps) => {
  const handleDepartmentChange = (e: ChangeEvent<{ value: unknown }>) => {
    const department = departments.find((d) => d.id === e.target.value);
    setForm((prev) => ({ ...prev, departmentId: department?.id || '', departmentName: department?.name || '' }));
  };

  const handlePositionChange = (e: ChangeEvent<{ value: unknown }>) => {
    const position = positions.find((p) => p.id === e.target.value);
    setForm((prev) => ({ ...prev, positionId: position?.id || '', positionName: position?.name || '' }));
  };
  const pointerEvents: 'auto' | 'none' = isOwner ? 'auto' : 'none';
  const readOnlyStyle = { pointerEvents };

  const readOnlySlotProps = {
    input: {
      style: readOnlyStyle,
      readOnly: !isOwner,
    },
  };

  return (
    <form className={className}>
      {fields.map((field) => {
        if (field === 'departmentId') {
          return (
            <TextField
              select
              key={field}
              label={FIELD_LABELS[field]}
              fullWidth
              margin="dense"
              value={form.departmentId || ''}
              onChange={handleDepartmentChange}
              slotProps={readOnlySlotProps}
            >
              {departments.map((dep) => (
                <MenuItem key={dep.id} value={dep.id}>
                  {dep.name}
                </MenuItem>
              ))}
            </TextField>
          );
        }

        if (field === 'positionId') {
          return (
            <TextField
              select
              key={field}
              label={FIELD_LABELS[field]}
              fullWidth
              margin="dense"
              value={form.positionId || ''}
              onChange={handlePositionChange}
              slotProps={readOnlySlotProps}
            >
              {positions.map((pos) => (
                <MenuItem key={pos.id} value={pos.id}>
                  {pos.name}
                </MenuItem>
              ))}
            </TextField>
          );
        }

        return (
          <TextField
            key={field}
            label={FIELD_LABELS[field]}
            fullWidth
            margin="dense"
            value={form[field] || ''}
            onChange={onChange(field)}
            slotProps={readOnlySlotProps}
          />
        );
      })}
    </form>
  );
};
