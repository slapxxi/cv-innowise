import { screen, render } from 'test-utils';
import { OptionalLabel } from '../optional-label.ui';

describe('OptionalLabel', () => {
  it('renders children when provided', () => {
    render(
      <OptionalLabel>
        <span>Custom content</span>
      </OptionalLabel>
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('renders text prop when children not provided', () => {
    render(<OptionalLabel text="Label text" />);
    expect(screen.getByText('Label text')).toBeInTheDocument();
  });

  it('renders default translation when neither children nor text are provided', () => {
    render(<OptionalLabel />);
    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });
});
