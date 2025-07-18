import { createLink } from '@tanstack/react-router';
import { Button } from '~/shared';

const CustomLink = createLink(Button);

type ButtonProps = React.ComponentProps<typeof CustomLink>;

export const ButtonLink: React.FC<ButtonProps> = (props) => {
  return <CustomLink {...props} />;
};
