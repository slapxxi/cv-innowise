import BaseButton from '@mui/material/Button';
import { cva } from 'class-variance-authority';
import { cn } from '../utils';

const buttonVariants = cva('rounded-full px-6 py-2', {
  variants: {
    variant: {
      contained: 'text-white',
      text: 'text-neutral-500',
      outlined: 'border-primary dark:text-white',
    },
    dangerous: {
      true: 'text-primary hover:bg-primary/10',
    },
  },
  defaultVariants: {
    variant: 'contained',
  },
});

type ButtonProps = { variant?: 'contained' | 'text' | 'outlined'; dangerous?: boolean } & React.ComponentProps<
  typeof BaseButton
>;

export const Button: React.FC<ButtonProps> = (props) => {
  const { variant = 'contained', className, dangerous, ...rest } = props;

  return <BaseButton variant={variant} className={cn(buttonVariants({ variant, className, dangerous }))} {...rest} />;
};
