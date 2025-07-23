import { Select as BaseSelect, FormControl, InputLabel, MenuItem } from '@mui/material';
import { useId } from 'react';

type SelectProps = {} & React.ComponentProps<typeof BaseSelect>;

export const Select: React.FC<SelectProps> = (props) => {
  const { children, label, ...rest } = props;
  const labelId = useId();

  return (
    <FormControl>
      <InputLabel id={labelId} className="bg-bg">
        {label}
      </InputLabel>
      <BaseSelect labelId={labelId} {...rest}>
        {children}
      </BaseSelect>
    </FormControl>
  );
};

type SelectItemProps = {} & React.ComponentProps<typeof MenuItem>;

export const SelectItem: React.FC<SelectItemProps> = (props) => {
  const { ...rest } = props;
  return <MenuItem {...rest} />;
};
