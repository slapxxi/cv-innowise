import { cn } from '~/shared';

type HighlightProps = { value?: string | null; children?: React.ReactNode; className?: string };

export const Highlight: React.FC<HighlightProps> = (props) => {
  const { value, children, className } = props;

  if (value) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: value }}
        className={cn(
          '[&_b]:bg-yellow-400 [&_b]:text-black [&_b]:p-0.5 [&_b]:rounded-xs [&_b]:dark:text-black',
          className
        )}
      />
    );
  }

  return children;
};
