import { Tabs as BaseTabs, Tab as BaseTab } from '@mui/material';

type TabsProps = {} & React.ComponentProps<typeof BaseTabs>;

export const Tabs: React.FC<TabsProps> = (props) => {
  return <BaseTabs {...props} />;
};

type TabProps = {} & React.ComponentProps<typeof BaseTab>;

export const Tab: React.FC<TabProps> = (props) => {
  return <BaseTab className="text-neutral-800 dark:text-white [[data-status=active]]:text-primary" {...props} />;
};
