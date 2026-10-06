import { describe, expect, it } from 'vitest';
import { MAX_GRID_SIZE, MIN_GRID_SIZE, parseGridSize } from './grid-controls';

describe('parseGridSize', () => {
  it.each([
    ['60', 60],
    [String(MIN_GRID_SIZE), MIN_GRID_SIZE],
    [String(MAX_GRID_SIZE), MAX_GRID_SIZE],
  ])('accepts "%s"', (text, expected) => {
    expect(parseGridSize(text)).toBe(expected);
  });

  it.each([
    '',
    'abc',
    '12.5',
    String(MIN_GRID_SIZE - 1),
    String(MAX_GRID_SIZE + 1),
    '-10',
  ])('rejects "%s"', (text) => {
    expect(parseGridSize(text)).toBeNull();
  });
});
