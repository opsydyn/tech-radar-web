import { style, keyframes } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
});

export const dropdown = style({
  position: 'relative',
  display: 'inline-block',
});

export const button = style({
  background: '#222',
  color: '#aaa',
  border: '1px solid #333',
  padding: '0.6rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease',
});

export const buttonHover = style({
  borderColor: 'var(--quadrant-color-solid)',
  color: '#fff',
});

export const content = style({
  position: 'absolute',
  right: 0,
  top: '100%',
  marginTop: '0.5rem',
  background: '#222',
  minWidth: '180px',
  borderRadius: '4px',
  border: '1px solid #333',
  zIndex: 100,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  display: 'none',
});

export const contentVisible = style({
  display: 'block',
});

export const item = style({
  color: '#aaa',
  padding: '0.75rem 1rem',
  textDecoration: 'none',
  display: 'block',
  cursor: 'pointer',
  borderBottom: '1px solid #333',
  transition: 'all 0.2s ease',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '0.9rem',
});

export const itemHover = style({
  background: '#333',
  color: '#fff',
});

export const itemActive = style({
  color: 'var(--quadrant-color-solid)',
  background: '#1a1a1a',
});

export const error = style({
  color: 'red', 
  marginTop: '0.5rem', 
  fontSize: '0.8rem',
  backgroundColor: 'rgba(255, 0, 0, 0.1)',
  padding: '8px',
  borderRadius: '4px',
  maxWidth: '300px'
});

export const chevron = style({
  transition: 'transform 0.2s ease',
});

export const chevronOpen = style({
  transform: 'rotate(180deg)',
});
