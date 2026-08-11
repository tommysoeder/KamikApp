import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

function freePort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

async function waitForServer(baseUrl, processRef) {
  const started = Date.now();
  while (Date.now() - started < 5000) {
    if (processRef.exitCode !== null) throw new Error("Server exited before health check");
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  }
  throw new Error("Server did not start in time");
}

async function request(baseUrl, pathName, options = {}) {
  const response = await fetch(`${baseUrl}${pathName}`, options);
  const text = await response.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  return { response, body };
}

function testState() {
  return {
    lang: "es",
    permissions: {
      coachCanEvents: true,
      coachCanCallups: true,
      coachCanDocuments: false,
      coachCanTeams: false,
      coachCanImportMembers: false,
      coachCanExportData: false,
      coachCanBackupData: false,
      coachCanRestoreData: false,
      coachCanUndoBulk: false,
      delegateCanImportMembers: false,
      delegateCanExportData: false,
      delegateCanBackupData: false,
      delegateCanRestoreData: false,
      delegateCanUndoBulk: false,
    },
    users: [
      { id: "u-director", name: "Direccion", roles: ["director"], email: "direccion@test.local", password: "demo1234", children: [] },
      { id: "u-coach", name: "Coach", roles: ["coach"], email: "coach@test.local", password: "demo1234", children: [] },
    ],
    teams: [
      { id: "team-1", name: "Senior Oro", category: "Senior", coachId: "u-coach", delegateId: "" },
      { id: "team-2", name: "Infantil A", category: "Infantil", coachId: "", delegateId: "" },
    ],
    players: [{ id: "p-1", name: "Player", teams: ["team-1"], guardians: [] }],
    events: [],
    trainings: [],
    callups: [],
    announcements: [],
    results: [],
    documents: [],
    documentFolders: [],
    threads: [],
    notifications: [],
    auditLog: [],
  };
}

const bootPort = await freePort();
const bootDataDir = await fs.mkdtemp(path.join(os.tmpdir(), "kamikapp-boot-test-"));
const bootServer = spawn(process.execPath, ["server.js"], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(bootPort), HOST: "127.0.0.1", DATA_DIR: bootDataDir },
  stdio: ["ignore", "pipe", "pipe"],
});

try {
  const bootBaseUrl = `http://127.0.0.1:${bootPort}`;
  await waitForServer(bootBaseUrl, bootServer);
  const bootLogin = await request(bootBaseUrl, "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "direccion@club.test", password: "kamikaze90", userId: "u-director" }),
  });
  if (!bootLogin.response.ok || !bootLogin.body.token) throw new Error(`Bundled state login failed on empty DATA_DIR: ${bootLogin.response.status}`);
  const bootState = JSON.parse(await fs.readFile(path.join(bootDataDir, "state.json"), "utf8"));
  if (!bootState.users?.some((user) => user.id === "u-director")) throw new Error("Empty DATA_DIR was not initialized from bundled state");
} finally {
  if (bootServer.exitCode === null) {
    bootServer.kill();
    await new Promise((resolve) => bootServer.once("exit", resolve));
  }
  await fs.rm(bootDataDir, { recursive: true, force: true });
}

const port = await freePort();
const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "kamikapp-server-test-"));
await fs.writeFile(path.join(dataDir, "state.json"), JSON.stringify(testState(), null, 2));

const server = spawn(process.execPath, ["server.js"], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port), HOST: "127.0.0.1", DATA_DIR: dataDir },
  stdio: ["ignore", "pipe", "pipe"],
});

try {
  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForServer(baseUrl, server);

  const login = await request(baseUrl, "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "direccion@test.local", password: "demo1234", userId: "u-director" }),
  });
  if (!login.response.ok || !login.body.token) throw new Error("Director login failed");
  const migratedLoginState = JSON.parse(await fs.readFile(path.join(dataDir, "state.json"), "utf8"));
  const migratedDirector = migratedLoginState.users.find((user) => user.id === "u-director");
  if (!migratedDirector.passwordHash || migratedDirector.password) throw new Error("Director password was not migrated to hash");

  const changedEvents = { ...migratedLoginState, events: [{ id: "ev-test", type: "event", title: "Ruta", date: "2026-07-27", time: "10:00", teamId: "team-1", playerIds: [] }] };
  const oldRoute = await request(baseUrl, "/api/state", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director", "X-Kamik-Operation": "manageEvents" },
    body: JSON.stringify(changedEvents),
  });
  if (oldRoute.response.status !== 409) throw new Error(`Migrated operation was accepted on /api/state: ${oldRoute.response.status}`);

  const eventRoute = await request(baseUrl, "/api/events", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
    body: JSON.stringify(changedEvents),
  });
  if (!eventRoute.response.ok) throw new Error(`Event route rejected director write: ${eventRoute.response.status} ${JSON.stringify(eventRoute.body)}`);
  const afterDirectorEvent = JSON.parse(await fs.readFile(path.join(dataDir, "state.json"), "utf8"));
  if (!afterDirectorEvent.events.some((event) => event.id === "ev-test")) throw new Error("Director event route did not persist the new event");

  const eventPatchRoute = await request(baseUrl, "/api/events/patch", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
    body: JSON.stringify({
      events: [{ id: "ev-patch", type: "event", title: "Patch", date: "2026-07-30", time: "12:00", teamId: "team-1", playerIds: [] }],
      notifications: [],
      auditLog: [{ id: "audit-patch", action: "crear evento", target: "event", label: "Patch", at: new Date().toISOString() }],
      calendarCursor: "2026-07-01",
      activeView: "clubEvents",
    }),
  });
  if (!eventPatchRoute.response.ok) throw new Error(`Event patch rejected director write: ${eventPatchRoute.response.status} ${JSON.stringify(eventPatchRoute.body)}`);
  const afterEventPatch = JSON.parse(await fs.readFile(path.join(dataDir, "state.json"), "utf8"));
  if (!afterEventPatch.events.some((event) => event.id === "ev-patch")) throw new Error("Event patch route did not persist the new event");

  const eventCreateRoute = await request(baseUrl, "/api/events/create", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
    body: JSON.stringify({
      event: { id: "ev-create", type: "event", title: "Create", date: "2026-08-12", time: "12:00", teamId: "team-1", playerIds: [] },
      notifications: [],
      auditLog: [{ id: "audit-create", action: "crear evento", target: "event", label: "Create", at: new Date().toISOString() }],
      calendarCursor: "2026-08-01",
      activeView: "clubEvents",
    }),
  });
  if (!eventCreateRoute.response.ok || eventCreateRoute.body.event?.id !== "ev-create") throw new Error(`Event create rejected director write: ${eventCreateRoute.response.status} ${JSON.stringify(eventCreateRoute.body)}`);
  const afterEventCreate = JSON.parse(await fs.readFile(path.join(dataDir, "state.json"), "utf8"));
  if (!afterEventCreate.events.some((event) => event.id === "ev-create")) throw new Error("Event create route did not persist the new event");

  await fs.writeFile(path.join(dataDir, "state.json"), JSON.stringify({ ...afterEventCreate, activeView: "results", calendarCursor: "2026-07-01" }, null, 2));
  const cursorState = await request(baseUrl, "/api/state", {
    headers: { Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
  });
  const expectedMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`;
  if (!cursorState.response.ok || cursorState.body.calendarCursor !== expectedMonth) {
    throw new Error(`Server did not normalize stale calendar cursor: ${cursorState.body.calendarCursor}`);
  }

  const readState = { ...afterEventPatch, readAnnouncementIds: ["ann-1", "ann-2"] };
  const markReadRoute = await request(baseUrl, "/api/read-state", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
    body: JSON.stringify(readState),
  });
  if (!markReadRoute.response.ok) throw new Error(`Mark-read route rejected primitive array: ${markReadRoute.response.status} ${JSON.stringify(markReadRoute.body)}`);
  const afterMarkRead = JSON.parse(await fs.readFile(path.join(dataDir, "state.json"), "utf8"));
  if (afterMarkRead.readAnnouncementIds.join("|") !== "ann-1|ann-2") throw new Error("Primitive readAnnouncementIds were not persisted correctly");

  const diagnostics = await request(baseUrl, "/api/diagnostics", {
    headers: { Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
  });
  if (!diagnostics.response.ok || !diagnostics.body.summary || !Array.isArray(diagnostics.body.backups)) throw new Error("Diagnostics endpoint failed");

  const backups = await request(baseUrl, "/api/backups", {
    headers: { Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
  });
  if (!backups.response.ok || !Array.isArray(backups.body.backups)) throw new Error("Backups endpoint failed");

  const manualBackup = await request(baseUrl, "/api/backups/create", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
    body: JSON.stringify({ label: "server-route-test" }),
  });
  if (!manualBackup.response.ok || !manualBackup.body.backup?.id) throw new Error(`Manual backup endpoint failed: ${manualBackup.response.status}`);

  const downloadedBackup = await request(baseUrl, `/api/backups/download?id=${encodeURIComponent(manualBackup.body.backup.id)}`, {
    headers: { Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
  });
  if (!downloadedBackup.response.ok || !downloadedBackup.body.users?.some((user) => user.id === "u-director")) throw new Error("Backup download endpoint failed");

  const coachLogin = await request(baseUrl, "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "coach@test.local", password: "demo1234", userId: "u-coach" }),
  });
  if (!coachLogin.response.ok || !coachLogin.body.token) throw new Error("Coach login failed");

  const coachState = await request(baseUrl, "/api/state", {
    headers: { Authorization: `Bearer ${coachLogin.body.token}`, "X-Kamik-Role": "coach" },
  });
  if (!coachState.response.ok) throw new Error("Coach state read failed");
  if (coachState.body.teams.some((team) => team.id === "team-2")) throw new Error("Coach received another team's data");
  if (coachState.body.users.some((user) => user.password)) throw new Error("State read leaked user passwords");

  const changedUsers = { ...changedEvents, users: [...changedEvents.users, { id: "u-new", name: "Nuevo", roles: ["player"], email: "new@test.local", password: "demo1234", children: [] }] };
  const usersRoute = await request(baseUrl, "/api/users", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${coachLogin.body.token}`, "X-Kamik-Role": "coach" },
    body: JSON.stringify(changedUsers),
  });
  if (usersRoute.response.status !== 403) throw new Error(`Coach managed users unexpectedly: ${usersRoute.response.status}`);

  const ownCoachEvent = {
    ...changedEvents,
    events: [{ id: "ev-coach-own", type: "event", title: "Propio", date: "2026-07-28", time: "10:00", teamId: "team-1", playerIds: [] }],
  };
  const coachOwnRoute = await request(baseUrl, "/api/events", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${coachLogin.body.token}`, "X-Kamik-Role": "coach" },
    body: JSON.stringify(ownCoachEvent),
  });
  if (!coachOwnRoute.response.ok) throw new Error(`Coach own-team event rejected: ${coachOwnRoute.response.status} ${JSON.stringify(coachOwnRoute.body)}`);
  const afterCoachWrite = JSON.parse(await fs.readFile(path.join(dataDir, "state.json"), "utf8"));
  if (!afterCoachWrite.teams.some((team) => team.id === "team-2")) throw new Error("Partial route write removed hidden teams");

  const otherTeamEvent = {
    ...ownCoachEvent,
    events: [{ id: "ev-coach-other", type: "event", title: "Ajeno", date: "2026-07-29", time: "10:00", teamId: "team-2", playerIds: [] }],
  };
  const coachOtherRoute = await request(baseUrl, "/api/events", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${coachLogin.body.token}`, "X-Kamik-Role": "coach" },
    body: JSON.stringify(otherTeamEvent),
  });
  if (coachOtherRoute.response.status !== 403) throw new Error(`Coach managed another team event unexpectedly: ${coachOtherRoute.response.status}`);

  const unsupportedUpload = await request(baseUrl, "/api/files", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
    body: JSON.stringify({ name: "nota.txt", dataUrl: `data:text/plain;base64,${Buffer.from("hola").toString("base64")}` }),
  });
  if (unsupportedUpload.response.status !== 415) throw new Error(`Unsupported upload was accepted: ${unsupportedUpload.response.status}`);

  const invalidStandingsFetch = await request(baseUrl, "/api/standings/fetch", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
    body: JSON.stringify({ url: "no-es-url" }),
  });
  if (invalidStandingsFetch.response.status !== 400) throw new Error(`Invalid standings URL was accepted: ${invalidStandingsFetch.response.status}`);

  const invalidMatchReportFetch = await request(baseUrl, "/api/match-report/fetch", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
    body: JSON.stringify({ url: "no-es-url" }),
  });
  if (invalidMatchReportFetch.response.status !== 400) throw new Error(`Invalid match report URL was accepted: ${invalidMatchReportFetch.response.status}`);

  const invalidCompetitionFetch = await request(baseUrl, "/api/competition/fetch", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}`, "X-Kamik-Role": "director" },
    body: JSON.stringify({ url: "no-es-url" }),
  });
  if (invalidCompetitionFetch.response.status !== 400) throw new Error(`Invalid competition URL was accepted: ${invalidCompetitionFetch.response.status}`);

  console.log("Server route test passed");
} finally {
  server.kill();
  await fs.rm(dataDir, { recursive: true, force: true });
}
