## Context

Astro 5.13 static site with Vue islands, Tailwind 3 (`darkMode: 'class'`), Poppins and Barlow fonts. Colors live in `src/data/colors.js` and `tailwind.config.js`. The navbar toggle sets `dark` on `<html>` and stores `theme`. About 944 `dark:` classes currently flip every section. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Express the tone system with design tokens so sections change tone by switching a scope, not by editing classes everywhere.
- Keep hover effects byte-for-byte equivalent by reusing UI components.
- Meet AA contrast in all token pairs.

**Non-Goals:**
- No data, backend or routing changes; no Astro upgrade; no new pages.

## Decisions

1. **CSS-variable tokens scoped by tone.** Define `--bg`, `--surface`, `--card`, `--border`, `--text`, `--muted`, `--eyebrow` under `.tone-dark` and `.tone-light`; `.dark .tone-light` overrides to the flipped palette. Tailwind maps semantic colors (`bg-surface`, `text-muted`) to the variables. Alternative: keep per-element `dark:` classes (rejected: 944 classes, error-prone, dark sections would need unflipping).
2. **Section wrapper component** (`Section.astro`, prop `tone`) applies the tone class and optional watermark, so pages declare tone in one place. Alternative: classes on each page (rejected: duplication).
3. **Remove obsolete `dark:` classes** from dark-tone sections and replace them in light sections with tokens; done page by page.
4. **Buttons untouched.** Reuse PrimaryButton/SecondaryButton/ThirdButton; only the solid-dark variant gets a token-driven inversion in `.dark .tone-light`. Hover/shine CSS is not edited.
5. **Belt stripe and watermark** as small reusable components (`BeltStripe.astro`, decorative `aria-hidden` watermark inside `Section`). Watermark uses low-opacity text, not an image, to avoid weight.
6. **Early theme script.** Keep toggle logic; add or verify an inline head script applying `dark` before paint to avoid flash.
7. **Status color** as a dedicated token (muted green) used only by status badges.
8. **Contrast verification** by a scripted check of all token pairs plus an automated page audit.

## Risks / Trade-offs

- Regression from mass class replacement -> migrate page by page, visual check in both modes.
- Contrast failures on photo backgrounds -> hero scrim and per-page audit.
- Hover effect drift -> no edits to button CSS; add before/after computed-style comparison.
- Watermark clutter or a11y noise -> `aria-hidden`, very low opacity, hidden on small screens if it hurts legibility.

## Migration Plan

Ship on a feature branch, page by page behind no flag (static site). Rollback is a git revert; deploy is the existing manual build and upload.
