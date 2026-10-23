## 1. Foundations

- [ ] 1.1 Add tone tokens (CSS variables) and semantic Tailwind colors in `tailwind.config.js` and `src/data/colors.js`
- [ ] 1.2 Add `.tone-dark`, `.tone-light` and `.dark .tone-light` token sets with the specified hex values
- [ ] 1.3 Add muted green status token and remove bright green from shared color definitions
- [ ] 1.4 Verify fonts: Poppins bold uppercase (dark) and semibold sentence-case (light) heading utilities
- [ ] 1.5 Script a contrast check for every token pair in both modes (>= 4.5:1)

## 2. Shared components

- [ ] 2.1 Create `Section.astro` with `tone` prop and optional watermark (aria-hidden)
- [ ] 2.2 Create `BeltStripe.astro` divider (thin red stripe, dark tip)
- [ ] 2.3 Re-theme navbar and footer as dark; keep the toggle logic unchanged
- [ ] 2.4 Confirm an early inline script applies the `dark` class before first paint
- [ ] 2.5 Add token-driven solid-button inversion for dark mode in light sections without touching hover/shine CSS

## 3. Home page

- [ ] 3.1 Hero: action photo, scrim, CTAs "Reservá tu clase de prueba" and "Ver horarios", ITF/ACIT strip
- [ ] 3.2 Belt stripe after hero
- [ ] 3.3 "Por qué Ul-ji" light section: three cards and four credentials
- [ ] 3.4 Horarios white section: table from existing data and WhatsApp CTA
- [ ] 3.5 Eventos dark section: cards with date badge, type and status (muted green for open)
- [ ] 3.6 Comunidad charcoal gallery preview
- [ ] 3.7 Contact CTA light section and section order check

## 4. Other pages

- [ ] 4.1 Apply light tone to taekwondo, institucional, schedule and contacto
- [ ] 4.2 Apply dark tone to eventos and gallery
- [ ] 4.3 Remove obsolete `dark:` classes from dark-tone sections

## 5. Verification

- [ ] 5.1 Compare computed hover styles of buttons, cards, gallery images and links against the pre-change baseline
- [ ] 5.2 Toggle test: only light sections flip; dark sections unchanged; localStorage and system preference behave as before
- [ ] 5.3 Run contrast audit on all pages in both modes
- [ ] 5.4 Check responsive layouts (mobile, tablet, desktop) and reduced watermark impact
- [ ] 5.5 Run `npm run build` and review the output visually
