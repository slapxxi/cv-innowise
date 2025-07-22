import { createFileRoute } from '@tanstack/react-router';
import { Title } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/skills')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Title>Skills</Title>
    </div>
  );
}
