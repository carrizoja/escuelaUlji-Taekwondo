## Why

Site content is edited by hand in Google Sheets and Cloudinary, and the site is published by running `npm run build` locally and uploading `dist/` by FTP. This is slow and error-prone: events have no stable id, the sheet column order disagrees with the code, and nothing rebuilds the site after an edit. The owner needs a simple, safe way to manage events and photos and have changes published automatically.

## What Changes

- **Phase 1, automated deploy**: a GitHub Actions workflow builds the site and deploys `dist/` to Hostinger over FTP on push to `main`, on `repository_dispatch` (`content-updated`) and on manual dispatch, with non-overlapping runs and failure notification.
- **Phase 2, data hardening**: add a UUID `id` column to Examenes, Torneos and Seminarios; parse sheets by header name instead of position; make `GOOGLE_SHEETS_SETUP.md` the single source of truth for headers; remove unused `src/utils/googleSheets.ts`; backfill ids.
- **Phase 3, dashboard**: a standalone Google Apps Script web app (versioned under `admin/apps-script/`) to list, create, edit and delete exams, tournaments, seminars and photos, with server-side validation, locked writes, Cloudinary signed uploads, and a rebuild trigger after event saves. It shows last deploy status and time.
- Owner manual setup is explicit: FTP secrets, GitHub token, Script Properties, web app deployment, sheet sharing.

## Capabilities

### New Capabilities
- `automated-deploy`: CI build and FTP deploy triggered by push, content update dispatch or manual run.
- `event-data-model`: stable ids, header-name parsing and documented schema for event tabs.
- `admin-event-management`: dashboard CRUD for exams, tournaments and seminars plus rebuild trigger and deploy status.
- `admin-photo-management`: dashboard CRUD for photos with signed Cloudinary upload.
- `admin-access`: single-owner access via Google authentication, secret handling and write safety.

### Modified Capabilities
<!-- None: no specs exist yet. -->

## Impact

- New: `.github/workflows/deploy.yml`, `admin/apps-script/` (code, `appsscript.json`, clasp config without secrets).
- Changed: `src/utils/googleSheets.js`, `src/pages/eventos.astro`, `GOOGLE_SHEETS_SETUP.md`, the Google Sheets themselves (new `id` column).
- Removed: `src/utils/googleSheets.ts`.
- Secrets: GitHub (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, sheet env vars); Apps Script properties (Cloudinary key/secret, GitHub token).
- Non-goals: multi-user or roles, leaving Hostinger, replacing Sheets with a database, editing other content (instructors, schedule).
- Risks: concurrent edits (LockService); manual sheet edits breaking structure (header validation with clear errors); Apps Script quotas (adequate at this scale); silent deploy failure (failure email plus dashboard status); token or secret leakage (Script Properties only, least privilege, rotation note).
