import { style } from '@vanilla-extract/css';
import { vars } from '../styles/cyberpunk.css';

// Search container styles
export const searchContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto 1.5rem auto',
});

// Search input styles
export const searchInput = style({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '0.9rem',
  padding: '0.5rem 0.75rem',
  border: `2px solid ${vars.colors.darkBgAlt}`,
  borderRadius: '4px',
  width: '100%',
  transition: 'all 0.2s ease',
  
  // Dark mode styles (default)
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  
  // Focus styles
  ':focus': {
    outline: 'none',
    borderColor: vars.colors.neonBlue,
    boxShadow: `0 0 0 2px rgba(88, 211, 255, 0.2)`
  },
  
  // Placeholder styles for dark mode
  '::placeholder': {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  
  // Light mode styles
  selectors: {
    '[data-theme="light"] &': {
      backgroundColor: '#f5f5f5',
      color: '#333333',
      border: '2px solid #cccccc',
    },
    // Light mode placeholder
    '[data-theme="light"] &::placeholder': {
      color: 'rgba(0, 0, 0, 0.4)'
    }
  }
});

// Search footer styles
export const searchFooter = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginTop: '0.25rem',
  minHeight: '1.5rem'
});

// Search clear button styles
export const searchClearButton = style({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '0.8rem',
  padding: '0.25rem 0.5rem',
  backgroundColor: vars.colors.darkBgAlt,
  border: 'none',
  borderRadius: '4px',
  color: '#888',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: vars.colors.darkBg,
    color: '#fff'
  }
});

// Search results count styles
export const searchResultsCount = style({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '0.75rem',
  color: '#888',
  padding: '0.25rem 0'
});
