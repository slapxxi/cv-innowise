import { switchOrder } from '../switch-order.util';

describe('switchOrder', () => {
  it('returns "desc" when input is "asc"', () => {
    expect(switchOrder('asc')).toBe('desc');
  });

  it('returns "asc" when input is "desc"', () => {
    expect(switchOrder('desc')).toBe('asc');
  });
});
