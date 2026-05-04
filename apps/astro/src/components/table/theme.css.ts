import {
  createTheme,
  createGlobalTheme,
  keyframes
} from '@vanilla-extract/css';

const colors = {
  accentYellow: '#312C10',
  brandPrimary: '#11382b',
  brandIgnite: '#51F58D',
  sentimentHigh: '#8bf8b0',
  sentimentVeryHigh: '#319355',
  sentimentLow: '#ff8f89',
  lightGrey100: '#eeeeee',
  lightGreyHover100: 'rgba(0, 0, 0, 0.1)',
  backgroundNeutral: '#F8F9F9',
  contentPrimary: '#050F0C',
  backgroundWhite: '#FFF',
  contentWhite: '#FFF',
  textBlack: '#000'
};

const baseFontSize = 16;

export const fontSize = createGlobalTheme(':root', {
  small: `${12 / baseFontSize}rem`,
  base: `${14 / baseFontSize}rem`,
  medium: `${16 / baseFontSize}rem`,
  large: `${18 / baseFontSize}rem`
});

export const fontStack =  'monospace';

export const transitions = {
  duration: '250ms',
  easing: 'ease-in-out'
};

export const fadeIn = keyframes({
  '0%': { opacity: 0.5 },
  '100%': { opacity: 1 }
});

export const [themeClass, themeVars] = createTheme({
  backgroundColors: {
    primary: colors.contentPrimary
  },
  textColors: {
    default: colors.textBlack
  },
  radius: {
    round: '100px',
    radiusMedium: '16px'
  },
  spaces: {
    auto: 'auto',
    '0': '0',
    '4': '4px',
    '8': '8px',
    '12': '12px',
    '16': '16px'
  }
});
