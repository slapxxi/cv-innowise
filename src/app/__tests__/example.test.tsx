import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function Component(props: any) {
  const { onClick } = props;
  return <button onClick={onClick}>click me</button>;
}

test('works', async () => {
  const fn = jest.fn();
  render(<Component onClick={fn} />);
  await userEvent.click(screen.getByText('click me'));
  expect(fn).toHaveBeenCalledTimes(1);
});
