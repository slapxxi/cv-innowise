import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/skills')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_mainLayout/languages"!</div>;
}
