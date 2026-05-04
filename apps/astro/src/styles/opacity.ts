import type { CSSProperties } from '@vanilla-extract/css';
import { applyStyleProp } from './utils';

type Opacity = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;

export const applyOpacity = (opacity: Opacity) =>
  applyStyleProp('opacity', opacity);

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('should apply the specified opacity to the given rules', () => {
    const result = applyOpacity(0.5)({
      color: 'red',
      backgroundColor: 'blue',
    } as CSSProperties);

    const expectedOutput = {
      color: 'red',
      backgroundColor: 'blue',
      opacity: 0.5,
    };

    expect(result).toEqual(expectedOutput);
  });

  it('should handle an undefined opacity gracefully', () => {
    const result = applyOpacity(undefined as unknown as Opacity)({
      color: 'red',
    } as CSSProperties);

    const expectedOutput = {
      color: 'red',
      opacity: undefined,
    };

    expect(result).toEqual(expectedOutput);
  });
}