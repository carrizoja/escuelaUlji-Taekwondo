import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Single source of truth for token values: src/styles/global.css.
// This test parses the CSS instead of duplicating any hex value.
const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8')

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function readTokens(selector) {
  const match = css.match(new RegExp(`(?:^|\\})\\s*${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`, 'm'))
  assert.ok(match, `selector "${selector}" not found in global.css`)
  const tokens = {}
  for (const [, name, value] of match[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim()
  }
  return tokens
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const BACKGROUNDS = ['bg', 'surface', 'card']
const TEXTS = ['text', 'muted', 'eyebrow', 'status', 'accent-text']
const MODES = [
  ['.tone-dark', 'dark tone'],
  ['.tone-light', 'light tone, light mode'],
  ['.dark .tone-light', 'light tone, dark mode'],
]

for (const [selector, label] of MODES) {
  test(`${label}: every text token reaches 4.5:1 on every background token`, () => {
    const tokens = readTokens(selector)
    for (const name of [...BACKGROUNDS, ...TEXTS, 'border']) {
      assert.match(tokens[name] ?? '', /^#[0-9a-fA-F]{6}$/, `${selector} must define --${name} as a hex color`)
    }
    for (const bg of BACKGROUNDS) {
      for (const fg of TEXTS) {
        const ratio = contrast(tokens[fg], tokens[bg])
        assert.ok(ratio >= 4.5, `${selector}: --${fg} on --${bg} is ${ratio.toFixed(2)}:1 (needs >= 4.5)`)
      }
    }
  })
}

for (const [selector, label] of MODES.slice(1)) {
  test(`${label}: solid button text reaches 4.5:1 on its background and hover`, () => {
    const tokens = readTokens(selector)
    for (const state of ['btn-solid-bg', 'btn-solid-hover']) {
      const ratio = contrast(tokens['btn-solid-fg'], tokens[state])
      assert.ok(ratio >= 4.5, `${selector}: --btn-solid-fg on --${state} is ${ratio.toFixed(2)}:1`)
    }
  })
}

// Brand accent: white text on red backgrounds and red text on every tone.
const rootTokens = readTokens(':root')

test('brand red accent reaches 4.5:1 with white text (buttons, badges)', () => {
  assert.match(rootTokens['color-red-primary'] ?? '', /^#[0-9a-fA-F]{6}$/)
  const ratio = contrast('#FFFFFF', rootTokens['color-red-primary'])
  assert.ok(ratio >= 4.5, `white on --color-red-primary is ${ratio.toFixed(2)}:1`)
})

test('tailwind brand.red and ulji-red-500 resolve to the CSS accent (single source)', async () => {
  const { default: config } = await import('../tailwind.config.js')
  const colors = config.theme.extend.colors
  assert.equal(colors.brand.red.toLowerCase(), rootTokens['color-red-primary'].toLowerCase())
  assert.equal(colors.primary[500].toLowerCase(), rootTokens['color-red-primary'].toLowerCase())
})

test('root --accent-text reaches 4.5:1 on white', () => {
  assert.match(rootTokens['accent-text'] ?? '', /^#[0-9a-fA-F]{6}$/)
  const ratio = contrast(rootTokens['accent-text'], '#FFFFFF')
  assert.ok(ratio >= 4.5, `--accent-text on white is ${ratio.toFixed(2)}:1`)
})
