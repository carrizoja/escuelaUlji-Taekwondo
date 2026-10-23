## Why

The current site mixes bright green, multiple reds and a theme toggle that flips every section, so it lacks a consistent identity and its dark mode is applied uniformly through ~944 `dark:` classes. The owner approved a mockup of a hybrid direction ("Dojang Dark + Clean Academy") that gives the school a recognisable, credible look while keeping content readable.

## What Changes

- Introduce a **section tone system**: dark sections (navbar, hero, events, gallery, footer) and light sections (why Ul-ji / taekwondo info, institutional credentials, schedule, contact), each with a defined palette.
- Make red the single accent (brand deep red `#A00000` kept for hover); remove bright green from general UI and keep a muted green only for success/status states (e.g. "Inscripcion abierta").
- Define typography by tone: Poppins bold UPPERCASE headings in dark sections, Poppins semibold sentence-case in light sections, Barlow body.
- Add signature elements: a thin red "belt stripe" divider with a dark tip between key sections, and faint decorative Korean watermark text in dark sections.
- Reorder and restyle the home page: nav, hero (action photo, scrim, two CTAs, ITF/ACIT strip), belt stripe, Por que Ul-ji, Horarios, Eventos, Comunidad preview, contact CTA, footer.
- Apply the tone mapping to other pages: taekwondo, institucional, schedule, contacto are light; eventos and gallery are dark.
- **BREAKING (visual semantics)**: the dark-mode toggle keeps its behavior (localStorage `theme`, system preference) but only light sections flip; dark sections never change.
- Preserve all current hover effects and reuse the existing UI button components.
- Guarantee WCAG AA contrast (4.5:1) for all text in both modes.

## Capabilities

### New Capabilities
- `site-visual-theme`: tone system, palettes, accent and status colors, typography, signature elements, page-to-tone mapping, home layout order, contrast.
- `theme-toggle`: dark/light mode behavior, persistence, system-preference handling and which sections respond.
- `interaction-effects`: hover and transition effects that must be preserved exactly.

### Modified Capabilities
<!-- None: no specs exist yet. -->

## Impact

- Code: `tailwind.config.js`, `src/data/colors.js`, global styles, `src/components/*` (navbar, hero, footer, cards, event and gallery sections), `src/components/ui/*Button.astro`, all pages in `src/pages/`.
- Content: no invented facts; schedule and event data keep coming from existing sources.
- Non-goals: no data or backend changes, no Astro major upgrade, no new pages.
- Risks: large surface of `dark:` classes to re-map; contrast regressions (mitigated by an explicit audit task); hover regressions (mitigated by reusing button components unchanged).
