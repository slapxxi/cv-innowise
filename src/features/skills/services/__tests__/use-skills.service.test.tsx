import { render, screen, waitFor } from 'test-utils';
import { useSkills } from '../use-skills.service'; // Adjust this path
import { Suspense } from 'react';

type Props = {
  q?: string;
  sort?: string;
  order?: string;
};

const TestContainer = (props: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestComponent {...props} />
    </Suspense>
  );
};

const TestComponent = ({ q, sort, order }: Props) => {
  // @ts-ignore
  const { skills } = useSkills({ q, sort, order });

  return (
    <>
      <ul>
        {skills.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
    </>
  );
};

describe('useSkills', () => {
  it('fetches and returns skills', async () => {
    render(<TestContainer />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('listitem').length).toEqual(3);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('searches by query string', async () => {
    render(<TestContainer q="Java" />);

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('listitem').length).toEqual(1);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('sorts by name descending', async () => {
    render(<TestContainer sort="name" order="desc" />);

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    const listItems = screen.getAllByRole('listitem');

    expect(listItems[0]).toHaveTextContent('TypeScript');
    expect(listItems[1]).toHaveTextContent('React');
    expect(listItems[2]).toHaveTextContent('JavaScript');
  });
});
