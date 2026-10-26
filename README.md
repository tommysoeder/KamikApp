# KamikApp

KamikApp is a personal full-stack prototype designed to bring the day-to-day communication and coordination of a sports club into one place. It combines schedules, team announcements, call-ups, attendance, results, documents, and conversations in a responsive web application.

The project is under active development. It has not been deployed or used in production, and the repository contains demonstration data for local evaluation only.

## The problem it explores

Sports clubs often coordinate teams through several disconnected channels. Schedules, player availability, announcements, documents, results, and questions can easily become fragmented or difficult to track.

KamikApp explores a single role-aware workspace where club staff, coaches, delegates, players, and families can see and manage the information relevant to them.

## Implemented in the prototype

- Authentication with server-side sessions, password hashing, and role-based permissions.
- Club, team, user, and player profile management.
- Segmented announcements for selected roles and teams.
- Calendars for matches, training sessions, tournaments, and club events, including recurring training sessions.
- Player call-ups with attendance responses and absence tracking.
- Results, standings, match reports, and media galleries.
- Team documents, folders, and local file uploads.
- Conversation threads for club communication and beta feedback.
- In-app notifications, read state, browser notification prompts, and notification preferences.
- Links for adding events to Google Calendar.
- CSV import and export tools for club data.
- JSON backups, restore tools, diagnostics, audit entries, and an undo mechanism for selected operations.
- Spanish and English interface text.
- A responsive, installable PWA interface.

Some screens and controls are only available to roles with the corresponding permission. The server also filters state and validates write operations according to the authenticated account.

## Technology

KamikApp deliberately uses a small, dependency-free stack:

- **Frontend:** HTML5, CSS3, and vanilla JavaScript.
- **Backend:** Node.js and its built-in `http`, `fs`, `path`, `crypto`, and `os` modules.
- **Persistence:** a JSON state file, automatic JSON backups, and local filesystem uploads.
- **Authentication:** bearer tokens held in server memory and PBKDF2 password hashes stored with the application state.
- **PWA support:** a web app manifest and service worker.
- **Validation:** Node syntax checks plus application, route, and virtual visual smoke tests.

There is no frontend build step and no third-party runtime dependency in `package.json`.

## Project structure

```text
KamikApp/
├── index.html                 # Application shell
├── app.js                     # Client state, rendering, permissions, and interactions
├── styles.css                 # Responsive interface styles
├── server.js                  # HTTP server, authentication, API routes, and persistence
├── sw.js                      # Service worker
├── manifest.webmanifest       # PWA metadata
├── data/state.json            # Bundled demonstration state
├── assets/                    # Logos and static assets
├── docs/                      # Launch and beta deployment notes
├── *.mjs                      # Checks and state preparation utilities
├── render.yaml                # Deployment configuration draft
└── package.json               # Commands and Node.js version requirement
```

## How it works

### Frontend

`index.html` loads the single-page interface implemented in `app.js`. The client renders views from application state, adapts navigation and actions to the active role, stores a local fallback copy in `localStorage`, and synchronizes authenticated changes through operation-specific API routes.

The interface includes dashboards and management views for announcements, calendars, call-ups, attendance, results, people, teams, documents, conversations, notifications, and settings. Its PWA manifest allows installation in supported browsers. The service worker currently applies a network-first fetch strategy with a cache fallback, but it does not pre-cache an offline application shell.

Browser notifications are created with the Web Notifications API while the application is running and permission has been granted. They are not remote push notifications.

### Backend

`server.js` serves the static application and exposes JSON API routes for login, logout, state synchronization, domain operations, uploads, backups, diagnostics, and selected federation data imports.

The server stores application state in a JSON file and writes it atomically. It also creates rotating JSON backups and stores uploaded files under the configured data directory. On first use of an empty data directory, it copies the bundled demonstration state.

Authentication sessions are kept in server memory and expire after a configurable period. Passwords created or updated through the current server flow use PBKDF2 with a per-password salt. The code also supports migration from legacy plain-text values present in older state files.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later.
- A modern web browser.
- Git, if you want to clone the repository.

No database or package installation is required for the current prototype.

## Run locally

```bash
git clone https://github.com/tommysoeder/KamikApp.git
cd KamikApp
npm start
```

Open `http://localhost:4173` in a browser. Because the default host is `0.0.0.0`, the server also prints local-network addresses that can be used from another device on the same network. If port `4173` is occupied, it tries the next available port, up to 20 additional ports.

On Windows, `start-kamikapp.bat` provides an alternative launcher:

```bat
start-kamikapp.bat
```

The repository includes demonstration accounts and content in `data/state.json`. Treat them as sample data only and replace them before any real-world evaluation.

## Environment variables

All variables are optional because the server provides defaults. `.env.example` documents the intended settings, but the application does **not** load `.env` files automatically. Set variables in the shell or hosting environment before starting the server.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4173` | First HTTP port to try. |
| `HOST` | `0.0.0.0` | Network interface used by the server. |
| `DATA_DIR` | `./data` locally | Directory for state, backups, and uploads. |
| `SESSION_TTL_HOURS` | `168` | Session lifetime in hours. |
| `APP_MODE` | `beta` | Runtime mode exposed to the client. |
| `APP_LABEL` | `Beta privada` in beta mode | Label displayed for the current environment. |
| `PRESENTATION_DEMO` | disabled in beta/production | Enables presentation-specific behavior when set to `1` outside beta/production. |
| `SHOW_LOGIN_PROFILES` | `0` | Shows selectable profiles on the login screen when set to `1`. |
| `MAX_UPLOAD_MB` | `30` in server code | Maximum accepted upload size in megabytes. |
| `BACKUP_KEEP` | `120` | Maximum number of automatic backup files retained. |

Example for a POSIX shell:

```bash
PORT=4300 DATA_DIR=./local-data APP_LABEL="Local prototype" npm start
```

Example for PowerShell:

```powershell
$env:PORT = "4300"
$env:DATA_DIR = ".\local-data"
$env:APP_LABEL = "Local prototype"
npm start
```

These examples contain no credentials.

## Checks

Run the repository's automated checks with:

```bash
npm run check
```

This command checks JavaScript syntax and runs the application smoke test, server route test, and virtual visual smoke test.

Additional preparation and launch checks are documented under `docs/`. Some of those utilities intentionally modify the selected state directory, so review their purpose before running them against data you want to keep.

## Current status and limitations

KamikApp is a developed prototype for local evaluation. It is not deployed, has no production users, and has not been validated under real club workloads.

Current technical limitations include:

- The whole application state is stored in a local JSON file rather than a managed database.
- Uploaded files and backups use local disk storage.
- Sessions are held in one Node.js process and are lost when that process restarts.
- The project has no email provider; email-shaped notifications are only added to a pending outbox in application state.
- Browser notifications require the application to be open and do not use a server push service.
- The service worker has no explicit pre-cache list, so offline availability depends on resources already present in the browser cache.
- Federation imports depend on external HTML formats and may need connector-specific maintenance.
- The included deployment configuration and beta documentation represent preparation work, not evidence of a live deployment.
- Production security, privacy, recovery, monitoring, scaling, and permission behavior still require dedicated review and testing.

## Planned work

The repository and launch notes identify the following next steps:

- Replace JSON persistence with a managed database.
- Move uploads to external object storage.
- Add a real email delivery integration and server-driven push notifications.
- Add password recovery and stronger account administration flows.
- Deploy behind HTTPS with a production domain and operational monitoring.
- Harden federation data connectors and failure handling.
- Audit permissions and security with realistic pilot scenarios.
- Validate usability and workflows with an actual club pilot before claiming production readiness.

## Credits

KamikApp is a personal project created and maintained by [tommysoeder](https://github.com/tommysoeder).

AI tools were used to help review the repository and improve this documentation. The technical claims in this README were checked against the project files; this statement does not attribute AI use to parts of the implementation for which the repository provides no such record.
