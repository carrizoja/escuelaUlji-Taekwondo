# Ul-ji Admin (Google Apps Script)

Dashboard to manage exams, tournaments, seminars and gallery photos. It runs as a Google Apps Script
web app that only the owner can open. Event saves trigger a site rebuild on GitHub; photo saves are
live immediately.

Everything below is done by the owner. Nothing here stores secrets in the repo.

## 1. Install clasp and log in

```bash
npm install -g @google/clasp
```

1. Turn on the Apps Script API: https://script.google.com/home/usersettings
2. `clasp login`

## 2. Create the project and push the code

From `admin/apps-script/`:

```bash
clasp create --type webapp --title "Ul-ji Admin" --rootDir .
clasp push
```

`clasp create` writes `.clasp.json` (git-ignored). To use an existing project instead, copy
`.clasp.json.example` to `.clasp.json` and replace `<your-script-id>`.

`.claspignore` pushes only `appsscript.json`, `*.js` and `*.html`. `appsscript.json` already sets
V8, the Buenos Aires time zone, the OAuth scopes and the web app access (owner only).

## 3. Script properties

Open the project at script.google.com > **Project Settings** > **Script properties** and add:

| Key | Where to get it |
|---|---|
| `EVENTS_SHEET_ID` | Events spreadsheet URL: `/d/<id>/edit` |
| `PHOTOS_SHEET_ID` | Photos spreadsheet URL (same as `PUBLIC_GOOGLE_SHEETS_ID`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary console > Settings > API Keys |
| `CLOUDINARY_API_KEY` | Same page |
| `CLOUDINARY_API_SECRET` | Same page (never share it) |
| `GITHUB_TOKEN` | Fine-grained token, see below |
| `GITHUB_REPO` | `owner/name`, e.g. `carrizoja/escuelaUlji-Taekwondo` |

GitHub token: GitHub > Settings > Developer settings > Fine-grained tokens. Resource owner: you;
**only** the site repository; permissions **Actions: Read and write** and **Contents: Read and
write** (needed to send `repository_dispatch`). Set a 1-year expiry.

The spreadsheets must be editable by the Google account that deploys the script. Tab headers must
match `GOOGLE_SHEETS_SETUP.md`; if one is renamed the dashboard shows an error naming the tab and
header and writes nothing.

## 4. Deploy as a web app

1. In the editor: **Deploy** > **New deployment** > type **Web app**.
2. **Execute as:** Me. **Who has access:** Only myself.
3. Deploy, authorize the requested permissions, and bookmark the `/exec` URL.

Updating after a `clasp push`: **Deploy** > **Manage deployments** > pencil icon > **Version: New
version** > Deploy. The URL stays the same. (The "Test deployment" `/dev` URL always runs the
latest pushed code, only for you.)

## 5. Using it

- Event saves/deletes ask GitHub to rebuild; the site updates in about 2 minutes. The header shows
  the last deploy status and has a refresh button.
- Photos upload straight from the browser to Cloudinary with a signature made by the script.
- Another Google account opening the URL is denied by Google. Do not change "Only myself".

## Rotating secrets

**GitHub token**

1. Create a new fine-grained token with the same repo and permissions.
2. Replace `GITHUB_TOKEN` in Script properties.
3. Open the dashboard and press refresh on the deploy status to confirm it works.
4. Delete the old token in GitHub.

**Cloudinary API secret**

1. Cloudinary console > Settings > API Keys > generate a new key (or regenerate the secret).
2. Update `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in Script properties.
3. Upload a test photo from the dashboard.
4. Revoke the old key in Cloudinary.

If a secret ever appeared in a commit, rotate it right away; deleting the commit is not enough.

## Development

Pure logic (schemas, validation, header mapping, signature) is covered by `npm test`
(`tests/admin/`). The Apps Script services cannot run locally, so the checks that need a live
deployment are listed in `openspec/changes/admin-dashboard/tasks.md` (5.1 to 5.6).
