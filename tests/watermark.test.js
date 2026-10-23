import { test } from 'node:test'
import assert from 'node:assert/strict'
import { WATERMARKS, watermarkGlyphs, koreanFontHref } from '../src/utils/watermark.js'

test('glyph subset has every watermark character exactly once', () => {
  const glyphs = [...watermarkGlyphs()]
  assert.equal(new Set(glyphs).size, glyphs.length)
  for (const text of Object.values(WATERMARKS)) {
    for (const ch of text) assert.ok(glyphs.includes(ch), `missing ${ch}`)
  }
})

test('font href requests only the subset, with swap', () => {
  const url = new URL(koreanFontHref())
  assert.equal(url.hostname, 'fonts.googleapis.com')
  assert.equal(url.searchParams.get('text'), watermarkGlyphs())
  assert.equal(url.searchParams.get('display'), 'swap')
  assert.match(url.searchParams.get('family'), /^Noto Sans KR:wght@\d+$/)
})
