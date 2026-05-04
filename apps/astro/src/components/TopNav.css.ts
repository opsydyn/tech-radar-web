import { style, keyframes, globalStyle } from "@vanilla-extract/css";

// Cyberpunk theme colors - reusing the same theme from QuadrantNav
const theme = {
  neonPink: '#ff2a6d',
  neonBlue: '#05d9e8',
  neonPurple: '#7700ff',
  neonGreen: '#39ff14',
  darkBg: '#1a1a1a',
  darkBgAlt: '#2d2d2d',
  glowPink: '0 0 10px #ff2a6d, 0 0 20px #ff2a6d',
  glowBlue: '0 0 10px #05d9e8, 0 0 20px #05d9e8',
  glowPurple: '0 0 10px #7700ff, 0 0 20px #7700ff',
  glowGreen: '0 0 10px #39ff14, 0 0 20px #39ff14',
};

// Animation for text glitch effect
const glitch = keyframes({
  '0%': { textShadow: theme.glowBlue },
  '33%': { textShadow: theme.glowPink },
  '66%': { textShadow: theme.glowPurple },
  '100%': { textShadow: theme.glowBlue },
});

// Animation for scanline effect
const scanline = keyframes({
  '0%': { transform: 'translateY(-100%)' },
  '100%': { transform: 'translateY(100%)' }
});

export const breakPoints = {
  mobile: "only screen and (max-width: 600px)",
  tablet: "only screen and (min-width: 601px) and (max-width: 900px)",
  desktop: "only screen and (min-width: 901px)",
};

export const topNav = style({
  width: "100%",
  height: "60px",
  background: theme.darkBg,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 1.5rem",
  position: 'relative',
  overflow: 'hidden',
  borderBottom: `1px solid ${theme.neonBlue}`,
  "::before": {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'linear-gradient(transparent 50%, rgba(5, 217, 232, 0.025) 50%)',
    backgroundSize: '100% 4px',
    animation: `${scanline} 4s linear infinite`,
    pointerEvents: 'none',
  },
  "@media": {
    [breakPoints.mobile]: {
      height: "auto",
      padding: "0.75rem",
      flexDirection: "column",
      gap: "0.5rem",
    },
  },
});

export const logoSection = style({
  display: "flex",
  alignItems: "center",
});

export const headingOne = style({
  fontSize: "1.5rem",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "2px",
  color: theme.neonBlue,
  fontFamily: "monospace",
  animation: `${glitch} 3s infinite alternate`,
  margin: 0,
  "@media": {
    [breakPoints.mobile]: {
      fontSize: "1.25rem",
    },
  },
});

export const navLinks = style({
  display: "flex",
  gap: "1.5rem",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  "@media": {
    [breakPoints.mobile]: {
      width: "100%",
      justifyContent: "space-between",
      gap: "0.5rem",
    },
  },
});

export const navLink = style({
  textDecoration: "none",
  fontSize: "0.9rem",
  fontWeight: "600",
  letterSpacing: "1px",
  fontFamily: "monospace",
  padding: "0.5rem 0.75rem",
  borderRadius: "4px",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  border: "1px solid transparent",
  "@media": {
    [breakPoints.mobile]: {
      fontSize: "0.8rem",
      padding: "0.4rem 0.5rem",
    },
  },
  ":hover": {
    transform: "translateY(-2px)",
  }
});

export const chevron = style({
  display: "inline-block",
  width: "6px",
  height: "6px",
  borderTop: `2px solid ${theme.neonBlue}`,
  borderRight: `2px solid ${theme.neonBlue}`,
  transform: "rotate(45deg)",
  transition: "border-color 0.3s ease"
});

export const toolsLink = style({
  color: theme.neonPink,
  ":hover": {
    backgroundColor: theme.darkBgAlt,
    border: `1px solid ${theme.neonPink}`,
    boxShadow: theme.glowPink,
  }
});

globalStyle(`${toolsLink}:hover span`, {
  borderColor: theme.neonPink
});

export const techniquesLink = style({
  color: theme.neonPurple,
  ":hover": {
    backgroundColor: theme.darkBgAlt,
    border: `1px solid ${theme.neonPurple}`,
    boxShadow: theme.glowPurple,
  }
});

globalStyle(`${techniquesLink}:hover span`, {
  borderColor: theme.neonPurple
});

export const platformsLink = style({
  color: theme.neonBlue,
  ":hover": {
    backgroundColor: theme.darkBgAlt,
    border: `1px solid ${theme.neonBlue}`,
    boxShadow: theme.glowBlue,
  }
});

globalStyle(`${platformsLink}:hover span`, {
  borderColor: theme.neonBlue
});

export const languagesLink = style({
  color: theme.neonGreen,
  ":hover": {
    backgroundColor: theme.darkBgAlt,
    border: `1px solid ${theme.neonGreen}`,
    boxShadow: theme.glowGreen,
  }
});

globalStyle(`${languagesLink}:hover span`, {
  borderColor: theme.neonGreen
});
