import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn, type Prettify } from '~/shared';

type TitleProps = Prettify<
  {
    className?: string;
    children?: React.ReactNode;
    asChild?: boolean;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    size?: 'sm' | 'md' | 'lg';
  } & React.ComponentPropsWithoutRef<'h1'>
>;

type Variants = {
  size: Record<Required<TitleProps>['size'], string>;
};

const titleVariants = cva<Variants>('font-normal leading-none', {
  variants: {
    size: {
      sm: 'text-2xl',
      md: 'text-4xl',
      lg: 'text-6xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Title: React.FC<TitleProps> = (props) => {
  const { className, asChild, level = 1, size, children, ...rest } = props;
  const Comp = asChild ? Slot : `h${level}`;

  return (
    <Comp className={cn(titleVariants({ size, className }))} {...rest}>
      {children}
    </Comp>
  );
};
