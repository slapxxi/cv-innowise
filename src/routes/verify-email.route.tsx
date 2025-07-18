import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/verify-email')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /verify-email!</div>;
}
