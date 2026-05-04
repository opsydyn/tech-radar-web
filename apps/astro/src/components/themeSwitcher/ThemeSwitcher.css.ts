// ThemeSwitcherStyles.css.ts
import { style } from '@vanilla-extract/css';

const breakpoint = "768px";

export const themeButtons = style({
  position: 'fixed',
  top: '1rem',
  right: '0.5rem',
  display: 'flex',
  gap: '0.8rem',
  padding: '0.6rem 0.5rem',
  alignItems: 'center',
  background: 'rgba(30, 30, 30, 0.85)',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(100, 100, 255, 0.2)',
  zIndex: 200, // Higher z-index than the sticky navigation (100)
});

export const themeBtn = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.2rem',
  borderRadius: '0.4rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
  ':hover': {
    background: 'rgba(255,255,255,0.08)',
  },
  ':focus': {
    outline: '2px solid #05d9e8',
  },
});

export const themeIcon = style({
  width: '22px',
  height: '22px',
  fill: '#fff',
  stroke: '#fff',
  display: 'block',
  pointerEvents: 'none',
});

export const desktopSwitchers = style({
  position: 'absolute',
  top: '0.5rem',
  right: '0.6rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '0.1rem 0',
  zIndex: 200, // Higher z-index than the sticky navigation (100)
  "@media": {
    [`(max-width: ${breakpoint})`]: {
      display: "none",
    },
  },
});
