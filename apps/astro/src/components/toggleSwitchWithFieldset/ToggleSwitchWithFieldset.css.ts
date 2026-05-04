import { style } from '@vanilla-extract/css';

export const toggleControlWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end'
  // '@media': {
  //   'screen and (min-width: 600px)': {
  //     display: 'none'
  //   }
  // }
});
