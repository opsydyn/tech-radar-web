import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';
import { themeVars } from './theme.css';

export const spaceProperties = defineProperties({
  properties: {
    margin: themeVars.spaces,
    marginTop: themeVars.spaces,
    marginRight: themeVars.spaces,
    marginBottom: themeVars.spaces,
    marginLeft: themeVars.spaces,
    padding: themeVars.spaces,
    paddingTop: themeVars.spaces,
    paddingRight: themeVars.spaces,
    paddingBottom: themeVars.spaces,
    paddingLeft: themeVars.spaces
  },
  shorthands: {
    m: ['margin'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    p: ['padding'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom']
  }
});

export const colorProperties = defineProperties({
  properties: {
    backgroundColor: themeVars.backgroundColors,
    color: themeVars.textColors
  }
});

export const sprinkles = createSprinkles(spaceProperties, colorProperties);

export type Sprinkles = Parameters<typeof sprinkles>[0];
