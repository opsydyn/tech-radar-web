document.addEventListener("DOMContentLoaded", () => {
  type Theme = "light" | "dark" | "machine";
  type ButtonId = "theme-light" | "theme-dark" | "theme-machine";

  const THEME_LIGHT: Theme = "light";
  const THEME_DARK: Theme = "dark";
  const THEME_MACHINE: Theme = "machine";
  const PREFER_SCHEME_DARK = "(prefers-color-scheme: dark)";
  const DATA_THEME = "data-theme";
  const ACTIVE_CLASS = "active";

  const buttons = new Map<ButtonId, Theme>([
    ["theme-light", THEME_LIGHT],
    ["theme-dark", THEME_DARK],
    ["theme-machine", THEME_MACHINE],
  ]);

  const THEME_VALUES: Record<string, Theme> = {
    [THEME_LIGHT]: THEME_LIGHT,
    [THEME_DARK]: THEME_DARK,
    [THEME_MACHINE]: THEME_MACHINE,
  };

  const getSystemPreferTheme = () =>
    window.matchMedia(PREFER_SCHEME_DARK).matches ? THEME_DARK : THEME_LIGHT;

  const getStoredTheme = (): Theme => {
    const storedTheme = localStorage.getItem(DATA_THEME);
    return THEME_VALUES[storedTheme ?? ""] ?? getSystemPreferTheme();
  };

  const storeTheme = (theme: Theme) => localStorage.setItem(DATA_THEME, theme);

  const applyTheme = (theme: Theme) => {
    const effectiveTheme =
      theme === THEME_MACHINE ? getSystemPreferTheme() : theme;
    document.firstElementChild?.setAttribute(DATA_THEME, effectiveTheme);
    updateActiveButton(theme);
  };

  const setPreference = (theme: Theme) => () => {
    storeTheme(theme);
    applyTheme(theme);
  };

  const initTheme = () => applyTheme(getStoredTheme());
  const applyStoredOrMachineTheme = () => applyTheme(getStoredTheme());

  const addThemeChangeListener = () => {
    window
      .matchMedia(PREFER_SCHEME_DARK)
      .addEventListener("change", applyStoredOrMachineTheme);
  };

  const updateActiveButton = (activeTheme: Theme) => {
    const currentSystemTheme = getSystemPreferTheme();
    const isMachineActive = activeTheme === THEME_MACHINE;

    const determineActiveState = (theme: Theme) =>
      isMachineActive
        ? theme === activeTheme
        : theme === activeTheme ||
          (isMachineActive && theme === currentSystemTheme);

    buttons.forEach((theme, id) => {
      document
        .getElementById(id)
        ?.querySelector("svg")
        ?.classList.toggle(ACTIVE_CLASS, determineActiveState(theme));
    });
  };

  const attachButtonListeners = () => {
    for (const [id, theme] of buttons.entries()) {
      document
        .getElementById(id)
        ?.addEventListener("click", setPreference(theme));
    }
  };

  initTheme();
  attachButtonListeners();
  addThemeChangeListener();

  document.addEventListener("astro:after-swap", () => {
    applyTheme(getStoredTheme());
    attachButtonListeners();
  });
});
