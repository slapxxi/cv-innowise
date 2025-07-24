import { smoothstep } from '../smoothstep.util';

test('smoothstep', () => {
  expect(smoothstep(0, 1, 0)).toBe(0);
  expect(smoothstep(0, 1, 0.5)).toBe(0.5);
  expect(smoothstep(0, 2, 1)).toBe(0.5);
  expect(smoothstep(0, 2, 10)).toBe(1);
});
