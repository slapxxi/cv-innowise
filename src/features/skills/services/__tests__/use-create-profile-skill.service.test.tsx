import { userEvent } from '@testing-library/user-event';
import { graphql, HttpResponse } from 'msw';
import { render, screen, waitFor } from 'test-utils';
import { server } from '~/../mocks/server';
import { useCreateProfileSkill } from '../use-create-profile-skill.service';

const TestContainer = ({ onSuccess, onError }: { onSuccess?: jest.Mock; onError?: jest.Mock }) => {
  const { createProfileSkill, error } = useCreateProfileSkill({
    onSuccess: (data) => onSuccess?.(data),
    onError: (data) => onError?.(data),
  });

  const handleClick = () => {
    createProfileSkill({ skill: { userId: '1', name: 'JavaScript', categoryId: 'frontend', mastery: 'Novice' } });
  };

  return (
    <div>
      <button onClick={handleClick}>Confirm</button>
      {error?.message}
    </div>
  );
};

describe('useCreateProfileSkill', () => {
  it('calls on success with the result', async () => {
    const fn = jest.fn();
    render(<TestContainer onSuccess={fn} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(fn).toHaveBeenCalledWith(
        expect.objectContaining({ skills: [{ categoryId: 'frontend', name: 'JavaScript', mastery: 'Novice' }] })
      );
    });
  });

  it('calls on error with the result', async () => {
    server.use(graphql.mutation('AddProfileSkill', ({}) => HttpResponse.error()));

    const fn = jest.fn();
    render(<TestContainer onError={fn} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(screen.getByText('Signup failed')).toBeInTheDocument();
      expect(fn).toHaveBeenCalledWith({ message: 'Signup failed' });
    });
  });
});
