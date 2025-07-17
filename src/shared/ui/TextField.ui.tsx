import BaseTextField from '@mui/material/TextField';

type TextFieldProps = {} & React.ComponentProps<typeof BaseTextField>;

export const TextField: React.FC<TextFieldProps> = (props) => {
  return <BaseTextField slotProps={{ input: { className: 'rounded-none' } }} {...props} />;
};
