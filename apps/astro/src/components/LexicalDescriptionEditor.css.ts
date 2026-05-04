import { style } from '@vanilla-extract/css';

export const editorRoot = style({
  width: '100%',
  minHeight: '2.5em',
  position: 'relative',
});

export const viewMode = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5em',
  cursor: 'pointer',
  padding: '0.5em 0',
  borderRadius: '6px',
  selectors: {
    '&:hover': {
      background: 'rgba(0,255,255,0.07)',
      boxShadow: '0 0 0 2px #00fff7',
    },
  },
});

export const editMode = style({
  background: '#fff', 
  color: '#232323', 
  border: '1.5px solid #00fff7', 
  borderRadius: '8px',
  padding: '1em',
  boxShadow: '0 2px 8px #00fff733',
});

export const iconButton = style({
  background: 'none',
  border: 'none',
  color: '#00fff7',
  fontSize: '1.1em',
  cursor: 'pointer',
  marginLeft: '0.25em',
  ':hover': {
    color: '#fff',
  },
});

export const utilButton = style({
  background: '#181a1b',
  color: '#00fff7',
  // border: '1.5px solid #00fff7',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '1em',
  borderRadius: '6px',
  padding: '0.4em 1.2em',
  margin: '0 0.25em',
  cursor: 'pointer',
  // transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
  // boxShadow: '0 0 8px #00fff733',
  ':hover': {
    background: '#00fff7',
    color: '#181a1b',
    // boxShadow: '0 0 8px #00fff7, 0 0 16px #00fff7',
  },
  ':focus': {
    // outline: '2px solid #00fff7',
    outlineOffset: '2px',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});
