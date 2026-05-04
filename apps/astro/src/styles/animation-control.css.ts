import { globalStyle, keyframes } from '@vanilla-extract/css';

// Define the pulse animation keyframes
export const pulseKeyframes = keyframes({
  '0%': { transform: 'scale(1)', opacity: 0.7 },
  '50%': { transform: 'scale(1.2)', opacity: 0.4 },
  '100%': { transform: 'scale(1)', opacity: 0.7 },
});

// Define a class for the pulse animation
globalStyle('.pulse-animation', {
  animation: `${pulseKeyframes} 2s infinite ease-in-out`,
});

// When animations are disabled, pause only the pulse animation
globalStyle('.animations-disabled .pulse-animation', {
  animationPlayState: 'paused !important',
});

// When animations are enabled, ensure the pulse animation runs
globalStyle('html.animations-enabled .pulse-animation', {
  animationPlayState: 'running !important',
});
