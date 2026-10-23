# Google Sheets Setup

The site reads its events and gallery photos from two Google Sheets. This document is the
single source of truth for their structure: the headers below must match the code
(`src/utils/sheetRows.js` for events), and the admin dashboard follows the same schema.

## How the data is read

- **Events** (`/eventos`) are fetched at **build time**. A deploy is needed to publish changes
  (see "Deployment" in `README.md`).
- **Photos** (`/gallery`) are fetched in the visitor's browser, so changes appear immediately.
- Event columns are matched by **header name** (case and surrounding spaces ignored), so the
  column order does not matter. Extra columns are ignored.
- If a tab is missing a required header, or cannot be fetched, the production build **fails**
  with a message naming the tab and header, instead of publishing an empty events page.
  The dev server logs the error and shows no events.

## Events spreadsheet

Configured with `PUBLIC_GOOGLE_SHEETS_ID_EVENTOS` (the code has a default). It has three tabs.
Every header is required unless marked optional.

### `Examenes`

| Header | Content | Example |
|---|---|---|
| `id` | Unique id, see "Event ids" | `3f2b…` |
| `fecha` | Date, `M/D/YYYY` | `11/20/2024` |
| `tipo` | Exam type | `Presencial` |
| `grado` | Grades evaluated | `Danes` |
| `lugar` | Location | `Centro Cultural La Grieta` |
| `hora` | Time | `18:30 h` |
| `requisitos` | Requirements | `6 meses de práctica continua` |
| `estado` *(optional)* | Status; defaults to `Programado` | `Programado` |

### `Torneos`

| Header | Content | Example |
|---|---|---|
| `id` | Unique id | `9a1c…` |
| `fecha` | Date, `M/D/YYYY` | `10/15/2025` |
| `nombre` | Tournament name | `Torneo Interno ACIT` |
| `categoria` | Categories | `Gups y Danes` |
| `lugar` | Location | `Club Avellaneda` |
| `inscripcion` | Registration deadline or info | `hasta el 1 de octubre` |
| `premio` | Prizes | `trofeos y medallas` |
| `costo` | Cost | `$15.000` |
| `nivel` | Level | `Principiante a avanzado` |
| `modalidad` | Modality | `Formas y Combate` |
| `estado` | Status; empty means `Inscripciones Abiertas` | `Inscripciones abiertas` |

### `Seminarios`

| Header | Content | Example |
|---|---|---|
| `id` | Unique id | `c7d4…` |
| `fecha` | Date, `M/D/YYYY` | `11/12/2024` |
| `titulo` | Title | `Encuentro Familiar en Palermo` |
| `maestro` | Instructor | `Sabum Nim Horacio Santana` |
| `tema` | Topic | `Clase abierta con padres y madres` |
| `duracion` | Duration | `2 h` |
| `costo` | Cost | `sin costo` |
| `lugar` | Location | `Bosques de Palermo` |
| `cupos` | Available places | `40` |
| `nivel` | Level | `todos los niveles` |
| `descripcion` | Description | Free text |

### Status rules

- Exams with status `Programado` and a past date are shown as `Finalizado`.
- Tournaments with status `Inscripciones Abiertas` or `Inscripciones abiertas` and a past date
  are shown as `Finalizado`.
- Only upcoming events are shown; if a tab has none, all its events are shown.

### Event ids

Each row needs a unique, permanent `id` (a UUID such as `0e6f1c2a-…`). The dashboard uses it to
find the row to edit or delete, so never change or reuse an id.

- The dashboard generates ids automatically.
- When adding a row by hand, generate one with `node -e "console.log(crypto.randomUUID())"` or
  any online UUID generator.
- A row without an id is still published, with a temporary id based on its row number, and the
  build logs a warning.

## Photos spreadsheet

Configured with `PUBLIC_GOOGLE_SHEETS_ID` (the code has a default), tab `Photos`, columns A to J
read **by position** in this order:

| Column | Header | Content |
|---|---|---|
| A | `id` | Unique id |
| B | `title` | Title (rows without a title are skipped) |
| C | `description` | Description |
| D | `thumbnail` | Thumbnail image URL (Cloudinary) |
| E | `fullSize` | Full-size image URL; defaults to the thumbnail |
| F | `alt` | Alt text; defaults to the title |
| G | `category` | `training`, `competitions`, `belts`, `events` or `students` |
| H | `date` | Date |
| I | `nivel` | Not displayed |
| J | `tags` | Comma-separated tags |

## Access

- Both sheets must be shared as **Anyone with the link: Viewer**.
- The site uses `PUBLIC_GOOGLE_API_KEY` (Google Sheets API enabled). This key is visible to
  visitors, so restrict it in Google Cloud Console to the Sheets API. Do not add a website
  (HTTP referrer) restriction: the build fetches events from GitHub Actions, which sends no
  referrer, and the build would fail.
