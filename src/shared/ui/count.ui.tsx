import { cva } from 'class-variance-authority';

const countVariants = cva(
  'inline-flex size-5 items-center justify-center rounded-full bg-white text-xs leading-none text-primary',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type CountProps = { value: number; variant?: 'default'; className?: string };

export const Count: React.FC<CountProps> = (props) => {
  const { value, variant, className } = props;

  return <div className={countVariants({ className, variant })}>{value}</div>;
};
