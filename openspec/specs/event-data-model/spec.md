# event-data-model Specification

## Purpose

Defines a robust event data schema so records can be addressed reliably and columns can change order without breaking the site.

## Requirements

### Requirement: Stable event id
Every row in the Examenes, Torneos and Seminarios tabs SHALL have a unique UUID in an `id` column, and existing rows SHALL be backfilled.

#### Scenario: Backfill
- **WHEN** the backfill is run on existing rows without id
- **THEN** each row receives a unique UUID and existing ids are unchanged

#### Scenario: Id used by site
- **WHEN** the events page builds event entries
- **THEN** each entry uses the sheet `id`, not the date

### Requirement: Header-name parsing
The site SHALL read event sheets by header name, not column position, so reordering columns does not change results.

#### Scenario: Reordered columns
- **WHEN** two columns are swapped in a tab
- **THEN** the built events page shows the same data

#### Scenario: Missing required header
- **WHEN** a required header is absent
- **THEN** the build reports a clear error naming the header and tab

### Requirement: Single documented schema
`GOOGLE_SHEETS_SETUP.md` SHALL list the exact headers of each tab and be the single source of truth shared by the site and the dashboard.

#### Scenario: Doc matches code
- **WHEN** headers in the document are compared with those the code requires
- **THEN** they are identical

### Requirement: No duplicate parser
The unused duplicate `src/utils/googleSheets.ts` SHALL be removed.

#### Scenario: Single module
- **WHEN** the source tree is inspected
- **THEN** only one Google Sheets utility module exists
