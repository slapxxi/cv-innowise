import { IconButton } from '@mui/material';
import { createLink, type LinkComponent } from '@tanstack/react-router';

const CustomLink = createLink(IconButton);

export const IconButtonLink: LinkComponent<typeof IconButton> = (props) => {
  return <CustomLink {...props} />;
};
