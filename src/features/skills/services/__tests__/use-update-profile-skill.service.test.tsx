import { userEvent } from '@testing-library/user-event';
import { graphql, HttpResponse } from 'msw';
import { render, screen, waitFor } from 'test-utils';
import { server } from '~/../mocks/server';
import type { Mastery } from '~/shared/types';
import { useUpdateProfileSkill } from '../use-update-profile-skill.service';

const testSkill = {
  userId: '1',
  name: 'JavaScript',
  categoryId: 'frontend',
  mastery: 'Novice' as Mastery,
};

const TestContainer = ({
  skill,
  onSuccess,
  onError,
}: {
  skill: typeof testSkill;
  onSuccess?: jest.Mock;
  onError?: jest.Mock;
}) => {
  const { updateProfileSkill, error } = useUpdateProfileSkill({
    onSuccess: (data) => onSuccess?.(data),
    onError: (data) => onError?.(data),
  });

  const handleClick = () => {
    updateProfileSkill({ userId: skill.userId, skill: skill });
  };

  return (
    <div>
      <button onClick={handleClick}>Confirm</button>
      {error?.message}
    </div>
  );
};

describe('useUpdateProfileSkill', () => {
  it('calls on success with the result', async () => {
    const fn = jest.fn();
    render(<TestContainer skill={testSkill} onSuccess={fn} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(fn).toHaveBeenCalledWith(
        expect.objectContaining({ skills: [{ categoryId: 'frontend', name: 'JavaScript', mastery: 'Novice' }] })
      );
    });
  });

  it('calls on error with the result', async () => {
    server.use(graphql.mutation('UpdateProfileSkill', ({}) => HttpResponse.error()));

    const fn = jest.fn();
    render(<TestContainer skill={testSkill} onError={fn} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(screen.getByText('Updating profile skill "JavaScript" failed')).toBeInTheDocument();
      expect(fn).toHaveBeenCalledWith({ message: 'Updating profile skill "JavaScript" failed' });
    });
  });
});
