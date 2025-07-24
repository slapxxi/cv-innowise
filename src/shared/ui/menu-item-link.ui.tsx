import { MenuItem } from '@mui/material';
import { createLink, type LinkComponent } from '@tanstack/react-router';

const CustomLink = createLink(MenuItem);

export const MenuItemLink: LinkComponent<typeof MenuItem> = (props) => {
  return <CustomLink {...props} />;
};
