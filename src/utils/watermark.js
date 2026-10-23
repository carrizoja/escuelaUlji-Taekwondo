// Decorative Korean watermarks and the Google Fonts subset that renders them.
// Add new watermark text here so the font request always covers its glyphs.
export const WATERMARKS = {
  hero: '을지',
  events: '태권도',
}

/** Unique characters across all watermarks (used as the font `text=` subset). */
export function watermarkGlyphs() {
  return [...new Set(Object.values(WATERMARKS).join(''))].join('')
}

/** Google Fonts CSS URL for Noto Sans KR restricted to the watermark glyphs. */
export function koreanFontHref() {
  // Built by hand: Google Fonts expects a literal `family=Name:wght@N`.
  const text = encodeURIComponent(watermarkGlyphs())
  return `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@800&text=${text}&display=swap`
}
