import fs from "node:fs";
import vm from "node:vm";

const appElement = {
  innerHTML: "",
  addEventListener() {},
};

const modalElement = {
  innerHTML: "",
};

const context = {
  console,
  Date,
  Math,
  URLSearchParams,
  confirm() {
    return true;
  },
  localStorage: {
    value: null,
    getItem() {
      return this.value;
    },
    setItem(_key, value) {
      this.value = value;
    },
  },
  navigator: {},
  location: { protocol: "file:", origin: "file://" },
  document: {
    querySelector(selector) {
      if (selector === "#app") return appElement;
      if (selector === "#modal-root") return modalElement;
      return { addEventListener() {}, innerHTML: "", value: "" };
    },
  },
};

vm.createContext(context);
vm.runInContext(fs.readFileSync("app.js", "utf8"), context, { filename: "app.js" });

if (!appElement.innerHTML.includes("Acceso privado del club")) {
  throw new Error("Login screen did not render");
}

vm.runInContext(
  "state.session = { userId: 'u-director', email: 'direccion@club.test' }; render();",
  context,
  { filename: "smoke-login.js" }
);

if (!appElement.innerHTML.includes("Dirección deportiva") || !appElement.innerHTML.includes("Inicio")) {
  throw new Error("Dashboard did not render");
}

if (!appElement.innerHTML.includes("Centro de actividad")) {
  throw new Error("Activity center did not render on dashboard");
}

const searchHits = vm.runInContext(
  "globalSearchResults('Martin').map((item) => item.title).join(' | ')",
  context,
  { filename: "smoke-global-search.js" }
);

if (!searchHits.includes("Martin")) {
  throw new Error("Global search did not find a visible player");
}

const importResult = vm.runInContext(
  `(() => {
    const rows = parseCsv("jugador,edad,equipos,email_jugador,familiar,email_familiar\\nNora Test,12,Equipo Smoke,nora@test.local,Familia Test,familia.nora@test.local");
    const plans = buildPlayerImportPlan(rows);
    if (plans.length !== 1 || plans[0].errors.length) return "bad-plan";
    applyPlayerImportPlans(plans);
    return [
      state.players.some((player) => player.name === "Nora Test"),
      state.teams.some((team) => team.name === "Equipo Smoke"),
      state.users.some((user) => user.email === "nora@test.local" && user.roles.includes("player")),
      state.users.some((user) => user.email === "familia.nora@test.local" && user.roles.includes("parent"))
    ].join("|");
  })()`,
  context,
  { filename: "smoke-import-players.js" }
);

if (importResult !== "true|true|true|true") {
  throw new Error(`Player import failed: ${importResult}`);
}

vm.runInContext("openEventModal();", context, { filename: "smoke-open-event-modal.js" });
if (modalElement.innerHTML.includes('name="title" required')) {
  throw new Error("Training creation can be blocked by required title");
}
modalElement.innerHTML = "";

context.FormData = class FakeFormData {
  constructor(form) {
    this.form = form;
  }

  get(key) {
    return this.form.values[key] || "";
  }

  getAll(key) {
    return this.form.values[key] ? [this.form.values[key]].flat() : [];
  }
};

context.Blob = class FakeBlob {
  constructor(parts) {
    this.parts = parts;
  }
};
context.URL = URL;
context.URL.createObjectURL = () => "blob:test";
context.URL.revokeObjectURL = () => {};
context.document.createElement = () => ({ click() {}, href: "", download: "" });

const exportSmoke = vm.runInContext(
  `(() => {
    downloadPlayerImportTemplate();
    exportMembersCsv();
    exportTeamsCsv();
    exportUsersCsv();
    exportBetaAccessCsv();
    downloadFullBackup();
    return [playerImportHeader().join(","), betaAccessRows().length > 0, Object.hasOwn(betaAccessRows()[0], "lastLoginAt"), Object.hasOwn(betaAccessRows()[0], "acceptedBetaAt")].join("|");
  })()`,
  context,
  { filename: "smoke-export-csv.js" }
);

if (!exportSmoke.includes("jugador,edad,equipos") || !exportSmoke.endsWith("|true|true|true")) {
  throw new Error("CSV export helpers did not run");
}

const inviteSmoke = vm.runInContext(
  `(() => {
    const user = state.users.find((item) => item.email);
    const text = userInviteText(user);
    toggleBetaInvited(user.id);
    const row = betaAccessRows().find((item) => item.email === user.email);
    return [text.includes(user.email), text.includes("Enlace:"), text.includes("KamikApp"), row.invited].join("|");
  })()`,
  context,
  { filename: "smoke-invite-text.js" }
);

if (inviteSmoke !== "true|true|true|si") {
  throw new Error(`Invite text smoke failed: ${inviteSmoke}`);
}

const betaNoticeSmoke = vm.runInContext(
  `(() => {
    state.session = { userId: "u-player", email: "leo@club.test", activeRole: "player", token: "smoke-token" };
    location = { protocol: "http:", origin: "http://127.0.0.1:4173" };
    fetch = async () => ({ ok: true, text: async () => "{}" });
    let payload = null;
    const originalSendRemoteState = sendRemoteState;
    sendRemoteState = async (operation, body) => {
      payload = { operation, body: JSON.parse(body) };
      return true;
    };
    const before = Boolean(currentUser().acceptedBetaAt);
    acceptBetaNotice();
    sendRemoteState = originalSendRemoteState;
    location = { protocol: "file:", origin: "file://" };
    fetch = undefined;
    const result = [before, Boolean(currentUser().acceptedBetaAt), payload.operation, payload.body.users.length, payload.body.users[0].id, Array.isArray(payload.body.events)].join("|");
    state.session = { userId: "u-director", email: "direccion@club.test", activeRole: "director" };
    return result;
  })()`,
  context,
  { filename: "smoke-beta-notice.js" }
);

if (betaNoticeSmoke !== "false|true|updateSelf|1|u-player|false") {
  throw new Error(`Beta notice smoke failed: ${betaNoticeSmoke}`);
}

const updateNoticeSmoke = vm.runInContext(
  `(() => {
    state.serverVersion = "v999";
    state.updateAvailable = true;
    const html = renderUpdateNotice();
    state.serverVersion = APP_VERSION;
    state.updateAvailable = false;
    return [html.includes("Nueva versión disponible"), html.includes("Actualizar app"), renderUpdateNotice() === ""].join("|");
  })()`,
  context,
  { filename: "smoke-update-notice.js" }
);

if (updateNoticeSmoke !== "true|true|true") {
  throw new Error(`Update notice smoke failed: ${updateNoticeSmoke}`);
}

const syncIndicatorSmoke = vm.runInContext(
  `(() => {
    const previousProtocol = location.protocol;
    location.protocol = "http:";
    state.syncStatus = { status: "ok", lastSavedAt: new Date().toISOString(), lastReadAt: "", error: "" };
    const okHtml = renderSyncIndicator();
    state.syncStatus = { status: "error", lastSavedAt: "", lastReadAt: "", error: "Sin conexion" };
    const errorHtml = renderSyncIndicator("sidebar");
    state.syncStatus = { status: "saving", lastSavedAt: "", lastReadAt: "", error: "" };
    const result = [okHtml.includes("Sincronizado"), errorHtml.includes("Reintentar"), syncIndicatorData().label === "Guardando"].join("|");
    location.protocol = previousProtocol;
    return result;
  })()`,
  context,
  { filename: "smoke-sync-indicator.js" }
);

if (syncIndicatorSmoke !== "true|true|true") {
  throw new Error(`Sync indicator smoke failed: ${syncIndicatorSmoke}`);
}

const userSupportSmoke = vm.runInContext(
  `(() => {
    const user = state.users.find((item) => item.email);
    const issues = userSupportIssues(user);
    const scope = userVisibleScopeSummary(user);
    openUserSupportModal(user.id);
    return [Array.isArray(issues), Array.isArray(scope.players), document.querySelector("#modal-root").innerHTML.includes("Diagnostico de usuario")].join("|");
  })()`,
  context,
  { filename: "smoke-user-support.js" }
);

if (userSupportSmoke !== "true|true|true") {
  throw new Error(`User support smoke failed: ${userSupportSmoke}`);
}

const betaTestSmoke = vm.runInContext(
  `(() => {
    const before = betaTestProgress().done;
    toggleBetaTest("director");
    return [betaTestItems().length >= 5, betaTestProgress().done === before + 1, Boolean(state.betaTestChecks.director?.at)].join("|");
  })()`,
  context,
  { filename: "smoke-beta-test-checklist.js" }
);

if (betaTestSmoke !== "true|true|true") {
  throw new Error(`Beta test checklist smoke failed: ${betaTestSmoke}`);
}

const teamReadinessSmoke = vm.runInContext(
  `(() => {
    const report = teamReadinessReport();
    const html = report.teams.map(renderTeamReadinessItem).join("");
    return [report.teams.length === state.teams.length, report.teams.some((row) => row.players > 0), html.includes("team-readiness-item")].join("|");
  })()`,
  context,
  { filename: "smoke-team-readiness.js" }
);

if (teamReadinessSmoke !== "true|true|true") {
  throw new Error(`Team readiness smoke failed: ${teamReadinessSmoke}`);
}

const presidentCoachOptionSmoke = vm.runInContext(
  `(() => {
    state.users.push({
      id: "u-president-smoke",
      name: "Presidenta Smoke",
      roles: ["president"],
      email: "presidenta@test.local",
      children: [],
      disabled: false,
      notificationPrefs: defaultNotificationPrefs()
    });
    openEditTeamModal("team-1");
    const html = document.querySelector("#modal-root").innerHTML;
    state.users = state.users.filter((user) => user.id !== "u-president-smoke");
    closeModal();
    return [teamCoachUsers().some((user) => user.id === "u-director"), html.includes("u-president-smoke"), html.includes("Presidenta Smoke")].join("|");
  })()`,
  context,
  { filename: "smoke-president-coach-option.js" }
);

if (presidentCoachOptionSmoke !== "true|true|true") {
  throw new Error(`President coach option smoke failed: ${presidentCoachOptionSmoke}`);
}

const betaInviteQueueSmoke = vm.runInContext(
  `(() => {
    const pending = betaInvitePendingUsers();
    const html = renderBetaInviteQueue(betaAccessRows());
    openBetaInviteQueueModal();
    return [pending.length > 0, betaInviteQueueText(pending).includes("Enlace:"), html.includes("beta-invite-queue"), document.querySelector("#modal-root").innerHTML.includes("Invitaciones beta pendientes")].join("|");
  })()`,
  context,
  { filename: "smoke-beta-invite-queue.js" }
);

if (betaInviteQueueSmoke !== "true|true|true|true") {
  throw new Error(`Beta invite queue smoke failed: ${betaInviteQueueSmoke}`);
}

const betaFollowupSmoke = vm.runInContext(
  `(() => {
    const rows = betaFollowupRows();
    const html = rows.map(renderBetaFollowupItem).join("");
    return [rows.length > 0, rows.every((row) => row.userId && row.type && row.action), html.includes("beta-followup-item")].join("|");
  })()`,
  context,
  { filename: "smoke-beta-followup.js" }
);

if (betaFollowupSmoke !== "true|true|true") {
  throw new Error(`Beta followup smoke failed: ${betaFollowupSmoke}`);
}

const betaReportSmoke = vm.runInContext(
  `(() => {
    exportBetaReport();
    return true;
  })()`,
  context,
  { filename: "smoke-beta-report.js" }
);

if (!betaReportSmoke) {
  throw new Error("Beta report export failed");
}

const feedbackSmoke = vm.runInContext(
  `(() => {
    createFeedback({
      preventDefault() {},
      currentTarget: {
        values: {
          assignedToId: "u-director",
          feedbackType: "bug",
          feedbackSeverity: "blocker",
          playerId: "p-1",
          subject: "Smoke feedback",
          message: "Mensaje de prueba de feedback beta"
        }
      }
    });
    const thread = state.threads.find((item) => item.betaFeedback && item.subject.includes("Smoke feedback"));
    const text = thread?.messages?.[0]?.text || "";
    return [Boolean(thread), thread?.feedbackStatus, thread?.feedbackSeverity, betaFeedbackThreads().some((item) => item.id === thread?.id), text.includes("Contexto tecnico automatico"), text.includes("Impacto declarado: Bloquea"), text.includes("Vista:")].join("|");
  })()`,
  context,
  { filename: "smoke-feedback.js" }
);

if (feedbackSmoke !== "true|open|blocker|true|true|true|true") {
  throw new Error(`Feedback smoke failed: ${feedbackSmoke}`);
}

const feedbackTriageSmoke = vm.runInContext(
  `(() => {
    const thread = state.threads.find((item) => item.betaFeedback && item.subject.includes("Smoke feedback"));
    thread.createdAt = new Date(Date.now() - 72 * 3600000).toISOString();
    thread.feedbackStatus = "open";
    const summary = betaFeedbackSummary();
    state.betaFeedbackStatusFilter = "active";
    state.betaFeedbackSeverityFilter = "blocker";
    const filtered = filteredBetaFeedbackThreads();
    exportBetaFeedbackCsv();
    return [summary.blocker >= 1, summary.attention >= 1, feedbackAttentionReason(thread).includes("Pendiente"), filtered.every((item) => item.feedbackStatus !== "closed" && item.feedbackSeverity === "blocker"), typeof exportBetaFeedbackCsv === "function"].join("|");
  })()`,
  context,
  { filename: "smoke-feedback-triage.js" }
);

if (feedbackTriageSmoke !== "true|true|true|true|true") {
  throw new Error(`Feedback triage smoke failed: ${feedbackTriageSmoke}`);
}

const feedbackWorkflowSmoke = vm.runInContext(
  `(() => {
    const thread = state.threads.find((item) => item.betaFeedback && item.subject.includes("Smoke feedback"));
    const beforeMessages = thread.messages.length;
    setFeedbackStatus(thread.id, "review");
    const review = thread.feedbackStatus;
    setFeedbackStatus(thread.id, "deferred");
    const deferred = thread.feedbackStatus;
    setFeedbackStatus(thread.id, "closed");
    const closed = thread.feedbackStatus;
    const systemMessages = thread.messages.filter((message) => message.from === "system").length;
    return [review, deferred, closed, Boolean(thread.feedbackClosedAt), feedbackStatusLabel("review"), systemMessages >= 3, thread.messages.length === beforeMessages + 3].join("|");
  })()`,
  context,
  { filename: "smoke-feedback-workflow.js" }
);

if (feedbackWorkflowSmoke !== "review|deferred|closed|true|En revisión|true|true") {
  throw new Error(`Feedback workflow smoke failed: ${feedbackWorkflowSmoke}`);
}

const feedbackSystemUnreadSmoke = vm.runInContext(
  `(() => {
    const thread = state.threads.find((item) => item.betaFeedback && item.subject.includes("Smoke feedback"));
    thread.assignedToId = "u-director";
    thread.participantUserIds = ["u-player"];
    thread.seenBy = { "u-player": thread.messages.length - 1, "u-director": thread.messages.length - 1 };
    state.session = { userId: "u-player", email: "leo@club.test", activeRole: "player" };
    const playerUnread = unreadMessageCount();
    state.threads.forEach((item) => {
      item.seenBy ||= {};
      item.seenBy["u-director"] = item.messages.length;
    });
    thread.seenBy["u-director"] = thread.messages.length - 1;
    state.session = { userId: "u-director", email: "direccion@club.test", activeRole: "director" };
    const directorUnread = unreadMessageCount();
    return [playerUnread, directorUnread].join("|");
  })()`,
  context,
  { filename: "smoke-feedback-system-unread.js" }
);

if (feedbackSystemUnreadSmoke !== "1|0") {
  throw new Error(`Feedback system unread smoke failed: ${feedbackSystemUnreadSmoke}`);
}

const feedbackReassignSmoke = vm.runInContext(
  `(() => {
    const thread = state.threads.find((item) => item.betaFeedback && item.subject.includes("Smoke feedback"));
    state.session = { userId: "u-director", email: "direccion@club.test", activeRole: "director" };
    const beforeMessages = thread.messages.length;
    reassignFeedback(thread.id, "u-coach");
    const last = thread.messages[thread.messages.length - 1];
    return [thread.assignedToId, Boolean(thread.feedbackAssignedAt), last?.from, last?.text.includes("Responsable del feedback"), thread.messages.length === beforeMessages + 1].join("|");
  })()`,
  context,
  { filename: "smoke-feedback-reassign.js" }
);

if (feedbackReassignSmoke !== "u-coach|true|system|true|true") {
  throw new Error(`Feedback reassign smoke failed: ${feedbackReassignSmoke}`);
}

const backupSmoke = vm.runInContext(
  "JSON.stringify(backupSummary(persistentState()))",
  context,
  { filename: "smoke-backup-summary.js" }
);

if (!backupSmoke.includes('"players"') || !backupSmoke.includes('"teams"')) {
  throw new Error("Backup summary failed");
}

const delegatedPermissionSmoke = vm.runInContext(
  `(() => {
    state.session = { userId: "u-coach", email: "coach@club.test", activeRole: "coach" };
    state.permissions.coachCanExportData = false;
    const hidden = !canSee("users");
    state.permissions.coachCanExportData = true;
    const visible = canSee("users") && canExportData() && !canManageUsers();
    render();
    const noEditButtons = !document.querySelector("#app").innerHTML.includes("openEditUserModal");
    return [hidden, visible, noEditButtons].join("|");
  })()`,
  context,
  { filename: "smoke-delegated-data-permissions.js" }
);

if (delegatedPermissionSmoke !== "true|true|true") {
  throw new Error(`Delegated data permissions failed: ${delegatedPermissionSmoke}`);
}

vm.runInContext("state.session = { userId: 'u-director', email: 'direccion@club.test', activeRole: 'director' }; render();", context, { filename: "smoke-reset-director.js" });

const calendarCursorSmoke = vm.runInContext(
  `(() => {
    state.activeView = "clubEvents";
    state.calendarCursor = "2026-07-01";
    normalizeCalendarCursorForActiveView(state);
    const expected = monthKey(new Date());
    setView("calendar");
    const afterSetView = state.calendarCursor;
    state.calendarCursor = "2026-07-01";
    state.activeView = "results";
    normalizeCalendarCursorForActiveView(state);
    const afterResults = state.calendarCursor;
    state.calendarCursor = "2026-07-01";
    goView("clubEvents");
    return [state.calendarCursor === expected, afterSetView === expected, afterResults === expected].join("|");
  })()`,
  context,
  { filename: "smoke-calendar-cursor.js" }
);

if (calendarCursorSmoke !== "true|true|true") {
  throw new Error(`Calendar cursor normalization failed: ${calendarCursorSmoke}`);
}

const announcementNoticeSmoke = vm.runInContext(
  `(() => {
    const before = state.notifications.length;
    createAnnouncement({
      preventDefault() {},
      currentTarget: {
        values: {
          title: "Anuncio smoke",
          body: "Aviso visible para todos",
          targetType: "all",
          important: true
        }
      }
    });
    const notice = state.notifications.find((item) => item.announcementId && item.title === "Anuncio smoke");
    markAnnouncementRead(state.announcements[0].id);
    const marked = state.readAnnouncementIds.includes(state.announcements[0].id);
    markAnnouncementUnread(state.announcements[0].id);
    const unmarked = !state.readAnnouncementIds.includes(state.announcements[0].id);
    return [state.notifications.length > before, notificationType(notice), marked, unmarked].join("|");
  })()`,
  context,
  { filename: "smoke-announcement-notice.js" }
);

if (announcementNoticeSmoke !== "true|announcements|true|true") {
  throw new Error(`Announcement notice smoke failed: ${announcementNoticeSmoke}`);
}

const undoSmoke = vm.runInContext(
  `(() => {
    const before = state.players.length;
    const rows = parseCsv("jugador,edad,equipos,email_jugador\\nUndo Test,10,Equipo Undo,undo@test.local");
    const plans = buildPlayerImportPlan(rows);
    createUndoSnapshot("import", "Smoke undo");
    applyPlayerImportPlans(plans);
    appendAudit("importar socios", "player", "Smoke", { rows: plans.length, created: 1, users: "1 nuevos / 0 actualizados", teams: 1 });
    const during = state.players.some((player) => player.name === "Undo Test");
    const hasDetails = Boolean(state.auditLog[0].details?.rows);
    undoLastBulkOperation();
    return [during, hasDetails, state.players.length === before, !state.players.some((player) => player.name === "Undo Test")].join("|");
  })()`,
  context,
  { filename: "smoke-undo-import.js" }
);

if (undoSmoke !== "true|true|true|true") {
  throw new Error(`Undo import failed: ${undoSmoke}`);
}

vm.runInContext(
  `createEvent({
    preventDefault() {},
    currentTarget: {
      values: {
        title: "Evento smoke",
        type: "event",
        teamId: "team-1",
        place: "Pista smoke",
        date: toLocalDateKey(new Date(Date.now() + 86400000)),
        time: "10:30",
        notes: "Creado desde smoke test",
        playerIds: ["p-1", "p-2"]
      }
    }
  });`,
  context,
  { filename: "smoke-create-event.js" }
);

const createdEventVisible = vm.runInContext(
  `(() => {
    const date = toLocalDateKey(new Date(Date.now() + 86400000));
    const inCalendar = scheduleItems().some((item) => item.title === "Evento smoke" && item.date === date);
    const inClubEvents = monthlyClubEvents().some((item) => item.title === "Evento smoke" && item.date === date);
    const event = state.events.find((item) => item.title === "Evento smoke" && item.date === date);
    const notified = state.notifications.some((notice) => notice.eventId === event?.id && notice.userId === "u-player");
    return [inCalendar, inClubEvents, notified].join("|");
  })()`,
  context,
  { filename: "smoke-schedule-event.js" }
);

if (createdEventVisible !== "true|true|true") {
  throw new Error(`Created event did not propagate correctly: ${createdEventVisible}`);
}

const crossTeamAffectedPlayerSmoke = vm.runInContext(
  `(() => {
    const date = toLocalDateKey(new Date(Date.now() + 259200000));
    const eventItem = {
      id: "ev-cross-team-smoke",
      type: "event",
      title: "Evento cross-team smoke",
      teamId: "team-1",
      seasonId: seasonIdForDate(date),
      competitionId: "",
      date,
      time: "12:15",
      place: "Pista cross-team",
      notes: "Jugador afectado fuera de su equipo habitual",
      playerIds: ["p-5"]
    };
    state.events.push(eventItem);
    notifyAffectedPlayers(eventItem.playerIds, "Nuevo evento en tu calendario", eventItem.title, eventItem.id);
    state.session = { userId: "u-vega", email: "vega@club.test", activeRole: "player" };
    const visibleInCalendar = scheduleItems().some((item) => item.id === eventItem.id);
    const visibleInArchive = archivedScheduleItems().some((item) => item.id === eventItem.id);
    const visibleNotice = visibleNotifications().some((notice) => notice.eventId === eventItem.id);
    state.session = { userId: "u-director", email: "direccion@club.test", activeRole: "director" };
    return [visibleInCalendar, visibleInArchive, visibleNotice].join("|");
  })()`,
  context,
  { filename: "smoke-cross-team-affected-player.js" }
);

if (crossTeamAffectedPlayerSmoke !== "true|false|true") {
  throw new Error(`Cross-team affected player visibility failed: ${crossTeamAffectedPlayerSmoke}`);
}

const playerSyncPreserveSmoke = vm.runInContext(
  `(() => {
    const user = state.users.find((item) => item.id === "u-vega");
    const player = state.players.find((item) => item.id === "p-5");
    const date = toLocalDateKey(new Date(Date.now() + 345600000));
    const eventItem = {
      id: "ev-player-sync-preserve",
      type: "event",
      title: "Evento visible antes de sync",
      teamId: "team-1",
      seasonId: seasonIdForDate(date),
      competitionId: "",
      date,
      time: "12:45",
      place: "Pista sync",
      notes: "",
      playerIds: ["p-5"]
    };
    const beforePlayerId = user.playerId;
    const beforePlayerUserId = player.userId;
    user.playerId = "";
    player.userId = "";
    player.name = user.name;
    state.events.push(eventItem);
    state.session = { userId: "u-vega", email: "vega@club.test", activeRole: "player" };
    const beforeSync = scheduleItems().some((item) => item.id === eventItem.id);
    const remote = normalize({ ...state, players: [], events: [] });
    preservePlayerVisibleRemoteSchedule(remote, state);
    const preservedPlayers = remote.players.some((item) => item.id === "p-5");
    const preservedEvents = remote.events.some((item) => item.id === eventItem.id);
    user.playerId = beforePlayerId;
    player.userId = beforePlayerUserId;
    state.session = { userId: "u-director", email: "direccion@club.test", activeRole: "director" };
    return [beforeSync, preservedPlayers, preservedEvents].join("|");
  })()`,
  context,
  { filename: "smoke-player-sync-preserve.js" }
);

if (playerSyncPreserveSmoke !== "true|true|true") {
  throw new Error(`Player sync preserve smoke failed: ${playerSyncPreserveSmoke}`);
}

const allClubEventSmoke = vm.runInContext(
  `(() => {
    const date = toLocalDateKey(new Date(Date.now() + 432000000));
    const eventItem = {
      id: "ev-all-club-smoke",
      type: "event",
      title: "Evento para todo el club",
      teamId: "",
      seasonId: seasonIdForDate(date),
      competitionId: "",
      date,
      time: "19:00",
      place: "Pista club",
      notes: "",
      playerIds: []
    };
    state.events.push(eventItem);
    notifyScheduleEvent(eventItem, "Nuevo evento en tu calendario", eventItem.title);
    state.session = { userId: "u-player", email: "leo@club.test", activeRole: "player" };
    const visible = scheduleItems().some((item) => item.id === eventItem.id);
    const notified = visibleNotifications().some((notice) => notice.eventId === eventItem.id);
    state.session = { userId: "u-director", email: "direccion@club.test", activeRole: "director" };
    return [visible, notified].join("|");
  })()`,
  context,
  { filename: "smoke-all-club-event.js" }
);

if (allClubEventSmoke !== "true|true") {
  throw new Error(`All-club event visibility failed: ${allClubEventSmoke}`);
}

vm.runInContext(
  `location = { protocol: "http:", origin: "http://127.0.0.1:4173" };
   fetch = async (path, options = {}) => {
     if (String(path).includes("/api/events/create")) {
       const payload = JSON.parse(options.body || "{}");
       return {
         ok: true,
         status: 200,
         text: async () => JSON.stringify({
           ok: true,
           event: payload.event,
           trainings: payload.trainings || [],
           lastEventPatch: { status: "saved", events: 1, trainings: 0 }
         })
       };
     }
     return { ok: false, status: 404, text: async () => JSON.stringify({ error: "unexpected fetch" }) };
   };`,
  context,
  { filename: "smoke-install-fetch.js" }
);

const asyncCreatedEventVisible = await vm.runInContext(
  `(async () => {
    state.session = { userId: 'u-director', email: 'direccion@club.test', activeRole: 'director', token: 'smoke-token' };
    await createEvent({
      preventDefault() {},
      currentTarget: {
        values: {
          title: "Evento async smoke",
          type: "event",
          teamId: "team-1",
          place: "Pista async",
          date: toLocalDateKey(new Date(Date.now() + 86400000)),
          time: "11:30",
          notes: "Creado desde smoke async",
          playerIds: ["p-1"]
        }
      }
    });
    return [
      state.events.some((item) => item.title === "Evento async smoke"),
      state.toast.includes("servidor"),
      state.activeView === "clubEvents",
      typeof fetch,
      location.protocol
    ].join("|");
  })()`,
  context,
  { filename: "smoke-create-event-async.js" }
);

if (asyncCreatedEventVisible !== "true|true|true|function|http:") {
  throw new Error(`Async event creation failed: ${asyncCreatedEventVisible}`);
}
vm.runInContext(`location = { protocol: "file:", origin: "file://" }; fetch = undefined;`, context, { filename: "smoke-remove-fetch.js" });

const expiredCalendarSmoke = vm.runInContext(
  `(() => {
    state.events.push({
      id: "ev-expired-calendar",
      type: "event",
      title: "Evento antiguo visible en calendario",
      teamId: "team-1",
      date: "2026-01-10",
      time: "11:00",
      place: "Pista antigua",
      playerIds: []
    });
    state.calendarCursor = "2026-01-01";
    return [scheduleItems().some((item) => item.id === "ev-expired-calendar"), renderMonthCalendar().includes("ev-expired-calendar")].join("|");
  })()`,
  context,
  { filename: "smoke-expired-calendar-event.js" }
);

if (expiredCalendarSmoke !== "false|true") {
  throw new Error(`Expired calendar visibility failed: ${expiredCalendarSmoke}`);
}

vm.runInContext(
  `createEvent({
    preventDefault() {},
    currentTarget: {
      values: {
        title: "",
        type: "training",
        teamId: "team-1",
        place: "Pista entreno smoke",
        date: toLocalDateKey(new Date(Date.now() + 172800000)),
        time: "18:00",
        notes: "Entreno creado desde smoke test",
        playerIds: ["p-1", "p-2"],
        weeks: "1",
        weekdays: []
      }
    }
  });`,
  context,
  { filename: "smoke-create-training.js" }
);

const createdTrainingVisible = vm.runInContext(
  "scheduleItems().some((item) => item.source === 'training' && item.date === toLocalDateKey(new Date(Date.now() + 172800000)) && item.place === 'Pista entreno smoke')",
  context,
  { filename: "smoke-schedule-training.js" }
);

if (!createdTrainingVisible) {
  throw new Error("Created training did not appear in calendar schedule items");
}

const competitionSmoke = vm.runInContext(
  `(() => {
    state.activeSeasonId = "season-2026";
    state.activeCompetitionId = "comp-league-2026";
    state.results.push({ id: "res-smoke-a", teamId: "team-1", opponent: "Smoke A", date: "2026-07-25", seasonId: "season-2026", competitionId: "comp-league-2026", place: "Pista", homeAway: "home", teamScore: 4, opponentScore: 2, notes: "" });
    state.results.push({ id: "res-smoke-b", teamId: "team-1", opponent: "Smoke B", date: "2026-07-26", seasonId: "season-2026", competitionId: "comp-league-2026", place: "Pista", homeAway: "away", teamScore: 1, opponentScore: 1, notes: "" });
    const row = competitionStandings("comp-league-2026").find((item) => item.teamId === "team-1");
    const stats = teamStatsForCompetition("comp-league-2026").find((item) => item.teamId === "team-1");
    return [Boolean(row), row.points >= 4, stats.results.length >= 2, renderPublicResultsView().includes("KAMIKAZES")].join("|");
  })()`,
  context,
  { filename: "smoke-competition.js" }
);

if (competitionSmoke !== "true|true|true|true") {
  throw new Error(`Competition smoke failed: ${competitionSmoke}`);
}

const officialStandingsSmoke = vm.runInContext(
  `(() => {
    const rows = parseStandingsText("1;Valladolid;10;8;1;1;42;18;25\\n2;Kamikazes;10;7;1;2;38;20;22");
    state.teams[0].officialStandings = rows;
    state.teams[0].standingsUpdatedAt = new Date().toISOString();
    return [rows.length, rows[0].team, renderOfficialStandingsTable(rows).includes("Valladolid"), renderOfficialStandingsBlock(state.teams[0]).includes("Kamikazes")].join("|");
  })()`,
  context,
  { filename: "smoke-official-standings.js" }
);

if (officialStandingsSmoke !== "2|Valladolid|true|true") {
  throw new Error(`Official standings smoke failed: ${officialStandingsSmoke}`);
}

const matchReportSmoke = vm.runInContext(
  `(() => {
    const report = parseMatchReportText("Final\\nKamikazes 4 - 2 Valladolid\\nParciales 1-0 2-1 1-1\\nGoles\\nKamikazes - Vega 12:00\\nSanciones\\nValladolid - 2 min");
    return [Boolean(report), report.periods.length > 0, renderMatchReport(report, { matchReportUpdatedAt: new Date().toISOString(), matchReportUrl: "https://liga.test/acta" }).includes("Vega")].join("|");
  })()`,
  context,
  { filename: "smoke-match-report.js" }
);

if (matchReportSmoke !== "true|true|true") {
  throw new Error(`Match report smoke failed: ${matchReportSmoke}`);
}

console.log("Smoke test passed");
