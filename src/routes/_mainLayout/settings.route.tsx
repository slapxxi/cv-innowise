import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '~/pages/settings';

export const Route = createFileRoute('/_mainLayout/settings')({
  component: SettingsPage,
});
