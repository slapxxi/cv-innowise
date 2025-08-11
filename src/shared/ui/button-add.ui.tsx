import { Add as AddIcon } from '@mui/icons-material';
import { cva } from 'class-variance-authority';
import { Button } from './button.ui';

const buttonVariants = cva('', {
  variants: {
    variant: {
      primary: 'text-primary',
      secondary: 'text-neutral-500',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

type ButtonAddProps = {} & Omit<React.ComponentProps<typeof Button>, 'variant' | 'startIcon'>;

export const ButtonAdd: React.FC<ButtonAddProps> = (props) => {
  return (
    <Button
      variant="text"
      startIcon={<AddIcon />}
      className={buttonVariants({ variant: 'primary', className: props.className })}
      {...props}
    />
  );
};
