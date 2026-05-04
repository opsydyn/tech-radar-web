import { atom } from 'nanostores';

// Type definitions
export type Theme = 'light' | 'dark' | 'machine';
type ButtonId = 'theme-light' | 'theme-dark' | 'theme-machine' | 'theme-light-mob' | 'theme-dark-mob' | 'theme-machine-mob';

// Constants
const THEME_LIGHT: Theme = 'light';
const THEME_DARK: Theme = 'dark';
const THEME_MACHINE: Theme = 'machine';
const PREFER_SCHEME_DARK = '(prefers-color-scheme: dark)';
const DATA_THEME = 'data-theme';
const ACTIVE_CLASS = 'active';

// Button mapping
const BUTTON_THEME_MAP = new Map<ButtonId, Theme>([
  ['theme-light', THEME_LIGHT],
  ['theme-dark', THEME_DARK],
  ['theme-machine', THEME_MACHINE],
  ['theme-light-mob', THEME_LIGHT],
  ['theme-dark-mob', THEME_DARK],
  ['theme-machine-mob', THEME_MACHINE],
]);

// Create the atom with machine as default
export const theme = atom<Theme>(THEME_MACHINE);

// Helper functions
const getSystemPreferTheme = (): Theme => 
  typeof window !== 'undefined' && window.matchMedia(PREFER_SCHEME_DARK).matches 
    ? THEME_DARK 
    : THEME_LIGHT;

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return theme.get();
  return (localStorage.getItem(DATA_THEME) as Theme | null) || getSystemPreferTheme();
};

const storeTheme = (theme: Theme): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DATA_THEME, theme);
  }
};

// Update active state for theme buttons
const updateActiveButtons = (activeTheme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  const currentSystemTheme = getSystemPreferTheme();
  const isMachineActive = activeTheme === THEME_MACHINE;

  const determineActiveState = (theme: Theme): boolean =>
    isMachineActive 
      ? theme === activeTheme 
      : theme === activeTheme || (isMachineActive && theme === currentSystemTheme);

  for (const [id, buttonTheme] of BUTTON_THEME_MAP.entries()) {
    const button = document.getElementById(id);
    const svg = button?.querySelector('svg');
    if (svg) {
      svg.classList.toggle(ACTIVE_CLASS, determineActiveState(buttonTheme));
    }
  }
};

// Public functions
export function getEffectiveTheme(): Theme {
  if (typeof window === 'undefined') return theme.get();
  const stored = localStorage.getItem(DATA_THEME) as Theme | null;
  if (stored && stored !== THEME_MACHINE) return stored;
  return getSystemPreferTheme();
}

export function setTheme(newTheme: Theme): void {
  theme.set(newTheme);
  storeTheme(newTheme);
  
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute(
      DATA_THEME, 
      newTheme === THEME_MACHINE ? getEffectiveTheme() : newTheme
    );
    updateActiveButtons(newTheme);
  }
}

// Initialize on client-side
if (typeof window !== 'undefined') {
  // Listen for system preference changes
  window.matchMedia(PREFER_SCHEME_DARK).addEventListener('change', () => {
    if (theme.get() === THEME_MACHINE) setTheme(THEME_MACHINE);
  });
  
  // On load, sync store with persisted value
  const stored = localStorage.getItem(DATA_THEME) as Theme | null;
  if (stored) setTheme(stored as Theme);
  
  // Support for Astro view transitions
  document.addEventListener('astro:after-swap', () => {
    const stored = localStorage.getItem(DATA_THEME) as Theme | null;
    if (stored) setTheme(stored as Theme);
  });
}
