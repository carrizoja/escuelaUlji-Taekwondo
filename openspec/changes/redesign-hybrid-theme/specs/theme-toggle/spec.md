## Purpose

Defines how the dark/light mode toggle behaves under the hybrid tone system, including persistence, system preference and which sections change.

## ADDED Requirements

### Requirement: Toggle persistence and defaults
The theme toggle SHALL toggle the `dark` class on the root element and persist the choice in localStorage key `theme`. With no stored value it SHALL default to the system `prefers-color-scheme` and SHALL follow later changes of that preference.

#### Scenario: Stored choice wins
- **WHEN** localStorage `theme` is `light` and the system prefers dark
- **THEN** the page loads in light mode

#### Scenario: System preference default
- **WHEN** no `theme` value is stored and the system prefers dark
- **THEN** the page loads in dark mode

#### Scenario: System preference change
- **WHEN** no stored value exists and the system preference changes
- **THEN** the page mode updates accordingly

### Requirement: Only light sections flip
In dark mode only light-tone sections SHALL change, using backgrounds `#121214`, `#1A1A1D` and `#232327`, borders `#2E2E33`, text `#F5F5F5`, muted text `#A8A8AD` and eyebrow `#F87171`. Dark-tone sections SHALL remain visually unchanged in both modes.

#### Scenario: Light section in dark mode
- **WHEN** dark mode is active and the schedule section is rendered
- **THEN** it uses the dark-mode palette above

#### Scenario: Dark section unchanged
- **WHEN** the mode is toggled
- **THEN** the hero, events, gallery preview, navbar and footer keep identical colors

### Requirement: Solid button inversion
In dark mode, the dark solid button inside flipped light sections SHALL invert to a light appearance with sufficient contrast.

#### Scenario: Button in dark mode
- **WHEN** dark mode is active and a dark solid button sits in a light-tone section
- **THEN** it renders with a light background and dark text meeting 4.5:1 contrast

### Requirement: No theme flash
The selected mode SHALL be applied before first paint so the page does not flash the wrong theme.

#### Scenario: Reload in dark mode
- **WHEN** a user with stored `theme` = `dark` reloads a page
- **THEN** light sections never render in light colors during load
