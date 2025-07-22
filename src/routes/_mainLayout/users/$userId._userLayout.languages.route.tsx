import { createFileRoute } from '@tanstack/react-router';
import { Title } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/languages')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Title>Languages</Title>
    </div>
  );
}
