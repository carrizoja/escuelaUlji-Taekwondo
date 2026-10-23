## Context

Static Astro site on Hostinger shared hosting, published by manual FTP. Events are read at build time from Google Sheets; photos are read in the browser. Parsing is positional and events lack ids. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:** automated publishing; stable data model; a single-owner dashboard with no custom auth and no new servers.

**Non-Goals:** multi-user, a database, leaving Hostinger, editing other content.

## Architecture

```
 Admin (Google login)
        |
        v
 Apps Script web app  (HtmlService UI, runs as owner, access: only me)
   |        |                 |
   |        |                 +--> GitHub API: repository_dispatch (content-updated)
   |        |                                   |
   |        |                                   v
   |        |                          GitHub Action: npm ci -> build
   |        |                                   |  (reads Events sheet)
   |        |                                   v
   |        |                          FTP deploy --> Hostinger (dist/)
   |        v
   |   Cloudinary (signed upload; browser -> Cloudinary directly)
   v
 Google Sheets (Examenes / Torneos / Seminarios / Photos)
        ^
        |  live read (Photos)
 Visitor browser <---- Hostinger static site
```

## Decisions

1. **Apps Script over a custom backend.** Google provides auth, hosting and Sheets access at no cost. Alternatives: self-hosted admin (needs auth, hosting, security upkeep); headless CMS (migrates data, new cost). Trade-off: Apps Script quotas and limited tooling, acceptable at this scale.
2. **Web app "Execute as me / Only myself".** No custom auth code. Alternative: anyone-with-link plus password (rejected: weaker, custom code).
3. **Phase order: deploy, data, dashboard.** Phase 1 is independently valuable; the dashboard depends on ids and header parsing.
4. **Header-name mapping everywhere.** One shared schema (documented in `GOOGLE_SHEETS_SETUP.md`) drives site parsing and dashboard validation; both fail loudly on mismatch.
5. **UUID ids** generated server-side (`Utilities.getUuid()`), backfilled by a one-off script; rows located by id, never by index.
6. **LockService script lock** around read-modify-write; short timeout with retryable error.
7. **Cloudinary signed upload.** The script signs params using the secret from Script Properties; the browser posts the file straight to Cloudinary. Thumbnail derived by transformation URL. Optional asset deletion uses the Admin/destroy API signed server-side. Alternative: unsigned preset (rejected: anyone could upload).
8. **Rebuild trigger via `repository_dispatch`** with a fine-grained token (single repo; actions and contents scopes). Status read from the workflow runs API. Photos need no rebuild.
9. **FTP deploy via pinned SamKirkland/FTP-Deploy-Action** with a concurrency group; secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` plus sheet env secrets.
10. **UI:** HtmlService page with Vue from a pinned CDN version, styled to the new brand (see `redesign-hybrid-theme`). Code in `admin/apps-script/` deployed with clasp; `.clasp.json` holds the script id only, no secrets.

## Risks / Trade-offs

- Concurrent edits -> LockService.
- Manual sheet edits break structure -> header validation on every read/write with clear errors.
- Apps Script quotas -> negligible volume; monitor.
- Silent deploy failure -> failure email plus dashboard status.
- Token or secret leakage -> Script Properties only, least privilege, rotation note.
- ~2 minute publish delay for events -> shown in the UI.
- Backfill mistakes -> run on a copy of the sheet first.

## Migration Plan

Phase 1 ships alone and replaces manual FTP. Phase 2: back up sheets, add ids, deploy parser change together with the sheet change. Phase 3: deploy dashboard after the owner completes setup tasks. Rollback: revert the parser commit, keep the id column (harmless), and disable the workflow triggers if needed.

## Open Questions

- Exact date format accepted by the dashboard follows the current sheet format; confirm during phase 2.
