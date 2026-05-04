import type { CSSProperties } from '@vanilla-extract/css';
import { applyStyleProp } from './utils';

type ZIndexName = 
  | 'background'
  | 'base'
  | 'low'
  | 'belowMiddle'
  | 'middle'
  | 'aboveMiddle'
  | 'high'
  | 'belowTop'
  | 'top'
  | 'overlay';

const zIndexValues: Record<ZIndexName, number> = {
  background: -10,
  base: 0,
  low: 10,
  belowMiddle: 50,
  middle: 100,
  aboveMiddle: 150,
  high: 200,
  belowTop: 500,
  top: 1000,
  overlay: 9999,
};

export const zIndex = zIndexValues;

export const applyZIndex = (zIndexName: ZIndexName) =>
  applyStyleProp('zIndex', zIndexValues[zIndexName]);

// Convenience functions for common z-index values
export const asBackground = applyZIndex('background');
export const asBase = applyZIndex('base');
export const asLow = applyZIndex('low');
export const asBelowMiddle = applyZIndex('belowMiddle');
export const asMiddle = applyZIndex('middle');
export const asAboveMiddle = applyZIndex('aboveMiddle');
export const asHigh = applyZIndex('high');
export const asBelowTop = applyZIndex('belowTop');
export const asTop = applyZIndex('top');
export const asOverlay = applyZIndex('overlay');

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('should apply the specified z-index value to the given rules', () => {
    const result = applyZIndex('middle')({
      position: 'absolute',
      top: '10px',
      left: '20px',
    } as CSSProperties);

    const expectedOutput = {
      position: 'absolute',
      top: '10px',
      left: '20px',
      zIndex: 100,
    };

    expect(result).toEqual(expectedOutput);
  });

  it('should handle an undefined z-index name gracefully', () => {
    const result = applyZIndex(undefined as unknown as ZIndexName)({
      position: 'relative',
    } as CSSProperties);

    const expectedOutput = {
      position: 'relative',
      zIndex: undefined,
    };

    expect(result).toEqual(expectedOutput);
  });

  it('should apply convenience functions correctly', () => {
    const result = asOverlay({
      position: 'fixed',
    } as CSSProperties);

    const expectedOutput = {
      position: 'fixed',
      zIndex: 9999,
    };

    expect(result).toEqual(expectedOutput);
  });
}