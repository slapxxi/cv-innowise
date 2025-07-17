import BaseButton from '@mui/material/Button';
import { cn } from '~/shared';
import { cva } from 'class-variance-authority';

const buttonVariants = cva('rounded-full', {
  variants: {
    variant: {
      contained: '',
      text: 'text-gray-600',
    },
  },
  defaultVariants: {
    variant: 'contained',
  },
});

type ButtonProps = { variant?: 'contained' | 'text' } & React.ComponentProps<typeof BaseButton>;

export const Button: React.FC<ButtonProps> = (props) => {
  const { variant = 'contained', className, ...rest } = props;

  return <BaseButton variant={variant} className={cn(buttonVariants({ variant, className }))} {...rest} />;
};
