import { style } from "@vanilla-extract/css";

// ============================================================================
// Design Tokens (Eliminate Magic Numbers)
// ============================================================================

const designTokens = {
  // Spacing tokens
  spacing: {
    xs: '4px',
    sm: '8px', 
    md: '10px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
  },
  // Color tokens
  colors: {
    surface: '#1a1a1a',
    primary: '#b5e853',
    text: {
      primary: '#ffffff',
      secondary: '#ccc',
      muted: '#888',
    },
  },
  // Border radius tokens
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  // Shadow tokens
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  // Typography tokens
  typography: {
    fontFamily: {
      mono: "'IBM Plex Mono', Consolas, Monaco, monospace",
      sans: "'Space Grotesk', sans-serif",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
    },
  },
  // Responsive breakpoints
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },
  // Responsive spacing
  responsiveSpacing: {
    container: {
      mobile: '16px',
      tablet: '24px', 
      desktop: '32px',
    },
  },
} as const;

// Media query helpers
const mediaQueries = {
  mobile: `screen and (max-width: ${designTokens.breakpoints.mobile})`,
  tablet: `screen and (max-width: ${designTokens.breakpoints.tablet})`,
  desktop: `screen and (min-width: ${designTokens.breakpoints.desktop})`,
};

export const container = style({
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: designTokens.responsiveSpacing.container.tablet,
  '@media': {
    [mediaQueries.mobile]: {
      padding: designTokens.responsiveSpacing.container.mobile,
    },
    [mediaQueries.desktop]: {
      padding: designTokens.responsiveSpacing.container.desktop,
    },
  },
});

export const wordCloud = style({
  backgroundColor: designTokens.colors.surface,
  borderRadius: designTokens.borderRadius.md,
  padding: designTokens.spacing.xl,
  boxShadow: designTokens.shadows.md,
  width: '100%',
  maxWidth: '900px',
  '@media': {
    [mediaQueries.mobile]: {
      padding: designTokens.spacing.lg,
    },
  },
});

export const word = style({
  cursor: 'pointer',
  fontFamily: designTokens.typography.fontFamily.mono,
});

export const legend = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: designTokens.spacing.lg,
  justifyContent: 'center',
  marginBottom: designTokens.spacing.xl,
  padding: designTokens.spacing.md,
  backgroundColor: designTokens.colors.surface,
  borderRadius: designTokens.borderRadius.md,
  width: '100%',
  '@media': {
    [mediaQueries.mobile]: {
      gap: designTokens.spacing.sm,
      padding: designTokens.spacing.sm,
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
});

export const legendTitle = style({
  fontWeight: 'bold',
  color: designTokens.colors.primary,
  marginRight: designTokens.spacing.md,
  fontFamily: designTokens.typography.fontFamily.sans,
});

export const legendItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: designTokens.spacing.sm,
});

export const legendColor = style({
  width: designTokens.spacing.lg,
  height: designTokens.spacing.lg,
  borderRadius: '50%',
});

export const legendText = style({
  fontSize: designTokens.typography.fontSize.sm,
  color: designTokens.colors.primary,
  fontFamily: designTokens.typography.fontFamily.sans,
});

// Tooltip styles with monospace font
export const tooltip = style({
  fontFamily: designTokens.typography.fontFamily.mono,
  lineHeight: '1.5',
});

export const tooltipHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: designTokens.spacing.lg,
  borderBottom: '1px solid #333',
  paddingBottom: designTokens.spacing.sm,
});

export const tooltipTitle = style({
  fontSize: designTokens.typography.fontSize.md,
  fontWeight: 'bold',
  color: designTokens.colors.primary,
});

export const tooltipCategory = style({
  fontSize: designTokens.typography.fontSize.xs,
  color: designTokens.colors.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const tooltipDefinition = style({
  marginBottom: designTokens.spacing.lg,
  color: designTokens.colors.text.primary,
  fontSize: designTokens.typography.fontSize.sm,
});

export const tooltipExamples = style({
  marginTop: designTokens.spacing.lg,
  paddingTop: designTokens.spacing.sm,
  borderTop: '1px solid #333',
});

export const tooltipExamplesTitle = style({
  fontSize: designTokens.typography.fontSize.xs,
  color: designTokens.colors.primary,
  fontWeight: 'bold',
  marginBottom: '6px',
});

export const tooltipExamplesList = style({
  margin: 0,
  paddingLeft: designTokens.spacing.lg,
  color: designTokens.colors.text.secondary,
  fontSize: designTokens.typography.fontSize.xs,
});

// Loading and error state styles
export const loading = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  color: designTokens.colors.primary,
  fontSize: designTokens.typography.fontSize.lg,
  fontFamily: designTokens.typography.fontFamily.sans,
});

export const error = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  color: '#ff4444',
  fontSize: designTokens.typography.fontSize.md,
  fontFamily: designTokens.typography.fontFamily.sans,
  gap: designTokens.spacing.lg,
});