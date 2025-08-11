import { Text } from '~/shared';

type PageTitleProps = {} & React.ComponentProps<typeof Text>;

export const PageTitle: React.FC<PageTitleProps> = (props) => {
  const { children } = props;

  return (
    <Text asChild variant="light" {...props}>
      <h2>{children}</h2>
    </Text>
  );
};
