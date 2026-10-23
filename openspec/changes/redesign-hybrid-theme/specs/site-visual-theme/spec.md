## Purpose

Defines the visual identity of the Escuela Ul-ji website: the dark/light section tone system, accent and status colors, typography, signature decorative elements, and page layout mapping.

## ADDED Requirements

### Requirement: Section tone system
Each page section SHALL belong to exactly one tone, dark or light. Dark sections (navbar, hero, events, gallery preview, footer) SHALL use background `#0B0B0C`, charcoal `#141416` and cards `#17171A`. Light sections (why Ul-ji / taekwondo info, institutional credentials, schedule, contact) SHALL use off-white `#FAF7F2`, white `#FFFFFF`, borders `#E7E2D9`, text `#141416`, muted text `#55555B` and eyebrow labels `#B91C1C`.

#### Scenario: Dark section palette
- **WHEN** the hero or events section is rendered
- **THEN** its background is `#0B0B0C` or `#141416` and its cards use `#17171A`

#### Scenario: Light section palette
- **WHEN** the schedule section is rendered in light mode
- **THEN** its background is `#FFFFFF` or `#FAF7F2`, borders use `#E7E2D9`, body text uses `#141416`, muted text uses `#55555B` and eyebrow labels use `#B91C1C`

### Requirement: Single red accent
Red from the `#C81E1E` family SHALL be the only accent color for interactive and emphasis elements, with brand deep red `#A00000` used for hover states. Bright green SHALL NOT appear in general UI. A muted green SHALL be used only for success or status indicators.

#### Scenario: No bright green in general UI
- **WHEN** any page is rendered
- **THEN** no heading, button, link, border or icon uses the former bright green

#### Scenario: Status uses muted green
- **WHEN** an event is open for registration
- **THEN** its status label (for example "Inscripcion abierta") is shown in the muted green status color

### Requirement: Tone-based typography
Headings in dark sections SHALL be Poppins bold UPPERCASE. Headings in light sections SHALL be Poppins semibold in sentence case. Body text everywhere SHALL be Barlow.

#### Scenario: Dark heading style
- **WHEN** a heading is rendered in the hero
- **THEN** it is Poppins bold and uppercase

#### Scenario: Light heading style
- **WHEN** a heading is rendered in the "Por que Ul-ji" section
- **THEN** it is Poppins semibold in sentence case

### Requirement: Belt stripe divider
The site SHALL display a thin red "belt stripe" divider with a dark tip between key sections, including between the hero and the next section on the home page.

#### Scenario: Divider after hero
- **WHEN** the home page is rendered
- **THEN** a belt stripe divider appears between the hero and the "Por que Ul-ji" section

### Requirement: Decorative Korean watermark
Dark sections MAY display faint Korean watermark text (for example "을지" or "태권도"). The watermark SHALL be decorative, hidden from assistive technology, and SHALL NOT reduce legibility of foreground text.

#### Scenario: Watermark is hidden from screen readers
- **WHEN** the watermark is rendered
- **THEN** it carries `aria-hidden="true"` and is not focusable

### Requirement: Home page layout order
The home page SHALL present sections in this order: dark navbar; dark hero with action photo, scrim, CTAs "Reservá tu clase de prueba" and "Ver horarios", and an ITF/ACIT credentials strip; belt stripe; light "Por qué Ul-ji" with three cards (Niños, Adolescentes y adultos, Competencia) and four credentials; white "Horarios" with table and WhatsApp CTA; dark "Eventos" cards with date badge, type and status; charcoal "Comunidad" gallery preview; light contact CTA; dark footer.

#### Scenario: Section order
- **WHEN** the home page is rendered
- **THEN** the sections appear in the order stated above

#### Scenario: Hero legibility over photo
- **WHEN** the hero photo is displayed
- **THEN** a scrim keeps hero text at 4.5:1 contrast or better

### Requirement: Page tone mapping
The pages taekwondo, institucional, schedule and contacto SHALL use light tone for their content sections. The pages eventos and gallery SHALL use dark tone. Navbar and footer SHALL be dark on every page.

#### Scenario: Events page tone
- **WHEN** the eventos page is rendered
- **THEN** its content sections use the dark palette

### Requirement: No invented content
Content shown by the redesign SHALL come from existing sources. Schedule and event data SHALL NOT be fabricated or hard-coded as placeholders in production output.

#### Scenario: Schedule from existing data
- **WHEN** the schedule table is rendered
- **THEN** its rows come from the existing schedule source

### Requirement: Accessible contrast
All text SHALL meet WCAG AA contrast of at least 4.5:1 against its background in both light and dark modes.

#### Scenario: Muted text on off-white
- **WHEN** muted text `#55555B` is shown on `#FAF7F2`
- **THEN** the contrast ratio is at least 4.5:1

#### Scenario: Eyebrow in dark mode
- **WHEN** an eyebrow label is shown in dark mode on a flipped light section
- **THEN** its color `#F87171` has at least 4.5:1 contrast with the section background
