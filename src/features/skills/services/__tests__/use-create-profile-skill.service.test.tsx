import { userEvent } from '@testing-library/user-event';
import { render, screen, waitFor } from 'test-utils';
import { useCreateProfileSkill } from '../use-create-profile-skill.service';

const TestContainer = ({ fn }: { fn: jest.Mock }) => {
  const { createProfileSkill, error } = useCreateProfileSkill({ onSuccess: (data) => fn(data) });

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
    render(<TestContainer fn={fn} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(fn).toHaveBeenCalledWith(
        expect.objectContaining({ skills: [{ categoryId: 'frontend', name: 'JavaScript', mastery: 'Novice' }] })
      );
    });
  });
});
