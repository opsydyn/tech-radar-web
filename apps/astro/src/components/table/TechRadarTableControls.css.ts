import { style, createVar, keyframes } from '@vanilla-extract/css';

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
  contentWhite: '#FFF'
};

const toggleState = createVar();

const fadeIn = keyframes({
  '0%': { opacity: 0.5 },
  '100%': { opacity: 1 }
});

const buttonBase = style({
  cursor: 'pointer',
  ':focus': {
    outline: `2px solid ${colors.brandPrimary}`,
    outlineOffset: '2px'
  }
});

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  opacity: 1,
  animation: `${fadeIn} 13000ms ease in`,
  '@media': {
    'screen and (min-width: 600px)': {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }
});

export const toggleGroup = style({
  display: 'flex'
});

export const toggleButton = style([
  buttonBase,
  {
    vars: {
      [toggleState]: 'none'
    },
    backgroundColor: colors.backgroundNeutral,
    color: colors.brandIgnite,
    selectors: {
      '&[aria-pressed="true"]': {
        vars: {
          [toggleState]: 'inline'
        },
        backgroundColor: colors.brandPrimary,
        color: 'white',
        opacity: 1,
        animation: `${fadeIn} 3000ms ease in`
      }
    }
  }
]);

export const filterControls = style({
  display: 'flex'
});
