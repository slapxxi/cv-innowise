import BaseTextField from '@mui/material/TextField';
import { merge } from 'lodash';

type TextFieldProps = {} & React.ComponentProps<typeof BaseTextField>;

export const TextField: React.FC<TextFieldProps> = (props) => {
  const { slotProps, ...rest } = props;

  return (
    <BaseTextField
      slotProps={merge(
        {},
        {
          input: { className: 'rounded-none' },
          htmlInput: { className: 'autofill:shadow-none' },
        },
        slotProps
      )}
      {...rest}
    />
  );
};
