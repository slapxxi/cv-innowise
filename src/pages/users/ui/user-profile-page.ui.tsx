import { useParams } from '@tanstack/react-router';
import { UserPage } from '.';
import { useUser } from '../services';

export function UserProfilePage() {
  const { userId } = useParams({ from: '/_mainLayout/users/$userId/_userLayout/profile' });
  const { user } = useUser({ id: userId });

  if (user) {
    return <UserPage user={user} />;
  }
}
