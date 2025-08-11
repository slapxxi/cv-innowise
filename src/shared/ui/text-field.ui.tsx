import BaseTextField from '@mui/material/TextField';
import { merge } from 'lodash';

type TextFieldProps = { animate?: boolean } & React.ComponentProps<typeof BaseTextField>;

export const TextField: React.FC<TextFieldProps> = (props) => {
  const { slotProps, animate = true, ...rest } = props;

  return (
    <BaseTextField
      slotProps={merge(
        {},
        {
          input: { className: 'rounded-none' },
          htmlInput: { className: 'autofill:shadow-none' },
          inputLabel: animate ? {} : { className: 'transition-none' },
        },
        slotProps
      )}
      {...rest}
    />
  );
};
