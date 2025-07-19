import { Slot } from '@radix-ui/react-slot';
import { cn } from '~/shared';

type TextProps = { asChild?: boolean } & React.HTMLAttributes<HTMLParagraphElement>;

export const Text: React.FC<TextProps> = (props) => {
  const { className, asChild, ...rest } = props;
  const Comp = asChild ? Slot : 'p';
  return <Comp className={cn('font-sans text-base text-neutral-400', className)} {...rest} />;
};
