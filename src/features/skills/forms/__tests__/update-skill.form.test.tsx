import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useUpdateProfileSkill } from '~/features';
import { type Mastery } from '~/shared';
import { UpdateSkillForm } from '../update-skill.form';

jest.mock('~/features');

const mockUseUpdateProfileSkill = useUpdateProfileSkill as jest.Mock;

describe('UpdateSkillForm', () => {
  const skill = {
    name: 'JavaScript',
    categoryId: 'frontend',
    mastery: 'Novice' as Mastery,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUpdateProfileSkill.mockImplementation(({ onSuccess }) => {
      return {
        updateProfileSkill: jest.fn((data) => {
          onSuccess();
          return Promise.resolve(data);
        }),
      };
    });
  });

  it('renders form with default values', () => {
    const onSuccess = jest.fn();
    const onCancel = jest.fn();
    render(<UpdateSkillForm skill={skill} onSuccess={onSuccess} onCancel={onCancel} />);

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Novice')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('calls onSuccess', async () => {
    const onSuccess = jest.fn();
    const onCancel = jest.fn();
    render(<UpdateSkillForm skill={skill} onSuccess={onSuccess} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onCancel', () => {
    const onSuccess = jest.fn();
    const onCancel = jest.fn();
    render(<UpdateSkillForm skill={skill} onSuccess={onSuccess} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('submits updated skill on Confirm', async () => {
    const onSuccess = jest.fn();
    const onCancel = jest.fn();
    render(<UpdateSkillForm skill={skill} onSuccess={onSuccess} onCancel={onCancel} />);

    fireEvent.mouseDown(screen.getByLabelText('Mastery Level'));
    fireEvent.click(screen.getByText('Expert'));
    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
