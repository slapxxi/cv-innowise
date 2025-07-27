type HighlightProps = { value?: string | null; children?: React.ReactNode };

export const Highlight: React.FC<HighlightProps> = (props) => {
  const { value, children } = props;

  if (value) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: value }}
        className="[&_b]:bg-yellow-400 [&_b]:p-0.5 [&_b]:rounded-xs [&_b]:dark:text-black"
      />
    );
  }

  return children;
};
