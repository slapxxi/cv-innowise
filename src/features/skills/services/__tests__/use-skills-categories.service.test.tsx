import { render, screen, waitFor } from 'test-utils';
import { useSkillCategories } from '../use-skills-categories.service'; // Adjust this path
import { Suspense } from 'react';

type Props = {};

const TestContainer = (props: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestComponent {...props} />
    </Suspense>
  );
};

const TestComponent = ({}: Props) => {
  const { categories } = useSkillCategories();

  return (
    <>
      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </>
  );
};

describe('useSkillCategories', () => {
  it('fetches and returns skill categories', async () => {
    render(<TestContainer />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('listitem').length).toEqual(3);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
  });
});
