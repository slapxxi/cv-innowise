import { lerp } from '../lerp.util';

describe('lerp', () => {
  it('returns a when t = 0', () => {
    expect(lerp(10, 20, 0)).toBe(10);
  });

  it('returns b when t = 1', () => {
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it('returns midpoint when t = 0.5', () => {
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  it('works with negative numbers', () => {
    expect(lerp(-10, 10, 0.25)).toBe(-5);
  });

  it('works when a > b', () => {
    expect(lerp(20, 10, 0.5)).toBe(15);
  });

  it('supports extrapolation when t < 0', () => {
    expect(lerp(10, 20, -1)).toBe(0);
  });

  it('supports extrapolation when t > 1', () => {
    expect(lerp(10, 20, 2)).toBe(30);
  });

  it('handles zero range (a = b)', () => {
    expect(lerp(5, 5, 0.75)).toBe(5);
  });

  it('handles small decimals correctly', () => {
    expect(lerp(0.1, 0.3, 0.5)).toBeCloseTo(0.2, 5);
  });
});
