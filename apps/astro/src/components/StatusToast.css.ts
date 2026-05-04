import { style, keyframes } from '@vanilla-extract/css';

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(-10px)' },
  to: { opacity: 1, transform: 'translateY(0)' }
});

const fadeOut = keyframes({
  from: { opacity: 1, transform: 'translateY(0)' },
  to: { opacity: 0, transform: 'translateY(-10px)' }
});

export const toast = style({
  position: 'fixed',
  top: '20px',
  right: '20px',
  backgroundColor: '#4a90e2', // Fallback color
  color: 'white',
  padding: '12px 20px',
  borderRadius: '4px',
  zIndex: 1000,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '14px',
  animation: `${fadeIn} 0.3s ease forwards`,
  transition: 'all 0.3s ease',
});

export const fadeOutAnimation = style({
  animation: `${fadeOut} 0.3s ease forwards`,
});
