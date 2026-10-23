## 1. Phase 1: Automated deploy

- [x] 1.1 Create `.github/workflows/deploy.yml` with triggers push to main, `repository_dispatch` (`content-updated`) and `workflow_dispatch`
- [x] 1.2 Add concurrency group, `npm ci`, `npm run build` with sheet env vars from secrets
- [x] 1.3 Add FTP deploy step with pinned SamKirkland/FTP-Deploy-Action using FTP secrets
- [x] 1.4 Confirm failure notification behavior and document it
- [x] 1.5 Owner: create GitHub secrets FTP_SERVER, FTP_USERNAME, FTP_PASSWORD, FTP_SERVER_DIR, PUBLIC_GOOGLE_API_KEY, sheet ids
- [x] 1.6 Run the workflow manually and verify the live site updates
- [x] 1.7 Verify no credentials appear in the repo or logs

## 2. Phase 2: Data hardening

- [ ] 2.1 Back up the events spreadsheet
- [x] 2.2 Define the final header list per tab in `GOOGLE_SHEETS_SETUP.md` (single source of truth)
- [ ] 2.3 Add `id` column to Examenes, Torneos, Seminarios and backfill UUIDs
- [x] 2.4 Refactor `src/utils/googleSheets.js` to read columns by header name with clear missing-header errors (also fixes Torneos and Seminarios fields read from the wrong columns; build fails on fetch or header errors)
- [x] 2.5 Use sheet `id` in `src/pages/eventos.astro` instead of the date
- [x] 2.6 Remove `src/utils/googleSheets.ts`
- [ ] 2.7 Verify build output is unchanged and reordered columns still work (reordering covered by `npm test`; build to verify after ids are added)

## 3. Phase 3: Dashboard setup (owner)

- [ ] 3.1 Create a fine-grained GitHub token for the repo (actions and contents only)
- [ ] 3.2 Create the Apps Script project and set Script Properties (Cloudinary key/secret/cloud name, GitHub token, sheet ids)
- [ ] 3.3 Share both spreadsheets with the owner account used by the script
- [ ] 3.4 Deploy as web app: Execute as me, access only myself

## 4. Phase 3: Dashboard implementation

- [ ] 4.1 Scaffold `admin/apps-script/` with `appsscript.json`, clasp config (no secrets) and `.gitignore`
- [ ] 4.2 Implement sheet access layer: header validation, header-name mapping, find by id
- [ ] 4.3 Implement LockService wrapper for all writes
- [ ] 4.4 Implement server-side validators per event type and for photos
- [ ] 4.5 Implement events list/create/edit/delete endpoints
- [ ] 4.6 Implement photos list/create/edit/delete endpoints
- [ ] 4.7 Implement Cloudinary signature endpoint and optional asset deletion
- [ ] 4.8 Implement GitHub dispatch after event saves and deploy status lookup
- [ ] 4.9 Build the HtmlService UI with Vue (pinned CDN version): forms, validation messages, deploy status, ~2 minute notice
- [ ] 4.10 Style the UI to match the new brand

## 5. Verification and docs

- [ ] 5.1 Test CRUD for each event type and photos, including invalid input
- [ ] 5.2 Test concurrent saves and lock timeout message
- [ ] 5.3 Test a renamed header produces a clear error and no write
- [ ] 5.4 Test that another Google account is denied access
- [ ] 5.5 Test end to end: save event, dispatch, deploy, site shows event
- [ ] 5.6 Confirm Cloudinary secret and token are absent from page source and repo
- [ ] 5.7 Write admin setup guide including secret rotation steps
