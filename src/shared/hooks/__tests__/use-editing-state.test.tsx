import { render, screen, fireEvent } from '@testing-library/react';
import { useEditingState } from '../use-editing-state.hook';

function EditingStateTester() {
  const { state, add, update, del, cancel } = useEditingState<string>();

  return (
    <div>
      <div data-testid="status">{state.status}</div>
      <div data-testid="context">{state.context ?? 'no-context'}</div>
      <button onClick={() => add()}>Add</button>
      <button onClick={() => update('ctx-updated')}>Update</button>
      <button onClick={() => del('ctx-deleted')}>Delete</button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
}

describe('useEditingState', () => {
  it('starts with idle status and no context', () => {
    render(<EditingStateTester />);

    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('context')).toHaveTextContent('no-context');
  });

  it.only('sets status to adding on add()', () => {
    render(<EditingStateTester />);

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByTestId('status')).toHaveTextContent('adding');
    expect(screen.getByTestId('context')).toHaveTextContent('no-context');
  });

  it('sets status to updating and context on update()', () => {
    render(<EditingStateTester />);

    fireEvent.click(screen.getByText('Update'));

    expect(screen.getByTestId('status')).toHaveTextContent('updating');
    expect(screen.getByTestId('context')).toHaveTextContent('ctx-updated');
  });

  it('sets status to deleting and context on del()', () => {
    render(<EditingStateTester />);

    fireEvent.click(screen.getByText('Delete'));

    expect(screen.getByTestId('status')).toHaveTextContent('deleting');
    expect(screen.getByTestId('context')).toHaveTextContent('ctx-deleted');
  });

  it('resets status to idle on cancel()', () => {
    render(<EditingStateTester />);

    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('status')).toHaveTextContent('adding');

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByTestId('status')).toHaveTextContent('idle');
  });

  it('does not change state if action is invalid for current status', () => {
    render(<EditingStateTester />);

    fireEvent.click(screen.getByText('Update'));
    expect(screen.getByTestId('status')).toHaveTextContent('updating');

    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('status')).toHaveTextContent('updating');
  });
});
