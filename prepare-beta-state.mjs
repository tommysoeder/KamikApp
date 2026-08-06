import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const dataDir = process.env.DATA_DIR || path.join(root, "data");
const stateFile = path.join(dataDir, "state.json");
const backupDir = path.join(dataDir, "backups");
const betaStateFile = path.join(dataDir, "state.beta.json");
const betaCredentialsFile = path.join(dataDir, "beta-credentials.txt");
const apply = process.argv.includes("--apply");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.pbkdf2Sync(String(password || ""), salt, 120000, 32, "sha256").toString("hex");
  return { passwordHash, passwordSalt: salt };
}

function tempPassword() {
  return crypto.randomBytes(6).toString("base64url");
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function clearDemoState(state) {
  const next = JSON.parse(JSON.stringify(state));
  next.events = [];
  next.trainings = [];
  next.callups = [];
  next.results = [];
  next.announcements = [];
  next.documents = [];
  next.documentFolders = [];
  next.notifications = [];
  next.readAnnouncementIds = [];
  next.threads = [];
  next.auditLog = [
    {
      id: `audit-${Date.now()}`,
      at: new Date().toISOString(),
      action: "preparar beta",
      area: "sistema",
      title: "Estado beta limpio generado",
      details: { source: "prepare-beta-state.mjs" },
    },
  ];
  next.activeDocumentTeamId = "";
  next.activeDocumentFolderId = "";
  next.activeThreadId = "";
  next.resultsCursor = new Date().toISOString().slice(0, 10);
  next.calendarCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
  next.toast = "";
  next.mobileMenuOpen = false;
  next.globalSearchOpen = false;
  next.diagnostics = null;
  next.lastUndo = null;
  next.betaPreparedAt = new Date().toISOString();
  return next;
}

function rotatePasswords(state) {
  const credentials = [];
  state.users = (state.users || []).map((user) => {
    if (user.disabled) return user;
    const password = tempPassword();
    credentials.push(`${user.email}  ${password}  ${user.name}`);
    const { password: _plain, ...safeUser } = user;
    return { ...safeUser, ...hashPassword(password) };
  });
  return credentials;
}

if (!fs.existsSync(stateFile)) fail(`No existe ${stateFile}`);

fs.mkdirSync(backupDir, { recursive: true });
const backupFile = path.join(backupDir, `pre-beta-${stamp()}.json`);
fs.copyFileSync(stateFile, backupFile);

const source = JSON.parse(fs.readFileSync(stateFile, "utf8"));
const betaState = clearDemoState(source);
const credentials = rotatePasswords(betaState);

fs.writeFileSync(betaStateFile, `${JSON.stringify(betaState, null, 2)}\n`);
fs.writeFileSync(
  betaCredentialsFile,
  [
    "KamikApp - credenciales temporales beta",
    `Generadas: ${new Date().toISOString()}`,
    "",
    "Cambia estas contrasenas desde Usuarios tras entrar en la beta.",
    "",
    ...credentials,
    "",
  ].join("\n")
);

if (apply) {
  fs.copyFileSync(betaStateFile, stateFile);
}

console.log(`OK: backup creado en ${backupFile}`);
console.log(`OK: estado beta creado en ${betaStateFile}`);
console.log(`OK: credenciales creadas en ${betaCredentialsFile}`);
if (apply) console.log(`OK: beta aplicada en ${stateFile}`);
else console.log("INFO: ejecuta npm run beta:apply para sustituir state.json por la beta limpia.");
