const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || (process.env.RENDER ? path.join("/var", "data", "kamikapp") : path.join(ROOT, "data"));
const STATE_FILE = path.join(DATA_DIR, "state.json");
const BUNDLED_STATE_FILE = path.join(ROOT, "data", "state.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const APP_VERSION = "v202";
const APP_MODE = String(process.env.APP_MODE || "beta").toLowerCase();
const APP_LABEL = process.env.APP_LABEL || (APP_MODE === "beta" ? "Beta privada" : "");
const SHOW_LOGIN_PROFILES = process.env.SHOW_LOGIN_PROFILES === "1";
const PRESENTATION_DEMO = process.env.PRESENTATION_DEMO !== "0" && APP_MODE !== "beta" && APP_MODE !== "production";
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_HOURS || 168) * 60 * 60 * 1000;
const sessions = new Map();
const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_MB || 30) * 1024 * 1024;
const BACKUP_KEEP = Number(process.env.BACKUP_KEEP || 120);
const ALLOWED_UPLOAD_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf", "video/mp4", "video/quicktime", "video/webm"]);
let lastEventPatch = null;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".svg": "image/svg+xml",
};

function securityHeaders(extra = {}) {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    ...extra,
  };
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, securityHeaders(headers));
  res.end(body);
}

function clientConfig() {
  return {
    version: APP_VERSION,
    mode: APP_MODE,
    label: APP_LABEL,
    presentationDemo: PRESENTATION_DEMO,
    showLoginProfiles: SHOW_LOGIN_PROFILES,
    maxUploadMb: Math.round(MAX_UPLOAD_BYTES / 1024 / 1024),
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 50_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function safeStaticPath(urlPath) {
  const pathname = decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath);
  const filePath = path.normalize(path.join(ROOT, pathname));
  return filePath.startsWith(ROOT) ? filePath : null;
}

function writeStateAtomically(body) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  if (fs.existsSync(STATE_FILE)) {
    createServerBackup("auto");
  }
  const tmpFile = `${STATE_FILE}.tmp`;
  fs.writeFileSync(tmpFile, body);
  fs.renameSync(tmpFile, STATE_FILE);
}

function readSavedState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return null;
  }
}

function readBundledState() {
  if (!fs.existsSync(BUNDLED_STATE_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(BUNDLED_STATE_FILE, "utf8"));
  } catch {
    return null;
  }
}

function ensureSavedState() {
  const saved = readSavedState();
  if (saved) return saved;
  const bundled = readBundledState();
  if (!bundled) return null;
  writeStateAtomically(JSON.stringify(bundled));
  return readSavedState() || bundled;
}

function authToken(req) {
  const header = String(req.headers.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

function sessionForRequest(req) {
  const token = authToken(req);
  if (!token) return null;
  const session = sessions.get(token) || null;
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return null;
  }
  session.lastSeenAt = Date.now();
  return session;
}

function actorFromRequest(req, baseState) {
  const session = sessionForRequest(req);
  const userId = session?.userId || String(req.headers["x-kamik-user"] || "");
  const role = String(req.headers["x-kamik-role"] || "");
  const operation = String(req.headers["x-kamik-operation"] || "general");
  const user = (baseState?.users || []).find((item) => item.id === userId);
  return { userId, role, operation, user, authenticated: Boolean(session) };
}

function hasRole(user, role) {
  return Boolean(user?.roles?.includes(role));
}

function comparableName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isExecutive(user) {
  return hasRole(user, "director");
}

function staffTeamIds(user, state) {
  if (!user || !state) return [];
  if (isExecutive(user)) return (state.teams || []).map((team) => team.id);
  if (hasRole(user, "president")) return (state.teams || []).map((team) => team.id);
  if (hasRole(user, "fees")) return (state.teams || []).map((team) => team.id);
  const ids = new Set((state.teams || [])
    .filter((team) => (hasRole(user, "coach") && team.coachId === user.id) || (hasRole(user, "delegate") && team.delegateId === user.id))
    .map((team) => team.id));
  if (hasRole(user, "coach")) {
    (state.callups || []).filter((callup) => callup.coachId === user.id && callup.teamId).forEach((callup) => ids.add(callup.teamId));
  }
  return [...ids];
}

function permissionKey(operation, role) {
  const map = {
    publishAnnouncement: { president: "presidentCanAnnouncements", coach: "coachCanAnnouncements", delegate: "delegateCanAnnouncements", fees: "feesCanAnnouncements" },
    manageEvents: { president: "presidentCanEvents", coach: "coachCanEvents" },
    manageCallup: { president: "presidentCanCallups", coach: "coachCanCallups" },
    attendance: { coach: "coachCanAttendance", delegate: "delegateCanAttendance", parent: true, player: true },
    manageResults: { president: "presidentCanResults", coach: "coachCanResults" },
    manageProfiles: { president: "presidentCanProfiles", coach: true, delegate: true, fees: "feesCanProfiles" },
    messageClub: { president: "presidentCanMessages", coach: true, delegate: true, fees: "feesCanMessages", parent: true, player: true },
    markRead: { president: true, coach: true, delegate: true, fees: true, parent: true, player: true },
    updateSelf: { president: true, coach: true, delegate: true, fees: true, parent: true, player: true },
    importMembers: { president: "presidentCanImportMembers", coach: "coachCanImportMembers", delegate: "delegateCanImportMembers", fees: "feesCanImportMembers" },
    exportData: { president: "presidentCanExportData", coach: "coachCanExportData", delegate: "delegateCanExportData", fees: "feesCanExportData" },
    backupData: { president: "presidentCanBackupData", coach: "coachCanBackupData", delegate: "delegateCanBackupData", fees: "feesCanBackupData" },
    restoreData: { president: "presidentCanRestoreData", coach: "coachCanRestoreData", delegate: "delegateCanRestoreData", fees: "feesCanRestoreData" },
    undoBulk: { president: "presidentCanUndoBulk", coach: "coachCanUndoBulk", delegate: "delegateCanUndoBulk", fees: "feesCanUndoBulk" },
    uploadDocument: { president: "presidentCanDocuments", coach: "coachCanDocuments", delegate: "delegateCanDocuments", fees: "feesCanDocuments" },
    editTeam: { president: "presidentCanTeams", coach: "coachCanTeams", fees: "feesCanTeams" },
  };
  return map[operation] ? map[operation][role] ?? false : undefined;
}

function canPerformOperation(actor, baseState) {
  if (!baseState || !actor.user) return true;
  if (!actor.authenticated) return false;
  if (isExecutive(actor.user)) return true;
  if (actor.role && !hasRole(actor.user, actor.role)) return false;
  if (["managePermissions", "manageUsers", "cleanDemo"].includes(actor.operation)) return false;
  const key = permissionKey(actor.operation, actor.role);
  if (key === undefined) return true;
  if (key === true) return true;
  return typeof key === "string" ? Boolean(baseState.permissions?.[key]) : false;
}

function requireOperation(req, res, operation, baseState = readSavedState()) {
  const actor = actorFromRequest(req, baseState);
  if (!canPerformOperation({ ...actor, operation }, baseState)) {
    send(res, 403, JSON.stringify({ error: "Operación no permitida para este rol" }), { "Content-Type": types[".json"] });
    return null;
  }
  return actor;
}

function stateForLogin() {
  return ensureSavedState();
}

function publicUser(user) {
  const { password, passwordHash, passwordSalt, ...safeUser } = user;
  return { ...safeUser, password: "" };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.pbkdf2Sync(normalizeLoginPassword(password), salt, 120000, 32, "sha256").toString("hex");
  return { passwordHash, passwordSalt: salt };
}

function normalizeLoginPassword(password) {
  return String(password || "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
}

function verifyPassword(user, password) {
  const normalizedPassword = normalizeLoginPassword(password);
  if (user.passwordHash && user.passwordSalt) {
    const { passwordHash } = hashPassword(normalizedPassword, user.passwordSalt);
    return crypto.timingSafeEqual(Buffer.from(passwordHash, "hex"), Buffer.from(user.passwordHash, "hex"));
  }
  return normalizeLoginPassword(user.password) === normalizedPassword;
}

function playerIdsForUser(user, state) {
  if (!user || !state) return [];
  if (isExecutive(user)) return (state.players || []).map((player) => player.id);
  if (hasRole(user, "president")) return (state.players || []).map((player) => player.id);
  if (hasRole(user, "fees")) return (state.players || []).map((player) => player.id);
  if (hasRole(user, "coach") || hasRole(user, "delegate")) {
    const teams = staffTeamIds(user, state);
    return (state.players || []).filter((player) => (player.teams || []).some((teamId) => teams.includes(teamId))).map((player) => player.id);
  }
  const ids = new Set([...(user.children || [])]);
  if (user.playerId) ids.add(user.playerId);
  const userNameKey = comparableName(user.name);
  (state.players || [])
    .filter((player) => player.userId === user.id || (userNameKey && comparableName(player.name) === userNameKey))
    .forEach((player) => ids.add(player.id));
  return [...ids];
}

function teamIdsForUser(user, state) {
  if (!user || !state) return [];
  if (isExecutive(user)) return (state.teams || []).map((team) => team.id);
  if (hasRole(user, "president")) return (state.teams || []).map((team) => team.id);
  if (hasRole(user, "fees")) return (state.teams || []).map((team) => team.id);
  if (hasRole(user, "coach") || hasRole(user, "delegate")) return staffTeamIds(user, state);
  const players = new Set(playerIdsForUser(user, state));
  return [
    ...new Set(
      (state.players || [])
        .filter((player) => players.has(player.id))
        .flatMap((player) => player.teams || [])
    ),
  ];
}

function itemTeamIds(item) {
  const ids = [...(item?.teamIds || []), item?.teamId || ""].filter(Boolean);
  return [...new Set(ids)];
}

function canReadAnnouncement(announcement, user, visibleTeamIds) {
  if (!announcement) return false;
  if (announcement.targetType === "all") return true;
  if (announcement.targetType === "role") return (announcement.targetIds || []).some((role) => hasRole(user, role));
  if (announcement.targetType === "team") return (announcement.targetIds || []).some((teamId) => visibleTeamIds.includes(teamId));
  return true;
}

function serverMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

function normalizeServerCalendarCursor(state) {
  if (!state) return state;
  const currentMonth = serverMonthKey();
  if (!state.calendarCursor || state.calendarCursor < currentMonth) state.calendarCursor = currentMonth;
  return state;
}

function sanitizeStateForRead(state, actor) {
  if (!state) return state;
  const copy = JSON.parse(JSON.stringify(state));
  normalizeServerCalendarCursor(copy);
  copy.users = (copy.users || []).map(publicUser);
  if (!actor?.authenticated || !actor.user) {
    copy.users = [];
    copy.teams = [];
    copy.players = [];
    copy.events = [];
    copy.trainings = [];
    copy.callups = [];
    copy.results = [];
    copy.documents = [];
    copy.documentFolders = [];
    copy.announcements = [];
    copy.notifications = [];
    copy.emailOutbox = [];
    copy.threads = [];
    copy.auditLog = [];
    return copy;
  }
  if (isExecutive(actor.user)) return copy;

  const visiblePlayerIds = playerIdsForUser(actor.user, state);
  const visibleTeamIds = teamIdsForUser(actor.user, state);
  const visiblePlayers = new Set(visiblePlayerIds);
  const visibleTeams = new Set(visibleTeamIds);
  (state.callups || [])
    .filter((callup) => callup.coachId === actor.user.id)
    .forEach((callup) => {
      if (callup.teamId) visibleTeams.add(callup.teamId);
      (callup.playerIds || []).forEach((playerId) => visiblePlayers.add(playerId));
    });
  const staffUserIds = new Set(
    (state.users || [])
      .filter((user) => (user.roles || []).some((role) => ["director", "coach", "delegate", "fees", "president"].includes(role)))
      .map((user) => user.id)
  );
  const linkedUserIds = new Set([actor.user.id, ...staffUserIds]);
  if (hasRole(actor.user, "coach") || hasRole(actor.user, "delegate") || hasRole(actor.user, "fees") || hasRole(actor.user, "president")) {
    (state.users || []).filter((user) => !user.disabled).forEach((user) => linkedUserIds.add(user.id));
  }
  (state.players || [])
    .filter((player) => visiblePlayers.has(player.id))
    .forEach((player) => {
      if (player.userId) linkedUserIds.add(player.userId);
      (player.guardians || []).forEach((id) => linkedUserIds.add(id));
    });

  copy.users = copy.users.filter((user) => linkedUserIds.has(user.id));
  copy.teams = (copy.teams || []).filter((team) => visibleTeams.has(team.id));
  copy.players = (copy.players || []).filter((player) => visiblePlayers.has(player.id));
  copy.events = (copy.events || []).filter((event) => {
    const teamIds = itemTeamIds(event);
    return event.coachId === actor.user.id || !teamIds.length || teamIds.some((teamId) => visibleTeams.has(teamId)) || (event.playerIds || []).some((id) => visiblePlayers.has(id));
  });
  copy.trainings = (copy.trainings || []).filter((training) => !training.teamId || visibleTeams.has(training.teamId) || (training.playerIds || []).some((id) => visiblePlayers.has(id)));
  copy.callups = (copy.callups || []).filter((callup) => callup.coachId === actor.user.id || !callup.teamId || visibleTeams.has(callup.teamId) || (callup.playerIds || []).some((id) => visiblePlayers.has(id)));
  copy.results = (copy.results || []).filter((result) => visibleTeams.has(result.teamId));
  copy.documents = (copy.documents || []).filter((document) => visibleTeams.has(document.teamId));
  copy.documentFolders = (copy.documentFolders || []).filter((folder) => visibleTeams.has(folder.teamId));
  copy.announcements = (copy.announcements || []).filter((announcement) => canReadAnnouncement(announcement, actor.user, visibleTeamIds));
  copy.notifications = (copy.notifications || []).filter((notice) => !notice.userId || notice.userId === actor.user.id);
  copy.threads = (copy.threads || []).filter(
    (thread) =>
      thread.assignedToId === actor.user.id ||
      (thread.participantUserIds || []).includes(actor.user.id) ||
      (thread.relatedPlayerIds || []).some((id) => visiblePlayers.has(id))
  );
  copy.emailOutbox = [];
  copy.auditLog = [];
  return copy;
}

function preserveHiddenPasswords(beforeState, afterState) {
  if (!beforeState || !afterState?.users) return afterState;
  const previousById = new Map((beforeState.users || []).map((user) => [user.id, user]));
  afterState.users = afterState.users.map((user) => {
    const previous = previousById.get(user.id);
    if (user.password) {
      if (previous?.password === user.password) return { ...user };
      const hashed = hashPassword(user.password);
      const { password, ...safeUser } = user;
      return { ...safeUser, ...hashed };
    }
    if (user.passwordHash && user.passwordSalt) return user;
    if (previous?.passwordHash && previous?.passwordSalt) return { ...user, passwordHash: previous.passwordHash, passwordSalt: previous.passwordSalt };
    return previous?.password ? { ...user, ...hashPassword(previous.password) } : user;
  });
  return afterState;
}

function loginUser(payload) {
  const state = stateForLogin();
  if (!state) return { error: "No saved state yet", status: 404 };
  const email = String(payload.email || "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim().toLowerCase();
  const password = normalizeLoginPassword(payload.password);
  const requestedUserId = String(payload.userId || "");
  const matches = (state.users || []).filter((item) => {
    if (item.disabled) return false;
    return String(item.email || "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim().toLowerCase() === email && verifyPassword(item, password);
  });
  const user = matches.find((item) => item.id === requestedUserId) || matches[0];
  if (!user) return { error: "Email o contraseña incorrectos", status: 401 };
  const loginAt = new Date().toISOString();
  user.lastLoginAt = loginAt;
  user.loginCount = Number(user.loginCount || 0) + 1;
  if (!user.passwordHash && user.password) {
    Object.assign(user, hashPassword(user.password));
    delete user.password;
  }
  writeStateAtomically(JSON.stringify(state));
  const token = crypto.randomUUID();
  sessions.set(token, { userId: user.id, createdAt: Date.now() });
  const initialState = sanitizeStateForRead(state, {
    userId: user.id,
    role: user.roles?.[0] || "parent",
    operation: "readState",
    user,
    authenticated: true,
  });
  return {
    token,
    userId: user.id,
    email: user.email,
    activeRole: user.roles?.[0] || "parent",
    user: publicUser(user),
    state: initialState,
  };
}

function stable(value) {
  return JSON.stringify(value || null);
}

function permissionsChanged(beforeState, afterState) {
  return stable(beforeState?.permissions) !== stable(afterState?.permissions);
}

function userSecuritySignature(state) {
  return (state?.users || [])
    .map((user) => ({
      id: user.id,
      email: user.email,
      roles: user.roles || [],
      password: user.password || "",
      passwordHash: user.passwordHash || "",
      passwordSalt: user.passwordSalt || "",
      disabled: Boolean(user.disabled),
      playerId: user.playerId || "",
      children: user.children || [],
    }))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

function userSecurityChanged(beforeState, afterState) {
  return stable(userSecuritySignature(beforeState)) !== stable(userSecuritySignature(afterState));
}

const domainOperations = {
  permissions: ["managePermissions", "restoreData", "undoBulk"],
  announcements: ["publishAnnouncement", "cleanDemo", "restoreData", "undoBulk"],
  events: ["manageEvents", "manageCallup", "cleanDemo", "restoreData", "undoBulk"],
  trainings: ["manageEvents", "attendance", "cleanDemo", "restoreData", "undoBulk"],
  callups: ["manageCallup", "attendance", "manageEvents", "cleanDemo", "restoreData", "undoBulk"],
  results: ["manageResults", "uploadDocument", "cleanDemo", "restoreData", "undoBulk"],
  seasons: ["manageResults", "restoreData", "undoBulk"],
  competitions: ["manageResults", "restoreData", "undoBulk"],
  documents: ["uploadDocument", "cleanDemo", "restoreData", "undoBulk"],
  documentFolders: ["uploadDocument", "cleanDemo", "restoreData", "undoBulk"],
  teams: ["manageUsers", "editTeam", "importMembers", "manageProfiles", "restoreData", "undoBulk"],
  players: ["manageProfiles", "importMembers", "editTeam", "manageUsers", "restoreData", "undoBulk"],
  users: ["manageUsers", "importMembers", "manageProfiles", "updateSelf", "restoreData", "undoBulk"],
  threads: ["messageClub", "markRead", "restoreData", "undoBulk"],
  notifications: ["markRead", "cleanDemo", "manageEvents", "manageCallup", "uploadDocument", "publishAnnouncement", "restoreData", "undoBulk"],
  readAnnouncementIds: ["markRead", "cleanDemo", "publishAnnouncement", "restoreData", "undoBulk"],
  activeDocumentTeamId: ["cleanDemo", "uploadDocument", "restoreData", "undoBulk"],
  activeDocumentFolderId: ["cleanDemo", "uploadDocument", "restoreData", "undoBulk"],
  resultsCursor: ["cleanDemo", "manageResults", "restoreData", "undoBulk"],
  calendarCursor: ["cleanDemo", "manageEvents", "manageCallup", "restoreData", "undoBulk"],
};

function changedDomains(beforeState, afterState) {
  return Object.keys(domainOperations).filter((key) => stable(beforeState?.[key]) !== stable(afterState?.[key]));
}

function changedItems(beforeItems = [], afterItems = []) {
  const beforeById = new Map((beforeItems || []).map((item) => [item.id, item]));
  const afterById = new Map((afterItems || []).map((item) => [item.id, item]));
  const items = [];
  afterById.forEach((item, id) => {
    if (stable(beforeById.get(id)) !== stable(item)) items.push(item);
  });
  beforeById.forEach((item, id) => {
    if (!afterById.has(id)) items.push(item);
  });
  return items;
}

function itemWithinTeams(item, teamIds) {
  const ids = itemTeamIds(item);
  return !ids.length || ids.every((teamId) => teamIds.includes(teamId));
}

function playerWithinTeams(player, teamIds) {
  return (player?.teams || []).some((teamId) => teamIds.includes(teamId));
}

function ownAttendanceOnly(actor, beforeState, afterState) {
  if (!actor?.user || isExecutive(actor.user) || hasRole(actor.user, "coach") || hasRole(actor.user, "delegate")) return "";
  const allowedPlayers = new Set(playerIdsForUser(actor.user, beforeState));
  const changedCallups = changedItems(beforeState.callups, afterState.callups);
  const changedTrainings = changedItems(beforeState.trainings, afterState.trainings);
  const unsafeCallup = changedCallups.some((afterCallup) => {
    const beforeCallup = (beforeState.callups || []).find((item) => item.id === afterCallup.id) || {};
    const beforeResponses = beforeCallup.responses || {};
    const afterResponses = afterCallup.responses || {};
    const responseKeys = new Set([...Object.keys(beforeResponses), ...Object.keys(afterResponses)]);
    return [...responseKeys].some((playerId) => !allowedPlayers.has(playerId) && beforeResponses[playerId] !== afterResponses[playerId]);
  });
  if (unsafeCallup) return "Solo puedes confirmar tu propia asistencia";
  const unsafeTraining = changedTrainings.some((afterTraining) => {
    const beforeTraining = (beforeState.trainings || []).find((item) => item.id === afterTraining.id) || {};
    const beforeAbsences = beforeTraining.absences || {};
    const afterAbsences = afterTraining.absences || {};
    const absenceKeys = new Set([...Object.keys(beforeAbsences), ...Object.keys(afterAbsences)]);
    const beforeAttendance = beforeTraining.attendance || {};
    const afterAttendance = afterTraining.attendance || {};
    const attendanceKeys = new Set([...Object.keys(beforeAttendance), ...Object.keys(afterAttendance)]);
    return (
      [...absenceKeys].some((playerId) => !allowedPlayers.has(playerId) && beforeAbsences[playerId] !== afterAbsences[playerId]) ||
      [...attendanceKeys].some((playerId) => !allowedPlayers.has(playerId) && beforeAttendance[playerId] !== afterAttendance[playerId])
    );
  });
  return unsafeTraining ? "Solo puedes marcar tu propia asistencia" : "";
}

function authorizeTeamScope(actor, beforeState, afterState) {
  if (!beforeState || !afterState || !actor.user || isExecutive(actor.user)) return "";
  if (actor.operation === "attendance") return ownAttendanceOnly(actor, beforeState, afterState);
  const teamIds = staffTeamIds(actor.user, beforeState);
  const blocks = [];
  const ensure = (label, items, predicate = itemWithinTeams) => {
    if ((items || []).some((item) => !predicate(item, teamIds))) blocks.push(label);
  };
  if (actor.operation === "manageEvents") {
    ensure("eventos", changedItems(beforeState.events, afterState.events));
    ensure("entrenos", changedItems(beforeState.trainings, afterState.trainings));
  }
  if (actor.operation === "manageCallup") {
    ensure("convocatorias", changedItems(beforeState.callups, afterState.callups));
    ensure("eventos vinculados", changedItems(beforeState.events, afterState.events));
  }
  if (actor.operation === "manageResults") {
    ensure("resultados", changedItems(beforeState.results, afterState.results));
  }
  if (actor.operation === "uploadDocument") {
    ensure("archivos", changedItems(beforeState.documents, afterState.documents));
    ensure("carpetas", changedItems(beforeState.documentFolders, afterState.documentFolders));
    ensure("galerias", changedItems(beforeState.results, afterState.results));
  }
  if (actor.operation === "editTeam") {
    ensure("equipos", changedItems(beforeState.teams, afterState.teams));
    ensure("jugadores", changedItems(beforeState.players, afterState.players), playerWithinTeams);
  }
  if (actor.operation === "manageProfiles") {
    ensure("perfiles", changedItems(beforeState.players, afterState.players), playerWithinTeams);
  }
  return blocks.length ? `No puedes modificar ${blocks.join(", ")} fuera de tus equipos` : "";
}

function authorizeSelfUpdate(actor, beforeState, afterState) {
  if (!actor?.user || !beforeState || !afterState) return "Operación no permitida para este rol";
  const beforeUsers = beforeState.users || [];
  const afterUsers = afterState.users || [];
  if (beforeUsers.length !== afterUsers.length) return "Solo puedes modificar tu propio perfil";
  const beforeById = new Map(beforeUsers.map((user) => [user.id, user]));
  const afterById = new Map(afterUsers.map((user) => [user.id, user]));
  for (const [id, beforeUser] of beforeById) {
    const afterUser = afterById.get(id);
    if (!afterUser) return "Solo puedes modificar tu propio perfil";
    if (id !== actor.user.id && stable(publicUser(beforeUser)) !== stable(publicUser(afterUser))) return "Solo puedes modificar tu propio perfil";
  }
  const beforeSelf = beforeById.get(actor.user.id);
  const afterSelf = afterById.get(actor.user.id);
  if (!beforeSelf || !afterSelf) return "Solo puedes modificar tu propio perfil";
  const lockedBefore = {
    id: beforeSelf.id,
    roles: beforeSelf.roles || [],
    disabled: Boolean(beforeSelf.disabled),
    playerId: beforeSelf.playerId || "",
    children: beforeSelf.children || [],
  };
  const lockedAfter = {
    id: afterSelf.id,
    roles: afterSelf.roles || [],
    disabled: Boolean(afterSelf.disabled),
    playerId: afterSelf.playerId || "",
    children: afterSelf.children || [],
  };
  return stable(lockedBefore) === stable(lockedAfter) ? "" : "Solo puedes modificar tus datos personales";
}

function authorizeChangedDomains(actor, beforeState, afterState) {
  if (!beforeState) return "";
  const changed = changedDomains(beforeState, afterState);
  const blocked = changed.filter((domain) => !domainOperations[domain].includes(actor.operation));
  return blocked.length ? `Operación ${actor.operation} no puede modificar: ${blocked.join(", ")}` : "";
}

function authorizeStateWrite(req, nextState) {
  const baseState = readSavedState();
  const actor = actorFromRequest(req, baseState || nextState);
  if (!canPerformOperation(actor, baseState || nextState)) return "Operación no permitida para este rol";
  if (actor.operation === "updateSelf") return authorizeSelfUpdate(actor, baseState, nextState);
  const domainError = authorizeChangedDomains(actor, baseState, nextState);
  if (domainError) return domainError;
  const scopeError = authorizeTeamScope(actor, baseState, nextState);
  if (scopeError) return scopeError;
  if (baseState && permissionsChanged(baseState, nextState) && !isExecutive(actor.user)) {
    return "Solo dirección puede modificar permisos";
  }
  if (baseState && userSecurityChanged(baseState, nextState) && !isExecutive(actor.user) && !["importMembers", "manageProfiles", "restoreData", "undoBulk"].includes(actor.operation)) {
    return "Solo dirección puede gestionar usuarios";
  }
  return "";
}

const stateWriteRoutes = {
  "/api/announcements": "publishAnnouncement",
  "/api/attendance": "attendance",
  "/api/backups/restore": "restoreData",
  "/api/season/clean": "cleanDemo",
  "/api/callups": "manageCallup",
  "/api/events": "manageEvents",
  "/api/files/meta": "uploadDocument",
  "/api/members/import": "importMembers",
  "/api/messages": "messageClub",
  "/api/me": "updateSelf",
  "/api/read-state": "markRead",
  "/api/operations/undo": "undoBulk",
  "/api/permissions": "managePermissions",
  "/api/profiles": "manageProfiles",
  "/api/results": "manageResults",
  "/api/teams": "editTeam",
  "/api/users": "manageUsers",
};

const routedOperations = new Set(Object.values(stateWriteRoutes));

const operationDomains = {
  attendance: ["callups", "trainings"],
  editTeam: ["teams", "players"],
  importMembers: ["teams", "players", "users", "auditLog"],
  manageCallup: ["callups", "events", "notifications", "emailOutbox", "auditLog", "calendarCursor", "activeView"],
  manageEvents: ["events", "trainings", "notifications", "auditLog", "calendarCursor", "activeView"],
  managePermissions: ["permissions", "auditLog"],
  manageProfiles: ["players", "users", "auditLog"],
  manageResults: ["results", "seasons", "competitions", "auditLog", "resultsCursor", "activeSeasonId", "activeCompetitionId", "activeView"],
  manageUsers: ["users", "teams", "players", "auditLog"],
  markRead: ["notifications", "readAnnouncementIds", "threads", "activeThreadId"],
  updateSelf: ["users", "auditLog"],
  cleanDemo: ["events", "trainings", "callups", "results", "announcements", "documents", "documentFolders", "notifications", "readAnnouncementIds", "auditLog", "activeDocumentTeamId", "activeDocumentFolderId", "resultsCursor", "calendarCursor"],
  messageClub: ["threads", "auditLog", "activeThreadId"],
  publishAnnouncement: ["announcements", "readAnnouncementIds", "notifications", "auditLog"],
  restoreData: null,
  undoBulk: null,
  uploadDocument: ["documents", "documentFolders", "results", "notifications", "auditLog", "activeDocumentTeamId", "activeDocumentFolderId"],
};

function mergeCollection(baseItems = [], incomingItems = [], canPrune = () => true) {
  if ([...baseItems, ...incomingItems].every((item) => item === null || typeof item !== "object")) {
    return [...new Set(incomingItems)];
  }
  const incomingById = new Map((incomingItems || []).map((item) => [item.id, item]));
  const removedIds = new Set((baseItems || []).filter((item) => canPrune(item)).map((item) => item.id).filter((id) => !incomingById.has(id)));
  const merged = (baseItems || []).filter((item) => !removedIds.has(item.id)).map((item) => incomingById.get(item.id) || item);
  (incomingItems || []).forEach((item) => {
    if (!(baseItems || []).some((existing) => existing.id === item.id)) merged.push(item);
  });
  return merged;
}

function prunePredicateForKey(key, actor, baseState) {
  if (!actor?.user || isExecutive(actor.user)) return () => true;
  const teamIds = staffTeamIds(actor.user, baseState);
  if (["events", "trainings", "callups", "results", "documents", "documentFolders", "teams"].includes(key)) return (item) => itemWithinTeams(item, teamIds);
  if (key === "players") return (item) => playerWithinTeams(item, teamIds);
  if (["auditLog", "notifications", "threads", "announcements", "users"].includes(key)) return () => false;
  return () => true;
}

function mergeRoutedState(baseState, incomingState, operation, actor) {
  if (!baseState || !incomingState || !operationDomains[operation]) return incomingState;
  const merged = JSON.parse(JSON.stringify(baseState));
  operationDomains[operation].forEach((key) => {
    if (!(key in incomingState)) return;
    if (operation === "markRead" && key === "notifications") {
      merged[key] = mergeNotificationsForMarkRead(merged[key], incomingState[key], actor);
      return;
    }
    if (Array.isArray(incomingState[key]) && Array.isArray(merged[key])) {
      merged[key] = mergeCollection(merged[key], incomingState[key], prunePredicateForKey(key, actor, baseState));
      return;
    }
    merged[key] = incomingState[key];
  });
  return merged;
}

function upsertById(items = [], incoming = []) {
  const byId = new Map((items || []).map((item) => [item.id, item]));
  (incoming || []).forEach((item) => {
    if (item?.id) byId.set(item.id, item);
  });
  return [...byId.values()];
}

function stateNotificationKey(notice = {}) {
  return [
    notice.userId || "",
    notice.playerId || "",
    notice.eventId || "",
    notice.documentId || "",
    notice.announcementId || "",
    notice.threadId || "",
    notice.title || "",
    notice.body || "",
  ].join("|");
}

function dedupeStateNotifications(items = []) {
  const byKey = new Map();
  (items || []).forEach((notice) => {
    const key = stateNotificationKey(notice);
    const existing = byKey.get(key);
    if (!existing || String(notice.createdAt || "") >= String(existing.createdAt || "")) {
      byKey.set(key, notice);
    }
  });
  return [...byKey.values()].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function notificationBelongsToActor(notice, actor) {
  return Boolean(actor?.user?.id && notice?.userId === actor.user.id);
}

function mergeNotificationsForMarkRead(baseItems = [], incomingItems = [], actor) {
  const incomingById = new Map((incomingItems || []).filter((item) => item?.id).map((item) => [item.id, item]));
  const merged = [];
  (baseItems || []).forEach((notice) => {
    const incoming = notice?.id ? incomingById.get(notice.id) : null;
    if (incoming) {
      merged.push(incoming);
      return;
    }
    if (notificationBelongsToActor(notice, actor)) return;
    merged.push(notice);
  });
  const baseIds = new Set((baseItems || []).map((notice) => notice?.id).filter(Boolean));
  (incomingItems || []).forEach((notice) => {
    if (!notice?.id || baseIds.has(notice.id)) return;
    if (!notice.userId || notificationBelongsToActor(notice, actor)) merged.push(notice);
  });
  return dedupeStateNotifications(merged);
}

async function handleEventsPatch(req, res) {
  req.headers["x-kamik-operation"] = "manageEvents";
  const baseState = ensureSavedState();
  const body = JSON.parse((await readBody(req)) || "{}");
  const actor = actorFromRequest(req, baseState);
  lastEventPatch = {
    at: new Date().toISOString(),
    userId: actor.userId || "",
    role: actor.role || "",
    authenticated: Boolean(actor.authenticated),
    incomingEvents: body.events?.length || 0,
    incomingTrainings: body.trainings?.length || 0,
    status: "received",
  };
  const nextState = JSON.parse(JSON.stringify(baseState || {}));
  nextState.events = upsertById(nextState.events, body.events);
  nextState.trainings = upsertById(nextState.trainings, body.trainings);
  nextState.notifications = dedupeStateNotifications(upsertById(nextState.notifications, body.notifications));
  nextState.auditLog = upsertById(body.auditLog || [], nextState.auditLog).slice(0, 120);
  if (body.calendarCursor) nextState.calendarCursor = body.calendarCursor;
  if (body.activeView) nextState.activeView = body.activeView;
  const authorizationError = authorizeStateWrite(req, nextState);
  if (authorizationError) {
    lastEventPatch = { ...lastEventPatch, status: "rejected", error: authorizationError };
    send(res, 403, JSON.stringify({ error: authorizationError }), { "Content-Type": types[".json"] });
    return true;
  }
  writeStateAtomically(JSON.stringify(nextState));
  lastEventPatch = { ...lastEventPatch, status: "saved", events: nextState.events.length, trainings: nextState.trainings.length, stateFileExists: fs.existsSync(STATE_FILE) };
  send(
    res,
    200,
    JSON.stringify({
      ok: true,
      events: nextState.events.length,
      trainings: nextState.trainings.length,
      savedEvents: body.events || [],
      savedTrainings: body.trainings || [],
      lastEventPatch,
    }),
    { "Content-Type": types[".json"] }
  );
  return true;
}

async function handleEventCreate(req, res) {
  req.headers["x-kamik-operation"] = "manageEvents";
  const baseState = ensureSavedState();
  const actor = actorFromRequest(req, baseState);
  const body = JSON.parse((await readBody(req)) || "{}");
  const events = [...(body.events || []), ...(body.event ? [body.event] : [])].filter((item) => item?.id);
  const event = events[0] || null;
  const trainings = [...(body.trainings || []), ...(body.training ? [body.training] : [])].filter((item) => item?.id);
  const incomingItems = [...events, ...trainings].filter(Boolean);
  lastEventPatch = {
    at: new Date().toISOString(),
    userId: actor.userId || "",
    role: actor.role || "",
    authenticated: Boolean(actor.authenticated),
    incomingEvents: events.length,
    incomingTrainings: trainings.length,
    status: "received",
  };
  if (!canPerformOperation({ ...actor, operation: "manageEvents" }, baseState)) {
    lastEventPatch = { ...lastEventPatch, status: "rejected", error: "Operación no permitida para este rol" };
    send(res, 403, JSON.stringify({ error: "Operación no permitida para este rol" }), { "Content-Type": types[".json"] });
    return true;
  }
  if (!incomingItems.length) {
    lastEventPatch = { ...lastEventPatch, status: "rejected", error: "No se ha recibido ningun evento" };
    send(res, 400, JSON.stringify({ error: "No se ha recibido ningun evento" }), { "Content-Type": types[".json"] });
    return true;
  }
  if (!isExecutive(actor.user)) {
    const teamIds = staffTeamIds(actor.user, baseState);
    const outside = incomingItems.some((item) => itemTeamIds(item).some((teamId) => !teamIds.includes(teamId)));
    if (outside) {
      lastEventPatch = { ...lastEventPatch, status: "rejected", error: "No puedes crear eventos fuera de tus equipos" };
      send(res, 403, JSON.stringify({ error: "No puedes crear eventos fuera de tus equipos" }), { "Content-Type": types[".json"] });
      return true;
    }
  }
  const nextState = JSON.parse(JSON.stringify(baseState || {}));
  if (events.length) nextState.events = upsertById(nextState.events, events);
  if (trainings.length) nextState.trainings = upsertById(nextState.trainings, trainings);
  nextState.notifications = dedupeStateNotifications(upsertById(nextState.notifications, body.notifications || []));
  nextState.auditLog = upsertById(body.auditLog || [], nextState.auditLog).slice(0, 120);
  if (body.calendarCursor) nextState.calendarCursor = body.calendarCursor;
  if (body.activeView) nextState.activeView = body.activeView;
  normalizeServerCalendarCursor(nextState);
  writeStateAtomically(JSON.stringify(nextState));
  lastEventPatch = { ...lastEventPatch, status: "saved", events: nextState.events.length, trainings: nextState.trainings.length, stateFileExists: fs.existsSync(STATE_FILE) };
  send(res, 200, JSON.stringify({ ok: true, event, events, trainings, training: trainings[0] || null, lastEventPatch }), { "Content-Type": types[".json"] });
  return true;
}

async function handleStateWrite(req, res, expectedOperation = "") {
  if (expectedOperation) req.headers["x-kamik-operation"] = expectedOperation;
  const requestedOperation = String(req.headers["x-kamik-operation"] || "general");
  if (!expectedOperation && routedOperations.has(requestedOperation)) {
    send(res, 409, JSON.stringify({ error: `Usa la ruta especifica para ${requestedOperation}` }), { "Content-Type": types[".json"] });
    return true;
  }
  const body = await readBody(req);
  const baseState = readSavedState();
  const incomingState = preserveHiddenPasswords(baseState, JSON.parse(body));
  const actor = actorFromRequest(req, baseState || incomingState);
  const nextState = expectedOperation ? mergeRoutedState(baseState, incomingState, requestedOperation, actor) : incomingState;
  const authorizationError = authorizeStateWrite(req, nextState);
  if (authorizationError) {
    send(res, 403, JSON.stringify({ error: authorizationError }), { "Content-Type": types[".json"] });
    return true;
  }
  writeStateAtomically(JSON.stringify(nextState));
  send(res, 200, JSON.stringify({ ok: true, operation: expectedOperation || req.headers["x-kamik-operation"] || "general" }), { "Content-Type": types[".json"] });
  return true;
}

function backupStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function safeBackupLabel(label) {
  return String(label || "manual")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32) || "manual";
}

function createServerBackup(label = "manual") {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  if (!fs.existsSync(STATE_FILE)) return null;
  const name = `state-${backupStamp()}-${safeBackupLabel(label)}.json`;
  const full = path.join(BACKUP_DIR, name);
  fs.copyFileSync(STATE_FILE, full);
  pruneBackups();
  const stats = fs.statSync(full);
  return { id: name, name, size: stats.size, createdAt: stats.mtime.toISOString(), label: safeBackupLabel(label) };
}

function pruneBackups(keep = BACKUP_KEEP) {
  if (!fs.existsSync(BACKUP_DIR)) return;
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((name) => name.startsWith("state-") && name.endsWith(".json"))
    .map((name) => ({ name, full: path.join(BACKUP_DIR, name), time: fs.statSync(path.join(BACKUP_DIR, name)).mtimeMs }))
    .sort((a, b) => b.time - a.time);
  files.slice(keep).forEach((file) => fs.unlinkSync(file.full));
}

function backupFiles() {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs
    .readdirSync(BACKUP_DIR)
    .filter((name) => name.startsWith("state-") && name.endsWith(".json"))
    .map((name) => {
      const full = path.join(BACKUP_DIR, name);
      const stats = fs.statSync(full);
      return { id: name, name, size: stats.size, createdAt: stats.mtime.toISOString() };
    })
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function stateSummary(state) {
  return {
    teams: state?.teams?.length || 0,
    players: state?.players?.length || 0,
    users: state?.users?.length || 0,
    events: (state?.events?.length || 0) + (state?.trainings?.length || 0) + (state?.callups?.length || 0),
    documents: state?.documents?.length || 0,
    results: state?.results?.length || 0,
    audit: state?.auditLog?.length || 0,
  };
}

function dataQualityReport(state) {
  const issues = [];
  const users = state?.users || [];
  const players = state?.players || [];
  const teams = state?.teams || [];
  const documents = state?.documents || [];
  const teamIds = new Set(teams.map((team) => team.id));
  const playerIds = new Set(players.map((player) => player.id));
  const userIds = new Set(users.map((user) => user.id));
  const emailCounts = new Map();
  users.forEach((user) => {
    const email = String(user.email || "").trim().toLowerCase();
    if (!email) return;
    emailCounts.set(email, (emailCounts.get(email) || 0) + 1);
  });
  emailCounts.forEach((count, email) => {
    if (count > 1) issues.push({ level: "error", area: "Usuarios", title: "Email duplicado", detail: `${email} aparece ${count} veces` });
  });
  users.forEach((user) => {
    if ((user.roles || []).includes("player") && user.playerId && !playerIds.has(user.playerId)) {
      issues.push({ level: "error", area: "Usuarios", title: "Jugador vinculado inexistente", detail: `${user.name || user.email} apunta a ${user.playerId}` });
    }
    (user.children || []).forEach((playerId) => {
      if (!playerIds.has(playerId)) issues.push({ level: "error", area: "Familias", title: "Familiar vinculado a jugador inexistente", detail: `${user.name || user.email} apunta a ${playerId}` });
    });
  });
  players.forEach((player) => {
    const assignedTeams = player.teams || [];
    if (!assignedTeams.length) issues.push({ level: "warning", area: "Jugadores", title: "Jugador sin equipo", detail: player.name || player.id });
    assignedTeams.forEach((teamId) => {
      if (!teamIds.has(teamId)) issues.push({ level: "error", area: "Jugadores", title: "Equipo inexistente en ficha", detail: `${player.name || player.id} apunta a ${teamId}` });
    });
  });
  teams.forEach((team) => {
    if (team.coachId && !userIds.has(team.coachId)) issues.push({ level: "error", area: "Equipos", title: "Entrenador inexistente", detail: `${team.name} apunta a ${team.coachId}` });
    if (team.delegateId && !userIds.has(team.delegateId)) issues.push({ level: "error", area: "Equipos", title: "Delegado inexistente", detail: `${team.name} apunta a ${team.delegateId}` });
    if (!team.coachId) issues.push({ level: "warning", area: "Equipos", title: "Equipo sin entrenador", detail: team.name || team.id });
    if (!team.delegateId) issues.push({ level: "info", area: "Equipos", title: "Equipo sin delegado", detail: team.name || team.id });
  });
  documents.forEach((doc) => {
    if (doc.teamId && !teamIds.has(doc.teamId)) issues.push({ level: "error", area: "Archivos", title: "Archivo en equipo inexistente", detail: doc.name || doc.id });
    if (!doc.url) issues.push({ level: "warning", area: "Archivos", title: "Archivo sin URL", detail: doc.name || doc.id });
  });
  const counts = issues.reduce(
    (acc, issue) => {
      acc[issue.level] = (acc[issue.level] || 0) + 1;
      return acc;
    },
    { error: 0, warning: 0, info: 0 }
  );
  return { ok: counts.error === 0, counts, issues: issues.slice(0, 80) };
}

function launchReadinessReport(state, diagnostics = {}) {
  const quality = diagnostics.quality || dataQualityReport(state);
  const users = state?.users || [];
  const players = state?.players || [];
  const teams = state?.teams || [];
  const linkedPlayers = users.filter((user) => (user.roles || []).includes("player") && user.playerId).length;
  const invitedAccounts = users.filter((user) => user.betaInvitedAt).length;
  const testedAccounts = users.filter((user) => user.lastLoginAt).length;
  const acceptedAccounts = users.filter((user) => user.acceptedBetaAt).length;
  const hasFamilies = users.some((user) => (user.roles || []).includes("parent") && (user.children || []).length);
  const staffRoles = new Set(users.flatMap((user) => user.roles || []).filter((role) => ["director", "president", "coach", "delegate", "fees"].includes(role)));
  const items = [
    {
      key: "persistent-data",
      status: diagnostics.stateFile?.exists && diagnostics.writeProbe?.ok ? "ok" : "blocker",
      title: "Datos persistentes",
      detail: diagnostics.stateFile?.exists && diagnostics.writeProbe?.ok ? "El servidor guarda en disco persistente." : "Revisa carpeta persistente y prueba de escritura.",
    },
    {
      key: "backups",
      status: (diagnostics.backups || []).length >= 1 ? "ok" : "warning",
      title: "Backups",
      detail: (diagnostics.backups || []).length >= 1 ? `${diagnostics.backups.length} copias visibles.` : "Crea una copia manual antes de invitar usuarios.",
    },
    {
      key: "quality",
      status: quality.counts.error ? "blocker" : quality.counts.warning ? "warning" : "ok",
      title: "Calidad de datos",
      detail: `${quality.counts.error || 0} criticos, ${quality.counts.warning || 0} avisos.`,
    },
    {
      key: "teams",
      status: teams.length && players.length ? "ok" : "blocker",
      title: "Equipos y jugadores",
      detail: `${teams.length} equipos, ${players.length} jugadores.`,
    },
    {
      key: "accounts",
      status: linkedPlayers >= Math.max(1, Math.ceil(players.length * 0.25)) ? "ok" : "warning",
      title: "Cuentas de jugadores",
      detail: `${invitedAccounts} invitados, ${testedAccounts} entraron, ${acceptedAccounts} aceptaron aviso, ${linkedPlayers}/${players.length} jugadores vinculados.`,
    },
    {
      key: "families",
      status: hasFamilies ? "ok" : "warning",
      title: "Familias",
      detail: hasFamilies ? "Hay familiares vinculados." : "Aun no hay familiares vinculados a jugadores.",
    },
    {
      key: "staff",
      status: staffRoles.has("director") && (staffRoles.has("coach") || staffRoles.has("delegate")) ? "ok" : "warning",
      title: "Roles internos",
      detail: `${[...staffRoles].length} roles de gestion configurados.`,
    },
  ];
  const counts = items.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    { ok: 0, warning: 0, blocker: 0 }
  );
  return { ok: counts.blocker === 0, counts, items };
}

function diagnosticsPayload(req, state) {
  const writeProbe = (() => {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      const probeFile = path.join(DATA_DIR, ".write-probe");
      fs.writeFileSync(probeFile, new Date().toISOString());
      fs.unlinkSync(probeFile);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  })();
  const payload = {
    ok: true,
    name: "KamikApp",
    version: APP_VERSION,
    mode: APP_MODE,
    label: APP_LABEL,
    uptimeSeconds: Math.round(process.uptime()),
    serverTime: new Date().toISOString(),
    dataDir: DATA_DIR,
    writeProbe,
    uploadLimitMb: Math.round(MAX_UPLOAD_BYTES / 1024 / 1024),
    activeSessions: sessions.size,
    sessionTtlHours: Math.round(SESSION_TTL_MS / 60 / 60 / 1000),
    backupKeep: BACKUP_KEEP,
    stateFile: fs.existsSync(STATE_FILE) ? { exists: true, size: fs.statSync(STATE_FILE).size, updatedAt: fs.statSync(STATE_FILE).mtime.toISOString() } : { exists: false },
    lastEventPatch,
    backups: backupFiles().slice(0, 12),
    summary: stateSummary(state),
    actor: actorFromRequest(req, state).userId || "",
  };
  payload.quality = dataQualityReport(state);
  payload.readiness = launchReadinessReport(state, payload);
  return payload;
}

function readBackup(id) {
  const safeId = path.basename(String(id || ""));
  if (!safeId.startsWith("state-") || !safeId.endsWith(".json")) return null;
  const full = path.join(BACKUP_DIR, safeId);
  if (!full.startsWith(BACKUP_DIR) || !fs.existsSync(full)) return null;
  return { id: safeId, body: fs.readFileSync(full, "utf8") };
}

function htmlEntities(text) {
  return String(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(text) {
  return htmlEntities(String(text || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function parseStandingsRowsFromText(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\t| {2,}|;/).map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 3)
    .map((cells, index) => rowFromCells(cells, index))
    .filter((row) => row.team && row.played !== "");
}

function rowFromCells(cells, index) {
  const numericCells = cells.map((cell) => Number(String(cell).replace(/[^\d-]/g, "")));
  const position = Number.isFinite(numericCells[0]) && String(cells[0]).match(/\d/) ? numericCells[0] : index + 1;
  const teamStart = position === numericCells[0] ? 1 : 0;
  const firstNumberIndex = cells.findIndex((cell, idx) => idx >= teamStart && /^-?\d+$/.test(String(cell).replace(/[^\d-]/g, "")));
  const numericTail = cells.slice(firstNumberIndex > -1 ? firstNumberIndex : cells.length).map((cell) => Number(String(cell).replace(/[^\d-]/g, ""))).filter((value) => Number.isFinite(value));
  const team = cells.slice(teamStart, firstNumberIndex > teamStart ? firstNumberIndex : Math.max(teamStart + 1, cells.length - numericTail.length)).join(" ");
  const [played = "", wins = "", draws = "", losses = "", gf = "", ga = "", points = numericTail.at(-1) ?? ""] = numericTail;
  return { position, team, played, wins, draws, losses, gf, ga, points };
}

function parseStandingsHtml(html) {
  const tables = String(html || "").match(/<table[\s\S]*?<\/table>/gi) || [];
  for (const table of tables) {
    const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)]
      .map((match) => match[0])
      .map((rowHtml) => [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripTags(cell[1])).filter(Boolean))
      .filter((cells) => cells.length >= 3)
      .map((cells, index) => rowFromCells(cells, index))
      .filter((row) => row.team && row.played !== "");
    if (rows.length >= 2) return rows;
  }
  return parseStandingsRowsFromText(stripTags(html).replace(/\s{2,}/g, "\n"));
}

function normalizeReportLines(items, limit = 40) {
  return (Array.isArray(items) ? items : [])
    .map((item) => String(item || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, limit);
}

function parseMatchReportText(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const report = {
    title: lines.find((line) => !/\d+\s*[-:]\s*\d+/.test(line)) || "Acta oficial",
    meta: {},
    periods: [],
    scorers: [],
    penalties: [],
    incidents: [],
    rawText: lines.slice(0, 40),
  };
  let section = "incidents";
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/parcial|periodo|cuarto|tiempo/.test(lower)) section = "periods";
    else if (/gol|goleador|anotador|tanto/.test(lower)) section = "scorers";
    else if (/sanci|penalt|expul|tarjeta|falta/.test(lower)) section = "penalties";
    else if (/incid|observ|arbit|acta/.test(lower)) section = "incidents";
    const hasScore = /\b\d+\s*[-:]\s*\d+\b/.test(line);
    if (hasScore && (section === "periods" || /parcial|periodo|cuarto|tiempo/.test(lower))) report.periods.push(line);
    else if (/gol|goleador|anotador|tanto|\b\d{1,2}[:']\d{0,2}\b/.test(lower) && !/resultado|final/.test(lower)) report.scorers.push(line);
    else if (/sanci|penalt|expul|tarjeta|falta/.test(lower)) report.penalties.push(line);
    else if (line !== report.title && line.length > 4) report.incidents.push(line);
  }
  report.periods = [...new Set(normalizeReportLines(report.periods, 12))];
  report.scorers = [...new Set(normalizeReportLines(report.scorers, 20))];
  report.penalties = [...new Set(normalizeReportLines(report.penalties, 20))];
  report.incidents = [...new Set(normalizeReportLines(report.incidents, 20))];
  return report.rawText.length ? report : null;
}

function parseMatchReportHtml(html) {
  const tableLines = [];
  const tables = String(html || "").match(/<table[\s\S]*?<\/table>/gi) || [];
  for (const table of tables) {
    const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)]
      .map((match) => match[0])
      .map((rowHtml) => [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripTags(cell[1])).filter(Boolean))
      .filter((cells) => cells.length);
    rows.forEach((cells) => tableLines.push(cells.join(" ; ")));
  }
  const textLines = stripTags(String(html || "").replace(/<\/(tr|p|li|div|h[1-6])>/gi, "\n")).split(/\r?\n/);
  return parseMatchReportText([...tableLines, ...textLines].join("\n"));
}

function parseResultRowsFromHtml(html) {
  const rows = [];
  const tables = String(html || "").match(/<table[\s\S]*?<\/table>/gi) || [];
  for (const table of tables) {
    const tableRows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/gi)]
      .map((match) => match[0])
      .map((rowHtml) => [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripTags(cell[1])).filter(Boolean))
      .filter((cells) => cells.length >= 3);
    tableRows.forEach((cells) => {
      const joined = cells.join(" ");
      const scoreIndex = cells.findIndex((cell) => /\b\d+\s*[-:]\s*\d+\b/.test(cell));
      const scoreMatch = scoreIndex >= 0 ? cells[scoreIndex].match(/\b(\d+)\s*[-:]\s*(\d+)\b/) : joined.match(/\b(\d+)\s*[-:]\s*(\d+)\b/);
      if (!scoreMatch) return;
      const dateCell = cells.find((cell) => /\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b|\b\d{4}-\d{2}-\d{2}\b/.test(cell)) || "";
      const teamCells = scoreIndex > 0 ? [cells[scoreIndex - 1], cells[scoreIndex + 1]] : [];
      const home = teamCells[0] || cells.find((cell, idx) => idx !== scoreIndex && idx !== cells.indexOf(dateCell) && !/\d+\s*[-:]\s*\d+/.test(cell)) || "";
      const away = teamCells[1] || cells.slice(cells.indexOf(home) + 1).find((cell) => cell !== dateCell && !/\d+\s*[-:]\s*\d+/.test(cell)) || "";
      if (!home || !away || home === away) return;
      rows.push({ date: normalizeDateCell(dateCell), home, away, homeScore: Number(scoreMatch[1]), awayScore: Number(scoreMatch[2]), place: "" });
    });
  }
  return rows.slice(0, 80);
}

function competitionDiagnostics(html, standings = [], results = []) {
  const text = stripTags(String(html || "").replace(/<\/(tr|p|li|div|h[1-6])>/gi, "\n"));
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 2)
    .slice(0, 80);
  const names = [
    ...standings.map((row) => row.team),
    ...results.flatMap((row) => [row.home, row.away]),
  ]
    .map((name) => String(name || "").trim())
    .filter(Boolean);
  const uniqueNames = [...new Set(names)].slice(0, 40);
  const links = [...String(html || "").matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ href: htmlEntities(match[1]), text: stripTags(match[2]) }))
    .filter((link) => link.href || link.text)
    .slice(0, 30);
  return {
    htmlBytes: Buffer.byteLength(String(html || ""), "utf8"),
    tableCount: (String(html || "").match(/<table[\s\S]*?<\/table>/gi) || []).length,
    standingsRows: standings.length,
    resultRows: results.length,
    teamNames: uniqueNames,
    links,
    sample: lines,
  };
}

async function fetchExternalHtml(target) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(target, { headers: { "User-Agent": "KamikApp/1.0" }, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function normalizeDateCell(value) {
  const text = String(value || "").trim();
  const iso = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const short = text.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);
  if (!short) return "";
  const year = short[3] ? (short[3].length === 2 ? `20${short[3]}` : short[3]) : String(new Date().getFullYear());
  return `${year}-${String(short[2]).padStart(2, "0")}-${String(short[1]).padStart(2, "0")}`;
}

async function handleApi(req, res, url) {
  if (url.pathname === "/api/health") {
    send(res, 200, JSON.stringify({ ok: true, name: "KamikApp", version: APP_VERSION, mode: APP_MODE, time: new Date().toISOString() }), { "Content-Type": types[".json"], "Cache-Control": "no-store" });
    return true;
  }

  if (url.pathname === "/api/config") {
    send(res, 200, JSON.stringify(clientConfig()), { "Content-Type": types[".json"], "Cache-Control": "no-store" });
    return true;
  }

  if (url.pathname === "/api/login" && req.method === "POST") {
    const body = await readBody(req);
    const result = loginUser(JSON.parse(body || "{}"));
    if (result.error) {
      send(res, result.status || 401, JSON.stringify({ error: result.error }), { "Content-Type": types[".json"] });
      return true;
    }
    send(res, 200, JSON.stringify(result), { "Content-Type": types[".json"] });
    return true;
  }

  if (url.pathname === "/api/logout" && req.method === "POST") {
    const token = authToken(req);
    if (token) sessions.delete(token);
    send(res, 200, JSON.stringify({ ok: true }), { "Content-Type": types[".json"] });
    return true;
  }

  if (url.pathname === "/api/diagnostics" && req.method === "GET") {
    const state = ensureSavedState();
    if (!requireOperation(req, res, "backupData", state)) return true;
    send(res, 200, JSON.stringify(diagnosticsPayload(req, state)), { "Content-Type": types[".json"] });
    return true;
  }

  if (url.pathname === "/api/backups" && req.method === "GET") {
    const state = readSavedState();
    if (!requireOperation(req, res, "backupData", state)) return true;
    send(res, 200, JSON.stringify({ backups: backupFiles() }), { "Content-Type": types[".json"] });
    return true;
  }

  if (url.pathname === "/api/backups/create" && req.method === "POST") {
    const state = readSavedState();
    if (!requireOperation(req, res, "backupData", state)) return true;
    const body = JSON.parse((await readBody(req)) || "{}");
    const backup = createServerBackup(body.label || "manual");
    if (!backup) {
      send(res, 404, JSON.stringify({ error: "No hay estado guardado para copiar" }), { "Content-Type": types[".json"] });
      return true;
    }
    send(res, 200, JSON.stringify({ ok: true, backup, backups: backupFiles() }), { "Content-Type": types[".json"] });
    return true;
  }

  if (url.pathname === "/api/backups/download" && req.method === "GET") {
    const state = readSavedState();
    if (!requireOperation(req, res, "backupData", state)) return true;
    const backup = readBackup(url.searchParams.get("id"));
    if (!backup) {
      send(res, 404, JSON.stringify({ error: "Backup no encontrado" }), { "Content-Type": types[".json"] });
      return true;
    }
    send(res, 200, backup.body, {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${backup.id}"`,
      "Cache-Control": "no-store",
    });
    return true;
  }

  if (url.pathname === "/api/backups/restore-server" && req.method === "POST") {
    const state = readSavedState();
    if (!requireOperation(req, res, "restoreData", state)) return true;
    const body = JSON.parse((await readBody(req)) || "{}");
    const backup = readBackup(body.id);
    if (!backup) {
      send(res, 404, JSON.stringify({ error: "Backup no encontrado" }), { "Content-Type": types[".json"] });
      return true;
    }
    JSON.parse(backup.body);
    writeStateAtomically(backup.body);
    send(res, 200, JSON.stringify({ ok: true, restored: backup.id }), { "Content-Type": types[".json"] });
    return true;
  }

  if (url.pathname === "/api/standings/fetch" && req.method === "POST") {
    const state = readSavedState();
    if (!requireOperation(req, res, "editTeam", state)) return true;
    const body = JSON.parse((await readBody(req)) || "{}");
    let target;
    try {
      target = new URL(String(body.url || ""));
    } catch {
      send(res, 400, JSON.stringify({ error: "URL no valida" }), { "Content-Type": types[".json"] });
      return true;
    }
    if (!["http:", "https:"].includes(target.protocol)) {
      send(res, 400, JSON.stringify({ error: "URL no valida" }), { "Content-Type": types[".json"] });
      return true;
    }
    try {
      const html = await fetchExternalHtml(target);
      const rows = parseStandingsHtml(html);
      send(res, 200, JSON.stringify({ rows }), { "Content-Type": types[".json"] });
    } catch (error) {
      send(res, 502, JSON.stringify({ error: `No se pudo leer la web oficial: ${error.message}` }), { "Content-Type": types[".json"] });
    }
    return true;
  }

  if (url.pathname === "/api/match-report/fetch" && req.method === "POST") {
    const state = readSavedState();
    if (!requireOperation(req, res, "manageResults", state)) return true;
    const body = JSON.parse((await readBody(req)) || "{}");
    let target;
    try {
      target = new URL(String(body.url || ""));
    } catch {
      send(res, 400, JSON.stringify({ error: "URL no valida" }), { "Content-Type": types[".json"] });
      return true;
    }
    if (!["http:", "https:"].includes(target.protocol)) {
      send(res, 400, JSON.stringify({ error: "URL no valida" }), { "Content-Type": types[".json"] });
      return true;
    }
    try {
      const html = await fetchExternalHtml(target);
      const report = parseMatchReportHtml(html);
      if (!report) throw new Error("Formato no reconocido");
      send(res, 200, JSON.stringify({ report }), { "Content-Type": types[".json"] });
    } catch (error) {
      send(res, 502, JSON.stringify({ error: `No se pudo leer el acta oficial: ${error.message}` }), { "Content-Type": types[".json"] });
    }
    return true;
  }

  if (url.pathname === "/api/competition/fetch" && req.method === "POST") {
    const state = readSavedState();
    if (!requireOperation(req, res, "manageResults", state)) return true;
    const body = JSON.parse((await readBody(req)) || "{}");
    let target;
    try {
      target = new URL(String(body.url || ""));
    } catch {
      send(res, 400, JSON.stringify({ error: "URL no valida" }), { "Content-Type": types[".json"] });
      return true;
    }
    if (!["http:", "https:"].includes(target.protocol)) {
      send(res, 400, JSON.stringify({ error: "URL no valida" }), { "Content-Type": types[".json"] });
      return true;
    }
    try {
      const html = await fetchExternalHtml(target);
      const standings = parseStandingsHtml(html);
      const results = parseResultRowsFromHtml(html);
      send(res, 200, JSON.stringify({ standings, results, diagnostics: competitionDiagnostics(html, standings, results) }), { "Content-Type": types[".json"] });
    } catch (error) {
      send(res, 502, JSON.stringify({ error: `No se pudo leer la web oficial: ${error.message}` }), { "Content-Type": types[".json"] });
    }
    return true;
  }

  if (url.pathname === "/api/state" && req.method === "GET") {
    const state = ensureSavedState();
    if (!state) {
      send(res, 404, JSON.stringify({ error: "No saved state yet" }), { "Content-Type": types[".json"] });
      return true;
    }
    const actor = actorFromRequest(req, state);
    if (!actor.authenticated || !actor.user) {
      send(res, 401, JSON.stringify({ error: "Sesión caducada. Vuelve a entrar." }), { "Content-Type": types[".json"], "Cache-Control": "no-store" });
      return true;
    }
    send(res, 200, JSON.stringify(sanitizeStateForRead(state, actor)), { "Content-Type": types[".json"] });
    return true;
  }

  if (url.pathname === "/api/state" && req.method === "PUT") {
    return handleStateWrite(req, res);
  }

  if (url.pathname === "/api/events/patch" && req.method === "POST") {
    return handleEventsPatch(req, res);
  }

  if (url.pathname === "/api/events/create" && req.method === "POST") {
    return handleEventCreate(req, res);
  }

  if (stateWriteRoutes[url.pathname] && req.method === "PUT") {
    return handleStateWrite(req, res, stateWriteRoutes[url.pathname]);
  }

  if (url.pathname === "/api/files" && req.method === "POST") {
    const baseState = readSavedState();
    const actor = actorFromRequest(req, baseState);
    if (!canPerformOperation({ ...actor, operation: "uploadDocument" }, baseState)) {
      send(res, 403, JSON.stringify({ error: "No tienes permiso para subir archivos" }), { "Content-Type": types[".json"] });
      return true;
    }
    const body = await readBody(req);
    const payload = JSON.parse(body);
    const match = String(payload.dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      send(res, 400, JSON.stringify({ error: "Invalid file payload" }), { "Content-Type": types[".json"] });
      return true;
    }
    const mime = match[1].toLowerCase();
    if (!ALLOWED_UPLOAD_TYPES.has(mime)) {
      send(res, 415, JSON.stringify({ error: "Unsupported file type" }), { "Content-Type": types[".json"] });
      return true;
    }
    const buffer = Buffer.from(match[2], "base64");
    if (buffer.length > MAX_UPLOAD_BYTES) {
      send(res, 413, JSON.stringify({ error: "File too large" }), { "Content-Type": types[".json"] });
      return true;
    }
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const safeName = path.basename(String(payload.name || "archivo")).replace(/[^\w.\- ]+/g, "_");
    const fileName = `${Date.now()}-${safeName}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, fileName), buffer);
    send(res, 200, JSON.stringify({ url: `/uploads/${encodeURIComponent(fileName)}` }), { "Content-Type": types[".json"] });
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
    if (url.pathname.startsWith("/api/") && (await handleApi(req, res, url))) return;

    const filePath = url.pathname.startsWith("/uploads/")
      ? path.normalize(path.join(UPLOAD_DIR, decodeURIComponent(url.pathname.replace("/uploads/", ""))))
      : safeStaticPath(url.pathname);
    if (!filePath) {
      send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }
    if (url.pathname.startsWith("/uploads/") && !filePath.startsWith(UPLOAD_DIR)) {
      send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
        return;
      }
      if (path.basename(filePath) === "index.html") {
        const configScript = `<script>window.__KAMIK_CONFIG=${JSON.stringify(clientConfig()).replace(/</g, "\\u003c")};</script>`;
        const html = String(data).replace("</head>", `  ${configScript}\n  </head>`);
        send(res, 200, html, {
          "Content-Type": types[path.extname(filePath)] || "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Frame-Options": "SAMEORIGIN",
        });
        return;
      }
      send(res, 200, data, {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Frame-Options": "SAMEORIGIN",
      });
    });
  } catch (error) {
    send(res, 500, JSON.stringify({ error: error.message }), { "Content-Type": types[".json"] });
  }
});

function listen(port) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < PORT + 20) {
      listen(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, HOST, () => {
    console.log("KamikApp lista.");
    console.log(`En este ordenador: http://127.0.0.1:${port}/index.html?${APP_VERSION}`);
    localNetworkUrls(port).forEach((url) => console.log(`En otros dispositivos: ${url}`));
  });
}

function localNetworkUrls(port) {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => `http://${item.address}:${port}/index.html?${APP_VERSION}`);
}

listen(PORT);
