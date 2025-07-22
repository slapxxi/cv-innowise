import { createLink, type LinkComponent } from '@tanstack/react-router';
import { Tab } from '@mui/material';

const CustomLink = createLink(Tab);

export const TabLink: LinkComponent<typeof Tab> = (props) => {
  return <CustomLink className="text-neutral-800 dark:text-white [[data-status=active]]:text-primary" {...props} />;
};
