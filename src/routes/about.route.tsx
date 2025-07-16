import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '~/pages';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});
