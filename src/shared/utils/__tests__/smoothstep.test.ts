import { smoothstep } from '../smoothstep.util';

describe('smoothstep', () => {
  it('returns 0 when x is less than edge0', () => {
    expect(smoothstep(0, 1, -0.5)).toBe(0);
  });

  it('returns 1 when x is greater than edge1', () => {
    expect(smoothstep(0, 1, 2)).toBe(1);
  });

  it('returns 0 when x equals edge0', () => {
    expect(smoothstep(0, 1, 0)).toBe(0);
  });

  it('returns 1 when x equals edge1', () => {
    expect(smoothstep(0, 1, 1)).toBe(1);
  });

  it('returns 0.5 when x is exactly halfway between edge0 and edge1', () => {
    const result = smoothstep(0, 1, 0.5);
    expect(result).toBeCloseTo(0.5, 5);
  });

  it('smoothly interpolates between edge0 and edge1', () => {
    const result1 = smoothstep(0, 1, 0.25);
    const result2 = smoothstep(0, 1, 0.75);
    expect(result1).toBeLessThan(0.5);
    expect(result2).toBeGreaterThan(0.5);
  });
});
