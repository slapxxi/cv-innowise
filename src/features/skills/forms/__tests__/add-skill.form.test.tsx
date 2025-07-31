import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCreateProfileSkill, useSkills, useUser } from '~/features';
import { AddSkillForm } from '../add-skill.form';

jest.mock('~/features');

const mockUseSkills = useSkills as jest.Mock;
const mockUseUser = useUser as jest.Mock;
const mockUseCreateProfileSkill = useCreateProfileSkill as jest.Mock;

describe('AddSkillForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSkills.mockReturnValue({
      skills: [
        { id: 'skill1', name: 'Skill One', category: { id: '1', name: 'Category One' } },
        { id: 'skill2', name: 'Skill Two', category: { id: '2', name: 'Category Two' } },
      ],
    });
    mockUseUser.mockReturnValue({
      user: {
        profile: {
          skills: [{ id: 'skill1', name: 'Skill One' }],
        },
      },
    });
    mockUseCreateProfileSkill.mockImplementation(({ onSuccess }) => {
      return {
        createProfileSkill: jest.fn((data) => {
          onSuccess();
          return Promise.resolve(data);
        }),
      };
    });
  });

  it('renders filtered skills', () => {
    render(<AddSkillForm onSuccess={jest.fn()} onCancel={jest.fn()} />);

    const options = screen.getAllByRole('combobox');
    expect(options).toHaveLength(2);

    expect(screen.queryByText('Skill One')).toBeNull();
    expect(screen.getByText('Skill Two')).toBeInTheDocument();
  });

  it('calls onSuccess', async () => {
    const onSuccess = jest.fn();
    render(<AddSkillForm onSuccess={onSuccess} onCancel={jest.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('calls onCancel', async () => {
    const onCancel = jest.fn();
    render(<AddSkillForm onSuccess={jest.fn()} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalled();
  });

  it('shows message and cancel button when no skills are left to add', () => {
    mockUseSkills.mockReturnValue({
      skills: [{ name: 'Skill One', category: { id: '1', name: 'Category One' } }],
    });
    mockUseUser.mockReturnValue({
      user: {
        profile: {
          skills: [{ name: 'Skill One' }],
        },
      },
    });

    render(<AddSkillForm onSuccess={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByText('You have already added all skills')).toBeInTheDocument();
    const cancelBtn = screen.getByText('Cancel');
    expect(cancelBtn).toBeInTheDocument();
  });
});
