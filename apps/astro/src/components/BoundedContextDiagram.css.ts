import { style } from "@vanilla-extract/css";

export const container = style({
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const diagram = style({
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
});

export const legend = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '30px',
  justifyContent: 'center',
  marginBottom: '20px',
  padding: '10px',
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
});

export const legendSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const legendTitle = style({
  fontWeight: 'bold',
  color: '#b5e853',
  marginBottom: '5px',
  fontFamily: "'Space Grotesk', sans-serif",
});

export const legendItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const legendColor = style({
  width: '12px',
  height: '12px',
  borderRadius: '4px',
});

export const legendLine = style({
  width: '24px',
  height: '2px',
});

export const legendText = style({
  fontSize: '14px',
  color: '#b5e853',
  fontFamily: "'Space Grotesk', sans-serif",
});

export const diagramText = style({
  fontFamily: "'IBM Plex Mono', monospace",
});