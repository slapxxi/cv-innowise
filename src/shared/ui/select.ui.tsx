import { Select as BaseSelect, FormControl, InputLabel, MenuItem } from '@mui/material';
import { useId } from 'react';

type SelectProps = { labelProps?: React.ComponentProps<typeof InputLabel> } & React.ComponentProps<typeof BaseSelect>;

export const Select: React.FC<SelectProps> = (props) => {
  const { children, label, labelProps, className, ...rest } = props;
  const labelId = useId();

  return (
    <FormControl className={className}>
      <InputLabel id={labelId} {...labelProps}>
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
