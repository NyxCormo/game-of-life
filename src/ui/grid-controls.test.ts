import { describe, expect, it } from 'vitest';
import { parseIntegerInRange } from './grid-controls';

describe('parseIntegerInRange', () => {
  it.each([
    ['60', 60],
    ['3', 3],
    ['300', 300],
  ])('accepts "%s" between 3 and 300', (text, expected) => {
    expect(parseIntegerInRange(text, 3, 300)).toBe(expected);
  });

  it.each(['', 'abc', '12.5', '2', '301', '-10'])(
    'rejects "%s" outside 3 to 300',
    (text) => {
      expect(parseIntegerInRange(text, 3, 300)).toBeNull();
    },
  );

  it('accepts zero when the range starts at zero', () => {
    expect(parseIntegerInRange('0', 0, 50)).toBe(0);
  });
});
