import { createLink, type LinkComponent } from '@tanstack/react-router';
import { Button } from './button.ui';

const CustomLink = createLink(Button);

export const ButtonLink: LinkComponent<typeof Button> = (props) => {
  return <CustomLink {...props} />;
};
