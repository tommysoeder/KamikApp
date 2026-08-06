import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const dataDir = process.env.DATA_DIR || path.join(root, "data");
const stateFile = path.join(dataDir, "state.json");
const betaStateFile = path.join(dataDir, "state.beta.json");
const uploadDir = path.join(dataDir, "uploads");
const backupDir = path.join(dataDir, "backups");
const appMode = String(process.env.APP_MODE || "presentation").toLowerCase();

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`OK: ${message}`);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.pbkdf2Sync(String(password || ""), salt, 120000, 32, "sha256").toString("hex");
  return { passwordHash, passwordSalt: salt };
}

if (!fs.existsSync(stateFile)) {
  fail(`No existe ${stateFile}. Arranca la app y guarda un estado inicial antes de lanzar.`);
} else {
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  const summary = {
    users: state.users?.length || 0,
    teams: state.teams?.length || 0,
    players: state.players?.length || 0,
    events: (state.events?.length || 0) + (state.trainings?.length || 0) + (state.callups?.length || 0),
    results: state.results?.length || 0,
    documents: state.documents?.length || 0,
  };
  ok(`Estado cargado: ${summary.users} usuarios, ${summary.teams} equipos, ${summary.players} jugadores, ${summary.events} eventos, ${summary.results} resultados, ${summary.documents} documentos.`);
  if (!summary.users || !summary.teams || !summary.players) fail("Faltan usuarios, equipos o jugadores base.");
  if (appMode === "beta" || appMode === "production") {
    const liveItems =
      (state.events?.length || 0) +
      (state.trainings?.length || 0) +
      (state.callups?.length || 0) +
      (state.results?.length || 0) +
      (state.announcements?.length || 0) +
      (state.documents?.length || 0);
    if (liveItems) console.log(`INFO: El estado contiene ${liveItems} elementos publicados. Si son demo, ejecuta npm run beta:apply antes de subir.`);
  }
  const plainUsers = (state.users || []).filter((user) => user.password && !user.passwordHash);
  if (plainUsers.length) {
    fs.mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(stateFile, path.join(backupDir, `pre-launch-password-migration-${stamp}.json`));
    state.users = state.users.map((user) => {
      if (!user.password || user.passwordHash) return user;
      const { password, ...safeUser } = user;
      return { ...safeUser, ...hashPassword(password) };
    });
    fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);
    ok(`${plainUsers.length} contrasena${plainUsers.length === 1 ? "" : "s"} migrada${plainUsers.length === 1 ? "" : "s"} a hash con backup previo.`);
  }
}

fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(backupDir, { recursive: true });
ok(`Carpetas listas: ${uploadDir} y ${backupDir}`);

const backups = fs.existsSync(backupDir) ? fs.readdirSync(backupDir).filter((name) => name.endsWith(".json")).length : 0;
console.log(`Backups disponibles: ${backups}`);

if (!process.env.SESSION_TTL_HOURS) {
  console.log("INFO: SESSION_TTL_HOURS no definido; se usaran 24 horas.");
}
if (appMode === "beta") {
  if (!fs.existsSync(betaStateFile)) console.log("INFO: No existe data/state.beta.json. Ejecuta npm run beta:prepare antes de subir la beta.");
  if (process.env.SHOW_LOGIN_PROFILES !== "0") console.log("INFO: En beta publica se recomienda SHOW_LOGIN_PROFILES=0.");
  if (process.env.PRESENTATION_DEMO !== "0") console.log("INFO: En beta publica se recomienda PRESENTATION_DEMO=0.");
}
