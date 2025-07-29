import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

type TextProps = {
  asChild?: boolean;
  variant?: 'light' | 'normal' | 'success';
} & React.HTMLAttributes<HTMLParagraphElement>;

const textVariants = cva('font-sans text-base', {
  variants: {
    variant: {
      light: 'text-neutral-500',
      normal: 'text-neutral-900 dark:text-white',
      success: 'text-green-700 text-sm',
    },
  },
  defaultVariants: {
    variant: 'normal',
  },
});

export const Text: React.FC<TextProps> = (props) => {
  const { className, asChild, variant, ...rest } = props;
  const Comp = asChild ? Slot : 'p';

  return <Comp className={textVariants({ variant, className })} {...rest} />;
};
