## Purpose

Guarantees that the existing hover and transition effects remain unchanged through the redesign.

## ADDED Requirements

### Requirement: Button effects preserved
Buttons SHALL keep `transition-all` with 300ms ease-out and a shine sweep (gradient moving from -100% to 100% translateX over 700ms ease-out). Primary buttons SHALL transition from brand red to brand deep red with a red-tinted shadow. Outline buttons SHALL change border and text to the red-400 shade and gain a `white/10` background. Dark secondary buttons SHALL use `hover:bg-gray-700`. The existing PrimaryButton, SecondaryButton and ThirdButton components SHALL be reused.

#### Scenario: Primary hover
- **WHEN** a user hovers a primary button
- **THEN** the background moves to brand deep red, a red-tinted shadow appears and the shine sweep runs for 700ms

#### Scenario: Outline hover
- **WHEN** a user hovers an outline button
- **THEN** border and text turn red-400 and the background becomes `white/10`

### Requirement: Card effects preserved
Cards SHALL on hover raise shadow from `shadow-lg` to `shadow-xl`, translate up by 1 unit, scale the inner image by 1.10 over 500ms and turn the title red.

#### Scenario: Card hover
- **WHEN** a user hovers a card
- **THEN** the card lifts, its image scales to 110% over 500ms and the title turns red

### Requirement: Gallery and link effects preserved
Gallery images SHALL scale to 105% on group hover. Text links SHALL turn red-400 on hover.

#### Scenario: Gallery image hover
- **WHEN** a user hovers a gallery image
- **THEN** it scales to 105%

#### Scenario: Link hover
- **WHEN** a user hovers a text link
- **THEN** its color becomes red-400
