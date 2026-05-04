import type { CSSProperties } from '@vanilla-extract/css';

export const applyStyleProp =
  <P extends keyof CSSProperties>(prop: P, value: CSSProperties[P]) =>
  (rulesToApply: CSSProperties): CSSProperties => ({
    ...rulesToApply,
    [prop]: value,
  });

export const composeStyleProps =
  (styles: CSSProperties) =>
  (rulesToApply: CSSProperties): CSSProperties => ({
    ...rulesToApply,
    ...styles,
  });

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('should apply a single style property using applyStyleProp', () => {
    const result = applyStyleProp(
      'color',
      'red'
    )({
      backgroundColor: 'blue',
    });

    const expectedOutput = {
      backgroundColor: 'blue',
      color: 'red',
    };

    expect(result).toEqual(expectedOutput);
  });

  it('should compose multiple style properties using composeStyleProps', () => {
    const result = composeStyleProps({
      color: 'red',
      padding: '10px',
      ':hover': {
        color: 'blue',
      },
    })({
      backgroundColor: 'yellow',
      margin: '5px',
    });

    const expectedOutput = {
      backgroundColor: 'yellow',
      margin: '5px',
      color: 'red',
      padding: '10px',
      ':hover': {
        color: 'blue',
      },
    };

    expect(result).toEqual(expectedOutput);
  });

  it('should handle an empty styles object in composeStyleProps', () => {
    const result = composeStyleProps({})({
      backgroundColor: 'green',
    });

    const expectedOutput = {
      backgroundColor: 'green',
    };

    expect(result).toEqual(expectedOutput);
  });
}