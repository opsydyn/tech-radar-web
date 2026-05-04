/**
 * EditionSwitcher Styles
 *
 * Functional composition for edition selector UI
 */

import { style } from "@vanilla-extract/css";

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 8px',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderRadius: '6px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

export const label = style({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.8)',
  whiteSpace: 'nowrap',
  userSelect: 'none',
});

export const select = style({
  padding: '6px 12px',
  fontSize: '0.875rem',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '4px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'rgba(255, 255, 255, 0.95)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none',
  minWidth: '200px',

  ':hover': {
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  ':focus': {
    borderColor: 'rgba(100, 200, 255, 0.8)',
    boxShadow: '0 0 0 3px rgba(100, 200, 255, 0.2)',
  },

  // Style the dropdown arrow
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.8)' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  paddingRight: '32px',
  appearance: 'none',
});

export const dateDisplay = style({
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.6)',
  fontStyle: 'italic',
  whiteSpace: 'nowrap',
  paddingLeft: '8px',
  borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
});
