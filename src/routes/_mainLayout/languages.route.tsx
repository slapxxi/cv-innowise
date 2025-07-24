import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/languages')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>languages</div>;
}
