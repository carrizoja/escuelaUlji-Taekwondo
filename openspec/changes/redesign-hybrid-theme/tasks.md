## 1. Foundations

- [x] 1.1 Add tone tokens (CSS variables) and semantic Tailwind colors in `tailwind.config.js` and `src/data/colors.js`
- [x] 1.2 Add `.tone-dark`, `.tone-light` and `.dark .tone-light` token sets with the specified hex values
- [x] 1.3 Add muted green status token and remove bright green from shared color definitions (partial: `--status` token added; bright `ulji-green`/`brand-green` definitions kept because ~17 files in src/ still use them; removal deferred to slices 3-4)
- [x] 1.4 Verify fonts: Poppins bold uppercase (dark) and semibold sentence-case (light) heading utilities
- [x] 1.5 Script a contrast check for every token pair in both modes (>= 4.5:1)

## 2. Shared components

- [x] 2.1 Create `Section.astro` with `tone` prop and optional watermark (aria-hidden)
- [x] 2.2 Create `BeltStripe.astro` divider (thin red stripe, dark tip)
- [x] 2.3 Re-theme navbar and footer as dark; keep the toggle logic unchanged
- [x] 2.4 Confirm an early inline script applies the `dark` class before first paint (added to Layout.astro head; none existed)
- [x] 2.5 Add token-driven solid-button inversion for dark mode in light sections without touching hover/shine CSS (opt-in class `btn-solid-dark`; pages adopt it in slices 2-4)

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

Delivery: one PR per slice. Slice 1 = sections 1-2, slice 2 = section 3, slice 3 = 4.1, slice 4 = 4.2-4.3. Section 5 checks run on each slice for the pages it touches.

- [ ] 5.1 Compare computed hover styles of buttons, cards, gallery images and links against the pre-change baseline
- [ ] 5.2 Toggle test: only light sections flip; dark sections unchanged; localStorage and system preference behave as before
- [ ] 5.3 Run contrast audit on all pages in both modes
- [ ] 5.4 Check responsive layouts (mobile, tablet, desktop) and reduced watermark impact
- [ ] 5.5 Run `npm run build` and review the output visually
