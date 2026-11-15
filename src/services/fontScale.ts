const KEY = 'trp_font_percent';
export const FONT_MIN = 80;
export const FONT_MAX = 150;
export const FONT_STEP = 10;

export const getFontPercent = (): number => {
  try {
    const v = parseInt(localStorage.getItem(KEY) || '100', 10);
    return Number.isFinite(v) ? Math.min(FONT_MAX, Math.max(FONT_MIN, v)) : 100;
  } catch {
    return 100;
  }
};

export const applyFontPercent = (p: number) => {
  const v = Math.min(FONT_MAX, Math.max(FONT_MIN, p));
  document.documentElement.style.fontSize = `${v}%`;
  try {
    localStorage.setItem(KEY, String(v));
  } catch {
    /* yoksay */
  }
  return v;
};
