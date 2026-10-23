# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
# escuelaUlji-Taekwondo

## Deployment

Pushing to `main` builds the site and deploys `dist/` to Hostinger over FTP via
`.github/workflows/deploy.yml`. It can also be run manually from the Actions tab,
and the admin dashboard triggers it after content updates (`repository_dispatch: content-updated`).

Required repository secrets (Settings › Secrets and variables › Actions):

| Secret | Example |
|---|---|
| `FTP_SERVER` | `ftp.yourdomain.com` |
| `FTP_USERNAME` | Hostinger FTP user |
| `FTP_PASSWORD` | Hostinger FTP password |
| `FTP_SERVER_DIR` | `public_html/` (must end with `/`) |
| `PUBLIC_GOOGLE_API_KEY` | Google Sheets API key |

Optional: `PUBLIC_GOOGLE_SHEETS_ID`, `PUBLIC_GOOGLE_SHEETS_ID_EVENTOS` (the code has defaults).

The workflow stops before building if a required secret is missing. GitHub emails you when a run fails.
If a deploy fails midway, re-run the workflow to complete it.
