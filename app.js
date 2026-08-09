const STORAGE_KEY = "kamik-club-state-v2";
const LEGACY_KEY = "kamik-club-state-v1";
const AUTH_KEY = "kamik-club-auth-v1";
const API_STATE_URL = "/api/state";
const API_OPERATION_ENDPOINTS = {
  attendance: "/api/attendance",
  cleanDemo: "/api/season/clean",
  editTeam: "/api/teams",
  importMembers: "/api/members/import",
  manageProfiles: "/api/profiles",
  manageResults: "/api/results",
  manageUsers: "/api/users",
  managePermissions: "/api/permissions",
  manageEvents: "/api/events",
  manageCallup: "/api/callups",
  messageClub: "/api/messages",
  publishAnnouncement: "/api/announcements",
  restoreData: "/api/backups/restore",
  undoBulk: "/api/operations/undo",
  uploadDocument: "/api/files/meta",
};
const API_LOGIN_URL = "/api/login";
const API_LOGOUT_URL = "/api/logout";
const API_DIAGNOSTICS_URL = "/api/diagnostics";
const API_BACKUPS_URL = "/api/backups";
const API_RESTORE_SERVER_BACKUP_URL = "/api/backups/restore-server";
const API_FETCH_STANDINGS_URL = "/api/standings/fetch";
const API_FETCH_MATCH_REPORT_URL = "/api/match-report/fetch";
const API_FETCH_COMPETITION_URL = "/api/competition/fetch";
const APP_CONFIG = typeof window !== "undefined" ? window.__KAMIK_CONFIG || {} : {};
const APP_MODE = String(APP_CONFIG.mode || "presentation").toLowerCase();
const IS_PRESENTATION_DEMO = APP_CONFIG.presentationDemo !== false && APP_MODE !== "beta" && APP_MODE !== "production";
const SHOW_LOGIN_PROFILES = APP_CONFIG.showLoginProfiles !== false;

const roleKeys = ["director", "coach", "delegate", "fees", "parent", "player"];

const copy = {
  es: {
    appName: "KamikApp",
    subtitle: "Kamikazes · canal oficial",
    role: "Rol activo",
    profile: "Perfil de prueba",
    dashboard: "Inicio",
    management: "Gestión",
    history: "Histórico",
    historyText: "Consulta eventos, entrenos y convocatorias que ya salieron de la vista principal.",
    allHistory: "Todo el histórico",
    quickActions: "Acciones rápidas",
    operationalStatus: "Estado operativo",
    pendingWork: "Pendientes",
    dataHealth: "Datos",
    audit: "Auditoría",
    diagnostics: "Diagnóstico",
    serverBackups: "Backups del servidor",
    restoreServerBackup: "Restaurar copia",
    cleanDemoData: "Preparar temporada real",
    cleanDemoDataText: "Borra eventos, resultados, anuncios y archivos demo manteniendo equipos, usuarios, perfiles y permisos.",
    auditFilters: "Filtros de actividad",
    todayDesk: "Mesa diaria",
    unansweredMessages: "Mensajes sin responder",
    upcomingAbsences: "Ausencias próximas",
    recentFiles: "Archivos recientes",
    changedEvents: "Eventos modificados",
    activityCenter: "Centro de actividad",
    activityText: "Últimos cambios relevantes de tus equipos, perfiles y conversaciones.",
    synced: "Sincronizado",
    noPendingWork: "Sin pendientes operativos.",
    openItem: "Ver",
    invalidLogin: "Email o contraseña incorrectos",
    announcements: "Anuncios",
    results: "Resultados",
    seasons: "Temporadas",
    competitions: "Competiciones",
    standings: "Clasificaciones",
    officialStandings: "Clasificación oficial",
    standingsUrl: "URL clasificación liga",
    federationTeamName: "Nombre en federación",
    teamFederationUrl: "URL liga de este equipo",
    pasteStandings: "Pegar clasificación",
    updateStandings: "Actualizar clasificación",
    lastStandingsUpdate: "Última actualización",
    matchReport: "Acta",
    officialMatchReport: "Acta oficial",
    matchReportUrl: "URL acta oficial",
    federationLeagueUrl: "URL liga federación",
    pasteMatchReport: "Pegar acta",
    updateMatchReport: "Actualizar acta",
    lastMatchReportUpdate: "Última actualización de acta",
    importCompetitionResults: "Importar resultados",
    updateTeamStandings: "Actualizar clasificación",
    federationAssistant: "Vincular federación",
    teamStats: "Estadísticas de equipo",
    publicView: "Vista pública",
    activeSeason: "Temporada activa",
    competition: "Competición",
    league: "Liga",
    cup: "Copa",
    tournamentLabel: "Torneo",
    friendly: "Amistoso",
    weekendResults: "Resultados del fin de semana",
    noResults: "Sin resultados publicados para este fin de semana.",
    addResult: "Anadir resultado",
    localScore: "Local",
    awayScore: "Visitante",
    unreadNotices: "Avisos sin leer",
    gallery: "Galeria",
    matchPhotos: "Fotos del partido",
    uploadPhotos: "Subir fotos",
    calendar: "Calendario",
    callups: "Convocatorias",
    attendance: "Asistencia",
    messages: "Mensajes",
    documents: "Documentos",
    teams: "Equipos",
    settings: "Permisos",
    director: "Director deportivo",
    coach: "Entrenador",
    delegate: "Delegado",
    fees: "Gestión de cuotas",
    parent: "Padre/madre",
    player: "Jugador",
    loginTitle: "Acceso privado del club",
    loginText: "Prototipo con email y contraseña. Elige un perfil demo para entrar.",
    email: "Email",
    password: "Contraseña",
    enter: "Entrar",
    save: "Guardar",
    publish: "Publicar",
    add: "Anadir",
    close: "Cerrar",
    language: "Idioma",
    logout: "Salir",
    newAnnouncement: "Nuevo anuncio",
    newEvent: "Nuevo evento",
    newCallup: "Nueva convocatoria",
    newThread: "Nueva conversación",
    newDocument: "Subir documento",
    addTeam: "Anadir equipo",
    title: "Titulo",
    body: "Contenido",
    target: "Destinatarios",
    allClub: "Todo el club",
    roles: "Roles",
    team: "Equipo",
    employee: "Empleado",
    file: "Archivo",
    type: "Tipo",
    match: "Partido",
    tournament: "Torneo",
    event: "Evento",
    training: "Entreno",
    date: "Fecha",
    time: "Hora",
    place: "Lugar",
    rival: "Rival",
    arrival: "Hora de llegada",
    kit: "Equipacion",
    notes: "Observaciones",
    selectedPlayers: "Convocados",
    google: "Google Calendar",
    confirmYes: "Confirmar asistencia",
    confirmNo: "No puedo asistir",
    markAbsence: "Marcar ausencia",
    confirmTraining: "Confirmar entreno",
    messagePlaceholder: "Escribe al canal oficial...",
    send: "Enviar",
    categories: "Categorias",
    users: "Usuarios",
    profiles: "Perfiles",
    playerProfiles: "Perfiles de jugador",
    quickPlayerSignup: "Alta rápida",
    importPlayers: "Importar socios",
    importPreview: "Previsualización de importación",
    importHelp: "Pega un CSV exportado desde Excel. Columnas recomendadas: jugador, edad, equipos, email_jugador, familiar, email_familiar, telefono, notas.",
    previewImport: "Previsualizar",
    applyImport: "Aplicar importación",
    importSample: "Ejemplo CSV",
    importSummary: "Resumen",
    downloadTemplate: "Descargar plantilla",
    exportMembers: "Exportar socios",
    exportTeams: "Exportar equipos",
    exportUsers: "Exportar usuarios",
    backupData: "Backup completo",
    restoreData: "Restaurar backup",
    restorePreview: "Previsualizar backup",
    restoreWarning: "La restauración reemplaza el estado actual de la app.",
    undoLastOperation: "Deshacer última operación",
    undoAvailable: "Puedes revertir",
    operationDetails: "Detalle",
    family: "Familia",
    upcomingActivity: "Próxima actividad",
    attendanceSummary: "Resumen de asistencia",
    relatedFiles: "Archivos relacionados",
    linkedUsers: "Usuarios vinculados",
    contactClub: "Contactar",
    profileHistory: "Historial",
    noProfileHistory: "Sin historial todavía.",
    internalNotes: "Notas internas",
    editProfile: "Editar perfil",
    activePlayer: "Jugador activo",
    playerUser: "Usuario jugador",
    coachCanAttendance: "Entrenadores pueden confirmar asistencia",
    delegateCanAttendance: "Delegados pueden ayudar con asistencia",
    coachCanAnnouncements: "Entrenadores pueden publicar anuncios",
    delegateCanAnnouncements: "Delegados pueden publicar anuncios",
    coachCanEvents: "Entrenadores pueden crear y editar eventos de sus equipos",
    coachCanCallups: "Entrenadores pueden crear y editar convocatorias",
    coachCanDocuments: "Entrenadores pueden subir y editar archivos",
    delegateCanDocuments: "Delegados pueden subir y editar archivos",
    coachCanResults: "Entrenadores pueden subir y editar resultados",
    coachCanResultGallery: "Entrenadores pueden gestionar galerias",
    delegateCanResultGallery: "Delegados pueden gestionar galerias",
    coachCanTeams: "Entrenadores pueden editar sus equipos",
    coachCanImportMembers: "Entrenadores pueden importar socios",
    delegateCanImportMembers: "Delegados pueden importar socios",
    coachCanExportData: "Entrenadores pueden exportar datos",
    delegateCanExportData: "Delegados pueden exportar datos",
    coachCanBackupData: "Entrenadores pueden descargar backup completo",
    delegateCanBackupData: "Delegados pueden descargar backup completo",
    coachCanRestoreData: "Entrenadores pueden restaurar backup",
    delegateCanRestoreData: "Delegados pueden restaurar backup",
    coachCanUndoBulk: "Entrenadores pueden deshacer operaciones masivas",
    delegateCanUndoBulk: "Delegados pueden deshacer operaciones masivas",
    push: "Activar push",
    pending: "Pendiente",
    yes: "Asiste",
    no: "No asiste",
    absentNotice: "Ausencia avisada",
    confirmed: "Confirmado",
    noAccess: "No tienes permiso para esta seccion.",
    weekAuto: "La semana visible se calcula desde el lunes actual y se refresca automaticamente cada lunes a las 00:00.",
    visibleWeek: "Eventos de la semana",
    fullMonth: "Mes completo",
    notifications: "Avisos",
    notices: "Avisos",
    notificationPrefs: "Preferencias de avisos",
    notificationSource: "Origen",
    notificationEvents: "Eventos",
    notificationCallups: "Convocatorias",
    notificationFiles: "Archivos",
    notificationAnnouncements: "Anuncios",
    notificationMessages: "Mensajes",
    testPush: "Probar push",
    affectedPlayers: "Jugadores afectados",
    editEvent: "Editar evento",
    duplicate: "Duplicar",
    duplicateEvent: "Duplicar evento",
    repeatTraining: "Repetir entreno",
    weeks: "Semanas",
    weekdays: "Dias",
    trainingAttendance: "Asistencia del entreno",
    delete: "Borrar",
    edit: "Editar",
    open: "Abrir",
    markRead: "Marcar leido",
    switchAccount: "Cambiar cuenta",
    pushOn: "Push ON",
    pushBlocked: "Permiso de notificaciones bloqueado en el navegador",
    fileAlert: "Nuevo archivo",
    folder: "Carpeta",
    newFolder: "Nueva carpeta",
    allFiles: "Todos los archivos",
    rename: "Renombrar",
    download: "Descargar",
    newUser: "Nuevo usuario",
    editUser: "Editar usuario",
    active: "Activo",
    inactive: "Desactivado",
    activate: "Activar",
    deactivate: "Desactivar",
    linkedPlayer: "Jugador vinculado",
    familyPlayers: "Jugadores de la familia",
    alwaysAllowed: "Siempre",
    ownOnly: "Propio",
    teamOnly: "Equipo",
    notAllowed: "No",
    configurable: "Configurable",
    permissionAction: "Accion",
    publishAnnouncements: "Publicar anuncios",
    createEvents: "Crear eventos",
    manageCallups: "Crear/editar convocatorias",
    confirmAttendanceAction: "Gestionar asistencia",
    uploadFilesAction: "Subir/editar archivos",
    viewFilesAction: "Ver archivos",
    manageResultsAction: "Subir/editar resultados",
    manageGalleriesAction: "Gestionar galerias",
    editTeamsAction: "Editar equipos",
    manageUsersAction: "Gestionar usuarios",
    importMembersAction: "Importar socios",
    exportDataAction: "Exportar datos",
    backupDataAction: "Backup completo",
    restoreDataAction: "Restaurar backup",
    undoBulkAction: "Deshacer operaciones masivas",
    messageClubAction: "Mensajes con el club",
    globalSearch: "Buscar",
    searchPlaceholder: "Buscar jugador, equipo, evento, archivo...",
    searchResults: "Resultados",
    noSearchResults: "Sin resultados.",
    clearSearch: "Limpiar busqueda",
    players: "Jugadores",
  },
  en: {
    appName: "KamikApp",
    subtitle: "Kamikazes · official channel",
    role: "Active role",
    profile: "Demo profile",
    dashboard: "Home",
    management: "Management",
    history: "History",
    historyText: "Review events, trainings and call-ups that have left the main view.",
    allHistory: "Full history",
    quickActions: "Quick actions",
    operationalStatus: "Operational status",
    pendingWork: "Pending",
    dataHealth: "Data",
    audit: "Audit",
    diagnostics: "Diagnostics",
    serverBackups: "Server backups",
    restoreServerBackup: "Restore copy",
    cleanDemoData: "Prepare real season",
    cleanDemoDataText: "Removes demo events, results, announcements and files while keeping teams, users, profiles and permissions.",
    auditFilters: "Activity filters",
    todayDesk: "Daily desk",
    unansweredMessages: "Unanswered messages",
    upcomingAbsences: "Upcoming absences",
    recentFiles: "Recent files",
    changedEvents: "Changed events",
    activityCenter: "Activity center",
    activityText: "Latest relevant changes from your teams, profiles and conversations.",
    synced: "Synced",
    noPendingWork: "No operational pending work.",
    openItem: "View",
    invalidLogin: "Incorrect email or password",
    announcements: "Announcements",
    results: "Results",
    seasons: "Seasons",
    competitions: "Competitions",
    standings: "Standings",
    officialStandings: "Official standings",
    standingsUrl: "League standings URL",
    federationTeamName: "Federation team name",
    teamFederationUrl: "This team's league URL",
    pasteStandings: "Paste standings",
    updateStandings: "Update standings",
    lastStandingsUpdate: "Last update",
    matchReport: "Report",
    officialMatchReport: "Official report",
    matchReportUrl: "Official report URL",
    federationLeagueUrl: "Federation league URL",
    pasteMatchReport: "Paste report",
    updateMatchReport: "Update report",
    lastMatchReportUpdate: "Last report update",
    importCompetitionResults: "Import results",
    updateTeamStandings: "Update standings",
    federationAssistant: "Link federation",
    teamStats: "Team stats",
    publicView: "Public view",
    activeSeason: "Active season",
    competition: "Competition",
    league: "League",
    cup: "Cup",
    tournamentLabel: "Tournament",
    friendly: "Friendly",
    weekendResults: "Weekend results",
    noResults: "No results published for this weekend.",
    addResult: "Add result",
    localScore: "Home",
    awayScore: "Away",
    unreadNotices: "Unread notices",
    gallery: "Gallery",
    matchPhotos: "Match photos",
    uploadPhotos: "Upload photos",
    calendar: "Calendar",
    callups: "Call-ups",
    attendance: "Attendance",
    messages: "Messages",
    documents: "Documents",
    teams: "Teams",
    settings: "Permissions",
    director: "Sports director",
    coach: "Coach",
    delegate: "Delegate",
    fees: "Fees management",
    parent: "Parent",
    player: "Player",
    loginTitle: "Private club access",
    loginText: "Email and password prototype. Pick a demo profile to enter.",
    email: "Email",
    password: "Password",
    enter: "Enter",
    save: "Save",
    publish: "Publish",
    add: "Add",
    close: "Close",
    language: "Language",
    logout: "Log out",
    newAnnouncement: "New announcement",
    newEvent: "New event",
    newCallup: "New call-up",
    newThread: "New conversation",
    newDocument: "Upload document",
    addTeam: "Add team",
    title: "Title",
    body: "Body",
    target: "Recipients",
    allClub: "Whole club",
    roles: "Roles",
    team: "Team",
    employee: "Staff member",
    file: "File",
    type: "Type",
    match: "Match",
    tournament: "Tournament",
    event: "Event",
    training: "Training",
    date: "Date",
    time: "Time",
    place: "Place",
    rival: "Opponent",
    arrival: "Arrival time",
    kit: "Kit",
    notes: "Notes",
    selectedPlayers: "Selected players",
    google: "Google Calendar",
    confirmYes: "Confirm attendance",
    confirmNo: "Cannot attend",
    markAbsence: "Mark absence",
    confirmTraining: "Confirm training",
    messagePlaceholder: "Write to the official channel...",
    send: "Send",
    categories: "Categories",
    users: "Users",
    profiles: "Profiles",
    playerProfiles: "Player profiles",
    quickPlayerSignup: "Quick signup",
    importPlayers: "Import members",
    importPreview: "Import preview",
    importHelp: "Paste a CSV exported from Excel. Recommended columns: jugador, edad, equipos, email_jugador, familiar, email_familiar, telefono, notas.",
    previewImport: "Preview",
    applyImport: "Apply import",
    importSample: "CSV example",
    importSummary: "Summary",
    downloadTemplate: "Download template",
    exportMembers: "Export members",
    exportTeams: "Export teams",
    exportUsers: "Export users",
    backupData: "Full backup",
    restoreData: "Restore backup",
    restorePreview: "Preview backup",
    restoreWarning: "Restore replaces the current app state.",
    undoLastOperation: "Undo last operation",
    undoAvailable: "Can revert",
    operationDetails: "Details",
    family: "Family",
    upcomingActivity: "Upcoming activity",
    attendanceSummary: "Attendance summary",
    relatedFiles: "Related files",
    linkedUsers: "Linked users",
    contactClub: "Contact",
    profileHistory: "History",
    noProfileHistory: "No history yet.",
    internalNotes: "Internal notes",
    editProfile: "Edit profile",
    activePlayer: "Active player",
    playerUser: "Player user",
    coachCanAttendance: "Coaches can confirm attendance",
    delegateCanAttendance: "Delegates can help with attendance",
    coachCanAnnouncements: "Coaches can publish announcements",
    delegateCanAnnouncements: "Delegates can publish announcements",
    coachCanEvents: "Coaches can create and edit events for their teams",
    coachCanCallups: "Coaches can create and edit call-ups",
    coachCanDocuments: "Coaches can upload and edit files",
    delegateCanDocuments: "Delegates can upload and edit files",
    coachCanResults: "Coaches can upload and edit results",
    coachCanResultGallery: "Coaches can manage galleries",
    delegateCanResultGallery: "Delegates can manage galleries",
    coachCanTeams: "Coaches can edit their teams",
    coachCanImportMembers: "Coaches can import members",
    delegateCanImportMembers: "Delegates can import members",
    coachCanExportData: "Coaches can export data",
    delegateCanExportData: "Delegates can export data",
    coachCanBackupData: "Coaches can download full backup",
    delegateCanBackupData: "Delegates can download full backup",
    coachCanRestoreData: "Coaches can restore backup",
    delegateCanRestoreData: "Delegates can restore backup",
    coachCanUndoBulk: "Coaches can undo bulk operations",
    delegateCanUndoBulk: "Delegates can undo bulk operations",
    push: "Enable push",
    pending: "Pending",
    yes: "Attending",
    no: "Not attending",
    absentNotice: "Absence notified",
    confirmed: "Confirmed",
    noAccess: "You do not have permission for this section.",
    weekAuto: "The visible week is calculated from the current Monday and refreshes automatically every Monday at 00:00.",
    visibleWeek: "This week's events",
    fullMonth: "Full month",
    notifications: "Notifications",
    notices: "Notices",
    notificationPrefs: "Notification preferences",
    notificationSource: "Source",
    notificationEvents: "Events",
    notificationCallups: "Call-ups",
    notificationFiles: "Files",
    notificationAnnouncements: "Announcements",
    notificationMessages: "Messages",
    testPush: "Test push",
    affectedPlayers: "Affected players",
    editEvent: "Edit event",
    duplicate: "Duplicate",
    duplicateEvent: "Duplicate event",
    repeatTraining: "Repeat training",
    weeks: "Weeks",
    weekdays: "Days",
    trainingAttendance: "Training attendance",
    delete: "Delete",
    edit: "Edit",
    open: "Open",
    markRead: "Mark read",
    switchAccount: "Switch account",
    pushOn: "Push ON",
    pushBlocked: "Notification permission is blocked in the browser",
    fileAlert: "New file",
    folder: "Folder",
    newFolder: "New folder",
    allFiles: "All files",
    rename: "Rename",
    download: "Download",
    newUser: "New user",
    editUser: "Edit user",
    active: "Active",
    inactive: "Inactive",
    activate: "Activate",
    deactivate: "Deactivate",
    linkedPlayer: "Linked player",
    familyPlayers: "Family players",
    alwaysAllowed: "Always",
    ownOnly: "Own",
    teamOnly: "Team",
    notAllowed: "No",
    configurable: "Configurable",
    permissionAction: "Action",
    publishAnnouncements: "Publish announcements",
    createEvents: "Create events",
    manageCallups: "Create/edit call-ups",
    confirmAttendanceAction: "Manage attendance",
    uploadFilesAction: "Upload/edit files",
    viewFilesAction: "View files",
    manageResultsAction: "Upload/edit results",
    manageGalleriesAction: "Manage galleries",
    editTeamsAction: "Edit teams",
    manageUsersAction: "Manage users",
    importMembersAction: "Import members",
    exportDataAction: "Export data",
    backupDataAction: "Full backup",
    restoreDataAction: "Restore backup",
    undoBulkAction: "Undo bulk operations",
    messageClubAction: "Messages with club",
    globalSearch: "Search",
    searchPlaceholder: "Search player, team, event, file...",
    searchResults: "Results",
    noSearchResults: "No results.",
    clearSearch: "Clear search",
    players: "Players",
  },
};

const now = new Date();
const iso = (offset) => {
  const date = new Date(now);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const seed = {
  lang: "es",
  session: null,
  activeView: "dashboard",
  activeThreadId: "thread-1",
  mobileMenuOpen: false,
  calendarCursor: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10),
  resultsCursor: toLocalDateKey(mondayOf(now)),
  activeSeasonId: "season-2026",
  activeCompetitionId: "comp-league-2026",
  historyType: "all",
  historyQuery: "",
  profileQuery: "",
  profileTeamFilter: "",
  activeProfilePlayerId: "",
  activeFederationTeamId: "",
  diagnostics: null,
  diagnosticAuditQuery: "",
  diagnosticAuditAction: "",
  diagnosticAuditTeamId: "",
  permissions: {
    coachCanAttendance: true,
    delegateCanAttendance: true,
    coachCanAnnouncements: true,
    delegateCanAnnouncements: true,
    coachCanEvents: true,
    coachCanCallups: true,
    coachCanDocuments: true,
    delegateCanDocuments: true,
    coachCanResults: true,
    coachCanResultGallery: true,
    delegateCanResultGallery: true,
    coachCanTeams: true,
  },
  pushEnabled: false,
  toast: "",
  auditLog: [],
  notifications: [],
  categories: [
    "Micro",
    "Prebenjamin",
    "Benjamin",
    "Alevin",
    "Infantil",
    "Juvenil",
    "Junior",
    "Senior Autonomico",
    "Senior Oro",
    "Senior Elite",
    "Oro Femenino",
    "Elite Femenino",
    "Sub20 Femenino",
  ],
  seasons: [
    { id: "season-2026", name: "2026/27", startsAt: "2026-07-01", endsAt: "2027-06-30", active: true },
    { id: "season-2025", name: "2025/26", startsAt: "2025-07-01", endsAt: "2026-06-30", active: false, archived: true },
  ],
  competitions: [
    { id: "comp-league-2026", seasonId: "season-2026", name: "Liga 2026/27", type: "league", pointsWin: 3, pointsDraw: 1, pointsLoss: 0, federationUrl: "" },
    { id: "comp-cup-2026", seasonId: "season-2026", name: "Copa 2026/27", type: "cup", pointsWin: 3, pointsDraw: 1, pointsLoss: 0, federationUrl: "" },
    { id: "comp-friendly-2026", seasonId: "season-2026", name: "Amistosos 2026/27", type: "friendly", pointsWin: 3, pointsDraw: 1, pointsLoss: 0, federationUrl: "" },
  ],
  teams: [
    { id: "team-1", category: "Infantil", name: "Infantil A", coachId: "u-director", delegateId: "u-delegate" },
    { id: "team-2", category: "Senior Oro", name: "Senior Oro", coachId: "u-coach", delegateId: "" },
    { id: "team-3", category: "Oro Femenino", name: "Oro Femenino", coachId: "", delegateId: "u-delegate" },
  ],
  users: [
    { id: "u-director", name: "Direccion deportiva", roles: ["director", "coach"], email: "direccion@club.test", password: "demo1234", children: [] },
    { id: "u-coach", name: "Entrenador Senior Oro", roles: ["coach"], email: "coach@club.test", password: "demo1234", children: [] },
    { id: "u-delegate", name: "Delegada equipo", roles: ["delegate"], email: "delegada@club.test", password: "demo1234", children: [] },
    { id: "u-parent", name: "Familia Martin", roles: ["parent"], email: "familia@club.test", password: "demo1234", children: ["p-1", "p-2"] },
    { id: "u-player", name: "Leo Martin", roles: ["player"], email: "leo@club.test", password: "demo1234", playerId: "p-2", children: [] },
    { id: "u-vega", name: "Vega Munoz", roles: ["player"], email: "vega@club.test", password: "demo1234", playerId: "p-5", children: [] },
  ],
  players: [
    { id: "p-1", name: "Nora Martin", age: 13, teams: ["team-1"], guardians: ["u-parent"] },
    { id: "p-2", name: "Leo Martin", age: 16, teams: ["team-1", "team-2"], guardians: ["u-parent"], userId: "u-player" },
    { id: "p-3", name: "Claudia Perez", age: 18, teams: ["team-3"], guardians: [] },
    { id: "p-4", name: "Mario Ruiz", age: 15, teams: ["team-1"], guardians: [] },
    { id: "p-5", name: "Vega Munoz", age: 17, teams: ["team-2"], guardians: [], userId: "u-vega" },
  ],
  announcements: [
    {
      id: "ann-1",
      title: "Horarios del fin de semana",
      body: "Ya estan publicados los partidos y eventos principales. Revisad convocatoria antes del viernes.",
      targetType: "all",
      targetIds: [],
      important: true,
      createdAt: iso(0),
    },
    {
      id: "ann-2",
      title: "Reunion familias Infantil A",
      body: "El club convoca reunion breve tras el entrenamiento del martes.",
      targetType: "team",
      targetIds: ["team-1"],
      important: false,
      createdAt: iso(1),
    },
  ],
  events: [
    {
      id: "ev-1",
      type: "match",
      title: "Infantil A vs Tres Cantos",
      teamId: "team-1",
      date: iso(3),
      time: "12:00",
      place: "Polideportivo municipal",
      notes: "Llegar con chandal del club.",
      playerIds: ["p-1", "p-2", "p-4"],
      sourceCallupId: "call-1",
    },
    {
      id: "ev-2",
      type: "event",
      title: "Presentacion de temporada",
      teamId: "",
      date: iso(7),
      time: "18:30",
      place: "Pista principal",
      notes: "Evento para todas las familias.",
    },
  ],
  callups: [
    {
      id: "call-1",
      eventId: "ev-1",
      teamId: "team-1",
      rival: "Tres Cantos",
      date: iso(3),
      time: "12:00",
      place: "Polideportivo municipal",
      arrival: "11:00",
      kit: "Primera equipacion",
      playerIds: ["p-1", "p-2", "p-4"],
      notes: "Confirmar antes del jueves a las 20:00.",
      responses: { "p-1": "pending", "p-2": "yes", "p-4": "pending" },
    },
  ],
  results: [
    {
      id: "res-1",
      teamId: "team-1",
      opponent: "Tres Cantos",
      date: iso(2),
      place: "Polideportivo municipal",
      homeAway: "home",
      teamScore: 5,
      opponentScore: 3,
      notes: "Buen cierre de partido y reparto de minutos.",
    },
    {
      id: "res-2",
      teamId: "team-2",
      opponent: "Las Rozas",
      date: iso(3),
      place: "Pista principal",
      homeAway: "away",
      teamScore: 2,
      opponentScore: 2,
      notes: "Empate trabajado, con porteria vacia en el ultimo minuto.",
    },
    {
      id: "res-3",
      teamId: "team-3",
      opponent: "Alcorcon",
      date: iso(-4),
      place: "Alcorcon",
      homeAway: "away",
      teamScore: 4,
      opponentScore: 1,
      notes: "Victoria solida fuera de casa.",
    },
    { id: "res-4", teamId: "team-1", opponent: "Majadahonda", date: iso(2), place: "Pista principal", homeAway: "home", teamScore: 3, opponentScore: 1, notes: "Infantil A resolvio en el segundo tiempo." },
    { id: "res-5", teamId: "team-2", opponent: "Rivas", date: iso(2), place: "Rivas", homeAway: "away", teamScore: 6, opponentScore: 4, notes: "Partido abierto y mucho ritmo." },
    { id: "res-6", teamId: "team-3", opponent: "Leganes", date: iso(2), place: "Pista principal", homeAway: "home", teamScore: 1, opponentScore: 1, notes: "Empate con buena defensa." },
    { id: "res-7", teamId: "team-1", opponent: "Alcobendas", date: iso(2), place: "Alcobendas", homeAway: "away", teamScore: 2, opponentScore: 5, notes: "Toco remar tras un mal inicio." },
    { id: "res-8", teamId: "team-2", opponent: "Coslada", date: iso(2), place: "Pista principal", homeAway: "home", teamScore: 4, opponentScore: 0, notes: "Porteria a cero y control del puck." },
    { id: "res-9", teamId: "team-3", opponent: "Getafe", date: iso(3), place: "Getafe", homeAway: "away", teamScore: 5, opponentScore: 2, notes: "Muy buen cierre de fin de semana." },
    { id: "res-10", teamId: "team-1", opponent: "Mostoles", date: iso(3), place: "Pista principal", homeAway: "home", teamScore: 2, opponentScore: 2, notes: "Igualado hasta el ultimo cambio." },
    { id: "res-11", teamId: "team-2", opponent: "Tres Cantos B", date: iso(3), place: "Tres Cantos", homeAway: "away", teamScore: 7, opponentScore: 3, notes: "Ataque muy eficaz." },
    { id: "res-12", teamId: "team-3", opponent: "Las Rozas", date: iso(3), place: "Pista principal", homeAway: "home", teamScore: 0, opponentScore: 1, notes: "Derrota minima." },
  ],
  trainings: [
    {
      id: "tr-1",
      teamId: "team-1",
      date: iso(1),
      time: "19:00",
      place: "Pista principal",
      absences: { "p-1": "Medico" },
      confirmed: false,
      attendance: {},
    },
    {
      id: "tr-2",
      teamId: "team-2",
      date: iso(2),
      time: "21:00",
      place: "Pista principal",
      absences: {},
      confirmed: false,
      attendance: {},
    },
  ],
  threads: [
    {
      id: "thread-1",
      subject: "Familia Martin -> Direccion deportiva",
      assignedToId: "u-director",
      relatedPlayerIds: ["p-1", "p-2"],
      participantUserIds: ["u-parent"],
      messages: [
        { from: "user", text: "Hola, Leo llegara diez minutos tarde el martes.", at: "09:20" },
        { from: "club", text: "Recibido, lo dejamos anotado para el entrenador.", at: "09:26" },
      ],
    },
    {
      id: "thread-2",
      subject: "Leo Martin -> Entrenador Senior Oro",
      assignedToId: "u-coach",
      relatedPlayerIds: ["p-2"],
      participantUserIds: ["u-player"],
      messages: [{ from: "user", text: "Puedo llegar antes para calentar?", at: "17:10" }],
    },
  ],
  documents: [
    {
      id: "doc-1",
      teamId: "team-1",
      name: "Video tecnico - salida de puck.mp4",
      kind: "video/mp4",
      size: 18400000,
      notes: "Subido por el club para Infantil A.",
      createdAt: iso(0),
      uploadedBy: "Direccion deportiva",
    },
  ],
  documentFolders: [
    { id: "folder-1", teamId: "team-1", name: "Videos" },
    { id: "folder-2", teamId: "team-2", name: "Convocatorias" },
  ],
};

let state = load();
const viewOverride = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("view") : "";
let remoteStateLoaded = false;
let saveTimer = null;
let lastRemoteSnapshot = "";
let remoteRefreshInFlight = false;
let lastRemoteRefreshAt = 0;
let remoteSavePaused = false;
let resetScrollAfterRender = false;
let pendingPlayerImportRows = [];

function defaultNotificationPrefs() {
  return {
    events: true,
    callups: true,
    files: true,
    announcements: true,
    messages: true,
  };
}

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    const loaded = normalize(stored ? JSON.parse(stored) : seed);
    const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    if (auth?.token && auth?.userId) {
      loaded.session = {
        userId: auth.userId,
        email: auth.email || "",
        activeRole: auth.activeRole || "",
        token: auth.token,
      };
    }
    return loaded;
  } catch {
    return normalize(seed);
  }
}

function normalize(raw) {
  const next = structuredCloneSafe(raw || seed);
  next.lang ||= "es";
  next.permissions ||= {};
  next.permissions.coachCanAttendance ??= true;
  next.permissions.delegateCanAttendance ??= true;
  next.permissions.coachCanAnnouncements ??= true;
  next.permissions.delegateCanAnnouncements ??= true;
  next.permissions.coachCanEvents ??= true;
  next.permissions.coachCanCallups ??= true;
  next.permissions.coachCanDocuments ??= true;
  next.permissions.delegateCanDocuments ??= true;
  next.permissions.coachCanResults ??= true;
  next.permissions.coachCanResultGallery ??= true;
  next.permissions.delegateCanResultGallery ??= true;
  next.permissions.coachCanTeams ??= true;
  next.permissions.coachCanImportMembers ??= false;
  next.permissions.delegateCanImportMembers ??= false;
  next.permissions.coachCanExportData ??= false;
  next.permissions.delegateCanExportData ??= false;
  next.permissions.coachCanBackupData ??= false;
  next.permissions.delegateCanBackupData ??= false;
  next.permissions.coachCanRestoreData ??= false;
  next.permissions.delegateCanRestoreData ??= false;
  next.permissions.coachCanUndoBulk ??= false;
  next.permissions.delegateCanUndoBulk ??= false;
  next.mobileMenuOpen ??= false;
  next.toast ||= "";
  if (/operacion no permitida|no se pudo conectar|sin conexion|servidor local/i.test(next.toast)) next.toast = "";
  next.calendarCursor ||= new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  next.resultsCursor ||= mondayOf(now).toISOString().slice(0, 10);
  next.seasons ||= seed.seasons;
  next.competitions ||= seed.competitions;
  seed.seasons.forEach((season) => {
    if (!next.seasons.some((item) => item.id === season.id)) next.seasons.push(structuredCloneSafe(season));
  });
  seed.competitions.forEach((competition) => {
    if (!next.competitions.some((item) => item.id === competition.id)) next.competitions.push(structuredCloneSafe(competition));
  });
  next.competitions = next.competitions.map((competition) => ({
    ...competition,
    federationUrl: competition.federationUrl || competition.url || "",
  }));
  next.activeSeasonId ||= next.seasons.find((season) => season.active)?.id || next.seasons[0]?.id || "season-2026";
  next.activeCompetitionId ||= next.competitions.find((competition) => competition.seasonId === next.activeSeasonId)?.id || next.competitions[0]?.id || "";
  next.historyType ||= "all";
  next.historyQuery ||= "";
  next.profileQuery ||= "";
  next.profileTeamFilter ||= "";
  next.activeProfilePlayerId ||= "";
  next.activeFederationTeamId ||= "";
  next.diagnostics ||= null;
  next.diagnosticAuditQuery ||= "";
  next.diagnosticAuditAction ||= "";
  next.diagnosticAuditTeamId ||= "";
  next.globalSearchQuery ||= "";
  next.globalSearchOpen ??= false;
  next.globalSearchSource ||= "";
  next.lastUndo ||= null;
  next.users = (next.users || seed.users).map((user) => ({
    ...user,
    roles: user.roles || [user.role || "parent"],
    children: user.children || [],
    password: user.password || "",
    disabled: Boolean(user.disabled),
    notificationPrefs: { ...defaultNotificationPrefs(), ...(user.notificationPrefs || {}) },
  }));
  seed.users.forEach((seedUser) => {
    if (!next.users.some((user) => user.id === seedUser.id)) next.users.push(structuredCloneSafe(seedUser));
  });
  next.teams ||= seed.teams;
  next.teams = next.teams.map((team) => ({
    ...team,
    standingsUrl: team.standingsUrl || "",
    federationTeamName: team.federationTeamName || team.officialName || "",
    federationUrl: team.federationUrl || "",
    officialStandings: team.officialStandings || [],
    standingsUpdatedAt: team.standingsUpdatedAt || "",
  }));
  next.players = (next.players || seed.players).map((player) => ({
    ...player,
    teams: player.teams || [],
    guardians: player.guardians || [],
    notes: player.notes || "",
    active: player.active !== false,
    phone: player.phone || "",
  }));
  seed.players.forEach((seedPlayer) => {
    if (!next.players.some((player) => player.id === seedPlayer.id)) next.players.push(structuredCloneSafe(seedPlayer));
  });
  next.events ||= seed.events;
  next.trainings = (next.trainings || seed.trainings).map((training) => ({
    ...training,
    seasonId: training.seasonId || seasonIdForDate(training.date, next),
    competitionId: training.competitionId || "",
    playerIds: training.playerIds || [],
    absences: training.absences || {},
    attendance: training.attendance || {},
  }));
  next.callups = (next.callups || seed.callups).map((callup) => ({
    ...callup,
    seasonId: callup.seasonId || seasonIdForDate(callup.date, next),
    competitionId: callup.competitionId || defaultCompetitionId("league", next),
    playerIds: callup.playerIds || [],
    responses: callup.responses || Object.fromEntries((callup.playerIds || []).map((id) => [id, "pending"])),
  }));
  next.announcements ||= seed.announcements;
  next.results ||= seed.results;
  seed.results.forEach((seedResult) => {
    if (!next.results.some((result) => result.id === seedResult.id)) next.results.push(structuredCloneSafe(seedResult));
  });
  next.results = next.results.map((result) => ({
    ...result,
    seasonId: result.seasonId || seasonIdForDate(result.date, next),
    competitionId: result.competitionId || defaultCompetitionId("league", next),
    homeAway: result.homeAway || "home",
    teamScore: Number(result.teamScore ?? 0),
    opponentScore: Number(result.opponentScore ?? 0),
    notes: result.notes || "",
    matchReportUrl: result.matchReportUrl || "",
    officialMatchReport: normalizeMatchReport(result.officialMatchReport || null),
    matchReportUpdatedAt: result.matchReportUpdatedAt || "",
    gallery: (result.gallery || []).map((photo) => ({
      ...photo,
      id: photo.id || uid("photo"),
      name: photo.name || "foto",
      uploadedBy: photo.uploadedBy || "",
    })),
  }));
  if (IS_PRESENTATION_DEMO) applyPresentationDemoData(next);
  next.readAnnouncementIds ||= [];
  next.documents ||= seed.documents;
  next.documentFolders ||= seed.documentFolders;
  next.activeDocumentTeamId ||= "";
  next.activeDocumentFolderId ||= "";
  next.documents = next.documents.map((doc) => ({
    ...doc,
    folderId: doc.folderId || "",
  }));
  next.notifications ||= [];
  next.auditLog = (next.auditLog || []).slice(0, 120);
  next.events = (next.events || seed.events).map((event) => ({
    ...event,
    seasonId: event.seasonId || seasonIdForDate(event.date, next),
    competitionId: event.competitionId || (event.type === "match" ? defaultCompetitionId("league", next) : ""),
    playerIds: event.playerIds || [],
  }));
  next.notifications = dedupeNotifications(next.notifications || []);
  normalizeCallupEvents(next);
  next.threads = (next.threads || seed.threads).map((thread) => ({
    ...thread,
    assignedToId: thread.assignedToId || "u-director",
    participantUserIds: thread.participantUserIds || ["u-parent"],
    seenBy: thread.seenBy || {},
  }));
  if (next.session?.userId) {
    const user = next.users.find((item) => item.id === next.session.userId);
    next.session.activeRole = next.session.activeRole || user?.roles?.[0] || "parent";
  }
  return next;
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function applyPresentationDemoData(targetState) {
  const presentationWeekend = {
    "res-1": "2026-08-01",
    "res-2": "2026-08-01",
    "res-3": "2026-08-01",
    "res-4": "2026-08-01",
    "res-5": "2026-08-01",
    "res-6": "2026-08-01",
    "res-7": "2026-08-02",
    "res-8": "2026-08-02",
    "res-9": "2026-08-02",
    "res-10": "2026-08-02",
    "res-11": "2026-08-02",
    "res-12": "2026-08-02",
  };
  const standingsByTeam = {
    "team-1": [
      { position: 1, team: "Kamikazes Infantil A", played: 12, wins: 9, draws: 1, losses: 2, gf: 54, ga: 28, points: 28 },
      { position: 2, team: "Tres Cantos PC", played: 12, wins: 8, draws: 2, losses: 2, gf: 49, ga: 31, points: 26 },
      { position: 3, team: "Majadahonda Wolves", played: 12, wins: 7, draws: 1, losses: 4, gf: 42, ga: 35, points: 22 },
      { position: 4, team: "Alcobendas CP", played: 12, wins: 5, draws: 2, losses: 5, gf: 37, ga: 39, points: 17 },
    ],
    "team-2": [
      { position: 1, team: "CPLV Valladolid", played: 14, wins: 11, draws: 1, losses: 2, gf: 71, ga: 36, points: 34 },
      { position: 2, team: "Kamikazes Senior Oro", played: 14, wins: 10, draws: 2, losses: 2, gf: 68, ga: 34, points: 32 },
      { position: 3, team: "Las Rozas Black", played: 14, wins: 8, draws: 3, losses: 3, gf: 55, ga: 41, points: 27 },
      { position: 4, team: "Rivas Lagartos", played: 14, wins: 7, draws: 1, losses: 6, gf: 48, ga: 45, points: 22 },
    ],
    "team-3": [
      { position: 1, team: "Kamikazes Oro Femenino", played: 10, wins: 8, draws: 1, losses: 1, gf: 46, ga: 19, points: 25 },
      { position: 2, team: "Alcorcon Phoenix", played: 10, wins: 7, draws: 1, losses: 2, gf: 39, ga: 22, points: 22 },
      { position: 3, team: "Getafe Azul", played: 10, wins: 5, draws: 2, losses: 3, gf: 34, ga: 31, points: 17 },
      { position: 4, team: "Leganes Hockey", played: 10, wins: 3, draws: 1, losses: 6, gf: 25, ga: 37, points: 10 },
    ],
  };
  (targetState.teams || []).forEach((team) => {
    if (!(team.officialStandings || []).length) team.officialStandings = standingsByTeam[team.id] || demoStandingsForTeam(team);
    team.standingsUpdatedAt ||= new Date().toISOString();
    team.federationTeamName ||= team.officialStandings.find((row) => namesLookRelated(row.team, team.name))?.team || team.name;
  });
  (targetState.results || []).forEach((result, index) => {
    if (presentationWeekend[result.id]) {
      result.date = presentationWeekend[result.id];
      result.seasonId = seasonIdForDate(result.date, targetState);
      result.competitionId ||= defaultCompetitionId("league", targetState);
    }
    if (!result.officialMatchReport) result.officialMatchReport = demoMatchReportForResult(result, index, targetState);
    result.matchReportUpdatedAt ||= new Date().toISOString();
  });
  targetState.resultsCursor = "2026-07-27";
  const currentWeekendResults = resultsForWeekend(targetState.resultsCursor, targetState);
  if (currentWeekendResults.length < 3 && targetState.results?.length) {
    const counts = new Map();
    targetState.results.forEach((result) => {
      const monday = toLocalDateKey(mondayOf(new Date(`${result.date}T00:00:00`)));
      counts.set(monday, (counts.get(monday) || 0) + 1);
    });
    targetState.resultsCursor = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || targetState.resultsCursor;
  }
}

function demoStandingsForTeam(team) {
  return [
    { position: 1, team: team.name, played: 8, wins: 6, draws: 1, losses: 1, gf: 32, ga: 16, points: 19 },
    { position: 2, team: "Tres Cantos", played: 8, wins: 5, draws: 1, losses: 2, gf: 29, ga: 21, points: 16 },
    { position: 3, team: "Las Rozas", played: 8, wins: 4, draws: 0, losses: 4, gf: 24, ga: 24, points: 12 },
  ];
}

function demoMatchReportForResult(result, index, targetState = state) {
  const team = (targetState.teams || []).find((item) => item.id === result.teamId)?.name || "Kamikazes";
  const rival = result.opponent || "Rival";
  return {
    title: `Acta oficial demo - ${team} vs ${rival}`,
    meta: {},
    periods: [`1P ${Math.max(0, Math.floor(result.teamScore / 2))}-${Math.max(0, Math.floor(result.opponentScore / 2))}`, `2P ${result.teamScore}-${result.opponentScore}`],
    scorers: [`${team} - gol ${index + 1} en superioridad`, `${team} - cierre de partido a falta de 02:14`, `${rival} - anotacion en transicion`],
    penalties: [`${team} - 2 min por obstruccion`, `${rival} - 2 min por stick alto`],
    incidents: [`Partido validado por mesa. Resultado final ${result.teamScore}-${result.opponentScore}.`, `Acta demo preparada para presentacion de directiva.`],
    rawText: [`${result.date} - ${result.place || "Sede por confirmar"}`, `${team} ${result.teamScore}-${result.opponentScore} ${rival}`],
  };
}

function requestHeaders(operation = "general") {
  const user = currentUser();
  const role = user && hasRole(user, "director") ? "director" : state.session?.activeRole || user?.roles?.[0] || "";
  const headers = {
    "X-Kamik-User": user?.id || "",
    "X-Kamik-Role": role,
    "X-Kamik-Operation": operation,
  };
  if (state.session?.token) headers.Authorization = `Bearer ${state.session.token}`;
  return headers;
}

function save(operation = "general") {
  state.notifications = dedupeNotifications(state.notifications || []);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  persistSession();
  if (API_OPERATION_ENDPOINTS[operation]) saveRemoteNow(operation);
  else queueRemoteSave(operation);
}

function persistSession() {
  if (!state.session?.token) {
    localStorage.removeItem?.(AUTH_KEY);
    return;
  }
  localStorage.setItem?.(
    AUTH_KEY,
    JSON.stringify({
      token: state.session.token,
      userId: state.session.userId,
      email: state.session.email || "",
      activeRole: state.session.activeRole || "",
    })
  );
}

function persistentState() {
  const snapshot = structuredCloneSafe(state);
  delete snapshot.session;
  delete snapshot.lastUndo;
  delete snapshot.diagnostics;
  delete snapshot.diagnosticAuditQuery;
  delete snapshot.diagnosticAuditAction;
  delete snapshot.diagnosticAuditTeamId;
  snapshot.mobileMenuOpen = false;
  return snapshot;
}

function apiUrlForOperation(operation = "general") {
  return API_OPERATION_ENDPOINTS[operation] || API_STATE_URL;
}

function apiEndpoint(path) {
  if (typeof location === "undefined") return path;
  if (location.protocol === "file:") return new URL(path, "http://127.0.0.1:4173").toString();
  return new URL(path, location.origin).toString();
}

async function postJson(path, operation, payload) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 20000) : null;
  try {
    const response = await fetch(apiEndpoint(path), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...requestHeaders(operation) },
      body: JSON.stringify(payload || {}),
      ...(controller ? { signal: controller.signal } : {}),
    });
    const text = await response.text();
    let body = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { error: text || "Respuesta no valida del servidor" };
    }
    return { response, body };
  } catch (error) {
    if (error.name === "AbortError") throw error;
    const openedFrom = typeof location === "undefined" ? "origen desconocido" : location.href;
    throw new Error(`No se pudo conectar con el servidor local (${apiEndpoint(path)}). Pagina abierta desde: ${openedFrom}. Usa http://127.0.0.1:4173.`);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function queueRemoteSave(operation = "general") {
  if (remoteSavePaused || typeof fetch === "undefined" || location.protocol === "file:") return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const body = JSON.stringify(persistentState());
    lastRemoteSnapshot = body;
    sendRemoteState(operation, body);
  }, 250);
}

function saveRemoteNow(operation = "general") {
  if (remoteSavePaused || typeof fetch === "undefined" || location.protocol === "file:") return;
  clearTimeout(saveTimer);
  const body = JSON.stringify(persistentState());
  lastRemoteSnapshot = body;
  sendRemoteState(operation, body);
}

async function sendRemoteState(operation, body) {
  try {
    const response = await fetch(apiUrlForOperation(operation), {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...requestHeaders(operation) },
      body,
    });
    if (!response.ok) {
      let message = "No se pudo guardar en el servidor";
      try {
        const payload = await response.json();
        if (payload?.error) message = payload.error;
      } catch {}
      showRemoteSaveError(message, { renderToast: response.status !== 403 });
    }
  } catch {
    showRemoteSaveError("Sin conexion con el servidor", { renderToast: false });
  }
}

function showRemoteSaveError(message, options = {}) {
  state.toast = message;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  persistSession();
  if (options.renderToast && typeof document !== "undefined" && state.session) render();
}

async function loadRemoteState() {
  if (remoteStateLoaded || typeof fetch === "undefined" || location.protocol === "file:") return;
  remoteStateLoaded = true;
  await refreshRemoteState();
}

async function refreshRemoteState({ keepToast = false } = {}) {
  if (typeof fetch === "undefined" || location.protocol === "file:") return;
  if (remoteRefreshInFlight) return;
  const nowMs = Date.now();
  if (nowMs - lastRemoteRefreshAt < 2500) return;
  remoteRefreshInFlight = true;
  lastRemoteRefreshAt = nowMs;
  try {
    const response = await fetch(API_STATE_URL, { cache: "no-store", headers: requestHeaders("readState") });
    if (!response.ok) return;
    const raw = await response.text();
    if (!raw || raw === lastRemoteSnapshot) return;
    if (document.querySelector("#modal-root .modal") || document.activeElement?.closest?.("form")) {
      return;
    }
    const remote = normalize(JSON.parse(raw));
    lastRemoteSnapshot = raw;
    remote.session = state.session;
    remote.activeView = state.activeView;
    remote.activeThreadId = state.activeThreadId;
    remote.mobileMenuOpen = state.mobileMenuOpen;
    remote.toast = keepToast ? state.toast : "";
    state = remote;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    render();
  } catch {
    // Local-only mode is fine while prototyping.
  } finally {
    remoteRefreshInFlight = false;
  }
}

function startRemoteSync() {
  if (typeof window === "undefined" || typeof fetch === "undefined" || location.protocol === "file:") return;
  window.clearInterval(window.__kamikRemoteSync);
  window.__kamikRemoteSync = window.setInterval(() => refreshRemoteState(), 4000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshRemoteState();
  });
  window.addEventListener("focus", () => refreshRemoteState());
}

function t(key) {
  return copy[state.lang][key] || copy.es[key] || key;
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function currentUser() {
  const user = state.users.find((item) => item.id === state.session?.userId) || null;
  return user?.disabled ? null : user;
}

function appendAudit(action, target, label, details = null) {
  const user = currentUser();
  state.auditLog ||= [];
  state.auditLog.unshift({
    id: uid("audit"),
    action,
    target,
    label,
    details,
    userId: user?.id || "",
    userName: user?.name || "Sistema",
    at: new Date().toISOString(),
  });
  state.auditLog = state.auditLog.slice(0, 120);
}

function activeRole(user = currentUser()) {
  if (!user) return "";
  return state.session?.activeRole && user.roles.includes(state.session.activeRole) ? state.session.activeRole : user.roles[0];
}

function hasRole(user, role) {
  return Boolean(user?.roles?.includes(role));
}

const permissionByAction = {
  publishAnnouncement: { coach: "coachCanAnnouncements", delegate: "delegateCanAnnouncements" },
  manageEvents: { coach: "coachCanEvents" },
  manageCallup: { coach: "coachCanCallups" },
  uploadDocument: { coach: "coachCanDocuments", delegate: "delegateCanDocuments" },
  editTeam: { coach: "coachCanTeams" },
  viewStats: { coach: true },
  manageResults: { coach: "coachCanResults" },
  manageResultGallery: { coach: "coachCanResultGallery", delegate: "delegateCanResultGallery" },
  attendance: { coach: "coachCanAttendance", delegate: "delegateCanAttendance" },
  management: { coach: true, delegate: true },
  importMembers: { coach: "coachCanImportMembers", delegate: "delegateCanImportMembers" },
  exportData: { coach: "coachCanExportData", delegate: "delegateCanExportData" },
  backupData: { coach: "coachCanBackupData", delegate: "delegateCanBackupData" },
  restoreData: { coach: "coachCanRestoreData", delegate: "delegateCanRestoreData" },
  undoBulk: { coach: "coachCanUndoBulk", delegate: "delegateCanUndoBulk" },
};

function canDo(action, user = currentUser()) {
  if (!user) return false;
  if (hasRole(user, "director")) return true;
  const rules = permissionByAction[action] || {};
  return user.roles.some((role) => {
    const rule = rules[role];
    if (rule === true) return true;
    return typeof rule === "string" ? Boolean(state.permissions[rule]) : false;
  });
}

function roleLabel(role) {
  return t(role);
}

function getTeam(id) {
  return state.teams.find((team) => team.id === id);
}

function getPlayer(id) {
  return state.players.find((player) => player.id === id);
}

function getSeason(id) {
  return state.seasons.find((season) => season.id === id);
}

function getCompetition(id) {
  return state.competitions.find((competition) => competition.id === id);
}

function activeSeason(targetState = state) {
  return targetState.seasons?.find((season) => season.id === targetState.activeSeasonId) || targetState.seasons?.find((season) => season.active) || targetState.seasons?.[0];
}

function seasonIdForDate(dateValue, targetState = state) {
  const season = (targetState.seasons || []).find((item) => dateValue >= item.startsAt && dateValue <= item.endsAt) || activeSeason(targetState);
  return season?.id || "";
}

function defaultCompetitionId(type = "league", targetState = state) {
  const season = activeSeason(targetState);
  return (targetState.competitions || []).find((competition) => competition.seasonId === season?.id && competition.type === type)?.id || (targetState.competitions || []).find((competition) => competition.seasonId === season?.id)?.id || "";
}

function competitionTypeLabel(type) {
  return { league: t("league"), cup: t("cup"), tournament: t("tournamentLabel"), friendly: t("friendly") }[type] || type;
}

function normalizeCallupEvents(targetState = state) {
  targetState.callups.forEach((callup) => syncCallupEvent(targetState, callup));
  const seenCallupEvents = new Set();
  targetState.events = targetState.events.filter((event) => {
    if (!event.sourceCallupId) return true;
    if (seenCallupEvents.has(event.sourceCallupId)) return false;
    seenCallupEvents.add(event.sourceCallupId);
    return true;
  });
}

function syncCallupEvent(targetState, callup) {
  const team = targetState.teams.find((item) => item.id === callup.teamId);
  let event = targetState.events.find((item) => item.id === callup.eventId || item.sourceCallupId === callup.id);
  if (!event) {
    event = { id: uid("ev"), type: "match" };
    targetState.events.push(event);
  }
  callup.eventId = event.id;
  event.sourceCallupId = callup.id;
  event.type = "match";
  event.title = `${team?.name || "Equipo"} vs ${callup.rival || ""}`.trim();
  event.teamId = callup.teamId;
  event.seasonId = callup.seasonId || seasonIdForDate(callup.date);
  event.competitionId = callup.competitionId || defaultCompetitionId("league");
  event.date = callup.date;
  event.time = callup.time;
  event.place = callup.place;
  event.notes = callup.notes;
  event.playerIds = [...new Set(callup.playerIds || [])];
  return event;
}

function eventPlayerIds(item) {
  return item.playerIds?.length ? item.playerIds : [];
}

function isWithinVisibleGrace(item, days = 3) {
  if (!item?.date) return true;
  const limit = new Date(`${item.date}T23:59:59`);
  limit.setDate(limit.getDate() + days);
  return new Date() <= limit;
}

function playerCanSeeItem(item, user = currentUser()) {
  const players = visiblePlayerIds(user);
  const itemPlayers = eventPlayerIds(item);
  if (item.teamId && visibleTeamIds(user).includes(item.teamId) && !itemPlayers.length) return true;
  if (!itemPlayers.length) return true;
  return itemPlayers.some((id) => players.includes(id));
}

function staffCanSeeTeam(teamId, user = currentUser()) {
  if (!teamId) return hasRole(user, "director");
  return hasRole(user, "director") || staffTeamIds(user).includes(teamId);
}

function visibleNotifications(user = currentUser(), limit = 8) {
  if (!user) return [];
  const players = visiblePlayerIds(user);
  state.notifications = dedupeNotifications(state.notifications || []);
  const seen = new Set();
  return (state.notifications || [])
    .filter((notice) => notice.userId === user.id || (!hasRole(user, "director") && !hasRole(user, "coach") && !hasRole(user, "delegate") && notice.playerId && players.includes(notice.playerId)))
    .filter((notice) => notificationPreferenceEnabled(notificationType(notice), user))
    .filter((notice) => {
      const key = notificationVisibleKey(notice, user);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function unreadNotifications(user = currentUser()) {
  return visibleNotifications(user).filter((notice) => !notice.read);
}

function notifyAffectedPlayers(playerIds, title, body, eventId = "") {
  [...new Set(playerIds || [])].forEach((playerId) => {
    const users = usersForPlayer(playerId);
    users.forEach((user) => {
      addNotification({
        id: uid("notice"),
        userId: user.id,
        playerId,
        eventId,
        title,
        body,
        createdAt: iso(0),
        read: false,
      });
    });
  });
}

function notifyTeam(teamId, title, body, documentId = "") {
  const playerIds = state.players.filter((player) => player.teams.includes(teamId)).map((player) => player.id);
  [...new Set(playerIds)].forEach((playerId) => {
    usersForPlayer(playerId).forEach((user) => {
      addNotification({
        id: uid("notice"),
        userId: user.id,
        playerId,
        documentId,
        title,
        body,
        createdAt: iso(0),
        read: false,
      });
    });
  });
}

function notificationKey(notice) {
  return notificationCanonicalKey(notice);
}

function notificationVisibleKey(notice, user = currentUser()) {
  return notificationCanonicalKey(notice, user);
}

function notificationDedupeKey(notice) {
  return notificationCanonicalKey(notice);
}

function notificationCanonicalKey(notice, user = null) {
  const audience = notice.userId || user?.id || "";
  if (notice.documentId) return `${audience}:doc:${notice.documentId}`;
  if (notice.eventId) return `${audience}:event:${notice.eventId}:${notificationType(notice)}`;
  return `${audience}:notice:${normalizeSearchText(`${notice.title || ""} ${notice.body || ""}`)}`;
}

function addNotification(notice) {
  state.notifications ||= [];
  const key = notificationCanonicalKey(notice);
  const existing = state.notifications.find((item) => notificationCanonicalKey(item) === key);
  if (existing) {
    existing.read = Boolean(existing.read && notice.read);
    existing.createdAt = notice.createdAt || existing.createdAt;
    existing.title = notice.title || existing.title;
    existing.body = notice.body || existing.body;
    existing.playerId = existing.playerId || notice.playerId || "";
    existing.count = Math.max(Number(existing.count || 1), Number(notice.count || 1));
    return;
  }
  state.notifications.unshift({ ...notice, count: Number(notice.count || 1) });
}

function dedupeNotifications(notifications) {
  const byKey = new Map();
  notifications.forEach((notice) => {
    const key = notificationCanonicalKey(notice);
    const existing = byKey.get(key);
    if (existing) {
      existing.read = Boolean(existing.read && notice.read);
      existing.createdAt = String(notice.createdAt || "").localeCompare(String(existing.createdAt || "")) > 0 ? notice.createdAt : existing.createdAt;
      existing.title = notice.title || existing.title;
      existing.body = notice.body || existing.body;
      existing.playerId = existing.playerId || notice.playerId || "";
      existing.count = Math.max(Number(existing.count || 1), Number(notice.count || 1));
      return;
    }
    byKey.set(key, { ...notice, count: Number(notice.count || 1) });
  });
  return [...byKey.values()].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function notificationType(notice) {
  const text = `${notice.title || ""} ${notice.body || ""}`.toLowerCase();
  if (notice.documentId) return "files";
  if (notice.eventId && text.includes("convocatoria")) return "callups";
  if (notice.eventId) return "events";
  return "events";
}

function notificationTypeLabel(type) {
  return {
    events: t("notificationEvents"),
    callups: t("notificationCallups"),
    files: t("notificationFiles"),
    announcements: t("notificationAnnouncements"),
    messages: t("notificationMessages"),
  }[type] || t("notifications");
}

function notificationPreferenceEnabled(type, user = currentUser()) {
  return user?.notificationPrefs?.[type] !== false;
}

function usersForPlayer(playerId) {
  const player = getPlayer(playerId);
  const ids = new Set([...(player?.guardians || [])]);
  if (player?.userId) ids.add(player.userId);
  return state.users.filter((user) => !user.disabled && (ids.has(user.id) || user.playerId === playerId));
}

function markAnnouncementRead(announcementId) {
  state.readAnnouncementIds ||= [];
  if (!state.readAnnouncementIds.includes(announcementId)) state.readAnnouncementIds.push(announcementId);
  save();
  render();
}

function markNotificationRead(notificationId) {
  const notice = state.notifications.find((item) => item.id === notificationId);
  if (notice) notice.read = true;
  save();
  render();
}

function markNotificationsSeen(predicate, shouldRender = true) {
  visibleNotifications().forEach((notice) => {
    if (predicate(notice)) notice.read = true;
  });
  if (shouldRender) {
    save();
    render();
  }
}

function markVisibleAnnouncementsRead(shouldRender = true) {
  state.readAnnouncementIds ||= [];
  visibleAnnouncements().forEach((announcement) => {
    if (!state.readAnnouncementIds.includes(announcement.id)) state.readAnnouncementIds.push(announcement.id);
  });
  if (shouldRender) {
    save();
    render();
  }
}

function markVisibleThreadsSeen(shouldRender = true) {
  const user = currentUser();
  visibleThreads().forEach((thread) => {
    thread.seenBy ||= {};
    thread.seenBy[user.id] = thread.messages.length;
  });
  if (shouldRender) {
    save();
    render();
  }
}

function unreadAnnouncements() {
  if (!notificationPreferenceEnabled("announcements")) return [];
  const read = new Set(state.readAnnouncementIds || []);
  return visibleAnnouncements().filter((item) => !read.has(item.id));
}

function pushNotification(title, body) {
  if (!state.pushEnabled || typeof Notification === "undefined" || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "assets/kamikazes-logo.png" });
  } catch {}
}

function notifyUnreadVisibleItems() {
  if (typeof localStorage === "undefined") return;
  let storedSeen = [];
  try {
    storedSeen = JSON.parse(localStorage.getItem("kamik-pushed-notices") || "[]");
  } catch {
    storedSeen = [];
  }
  const seen = new Set(Array.isArray(storedSeen) ? storedSeen : []);
  unreadAnnouncements().forEach((announcement) => {
    const key = `ann:${announcement.id}`;
    if (seen.has(key)) return;
    pushNotification(announcement.title, announcement.body || "");
    seen.add(key);
  });
  unreadNotifications().forEach((notice) => {
    if (seen.has(notice.id)) return;
    pushNotification(notice.title, notice.body || "");
    seen.add(notice.id);
  });
  localStorage.setItem("kamik-pushed-notices", JSON.stringify([...seen].slice(-80)));
}

function visiblePlayerIds(user = currentUser()) {
  if (!user) return [];
  if (hasRole(user, "director")) return state.players.map((player) => player.id);
  const ids = new Set();
  if (hasRole(user, "parent")) (user.children || []).forEach((id) => ids.add(id));
  if (hasRole(user, "player") && user.playerId) ids.add(user.playerId);
  const staffTeamIds = state.teams
    .filter((team) => (hasRole(user, "coach") && team.coachId === user.id) || (hasRole(user, "delegate") && team.delegateId === user.id))
    .map((team) => team.id);
  state.players
    .filter((player) => player.teams.some((id) => staffTeamIds.includes(id)))
    .forEach((player) => ids.add(player.id));
  return [...ids];
}

function visibleTeamIds(user = currentUser()) {
  const ids = new Set();
  if (hasRole(user, "director")) state.teams.forEach((team) => ids.add(team.id));
  visiblePlayerIds(user).forEach((playerId) => {
    const player = getPlayer(playerId);
    (player?.teams || []).forEach((teamId) => ids.add(teamId));
  });
  state.teams
    .filter((team) => (hasRole(user, "coach") && team.coachId === user.id) || (hasRole(user, "delegate") && team.delegateId === user.id))
    .forEach((team) => ids.add(team.id));
  return [...ids];
}

function staffTeamIds(user = currentUser()) {
  if (!user) return [];
  if (hasRole(user, "director")) return state.teams.map((team) => team.id);
  return state.teams
    .filter((team) => (hasRole(user, "coach") && team.coachId === user.id) || (hasRole(user, "delegate") && team.delegateId === user.id))
    .map((team) => team.id);
}

function canPublishAnnouncement(user = currentUser()) {
  return canDo("publishAnnouncement", user);
}

function canCreateEvent(user = currentUser()) {
  if (!canDo("manageEvents", user)) return false;
  return hasRole(user, "director") || editableEventTeamIds(user).length > 0;
}

function editableEventTeamIds(user = currentUser()) {
  if (!user) return [];
  if (hasRole(user, "director")) return state.teams.map((team) => team.id);
  if (!canDo("manageEvents", user) || !hasRole(user, "coach")) return [];
  return state.teams.filter((team) => team.coachId === user.id).map((team) => team.id);
}

function canManageScheduleItem(item, user = currentUser()) {
  if (!item || !user) return false;
  if (hasRole(user, "director")) return true;
  return Boolean(item.teamId && editableEventTeamIds(user).includes(item.teamId));
}

function canUseEventTeam(teamId, user = currentUser()) {
  if (!user) return false;
  if (hasRole(user, "director")) return true;
  return Boolean(teamId && editableEventTeamIds(user).includes(teamId));
}

function canCreateCallup(user = currentUser()) {
  return canDo("manageCallup", user);
}

function canManageCallup(callup, user = currentUser()) {
  if (!callup) return false;
  if (hasRole(user, "director")) return true;
  return canDo("manageCallup", user) && hasRole(user, "coach") && getTeam(callup.teamId)?.coachId === user.id;
}

function canUploadDocument(user = currentUser()) {
  return canDo("uploadDocument", user);
}

function canEditTeam(team, user = currentUser()) {
  if (hasRole(user, "director")) return true;
  return canDo("editTeam", user) && hasRole(user, "coach") && team?.coachId === user.id;
}

function canViewStats(user = currentUser()) {
  return canDo("viewStats", user);
}

function canManageResults(user = currentUser()) {
  return canDo("manageResults", user);
}

function canUseManagement(user = currentUser()) {
  return canDo("management", user);
}

function canManageUsers(user = currentUser()) {
  return hasRole(user, "director");
}

function canImportMembers(user = currentUser()) {
  return canDo("importMembers", user);
}

function canExportData(user = currentUser()) {
  return canDo("exportData", user);
}

function canBackupData(user = currentUser()) {
  return canDo("backupData", user);
}

function canRestoreData(user = currentUser()) {
  return canDo("restoreData", user);
}

function canUndoBulkOperation(user = currentUser()) {
  return canDo("undoBulk", user);
}

function canUseDataTools(user = currentUser()) {
  return canManageUsers(user) || canImportMembers(user) || canExportData(user) || canBackupData(user) || canRestoreData(user) || canUndoBulkOperation(user);
}

function canEditPlayerProfile(player, user = currentUser()) {
  if (!player || !user) return false;
  if (hasRole(user, "director")) return true;
  const teams = staffTeamIds(user);
  return (hasRole(user, "coach") || hasRole(user, "delegate")) && (player.teams || []).some((teamId) => teams.includes(teamId));
}

function canManageResultGallery(result, user = currentUser()) {
  if (!result || !user) return false;
  if (hasRole(user, "director")) return true;
  const team = getTeam(result.teamId);
  return (
    (canDo("manageResultGallery", user) && hasRole(user, "coach") && team?.coachId === user.id) ||
    (canDo("manageResultGallery", user) && hasRole(user, "delegate") && team?.delegateId === user.id)
  );
}

function canManage(view) {
  const user = currentUser();
  if (!user) return false;
  if (hasRole(user, "director")) return true;
  if (view === "attendance") return canDo("attendance", user);
  if (view === "documents") return canUploadDocument(user);
  return false;
}

function canSee(view) {
  const user = currentUser();
  if (!user) return false;
  if (["dashboard", "notifications", "announcements", "results", "calendar", "callups", "history", "attendance", "messages", "documents", "teams", "profiles"].includes(view)) return true;
  if (view === "management") return canUseManagement(user);
  if (view === "users") return canUseDataTools(user);
  if (view === "diagnostics") return canBackupData(user) || canRestoreData(user) || canManageUsers(user);
  if (view === "settings") return hasRole(user, "director");
  return false;
}

async function login(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const selectedUserId = String(form.get("userId") || "");
  const remoteSession = await loginRemote(email, password, selectedUserId);
  if (remoteSession) {
    const user = state.users.find((item) => item.id === remoteSession.userId);
    state.session = {
      userId: remoteSession.userId,
      email: remoteSession.email || email,
      activeRole: remoteSession.activeRole || user?.roles?.[0] || "parent",
      token: remoteSession.token,
    };
    appendAudit("login", "session", user?.name || email);
    save("session");
    await refreshRemoteState({ keepToast: true });
    render();
    return;
  }
  const user = state.users.find((item) => !item.disabled && item.id === selectedUserId && item.email.toLowerCase() === email && item.password === password);
  if (!user) {
    state.toast = t("invalidLogin");
    render();
    return;
  }
  state.session = { userId: user.id, email: form.get("email") || user.email, activeRole: user.roles[0] };
  appendAudit("login", "session", user.name);
  save();
  render();
}

async function loginRemote(email, password, userId) {
  if (typeof fetch === "undefined" || location.protocol === "file:") return null;
  try {
    const response = await fetch(API_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, userId }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function logout() {
  const token = state.session?.token;
  if (token && typeof fetch !== "undefined" && location.protocol !== "file:") {
    fetch(API_LOGOUT_URL, { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
  }
  state.session = null;
  save();
  render();
}

function setView(view) {
  state.activeView = view;
  state.mobileMenuOpen = false;
  state.globalSearchOpen = false;
  if (view === "messages") markVisibleThreadsSeen(false);
  if (view === "announcements") markVisibleAnnouncementsRead(false);
  if (view === "calendar") markNotificationsSeen((notice) => Boolean(notice.eventId), false);
  if (view === "callups") markNotificationsSeen((notice) => notice.title.toLowerCase().includes("convocatoria"), false);
  if (view === "documents") markNotificationsSeen((notice) => Boolean(notice.documentId) || notice.title === t("fileAlert"), false);
  save();
  render();
  resetPageScroll();
}

function goView(view, options = {}) {
  state.activeView = view;
  if (options.closeMenu !== false) state.mobileMenuOpen = false;
  if (options.closeSearch !== false) state.globalSearchOpen = false;
  resetScrollAfterRender = true;
}

function setLang(lang) {
  state.lang = lang;
  save();
  render();
}

function setActiveRole(role) {
  const user = currentUser();
  if (user?.roles.includes(role)) {
    state.session.activeRole = role;
    persistSession();
    save();
    render();
  }
}

function render() {
  if (document.body?.classList) {
    document.body.classList.toggle("force-desktop", viewOverride === "desktop");
    document.body.classList.toggle("force-mobile", viewOverride === "mobile");
  }
  const app = document.querySelector("#app");
  if (!state.session) {
    app.innerHTML = renderLogin();
    document.querySelector("#login-form").addEventListener("submit", login);
    return;
  }

  const user = currentUser();
  if (!user) {
    state.session = null;
    save();
    app.innerHTML = renderLogin();
    document.querySelector("#login-form").addEventListener("submit", login);
    return;
  }
  if (!canSee(state.activeView)) state.activeView = "dashboard";
  clearActiveViewBadges();
  app.innerHTML = `
    <div class="shell ${state.mobileMenuOpen ? "menu-open" : ""}">
      ${state.mobileMenuOpen ? `<button class="mobile-menu-scrim" type="button" onclick="closeMobileMenu()" aria-label="Cerrar menu"></button>` : ""}
      ${renderSidebar(user)}
      <main class="main">
        ${renderBetaBanner()}
        <header class="mobile-header">
          <button class="mobile-menu-button" type="button" onclick="toggleMobileMenu()" aria-label="Abrir menu"><span></span><span></span><span></span></button>
          <button class="mobile-logo-button" type="button" onclick="setView('dashboard')" aria-label="${t("dashboard")}">
            <img class="mobile-full-logo" src="assets/kamikazes-logo.png" alt="Kamikazes" />
          </button>
          <span class="mobile-header-actions">
            <button type="button" onclick="logout()">Salir</button>
          </span>
        </header>
        <header class="topbar">
          <div>
            <h1>${viewTitle(state.activeView)}</h1>
            <p>${topbarText(user)}</p>
          </div>
          ${renderGlobalSearch("topbar")}
        </header>
        <section class="content">${renderView()}</section>
      </main>
    </div>
    ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ""}
    <nav class="mobile-bottom-nav" aria-label="Navegacion principal">
      <button class="${state.activeView === "notifications" ? "active" : ""}" type="button" onclick="setView('notifications')">
        <span class="nav-ico announcement-ico">${iconBell()}${unreadBadge("notifications")}</span>
        <strong>${t("notifications")}</strong>
      </button>
      <button class="home ${state.activeView === "dashboard" ? "active" : ""}" type="button" onclick="setView('dashboard')">
        <span class="nav-ico home-ico">${iconHome()}</span>
        <strong>${t("dashboard")}</strong>
      </button>
      <button class="${state.activeView === "messages" ? "active" : ""}" type="button" onclick="setView('messages')">
        <span class="nav-ico message-ico">${iconEnvelope()}${unreadBadge("messages")}</span>
        <strong>${t("messages")}</strong>
      </button>
    </nav>
    <button id="back-to-top" class="back-to-top" type="button" onclick="scrollToTop()">Volver arriba</button>
    <div id="modal-root"></div>
  `;
  setupBackToTop();
  notifyUnreadVisibleItems();
  clearToastSoon();
  if (resetScrollAfterRender) {
    resetScrollAfterRender = false;
    resetPageScroll();
  }
}

function clearActiveViewBadges() {
  if (state.activeView === "notifications") return;
  if (state.activeView === "calendar") markNotificationsSeen((notice) => Boolean(notice.eventId), false);
  if (state.activeView === "callups") markNotificationsSeen((notice) => notice.title.toLowerCase().includes("convocatoria"), false);
  if (state.activeView === "documents") markNotificationsSeen((notice) => Boolean(notice.documentId) || notice.title === t("fileAlert"), false);
}

function toggleMobileMenu() {
  if (state.mobileMenuOpen) {
    closeMobileMenu();
    return;
  }
  state.mobileMenuOpen = true;
  save();
  if (typeof history !== "undefined" && !history.state?.mobileMenuOpen) {
    history.pushState({ mobileMenuOpen: true }, "");
  }
  render();
}

function unreadBadge(view) {
  const count = badgeCount(view);
  return count ? `<i class="unread-dot" aria-label="${count} pendiente${count === 1 ? "" : "s"}"></i>` : "";
}

function badgeCount(view) {
  if (view === "notifications") return unreadNotifications().length;
  if (view === "announcements") return unreadAnnouncements().length;
  if (view === "messages") return unreadMessageCount();
  if (view === "callups") {
    if (!hasRole(currentUser(), "parent") && !hasRole(currentUser(), "player")) return unreadNotifications().filter((notice) => notice.title.toLowerCase().includes("convocatoria")).length;
    return visibleCallups().filter((callup) => visiblePlayerIds().some((id) => callup.playerIds.includes(id) && callup.responses?.[id] === "pending")).length;
  }
  if (view === "calendar") return unreadNotifications().filter((notice) => notice.eventId).length;
  if (view === "documents") return unreadNotifications().filter((notice) => notice.documentId || notice.title === t("fileAlert")).length;
  return 0;
}

function unreadMessageCount() {
  const user = currentUser();
  if (!notificationPreferenceEnabled("messages", user)) return 0;
  return visibleThreads().filter((thread) => {
    const last = thread.messages[thread.messages.length - 1];
    if (!last) return false;
    const incoming = thread.assignedToId === user.id ? last.from === "user" : last.from === "club";
    return incoming && thread.seenBy?.[user.id] !== thread.messages.length;
  }).length;
}

function iconMegaphone() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11v3a2 2 0 0 0 2 2h2l2 4h3l-2-4" />
      <path d="M8 11l10-5v13L8 14" />
      <path d="M18 9a3 3 0 0 1 0 6" />
    </svg>
  `;
}

function iconEnvelope() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5 8 7 6 7-6" />
    </svg>
  `;
}

function iconBell() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  `;
}

function iconHome() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 11 8-7 8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  `;
}

function iconRink() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="5" />
      <path d="M8 5v14" />
      <path d="M16 5v14" />
      <path d="M12 5v14" />
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="7" cy="9" r="1.5" />
      <circle cx="7" cy="15" r="1.5" />
      <circle cx="17" cy="9" r="1.5" />
      <circle cx="17" cy="15" r="1.5" />
    </svg>
  `;
}

function iconList() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6h12" />
      <path d="M8 12h12" />
      <path d="M8 18h12" />
      <path d="M4 6h.01" />
      <path d="M4 12h.01" />
      <path d="M4 18h.01" />
    </svg>
  `;
}

function iconCheckSquare() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  `;
}

function iconCalendar() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </svg>
  `;
}

function iconScoreboard() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h3" />
      <path d="M13 9h3" />
      <path d="M9.5 13h.01" />
      <path d="M14.5 13h.01" />
      <path d="M12 5v14" />
    </svg>
  `;
}

function iconFolder() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h6l2 3h8v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    </svg>
  `;
}

function iconUsers() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20a6 6 0 0 1 12 0" />
      <path d="M4 16a4 4 0 0 1 4-4" />
      <path d="M20 16a4 4 0 0 0-4-4" />
    </svg>
  `;
}

function iconKey() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h8" />
      <path d="M17 12v3" />
      <path d="M20 12v3" />
    </svg>
  `;
}

function iconLock() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v2" />
    </svg>
  `;
}

function iconScroll() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5a3 3 0 0 0-3 3v11a2 2 0 0 0 2 2" />
      <path d="M8 5h10a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3H7" />
      <path d="M7 21a3 3 0 0 0 3-3v-1H4v1a3 3 0 0 0 3 3Z" />
      <path d="M10 9h6" />
      <path d="M10 13h5" />
    </svg>
  `;
}

function iconForView(view) {
  return {
    dashboard: iconHome,
    management: iconKey,
    notifications: iconBell,
    announcements: iconMegaphone,
    results: iconScoreboard,
    calendar: iconCalendar,
    profiles: iconUsers,
    history: iconScroll,
    callups: iconList,
    attendance: iconCheckSquare,
    messages: iconEnvelope,
    documents: iconFolder,
    teams: iconRink,
    users: iconUsers,
    diagnostics: iconKey,
    settings: iconLock,
  }[view]?.() || "";
}

function closeMobileMenu() {
  if (!state.mobileMenuOpen) return;
  state.mobileMenuOpen = false;
  save();
  render();
}

function renderLogin() {
  const loginUsers = state.users.filter((user) => !user.disabled);
  const defaultUser = loginUsers[0] || state.users[0];
  return `
    <section class="login">
      <form class="login-panel form" id="login-form">
        <img class="login-logo" src="assets/kamikazes-logo.png" alt="Kamikazes" />
        ${renderBetaBanner("login")}
        <h1>${t("loginTitle")}</h1>
        <p>${t("loginText")}</p>
        ${state.toast ? `<div class="item notice-item"><strong>${escapeHtml(state.toast)}</strong></div>` : ""}
        <div class="form-row">
          <label>${t("email")}</label>
          <input id="login-email" name="email" type="email" value="${escapeHtml(defaultUser?.email || "direccion@club.test")}" required />
        </div>
        <div class="form-row">
          <label>${t("password")}</label>
          <input name="password" type="password" value="${IS_PRESENTATION_DEMO ? "demo1234" : ""}" required autocomplete="current-password" />
        </div>
        ${
          SHOW_LOGIN_PROFILES
            ? `<div class="form-row">
                <label>${t("profile")}</label>
                <select name="userId" onchange="syncLoginEmail(this.value)">
                  ${loginUsers.map((user) => `<option value="${user.id}" data-email="${escapeHtml(user.email)}">${user.name} (${user.roles.map(roleLabel).join(" + ")})</option>`).join("")}
                </select>
              </div>`
            : `<input name="userId" type="hidden" value="" />`
        }
        <button class="btn primary" type="submit">${t("enter")}</button>
      </form>
    </section>
  `;
}

function renderBetaBanner(context = "") {
  if (!APP_CONFIG.label && APP_MODE !== "beta") return "";
  const label = APP_CONFIG.label || "Beta privada";
  const text = APP_MODE === "production" ? label : `${label} · datos de prueba controlados`;
  return `<div class="beta-banner ${context === "login" ? "login-beta" : ""}">${escapeHtml(text)}</div>`;
}

function syncLoginEmail(userId) {
  const user = state.users.find((item) => !item.disabled && item.id === userId);
  const input = document.querySelector("#login-email");
  if (user && input) input.value = user.email;
}

function renderSidebar(user) {
  const baseItems = [
    ["dashboard", t("dashboard")],
    ["management", t("management")],
    ["notifications", t("notifications")],
    ["announcements", t("announcements")],
    ["results", t("results")],
    ["calendar", t("calendar")],
    ["profiles", t("profiles")],
    ["callups", t("callups")],
    ["history", t("history")],
    ["attendance", t("attendance")],
    ["messages", t("messages")],
    ["documents", t("documents")],
    ["teams", t("teams")],
    ["users", t("users")],
    ["diagnostics", t("diagnostics")],
    ["settings", t("settings")],
  ];
  const items = baseItems.filter(([view]) => canSee(view));

  return `
    <aside class="sidebar">
      <div class="brand">
        <button class="brand-logo-button" type="button" onclick="setView('dashboard')" aria-label="${t("dashboard")}">
          <img class="brand-logo" src="assets/kamikazes-logo.png" alt="Kamikazes" />
        </button>
      </div>
      <div class="role-box">
        <label>${t("profile")}</label>
        <strong>${user.name}</strong>
        <span class="meta light">${user.roles.map(roleLabel).join(" + ")}</span>
        ${
          user.roles.length > 1
            ? `<label style="margin-top:10px">${t("role")}</label><select onchange="setActiveRole(this.value)">${user.roles
                .map((role) => `<option value="${role}" ${activeRole(user) === role ? "selected" : ""}>${roleLabel(role)}</option>`)
                .join("")}</select>`
            : ""
        }
      </div>
      ${renderGlobalSearch("sidebar")}
      <nav class="nav">
        ${items
          .map(
            ([view, label]) => `
            <button class="${state.activeView === view ? "active" : ""}" type="button" onclick="setView('${view}')">
              <span class="icon">${iconForView(view)}${unreadBadge(view)}</span><span>${label}</span>
            </button>
          `
          )
          .join("")}
      </nav>
      <div class="sidebar-foot">
        <div class="sidebar-actions">
          <div class="sidebar-utility">
            <button class="btn compact" type="button" onclick="togglePush()">${state.pushEnabled ? "Push ON" : "Push"}</button>
            <select class="compact-select" aria-label="${t("language")}" onchange="setLang(this.value)">
              <option value="es" ${state.lang === "es" ? "selected" : ""}>ES</option>
              <option value="en" ${state.lang === "en" ? "selected" : ""}>EN</option>
            </select>
          </div>
          <button class="btn" type="button" onclick="logout()">${t("switchAccount")}</button>
        </div>
        <strong>Privacidad:</strong> sin datos personales visibles entre familias y comunicacion oficial trazable.
      </div>
    </aside>
  `;
}

function renderGlobalSearch(source) {
  const query = state.globalSearchQuery || "";
  const isOpen = state.globalSearchOpen && query.trim();
  const isSidebar = source === "sidebar";
  return `
    <div class="global-search ${source === "topbar" ? "topbar-search" : "sidebar-search"}">
      <label class="sr-only">${t("globalSearch")}</label>
      <div class="global-search-box">
        ${isSidebar ? "" : `<span>${iconSearch()}</span>`}
        <input class="global-search-input" data-source="${source}" type="search" value="${escapeHtml(query)}" placeholder="${t("searchPlaceholder")}" oninput="setGlobalSearch(this.value,'${source}')" onfocus="openGlobalSearch('${source}')" />
        ${isSidebar ? "" : `<button class="global-search-clear" type="button" onclick="clearGlobalSearch('${source}')" aria-label="${t("clearSearch")}" ${query ? "" : "hidden"}>X</button>`}
      </div>
      <div class="global-search-results-shell">${isOpen ? renderGlobalSearchResultsMarkup(query) : ""}</div>
    </div>
  `;
}

function renderGlobalSearchResultsMarkup(query) {
  const groups = globalSearchGroups(query);
  return `
    <div class="global-search-results">
      <strong>${t("searchResults")}</strong>
      ${groups.length ? groups.map(renderGlobalSearchGroup).join("") : `<div class="empty">${t("noSearchResults")}</div>`}
    </div>
  `;
}

function iconSearch() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </svg>
  `;
}

function renderGlobalSearchGroup(group) {
  return `
    <section class="search-group">
      <h3>${escapeHtml(group.label)}</h3>
      ${group.items.map(renderGlobalSearchResult).join("")}
    </section>
  `;
}

function renderGlobalSearchResult(item) {
  return `
    <button class="search-result" type="button" onpointerdown="event.stopPropagation()" onclick="${item.action}">
      <span class="search-result-icon ${item.tone || ""}">${item.icon}</span>
      <span>
        <strong>${escapeHtml(item.title)}</strong>
        <em>${escapeHtml(item.meta || "")}</em>
      </span>
    </button>
  `;
}

function setGlobalSearch(query, source = "") {
  state.globalSearchQuery = query;
  state.globalSearchOpen = Boolean(String(query || "").trim());
  state.globalSearchSource = source;
  syncGlobalSearchDom(source);
}

function openGlobalSearch(source = "") {
  if (!String(state.globalSearchQuery || "").trim()) return;
  if (state.globalSearchOpen && state.globalSearchSource === source) return;
  state.globalSearchOpen = true;
  state.globalSearchSource = source;
  syncGlobalSearchDom(source);
}

function clearGlobalSearch(source = "") {
  state.globalSearchQuery = "";
  state.globalSearchOpen = false;
  state.globalSearchSource = source;
  syncGlobalSearchDom(source);
  restoreSearchFocus(source);
}

function closeGlobalSearch() {
  state.globalSearchOpen = false;
  state.globalSearchQuery = "";
  state.mobileMenuOpen = false;
}

function restoreSearchFocus(source) {
  if (typeof window === "undefined" || !document.querySelectorAll) return;
  window.setTimeout(() => {
    const inputs = [...document.querySelectorAll(".global-search-input")];
    const input = inputs.find((item) => item.dataset.source === source) || inputs[0];
    if (!input) return;
    input.focus();
    const end = input.value.length;
    input.setSelectionRange?.(end, end);
  }, 0);
}

function syncGlobalSearchDom(source = "") {
  if (typeof document === "undefined" || !document.querySelectorAll) return;
  const query = state.globalSearchQuery || "";
  document.querySelectorAll(".global-search-input").forEach((input) => {
    if (input.dataset.source !== source) input.value = query;
  });
  const markup = state.globalSearchOpen && query.trim() ? renderGlobalSearchResultsMarkup(query) : "";
  document.querySelectorAll(".global-search-results-shell").forEach((shell) => {
    shell.innerHTML = markup;
  });
  document.querySelectorAll(".global-search-clear").forEach((button) => {
    button.hidden = !query;
  });
}

function globalSearchGroups(query) {
  const items = globalSearchResults(query);
  const order = [t("players"), t("teams"), t("calendar"), t("callups"), t("documents"), t("results"), t("messages"), t("announcements")];
  return order
    .map((label) => ({ label, items: items.filter((item) => item.group === label).slice(0, 6) }))
    .filter((group) => group.items.length);
}

function globalSearchResults(query) {
  const words = searchWords(query);
  if (!words.length) return [];
  const teams = visibleTeamIds();
  const players = visiblePlayerIds();
  const scheduleSeen = new Set();
  const schedule = [...scheduleItems(), ...archivedScheduleItems()].filter((item) => {
    const key = `${item.source}:${item.id}`;
    if (scheduleSeen.has(key)) return false;
    scheduleSeen.add(key);
    return true;
  });
  const callupSeen = new Set();
  const callups = [...visibleCallups(), ...archivedCallups()].filter((callup) => {
    const key = callup.id;
    if (callupSeen.has(key)) return false;
    callupSeen.add(key);
    return true;
  });
  return [
    ...state.players
      .filter((player) => players.includes(player.id))
      .filter((player) => matchesSearch(`${player.name} ${(player.teams || []).map((id) => getTeam(id)?.name || "").join(" ")}`, words))
      .map((player) => ({
        group: t("players"),
        title: player.name,
        meta: (player.teams || []).map((id) => getTeam(id)?.name).filter(Boolean).join(", ") || "Sin equipo",
        icon: initials(player.name),
        tone: "avatar",
        action: `openProfileFromSearch('${player.id}')`,
      })),
    ...state.teams
      .filter((team) => teams.includes(team.id))
      .filter((team) => matchesSearch(`${team.name} ${team.category} ${employeeName(team.coachId)} ${employeeName(team.delegateId)}`, words))
      .map((team) => ({
        group: t("teams"),
        title: team.name,
        meta: `${team.category} · ${state.players.filter((player) => player.teams.includes(team.id)).length} jugadores`,
        icon: iconRink(),
        action: `openTeamFromSearch('${team.id}')`,
      })),
    ...schedule
      .filter((item) => matchesSearch(`${scheduleHoverTitle(item)} ${item.title || ""} ${item.date || ""} ${item.time || ""} ${item.place || ""} ${getTeam(item.teamId)?.name || ""}`, words))
      .map((item) => ({
        group: t("calendar"),
        title: scheduleHoverTitle(item),
        meta: `${item.date || ""} · ${item.time || ""}${item.place ? ` · ${item.place}` : ""}`,
        icon: iconCalendar(),
        tone: item.color,
        action: `openScheduleFromSearch('${item.source}','${item.id}')`,
      })),
    ...callups
      .filter((callup) => matchesSearch(`${getTeam(callup.teamId)?.name || ""} ${callup.rival || ""} ${callup.date || ""} ${callup.place || ""} ${callup.kit || ""}`, words))
      .map((callup) => ({
        group: t("callups"),
        title: `${getTeam(callup.teamId)?.name || ""} vs ${callup.rival || ""}`,
        meta: `${callup.date || ""} · ${callup.time || ""} · ${callup.playerIds?.length || 0} ${t("selectedPlayers").toLowerCase()}`,
        icon: iconList(),
        tone: "gold",
        action: `openCallupFromSearch('${callup.id}')`,
      })),
    ...state.documents
      .filter((doc) => teams.includes(doc.teamId))
      .filter((doc) => matchesSearch(`${doc.name || ""} ${doc.notes || ""} ${getTeam(doc.teamId)?.name || ""} ${folderName(doc.folderId)}`, words))
      .map((doc) => ({
        group: t("documents"),
        title: doc.name,
        meta: `${getTeam(doc.teamId)?.name || ""} · ${folderName(doc.folderId) || t("allFiles")}`,
        icon: iconFolder(),
        action: `openDocumentFromSearch('${doc.id}')`,
      })),
    ...visibleResults()
      .filter((result) => matchesSearch(`${getTeam(result.teamId)?.name || ""} ${result.opponent || ""} ${result.date || ""} ${result.place || ""} ${result.notes || ""}`, words))
      .map((result) => {
        const match = resultTeams(result);
        return {
          group: t("results"),
          title: `${match.home} ${match.homeScore}-${match.awayScore} ${match.away}`,
          meta: `${result.date || ""}${result.place ? ` · ${result.place}` : ""}`,
          icon: iconScoreboard(),
          action: `openResultFromSearch('${result.id}')`,
        };
      }),
    ...visibleThreads()
      .filter((thread) => matchesSearch(`${thread.subject || ""} ${(thread.messages || []).map((message) => message.body || "").join(" ")}`, words))
      .map((thread) => ({
        group: t("messages"),
        title: thread.subject,
        meta: `${employeeName(thread.assignedToId)} · ${(thread.messages || []).length} mensajes`,
        icon: iconEnvelope(),
        action: `openThreadFromSearch('${thread.id}')`,
      })),
    ...visibleAnnouncements()
      .filter((announcement) => matchesSearch(`${announcement.title || ""} ${announcement.body || ""} ${targetLabel(announcement)}`, words))
      .map((announcement) => ({
        group: t("announcements"),
        title: announcement.title,
        meta: `${announcement.createdAt || ""} · ${targetLabel(announcement)}`,
        icon: iconMegaphone(),
        action: `openAnnouncementFromSearch('${announcement.id}')`,
      })),
  ];
}

function searchWords(query) {
  return normalizeSearchText(query).split(/\s+/).filter(Boolean);
}

function matchesSearch(text, words) {
  const value = normalizeSearchText(text);
  return words.every((word) => value.includes(word));
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function openProfileFromSearch(playerId) {
  closeGlobalSearch();
  goView("profiles");
  state.activeProfilePlayerId = playerId;
  save();
  render();
  resetPageScroll();
}

function openTeamFromSearch(teamId) {
  closeGlobalSearch();
  goView("teams");
  save();
  render();
  resetPageScroll();
  const team = getTeam(teamId);
  if (team && canEditTeam(team)) openEditTeamModal(teamId);
}

function openScheduleFromSearch(source, id) {
  closeGlobalSearch();
  openScheduleFromProfile(source, id);
}

function openCallupFromSearch(callupId) {
  closeGlobalSearch();
  openCallupFromManagement(callupId);
}

function openDocumentFromSearch(docId) {
  closeGlobalSearch();
  openDocumentFromManagement(docId);
}

function openResultFromSearch(resultId) {
  const result = state.results.find((item) => item.id === resultId);
  closeGlobalSearch();
  goView("results");
  if (result?.date) state.resultsCursor = toLocalDateKey(mondayOf(new Date(`${result.date}T00:00:00`)));
  save();
  render();
  resetPageScroll();
  openResultDetail(resultId);
}

function openThreadFromSearch(threadId) {
  closeGlobalSearch();
  openThreadFromManagement(threadId);
}

function openAnnouncementFromSearch(announcementId) {
  closeGlobalSearch();
  goView("announcements");
  save();
  render();
  resetPageScroll();
  openAnnouncementDetail(announcementId);
}

function viewTitle(view) {
  return {
    dashboard: t("dashboard"),
    management: t("management"),
    notifications: t("notifications"),
    announcements: t("announcements"),
    results: t("results"),
    calendar: t("calendar"),
    profiles: t("profiles"),
    callups: t("callups"),
    history: t("history"),
    attendance: t("attendance"),
    messages: t("messages"),
    documents: t("documents"),
    teams: t("teams"),
    users: t("users"),
    diagnostics: t("diagnostics"),
    settings: t("settings"),
  }[view];
}

function topbarText(user) {
  const count = visiblePlayerIds(user).length;
  if (hasRole(user, "director")) return `${state.teams.length} equipos · ${state.players.length} jugadores · ${state.users.length} usuarios`;
  return `${roleLabel(activeRole(user))} · ${count} jugador${count === 1 ? "" : "es"} visible${count === 1 ? "" : "s"}`;
}

function renderView() {
  if (!canSee(state.activeView)) return `<div class="empty">${t("noAccess")}</div>`;
  return {
    dashboard: renderDashboard,
    management: renderManagement,
    notifications: renderNotifications,
    announcements: renderAnnouncements,
    results: renderResults,
    calendar: renderCalendar,
    profiles: renderProfiles,
    callups: renderCallups,
    history: renderHistory,
    attendance: renderAttendance,
    messages: renderMessages,
    documents: renderDocuments,
    teams: renderTeams,
    users: renderUsers,
    diagnostics: renderDiagnostics,
    settings: renderSettings,
  }[state.activeView]();
}

function renderDashboard() {
  const visible = visiblePlayerIds();
  const announcements = visibleAnnouncements().slice(0, 3);
  const callups = visibleCallups().slice(0, 3);
  const activityItems = visibleActivityItems().slice(0, 8);
  const unread = unreadNotifications();
  const weekItems = weeklyScheduleItems();
  const weekendResults = currentWeekendResults();
  const statCards = [
    `<article class="card stat clickable-item" onclick="setView('teams')"><span>${t("teams")}</span><strong>${state.teams.length}</strong><span>${state.categories.length} categorias configurables</span></article>`,
    `<article class="card stat clickable-item" onclick="setView('calendar')"><span>${t("calendar")}</span><strong>${weekItems.length}</strong><span>eventos y entrenos esta semana</span></article>`,
    unread.length ? `<article class="card stat clickable-item" onclick="setView('notifications')"><span>${t("unreadNotices")}</span><strong>${unread.length}</strong><span>${visible.length} jugadores vinculados/visibles</span></article>` : "",
  ].filter(Boolean);
  return `
    <section class="panel results-hero ${weekendResults.length >= 4 ? "compact-results" : ""} ${weekendResults.length === 4 ? "four-results" : ""} ${weekendResults.length >= 5 ? "many-results" : ""}" onclick="setView('results')">
      <div class="panel-header">
        <div>
          <h2>${t("weekendResults")}</h2>
          <p>${weekendLabel(new Date())}</p>
        </div>
        <span class="scoreboard-mark">${iconScoreboard()}</span>
      </div>
      <div class="results-strip">${weekendResults.map(renderResultCard).join("") || `<div class="empty">${t("noResults")}</div>`}</div>
    </section>
    <div class="grid ${statCards.length >= 3 ? "three" : "two"}">
      ${statCards.join("")}
    </div>
    <div class="grid two" style="margin-top:16px">
      <section class="panel">
        <div class="panel-header"><div><h2>${t("announcements")}</h2><p>Comunicacion oficial segmentada.</p></div></div>
        <div class="list">${announcements.map(renderAnnouncementItem).join("") || `<div class="empty">Sin anuncios.</div>`}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h2>${t("activityCenter")}</h2><p>${t("activityText")}</p></div><span class="sync-pill">${t("synced")}</span></div>
        <div class="activity-list">${activityItems.map(renderActivityItem).join("") || `<div class="empty">Sin actividad reciente.</div>`}</div>
      </section>
    </div>
    <div class="grid two" style="margin-top:16px">
      <section class="panel">
        <div class="panel-header"><div><h2>${t("visibleWeek")}</h2><p>${t("weekAuto")}</p></div></div>
        <div class="list">${weekItems.map(renderScheduleItem).join("") || `<div class="empty">Sin eventos esta semana.</div>`}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h2>${t("callups")}</h2><p>Convocatorias activas de tus perfiles.</p></div></div>
        <div class="list">${callups.map(renderCallupItem).join("") || `<div class="empty">Sin convocatorias.</div>`}</div>
      </section>
    </div>
  `;
}

function renderManagement() {
  const user = currentUser();
  const visibleTeams = visibleTeamIds();
  const expiredWindow = (items) => items.filter((item) => !isWithinVisibleGrace(item)).length;
  const activeEvents = scheduleItems();
  const pendingCallups = managementPendingCallups();
  const pendingMessages = managementUnreadThreads();
  const upcomingAbsences = managementUpcomingAbsences();
  const recentFiles = managementRecentFiles();
  const changedEvents = managementChangedEvents();
  const unread = unreadNotifications().length;
  const dailyItems = [
    ...pendingCallups.slice(0, 4).map((item) => managementTaskItem(t("callups"), `${getTeam(item.teamId)?.name || ""} vs ${escapeHtml(item.rival)}`, `${item.date} · ${item.time} · ${pendingPlayersText(item)}`, `openCallupFromManagement('${item.id}')`, "gold")),
    ...pendingMessages.slice(0, 4).map((thread) => managementTaskItem(t("messages"), escapeHtml(thread.subject), `Para: ${employeeName(thread.assignedToId)} · ${thread.messages.length} mensajes`, `openThreadFromManagement('${thread.id}')`, "blue")),
    ...upcomingAbsences.slice(0, 4).map((row) => managementTaskItem(t("upcomingAbsences"), escapeHtml(row.player), `${row.date} · ${escapeHtml(row.team)} · ${escapeHtml(row.absence)}`, `setView('attendance')`, "red")),
    ...changedEvents.slice(0, 4).map((notice) => managementTaskItem(t("changedEvents"), escapeHtml(notice.title), escapeHtml(notice.body || ""), `openNotificationTarget('${notice.id}')`, "green")),
    ...recentFiles.slice(0, 4).map((doc) => managementTaskItem(t("recentFiles"), escapeHtml(doc.name), `${getTeam(doc.teamId)?.name || ""} · ${doc.createdAt}`, `openDocumentFromManagement('${doc.id}')`, "")),
  ].slice(0, 12);
  const actions = [
    canPublishAnnouncement() ? { label: t("newAnnouncement"), hint: "Comunicación segmentada por equipo o rol.", action: "openAnnouncementModal()" } : null,
    canCreateEvent() ? { label: t("newEvent"), hint: "Partido, torneo, evento o entreno.", action: "openEventModal()" } : null,
    canCreateCallup() ? { label: t("newCallup"), hint: "Convocatoria con jugadores afectados.", action: "openCallupModal()" } : null,
    canManageResults() ? { label: t("addResult"), hint: "Marcador, crónica y galería posterior.", action: "openResultModal()" } : null,
    canUploadDocument() ? { label: t("newDocument"), hint: "Archivos, fotos o vídeos del equipo.", action: "openDocumentModal()" } : null,
    { label: t("history"), hint: "Consultar eventos y convocatorias ya archivados.", action: "setView('history')" },
    hasRole(user, "director") ? { label: t("addTeam"), hint: "Crear equipo y asignar jugadores.", action: "openTeamModal()" } : null,
  ].filter(Boolean);
  return `
    <div class="management-layout">
      <section class="panel management-panel">
        <div class="panel-header">
          <div><h2>${t("quickActions")}</h2><p>Operaciones habituales para mantener el club al día.</p></div>
        </div>
        <div class="management-grid">
          ${actions
            .map(
              (item) => `
              <button class="management-card" type="button" onclick="${item.action}">
                <strong>${item.label}</strong>
                <span>${item.hint}</span>
              </button>
            `
            )
            .join("")}
        </div>
      </section>
      <section class="panel management-panel">
        <div class="panel-header">
          <div><h2>${t("todayDesk")}</h2><p>Pendientes accionables de convocatorias, mensajes, ausencias, archivos y cambios.</p></div>
        </div>
        <div class="management-task-list">${dailyItems.join("") || `<div class="empty">${t("noPendingWork")}</div>`}</div>
      </section>
      <section class="panel management-panel">
        <div class="panel-header">
          <div><h2>${t("operationalStatus")}</h2><p>Resumen del estado visible para tu rol.</p></div>
        </div>
        <div class="grid three management-stats">
          <article class="card stat clickable-item" onclick="setView('calendar')"><span>${t("calendar")}</span><strong>${activeEvents.length}</strong><span>eventos vigentes</span></article>
          <article class="card stat clickable-item" onclick="setView('callups')"><span>${t("pendingWork")}</span><strong>${pendingCallups.length}</strong><span>convocatorias pendientes</span></article>
          <article class="card stat clickable-item" onclick="setView('notifications')"><span>${t("unreadNotices")}</span><strong>${unread}</strong><span>avisos sin leer</span></article>
        </div>
        <div class="list compact" style="margin-top:14px">
          <article class="item"><strong>${t("dataHealth")}</strong><span class="meta">${visibleTeams.length} equipos visibles · ${state.documents.length} archivos · ${state.results.length} resultados</span></article>
          <article class="item clickable-item" onclick="setView('history')"><strong>Limpieza automática</strong><span class="meta">${expiredWindow([...state.events, ...state.trainings, ...state.callups])} eventos/convocatorias fuera de ventana de 3 días quedan ocultos.</span></article>
        </div>
      </section>
      <section class="panel management-panel">
        <div class="panel-header"><div><h2>${t("activityCenter")}</h2><p>${t("activityText")}</p></div><span class="sync-pill">${t("synced")}</span></div>
        <div class="activity-list">${visibleActivityItems().slice(0, 14).map(renderActivityItem).join("") || `<div class="empty">Sin actividad registrada todavía.</div>`}</div>
      </section>
    </div>
  `;
}

function renderAuditItem(item) {
  const date = new Date(item.at).toLocaleString(state.lang === "es" ? "es-ES" : "en-US", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  return `
    <article class="item audit-item">
      <strong>${escapeHtml(item.label || item.target)}</strong>
      <span class="meta">${escapeHtml(item.action)} · ${escapeHtml(item.userName)} · ${date}</span>
    </article>
  `;
}

function visibleActivityItems() {
  const user = currentUser();
  if (!user) return [];
  const teams = visibleTeamIds(user);
  const rawNotices = visibleNotifications(user, 30);
  const noticeDocumentIds = new Set(rawNotices.map((notice) => notice.documentId).filter(Boolean));
  const notices = rawNotices.map((notice) => ({
    id: `notice:${notice.id || notificationCanonicalKey(notice)}`,
    date: notice.createdAt || "",
    kind: notificationTypeLabel(notificationType(notice)),
    title: notice.title,
    meta: notice.body || "",
    tone: notice.read ? "" : "gold",
    action: `openNotificationTarget('${notice.id}')`,
  }));
  const docs = (state.documents || [])
    .filter((doc) => teams.includes(doc.teamId))
    .filter((doc) => !noticeDocumentIds.has(doc.id))
    .slice(0, 20)
    .map((doc) => ({
      id: `doc:${doc.id}`,
      date: doc.createdAt || "",
      kind: t("documents"),
      title: doc.name,
      meta: `${getTeam(doc.teamId)?.name || ""}${doc.uploadedBy ? ` · ${doc.uploadedBy}` : ""}`,
      tone: "blue",
      action: `openDocumentFromManagement('${doc.id}')`,
    }));
  const threads = visibleThreads()
    .slice(0, 20)
    .map((thread) => {
      const last = thread.messages?.[thread.messages.length - 1];
      return {
        id: `thread:${thread.id}`,
        date: last?.at || "",
        kind: t("messages"),
        title: thread.subject,
        meta: last?.text || last?.body || "",
        tone: "green",
        action: `openThreadFromManagement('${thread.id}')`,
      };
    });
  const audits = canUseManagement(user)
    ? (state.auditLog || []).slice(0, 25).map((item) => ({
        id: `audit:${item.id}`,
        date: item.at || "",
        kind: t("audit"),
        title: item.label || item.target,
        meta: `${item.action || ""} · ${item.userName || ""}`,
        details: item.details || null,
        tone: "",
        action: auditAction(item),
      }))
    : [];
  return dedupeActivityItems([...notices, ...docs, ...threads, ...audits]).sort((a, b) => activityDateValue(b.date) - activityDateValue(a.date));
}

function dedupeActivityItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.id}:${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function renderActivityItem(item) {
  const date = formatActivityDate(item.date);
  return `
    <button class="activity-item" type="button" onclick="${item.action || ""}">
      <span class="activity-dot ${item.tone || ""}"></span>
      <span>
        <strong>${escapeHtml(item.title || "")}</strong>
        <em>${escapeHtml(item.kind || "")}${date ? ` · ${date}` : ""}${item.meta ? ` · ${item.meta}` : ""}</em>
        ${item.details ? renderActivityDetails(item.details) : ""}
      </span>
    </button>
  `;
}

function renderActivityDetails(details) {
  const entries = Object.entries(details || {}).filter(([, value]) => value !== "" && value !== null && value !== undefined && value !== 0);
  if (!entries.length) return "";
  return `<span class="activity-detail-line">${entries.map(([key, value]) => `<i>${escapeHtml(operationDetailLabel(key))}: ${escapeHtml(String(value))}</i>`).join("")}</span>`;
}

function operationDetailLabel(key) {
  return {
    rows: "filas",
    created: "creados",
    updated: "actualizados",
    users: "usuarios",
    teams: "equipos",
    documents: "archivos",
    events: "eventos",
    players: "jugadores",
    operation: "operación",
  }[key] || key;
}

function auditAction(item) {
  if (item.target === "document") return "setView('documents')";
  if (item.target === "event" || item.target === "training" || item.target === "callup") return "setView('calendar')";
  if (item.target === "thread") return "setView('messages')";
  if (item.target === "team") return "setView('teams')";
  if (item.target === "user" || item.target === "player") return "setView('profiles')";
  if (item.target === "result" || item.target === "gallery") return "setView('results')";
  if (item.target === "announcement") return "setView('announcements')";
  return "setView('management')";
}

function formatActivityDate(value) {
  if (!value) return "";
  if (/^\d{2}:\d{2}/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(state.lang === "es" ? "es-ES" : "en-US", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function activityDateValue(value) {
  if (!value) return 0;
  if (/^\d{2}:\d{2}/.test(value)) return Date.now();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function managementPendingCallups() {
  const players = visiblePlayerIds();
  return visibleCallups()
    .filter((callup) => callup.playerIds.some((id) => players.includes(id) && callup.responses?.[id] === "pending"))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

function pendingPlayersText(callup) {
  const players = visiblePlayerIds()
    .filter((id) => callup.playerIds.includes(id) && callup.responses?.[id] === "pending")
    .map((id) => getPlayer(id)?.name)
    .filter(Boolean);
  return `${players.length} pendientes${players.length ? `: ${players.slice(0, 3).join(", ")}` : ""}`;
}

function managementUnreadThreads() {
  const user = currentUser();
  return visibleThreads().filter((thread) => {
    const last = thread.messages[thread.messages.length - 1];
    if (!last) return false;
    const incoming = thread.assignedToId === user.id ? last.from === "user" : last.from === "club";
    return incoming && thread.seenBy?.[user.id] !== thread.messages.length;
  });
}

function managementUpcomingAbsences() {
  const today = new Date();
  const limit = new Date(today);
  limit.setDate(today.getDate() + 14);
  return attendanceRows()
    .filter((row) => row.absence)
    .filter((row) => {
      const date = new Date(`${row.date}T00:00:00`);
      return date >= new Date(today.toDateString()) && date <= limit;
    })
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

function managementRecentFiles() {
  const teams = visibleTeamIds();
  return (state.documents || [])
    .filter((doc) => teams.includes(doc.teamId))
    .slice()
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function managementChangedEvents() {
  return unreadNotifications()
    .filter((notice) => notice.eventId)
    .filter((notice) => /modificado|modificada|cancelado|cancelada|changed|cancelled/i.test(`${notice.title} ${notice.body || ""}`));
}

function managementTaskItem(kind, title, meta, action, tone = "") {
  return `
    <article class="item management-task clickable-item" onclick="${action}">
      <div>
        <span class="pill ${tone}">${kind}</span>
        <h3>${title}</h3>
        <div class="meta">${meta}</div>
      </div>
      <button class="btn" type="button" onclick="event.stopPropagation(); ${action}">${t("openItem")}</button>
    </article>
  `;
}

function openCallupFromManagement(callupId) {
  goView("callups");
  save();
  render();
  resetPageScroll();
  openCallupDetail(callupId);
}

function openThreadFromManagement(threadId) {
  goView("messages");
  state.activeThreadId = threadId;
  const thread = state.threads.find((item) => item.id === threadId);
  if (thread) {
    thread.seenBy ||= {};
    thread.seenBy[currentUser().id] = thread.messages.length;
  }
  save();
  render();
  resetPageScroll();
}

function openDocumentFromManagement(docId) {
  const doc = state.documents.find((item) => item.id === docId);
  if (doc) {
    state.activeDocumentTeamId = doc.teamId;
    state.activeDocumentFolderId = doc.folderId || "";
  }
  goView("documents");
  save();
  render();
  resetPageScroll();
  if (doc?.url) openDocumentFile(docId);
}

function visibleResults() {
  const teams = visibleTeamIds();
  return (state.results || [])
    .filter((result) => !state.activeSeasonId || result.seasonId === state.activeSeasonId)
    .filter((result) => !state.activeCompetitionId || result.competitionId === state.activeCompetitionId)
    .filter((result) => !result.teamId || teams.includes(result.teamId) || staffCanSeeTeam(result.teamId))
    .sort((a, b) => `${b.date}`.localeCompare(`${a.date}`));
}

function weekendRange(dateLike) {
  const start = mondayOf(new Date(dateLike));
  const saturday = new Date(start);
  saturday.setDate(start.getDate() + 5);
  const monday = new Date(start);
  monday.setDate(start.getDate() + 7);
  return { start, saturday, end: monday };
}

function weekendLabel(dateLike) {
  const { saturday, end } = weekendRange(dateLike);
  const sunday = new Date(end);
  sunday.setDate(end.getDate() - 1);
  const locale = state.lang === "es" ? "es-ES" : "en-US";
  const startText = saturday.toLocaleDateString(locale, { day: "2-digit", month: "short" });
  const endText = sunday.toLocaleDateString(locale, { day: "2-digit", month: "short" });
  return `${startText} - ${endText}`;
}

function resultsForWeekend(dateLike, targetState = state) {
  const { saturday, end } = weekendRange(dateLike);
  const sourceResults = targetState?.results ? targetState.results : visibleResults();
  return sourceResults.filter((result) => {
    const date = new Date(`${result.date}T00:00:00`);
    return date >= saturday && date < end;
  });
}

function currentWeekendResults() {
  return resultsForWeekend(new Date());
}

function resultTeams(result) {
  const team = getTeam(result.teamId);
  const clubName = team?.name || t("team");
  if (result.homeAway === "away") {
    return {
      home: result.opponent || t("rival"),
      away: clubName,
      homeScore: result.opponentScore,
      awayScore: result.teamScore,
      clubWon: Number(result.teamScore) > Number(result.opponentScore),
      draw: Number(result.teamScore) === Number(result.opponentScore),
    };
  }
  return {
    home: clubName,
    away: result.opponent || t("rival"),
    homeScore: result.teamScore,
    awayScore: result.opponentScore,
    clubWon: Number(result.teamScore) > Number(result.opponentScore),
    draw: Number(result.teamScore) === Number(result.opponentScore),
  };
}

function renderResultCard(result) {
  const match = resultTeams(result);
  const status = match.draw ? "Empate" : match.clubWon ? "Victoria" : "Derrota";
  return `
    <article class="result-card item clickable-item" onclick="event.stopPropagation(); openResultDetail('${result.id}')">
      <div class="result-date">${result.date}</div>
      <div class="scoreline">
        <span>${escapeHtml(match.home)}</span>
        <strong>${match.homeScore} - ${match.awayScore}</strong>
        <span>${escapeHtml(match.away)}</span>
      </div>
      <div class="result-meta">
        <span class="pill ${match.draw ? "gold" : match.clubWon ? "green" : "red"}">${status}</span>
        <span>${escapeHtml(getCompetition(result.competitionId)?.name || "")}</span>
        <span>${escapeHtml(result.place || "")}</span>
      </div>
    </article>
  `;
}

function renderResults() {
  const cursor = new Date(`${state.resultsCursor}T00:00:00`);
  const results = resultsForWeekend(cursor);
  const stats = teamStatsForCompetition(state.activeCompetitionId);
  return `
    <section class="panel results-section">
      <div class="panel-header">
        <div><h2>${t("weekendResults")}</h2><p>${weekendLabel(cursor)} · ${escapeHtml(getCompetition(state.activeCompetitionId)?.name || t("competitions"))}</p></div>
        <div class="actions">
          ${seasonCompetitionControls()}
          <button class="btn icon-only" type="button" onclick="moveResultsWeek(-1)" aria-label="Semana anterior">&lt;</button>
          <button class="btn" type="button" onclick="goToCurrentResultsWeek()">Este finde</button>
          <button class="btn icon-only" type="button" onclick="moveResultsWeek(1)" aria-label="Semana siguiente">&gt;</button>
          ${canManageResults() ? `<button class="btn primary" type="button" onclick="openResultModal()">${t("addResult")}</button>` : ""}
        </div>
      </div>
      <div class="results-grid">${results.map(renderResultCard).join("") || `<div class="empty">${t("noResults")}</div>`}</div>
    </section>
    <div class="grid two" style="margin-top:16px">
      <section class="panel">
        <div class="panel-header">
          <div><h2>${t("officialStandings")}</h2><p>Datos demo preparados para enseñar clasificación, resultados y actas.</p></div>
        </div>
        <div class="presentation-note">Modo presentación: datos oficiales simulados, sin conexión con federaciones externas.</div>
        <div class="list">${visibleTeamsWithStandings().map(renderOfficialStandingsBlock).join("") || `<div class="empty">Sin clasificaciones oficiales cargadas.</div>`}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h2>${t("teamStats")}</h2><p>Racha, últimos resultados, próximos partidos y asistencia media.</p></div></div>
        <div class="list">${stats.map(renderTeamStatsCard).join("") || `<div class="empty">Sin datos suficientes.</div>`}</div>
      </section>
    </div>
    <section class="panel public-results-panel" style="margin-top:16px">
      <div class="panel-header"><div><h2>${t("publicView")}</h2><p>Resumen compartible sin datos privados.</p></div></div>
      ${renderPublicResultsView()}
    </section>
    ${canManageResults() ? renderSeasonCompetitionAdmin() : ""}
  `;
}

function openResultDetail(resultId) {
  const result = state.results.find((item) => item.id === resultId);
  if (!result) return;
  const match = resultTeams(result);
  openModal(
    t("results"),
    `<article class="article-detail result-detail">
      <div class="scoreline large">
        <span>${escapeHtml(match.home)}</span>
        <strong>${match.homeScore} - ${match.awayScore}</strong>
        <span>${escapeHtml(match.away)}</span>
      </div>
      <div class="meta">${result.date} @ ${escapeHtml(result.place || "")} · ${escapeHtml(getCompetition(result.competitionId)?.name || "")}</div>
      <p>${escapeHtml(result.notes || "")}</p>
      <div class="actions">
        <button class="btn gallery-action" type="button" onclick="openResultGalleryModal('${result.id}')">${t("gallery")} (${(result.gallery || []).length})</button>
        ${canManageResults() ? `<button class="btn" type="button" onclick="openPasteMatchReportModal('${result.id}')">${t("pasteMatchReport")}</button><button class="btn primary" type="button" onclick="fetchOfficialMatchReport('${result.id}')">${t("updateMatchReport")}</button>` : ""}
      </div>
      ${renderMatchReport(result.officialMatchReport, result)}
      ${
        canManageResults()
          ? `<div class="actions"><button class="btn" type="button" onclick="openEditResultModal('${result.id}')">${t("edit")}</button><button class="btn danger" type="button" onclick="deleteResult('${result.id}')">${t("delete")}</button></div>`
          : ""
      }
    </article>`
  );
}

function seasonCompetitionControls() {
  const competitions = state.competitions.filter((competition) => competition.seasonId === state.activeSeasonId);
  return `
    <select class="compact-select light-select" onchange="setActiveSeason(this.value)">
      ${state.seasons.map((season) => `<option value="${season.id}" ${state.activeSeasonId === season.id ? "selected" : ""}>${escapeHtml(season.name)}</option>`).join("")}
    </select>
    <select class="compact-select light-select" onchange="setActiveCompetition(this.value)">
      ${competitions.map((competition) => `<option value="${competition.id}" ${state.activeCompetitionId === competition.id ? "selected" : ""}>${escapeHtml(competition.name)}</option>`).join("")}
    </select>
  `;
}

function setActiveSeason(seasonId) {
  state.activeSeasonId = seasonId;
  const competition = state.competitions.find((item) => item.seasonId === seasonId);
  state.activeCompetitionId = competition?.id || "";
  save();
  render();
}

function setActiveCompetition(competitionId) {
  state.activeCompetitionId = competitionId;
  save();
  render();
}

function competitionStandings(competitionId) {
  const competition = getCompetition(competitionId);
  const rows = new Map();
  const ensure = (teamId) => {
    if (!rows.has(teamId)) rows.set(teamId, { teamId, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0 });
    return rows.get(teamId);
  };
  visibleResults()
    .filter((result) => result.competitionId === competitionId)
    .forEach((result) => {
      const row = ensure(result.teamId);
      row.played += 1;
      row.gf += Number(result.teamScore || 0);
      row.ga += Number(result.opponentScore || 0);
      if (Number(result.teamScore) > Number(result.opponentScore)) {
        row.wins += 1;
        row.points += Number(competition?.pointsWin ?? 3);
      } else if (Number(result.teamScore) === Number(result.opponentScore)) {
        row.draws += 1;
        row.points += Number(competition?.pointsDraw ?? 1);
      } else {
        row.losses += 1;
        row.points += Number(competition?.pointsLoss ?? 0);
      }
    });
  return [...rows.values()].sort((a, b) => b.points - a.points || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf);
}

function renderStandingsTable(rows) {
  if (!rows.length) return `<div class="empty">Sin clasificación publicada todavía.</div>`;
  return `
    <div class="table-wrap standings-table">
      <table>
        <thead><tr><th>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>Pts</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td><strong>${escapeHtml(getTeam(row.teamId)?.name || "")}</strong></td><td>${row.played}</td><td>${row.wins}</td><td>${row.draws}</td><td>${row.losses}</td><td>${row.gf}</td><td>${row.ga}</td><td><strong>${row.points}</strong></td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function visibleTeamsWithStandings() {
  const ids = visibleTeamIds();
  return state.teams.filter((team) => ids.includes(team.id) && (team.officialStandings || []).length);
}

function renderStandingsImportTools() {
  const competition = getCompetition(state.activeCompetitionId);
  const teams = state.teams.filter((team) => visibleTeamIds().includes(team.id));
  return `
    <div class="federation-tools">
      <div class="meta">${competition?.federationUrl ? `URL competicion: ${escapeHtml(competition.federationUrl)}` : "Anade la URL de liga en la competicion o en cada equipo."}</div>
      <div class="actions">
        ${teams
          .map(
            (team) => `
              <button class="btn" type="button" onclick="openFederationAssistantModal('${team.id}')">${team.federationUrl || team.standingsUrl ? "Editar vínculo" : "Vincular"} - ${escapeHtml(team.name)}</button>
              <button class="btn" type="button" onclick="diagnoseFederationLink('${team.id}','${state.activeCompetitionId}')">Analizar vínculo</button>
              <button class="btn" type="button" onclick="fetchOfficialStandings('${team.id}')">${t("updateTeamStandings")} - ${escapeHtml(team.name)}</button>
              <button class="btn" type="button" onclick="fetchTeamCompetitionResults('${team.id}','${state.activeCompetitionId}')">${t("importCompetitionResults")} - ${escapeHtml(team.federationTeamName || team.name)}</button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderFederationTeamTools() {
  const competition = getCompetition(state.activeCompetitionId);
  const teams = state.teams.filter((team) => visibleTeamIds().includes(team.id));
  if (!teams.length) return "";
  if (!state.activeFederationTeamId || !teams.some((team) => team.id === state.activeFederationTeamId)) state.activeFederationTeamId = teams[0].id;
  const team = getTeam(state.activeFederationTeamId) || teams[0];
  const linked = Boolean(team.federationUrl || team.standingsUrl);
  return `
    <div class="federation-tools">
      <div class="federation-head">
        <div>
          <strong>Federacion por equipo</strong>
          <div class="meta">${competition?.federationUrl ? `URL competicion: ${escapeHtml(competition.federationUrl)}` : "Selecciona un equipo y vincula su URL federativa."}</div>
        </div>
        <select class="compact-select light-select" onchange="setActiveFederationTeam(this.value)">
          ${teams.map((item) => `<option value="${item.id}" ${item.id === team.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
        </select>
      </div>
      <div class="federation-team-panel">
        <div>
          <h3>${escapeHtml(team.name)}</h3>
          <div class="meta">Nombre federacion: ${escapeHtml(team.federationTeamName || "Sin vincular")}</div>
          <div class="meta">URL: ${team.federationUrl || team.standingsUrl ? escapeHtml(team.federationUrl || team.standingsUrl) : "Sin URL"}</div>
        </div>
        <div class="actions">
          <button class="btn primary" type="button" onclick="openFederationAssistantModal('${team.id}')">${linked ? "Editar vinculo" : "Vincular equipo"}</button>
          <button class="btn" type="button" onclick="diagnoseFederationLink('${team.id}','${state.activeCompetitionId}')">Analizar</button>
          <button class="btn" type="button" onclick="fetchOfficialStandings('${team.id}')">${t("updateTeamStandings")}</button>
          <button class="btn" type="button" onclick="fetchTeamCompetitionResults('${team.id}','${state.activeCompetitionId}')">${t("importCompetitionResults")}</button>
        </div>
      </div>
    </div>
  `;
}

function setActiveFederationTeam(teamId) {
  state.activeFederationTeamId = teamId;
  save();
  render();
}

function renderOfficialStandingsBlock(team) {
  return `
    <article class="item official-standings-block">
      <div class="item-row">
        <div>
          <h3>${escapeHtml(team.name)}</h3>
          <div class="meta">${t("lastStandingsUpdate")}: ${team.standingsUpdatedAt ? formatActivityDate(team.standingsUpdatedAt) : "Sin fecha"}${team.federationTeamName ? ` - ${escapeHtml(team.federationTeamName)}` : ""}${team.federationUrl || team.standingsUrl ? ` - ${escapeHtml(team.federationUrl || team.standingsUrl)}` : ""}</div>
        </div>
        <span class="pill green">Demo oficial</span>
      </div>
      ${renderOfficialStandingsTable(team.officialStandings || [])}
    </article>
  `;
}

function renderOfficialStandingsTable(rows) {
  if (!rows.length) return `<div class="empty">Sin clasificación oficial.</div>`;
  return `
    <div class="table-wrap standings-table">
      <table>
        <thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>Pts</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.position || ""}</td><td><strong>${escapeHtml(row.team || "")}</strong></td><td>${row.played ?? ""}</td><td>${row.wins ?? ""}</td><td>${row.draws ?? ""}</td><td>${row.losses ?? ""}</td><td>${row.gf ?? ""}</td><td>${row.ga ?? ""}</td><td><strong>${row.points ?? ""}</strong></td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function openFederationAssistantModal(teamId = "") {
  if (!canManageResults()) return;
  const teams = state.teams.filter((team) => visibleTeamIds().includes(team.id));
  const selected = getTeam(teamId) || teams.find((team) => team.federationUrl || team.standingsUrl) || teams[0];
  openModal(
    t("federationAssistant"),
    `<form class="form" onsubmit="saveFederationAssistant(event)">
      <p class="meta">Vincula un equipo de KamikApp con el nombre y la URL que usa la federacion. Despues intentara importar sus resultados.</p>
      <div class="form-grid">
        <div class="form-row">
          <label>${t("team")}</label>
          <select name="teamId" onchange="openFederationAssistantModal(this.value)">
            ${teams.map((team) => `<option value="${team.id}" ${selected?.id === team.id ? "selected" : ""}>${escapeHtml(team.name)}</option>`).join("")}
          </select>
        </div>
        <div class="form-row"><label>${t("federationTeamName")}</label><input name="federationTeamName" value="${escapeHtml(selected?.federationTeamName || selected?.name || "")}" required /></div>
        <div class="form-row"><label>${t("teamFederationUrl")}</label><input name="federationUrl" type="url" value="${escapeHtml(selected?.federationUrl || selected?.standingsUrl || "")}" required /></div>
      </div>
      <div class="actions">
        <button class="btn" type="submit" name="mode" value="save">${t("save")}</button>
        <button class="btn primary" type="submit" name="mode" value="import">${t("importCompetitionResults")}</button>
      </div>
    </form>`
  );
}

function saveFederationAssistant(event) {
  event.preventDefault();
  if (!canManageResults()) return;
  const submitter = event.submitter?.value || "save";
  const form = new FormData(event.currentTarget);
  const team = getTeam(form.get("teamId"));
  if (!team) return;
  team.federationTeamName = String(form.get("federationTeamName") || "").trim();
  team.federationUrl = String(form.get("federationUrl") || "").trim();
  if (!team.federationTeamName || !team.federationUrl) {
    state.toast = "Rellena nombre federativo y URL del equipo";
    save("editTeam");
    render();
    return;
  }
  appendAudit("vincular equipo federacion", "team", team.name, { federationTeamName: team.federationTeamName });
  save("editTeam");
  closeModal();
  if (submitter === "import") {
    fetchTeamCompetitionResults(team.id, state.activeCompetitionId);
  } else {
    state.toast = "Equipo vinculado con federacion";
    render();
  }
}

function parseStandingsText(text) {
  const rows = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\t| {2,}|;/).map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 3 && /\d/.test(cells.join(" ")));
  return rows
    .map((cells, index) => {
      const nums = cells.map((cell) => Number(String(cell).replace(/[^\d-]/g, ""))).filter((value) => Number.isFinite(value));
      const position = /^\d+$/.test(cells[0]) ? Number(cells[0]) : index + 1;
      const teamStart = /^\d+$/.test(cells[0]) ? 1 : 0;
      const firstNumberIndex = cells.findIndex((cell, idx) => idx >= teamStart && /^-?\d+$/.test(cell.replace(/[^\d-]/g, "")));
      const team = cells.slice(teamStart, firstNumberIndex > teamStart ? firstNumberIndex : Math.max(teamStart + 1, cells.length - nums.length)).join(" ");
      const [played = "", wins = "", draws = "", losses = "", gf = "", ga = "", points = nums.at(-1) ?? ""] = nums.slice(position === nums[0] ? 1 : 0);
      return { position, team: team || cells[teamStart] || "", played, wins, draws, losses, gf, ga, points };
    })
    .filter((row) => row.team && row.played !== "");
}

function openPasteStandingsModal(teamId) {
  const team = getTeam(teamId);
  if (!team || !canEditTeam(team)) return;
  openModal(
    t("pasteStandings"),
    `<form class="form" onsubmit="savePastedStandings(event,'${team.id}')">
      <p class="meta">Copia la tabla de la web oficial y pegala aqui. Se admiten columnas separadas por tabulador, espacios o punto y coma.</p>
      <div class="form-row"><label>${t("officialStandings")}</label><textarea name="standings" rows="10" placeholder="1 Equipo PJ G E P GF GC Pts"></textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function savePastedStandings(event, teamId) {
  event.preventDefault();
  const team = getTeam(teamId);
  if (!team || !canEditTeam(team)) return;
  const rows = parseStandingsText(new FormData(event.currentTarget).get("standings"));
  if (!rows.length) {
    state.toast = "No se pudo leer la clasificación pegada";
    saveAndClose("editTeam");
    return;
  }
  team.officialStandings = rows;
  team.standingsUpdatedAt = new Date().toISOString();
  appendAudit("actualizar clasificación", "team", team.name, { rows: rows.length });
  saveAndClose("editTeam");
}

async function fetchOfficialStandings(teamId) {
  const team = getTeam(teamId);
  if (!team || !canEditTeam(team)) return;
  const sourceUrl = team.standingsUrl || team.federationUrl || getCompetition(state.activeCompetitionId)?.federationUrl || "";
  if (!sourceUrl) {
    state.toast = "Añade primero la URL de clasificación del equipo";
    save();
    render();
    return;
  }
  try {
    const response = await fetch(API_FETCH_STANDINGS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...requestHeaders("editTeam") },
      body: JSON.stringify({ url: sourceUrl }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.rows?.length) throw new Error(payload.error || "No se pudo leer la clasificación");
    team.officialStandings = payload.rows;
    team.standingsUpdatedAt = new Date().toISOString();
    state.toast = "Clasificación oficial actualizada";
    appendAudit("sincronizar clasificación", "team", team.name, { rows: payload.rows.length });
    save("editTeam");
    render();
  } catch (error) {
    state.toast = `${error.message || "No se pudo actualizar"}. Se mantiene la última clasificación buena.`;
    save();
    render();
  }
}

function normalizeMatchReport(report) {
  if (!report || typeof report !== "object") return null;
  const cleanList = (items) => (Array.isArray(items) ? items.map((item) => String(item || "").trim()).filter(Boolean) : []);
  return {
    title: String(report.title || "").trim(),
    meta: report.meta && typeof report.meta === "object" ? report.meta : {},
    periods: cleanList(report.periods),
    scorers: cleanList(report.scorers),
    penalties: cleanList(report.penalties),
    incidents: cleanList(report.incidents),
    rawText: cleanList(report.rawText).slice(0, 40),
  };
}

function parseMatchReportText(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const report = normalizeMatchReport({
    title: lines.find((line) => !/\d+\s*[-:]\s*\d+/.test(line)) || t("officialMatchReport"),
    meta: {},
    periods: [],
    scorers: [],
    penalties: [],
    incidents: [],
    rawText: lines.slice(0, 40),
  });
  let section = "incidents";
  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (/parcial|periodo|cuarto|tiempo/.test(lower)) section = "periods";
    else if (/gol|goleador|anotador|tanto/.test(lower)) section = "scorers";
    else if (/sanci|penalt|expul|tarjeta|falta/.test(lower)) section = "penalties";
    else if (/incid|observ|arbit|acta/.test(lower)) section = "incidents";
    const scores = [...line.matchAll(/\b\d+\s*[-:]\s*\d+\b/g)].map((match) => match[0]);
    if (scores.length && (section === "periods" || /parcial|periodo|cuarto|tiempo/.test(lower))) report.periods.push(line);
    else if (/gol|goleador|anotador|tanto|\b\d{1,2}[:']\d{0,2}\b/.test(lower) && !/resultado|final/.test(lower)) report.scorers.push(line);
    else if (/sanci|penalt|expul|tarjeta|falta/.test(lower)) report.penalties.push(line);
    else if (line !== report.title && line.length > 4) report.incidents.push(line);
  });
  report.periods = [...new Set(report.periods)].slice(0, 12);
  report.scorers = [...new Set(report.scorers)].slice(0, 20);
  report.penalties = [...new Set(report.penalties)].slice(0, 20);
  report.incidents = [...new Set(report.incidents)].slice(0, 20);
  return report.rawText.length ? report : null;
}

function renderMatchReport(report, result = {}) {
  const normalized = normalizeMatchReport(report);
  if (!normalized || (!normalized.periods.length && !normalized.scorers.length && !normalized.penalties.length && !normalized.incidents.length && !normalized.rawText.length)) {
    return `<section class="match-report-card"><div class="empty">Sin acta oficial importada.</div></section>`;
  }
  const block = (title, items) => items.length ? `<div class="match-report-section"><h4>${title}</h4><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : "";
  return `
    <section class="match-report-card">
      <div class="item-row">
        <div>
          <h3>${escapeHtml(normalized.title || t("officialMatchReport"))}</h3>
          <div class="meta">${t("lastMatchReportUpdate")}: ${result.matchReportUpdatedAt ? formatActivityDate(result.matchReportUpdatedAt) : "Sin fecha"}${result.matchReportUrl ? ` - ${escapeHtml(result.matchReportUrl)}` : ""}</div>
        </div>
      </div>
      <div class="match-report-grid">
        ${block("Parciales", normalized.periods)}
        ${block("Goles / anotaciones", normalized.scorers)}
        ${block("Sanciones", normalized.penalties)}
        ${block("Incidencias", normalized.incidents.length ? normalized.incidents : normalized.rawText.slice(0, 10))}
      </div>
    </section>
  `;
}

function openPasteMatchReportModal(resultId) {
  const result = state.results.find((item) => item.id === resultId);
  if (!result || !canManageResults()) return;
  openModal(
    t("pasteMatchReport"),
    `<form class="form" onsubmit="savePastedMatchReport(event,'${result.id}')">
      <p class="meta">Copia el acta de la web oficial y pegala aqui. La app generara un cuadro de resumen.</p>
      <div class="form-row"><label>${t("officialMatchReport")}</label><textarea name="matchReport" rows="12" placeholder="Resultado, parciales, goles, sanciones, incidencias..."></textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function savePastedMatchReport(event, resultId) {
  event.preventDefault();
  const result = state.results.find((item) => item.id === resultId);
  if (!result || !canManageResults()) return;
  const report = parseMatchReportText(new FormData(event.currentTarget).get("matchReport"));
  if (!report) {
    state.toast = "No se pudo leer el acta pegada";
    saveAndClose("manageResults");
    return;
  }
  result.officialMatchReport = report;
  result.matchReportUpdatedAt = new Date().toISOString();
  state.toast = "Acta guardada";
  appendAudit("actualizar acta", "result", `${getTeam(result.teamId)?.name || ""} vs ${result.opponent}`, { lines: report.rawText.length });
  saveAndClose("manageResults");
}

async function fetchOfficialMatchReport(resultId) {
  const result = state.results.find((item) => item.id === resultId);
  if (!result || !canManageResults()) return;
  const sourceUrl = result.matchReportUrl || getCompetition(result.competitionId)?.federationUrl || "";
  if (!sourceUrl) {
    state.toast = "Añade primero la URL del acta en el resultado";
    save();
    render();
    return;
  }
  try {
    const response = await fetch(API_FETCH_MATCH_REPORT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...requestHeaders("manageResults") },
      body: JSON.stringify({ url: sourceUrl }),
    });
    const payload = await response.json();
    const report = normalizeMatchReport(payload.report);
    if (!response.ok || !report) throw new Error(payload.error || "No se pudo leer el acta");
    result.officialMatchReport = report;
    result.matchReportUpdatedAt = new Date().toISOString();
    state.toast = "Acta oficial actualizada";
    appendAudit("sincronizar acta", "result", `${getTeam(result.teamId)?.name || ""} vs ${result.opponent}`, { lines: report.rawText.length });
    save("manageResults");
    render();
    openResultDetail(result.id);
  } catch (error) {
    state.toast = `${error.message || "No se pudo actualizar"}. Se mantiene la ultima acta buena.`;
    save();
    render();
  }
}

async function fetchCompetitionResults(competitionId) {
  if (!canManageResults()) return;
  const competition = getCompetition(competitionId);
  if (!competition?.federationUrl) {
    state.toast = "Anade primero la URL de la liga en Competiciones";
    save();
    render();
    return;
  }
  try {
    const { response, body: payload } = await postJson(API_FETCH_COMPETITION_URL, "manageResults", { url: competition.federationUrl });
    if (!response.ok) throw new Error(payload.error || "No se pudo leer la competicion");
    const imported = importCompetitionResultRows(payload.results || [], competitionId);
    state.toast = imported ? `${imported} resultado${imported === 1 ? "" : "s"} importado${imported === 1 ? "" : "s"}` : "No se encontraron resultados del club en esa pagina";
    appendAudit("importar resultados federacion", "result", competition.name, { imported, detected: payload.results?.length || 0 });
    save("manageResults");
    render();
  } catch (error) {
    state.toast = `${error.name === "AbortError" ? "La federacion ha tardado demasiado en responder" : error.message || "No se pudo conectar con KamikApp"}. Si la federacion usa ventanas internas, necesitaremos adaptar ese sitio.`;
    save();
    render();
  }
}

async function fetchTeamCompetitionResults(teamId, competitionId) {
  if (!canManageResults()) return;
  const team = getTeam(teamId);
  const competition = getCompetition(competitionId);
  const sourceUrl = team?.federationUrl || team?.standingsUrl || competition?.federationUrl || "";
  if (!team || !sourceUrl) {
    state.toast = "Vincula primero ese equipo con su URL de liga federacion";
    save();
    render();
    return;
  }
  try {
    const { response, body: payload } = await postJson(API_FETCH_COMPETITION_URL, "manageResults", { url: sourceUrl });
    if (!response.ok) throw new Error(payload.error || "No se pudo leer la competicion");
    const imported = importCompetitionResultRowsForTeam(payload.results || [], team, competitionId);
    if (!imported) showFederationDiagnostics(team, payload.diagnostics || {}, payload.results || []);
    state.toast = imported ? `${imported} resultado${imported === 1 ? "" : "s"} importado${imported === 1 ? "" : "s"} para ${team.name}` : `No se encontraron partidos de ${team.federationTeamName || team.name}`;
    appendAudit("importar resultados equipo federacion", "result", team.name, { imported, detected: payload.results?.length || 0 });
    save("manageResults");
    render();
  } catch (error) {
    state.toast = `${error.name === "AbortError" ? "La federacion ha tardado demasiado en responder" : error.message || "No se pudo conectar con KamikApp"}. Puede que la federacion cargue los partidos en una ventana interna.`;
    save();
    render();
  }
}

async function diagnoseFederationLink(teamId, competitionId) {
  if (!canManageResults()) return;
  const team = getTeam(teamId);
  const competition = getCompetition(competitionId);
  const sourceUrl = team?.federationUrl || team?.standingsUrl || competition?.federationUrl || "";
  if (!team || !sourceUrl) {
    state.toast = "Vincula primero ese equipo con su URL de liga federacion";
    save();
    render();
    return;
  }
  try {
    const { response, body: payload } = await postJson(API_FETCH_COMPETITION_URL, "manageResults", { url: sourceUrl });
    if (!response.ok) throw new Error(payload.error || "No se pudo leer la competicion");
    showFederationDiagnostics(team, payload.diagnostics || {}, payload.results || []);
  } catch (error) {
    state.toast = `${error.name === "AbortError" ? "La federacion ha tardado demasiado en responder" : error.message || "No se pudo conectar con KamikApp"}.`;
    save();
    render();
  }
}

function showFederationDiagnostics(team, diagnostics = {}, results = []) {
  const name = team.federationTeamName || team.name;
  const matches = (results || []).filter((row) => namesLookRelated(row.home, name) || namesLookRelated(row.away, name));
  openModal(
    "Diagnostico federacion",
    `<section class="form federation-diagnostics">
      <div class="grid three">
        <article class="card stat"><span>Tablas</span><strong>${diagnostics.tableCount ?? 0}</strong><span>detectadas</span></article>
        <article class="card stat"><span>Clasificacion</span><strong>${diagnostics.standingsRows ?? 0}</strong><span>filas</span></article>
        <article class="card stat"><span>Resultados</span><strong>${diagnostics.resultRows ?? 0}</strong><span>${matches.length} coinciden</span></article>
      </div>
      <div class="form-row"><label>Nombre buscado</label><input value="${escapeHtml(name)}" readonly /></div>
      <div class="form-row"><label>Nombres detectados</label><textarea rows="5" readonly>${escapeHtml((diagnostics.teamNames || []).join("\n") || "No se han detectado nombres de equipos.")}</textarea></div>
      <div class="form-row"><label>Resultados detectados</label><textarea rows="5" readonly>${escapeHtml((results || []).slice(0, 20).map((row) => `${row.date || "sin fecha"} - ${row.home} ${row.homeScore}-${row.awayScore} ${row.away}`).join("\n") || "No se han detectado resultados en el HTML recibido.")}</textarea></div>
      <div class="form-row"><label>Muestra de texto leido</label><textarea rows="7" readonly>${escapeHtml((diagnostics.sample || []).slice(0, 30).join("\n") || "La pagina no ha devuelto texto util.")}</textarea></div>
      <p class="meta">Si aqui no aparecen partidos, la federacion probablemente los carga con una ventana interna o una llamada JavaScript. Entonces hay que hacer un conector especifico para esa web.</p>
    </section>`
  );
}

function importCompetitionResultRows(rows, competitionId) {
  let imported = 0;
  (rows || []).forEach((row) => {
    const home = String(row.home || "").trim();
    const away = String(row.away || "").trim();
    const team = state.teams.find((item) => namesLookRelated(home, item.name) || namesLookRelated(away, item.name));
    if (!team) return;
    const isHome = namesLookRelated(home, team.name);
    const opponent = isHome ? away : home;
    if (!opponent) return;
    const date = row.date || new Date().toISOString().slice(0, 10);
    const duplicate = state.results.some((result) => result.competitionId === competitionId && result.teamId === team.id && result.date === date && namesLookRelated(result.opponent, opponent));
    if (duplicate) return;
    state.results.unshift({
      id: uid("res"),
      teamId: team.id,
      opponent,
      date,
      seasonId: seasonIdForDate(date),
      competitionId,
      place: row.place || "",
      homeAway: isHome ? "home" : "away",
      teamScore: Number(isHome ? row.homeScore : row.awayScore) || 0,
      opponentScore: Number(isHome ? row.awayScore : row.homeScore) || 0,
      notes: "Importado desde federacion",
      matchReportUrl: "",
      officialMatchReport: null,
      matchReportUpdatedAt: "",
      gallery: [],
    });
    imported += 1;
  });
  return imported;
}

function importCompetitionResultRowsForTeam(rows, team, competitionId) {
  let imported = 0;
  const teamName = team.federationTeamName || team.name;
  (rows || []).forEach((row) => {
    const home = String(row.home || "").trim();
    const away = String(row.away || "").trim();
    if (!namesLookRelated(home, teamName) && !namesLookRelated(away, teamName)) return;
    const isHome = namesLookRelated(home, teamName);
    const opponent = isHome ? away : home;
    if (!opponent) return;
    const date = row.date || new Date().toISOString().slice(0, 10);
    const duplicate = state.results.some((result) => result.competitionId === competitionId && result.teamId === team.id && result.date === date && namesLookRelated(result.opponent, opponent));
    if (duplicate) return;
    state.results.unshift({
      id: uid("res"),
      teamId: team.id,
      opponent,
      date,
      seasonId: seasonIdForDate(date),
      competitionId,
      place: row.place || "",
      homeAway: isHome ? "home" : "away",
      teamScore: Number(isHome ? row.homeScore : row.awayScore) || 0,
      opponentScore: Number(isHome ? row.awayScore : row.homeScore) || 0,
      notes: "Importado desde federacion",
      matchReportUrl: "",
      officialMatchReport: null,
      matchReportUpdatedAt: "",
      gallery: [],
    });
    imported += 1;
  });
  return imported;
}

function namesLookRelated(a, b) {
  const clean = (value) => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const left = clean(a);
  const right = clean(b);
  return Boolean(left && right && (left.includes(right) || right.includes(left)));
}

function teamStatsForCompetition(competitionId) {
  return visibleTeamIds().map((teamId) => {
    const results = visibleResults().filter((result) => result.teamId === teamId && result.competitionId === competitionId).sort((a, b) => a.date.localeCompare(b.date));
    const last = results.slice(-5);
    const upcoming = scheduleItems().filter((item) => item.teamId === teamId && item.type === "match").slice(0, 3);
    const trainings = state.trainings.filter((training) => training.teamId === teamId);
    const attendanceValues = trainings.flatMap((training) => Object.values(training.attendance || {}));
    const attendanceAverage = attendanceValues.length ? Math.round((attendanceValues.filter((value) => value === "yes").length / attendanceValues.length) * 100) : 0;
    return { teamId, results, last, upcoming, attendanceAverage, files: state.documents.filter((doc) => doc.teamId === teamId).slice(0, 3) };
  });
}

function renderTeamStatsCard(stats) {
  const streak = stats.last.map((result) => (result.teamScore > result.opponentScore ? "V" : result.teamScore === result.opponentScore ? "E" : "D")).join(" ");
  return `
    <article class="item team-stats-card">
      <div class="item-row"><h3>${escapeHtml(getTeam(stats.teamId)?.name || "")}</h3><span class="pill blue">${stats.results.length} partidos</span></div>
      <div class="meta">Racha: ${streak || "Sin resultados"} · Asistencia media: ${stats.attendanceAverage || "-"}%</div>
      <div class="meta">Próximos: ${stats.upcoming.map((item) => item.title).join(", ") || "Sin partidos próximos"}</div>
      <div class="meta">Archivos recientes: ${stats.files.map((doc) => doc.name).join(", ") || "Sin archivos"}</div>
    </article>
  `;
}

function renderPublicResultsView() {
  const latest = visibleResults().filter((result) => result.competitionId === state.activeCompetitionId).slice(0, 6);
  const officialTeam = visibleTeamsWithStandings()[0];
  return `
    <div class="public-scoreboard">
      <div>
        <h3>KAMIKAZES · ${escapeHtml(getCompetition(state.activeCompetitionId)?.name || t("results"))}</h3>
        <div class="public-result-list">${latest.map((result) => {
          const match = resultTeams(result);
          return `<div><strong>${escapeHtml(match.home)} ${match.homeScore}-${match.awayScore} ${escapeHtml(match.away)}</strong><span>${result.date}</span></div>`;
        }).join("") || `<div class="empty">${t("noResults")}</div>`}</div>
      </div>
      <div>${officialTeam ? renderOfficialStandingsTable(officialTeam.officialStandings.slice(0, 8)) : `<div class="empty">Sin clasificación oficial.</div>`}</div>
    </div>
  `;
}

function renderSeasonCompetitionAdmin() {
  const season = activeSeason();
  const competitions = state.competitions.filter((competition) => competition.seasonId === season?.id);
  return `
    <section class="panel season-admin-panel" style="margin-top:16px">
      <div class="panel-header">
        <div><h2>${t("seasons")} & ${t("competitions")}</h2><p>${t("activeSeason")}: ${escapeHtml(season?.name || "")}</p></div>
        <div class="actions">
          <button class="btn" type="button" onclick="openSeasonModal()">${t("seasons")}</button>
          <button class="btn primary" type="button" onclick="openCompetitionModal()">${t("competitions")}</button>
          ${season && !season.archived ? `<button class="btn warn" type="button" onclick="archiveActiveSeason()">${t("history")}</button>` : ""}
        </div>
      </div>
      <div class="pill-line">${competitions.map((competition) => `<span class="pill ${competition.id === state.activeCompetitionId ? "green" : "blue"}">${escapeHtml(competition.name)} · ${competitionTypeLabel(competition.type)}</span>`).join("")}</div>
    </section>
  `;
}

function openSeasonModal() {
  if (!canManageResults()) return;
  openModal(
    t("seasons"),
    `<form class="form" onsubmit="createSeason(event)">
      <div class="form-grid">
        <div class="form-row"><label>${t("title")}</label><input name="name" placeholder="2027/28" required /></div>
        <div class="form-row"><label>Inicio</label><input name="startsAt" type="date" required /></div>
        <div class="form-row"><label>Fin</label><input name="endsAt" type="date" required /></div>
        <label class="check-row"><input name="active" type="checkbox" checked /> <span>${t("activeSeason")}</span></label>
      </div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function openCompetitionModal() {
  if (!canManageResults()) return;
  const competitions = state.competitions.filter((competition) => competition.seasonId === state.activeSeasonId);
  openModal(
    t("competitions"),
    `<form class="form" onsubmit="createCompetition(event)">
      <div class="form-grid">
        <div class="form-row"><label>${t("title")}</label><input name="name" required /></div>
        <div class="form-row"><label>${t("activeSeason")}</label><select name="seasonId">${state.seasons.map((season) => `<option value="${season.id}" ${state.activeSeasonId === season.id ? "selected" : ""}>${escapeHtml(season.name)}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("type")}</label><select name="type"><option value="league">${t("league")}</option><option value="cup">${t("cup")}</option><option value="tournament">${t("tournamentLabel")}</option><option value="friendly">${t("friendly")}</option></select></div>
        <div class="form-row"><label>${t("federationLeagueUrl")}</label><input name="federationUrl" type="url" /></div>
      </div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>
    <div class="list modal-list">
      ${competitions
        .map(
          (competition) => `
          <form class="item form compact-form" onsubmit="updateCompetition(event,'${competition.id}')">
            <div class="form-grid">
              <div class="form-row"><label>${t("title")}</label><input name="name" value="${escapeHtml(competition.name)}" required /></div>
              <div class="form-row"><label>${t("type")}</label><select name="type"><option value="league" ${competition.type === "league" ? "selected" : ""}>${t("league")}</option><option value="cup" ${competition.type === "cup" ? "selected" : ""}>${t("cup")}</option><option value="tournament" ${competition.type === "tournament" ? "selected" : ""}>${t("tournamentLabel")}</option><option value="friendly" ${competition.type === "friendly" ? "selected" : ""}>${t("friendly")}</option></select></div>
              <div class="form-row"><label>${t("federationLeagueUrl")}</label><input name="federationUrl" type="url" value="${escapeHtml(competition.federationUrl || "")}" /></div>
              <div class="form-row"><label>Pts victoria</label><input name="pointsWin" type="number" value="${Number(competition.pointsWin ?? 3)}" /></div>
            </div>
            <div class="actions"><button class="btn primary" type="submit">${t("save")}</button></div>
          </form>`
        )
        .join("")}
    </div>`
  );
}

function createSeason(event) {
  event.preventDefault();
  if (!canManageResults()) return;
  const form = new FormData(event.currentTarget);
  const season = { id: uid("season"), name: form.get("name"), startsAt: form.get("startsAt"), endsAt: form.get("endsAt"), active: Boolean(form.get("active")), archived: false };
  if (season.active) state.seasons.forEach((item) => (item.active = false));
  state.seasons.push(season);
  if (season.active) state.activeSeasonId = season.id;
  appendAudit("crear temporada", "result", season.name);
  saveAndClose("manageResults");
}

function createCompetition(event) {
  event.preventDefault();
  if (!canManageResults()) return;
  const form = new FormData(event.currentTarget);
  const competition = { id: uid("comp"), seasonId: form.get("seasonId"), name: form.get("name"), type: form.get("type"), federationUrl: form.get("federationUrl") || "", pointsWin: 3, pointsDraw: 1, pointsLoss: 0 };
  state.competitions.push(competition);
  state.activeSeasonId = competition.seasonId;
  state.activeCompetitionId = competition.id;
  appendAudit("crear competición", "result", competition.name);
  saveAndClose("manageResults");
}

function updateCompetition(event, competitionId) {
  event.preventDefault();
  if (!canManageResults()) return;
  const competition = getCompetition(competitionId);
  if (!competition) return;
  const form = new FormData(event.currentTarget);
  competition.name = form.get("name");
  competition.type = form.get("type");
  competition.federationUrl = form.get("federationUrl") || "";
  competition.pointsWin = Number(form.get("pointsWin") || 3);
  competition.pointsDraw ??= 1;
  competition.pointsLoss ??= 0;
  appendAudit("editar competicion", "result", competition.name);
  state.toast = "Competicion actualizada";
  saveAndClose("manageResults");
}

function archiveActiveSeason() {
  if (!canManageResults() || !confirm("Archivar la temporada activa?")) return;
  const season = activeSeason();
  if (!season) return;
  season.archived = true;
  season.active = false;
  appendAudit("archivar temporada", "result", season.name);
  save("manageResults");
  render();
}

function openResultGalleryModal(resultId) {
  const result = state.results.find((item) => item.id === resultId);
  if (!result) return;
  result.gallery ||= [];
  openModal(
    t("gallery"),
    `<section class="result-gallery">
      <div class="panel-header gallery-head">
        <div><h2>${t("matchPhotos")}</h2><p>${escapeHtml(getTeam(result.teamId)?.name || "")} vs ${escapeHtml(result.opponent || "")}</p></div>
        ${
          canManageResultGallery(result)
            ? `<form class="gallery-upload" onsubmit="uploadResultPhotos(event,'${result.id}')">
                <input name="photos" type="file" accept="image/*,video/*" multiple required />
                <button class="btn primary" type="submit">${t("uploadPhotos")}</button>
              </form>`
            : ""
        }
      </div>
      <div class="gallery-grid">${result.gallery.map((photo) => renderResultPhoto(photo, result)).join("") || `<div class="empty">Sin fotos todavia.</div>`}</div>
    </section>`
  );
}

function renderResultPhoto(photo, result) {
  const photoId = photo.id || photo.url;
  return `
    <article class="gallery-photo">
      <button type="button" onclick="openResultPhoto('${photoId}')">
        ${photo.kind?.startsWith("video/") ? `<video src="${photo.url}" muted playsinline></video>` : `<img src="${photo.url}" alt="${escapeHtml(photo.name)}" />`}
        <span>${escapeHtml(photo.name)}</span>
      </button>
      ${canManageResultGallery(result) ? `<button class="mini-action danger" type="button" onclick="deleteResultPhoto('${result.id}','${photoId}')" aria-label="${t("delete")}">×</button>` : ""}
    </article>
  `;
}

function openResultPhoto(photoId) {
  const photo = (state.results || []).flatMap((result) => result.gallery || []).find((item) => (item.id || item.url) === photoId);
  if (!photo) return;
  const body = photo.kind?.startsWith("video/")
    ? `<article class="file-viewer photo-viewer"><video src="${photo.url}" controls></video></article>`
    : `<article class="file-viewer photo-viewer"><img src="${photo.url}" alt="${escapeHtml(photo.name)}" /></article>`;
  openModal(escapeHtml(photo.name), body);
}

function deleteResultPhoto(resultId, photoId) {
  const result = state.results.find((item) => item.id === resultId);
  if (!result || !canManageResultGallery(result) || !confirm("Borrar esta foto?")) return;
  result.gallery = (result.gallery || []).filter((photo) => (photo.id || photo.url) !== photoId);
  state.toast = "Foto borrada";
  appendAudit("borrar foto", "gallery", `${getTeam(result.teamId)?.name || ""} vs ${result.opponent}`);
  save("uploadDocument");
  render();
  openResultGalleryModal(resultId);
}

function moveResultsWeek(offset) {
  const cursor = mondayOf(new Date(`${state.resultsCursor}T00:00:00`));
  cursor.setDate(cursor.getDate() + offset * 7);
  state.resultsCursor = toLocalDateKey(cursor);
  save();
  render();
}

function goToCurrentResultsWeek() {
  state.resultsCursor = toLocalDateKey(mondayOf(new Date()));
  save();
  render();
}

function renderNotificationItem(notice) {
  const player = getPlayer(notice.playerId);
  const type = notificationType(notice);
  return `
    <article class="item notice-item clickable-item" onclick="openNotificationTarget('${notice.id}')">
      <div class="item-row">
        <div>
          <h3>${escapeHtml(notice.title)}</h3>
          <div class="meta">${notice.createdAt}${player ? ` · ${escapeHtml(player.name)}` : ""}</div>
        </div>
        <span class="pill ${type === "files" ? "blue" : type === "callups" ? "gold" : "green"}">${notificationTypeLabel(type)}${notice.count > 1 ? ` · ${notice.count}` : ""}</span>
      </div>
      <p class="meta">${escapeHtml(notice.body || "")}</p>
      ${!notice.read ? `<button class="btn" type="button" onclick="event.stopPropagation(); markNotificationRead('${notice.id}')">${t("markRead")}</button>` : ""}
    </article>
  `;
}

function renderNotifications() {
  const notices = visibleNotifications();
  return `
    <div class="notifications-layout">
      <section class="panel">
        <div class="panel-header">
          <div><h2>${t("notifications")}</h2><p>Avisos agrupados por destino y marcados al abrir.</p></div>
          ${unreadNotifications().length ? `<button class="btn" type="button" onclick="markNotificationsSeen(() => true)">${t("markRead")}</button>` : ""}
        </div>
        <div class="list">${notices.map(renderNotificationItem).join("") || `<div class="empty">Sin avisos.</div>`}</div>
      </section>
      <section class="panel notification-prefs-panel">
        <div class="panel-header"><div><h2>${t("notificationPrefs")}</h2><p>Configura lo que quieres ver como aviso en esta cuenta.</p></div></div>
        <div class="form">
          ${notificationPrefToggle("events", t("notificationEvents"))}
          ${notificationPrefToggle("callups", t("notificationCallups"))}
          ${notificationPrefToggle("files", t("notificationFiles"))}
          ${notificationPrefToggle("announcements", t("notificationAnnouncements"))}
          ${notificationPrefToggle("messages", t("notificationMessages"))}
          <button class="btn" type="button" onclick="testPushNotification()">${t("testPush")}</button>
        </div>
      </section>
    </div>
  `;
}

function notificationPrefToggle(key, label) {
  const user = currentUser();
  return `
    <label class="check-row">
      <input type="checkbox" ${notificationPreferenceEnabled(key, user) ? "checked" : ""} onchange="toggleNotificationPref('${key}')" />
      <span>${label}</span>
    </label>
  `;
}

function openNotificationTarget(notificationId) {
  const notice = state.notifications.find((item) => item.id === notificationId);
  if (!notice) return;
  notice.read = true;
  if (notice.documentId) {
    goView("documents");
    save();
    render();
    resetPageScroll();
    return;
  }
  const eventItem = state.events.find((item) => item.id === notice.eventId);
  if (eventItem) {
    goView("calendar");
    state.calendarCursor = `${eventItem.date.slice(0, 7)}-01`;
    save();
    render();
    resetPageScroll();
    openScheduleDetail("event", eventItem.id);
    return;
  }
  const training = state.trainings.find((item) => item.id === notice.eventId);
  if (training) {
    goView("calendar");
    state.calendarCursor = `${training.date.slice(0, 7)}-01`;
    save();
    render();
    resetPageScroll();
    openScheduleDetail("training", training.id);
    return;
  }
  const callup = state.callups.find((item) => item.eventId === notice.eventId);
  if (callup) {
    goView("callups");
    save();
    render();
    resetPageScroll();
    openCallupDetail(callup.id);
    return;
  }
  save();
  render();
}

function visibleAnnouncements() {
  const user = currentUser();
  const teams = visibleTeamIds();
  return state.announcements.filter((announcement) => {
    if (announcement.targetType === "all") return true;
    if (announcement.targetType === "team") return announcement.targetIds.some((id) => teams.includes(id));
    if (announcement.targetType === "role") return announcement.targetIds.some((role) => user.roles.includes(role));
    return true;
  });
}

function renderAnnouncements() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div><h2>${t("announcements")}</h2><p>Publica el club y elige si va a todos, a roles o a equipos concretos.</p></div>
        <div class="actions">
          ${unreadAnnouncements().length ? `<button class="btn" type="button" onclick="markVisibleAnnouncementsRead()">${t("markRead")}</button>` : ""}
          ${canPublishAnnouncement() ? `<button class="btn primary" type="button" onclick="openAnnouncementModal()">${t("newAnnouncement")}</button>` : ""}
        </div>
      </div>
      <div class="list">${visibleAnnouncements().map(renderAnnouncementItem).join("") || `<div class="empty">Sin anuncios.</div>`}</div>
    </section>
  `;
}

function renderAnnouncementItem(announcement) {
  const read = (state.readAnnouncementIds || []).includes(announcement.id);
  const long = String(announcement.body || "").length > 160;
  return `
    <article class="item ${read ? "read-item" : ""}">
      <div class="item-row">
        <h3>${escapeHtml(announcement.title)}</h3>
        <span class="pill ${announcement.important ? "gold" : ""}">${read ? announcement.createdAt : "Nuevo"}</span>
      </div>
      <div class="meta">${targetLabel(announcement)}</div>
      <p class="clamped-text">${escapeHtml(announcement.body)}</p>
      <div class="actions inline-actions">
        ${long ? `<button class="btn" type="button" onclick="openAnnouncementDetail('${announcement.id}')">${t("open")}</button>` : ""}
        ${!read ? `<button class="btn" type="button" onclick="markAnnouncementRead('${announcement.id}')">${t("markRead")}</button>` : ""}
        ${canPublishAnnouncement() ? `<button class="btn" type="button" onclick="openEditAnnouncementModal('${announcement.id}')">${t("edit")}</button>` : ""}
        ${canPublishAnnouncement() ? `<button class="btn danger" type="button" onclick="deleteAnnouncement('${announcement.id}')">${t("delete")}</button>` : ""}
      </div>
    </article>
  `;
}

function openAnnouncementDetail(announcementId) {
  const announcement = state.announcements.find((item) => item.id === announcementId);
  if (!announcement) return;
  markAnnouncementRead(announcementId);
  openModal(
    escapeHtml(announcement.title),
    `<article class="article-detail">
      <div class="meta">${targetLabel(announcement)} · ${announcement.createdAt}</div>
      <p>${escapeHtml(announcement.body)}</p>
    </article>`
  );
}

function targetLabel(item) {
  if (item.targetType === "all") return t("allClub");
  if (item.targetType === "role") return item.targetIds.map(roleLabel).join(", ");
  if (item.targetType === "team") return item.targetIds.map((id) => getTeam(id)?.name).filter(Boolean).join(", ");
  return "";
}

function renderCalendar() {
  const weekItems = weeklyScheduleItems();
  return `
    <div class="calendar-layout">
      <section class="panel">
        <div class="panel-header">
          <div><h2>${t("visibleWeek")}</h2><p>${t("weekAuto")}</p></div>
          ${canCreateEvent() ? `<button class="btn primary" type="button" onclick="openEventModal()">${t("newEvent")}</button>` : ""}
        </div>
        <div class="list">${weekItems.map(renderScheduleItem).join("") || `<div class="empty">Sin eventos esta semana.</div>`}</div>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div><h2>${t("fullMonth")}</h2></div>
          <div class="actions calendar-actions">
            <button class="btn icon-only calendar-arrow" type="button" onclick="moveMonth(-1)" aria-label="Mes anterior">&lt;</button>
            <button class="btn" type="button" onclick="goToCurrentMonth()">Hoy</button>
            <input class="month-input" type="month" value="${state.calendarCursor.slice(0, 7)}" onchange="setCalendarMonth(this.value)" />
            <button class="btn icon-only calendar-arrow" type="button" onclick="moveMonth(1)" aria-label="Mes siguiente">&gt;</button>
          </div>
        </div>
        ${renderMonthCalendar()}
        ${renderMonthActivityList()}
      </section>
    </div>
  `;
}

function scheduleItems() {
  const teams = visibleTeamIds();
  const user = currentUser();
  const events = state.events
    .filter((event) => isWithinVisibleGrace(event))
    .filter((event) => !event.teamId || staffCanSeeTeam(event.teamId, user) || (teams.includes(event.teamId) && playerCanSeeItem(event, user)))
    .map((event) => ({ ...event, source: "event", color: event.type === "match" ? "blue" : event.type === "tournament" ? "gold" : "green" }));
  const trainings = state.trainings
    .filter((training) => isWithinVisibleGrace(training))
    .filter((training) => (!training.teamId || teams.includes(training.teamId)) && (staffCanSeeTeam(training.teamId, user) || playerCanSeeItem(training, user)))
    .map((training) => ({
      id: training.id,
      source: "training",
      type: "training",
      title: `${t("training")} · ${getTeam(training.teamId)?.name || t("allClub")}`,
      teamId: training.teamId,
      playerIds: training.playerIds || [],
      date: training.date,
      time: training.time,
      place: training.place || "",
      notes: training.notes || "",
      color: "training",
    }));
  return [...events, ...trainings].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

function archivedScheduleItems() {
  const teams = visibleTeamIds();
  const user = currentUser();
  const events = state.events
    .filter((event) => !isWithinVisibleGrace(event))
    .filter((event) => !event.teamId || staffCanSeeTeam(event.teamId, user) || (teams.includes(event.teamId) && playerCanSeeItem(event, user)))
    .map((event) => ({ ...event, source: "event", color: event.type === "match" ? "blue" : event.type === "tournament" ? "gold" : "green" }));
  const trainings = state.trainings
    .filter((training) => !isWithinVisibleGrace(training))
    .filter((training) => (!training.teamId || teams.includes(training.teamId)) && (staffCanSeeTeam(training.teamId, user) || playerCanSeeItem(training, user)))
    .map((training) => ({
      id: training.id,
      source: "training",
      type: "training",
      title: `${t("training")} · ${getTeam(training.teamId)?.name || t("allClub")}`,
      teamId: training.teamId,
      playerIds: training.playerIds || [],
      date: training.date,
      time: training.time,
      place: training.place || "",
      notes: training.notes || "",
      color: "training",
    }));
  return [...events, ...trainings].sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
}

function mondayOf(date) {
  const copyDate = new Date(date);
  const day = (copyDate.getDay() + 6) % 7;
  copyDate.setDate(copyDate.getDate() - day);
  copyDate.setHours(0, 0, 0, 0);
  return copyDate;
}

function weeklyScheduleItems() {
  const start = mondayOf(new Date());
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return scheduleItems().filter((item) => {
    const date = new Date(`${item.date}T00:00:00`);
    return date >= start && date < end;
  });
}

function renderScheduleItem(item) {
  const team = getTeam(item.teamId);
  const players = eventPlayerIds(item).map(getPlayer).filter(Boolean);
  const manageable = canManageScheduleItem(item);
  return `
    <article class="item schedule-item clickable-item ${item.source === "training" || item.type === "training" ? "training-item" : ""}" onclick="openScheduleDetail('${item.source}','${item.id}')">
      <div class="item-row">
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <div class="meta">${item.date} · ${item.time} · ${escapeHtml(item.place || "")}</div>
        </div>
        <span class="pill ${item.color}">${t(item.type)}</span>
      </div>
      <div class="pill-line">
        ${team ? `<span class="pill">${team.name}</span>` : `<span class="pill">${t("allClub")}</span>`}
        ${players.length ? `<span class="pill">${players.length} ${t("selectedPlayers").toLowerCase()}</span>` : ""}
        ${item.source === "event" ? `<a class="btn" href="${googleCalendarUrl(item)}" target="_blank" rel="noreferrer" onclick="event.stopPropagation()">${t("google")}</a>` : ""}
        ${item.source === "event" && manageable ? `<button class="btn" type="button" onclick="event.stopPropagation(); openEditEventModal('${item.id}')">${t("editEvent")}</button>` : ""}
        ${item.source === "event" && manageable ? `<button class="btn danger" type="button" onclick="event.stopPropagation(); deleteEvent('${item.id}')">${t("delete")}</button>` : ""}
        ${item.source === "training" && manageable ? `<button class="btn" type="button" onclick="event.stopPropagation(); openEditTrainingModal('${item.id}')">${t("edit")}</button>` : ""}
        ${item.source === "training" && manageable ? `<button class="btn danger" type="button" onclick="event.stopPropagation(); deleteTraining('${item.id}')">${t("delete")}</button>` : ""}
      </div>
      <p class="meta">${escapeHtml(item.notes || "")}</p>
    </article>
  `;
}

function openScheduleDetail(source, id) {
  const item =
    source === "training"
      ? state.trainings.find((training) => training.id === id)
      : state.events.find((eventItem) => eventItem.id === id);
  if (!item) return;
  const team = getTeam(item.teamId);
  const title = source === "training" ? `${t("training")} · ${team?.name || t("allClub")}` : item.title;
  const players = eventPlayerIds(item).map(getPlayer).filter(Boolean);
  const manageable = canManageScheduleItem(item);
  openModal(
    escapeHtml(title),
    `<article class="article-detail schedule-detail">
      <div class="meta">${item.date} · ${item.time} · ${escapeHtml(item.place || "")}</div>
      <div class="pill-line" style="margin:10px 0">
        ${team ? `<span class="pill">${team.name}</span>` : `<span class="pill">${t("allClub")}</span>`}
        ${players.map((player) => `<span class="pill">${escapeHtml(player.name)}</span>`).join("")}
      </div>
      <p>${escapeHtml(item.notes || "")}</p>
      ${
        manageable
          ? `<div class="actions inline-actions">
              ${
                source === "training"
                  ? `<button class="btn" type="button" onclick="openEditTrainingModal('${item.id}')">${t("edit")}</button><button class="btn" type="button" onclick="openDuplicateTrainingModal('${item.id}')">${t("duplicate")}</button><button class="btn" type="button" onclick="openRepeatTrainingModal('${item.id}')">${t("repeatTraining")}</button><button class="btn danger" type="button" onclick="deleteTraining('${item.id}')">${t("delete")}</button>`
                  : `<button class="btn" type="button" onclick="openEditEventModal('${item.id}')">${t("edit")}</button><button class="btn" type="button" onclick="openDuplicateEventModal('${item.id}')">${t("duplicate")}</button><button class="btn danger" type="button" onclick="deleteEvent('${item.id}')">${t("delete")}</button>`
              }
            </div>`
          : ""
      }
      ${source === "training" ? renderTrainingAttendanceDetail(item) : ""}
    </article>`
  );
}

function renderTrainingAttendanceDetail(training) {
  const players = attendancePlayersForTraining(training);
  const manageable = canManage("attendance") && canManageScheduleItem(training);
  return `
    <section class="training-attendance-detail">
      <div class="panel-header"><div><h2>${t("trainingAttendance")}</h2><p>${players.length} jugadores previstos.</p></div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Jugador</th><th>Previsto</th><th>Ausencia</th><th>Club</th></tr></thead>
          <tbody>
            ${players
              .map(
                (player) => `
                <tr>
                  <td>${escapeHtml(player.name)}</td>
                  <td><span class="pill ${training.absences?.[player.id] ? "red" : "green"}">${training.absences?.[player.id] ? t("absentNotice") : t("yes")}</span></td>
                  <td>${training.absences?.[player.id] ? `${training.date}<br><span class="meta">${escapeHtml(training.absences[player.id])}</span>` : ""}</td>
                  <td>${
                    manageable
                      ? `<select onchange="setAttendance('${training.id}','${player.id}',this.value, true)">
                          <option value="" ${!training.attendance?.[player.id] ? "selected" : ""}>${t("pending")}</option>
                          <option value="yes" ${training.attendance?.[player.id] === "yes" ? "selected" : ""}>${t("yes")}</option>
                          <option value="no" ${training.attendance?.[player.id] === "no" ? "selected" : ""}>${t("no")}</option>
                        </select>`
                      : responseLabel(training.attendance?.[player.id] || "pending")
                  }</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      ${manageable ? `<button class="btn primary" type="button" onclick="confirmTraining('${training.id}', true)">${t("confirmTraining")}</button>` : ""}
    </section>
  `;
}

function renderMonthCalendar() {
  const cursor = new Date(`${state.calendarCursor}T00:00:00`);
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = mondayOf(first);
  const items = scheduleItems();
  const monthName = cursor.toLocaleDateString(state.lang === "es" ? "es-ES" : "en-US", { month: "long", year: "numeric" });
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    const date = toLocalDateKey(day);
    const dayItems = items.filter((item) => item.date === date);
    const currentMonth = day.getMonth() === cursor.getMonth();
    return `
      <div class="calendar-day ${currentMonth ? "" : "muted-day"} ${dayItems.length ? "has-event" : ""}">
        <span class="day-number">${day.getDate()}</span>
        <div class="day-dots">${dayItems.slice(0, 3).map((item) => `<i class="${item.color}"></i>`).join("")}</div>
        <div class="day-events">${dayItems.slice(0, 4).map((item) => renderCalendarDayEvent(item)).join("")}</div>
        ${dayItems.length > 4 ? `<span class="day-more">+${dayItems.length - 4}</span>` : ""}
      </div>
    `;
  });
  return `
    <div class="month-title">${monthName}</div>
    <div class="calendar-weekdays"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div>
    <div class="month-grid">${days.join("")}</div>
  `;
}

function renderCalendarDayEvent(item) {
  const typeLabel = t(item.type);
  const hoverTitle = scheduleHoverTitle(item);
  return `<button type="button" class="${item.color}" title="${escapeHtml(hoverTitle)}" onclick="openScheduleDetail('${item.source}','${item.id}')"><span class="event-type-label">${escapeHtml(typeLabel)}</span><span class="event-tooltip">${escapeHtml(hoverTitle)}</span></button>`;
}

function scheduleHoverTitle(item) {
  const typeLabel = t(item.type);
  if (item.type === "training") return `${typeLabel} ${getTeam(item.teamId)?.name || ""}`.trim();
  if (item.type === "match") return `${typeLabel} ${matchCalendarTitle(item)}`.trim();
  return `${typeLabel} ${item.title || getTeam(item.teamId)?.name || ""}`.trim();
}

function matchCalendarTitle(item) {
  const teamName = getTeam(item.teamId)?.name || t("team");
  const callup = item.sourceCallupId ? state.callups.find((entry) => entry.id === item.sourceCallupId) : null;
  const opponent = callup?.rival || opponentFromTitle(item.title, teamName) || item.title || t("rival");
  const separator = isAwayMatch(item) ? "@" : "VS";
  return `${teamName} ${separator} ${opponent}`;
}

function opponentFromTitle(title, teamName) {
  const value = String(title || "");
  const parts = value.split(/\s+(?:vs|@)\s+/i);
  if (parts.length < 2) return "";
  return parts[0].trim().toLowerCase() === String(teamName || "").trim().toLowerCase() ? parts.slice(1).join(" ").trim() : parts[0].trim();
}

function isAwayMatch(item) {
  if (item.homeAway === "away") return true;
  if (String(item.title || "").includes("@")) return true;
  const place = String(item.place || "").toLowerCase();
  if (!place) return false;
  return !/(pista principal|polideportivo municipal|kamikazes|kamikapp)/i.test(place);
}

function renderMonthActivityList() {
  const cursor = new Date(`${state.calendarCursor}T00:00:00`);
  const items = scheduleItems().filter((item) => {
    const date = new Date(`${item.date}T00:00:00`);
    return date.getFullYear() === cursor.getFullYear() && date.getMonth() === cursor.getMonth();
  });
  return `
    <div class="month-activity">
      <h3>Actividades del mes</h3>
      <div class="list compact">${items.map(renderScheduleItem).join("") || `<div class="empty">No hay actividades en este mes.</div>`}</div>
    </div>
  `;
}

function renderProfiles() {
  const playerIds = visiblePlayerIds();
  const query = String(state.profileQuery || "").trim().toLowerCase();
  const teamFilter = state.profileTeamFilter || "";
  const allPlayers = state.players.filter((player) => playerIds.includes(player.id));
  const players = allPlayers
    .filter((player) => !teamFilter || (player.teams || []).includes(teamFilter))
    .filter((player) => !query || `${player.name} ${(player.teams || []).map((id) => getTeam(id)?.name).join(" ")}`.toLowerCase().includes(query));
  if (!state.activeProfilePlayerId || !allPlayers.some((player) => player.id === state.activeProfilePlayerId)) state.activeProfilePlayerId = players[0]?.id || allPlayers[0]?.id || "";
  if (players.length && !players.some((player) => player.id === state.activeProfilePlayerId)) state.activeProfilePlayerId = players[0].id;
  const activePlayer = allPlayers.find((player) => player.id === state.activeProfilePlayerId);
  const teams = visibleTeamIds().map(getTeam).filter(Boolean);
  return `
    <div class="profiles-layout">
      <section class="panel">
        <div class="panel-header"><div><h2>${t("playerProfiles")}</h2><p>Ficha completa con equipos, calendario, convocatorias, asistencia, archivos y familia.</p></div></div>
        <div class="profile-directory">
          <aside class="profile-list-panel">
            <div class="profile-filters">
              <input type="search" value="${escapeHtml(state.profileQuery || "")}" placeholder="Buscar jugador o equipo..." oninput="setProfileQuery(this.value)" />
              <select onchange="setProfileTeamFilter(this.value)">
                <option value="">Todos los equipos</option>
                ${teams.map((team) => `<option value="${team.id}" ${teamFilter === team.id ? "selected" : ""}>${escapeHtml(team.name)}</option>`).join("")}
              </select>
            </div>
            <div class="profile-list">
              ${players.map(renderProfileListItem).join("") || `<div class="empty">Sin jugadores visibles.</div>`}
            </div>
          </aside>
          <div class="profile-detail">
            ${activePlayer ? renderPlayerProfileCard(activePlayer) : `<div class="empty">Selecciona un jugador.</div>`}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderProfileListItem(player) {
  const teams = (player.teams || []).map((id) => getTeam(id)?.name).filter(Boolean);
  return `
    <button class="profile-list-item ${state.activeProfilePlayerId === player.id ? "active" : ""} ${player.active === false ? "disabled" : ""}" type="button" onclick="selectProfilePlayer('${player.id}')">
      <span class="player-avatar small">${escapeHtml(initials(player.name))}</span>
      <span><strong>${escapeHtml(player.name)}</strong><em>${teams.join(", ") || "Sin equipo"}</em></span>
    </button>
  `;
}

function selectProfilePlayer(playerId) {
  state.activeProfilePlayerId = playerId;
  save();
  render();
}

function setProfileQuery(query) {
  state.profileQuery = query;
  render();
}

function setProfileTeamFilter(teamId) {
  state.profileTeamFilter = teamId;
  save();
  render();
}

function renderPlayerProfileCard(player) {
  const teams = (player.teams || []).map(getTeam).filter(Boolean);
  const schedule = playerScheduleItems(player.id).slice(0, 5);
  const callups = playerCallups(player.id).slice(0, 4);
  const rows = playerAttendanceRows(player.id);
  const docs = playerDocuments(player).slice(0, 4);
  const linked = usersForPlayer(player.id);
  const history = playerHistoryItems(player).slice(0, 8);
  const present = rows.filter((row) => row.status === "yes").length;
  const absent = rows.filter((row) => row.status === "no" || row.absence).length;
  const attendancePct = rows.length ? Math.round((present / rows.length) * 100) : 0;
  const editable = canEditPlayerProfile(player);
  const staffNotes = hasRole(currentUser(), "director") || hasRole(currentUser(), "coach") || hasRole(currentUser(), "delegate");
  return `
    <article class="player-profile item ${player.active === false ? "disabled" : ""}">
      <div class="profile-head">
        <div class="player-avatar">${escapeHtml(initials(player.name))}</div>
        <div>
          <h3>${escapeHtml(player.name)}</h3>
          <div class="meta">${player.age} años · ${teams.map((team) => team.name).join(", ") || "Sin equipo"}${player.active === false ? " · Inactivo" : ""}</div>
        </div>
      </div>
      <div class="profile-stats">
        <button type="button" onclick="setView('calendar')"><strong>${schedule.length}</strong><span>${t("upcomingActivity")}</span></button>
        <button type="button" onclick="setView('callups')"><strong>${callups.length}</strong><span>${t("callups")}</span></button>
        <button type="button" onclick="setView('attendance')"><strong>${attendancePct}%</strong><span>${t("attendance")}</span></button>
      </div>
      <div class="profile-section">
        <h4>${t("teams")}</h4>
        <div class="pill-line">${teams.map((team) => `<span class="pill">${escapeHtml(team.name)}</span>`).join("") || `<span class="meta">Sin equipo</span>`}</div>
      </div>
      <div class="profile-section">
        <h4>${t("upcomingActivity")}</h4>
        <div class="mini-list">${schedule.map((item) => `<button type="button" onclick="openScheduleFromProfile('${item.source}','${item.id}')"><strong>${t(item.type)}</strong><span>${item.date} · ${escapeHtml(scheduleHoverTitle(item))}</span></button>`).join("") || `<span class="meta">Sin actividad próxima.</span>`}</div>
      </div>
      <div class="profile-section">
        <h4>${t("callups")}</h4>
        <div class="mini-list">${callups.map((callup) => `<button type="button" onclick="openCallupFromManagement('${callup.id}')"><strong>${responseLabel(callup.responses?.[player.id])}</strong><span>${callup.date} · ${escapeHtml(getTeam(callup.teamId)?.name || "")} vs ${escapeHtml(callup.rival)}</span></button>`).join("") || `<span class="meta">Sin convocatorias activas.</span>`}</div>
      </div>
      <div class="profile-section">
        <h4>${t("attendanceSummary")}</h4>
        <div class="pill-line">
          <span class="pill green">${present} ${t("yes")}</span>
          <span class="pill red">${absent} ${t("no")}</span>
          <span class="pill">${rows.length} registros</span>
        </div>
      </div>
      <div class="profile-section">
        <h4>${t("relatedFiles")}</h4>
        <div class="mini-list">${docs.map((doc) => `<button type="button" onclick="openDocumentFromManagement('${doc.id}')"><strong>${escapeHtml(doc.name)}</strong><span>${escapeHtml(getTeam(doc.teamId)?.name || "")} · ${doc.createdAt}</span></button>`).join("") || `<span class="meta">Sin archivos relacionados.</span>`}</div>
      </div>
      <div class="profile-section">
        <h4>${t("linkedUsers")}</h4>
        <div class="pill-line">${linked.map((user) => `<span class="pill">${escapeHtml(user.name)} · ${user.roles.map(roleLabel).join("/")}</span>`).join("") || `<span class="meta">Sin usuarios vinculados.</span>`}</div>
      </div>
      <div class="profile-section">
        <h4>${t("profileHistory")}</h4>
        <div class="timeline-list">${history.map(renderPlayerHistoryItem).join("") || `<span class="meta">${t("noProfileHistory")}</span>`}</div>
      </div>
      ${
        staffNotes
          ? `<div class="profile-section internal-notes">
              <h4>${t("internalNotes")}</h4>
              <p>${escapeHtml(player.notes || "Sin notas internas.")}</p>
            </div>`
          : ""
      }
      <div class="actions inline-actions">
        ${editable ? `<button class="btn primary" type="button" onclick="openEditPlayerProfileModal('${player.id}')">${t("editProfile")}</button>` : ""}
        <button class="btn" type="button" onclick="openPlayerMessageModal('${player.id}')">${t("contactClub")}</button>
      </div>
    </article>
  `;
}

function initials(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function playerScheduleItems(playerId) {
  return scheduleItems().filter((item) => {
    const ids = eventPlayerIds(item);
    if (ids.length) return ids.includes(playerId);
    return Boolean(item.teamId && getPlayer(playerId)?.teams?.includes(item.teamId));
  });
}

function playerCallups(playerId) {
  return visibleCallups().filter((callup) => callup.playerIds.includes(playerId));
}

function playerAttendanceRows(playerId) {
  const player = getPlayer(playerId);
  if (!player) return [];
  const trainings = state.trainings.filter((training) => !training.teamId || player.teams.includes(training.teamId) || training.playerIds?.includes(playerId));
  return attendanceRows(trainings).filter((row) => row.player === player.name);
}

function playerDocuments(player) {
  return (state.documents || [])
    .filter((doc) => (player.teams || []).includes(doc.teamId))
    .slice()
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function playerHistoryItems(player) {
  const schedule = [...scheduleItems(), ...archivedScheduleItems()]
    .filter((item) => playerScheduleItemApplies(item, player.id))
    .map((item) => ({
      id: item.id,
      source: item.source,
      date: item.date,
      kind: t(item.type),
      title: scheduleHoverTitle(item),
      meta: `${item.time || ""}${item.place ? ` · ${item.place}` : ""}`,
      action: `openScheduleFromProfile('${item.source}','${item.id}')`,
    }));
  const callups = [...visibleCallups(), ...archivedCallups()]
    .filter((callup) => callup.playerIds.includes(player.id))
    .map((callup) => ({
      date: callup.date,
      kind: t("callups"),
      title: `${getTeam(callup.teamId)?.name || ""} vs ${callup.rival}`,
      meta: responseLabel(callup.responses?.[player.id]),
      action: `openCallupFromManagement('${callup.id}')`,
    }));
  const attendance = playerAttendanceRows(player.id)
    .filter((row) => row.absence || row.status === "no")
    .map((row) => ({
      date: row.date,
      kind: t("attendance"),
      title: row.absence ? t("absentNotice") : t("no"),
      meta: `${row.team}${row.absence ? ` · ${row.absence}` : ""}`,
      action: "setView('attendance')",
    }));
  const docs = playerDocuments(player).map((doc) => ({
    date: doc.createdAt || "",
    kind: t("documents"),
    title: doc.name,
    meta: getTeam(doc.teamId)?.name || "",
    action: `openDocumentFromManagement('${doc.id}')`,
  }));
  const threads = visibleThreads()
    .filter((thread) => (thread.relatedPlayerIds || []).includes(player.id))
    .map((thread) => ({
      date: thread.messages?.[thread.messages.length - 1]?.at || "",
      kind: t("messages"),
      title: thread.subject,
      meta: `${thread.messages?.length || 0} mensajes`,
      action: `openThreadFromManagement('${thread.id}')`,
    }));
  return [...schedule, ...callups, ...attendance, ...docs, ...threads].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function playerScheduleItemApplies(item, playerId) {
  const ids = eventPlayerIds(item);
  if (ids.length) return ids.includes(playerId);
  return Boolean(item.teamId && getPlayer(playerId)?.teams?.includes(item.teamId));
}

function renderPlayerHistoryItem(item) {
  return `
    <button type="button" onclick="${item.action}">
      <span>${escapeHtml(item.date || "")}</span>
      <strong>${escapeHtml(item.kind)} · ${escapeHtml(item.title || "")}</strong>
      <em>${escapeHtml(item.meta || "")}</em>
    </button>
  `;
}

function openScheduleFromProfile(source, id) {
  goView("calendar");
  const item = source === "training" ? state.trainings.find((training) => training.id === id) : state.events.find((eventItem) => eventItem.id === id);
  if (item?.date) state.calendarCursor = `${item.date.slice(0, 7)}-01`;
  save();
  render();
  resetPageScroll();
  openScheduleDetail(source, id);
}

function moveMonth(offset) {
  const cursor = new Date(`${state.calendarCursor}T00:00:00`);
  cursor.setMonth(cursor.getMonth() + offset);
  state.calendarCursor = monthKey(cursor);
  save();
  render();
}

function setCalendarMonth(value) {
  if (!value) return;
  state.calendarCursor = `${value}-01`;
  save();
  render();
}

function goToCurrentMonth() {
  state.calendarCursor = monthKey(new Date());
  save();
  render();
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shortTitle(title, max = 22) {
  const value = String(title || "");
  return value.length > max ? `${value.slice(0, Math.max(1, max - 1))}...` : value;
}

function googleCalendarUrl(event) {
  const start = `${event.date.replaceAll("-", "")}T${event.time.replace(":", "")}00`;
  const endDate = new Date(`${event.date}T${event.time}:00`);
  endDate.setHours(endDate.getHours() + 1);
  const end = endDate.toISOString().replace(/[-:]/g, "").slice(0, 15);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    location: event.place || "",
    details: event.notes || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function visibleCallups() {
  const players = visiblePlayerIds();
  const teams = visibleTeamIds();
  const seen = new Set();
  return state.callups.filter((callup) => {
    if (!isWithinVisibleGrace(callup)) return false;
    const visible = teams.includes(callup.teamId) || callup.playerIds.some((id) => players.includes(id));
    if (!visible) return false;
    const key = callup.id || callup.eventId || `${callup.teamId}-${callup.rival}-${callup.date}-${callup.time}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function archivedCallups() {
  const players = visiblePlayerIds();
  const teams = visibleTeamIds();
  const seen = new Set();
  return state.callups
    .filter((callup) => !isWithinVisibleGrace(callup))
    .filter((callup) => {
      const visible = teams.includes(callup.teamId) || callup.playerIds.some((id) => players.includes(id));
      if (!visible) return false;
      const key = callup.id || callup.eventId || `${callup.teamId}-${callup.rival}-${callup.date}-${callup.time}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
}

function renderHistory() {
  const query = (state.historyQuery || "").trim().toLowerCase();
  const type = state.historyType || "all";
  const schedule = archivedScheduleItems()
    .filter((item) => type === "all" || type === "events" || (type === "trainings" && item.source === "training") || (type === "matches" && item.type === "match"))
    .filter((item) => historyText(item).includes(query));
  const callups = archivedCallups()
    .filter((callup) => type === "all" || type === "callups")
    .filter((callup) => historyText(callup).includes(query));
  const sections = [
    type !== "callups" ? `<section class="panel"><div class="panel-header"><div><h2>${t("calendar")}</h2><p>Eventos y entrenos archivados.</p></div></div><div class="list">${schedule.map(renderScheduleItem).join("") || `<div class="empty">Sin eventos archivados.</div>`}</div></section>` : "",
    type === "all" || type === "callups" ? `<section class="panel"><div class="panel-header"><div><h2>${t("callups")}</h2><p>Convocatorias archivadas.</p></div></div><div class="list">${callups.map(renderCallupItem).join("") || `<div class="empty">Sin convocatorias archivadas.</div>`}</div></section>` : "",
  ].filter(Boolean);
  return `
    <div class="history-layout">
      <section class="panel">
        <div class="panel-header">
          <div><h2>${t("history")}</h2><p>${t("historyText")}</p></div>
        </div>
        <div class="history-filters">
          <select onchange="setHistoryType(this.value)">
            <option value="all" ${type === "all" ? "selected" : ""}>${t("allHistory")}</option>
            <option value="events" ${type === "events" ? "selected" : ""}>Eventos</option>
            <option value="matches" ${type === "matches" ? "selected" : ""}>Partidos</option>
            <option value="trainings" ${type === "trainings" ? "selected" : ""}>Entrenos</option>
            <option value="callups" ${type === "callups" ? "selected" : ""}>Convocatorias</option>
          </select>
          <input type="search" value="${escapeHtml(state.historyQuery || "")}" placeholder="Buscar por equipo, rival, lugar..." oninput="setHistoryQuery(this.value)" />
        </div>
      </section>
      ${sections.join("")}
    </div>
  `;
}

function historyText(item) {
  const team = getTeam(item.teamId)?.name || "";
  return `${item.title || ""} ${item.rival || ""} ${item.place || ""} ${team} ${item.date || ""}`.toLowerCase();
}

function setHistoryType(type) {
  state.historyType = type;
  save();
  render();
}

function setHistoryQuery(query) {
  state.historyQuery = query;
  render();
}

function renderCallups() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div><h2>${t("callups")}</h2><p>Direccion publica; padres y jugadores confirman asistencia.</p></div>
        ${canCreateCallup() ? `<button class="btn primary" type="button" onclick="openCallupModal()">${t("newCallup")}</button>` : ""}
      </div>
      <div class="list">${visibleCallups().map(renderCallupItem).join("") || `<div class="empty">Sin convocatorias.</div>`}</div>
    </section>
  `;
}

function renderCallupItem(callup) {
  const userPlayers = visiblePlayerIds().filter((id) => callup.playerIds.includes(id));
  const players = callup.playerIds.map(getPlayer).filter(Boolean);
  const manageable = canManageCallup(callup);
  return `
    <article class="item clickable-item" onclick="openCallupDetail('${callup.id}')">
      <div class="item-row">
        <div>
          <h3>${getTeam(callup.teamId)?.name || ""} vs ${escapeHtml(callup.rival)}</h3>
          <div class="meta">${callup.date} · ${callup.time} · ${escapeHtml(callup.place)} · llegada ${callup.arrival}</div>
        </div>
        <span class="pill gold">${escapeHtml(callup.kit)}</span>
      </div>
      <div class="meta">${escapeHtml(callup.notes || "")}</div>
      <div class="pill-line">
        ${players.map((player) => `<span class="pill ${responseClass(callup.responses[player.id])}">${player.name}: ${responseLabel(callup.responses[player.id])}</span>`).join("")}
      </div>
      ${
        manageable
          ? `<div class="actions inline-actions">
              <button class="btn" type="button" onclick="event.stopPropagation(); openEditCallupModal('${callup.id}')">${t("edit")}</button>
              <button class="btn danger" type="button" onclick="event.stopPropagation(); deleteCallup('${callup.id}')">${t("delete")}</button>
            </div>`
          : ""
      }
      ${
        hasRole(currentUser(), "parent") || hasRole(currentUser(), "player")
          ? `<div class="actions">${userPlayers
              .map(
                (playerId) => `
                <button class="btn response-btn ${callup.responses[playerId] === "yes" ? "selected-yes" : ""}" type="button" onclick="event.stopPropagation(); respondCallup('${callup.id}','${playerId}','yes')">${callup.responses[playerId] === "yes" ? "✓" : ""} ${getPlayer(playerId).name}: ${t("confirmYes")}</button>
                <button class="btn response-btn ${callup.responses[playerId] === "no" ? "selected-no" : ""}" type="button" onclick="event.stopPropagation(); respondCallup('${callup.id}','${playerId}','no')">${callup.responses[playerId] === "no" ? "×" : ""} ${t("confirmNo")}</button>
              `
              )
              .join("")}</div>`
          : ""
      }
    </article>
  `;
}

function openCallupDetail(callupId) {
  const callup = state.callups.find((item) => item.id === callupId);
  if (!callup) return;
  const players = callup.playerIds.map(getPlayer).filter(Boolean);
  openModal(
    `${getTeam(callup.teamId)?.name || ""} vs ${escapeHtml(callup.rival)}`,
    `<article class="article-detail">
      <div class="meta">${callup.date} · ${callup.time} · ${escapeHtml(callup.place)} · llegada ${callup.arrival}</div>
      <div class="pill-line" style="margin:10px 0">
        <span class="pill gold">${escapeHtml(callup.kit)}</span>
        ${players.map((player) => `<span class="pill ${responseClass(callup.responses[player.id])}">${escapeHtml(player.name)}: ${responseLabel(callup.responses[player.id])}</span>`).join("")}
      </div>
      <p>${escapeHtml(callup.notes || "")}</p>
    </article>`
  );
}

function responseLabel(status) {
  return status === "yes" ? t("yes") : status === "no" ? t("no") : t("pending");
}

function responseClass(status) {
  return status === "yes" ? "green" : status === "no" ? "red" : "";
}

function renderAttendance() {
  const teams = visibleTeamIds();
  const trainings = state.trainings.filter((training) => !training.teamId || teams.includes(training.teamId));
  return `
    <section class="panel">
      <div class="panel-header">
        <div><h2>${t("attendance")}</h2><p>La asistencia va por defecto; familias y jugadores avisan ausencia.</p></div>
        ${canViewStats() ? `<button class="btn" type="button" onclick="exportAttendanceCsv()">Exportar CSV</button>` : ""}
      </div>
      ${canViewStats() ? renderAttendanceStats(trainings) : ""}
      ${canViewStats() ? renderAbsenceSummary(trainings) : ""}
      <div class="list">${trainings.map(renderTrainingItem).join("") || `<div class="empty">Sin entrenamientos.</div>`}</div>
    </section>
  `;
}

function renderAttendanceStats(trainings) {
  const rows = attendanceRows(trainings);
  const total = rows.length;
  const present = rows.filter((row) => row.status === "yes").length;
  const absent = rows.filter((row) => row.status === "no").length;
  const warned = rows.filter((row) => row.absence).length;
  return `
    <div class="grid three" style="margin-bottom:14px">
      <article class="card stat"><span>Registros</span><strong>${total}</strong><span>jugador-entreno</span></article>
      <article class="card stat"><span>Asistencia</span><strong>${total ? Math.round((present / total) * 100) : 0}%</strong><span>${present} confirmados</span></article>
      <article class="card stat"><span>Ausencias</span><strong>${absent}</strong><span>${warned} avisadas</span></article>
    </div>
  `;
}

function renderAbsenceSummary(trainings) {
  const rows = attendanceRows(trainings).filter((row) => row.absence);
  if (!rows.length) return "";
  return `
    <div class="absence-summary">
      ${rows
        .map((row) => `<span class="pill red">${row.date} · ${escapeHtml(row.player)} · ${escapeHtml(row.absence)}</span>`)
        .join("")}
    </div>
  `;
}

function attendanceRows(trainings = state.trainings.filter((training) => visibleTeamIds().includes(training.teamId))) {
  return trainings.flatMap((training) => {
    const team = getTeam(training.teamId);
    const scopedPlayers = training.playerIds?.length ? training.playerIds : null;
    return attendancePlayersForTraining(training)
      .filter((player) => (scopedPlayers ? scopedPlayers.includes(player.id) : player.teams.includes(training.teamId)))
      .map((player) => ({
        date: training.date,
        time: training.time,
        team: team?.name || "",
        player: player.name,
        absence: training.absences[player.id] || "",
        status: training.attendance[player.id] || (training.absences[player.id] ? "no" : "yes"),
      }));
  });
}

function renderTrainingItem(training) {
  const team = getTeam(training.teamId);
  const players = attendancePlayersForTraining(training);
  const manageable = canManage("attendance");
  return `
    <article class="item">
      <div class="item-row">
        <div>
          <h3>${team?.name || ""}</h3>
          <div class="meta">${training.date} · ${training.time} · ${escapeHtml(training.place || "")}</div>
        </div>
        <span class="pill ${training.confirmed ? "green" : ""}">${training.confirmed ? t("confirmed") : t("pending")}</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Jugador</th><th>Previsto</th><th>Ausencia</th><th>Confirmacion club</th></tr></thead>
          <tbody>
            ${players
              .map((player) => {
                const visible = visiblePlayerIds().includes(player.id);
                return `
                  <tr>
                    <td>${player.name}</td>
                    <td><span class="pill ${training.absences[player.id] ? "red" : "green"}">${training.absences[player.id] ? t("absentNotice") : t("yes")}</span></td>
                    <td>
                      ${training.absences[player.id] ? `<span class="meta">${training.date}</span><br>` : ""}
                      ${escapeHtml(training.absences[player.id] || "")}
                      ${visible && (hasRole(currentUser(), "parent") || hasRole(currentUser(), "player")) ? `<button class="btn" type="button" onclick="openAbsenceModal('${training.id}','${player.id}')">${t("markAbsence")}</button>` : ""}
                    </td>
                    <td>
                      ${
                        manageable
                          ? `<select onchange="setAttendance('${training.id}','${player.id}',this.value)">
                              <option value="" ${!training.attendance[player.id] ? "selected" : ""}>${t("pending")}</option>
                              <option value="yes" ${training.attendance[player.id] === "yes" ? "selected" : ""}>${t("yes")}</option>
                              <option value="no" ${training.attendance[player.id] === "no" ? "selected" : ""}>${t("no")}</option>
                            </select>`
                          : responseLabel(training.attendance[player.id] || "pending")
                      }
                    </td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
      ${manageable ? `<button class="btn primary" type="button" onclick="confirmTraining('${training.id}')">${t("confirmTraining")}</button>` : ""}
    </article>
  `;
}

function attendancePlayersForTraining(training) {
  const user = currentUser();
  const base = state.players.filter((player) => (training.playerIds?.length ? training.playerIds.includes(player.id) : !training.teamId || player.teams.includes(training.teamId)));
  if (hasRole(user, "director") || hasRole(user, "coach") || hasRole(user, "delegate")) return base;
  const visible = new Set(visiblePlayerIds(user));
  return base.filter((player) => visible.has(player.id));
}

function renderMessages() {
  const user = currentUser();
  const threads = visibleThreads();
  const active = threads.find((thread) => thread.id === state.activeThreadId) || threads[0];
  if (active && state.activeThreadId !== active.id) state.activeThreadId = active.id;
  return `
    <section class="panel chat">
      <div class="thread-list">
        <div class="thread-tools">
          <button class="btn primary" type="button" onclick="openThreadModal()">${t("newThread")}</button>
        </div>
        ${threads
          .map(
            (thread) => `
          <button class="thread-button ${active?.id === thread.id ? "active" : ""}" type="button" onclick="selectThread('${thread.id}')">
            <strong>${escapeHtml(thread.subject)}</strong>
            <div class="meta">${thread.relatedPlayerIds.map((id) => getPlayer(id)?.name).filter(Boolean).join(", ")}</div>
            <div class="meta">Para: ${employeeName(thread.assignedToId)}</div>
          </button>`
          )
          .join("")}
      </div>
      ${
        active
          ? `<div class="chat-window">
              <div class="chat-head"><strong>${escapeHtml(active.subject)}</strong><div class="meta">Canal vertical empleado-familia/jugador</div></div>
              <div class="messages">${active.messages
                .map((message) => `<div class="bubble ${message.from === "club" ? "club" : "user"}"><div>${escapeHtml(message.text)}</div><div class="meta">${message.at}</div></div>`)
                .join("")}</div>
              <form class="composer" onsubmit="sendMessage(event,'${active.id}')">
                <input name="message" placeholder="${t("messagePlaceholder")}" />
                <button class="btn primary" type="submit">${t("send")}</button>
              </form>
            </div>`
          : `<div class="empty">Sin conversaciones.</div>`
      }
    </section>
  `;
}

function employeeName(userId) {
  if (!userId) return "";
  return state.users.find((user) => user.id === userId)?.name || "Club";
}

function employees() {
  return state.users.filter((user) => !user.disabled && user.roles.some((role) => ["director", "coach", "delegate"].includes(role)));
}

function visibleThreads() {
  const user = currentUser();
  if (hasRole(user, "director")) return state.threads;
  if (hasRole(user, "coach") || hasRole(user, "delegate")) return state.threads.filter((thread) => thread.assignedToId === user.id);
  return state.threads.filter((thread) => thread.participantUserIds.includes(user.id));
}

function renderDocuments() {
  const teams = visibleTeamIds();
  if (!state.activeDocumentTeamId || !teams.includes(state.activeDocumentTeamId)) state.activeDocumentTeamId = teams[0] || "";
  const teamId = state.activeDocumentTeamId;
  const folders = state.documentFolders.filter((folder) => folder.teamId === teamId);
  const documents = state.documents.filter((doc) => doc.teamId === teamId && (!state.activeDocumentFolderId || doc.folderId === state.activeDocumentFolderId));
  return `
    <section class="panel">
      <div class="panel-header">
        <div><h2>${t("documents")}</h2><p>Material del club vinculado a cada equipo: documentos, fotos o videos.</p></div>
        <div class="actions">
          ${canUploadDocument() ? `<button class="btn" type="button" onclick="openFolderModal()">${t("newFolder")}</button>` : ""}
          ${canUploadDocument() ? `<button class="btn primary" type="button" onclick="openDocumentModal()">${t("newDocument")}</button>` : ""}
        </div>
      </div>
      <div class="drive-tabs">
        ${teams.map((id) => `<button class="${teamId === id ? "active" : ""}" type="button" onclick="setDocumentTeam('${id}')">${escapeHtml(getTeam(id)?.name || "")}</button>`).join("")}
      </div>
      <div class="folder-row">
        <button class="${!state.activeDocumentFolderId ? "active" : ""}" type="button" onclick="setDocumentFolder('')">${t("allFiles")}</button>
        ${folders.map((folder) => `
          <span class="folder-chip ${state.activeDocumentFolderId === folder.id ? "active" : ""}">
            <button type="button" onclick="setDocumentFolder('${folder.id}')">${escapeHtml(folder.name)}</button>
            ${canUploadDocument() ? `<button class="mini-action" type="button" onclick="openEditFolderModal('${folder.id}')" aria-label="${t("edit")}">✎</button><button class="mini-action danger" type="button" onclick="deleteFolder('${folder.id}')" aria-label="${t("delete")}">×</button>` : ""}
          </span>
        `).join("")}
      </div>
      <div class="drive-grid">${documents.map(renderDocumentItem).join("") || `<div class="empty">Sin documentos para esta carpeta.</div>`}</div>
    </section>
  `;
}

function renderDocumentItem(doc) {
  return `
    <article class="item document-card">
      ${documentPreview(doc)}
      <div>
        <h3>${escapeHtml(doc.name)}</h3>
        <div class="meta">${getTeam(doc.teamId)?.name || ""} · ${folderName(doc.folderId) || t("allFiles")} · ${doc.createdAt} · ${formatSize(doc.size)}</div>
      </div>
      <p class="meta">${escapeHtml(doc.notes || "")}</p>
      <div class="actions inline-actions">
        ${
          doc.url
            ? `<button class="btn" type="button" onclick="openDocumentFile('${doc.id}')">${t("open")}</button>`
            : `<span class="meta">Archivo historico sin contenido local.</span>`
        }
        ${doc.url ? `<a class="btn" href="${doc.url}" download="${escapeHtml(doc.name)}">${t("download")}</a>` : ""}
        ${canUploadDocument() ? `<button class="btn" type="button" onclick="openEditDocumentModal('${doc.id}')">${t("edit")}</button>` : ""}
        ${canUploadDocument() ? `<button class="btn danger" type="button" onclick="deleteDocument('${doc.id}')">${t("delete")}</button>` : ""}
      </div>
    </article>
  `;
}

function documentPreview(doc) {
  if (!doc.url) return `<div class="doc-preview empty-preview">${escapeHtml((doc.kind || "archivo").split("/").pop() || "file")}</div>`;
  if ((doc.kind || "").startsWith("image/")) return `<img class="doc-preview" src="${doc.url}" alt="${escapeHtml(doc.name)}" loading="lazy" />`;
  if ((doc.kind || "").startsWith("video/")) return `<video class="doc-preview" src="${doc.url}" muted preload="metadata"></video>`;
  if (doc.kind === "application/pdf") return `<iframe class="doc-preview" src="${doc.url}#toolbar=0" title="${escapeHtml(doc.name)}"></iframe>`;
  return `<div class="doc-preview empty-preview">${escapeHtml((doc.kind || "archivo").split("/").pop() || "file")}</div>`;
}

function folderName(folderId) {
  return state.documentFolders.find((folder) => folder.id === folderId)?.name || "";
}

function openDocumentFile(docId) {
  const doc = state.documents.find((item) => item.id === docId);
  if (!doc?.url) return;
  openModal(
    escapeHtml(doc.name),
    `<article class="file-viewer">
      ${documentLargePreview(doc)}
      <div class="actions inline-actions">
        <a class="btn" href="${doc.url}" target="_blank" rel="noreferrer">${t("open")}</a>
        <a class="btn primary" href="${doc.url}" download="${escapeHtml(doc.name)}">${t("download")}</a>
      </div>
    </article>`
  );
}

function documentLargePreview(doc) {
  if ((doc.kind || "").startsWith("image/")) return `<img class="file-preview-large" src="${doc.url}" alt="${escapeHtml(doc.name)}" />`;
  if ((doc.kind || "").startsWith("video/")) return `<video class="file-preview-large" src="${doc.url}" controls></video>`;
  if (doc.kind === "application/pdf") return `<iframe class="file-preview-large" src="${doc.url}" title="${escapeHtml(doc.name)}"></iframe>`;
  return `<div class="file-preview-large empty-preview">${escapeHtml(doc.name)}</div>`;
}

function setDocumentTeam(teamId) {
  state.activeDocumentTeamId = teamId;
  state.activeDocumentFolderId = "";
  save();
  render();
}

function setDocumentFolder(folderId) {
  state.activeDocumentFolderId = folderId;
  save();
  render();
}

function formatSize(size) {
  if (!size) return "";
  if (size > 1000000) return `${(size / 1000000).toFixed(1)} MB`;
  return `${Math.ceil(size / 1000)} KB`;
}

function renderTeams() {
  return `
    <div class="grid two">
      <section class="panel">
        <div class="panel-header">
          <div><h2>${t("teams")}</h2><p>Numero de equipos editable cuando cierres A/B y categorias.</p></div>
          ${hasRole(currentUser(), "director") ? `<button class="btn primary" type="button" onclick="openTeamModal()">${t("addTeam")}</button>` : ""}
        </div>
        <div class="list">${state.teams.map(renderTeamItem).join("")}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h2>${t("users")}</h2><p>Un empleado puede tener varios roles, por ejemplo director + entrenador.</p></div></div>
        <div class="list">
          ${state.users.map((user) => `<div class="item"><strong>${user.name}</strong><span class="meta">${user.roles.map(roleLabel).join(" + ")} · ${user.email}</span></div>`).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderTeamItem(team) {
  const players = state.players.filter((player) => player.teams.includes(team.id));
  return `
    <article class="item">
      <div class="item-row"><h3>${team.name}</h3><span class="pill">${team.category}</span></div>
      <div class="meta">Entrenador: ${employeeName(team.coachId) || "Sin asignar"} · Delegado: ${employeeName(team.delegateId) || "Sin asignar"}</div>
      <div class="meta">${t("officialStandings")}: ${(team.officialStandings || []).length ? `${team.officialStandings.length} filas - ${team.standingsUpdatedAt ? formatActivityDate(team.standingsUpdatedAt) : ""}` : "Sin cargar"}</div>
      <div class="pill-line">${players.map((player) => `<span class="pill">${player.name}</span>`).join("")}</div>
      ${
        canEditTeam(team)
          ? `<div class="actions inline-actions">
              <button class="btn" type="button" onclick="openEditTeamModal('${team.id}')">Editar equipo</button>
              <button class="btn" type="button" onclick="openPasteStandingsModal('${team.id}')">${t("pasteStandings")}</button>
              <button class="btn primary" type="button" onclick="fetchOfficialStandings('${team.id}')">${t("updateStandings")}</button>
            </div>`
          : ""
      }
    </article>
  `;
}

function renderUsers() {
  const activeUsers = state.users.filter((user) => !user.disabled).length;
  const linkedPlayers = state.users.filter((user) => user.roles.includes("player") && user.playerId).length;
  return `
    <section class="panel users-admin">
      <div class="panel-header">
        <div><h2>${t("users")}</h2><p>Altas, permisos de acceso y vinculos con jugadores/familias.</p></div>
        ${
          canUseDataTools()
            ? `<div class="actions">
                ${canImportMembers() ? `<button class="btn" type="button" onclick="openQuickPlayerModal()">${t("quickPlayerSignup")}</button>` : ""}
                ${canImportMembers() ? `<button class="btn" type="button" onclick="openImportPlayersModal()">${t("importPlayers")}</button>` : ""}
                ${canImportMembers() ? `<button class="btn" type="button" onclick="downloadPlayerImportTemplate()">${t("downloadTemplate")}</button>` : ""}
                ${canExportData() ? `<button class="btn" type="button" onclick="exportMembersCsv()">${t("exportMembers")}</button>` : ""}
                ${canExportData() ? `<button class="btn" type="button" onclick="exportTeamsCsv()">${t("exportTeams")}</button>` : ""}
                ${canExportData() ? `<button class="btn" type="button" onclick="exportUsersCsv()">${t("exportUsers")}</button>` : ""}
                ${canBackupData() ? `<button class="btn" type="button" onclick="downloadFullBackup()">${t("backupData")}</button>` : ""}
                ${canRestoreData() ? `<button class="btn" type="button" onclick="openRestoreBackupModal()">${t("restoreData")}</button>` : ""}
                ${state.lastUndo && canUndoBulkOperation() ? `<button class="btn danger" type="button" onclick="undoLastBulkOperation()">${t("undoLastOperation")}</button>` : ""}
                ${canManageUsers() ? `<button class="btn primary" type="button" onclick="openUserModal()">${t("newUser")}</button>` : ""}
              </div>`
            : ""
        }
      </div>
      ${state.lastUndo && canUndoBulkOperation() ? `<div class="item undo-banner"><strong>${t("undoAvailable")}: ${escapeHtml(state.lastUndo.label || "")}</strong><span class="meta">${formatActivityDate(state.lastUndo.at)}</span></div>` : ""}
      <div class="grid three management-stats">
        <article class="card stat"><span>${t("active")}</span><strong>${activeUsers}</strong><span>${state.users.length} usuarios totales</span></article>
        <article class="card stat"><span>${t("linkedPlayer")}</span><strong>${linkedPlayers}</strong><span>jugadores con acceso propio</span></article>
        <article class="card stat"><span>${t("familyPlayers")}</span><strong>${state.players.filter((player) => (player.guardians || []).length).length}</strong><span>jugadores con familiar vinculado</span></article>
      </div>
      <div class="user-grid">
        ${state.users.map(renderUserCard).join("")}
      </div>
    </section>
  `;
}

function renderUserCard(user) {
  const linkedPlayer = user.playerId ? getPlayer(user.playerId)?.name : "";
  const children = (user.children || []).map((id) => getPlayer(id)?.name).filter(Boolean);
  return `
    <article class="item user-card ${user.disabled ? "disabled" : ""}">
      <div class="item-row">
        <h3>${escapeHtml(user.name)}</h3>
        <span class="status-pill ${user.disabled ? "off" : "on"}">${user.disabled ? t("inactive") : t("active")}</span>
      </div>
      <div class="meta">${escapeHtml(user.email)}</div>
      <div class="pill-line">${user.roles.map((role) => `<span class="pill">${roleLabel(role)}</span>`).join("")}</div>
      ${linkedPlayer ? `<div class="meta"><strong>${t("linkedPlayer")}:</strong> ${escapeHtml(linkedPlayer)}</div>` : ""}
      ${children.length ? `<div class="meta"><strong>${t("familyPlayers")}:</strong> ${children.map(escapeHtml).join(", ")}</div>` : ""}
      ${
        canManageUsers()
          ? `<div class="actions inline-actions">
              <button class="btn" type="button" onclick="openEditUserModal('${user.id}')">${t("edit")}</button>
              <button class="btn ${user.disabled ? "" : "danger"}" type="button" onclick="toggleUserDisabled('${user.id}')">${user.disabled ? t("activate") : t("deactivate")}</button>
            </div>`
          : ""
      }
    </article>
  `;
}

function renderDiagnostics() {
  const diagnostics = state.diagnostics;
  const backups = diagnostics?.backups || [];
  const summary = diagnostics?.summary || backupSummary(state);
  return `
    <div class="diagnostics-layout">
      <section class="panel">
        <div class="panel-header">
          <div><h2>${t("diagnostics")}</h2><p>Estado tecnico, sincronizacion, backups y herramientas de temporada.</p></div>
          <button class="btn primary" type="button" onclick="loadDiagnostics()">${diagnostics ? "Actualizar" : "Cargar"}</button>
        </div>
        <div class="grid three management-stats">
          <article class="card stat"><span>Servidor</span><strong>${diagnostics?.ok ? "OK" : "-"}</strong><span>${escapeHtml(diagnostics?.version || "Sin cargar")}</span></article>
          <article class="card stat"><span>Sesiones</span><strong>${diagnostics?.activeSessions ?? "-"}</strong><span>${diagnostics?.serverTime ? formatActivityDate(diagnostics.serverTime) : "Pendiente"}</span></article>
          <article class="card stat"><span>Estado</span><strong>${formatSize(diagnostics?.stateFile?.size || 0) || "-"}</strong><span>${diagnostics?.stateFile?.updatedAt ? formatActivityDate(diagnostics.stateFile.updatedAt) : "Sin dato"}</span></article>
        </div>
        <div class="grid three management-stats" style="margin-top:14px">
          <article class="card stat"><span>${t("players")}</span><strong>${summary.players}</strong><span>${summary.teams} equipos</span></article>
          <article class="card stat"><span>${t("calendar")}</span><strong>${summary.events}</strong><span>${summary.results} resultados</span></article>
          <article class="card stat"><span>${t("documents")}</span><strong>${summary.documents}</strong><span>${summary.audit || 0} registros</span></article>
        </div>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div><h2>${t("serverBackups")}</h2><p>Copias automaticas guardadas por el servidor antes de cada escritura.</p></div>
          ${canBackupData() ? `<button class="btn" type="button" onclick="loadDiagnostics()">${t("serverBackups")}</button>` : ""}
        </div>
        <div class="list">${backups.map(renderServerBackupItem).join("") || `<div class="empty">Pulsa Cargar para ver backups del servidor.</div>`}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h2>${t("auditFilters")}</h2><p>Registro filtrable por texto, accion y equipo.</p></div></div>
        <div class="form-grid diagnostic-filters">
          <div class="form-row"><label>${t("globalSearch")}</label><input value="${escapeHtml(state.diagnosticAuditQuery)}" oninput="setDiagnosticFilter('diagnosticAuditQuery', this.value)" placeholder="Usuario, accion, equipo..." /></div>
          <div class="form-row"><label>${t("permissionAction")}</label><select onchange="setDiagnosticFilter('diagnosticAuditAction', this.value)"><option value="">Todas</option>${auditActions().map((action) => `<option value="${escapeHtml(action)}" ${state.diagnosticAuditAction === action ? "selected" : ""}>${escapeHtml(action)}</option>`).join("")}</select></div>
          <div class="form-row"><label>${t("team")}</label><select onchange="setDiagnosticFilter('diagnosticAuditTeamId', this.value)"><option value="">Todos</option>${state.teams.map((team) => `<option value="${team.id}" ${state.diagnosticAuditTeamId === team.id ? "selected" : ""}>${escapeHtml(team.name)}</option>`).join("")}</select></div>
        </div>
        <div class="activity-list diagnostic-audit">${filteredAuditLog().map(renderDiagnosticAuditItem).join("") || `<div class="empty">Sin registros con esos filtros.</div>`}</div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h2>${t("cleanDemoData")}</h2><p>${t("cleanDemoDataText")}</p></div></div>
        <div class="actions inline-actions">
          <button class="btn danger" type="button" onclick="cleanDemoSeasonData()">${t("cleanDemoData")}</button>
          <button class="btn" type="button" onclick="downloadFullBackup()">${t("backupData")}</button>
        </div>
      </section>
    </div>
  `;
}

function renderServerBackupItem(backup) {
  return `
    <article class="item">
      <div class="item-row">
        <div><strong>${escapeHtml(backup.name)}</strong><span class="meta">${formatActivityDate(backup.createdAt)} · ${formatSize(backup.size)}</span></div>
        ${canRestoreData() ? `<button class="btn danger" type="button" onclick="restoreServerBackup('${escapeHtml(backup.id)}')">${t("restoreServerBackup")}</button>` : ""}
      </div>
    </article>
  `;
}

function auditActions() {
  return [...new Set((state.auditLog || []).map((item) => item.action).filter(Boolean))].sort();
}

function filteredAuditLog() {
  const query = normalizeSearchText(state.diagnosticAuditQuery || "");
  const action = state.diagnosticAuditAction || "";
  const team = state.diagnosticAuditTeamId || "";
  const teamName = team ? normalizeSearchText(getTeam(team)?.name || "") : "";
  return (state.auditLog || []).filter((item) => {
    const text = normalizeSearchText(`${item.action || ""} ${item.label || ""} ${item.userName || ""} ${item.target || ""} ${JSON.stringify(item.details || {})}`);
    if (query && !text.includes(query)) return false;
    if (action && item.action !== action) return false;
    if (teamName && !text.includes(teamName)) return false;
    return true;
  });
}

function renderDiagnosticAuditItem(item) {
  return `
    <button class="activity-item" type="button" onclick="${auditAction(item)}">
      <span class="activity-dot"></span>
      <span>
        <strong>${escapeHtml(item.label || item.target || "")}</strong>
        <em>${escapeHtml(item.action || "")} · ${escapeHtml(item.userName || "Sistema")} · ${formatActivityDate(item.at)}</em>
        ${item.details ? renderActivityDetails(item.details) : ""}
      </span>
    </button>
  `;
}

function renderSettings() {
  return `
    <section class="panel">
      <div class="panel-header"><div><h2>${t("settings")}</h2><p>Matriz completa por rol. Direccion queda como acceso total; las casillas marcan permisos delegables.</p></div></div>
      <div class="table-wrap permission-matrix">
        <table>
          <thead>
            <tr>
              <th>${t("permissionAction")}</th>
              ${roleKeys.map((role) => `<th>${roleLabel(role)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${permissionMatrixRows().map(renderPermissionRow).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function permissionMatrixRows() {
  return [
    { label: t("publishAnnouncements"), director: "always", coach: "coachCanAnnouncements", delegate: "delegateCanAnnouncements", parent: "no", player: "no" },
    { label: t("createEvents"), director: "always", coach: "coachCanEvents", delegate: "no", parent: "no", player: "no" },
    { label: t("manageCallups"), director: "always", coach: "coachCanCallups", delegate: "no", parent: "no", player: "no" },
    { label: t("confirmAttendanceAction"), director: "always", coach: "coachCanAttendance", delegate: "delegateCanAttendance", parent: "own", player: "own" },
    { label: t("uploadFilesAction"), director: "always", coach: "coachCanDocuments", delegate: "delegateCanDocuments", parent: "no", player: "no" },
    { label: t("viewFilesAction"), director: "always", coach: "team", delegate: "team", parent: "own", player: "own" },
    { label: t("manageResultsAction"), director: "always", coach: "coachCanResults", delegate: "no", parent: "no", player: "no" },
    { label: t("manageGalleriesAction"), director: "always", coach: "coachCanResultGallery", delegate: "delegateCanResultGallery", parent: "no", player: "no" },
    { label: t("editTeamsAction"), director: "always", coach: "coachCanTeams", delegate: "no", parent: "no", player: "no" },
    { label: t("manageUsersAction"), director: "always", coach: "no", delegate: "no", parent: "no", player: "no" },
    { label: t("importMembersAction"), director: "always", coach: "coachCanImportMembers", delegate: "delegateCanImportMembers", parent: "no", player: "no" },
    { label: t("exportDataAction"), director: "always", coach: "coachCanExportData", delegate: "delegateCanExportData", parent: "no", player: "no" },
    { label: t("backupDataAction"), director: "always", coach: "coachCanBackupData", delegate: "delegateCanBackupData", parent: "no", player: "no" },
    { label: t("restoreDataAction"), director: "always", coach: "coachCanRestoreData", delegate: "delegateCanRestoreData", parent: "no", player: "no" },
    { label: t("undoBulkAction"), director: "always", coach: "coachCanUndoBulk", delegate: "delegateCanUndoBulk", parent: "no", player: "no" },
    { label: t("messageClubAction"), director: "always", coach: "team", delegate: "team", parent: "own", player: "own" },
  ];
}

function renderPermissionRow(row) {
  return `
    <tr>
      <td><strong>${row.label}</strong></td>
      ${roleKeys.map((role) => `<td>${permissionCell(row[role])}</td>`).join("")}
    </tr>
  `;
}

function permissionCell(value) {
  if (state.permissions && Object.prototype.hasOwnProperty.call(state.permissions, value)) return permissionToggle(value);
  const labels = {
    always: t("alwaysAllowed"),
    own: t("ownOnly"),
    team: t("teamOnly"),
    no: t("notAllowed"),
  };
  return `<span class="permission-chip ${value}">${labels[value] || ""}</span>`;
}

function permissionToggle(key) {
  return `
    <label class="permission-toggle" title="${escapeHtml(t(key))}">
      <input type="checkbox" ${state.permissions[key] ? "checked" : ""} onchange="togglePermission('${key}')" />
      <span>${state.permissions[key] ? t("active") : t("inactive")}</span>
    </label>
  `;
}

function openModal(title, body) {
  document.querySelector("#modal-root").innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <div class="modal-head"><h2>${title}</h2><button class="btn icon-only" type="button" onclick="closeModal()" aria-label="${t("close")}">X</button></div>
        ${body}
      </div>
    </div>
  `;
}

function closeModal() {
  document.querySelector("#modal-root").innerHTML = "";
}

function openResultModal() {
  if (!canManageResults()) return;
  const teams = hasRole(currentUser(), "director") ? state.teams : state.teams.filter((team) => team.coachId === currentUser().id);
  const competitions = state.competitions.filter((competition) => competition.seasonId === state.activeSeasonId);
  openModal(
    t("addResult"),
    `<form class="form" onsubmit="createResult(event)">
      <div class="form-grid">
        <div class="form-row"><label>${t("team")}</label><select name="teamId" required>${teams.map((team) => `<option value="${team.id}">${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("rival")}</label><input name="opponent" required /></div>
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" required /></div>
        <div class="form-row"><label>${t("competition")}</label><select name="competitionId">${competitions.map((competition) => `<option value="${competition.id}" ${competition.id === state.activeCompetitionId ? "selected" : ""}>${escapeHtml(competition.name)}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("place")}</label><input name="place" /></div>
        <div class="form-row"><label>${t("localScore")}</label><input name="teamScore" type="number" min="0" required /></div>
        <div class="form-row"><label>${t("awayScore")}</label><input name="opponentScore" type="number" min="0" required /></div>
        <div class="form-row"><label>${t("type")}</label><select name="homeAway"><option value="home">Jugamos en casa</option><option value="away">Jugamos fuera</option></select></div>
      </div>
      <div class="form-row"><label>${t("matchReportUrl")}</label><input name="matchReportUrl" type="url" /></div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes"></textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function openEditResultModal(resultId) {
  const result = state.results.find((item) => item.id === resultId);
  if (!result || !canManageResults()) return;
  const teams = hasRole(currentUser(), "director") ? state.teams : state.teams.filter((team) => team.coachId === currentUser().id);
  const competitions = state.competitions.filter((competition) => competition.seasonId === (result.seasonId || state.activeSeasonId));
  openModal(
    t("results"),
    `<form class="form" onsubmit="updateResult(event,'${result.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("team")}</label><select name="teamId" required>${teams.map((team) => `<option value="${team.id}" ${result.teamId === team.id ? "selected" : ""}>${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("rival")}</label><input name="opponent" value="${escapeHtml(result.opponent || "")}" required /></div>
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" value="${result.date}" required /></div>
        <div class="form-row"><label>${t("competition")}</label><select name="competitionId">${competitions.map((competition) => `<option value="${competition.id}" ${result.competitionId === competition.id ? "selected" : ""}>${escapeHtml(competition.name)}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("place")}</label><input name="place" value="${escapeHtml(result.place || "")}" /></div>
        <div class="form-row"><label>${t("localScore")}</label><input name="teamScore" type="number" min="0" value="${result.teamScore}" required /></div>
        <div class="form-row"><label>${t("awayScore")}</label><input name="opponentScore" type="number" min="0" value="${result.opponentScore}" required /></div>
        <div class="form-row"><label>${t("type")}</label><select name="homeAway"><option value="home" ${result.homeAway === "home" ? "selected" : ""}>Jugamos en casa</option><option value="away" ${result.homeAway === "away" ? "selected" : ""}>Jugamos fuera</option></select></div>
      </div>
      <div class="form-row"><label>${t("matchReportUrl")}</label><input name="matchReportUrl" type="url" value="${escapeHtml(result.matchReportUrl || "")}" /></div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes">${escapeHtml(result.notes || "")}</textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function openAnnouncementModal() {
  const user = currentUser();
  const canSendAll = hasRole(user, "director");
  openModal(
    t("newAnnouncement"),
    `<form class="form" onsubmit="createAnnouncement(event)">
      <div class="form-row"><label>${t("title")}</label><input name="title" required /></div>
      <div class="form-row"><label>${t("body")}</label><textarea name="body" required></textarea></div>
      <div class="form-grid">
        <div class="form-row">
          <label>${t("target")}</label>
          <select name="targetType" onchange="renderTargetOptions(this.value)">
            ${canSendAll ? `<option value="all">${t("allClub")}</option><option value="role">${t("roles")}</option>` : ""}
            <option value="team">${t("team")}</option>
          </select>
        </div>
        <div class="form-row" id="target-options"></div>
      </div>
      <label class="check-row"><input name="important" type="checkbox" /> <span>Importante</span></label>
      <button class="btn primary" type="submit">${t("publish")}</button>
    </form>`
  );
  renderTargetOptions(canSendAll ? "all" : "team");
}

function openEditAnnouncementModal(announcementId) {
  const announcement = state.announcements.find((item) => item.id === announcementId);
  if (!announcement || !canPublishAnnouncement()) return;
  const user = currentUser();
  const canSendAll = hasRole(user, "director");
  openModal(
    t("newAnnouncement"),
    `<form class="form" onsubmit="updateAnnouncement(event,'${announcement.id}')">
      <div class="form-row"><label>${t("title")}</label><input name="title" value="${escapeHtml(announcement.title)}" required /></div>
      <div class="form-row"><label>${t("body")}</label><textarea name="body" required>${escapeHtml(announcement.body)}</textarea></div>
      <div class="form-grid">
        <div class="form-row">
          <label>${t("target")}</label>
          <select name="targetType" onchange="renderTargetOptions(this.value,'${announcement.targetIds.join(",")}')">
            ${canSendAll ? `<option value="all" ${announcement.targetType === "all" ? "selected" : ""}>${t("allClub")}</option><option value="role" ${announcement.targetType === "role" ? "selected" : ""}>${t("roles")}</option>` : ""}
            <option value="team" ${announcement.targetType === "team" ? "selected" : ""}>${t("team")}</option>
          </select>
        </div>
        <div class="form-row" id="target-options"></div>
      </div>
      <label class="check-row"><input name="important" type="checkbox" ${announcement.important ? "checked" : ""} /> <span>Importante</span></label>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
  renderTargetOptions(canSendAll ? announcement.targetType : "team", announcement.targetIds.join(","));
}

function renderTargetOptions(type, selectedCsv = "") {
  const root = document.querySelector("#target-options");
  if (!root) return;
  if (type === "all") {
    root.innerHTML = `<label>${t("target")}</label><input value="${t("allClub")}" disabled />`;
    return;
  }
  const availableTeams = hasRole(currentUser(), "director") ? state.teams : state.teams.filter((team) => staffTeamIds().includes(team.id));
  const selected = new Set(String(selectedCsv || "").split(",").filter(Boolean));
  const options =
    type === "team"
      ? availableTeams.map((team) => `<option value="${team.id}" ${selected.has(team.id) ? "selected" : ""}>${team.name}</option>`).join("")
      : roleKeys.map((role) => `<option value="${role}" ${selected.has(role) ? "selected" : ""}>${roleLabel(role)}</option>`).join("");
  root.innerHTML = `<label>${type === "team" ? t("team") : t("roles")}</label><select name="targetId" multiple size="5">${options}</select>`;
}

function openEventModal() {
  const teams = editableEventTeamIds().map(getTeam).filter(Boolean);
  const initialTeamId = teams[0]?.id || "";
  const allClubOption = hasRole(currentUser(), "director") ? `<option value="">${t("allClub")}</option>` : "";
  const competitions = state.competitions.filter((competition) => competition.seasonId === state.activeSeasonId);
  openModal(
    t("newEvent"),
    `<form class="form" onsubmit="createEvent(event)">
      <div class="form-grid">
        <div class="form-row"><label>${t("title")}</label><input name="title" placeholder="Solo necesario para partido, torneo o evento" /></div>
        <div class="form-row"><label>${t("type")}</label><select name="type"><option value="match">${t("match")}</option><option value="tournament">${t("tournament")}</option><option value="event">${t("event")}</option><option value="training">${t("training")}</option></select></div>
        <div class="form-row"><label>${t("team")}</label><select name="teamId" onchange="renderEventPlayerOptions(this.value)">${allClubOption}${teams.map((team) => `<option value="${team.id}" ${team.id === initialTeamId ? "selected" : ""}>${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("competition")}</label><select name="competitionId"><option value="">Sin competición</option>${competitions.map((competition) => `<option value="${competition.id}" ${competition.id === state.activeCompetitionId ? "selected" : ""}>${escapeHtml(competition.name)}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("place")}</label><input name="place" required /></div>
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" required /></div>
        <div class="form-row"><label>${t("time")}</label><input name="time" type="time" required /></div>
      </div>
      <div class="form-row"><label>${t("affectedPlayers")}</label><div id="event-player-options"></div></div>
      <div class="form-row recurrent-training-fields">
        <label>${t("repeatTraining")}</label>
        <div class="recurrence-box">
          <input name="weeks" type="number" min="1" max="20" value="1" />
          <span>${t("weeks")}</span>
          <div class="weekday-list">${weekdayCheckboxes([new Date().getDay() || 7])}</div>
        </div>
      </div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes"></textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
  renderEventPlayerOptions(initialTeamId);
}

function openEditEventModal(eventId) {
  const eventItem = state.events.find((item) => item.id === eventId);
  if (!eventItem || !canManageScheduleItem(eventItem)) return;
  const teams = editableEventTeamIds().map(getTeam).filter(Boolean);
  const allClubOption = hasRole(currentUser(), "director") ? `<option value="">${t("allClub")}</option>` : "";
  const competitions = state.competitions.filter((competition) => competition.seasonId === (eventItem.seasonId || state.activeSeasonId));
  openModal(
    t("editEvent"),
    `<form class="form" onsubmit="updateEvent(event,'${eventItem.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("title")}</label><input name="title" value="${escapeHtml(eventItem.title)}" required /></div>
        <div class="form-row"><label>${t("type")}</label><select name="type"><option value="match" ${eventItem.type === "match" ? "selected" : ""}>${t("match")}</option><option value="tournament" ${eventItem.type === "tournament" ? "selected" : ""}>${t("tournament")}</option><option value="event" ${eventItem.type === "event" ? "selected" : ""}>${t("event")}</option></select></div>
        <div class="form-row"><label>${t("team")}</label><select name="teamId" onchange="renderEventPlayerOptions(this.value,'${eventItem.playerIds.join(",")}')">${allClubOption}${teams.map((team) => `<option value="${team.id}" ${eventItem.teamId === team.id ? "selected" : ""}>${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("competition")}</label><select name="competitionId"><option value="">Sin competición</option>${competitions.map((competition) => `<option value="${competition.id}" ${eventItem.competitionId === competition.id ? "selected" : ""}>${escapeHtml(competition.name)}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("place")}</label><input name="place" value="${escapeHtml(eventItem.place || "")}" required /></div>
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" value="${eventItem.date}" required /></div>
        <div class="form-row"><label>${t("time")}</label><input name="time" type="time" value="${eventItem.time}" required /></div>
      </div>
      <div class="form-row"><label>${t("affectedPlayers")}</label><div id="event-player-options"></div></div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes">${escapeHtml(eventItem.notes || "")}</textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
  renderEventPlayerOptions(eventItem.teamId, eventItem.playerIds.join(","));
}

function openEditTrainingModal(trainingId) {
  const training = state.trainings.find((item) => item.id === trainingId);
  if (!training || !canManageScheduleItem(training)) return;
  const teams = editableEventTeamIds().map(getTeam).filter(Boolean);
  const allClubOption = hasRole(currentUser(), "director") ? `<option value="">${t("allClub")}</option>` : "";
  openModal(
    t("training"),
    `<form class="form" onsubmit="updateTraining(event,'${training.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("team")}</label><select name="teamId" onchange="renderEventPlayerOptions(this.value,'${(training.playerIds || []).join(",")}')">${allClubOption}${teams.map((team) => `<option value="${team.id}" ${training.teamId === team.id ? "selected" : ""}>${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("place")}</label><input name="place" value="${escapeHtml(training.place || "")}" required /></div>
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" value="${training.date}" required /></div>
        <div class="form-row"><label>${t("time")}</label><input name="time" type="time" value="${training.time}" required /></div>
      </div>
      <div class="form-row"><label>${t("affectedPlayers")}</label><div id="event-player-options"></div></div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes">${escapeHtml(training.notes || "")}</textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
  renderEventPlayerOptions(training.teamId, (training.playerIds || []).join(","));
}

function openDuplicateEventModal(eventId) {
  const eventItem = state.events.find((item) => item.id === eventId);
  if (!eventItem || !canManageScheduleItem(eventItem)) return;
  const teams = editableEventTeamIds().map(getTeam).filter(Boolean);
  const allClubOption = hasRole(currentUser(), "director") ? `<option value="">${t("allClub")}</option>` : "";
  openModal(
    t("duplicateEvent"),
    `<form class="form" onsubmit="duplicateEvent(event,'${eventItem.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("title")}</label><input name="title" value="${escapeHtml(eventItem.title)}" required /></div>
        <div class="form-row"><label>${t("type")}</label><select name="type"><option value="match" ${eventItem.type === "match" ? "selected" : ""}>${t("match")}</option><option value="tournament" ${eventItem.type === "tournament" ? "selected" : ""}>${t("tournament")}</option><option value="event" ${eventItem.type === "event" ? "selected" : ""}>${t("event")}</option></select></div>
        <div class="form-row"><label>${t("team")}</label><select name="teamId" onchange="renderEventPlayerOptions(this.value,'${(eventItem.playerIds || []).join(",")}')">${allClubOption}${teams.map((team) => `<option value="${team.id}" ${eventItem.teamId === team.id ? "selected" : ""}>${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("place")}</label><input name="place" value="${escapeHtml(eventItem.place || "")}" required /></div>
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" value="${eventItem.date}" required /></div>
        <div class="form-row"><label>${t("time")}</label><input name="time" type="time" value="${eventItem.time}" required /></div>
      </div>
      <div class="form-row"><label>${t("affectedPlayers")}</label><div id="event-player-options"></div></div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes">${escapeHtml(eventItem.notes || "")}</textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
  renderEventPlayerOptions(eventItem.teamId, (eventItem.playerIds || []).join(","));
}

function openDuplicateTrainingModal(trainingId) {
  const training = state.trainings.find((item) => item.id === trainingId);
  if (!training || !canManageScheduleItem(training)) return;
  const teams = editableEventTeamIds().map(getTeam).filter(Boolean);
  const allClubOption = hasRole(currentUser(), "director") ? `<option value="">${t("allClub")}</option>` : "";
  openModal(
    t("duplicate"),
    `<form class="form" onsubmit="duplicateTraining(event,'${training.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("team")}</label><select name="teamId" onchange="renderEventPlayerOptions(this.value,'${(training.playerIds || []).join(",")}')">${allClubOption}${teams.map((team) => `<option value="${team.id}" ${training.teamId === team.id ? "selected" : ""}>${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("place")}</label><input name="place" value="${escapeHtml(training.place || "")}" required /></div>
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" value="${training.date}" required /></div>
        <div class="form-row"><label>${t("time")}</label><input name="time" type="time" value="${training.time}" required /></div>
      </div>
      <div class="form-row"><label>${t("affectedPlayers")}</label><div id="event-player-options"></div></div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes">${escapeHtml(training.notes || "")}</textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
  renderEventPlayerOptions(training.teamId, (training.playerIds || []).join(","));
}

function openRepeatTrainingModal(trainingId) {
  const training = state.trainings.find((item) => item.id === trainingId);
  if (!training || !canManageScheduleItem(training)) return;
  const selectedDay = new Date(`${training.date}T00:00:00`).getDay() || 7;
  openModal(
    t("repeatTraining"),
    `<form class="form" onsubmit="repeatTraining(event,'${training.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" value="${training.date}" required /></div>
        <div class="form-row"><label>${t("weeks")}</label><input name="weeks" type="number" min="1" max="20" value="4" required /></div>
      </div>
      <div class="form-row"><label>${t("weekdays")}</label><div class="weekday-list">${weekdayCheckboxes([selectedDay])}</div></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function weekdayCheckboxes(selectedDays = []) {
  const days = [
    [1, "L"],
    [2, "M"],
    [3, "X"],
    [4, "J"],
    [5, "V"],
    [6, "S"],
    [7, "D"],
  ];
  return days.map(([value, label]) => `<label class="weekday-chip"><input name="weekdays" type="checkbox" value="${value}" ${selectedDays.includes(value) ? "checked" : ""} /><span>${label}</span></label>`).join("");
}

function renderEventPlayerOptions(teamId, selectedCsv = "") {
  const root = document.querySelector("#event-player-options");
  if (!root) return;
  root.innerHTML = affectedPlayerCheckboxList(teamId, selectedCsv);
}

function openCallupModal() {
  const teams = hasRole(currentUser(), "director") ? state.teams : state.teams.filter((team) => team.coachId === currentUser().id);
  const competitions = state.competitions.filter((competition) => competition.seasonId === state.activeSeasonId);
  openModal(
    t("newCallup"),
    `<form class="form" onsubmit="createCallup(event)">
      <div class="form-grid">
        <div class="form-row"><label>${t("team")}</label><select name="teamId" onchange="renderPlayerOptions(this.value)" required>${teams.map((team) => `<option value="${team.id}">${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("rival")}</label><input name="rival" required /></div>
        <div class="form-row"><label>${t("competition")}</label><select name="competitionId">${competitions.map((competition) => `<option value="${competition.id}" ${competition.id === state.activeCompetitionId ? "selected" : ""}>${escapeHtml(competition.name)}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" required /></div>
        <div class="form-row"><label>${t("time")}</label><input name="time" type="time" required /></div>
        <div class="form-row"><label>${t("place")}</label><input name="place" required /></div>
        <div class="form-row"><label>${t("arrival")}</label><input name="arrival" type="time" required /></div>
        <div class="form-row"><label>${t("kit")}</label><input name="kit" required /></div>
      </div>
      <div class="form-row"><label>${t("affectedPlayers")}</label><div id="player-options"></div></div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes"></textarea></div>
      <button class="btn primary" type="submit">${t("publish")}</button>
    </form>`
  );
  renderPlayerOptions(teams[0]?.id);
}

function openEditCallupModal(callupId) {
  const callup = state.callups.find((item) => item.id === callupId);
  if (!canManageCallup(callup)) return;
  const teams = hasRole(currentUser(), "director") ? state.teams : state.teams.filter((team) => team.coachId === currentUser().id);
  openModal(
    t("newCallup"),
    `<form class="form" onsubmit="updateCallup(event,'${callup.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("team")}</label><select name="teamId" onchange="renderPlayerOptions(this.value,'${callup.playerIds.join(",")}')" required>${teams.map((team) => `<option value="${team.id}" ${callup.teamId === team.id ? "selected" : ""}>${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("rival")}</label><input name="rival" value="${escapeHtml(callup.rival)}" required /></div>
        <div class="form-row"><label>${t("date")}</label><input name="date" type="date" value="${callup.date}" required /></div>
        <div class="form-row"><label>${t("time")}</label><input name="time" type="time" value="${callup.time}" required /></div>
        <div class="form-row"><label>${t("place")}</label><input name="place" value="${escapeHtml(callup.place)}" required /></div>
        <div class="form-row"><label>${t("arrival")}</label><input name="arrival" type="time" value="${callup.arrival}" required /></div>
        <div class="form-row"><label>${t("kit")}</label><input name="kit" value="${escapeHtml(callup.kit)}" required /></div>
      </div>
      <div class="form-row"><label>${t("affectedPlayers")}</label><div id="player-options"></div></div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes">${escapeHtml(callup.notes || "")}</textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
  renderPlayerOptions(callup.teamId, callup.playerIds.join(","));
}

function renderPlayerOptions(teamId, selectedCsv = "") {
  const root = document.querySelector("#player-options");
  if (!root) return;
  root.innerHTML = affectedPlayerCheckboxList(teamId, selectedCsv);
}

function affectedPlayerCheckboxList(teamId, selectedCsv = "") {
  const selected = new Set(String(selectedCsv || "").split(",").filter(Boolean));
  const players = teamId ? state.players.filter((player) => player.teams.includes(teamId)) : [];
  if (!players.length) return `<div class="empty">Selecciona un equipo para cargar jugadores.</div>`;
  const shouldSelectAll = selected.size === 0;
  return `
    <div class="checkbox-list">
      <label class="check-row player-check select-all-row">
        <input type="checkbox" onchange="toggleAffectedPlayers(this)" ${shouldSelectAll ? "checked" : ""} />
        <span><strong>Seleccionar todos</strong><em>${players.length} jugadores del equipo</em></span>
      </label>
      ${players
        .map(
          (player) => `
          <label class="check-row player-check">
            <input class="affected-player-check" name="playerIds" type="checkbox" value="${player.id}" ${shouldSelectAll || selected.has(player.id) ? "checked" : ""} />
            <span><strong>${escapeHtml(player.name)}</strong><em>${player.teams.map((id) => getTeam(id)?.name).filter(Boolean).join(", ")}</em></span>
          </label>
        `
        )
        .join("")}
    </div>
  `;
}

function toggleAffectedPlayers(source) {
  const root = source.closest(".checkbox-list");
  root?.querySelectorAll(".affected-player-check").forEach((input) => {
    input.checked = source.checked;
  });
}

function openAbsenceModal(trainingId, playerId) {
  openModal(
    t("markAbsence"),
    `<form class="form" onsubmit="markAbsence(event,'${trainingId}','${playerId}')">
      <p class="muted">${getPlayer(playerId)?.name}</p>
      <div class="form-row"><label>${t("notes")}</label><textarea name="reason" required></textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function openThreadModal() {
  const userPlayers = visiblePlayerIds(currentUser());
  openModal(
    t("newThread"),
    `<form class="form" onsubmit="createThread(event)">
      <div class="form-row">
        <label>${t("employee")}</label>
        <input type="search" placeholder="Buscar empleado..." oninput="filterRecipients(this.value)" />
        <div id="recipient-list" class="recipient-list">
          ${employees().map((user, index) => `
            <label class="recipient-option" data-search="${escapeHtml(`${user.name} ${user.roles.map(roleLabel).join(" ")}`.toLowerCase())}">
              <input type="radio" name="assignedToId" value="${user.id}" ${index === 0 ? "checked" : ""} required />
              <span><strong>${user.name}</strong><em>${user.roles.map(roleLabel).join(" + ")}</em></span>
            </label>
          `).join("")}
        </div>
      </div>
      <div class="form-row">
        <label>${t("selectedPlayers")}</label>
        <select name="playerId">${userPlayers.map((id) => `<option value="${id}">${getPlayer(id)?.name}</option>`).join("")}</select>
      </div>
      <div class="form-row"><label>${t("title")}</label><input name="subject" required /></div>
      <div class="form-row"><label>${t("body")}</label><textarea name="message" required></textarea></div>
      <button class="btn primary" type="submit">${t("send")}</button>
    </form>`
  );
}

function openPlayerMessageModal(playerId) {
  const player = getPlayer(playerId);
  if (!player) return;
  const team = (player.teams || []).map(getTeam).find(Boolean);
  const assignedId = team?.coachId || team?.delegateId || state.users.find((user) => hasRole(user, "director"))?.id || "";
  openModal(
    t("newThread"),
    `<form class="form" onsubmit="createThread(event)">
      <div class="form-row"><label>${t("employee")}</label><select name="assignedToId">${employees().map((user) => `<option value="${user.id}" ${assignedId === user.id ? "selected" : ""}>${user.name}</option>`).join("")}</select></div>
      <div class="form-row"><label>${t("linkedPlayer")}</label><input value="${escapeHtml(player.name)}" disabled /><input name="playerId" type="hidden" value="${player.id}" /></div>
      <div class="form-row"><label>${t("title")}</label><input name="subject" value="${escapeHtml(player.name)}" required /></div>
      <div class="form-row"><label>${t("body")}</label><textarea name="message" required></textarea></div>
      <button class="btn primary" type="submit">${t("send")}</button>
    </form>`
  );
}

function openEditPlayerProfileModal(playerId) {
  const player = getPlayer(playerId);
  if (!canEditPlayerProfile(player)) return;
  const user = currentUser();
  const manageableTeams = hasRole(user, "director") ? state.teams : state.teams.filter((team) => staffTeamIds(user).includes(team.id));
  const playerUsers = state.users.filter((item) => !item.disabled && item.roles.includes("player"));
  const familyUsers = state.users.filter((item) => !item.disabled && item.roles.includes("parent"));
  openModal(
    t("editProfile"),
    `<form class="form" onsubmit="updatePlayerProfile(event,'${player.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("title")}</label><input name="name" value="${escapeHtml(player.name)}" required /></div>
        <div class="form-row"><label>Edad</label><input name="age" type="number" min="1" max="99" value="${player.age || ""}" required /></div>
        <div class="form-row"><label>${t("playerUser")}</label><select name="userId"><option value="">Sin usuario</option>${playerUsers.map((item) => `<option value="${item.id}" ${player.userId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select></div>
        <label class="check-row"><input name="active" type="checkbox" ${player.active !== false ? "checked" : ""} /> <span>${t("activePlayer")}</span></label>
      </div>
      <div class="form-row"><label>${t("teams")}</label>${playerTeamCheckboxList(player, manageableTeams)}</div>
      <div class="form-row"><label>${t("family")}</label>${guardianCheckboxList(player, familyUsers)}</div>
      <div class="form-row"><label>${t("internalNotes")}</label><textarea name="notes">${escapeHtml(player.notes || "")}</textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function playerTeamCheckboxList(player, teams) {
  return `
    <div class="checkbox-list compact-checks">
      ${teams
        .map(
          (team) => `
          <label class="check-row player-check">
            <input name="teamIds" type="checkbox" value="${team.id}" ${(player.teams || []).includes(team.id) ? "checked" : ""} />
            <span><strong>${escapeHtml(team.name)}</strong><em>${escapeHtml(team.category || "")}</em></span>
          </label>
        `
        )
        .join("")}
    </div>
  `;
}

function guardianCheckboxList(player, familyUsers) {
  return `
    <div class="checkbox-list compact-checks">
      ${familyUsers
        .map(
          (user) => `
          <label class="check-row player-check">
            <input name="guardianIds" type="checkbox" value="${user.id}" ${(player.guardians || []).includes(user.id) ? "checked" : ""} />
            <span><strong>${escapeHtml(user.name)}</strong><em>${escapeHtml(user.email)}</em></span>
          </label>
        `
        )
        .join("")}
    </div>
  `;
}

function filterRecipients(query) {
  const value = String(query || "").trim().toLowerCase();
  document.querySelectorAll(".recipient-option").forEach((option) => {
    option.classList.toggle("hidden", value && !option.dataset.search.includes(value));
  });
}

function openDocumentModal() {
  const teams = hasRole(currentUser(), "director") ? state.teams : state.teams.filter((team) => staffTeamIds().includes(team.id));
  const initialTeamId = state.activeDocumentTeamId || teams[0]?.id || "";
  openModal(
    t("newDocument"),
    `<form class="form" onsubmit="createDocument(event)">
      <div class="form-grid">
        <div class="form-row"><label>${t("team")}</label><select name="teamId" onchange="renderDocumentFolderOptions(this.value)" required>${teams.map((team) => `<option value="${team.id}" ${team.id === initialTeamId ? "selected" : ""}>${team.name}</option>`).join("")}</select></div>
        <div class="form-row" id="document-folder-options"></div>
        <div class="form-row"><label>${t("file")}</label><input name="file" type="file" multiple required /></div>
      </div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes"></textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
  renderDocumentFolderOptions(initialTeamId, state.activeDocumentFolderId);
}

function renderDocumentFolderOptions(teamId, selectedFolderId = "") {
  const root = document.querySelector("#document-folder-options");
  if (!root) return;
  const folders = state.documentFolders.filter((folder) => folder.teamId === teamId);
  root.innerHTML = `<label>${t("folder")}</label><select name="folderId"><option value="">${t("allFiles")}</option>${folders.map((folder) => `<option value="${folder.id}" ${selectedFolderId === folder.id ? "selected" : ""}>${escapeHtml(folder.name)}</option>`).join("")}</select>`;
}

function openFolderModal() {
  const teams = hasRole(currentUser(), "director") ? state.teams : state.teams.filter((team) => staffTeamIds().includes(team.id));
  const initialTeamId = state.activeDocumentTeamId || teams[0]?.id || "";
  openModal(
    t("newFolder"),
    `<form class="form" onsubmit="createFolder(event)">
      <div class="form-grid">
        <div class="form-row"><label>${t("team")}</label><select name="teamId" required>${teams.map((team) => `<option value="${team.id}" ${team.id === initialTeamId ? "selected" : ""}>${team.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("folder")}</label><input name="name" required /></div>
      </div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function openEditFolderModal(folderId) {
  const folder = state.documentFolders.find((item) => item.id === folderId);
  if (!folder || !canUploadDocument()) return;
  openModal(
    t("rename"),
    `<form class="form" onsubmit="updateFolder(event,'${folder.id}')">
      <div class="form-row"><label>${t("folder")}</label><input name="name" value="${escapeHtml(folder.name)}" required /></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function openEditDocumentModal(docId) {
  const doc = state.documents.find((item) => item.id === docId);
  if (!doc || !canUploadDocument()) return;
  openModal(
    t("edit"),
    `<form class="form" onsubmit="updateDocument(event,'${doc.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("title")}</label><input name="name" value="${escapeHtml(doc.name)}" required /></div>
        <div class="form-row" id="document-folder-options"></div>
      </div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes">${escapeHtml(doc.notes || "")}</textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
  renderDocumentFolderOptions(doc.teamId, doc.folderId || "");
}

function openUserModal() {
  if (!canManageUsers()) return;
  openModal(
    t("newUser"),
    `<form class="form" onsubmit="createUser(event)">
      ${userFormFields()}
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function openQuickPlayerModal() {
  if (!canImportMembers()) return;
  openModal(
    t("quickPlayerSignup"),
    `<form class="form" onsubmit="createQuickPlayer(event)">
      <div class="form-grid">
        <div class="form-row"><label>${t("player")}</label><input name="playerName" required /></div>
        <div class="form-row"><label>Edad</label><input name="age" type="number" min="1" max="99" /></div>
        <div class="form-row"><label>${t("team")}</label><select name="teamIds" multiple size="5">${state.teams.map((team) => `<option value="${team.id}">${escapeHtml(team.name)}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("email")} jugador</label><input name="playerEmail" type="email" /></div>
        <div class="form-row"><label>${t("family")}</label><input name="guardianName" /></div>
        <div class="form-row"><label>${t("email")} familiar</label><input name="guardianEmail" type="email" /></div>
        <div class="form-row"><label>Teléfono</label><input name="phone" /></div>
      </div>
      <div class="form-row"><label>${t("notes")}</label><textarea name="notes"></textarea></div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function openImportPlayersModal() {
  if (!canImportMembers()) return;
  pendingPlayerImportRows = [];
  openModal(
    t("importPlayers"),
    `<section class="form import-tool">
      <p class="meta">${t("importHelp")}</p>
      <div class="form-row">
        <label>${t("file")}</label>
        <input type="file" accept=".csv,text/csv,text/plain" onchange="loadPlayerImportFile(this)" />
      </div>
      <div class="form-row">
        <label>CSV</label>
        <textarea id="player-import-csv" rows="8" placeholder="jugador,edad,equipos,email_jugador,familiar,email_familiar,telefono,notas"></textarea>
      </div>
      <div class="actions inline-actions">
        <button class="btn" type="button" onclick="insertPlayerImportSample()">${t("importSample")}</button>
        <button class="btn" type="button" onclick="downloadPlayerImportTemplate()">${t("downloadTemplate")}</button>
        <button class="btn primary" type="button" onclick="previewPlayerImport()">${t("previewImport")}</button>
      </div>
      <div id="player-import-preview"></div>
    </section>`
  );
}

function openEditUserModal(userId) {
  const user = state.users.find((item) => item.id === userId);
  if (!user || !canManageUsers()) return;
  openModal(
    t("editUser"),
    `<form class="form" onsubmit="updateUser(event,'${user.id}')">
      ${userFormFields(user)}
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function userFormFields(user = {}) {
  return `
    <div class="form-grid">
      <div class="form-row"><label>${t("title")}</label><input name="name" value="${escapeHtml(user.name || "")}" required /></div>
      <div class="form-row"><label>${t("email")}</label><input name="email" type="email" value="${escapeHtml(user.email || "")}" required /></div>
      <div class="form-row"><label>${t("password")}</label><input name="password" type="text" value="${user.id ? "" : "demo1234"}" ${user.id ? `placeholder="Dejar en blanco para mantener"` : "required"} /></div>
      <div class="form-row"><label>${t("linkedPlayer")}</label><select name="playerId"><option value="">Sin jugador</option>${state.players.map((player) => `<option value="${player.id}" ${user.playerId === player.id ? "selected" : ""}>${escapeHtml(player.name)}</option>`).join("")}</select></div>
    </div>
    <div class="form-row"><label>${t("roles")}</label>${roleCheckboxList(user.roles || ["player"])}</div>
    <div class="form-row"><label>${t("familyPlayers")}</label>${familyPlayerCheckboxList(user.children || [])}</div>
  `;
}

function roleCheckboxList(selectedRoles = []) {
  return `
    <div class="checkbox-list compact-checks">
      ${roleKeys
        .map(
          (role) => `
          <label class="check-row player-check">
            <input name="roles" type="checkbox" value="${role}" ${selectedRoles.includes(role) ? "checked" : ""} />
            <span><strong>${roleLabel(role)}</strong></span>
          </label>
        `
        )
        .join("")}
    </div>
  `;
}

function familyPlayerCheckboxList(selectedPlayerIds = []) {
  return `
    <div class="checkbox-list">
      ${state.players
        .map(
          (player) => `
          <label class="check-row player-check">
            <input name="children" type="checkbox" value="${player.id}" ${selectedPlayerIds.includes(player.id) ? "checked" : ""} />
            <span><strong>${escapeHtml(player.name)}</strong><em>${player.teams.map((id) => getTeam(id)?.name).filter(Boolean).join(", ") || "Sin equipo"}</em></span>
          </label>
        `
        )
        .join("")}
    </div>
  `;
}

function openTeamModal() {
  openModal(
    t("addTeam"),
    `<form class="form" onsubmit="createTeam(event)">
      <div class="form-grid">
        <div class="form-row"><label>${t("categories")}</label><select name="category">${state.categories.map((cat) => `<option value="${cat}">${cat}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("title")}</label><input name="name" placeholder="Infantil B" required /></div>
        <div class="form-row"><label>${t("coach")}</label><select name="coachId"><option value="">Sin asignar</option>${employees().filter((user) => hasRole(user, "coach")).map((user) => `<option value="${user.id}">${user.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("delegate")}</label><select name="delegateId"><option value="">Sin asignar</option>${employees().filter((user) => hasRole(user, "delegate")).map((user) => `<option value="${user.id}">${user.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("federationTeamName")}</label><input name="federationTeamName" placeholder="Nombre exacto en la federación" /></div>
        <div class="form-row"><label>${t("teamFederationUrl")}</label><input name="federationUrl" type="url" /></div>
        <div class="form-row"><label>${t("standingsUrl")}</label><input name="standingsUrl" type="url" /></div>
      </div>
      <div class="form-row"><label>${t("selectedPlayers")}</label>${playerCheckboxList()}</div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function openEditTeamModal(teamId) {
  const team = getTeam(teamId);
  if (!canEditTeam(team)) return;
  openModal(
    "Editar equipo",
    `<form class="form" onsubmit="updateTeam(event,'${team.id}')">
      <div class="form-grid">
        <div class="form-row"><label>${t("categories")}</label><select name="category">${state.categories.map((cat) => `<option value="${cat}" ${team.category === cat ? "selected" : ""}>${cat}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("title")}</label><input name="name" value="${escapeHtml(team.name)}" required /></div>
        <div class="form-row"><label>${t("coach")}</label><select name="coachId"><option value="">Sin asignar</option>${employees().filter((user) => hasRole(user, "coach")).map((user) => `<option value="${user.id}" ${team.coachId === user.id ? "selected" : ""}>${user.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("delegate")}</label><select name="delegateId"><option value="">Sin asignar</option>${employees().filter((user) => hasRole(user, "delegate")).map((user) => `<option value="${user.id}" ${team.delegateId === user.id ? "selected" : ""}>${user.name}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("federationTeamName")}</label><input name="federationTeamName" value="${escapeHtml(team.federationTeamName || "")}" placeholder="Nombre exacto en la federación" /></div>
        <div class="form-row"><label>${t("teamFederationUrl")}</label><input name="federationUrl" type="url" value="${escapeHtml(team.federationUrl || "")}" /></div>
        <div class="form-row"><label>${t("standingsUrl")}</label><input name="standingsUrl" type="url" value="${escapeHtml(team.standingsUrl || "")}" /></div>
      </div>
      <div class="form-row"><label>${t("selectedPlayers")}</label>${playerCheckboxList(team.id)}</div>
      <button class="btn primary" type="submit">${t("save")}</button>
    </form>`
  );
}

function playerCheckboxList(teamId = "") {
  return `
    <div class="checkbox-list">
      ${state.players
        .map(
          (player) => `
          <label class="check-row player-check">
            <input name="playerIds" type="checkbox" value="${player.id}" ${teamId && player.teams.includes(teamId) ? "checked" : ""} />
            <span><strong>${escapeHtml(player.name)}</strong><em>${player.teams.map((id) => getTeam(id)?.name).filter(Boolean).join(", ") || "Sin equipo"}</em></span>
          </label>
        `
        )
        .join("")}
    </div>
  `;
}

function userFromForm(form, id = uid("user"), existing = {}) {
  const roles = form.getAll("roles");
  return {
    ...existing,
    id,
    name: String(form.get("name") || "").trim(),
    email: String(form.get("email") || "").trim(),
    password: String(form.get("password") || existing.password || ""),
    roles,
    playerId: roles.includes("player") ? String(form.get("playerId") || "") : "",
    children: roles.includes("parent") ? form.getAll("children") : [],
    disabled: Boolean(existing.disabled),
  };
}

function validateUserForm(user, existingId = "") {
  if (!canManageUsers()) return false;
  if (!user.roles.length) {
    state.toast = "Selecciona al menos un rol";
    closeModal();
    render();
    return false;
  }
  const duplicate = state.users.some((item) => item.id !== existingId && item.email.toLowerCase() === user.email.toLowerCase());
  if (duplicate) {
    state.toast = "Ese email ya esta en uso";
    closeModal();
    render();
    return false;
  }
  return true;
}

function createQuickPlayer(event) {
  event.preventDefault();
  if (!canImportMembers()) return;
  const form = new FormData(event.currentTarget);
  const row = {
    jugador: form.get("playerName"),
    edad: form.get("age"),
    equipos: form.getAll("teamIds").map((id) => getTeam(id)?.name).filter(Boolean).join("|"),
    email_jugador: form.get("playerEmail"),
    familiar: form.get("guardianName"),
    email_familiar: form.get("guardianEmail"),
    telefono: form.get("phone"),
    notas: form.get("notes"),
  };
  const plan = buildPlayerImportPlan([row])[0];
  if (plan.errors.length) {
    state.toast = plan.errors[0];
    closeModal();
    render();
    return;
  }
  applyPlayerImportPlans([plan]);
  state.toast = "Alta creada";
  appendAudit("alta rápida", "player", plan.name);
  saveAndClose("importMembers");
}

function loadPlayerImportFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const textarea = document.querySelector("#player-import-csv");
    if (textarea) textarea.value = String(reader.result || "");
    previewPlayerImport();
  };
  reader.readAsText(file);
}

function insertPlayerImportSample() {
  const textarea = document.querySelector("#player-import-csv");
  if (!textarea) return;
  textarea.value = [
    "jugador,edad,equipos,email_jugador,familiar,email_familiar,telefono,notas",
    "Vega Muñoz,13,Senior Oro|Infantil A,vega@demo.test,Familia Muñoz,familia.munoz@demo.test,600111222,Alta de ejemplo",
    "Leo Martin,14,Senior Oro,leo.martin@demo.test,Familia Martin,familia.martin@demo.test,600333444,Actualiza equipos si ya existe",
  ].join("\n");
}

function playerImportHeader() {
  return ["jugador", "edad", "equipos", "email_jugador", "familiar", "email_familiar", "telefono", "notas"];
}

function downloadPlayerImportTemplate() {
  if (!canImportMembers()) return;
  const lines = [
    playerImportHeader(),
    ["Nombre Apellido", "12", "Equipo A|Equipo B", "jugador@club.test", "Nombre Familiar", "familia@club.test", "600000000", "Notas internas"],
  ];
  downloadCsv("plantilla-socios-kamikapp.csv", lines);
}

function exportMembersCsv() {
  if (!canExportData()) return;
  const lines = [
    playerImportHeader(),
    ...state.players.map((player) => {
      const playerUser = player.userId ? state.users.find((user) => user.id === player.userId) : null;
      const guardians = (player.guardians || []).map((id) => state.users.find((user) => user.id === id)).filter(Boolean);
      return [
        player.name,
        player.age || "",
        (player.teams || []).map((id) => getTeam(id)?.name).filter(Boolean).join("|"),
        playerUser?.email || "",
        guardians.map((user) => user.name).join("|"),
        guardians.map((user) => user.email).join("|"),
        player.phone || guardians.map((user) => user.phone).filter(Boolean).join("|"),
        player.notes || "",
      ];
    }),
  ];
  downloadCsv("socios-kamikapp.csv", lines);
}

function exportTeamsCsv() {
  if (!canExportData()) return;
  const lines = [
    ["equipo", "categoria", "entrenador", "email_entrenador", "delegado", "email_delegado", "jugadores"],
    ...state.teams.map((team) => {
      const coach = state.users.find((user) => user.id === team.coachId);
      const delegate = state.users.find((user) => user.id === team.delegateId);
      const players = state.players.filter((player) => (player.teams || []).includes(team.id)).map((player) => player.name);
      return [team.name, team.category || "", coach?.name || "", coach?.email || "", delegate?.name || "", delegate?.email || "", players.join("|")];
    }),
  ];
  downloadCsv("equipos-kamikapp.csv", lines);
}

function exportUsersCsv() {
  if (!canExportData()) return;
  const lines = [
    ["nombre", "email", "roles", "jugador_vinculado", "jugadores_familia", "activo"],
    ...state.users.map((user) => [
      user.name,
      user.email,
      (user.roles || []).join("|"),
      user.playerId ? getPlayer(user.playerId)?.name || "" : "",
      (user.children || []).map((id) => getPlayer(id)?.name).filter(Boolean).join("|"),
      user.disabled ? "no" : "si",
    ]),
  ];
  downloadCsv("usuarios-kamikapp.csv", lines);
}

function downloadFullBackup() {
  if (!canBackupData()) return;
  const payload = {
    app: "KamikApp",
    version: "backup-v1",
    exportedAt: new Date().toISOString(),
    state: persistentState(),
  };
  downloadText(`backup-kamikapp-${toLocalDateKey(new Date())}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
}

function openRestoreBackupModal() {
  if (!canRestoreData()) return;
  openModal(
    t("restoreData"),
    `<section class="form restore-tool">
      <p class="meta">${t("restoreWarning")}</p>
      <div class="form-row">
        <label>${t("file")}</label>
        <input type="file" accept=".json,application/json" onchange="previewBackupFile(this)" />
      </div>
      <div id="backup-restore-preview"></div>
    </section>`
  );
}

function previewBackupFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => previewBackupJson(String(reader.result || ""));
  reader.readAsText(file);
}

function previewBackupJson(raw) {
  const root = document.querySelector("#backup-restore-preview");
  if (!root) return;
  try {
    const parsed = JSON.parse(raw);
    const backupState = normalize(parsed.state || parsed);
    const summary = backupSummary(backupState);
    root.innerHTML = `
      <section class="restore-preview">
        <div class="grid three import-summary">
          <article class="card stat"><span>${t("players")}</span><strong>${summary.players}</strong><span>jugadores</span></article>
          <article class="card stat"><span>${t("teams")}</span><strong>${summary.teams}</strong><span>equipos</span></article>
          <article class="card stat"><span>${t("users")}</span><strong>${summary.users}</strong><span>usuarios</span></article>
        </div>
        <div class="list compact">
          <article class="item"><strong>${escapeHtml(parsed.app || "KamikApp")}</strong><span class="meta">${escapeHtml(parsed.exportedAt || "Backup sin fecha")} · ${summary.events} eventos · ${summary.documents} archivos</span></article>
        </div>
        <button class="btn danger" type="button" onclick="restoreBackupFromPreview()">${t("restoreData")}</button>
      </section>`;
    window.__pendingKamikBackup = backupState;
  } catch (error) {
    root.innerHTML = `<div class="empty">Backup no válido: ${escapeHtml(error.message)}</div>`;
    window.__pendingKamikBackup = null;
  }
}

function backupSummary(backupState) {
  return {
    players: backupState.players?.length || 0,
    teams: backupState.teams?.length || 0,
    users: backupState.users?.length || 0,
    events: (backupState.events?.length || 0) + (backupState.trainings?.length || 0) + (backupState.callups?.length || 0),
    documents: backupState.documents?.length || 0,
    results: backupState.results?.length || 0,
    audit: backupState.auditLog?.length || 0,
  };
}

async function loadDiagnostics() {
  if (!canBackupData() && !canManageUsers()) return;
  if (typeof fetch === "undefined" || location.protocol === "file:") {
    state.diagnostics = {
      ok: true,
      version: "local",
      activeSessions: 1,
      serverTime: new Date().toISOString(),
      stateFile: { size: JSON.stringify(persistentState()).length, updatedAt: new Date().toISOString() },
      backups: [],
      summary: backupSummary(state),
    };
    state.toast = "Diagnostico local cargado";
    save();
    render();
    return;
  }
  try {
    const response = await fetch(API_DIAGNOSTICS_URL, { cache: "no-store", headers: requestHeaders("backupData") });
    if (!response.ok) throw new Error("No se pudo cargar diagnostico");
    state.diagnostics = await response.json();
    state.toast = "Diagnostico actualizado";
    save();
    render();
  } catch (error) {
    state.toast = error.message || "No se pudo cargar diagnostico";
    save();
    render();
  }
}

function setDiagnosticFilter(key, value) {
  state[key] = value;
  save();
  render();
}

async function restoreServerBackup(backupId) {
  if (!canRestoreData() || !confirm("Restaurar esta copia del servidor?")) return;
  try {
    const response = await fetch(API_RESTORE_SERVER_BACKUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...requestHeaders("restoreData") },
      body: JSON.stringify({ id: backupId }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || "No se pudo restaurar el backup");
    }
    state.toast = "Backup del servidor restaurado";
    await refreshRemoteState({ keepToast: true });
    await loadDiagnostics();
  } catch (error) {
    state.toast = error.message || "No se pudo restaurar el backup";
    save();
    render();
  }
}

function cleanDemoSeasonData() {
  if (!canManageUsers() || !confirm("Preparar temporada real y borrar datos demo de eventos, resultados, anuncios y archivos?")) return;
  createUndoSnapshot("clean-demo", t("cleanDemoData"));
  state.events = [];
  state.trainings = [];
  state.callups = [];
  state.results = [];
  state.announcements = [];
  state.documents = [];
  state.documentFolders = [];
  state.notifications = [];
  state.readAnnouncementIds = [];
  state.activeDocumentTeamId = "";
  state.activeDocumentFolderId = "";
  state.resultsCursor = toLocalDateKey(mondayOf(new Date()));
  state.calendarCursor = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  state.toast = "Temporada real preparada";
  appendAudit("limpiar demo", "backup", "Preparar temporada real", { events: 1, documents: 1, players: state.players.length, teams: state.teams.length });
  save("cleanDemo");
  render();
}

function stateDiffSummary(beforeState, afterState) {
  return {
    players: Math.max(0, (afterState.players?.length || 0) - (beforeState.players?.length || 0)),
    teams: Math.max(0, (afterState.teams?.length || 0) - (beforeState.teams?.length || 0)),
    users: Math.max(0, (afterState.users?.length || 0) - (beforeState.users?.length || 0)),
    documents: Math.max(0, (afterState.documents?.length || 0) - (beforeState.documents?.length || 0)),
    events: Math.max(
      0,
      (afterState.events?.length || 0) +
        (afterState.trainings?.length || 0) +
        (afterState.callups?.length || 0) -
        ((beforeState.events?.length || 0) + (beforeState.trainings?.length || 0) + (beforeState.callups?.length || 0))
    ),
  };
}

function restoreBackupFromPreview() {
  if (!canRestoreData() || !window.__pendingKamikBackup) return;
  if (!confirm("Restaurar este backup y reemplazar los datos actuales?")) return;
  createUndoSnapshot("restore", t("restoreData"));
  const undo = state.lastUndo;
  const session = state.session;
  const before = persistentState();
  state = normalize({ ...structuredCloneSafe(window.__pendingKamikBackup), session, lastUndo: undo });
  const restoredSummary = backupSummary(state);
  const diff = stateDiffSummary(before, state);
  window.__pendingKamikBackup = null;
  state.toast = "Backup restaurado";
  appendAudit("restaurar backup", "backup", "Estado completo", { players: restoredSummary.players, teams: restoredSummary.teams, users: restoredSummary.users, events: restoredSummary.events, documents: restoredSummary.documents, operation: `+${diff.players}/${diff.teams}/${diff.users}` });
  saveAndClose("restoreData");
}

function previewPlayerImport() {
  const root = document.querySelector("#player-import-preview");
  const textarea = document.querySelector("#player-import-csv");
  if (!root || !textarea) return;
  const rows = parseCsv(textarea.value);
  pendingPlayerImportRows = buildPlayerImportPlan(rows);
  root.innerHTML = renderPlayerImportPreview(pendingPlayerImportRows);
}

function renderPlayerImportPreview(plans) {
  if (!plans.length) return `<div class="empty">Sin filas para importar.</div>`;
  const errors = plans.reduce((total, plan) => total + plan.errors.length, 0);
  const creates = plans.filter((plan) => plan.action === "create").length;
  const updates = plans.filter((plan) => plan.action === "update").length;
  return `
    <section class="import-preview">
      <div class="grid three import-summary">
        <article class="card stat"><span>${t("importSummary")}</span><strong>${plans.length}</strong><span>filas leídas</span></article>
        <article class="card stat"><span>Nuevos</span><strong>${creates}</strong><span>jugadores a crear</span></article>
        <article class="card stat"><span>Actualizan</span><strong>${updates}</strong><span>${errors} errores</span></article>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Estado</th><th>Jugador</th><th>Equipos</th><th>Accesos</th><th>Validación</th></tr></thead>
          <tbody>
            ${plans
              .map(
                (plan) => `
                <tr>
                  <td><span class="pill ${plan.errors.length ? "red" : plan.action === "create" ? "green" : "gold"}">${plan.errors.length ? "Error" : plan.action === "create" ? "Crear" : "Actualizar"}</span></td>
                  <td>${escapeHtml(plan.name)}</td>
                  <td>${plan.teamNames.map(escapeHtml).join(", ") || "Sin equipo"}</td>
                  <td>${[plan.playerEmail ? "Jugador" : "", plan.guardianEmail ? "Familia" : ""].filter(Boolean).join(" + ") || "Sin usuario"}</td>
                  <td>${[...plan.errors, ...plan.warnings].map((item) => `<span class="meta">${escapeHtml(item)}</span>`).join("<br>") || `<span class="meta">OK</span>`}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <button class="btn primary" type="button" onclick="applyPlayerImport()" ${errors ? "disabled" : ""}>${t("applyImport")}</button>
    </section>
  `;
}

function applyPlayerImport() {
  const plans = pendingPlayerImportRows || [];
  if (!canImportMembers()) return;
  if (!plans.length || plans.some((plan) => plan.errors.length)) return;
  createUndoSnapshot("import", `${t("importPlayers")} · ${plans.length} filas`);
  const result = applyPlayerImportPlans(plans);
  state.toast = `${result.created} jugadores creados · ${result.updated} actualizados · ${result.users} usuarios vinculados`;
  appendAudit("importar socios", "player", `${plans.length} filas`, { rows: plans.length, created: result.created, updated: result.updated, users: `${result.userCreated} nuevos / ${result.userUpdated} actualizados`, teams: result.teamsCreated });
  pendingPlayerImportRows = [];
  saveAndClose("importMembers");
}

function createUndoSnapshot(type, label) {
  state.lastUndo = {
    id: uid("undo"),
    type,
    label,
    at: new Date().toISOString(),
    snapshot: persistentState(),
  };
}

function undoLastBulkOperation() {
  if (!canUndoBulkOperation() || !state.lastUndo?.snapshot) return;
  if (!confirm(`Deshacer "${state.lastUndo.label}" y volver al estado anterior?`)) return;
  const undoLabel = state.lastUndo.label;
  const session = state.session;
  const before = persistentState();
  const snapshot = structuredCloneSafe(state.lastUndo.snapshot);
  state = normalize({ ...snapshot, session });
  const after = persistentState();
  state.lastUndo = null;
  state.toast = "Operación deshecha";
  appendAudit("deshacer operación", "backup", undoLabel, { players: before.players.length - after.players.length, teams: before.teams.length - after.teams.length, users: before.users.length - after.users.length });
  save("undoBulk");
  render();
  resetPageScroll();
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const pushCell = () => {
    row.push(cell);
    cell = "";
  };
  const pushRow = () => {
    if (row.some((value) => String(value || "").trim())) rows.push(row);
    row = [];
  };
  String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("").forEach((char, index, chars) => {
    if (char === '"') {
      if (quoted && chars[index + 1] === '"') {
        cell += '"';
        chars[index + 1] = "";
      } else {
        quoted = !quoted;
      }
      return;
    }
    if (char === "," && !quoted) {
      pushCell();
      return;
    }
    if (char === "\n" && !quoted) {
      pushCell();
      pushRow();
      return;
    }
    cell += char;
  });
  pushCell();
  pushRow();
  if (!rows.length) return [];
  const headers = rows[0].map(normalizeImportHeader);
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, String(values[index] || "").trim()])));
}

function normalizeImportHeader(value) {
  const key = normalizeSearchText(value).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const aliases = {
    nombre: "jugador",
    jugador_a: "jugador",
    equipo: "equipos",
    team: "equipos",
    teams: "equipos",
    padre: "familiar",
    madre: "familiar",
    tutor: "familiar",
    familia: "familiar",
    email_familia: "email_familiar",
    mail_familiar: "email_familiar",
    email_padre: "email_familiar",
    email_madre: "email_familiar",
    mail_jugador: "email_jugador",
  };
  return aliases[key] || key;
}

function buildPlayerImportPlan(rows) {
  return rows.map((row) => {
    const name = String(row.jugador || "").trim();
    const teamNames = splitImportList(row.equipos || row.equipo);
    const existingPlayer = state.players.find((player) => normalizeSearchText(player.name) === normalizeSearchText(name));
    const playerEmail = String(row.email_jugador || "").trim().toLowerCase();
    const guardianEmail = String(row.email_familiar || "").trim().toLowerCase();
    const errors = [];
    const warnings = [];
    if (!name) errors.push("Falta nombre de jugador");
    if (!teamNames.length) warnings.push("Sin equipo asignado");
    [playerEmail, guardianEmail].filter(Boolean).forEach((email) => {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push(`Email no válido: ${email}`);
    });
    const duplicateEmails = [playerEmail, guardianEmail].filter(Boolean);
    if (duplicateEmails.length !== new Set(duplicateEmails).size) errors.push("Email de jugador y familiar repetido");
    return {
      row,
      name,
      age: Number(row.edad || row.age || 0) || "",
      teamNames,
      playerEmail,
      guardianName: String(row.familiar || "").trim(),
      guardianEmail,
      phone: String(row.telefono || row.phone || "").trim(),
      notes: String(row.notas || row.notes || "").trim(),
      action: existingPlayer ? "update" : "create",
      existingPlayerId: existingPlayer?.id || "",
      errors,
      warnings,
    };
  });
}

function splitImportList(value) {
  return String(value || "")
    .split(/[|;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function applyPlayerImportPlans(plans) {
  const result = { created: 0, updated: 0, users: 0, userCreated: 0, userUpdated: 0, teamsCreated: 0 };
  plans.forEach((plan) => {
    const teamEnsures = plan.teamNames.map(ensureTeamByName);
    const teamIds = teamEnsures.map((entry) => entry.id);
    result.teamsCreated += teamEnsures.filter((entry) => entry.created).length;
    const playerUser = plan.playerEmail ? ensureUserForImport(plan.name, plan.playerEmail, ["player"]) : null;
    const guardianUser = plan.guardianEmail ? ensureUserForImport(plan.guardianName || `Familia ${plan.name}`, plan.guardianEmail, ["parent"], plan.phone) : null;
    const playerUserId = playerUser?.id || "";
    const guardianUserId = guardianUser?.id || "";
    [playerUser, guardianUser].filter(Boolean).forEach((entry) => {
      result.users += 1;
      if (entry.created) result.userCreated += 1;
      else result.userUpdated += 1;
    });
    let player = plan.existingPlayerId ? getPlayer(plan.existingPlayerId) : null;
    if (!player) {
      player = {
        id: uid("p"),
        name: plan.name,
        age: plan.age || "",
        teams: [],
        guardians: [],
        userId: "",
        notes: "",
        phone: "",
        active: true,
      };
      state.players.push(player);
      result.created += 1;
    } else {
      result.updated += 1;
    }
    player.name = plan.name;
    if (plan.age) player.age = plan.age;
    player.teams = [...new Set([...(player.teams || []), ...teamIds])];
    player.guardians = [...new Set([...(player.guardians || []), guardianUserId].filter(Boolean))];
    player.userId = playerUserId || player.userId || "";
    player.phone = plan.phone || player.phone || "";
    player.notes = [player.notes || "", plan.notes || ""].filter(Boolean).join(player.notes && plan.notes ? "\n" : "");
    if (playerUserId) {
      const playerUser = state.users.find((user) => user.id === playerUserId);
      if (playerUser) playerUser.playerId = player.id;
    }
    if (guardianUserId) {
      const guardian = state.users.find((user) => user.id === guardianUserId);
      if (guardian) guardian.children = [...new Set([...(guardian.children || []), player.id])];
    }
  });
  return result;
}

function ensureTeamByName(name) {
  const existing = state.teams.find((team) => normalizeSearchText(team.name) === normalizeSearchText(name));
  if (existing) return { id: existing.id, created: false };
  const team = {
    id: uid("team"),
    name,
    category: state.categories[0] || "Sin categoría",
    coachId: "",
    delegateId: "",
  };
  state.teams.push(team);
  return { id: team.id, created: true };
}

function ensureUserForImport(name, email, roles, phone = "") {
  const existing = state.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    existing.roles = [...new Set([...(existing.roles || []), ...roles])];
    existing.phone ||= phone;
    return { id: existing.id, created: false };
  }
  const user = {
    id: uid("user"),
    name,
    roles,
    email,
    password: "demo1234",
    children: [],
    playerId: "",
    disabled: false,
    phone,
    notificationPrefs: defaultNotificationPrefs(),
  };
  state.users.push(user);
  return { id: user.id, created: true };
}

function createUser(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const user = userFromForm(form);
  if (!validateUserForm(user)) return;
  state.users.push(user);
  syncUserPlayerLinks(user.id);
  state.toast = "Usuario creado";
  appendAudit("crear usuario", "user", user.name);
  saveAndClose("manageUsers");
}

function updateUser(event, userId) {
  event.preventDefault();
  const index = state.users.findIndex((item) => item.id === userId);
  if (index < 0) return;
  const form = new FormData(event.currentTarget);
  const user = userFromForm(form, userId, state.users[index]);
  if (!validateUserForm(user, userId)) return;
  state.users[index] = user;
  syncUserPlayerLinks(user.id);
  if (state.session?.userId === user.id && !user.roles.includes(state.session.activeRole)) state.session.activeRole = user.roles[0];
  state.toast = "Usuario actualizado";
  appendAudit("editar usuario", "user", user.name);
  saveAndClose("manageUsers");
}

function toggleUserDisabled(userId) {
  if (!canManageUsers()) return;
  const user = state.users.find((item) => item.id === userId);
  if (!user) return;
  if (user.id === currentUser()?.id) {
    state.toast = "No puedes desactivar tu propia cuenta";
    save();
    render();
    return;
  }
  user.disabled = !user.disabled;
  state.toast = user.disabled ? "Usuario desactivado" : "Usuario activado";
  appendAudit(user.disabled ? "desactivar usuario" : "activar usuario", "user", user.name);
  save("manageUsers");
  render();
}

function syncUserPlayerLinks(userId) {
  const user = state.users.find((item) => item.id === userId);
  if (!user) return;
  state.players.forEach((player) => {
    player.guardians = (player.guardians || []).filter((guardianId) => guardianId !== user.id);
    if (player.userId === user.id) player.userId = "";
  });
  if (user.roles.includes("parent")) {
    (user.children || []).forEach((playerId) => {
      const player = getPlayer(playerId);
      if (player && !player.guardians.includes(user.id)) player.guardians.push(user.id);
    });
  }
  if (user.roles.includes("player") && user.playerId) {
    const player = getPlayer(user.playerId);
    if (player) player.userId = user.id;
  }
}

function updatePlayerProfile(event, playerId) {
  event.preventDefault();
  const player = getPlayer(playerId);
  if (!canEditPlayerProfile(player)) return;
  const form = new FormData(event.currentTarget);
  const user = currentUser();
  const manageableTeamIds = hasRole(user, "director") ? state.teams.map((team) => team.id) : staffTeamIds(user);
  const selectedTeamIds = form.getAll("teamIds");
  const preservedTeamIds = (player.teams || []).filter((teamId) => !manageableTeamIds.includes(teamId));
  const nextTeamIds = [...new Set([...preservedTeamIds, ...selectedTeamIds])];
  const nextGuardianIds = form.getAll("guardianIds");
  const nextUserId = String(form.get("userId") || "");

  player.name = String(form.get("name") || "").trim();
  player.age = Number(form.get("age") || 0);
  player.teams = nextTeamIds;
  player.guardians = nextGuardianIds;
  player.userId = nextUserId;
  player.notes = String(form.get("notes") || "");
  player.active = Boolean(form.get("active"));

  state.users.forEach((entry) => {
    if (entry.playerId === player.id && entry.id !== nextUserId) entry.playerId = "";
    entry.children = (entry.children || []).filter((id) => id !== player.id);
  });
  if (nextUserId) {
    const playerUser = state.users.find((entry) => entry.id === nextUserId);
    if (playerUser) {
      playerUser.playerId = player.id;
      if (!playerUser.roles.includes("player")) playerUser.roles.push("player");
    }
  }
  nextGuardianIds.forEach((guardianId) => {
    const guardian = state.users.find((entry) => entry.id === guardianId);
    if (guardian) {
      guardian.children ||= [];
      if (!guardian.children.includes(player.id)) guardian.children.push(player.id);
      if (!guardian.roles.includes("parent")) guardian.roles.push("parent");
    }
  });

  state.toast = "Perfil actualizado";
  appendAudit("editar perfil jugador", "player", player.name);
  saveAndClose("manageProfiles");
}

function resultFromForm(form, id = uid("res"), existing = {}) {
  const date = form.get("date");
  const competitionId = form.get("competitionId") || defaultCompetitionId("league");
  return {
    id,
    teamId: form.get("teamId"),
    opponent: form.get("opponent"),
    date,
    seasonId: seasonIdForDate(date),
    competitionId,
    place: form.get("place") || "",
    homeAway: form.get("homeAway") || "home",
    teamScore: Number(form.get("teamScore") || 0),
    opponentScore: Number(form.get("opponentScore") || 0),
    matchReportUrl: form.get("matchReportUrl") || "",
    officialMatchReport: normalizeMatchReport(existing.officialMatchReport || null),
    matchReportUpdatedAt: existing.matchReportUpdatedAt || "",
    gallery: existing.gallery || [],
    notes: form.get("notes") || "",
  };
}

function createResult(event) {
  event.preventDefault();
  if (!canManageResults()) return;
  const form = new FormData(event.currentTarget);
  const allowed = hasRole(currentUser(), "director") ? state.teams.map((team) => team.id) : state.teams.filter((team) => team.coachId === currentUser().id).map((team) => team.id);
  if (!allowed.includes(form.get("teamId"))) return;
  const result = resultFromForm(form);
  state.results ||= [];
  state.results.unshift(result);
  state.resultsCursor = toLocalDateKey(mondayOf(new Date(`${result.date}T00:00:00`)));
  goView("results");
  state.toast = "Resultado guardado";
  appendAudit("crear resultado", "result", `${getTeam(result.teamId)?.name || ""} vs ${result.opponent}`);
  saveAndClose("manageResults");
}

function updateResult(event, resultId) {
  event.preventDefault();
  if (!canManageResults()) return;
  const index = state.results.findIndex((item) => item.id === resultId);
  if (index < 0) return;
  const form = new FormData(event.currentTarget);
  const allowed = hasRole(currentUser(), "director") ? state.teams.map((team) => team.id) : state.teams.filter((team) => team.coachId === currentUser().id).map((team) => team.id);
  if (!allowed.includes(form.get("teamId"))) return;
  state.results[index] = resultFromForm(form, resultId, state.results[index]);
  state.resultsCursor = toLocalDateKey(mondayOf(new Date(`${state.results[index].date}T00:00:00`)));
  state.toast = "Resultado actualizado";
  appendAudit("editar resultado", "result", `${getTeam(state.results[index].teamId)?.name || ""} vs ${state.results[index].opponent}`);
  saveAndClose("manageResults");
}

function deleteResult(resultId) {
  if (!canManageResults() || !confirm("Borrar este resultado?")) return;
  state.results = (state.results || []).filter((item) => item.id !== resultId);
  state.toast = "Resultado borrado";
  appendAudit("borrar resultado", "result", resultId);
  save("manageResults");
  closeModal();
  render();
}

async function uploadResultPhotos(event, resultId) {
  event.preventDefault();
  const result = state.results.find((item) => item.id === resultId);
  if (!result || !canManageResultGallery(result)) return;
  const files = [...event.currentTarget.photos.files].filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));
  if (!files.length) return;
  result.gallery ||= [];
  let uploaded = 0;
  for (const file of files) {
    const url = await uploadDocumentFile(file);
    if (!url) continue;
    result.gallery.unshift({
      id: uid("photo"),
      name: file.name || "foto",
      url,
      kind: file.type || "image",
      size: file.size || 0,
      createdAt: iso(0),
      uploadedBy: currentUser().name,
    });
    uploaded += 1;
  }
  state.toast = uploaded === 1 ? "Foto subida" : `${uploaded} fotos subidas`;
  if (uploaded) appendAudit("subir galería", "gallery", `${uploaded} archivo${uploaded === 1 ? "" : "s"} · ${getTeam(result.teamId)?.name || ""} vs ${result.opponent}`);
  save("uploadDocument");
  render();
  openResultGalleryModal(resultId);
}

function createAnnouncement(event) {
  event.preventDefault();
  if (!canPublishAnnouncement()) return;
  const form = new FormData(event.currentTarget);
  let targetType = form.get("targetType");
  let targetIds = targetType === "all" ? [] : form.getAll("targetId");
  if (!hasRole(currentUser(), "director")) {
    targetType = "team";
    const allowed = staffTeamIds();
    targetIds = targetIds.filter((id) => allowed.includes(id));
  }
  const announcement = {
    id: uid("ann"),
    title: form.get("title"),
    body: form.get("body"),
    targetType,
    targetIds,
    important: Boolean(form.get("important")),
    createdAt: iso(0),
  };
  state.announcements.unshift(announcement);
  appendAudit("crear anuncio", "announcement", announcement.title);
  saveAndClose("publishAnnouncement");
}

function updateAnnouncement(event, announcementId) {
  event.preventDefault();
  if (!canPublishAnnouncement()) return;
  const announcement = state.announcements.find((item) => item.id === announcementId);
  if (!announcement) return;
  const form = new FormData(event.currentTarget);
  let targetType = form.get("targetType");
  let targetIds = targetType === "all" ? [] : form.getAll("targetId");
  if (!hasRole(currentUser(), "director")) {
    targetType = "team";
    const allowed = staffTeamIds();
    targetIds = targetIds.filter((id) => allowed.includes(id));
  }
  announcement.title = form.get("title");
  announcement.body = form.get("body");
  announcement.targetType = targetType;
  announcement.targetIds = targetIds;
  announcement.important = Boolean(form.get("important"));
  state.toast = "Anuncio actualizado";
  appendAudit("editar anuncio", "announcement", announcement.title);
  saveAndClose("publishAnnouncement");
}

function deleteAnnouncement(announcementId) {
  if (!canPublishAnnouncement() || !confirm("Borrar este anuncio?")) return;
  state.announcements = state.announcements.filter((item) => item.id !== announcementId);
  state.readAnnouncementIds = (state.readAnnouncementIds || []).filter((id) => id !== announcementId);
  state.toast = "Anuncio borrado";
  appendAudit("borrar anuncio", "announcement", announcementId);
  save("publishAnnouncement");
  render();
}

function createEvent(event) {
  event.preventDefault();
  if (!canCreateEvent()) return;
  const form = new FormData(event.currentTarget);
  const date = form.get("date");
  const type = form.get("type");
  const playerIds = form.getAll("playerIds");
  const teamId = String(form.get("teamId") || "");
  if (!canUseEventTeam(teamId)) return;
  if (type === "training") {
    const dates = recurrenceDates(date, Number(form.get("weeks") || 1), form.getAll("weekdays"));
    const trainings = dates.map((trainingDate) => trainingFromForm(form, teamId, playerIds, trainingDate));
    state.trainings.push(...trainings);
    trainings.forEach((training) => notifyAffectedPlayers(playerIds, "Nuevo entreno convocado", `${training.date} ${training.time} · ${training.place}`, training.id));
    state.toast = trainings.length === 1 ? "Entreno guardado en el calendario" : `${trainings.length} entrenos guardados`;
    appendAudit("crear entreno", "training", `${trainings.length} · ${getTeam(teamId)?.name || t("allClub")}`);
  } else {
    if (!String(form.get("title") || "").trim()) return;
    const eventItem = {
    id: uid("ev"),
    type,
    title: form.get("title"),
    teamId,
    seasonId: seasonIdForDate(date),
    competitionId: form.get("competitionId") || "",
    date,
    time: form.get("time"),
    place: form.get("place"),
    notes: form.get("notes"),
    playerIds,
    };
    state.events.push(eventItem);
    if (playerIds.length) notifyAffectedPlayers(playerIds, "Nuevo evento en tu calendario", `${eventItem.title} · ${eventItem.date} ${eventItem.time}`, eventItem.id);
    state.toast = "Evento guardado en el calendario";
    appendAudit("crear evento", "event", eventItem.title);
  }
  if (date) state.calendarCursor = `${date.slice(0, 7)}-01`;
  goView("calendar");
  saveAndClose("manageEvents");
}

function trainingFromForm(form, teamId, playerIds, date) {
  return {
    id: uid("tr"),
    teamId,
    seasonId: seasonIdForDate(date),
    competitionId: "",
    playerIds,
    date,
    time: form.get("time"),
    place: form.get("place"),
    notes: form.get("notes"),
    absences: {},
    confirmed: false,
    attendance: {},
  };
}

function recurrenceDates(startDate, weeks = 1, weekdays = []) {
  const selected = weekdays.map(Number).filter(Boolean);
  if (!selected.length || weeks <= 1) return [startDate];
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + weeks * 7 - 1);
  const dates = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const day = cursor.getDay() || 7;
    if (selected.includes(day)) dates.push(toLocalDateKey(cursor));
  }
  return dates.length ? dates : [startDate];
}

function duplicateEvent(event, eventId) {
  event.preventDefault();
  const original = state.events.find((item) => item.id === eventId);
  if (!original || !canManageScheduleItem(original)) return;
  const form = new FormData(event.currentTarget);
  const teamId = String(form.get("teamId") || "");
  if (!canUseEventTeam(teamId)) return;
  const eventItem = {
    id: uid("ev"),
    type: form.get("type"),
    title: form.get("title"),
    teamId,
    seasonId: seasonIdForDate(form.get("date")),
    competitionId: form.get("competitionId") || original.competitionId || "",
    date: form.get("date"),
    time: form.get("time"),
    place: form.get("place"),
    notes: form.get("notes"),
    playerIds: form.getAll("playerIds"),
  };
  state.events.push(eventItem);
  notifyAffectedPlayers(eventItem.playerIds || [], "Nuevo evento en tu calendario", `${eventItem.title} · ${eventItem.date} ${eventItem.time}`, eventItem.id);
  state.calendarCursor = `${eventItem.date.slice(0, 7)}-01`;
  state.toast = "Evento duplicado";
  appendAudit("duplicar evento", "event", eventItem.title);
  saveAndClose("manageEvents");
}

function duplicateTraining(event, trainingId) {
  event.preventDefault();
  const original = state.trainings.find((item) => item.id === trainingId);
  if (!original || !canManageScheduleItem(original)) return;
  const form = new FormData(event.currentTarget);
  const teamId = String(form.get("teamId") || "");
  if (!canUseEventTeam(teamId)) return;
  const training = trainingFromForm(form, teamId, form.getAll("playerIds"), form.get("date"));
  state.trainings.push(training);
  notifyAffectedPlayers(training.playerIds || [], "Nuevo entreno convocado", `${training.date} ${training.time} · ${training.place}`, training.id);
  state.calendarCursor = `${training.date.slice(0, 7)}-01`;
  state.toast = "Entreno duplicado";
  appendAudit("duplicar entreno", "training", `${getTeam(training.teamId)?.name || t("allClub")} · ${training.date}`);
  saveAndClose("manageEvents");
}

function repeatTraining(event, trainingId) {
  event.preventDefault();
  const original = state.trainings.find((item) => item.id === trainingId);
  if (!original || !canManageScheduleItem(original)) return;
  const form = new FormData(event.currentTarget);
  const dates = recurrenceDates(form.get("date"), Number(form.get("weeks") || 1), form.getAll("weekdays"));
  const existing = new Set(state.trainings.filter((item) => item.teamId === original.teamId && item.time === original.time).map((item) => item.date));
  const trainings = dates
    .filter((date) => !existing.has(date) || date === original.date)
    .filter((date) => date !== original.date)
    .map((date) => ({
      ...structuredCloneSafe(original),
      id: uid("tr"),
      date,
      absences: {},
      attendance: {},
      confirmed: false,
    }));
  state.trainings.push(...trainings);
  trainings.forEach((training) => notifyAffectedPlayers(training.playerIds || [], "Nuevo entreno convocado", `${training.date} ${training.time} · ${training.place}`, training.id));
  state.toast = trainings.length ? `${trainings.length} entrenos creados` : "No habia nuevas fechas";
  appendAudit("repetir entreno", "training", `${trainings.length} · ${getTeam(original.teamId)?.name || t("allClub")}`);
  saveAndClose("manageEvents");
}

function updateEvent(event, eventId) {
  event.preventDefault();
  const eventItem = state.events.find((item) => item.id === eventId);
  if (!eventItem || !canManageScheduleItem(eventItem)) return;
  const form = new FormData(event.currentTarget);
  const nextTeamId = String(form.get("teamId") || "");
  if (!canUseEventTeam(nextTeamId)) return;
  const before = {
    title: eventItem.title,
    type: eventItem.type,
    teamId: eventItem.teamId,
    date: eventItem.date,
    time: eventItem.time,
    place: eventItem.place,
    notes: eventItem.notes,
    playerIds: eventItem.playerIds || [],
  };
  const nextPlayers = form.getAll("playerIds");
  eventItem.title = form.get("title");
  eventItem.type = form.get("type");
  eventItem.teamId = nextTeamId;
  eventItem.seasonId = seasonIdForDate(form.get("date"));
  eventItem.competitionId = form.get("competitionId") || "";
  eventItem.date = form.get("date");
  eventItem.time = form.get("time");
  eventItem.place = form.get("place");
  eventItem.notes = form.get("notes");
  eventItem.playerIds = nextPlayers;
  const changedFields = ["title", "type", "teamId", "date", "time", "place", "notes"].filter((key) => before[key] !== eventItem[key]);
  const newPlayers = nextPlayers.filter((id) => !before.playerIds.includes(id));
  if (changedFields.length) {
    notifyAffectedPlayers([...new Set([...before.playerIds, ...nextPlayers])], "Evento modificado", `${eventItem.title} · ${eventItem.date} ${eventItem.time}`, eventItem.id);
  }
  if (newPlayers.length) {
    notifyAffectedPlayers(newPlayers, "Nueva convocatoria", `Te han incluido en ${eventItem.title}.`, eventItem.id);
  }
  if (eventItem.sourceCallupId) {
    const callup = state.callups.find((item) => item.id === eventItem.sourceCallupId);
    if (callup) {
      callup.teamId = eventItem.teamId;
      callup.seasonId = eventItem.seasonId;
      callup.competitionId = eventItem.competitionId;
      callup.date = eventItem.date;
      callup.time = eventItem.time;
      callup.place = eventItem.place;
      callup.notes = eventItem.notes;
      callup.playerIds = nextPlayers;
      callup.responses = Object.fromEntries(nextPlayers.map((id) => [id, callup.responses?.[id] || "pending"]));
    }
  }
  state.toast = "Evento actualizado";
  appendAudit("editar evento", "event", eventItem.title);
  saveAndClose("manageEvents");
}

function deleteEvent(eventId) {
  const eventItem = state.events.find((item) => item.id === eventId);
  if (!eventItem || !canManageScheduleItem(eventItem)) return;
  if (!eventItem || !confirm("Borrar este evento?")) return;
  state.events = state.events.filter((item) => item.id !== eventId);
  if (eventItem.sourceCallupId) state.callups = state.callups.filter((item) => item.id !== eventItem.sourceCallupId);
  notifyAffectedPlayers(eventItem.playerIds || [], "Evento cancelado", eventItem.title || "", eventId);
  state.toast = "Evento borrado";
  appendAudit("borrar evento", "event", eventItem.title || eventId);
  save("manageEvents");
  render();
}

function updateTraining(event, trainingId) {
  event.preventDefault();
  const training = state.trainings.find((item) => item.id === trainingId);
  if (!training || !canManageScheduleItem(training)) return;
  const form = new FormData(event.currentTarget);
  const nextTeamId = String(form.get("teamId") || "");
  if (!canUseEventTeam(nextTeamId)) return;
  const beforePlayers = training.playerIds || [];
  const nextPlayers = form.getAll("playerIds");
  training.teamId = nextTeamId;
  training.date = form.get("date");
  training.time = form.get("time");
  training.place = form.get("place");
  training.notes = form.get("notes");
  training.playerIds = nextPlayers;
  notifyAffectedPlayers([...new Set([...beforePlayers, ...nextPlayers])], "Entreno modificado", `${training.date} ${training.time} · ${training.place}`, training.id);
  state.toast = "Entreno actualizado";
  appendAudit("editar entreno", "training", `${getTeam(training.teamId)?.name || t("allClub")} · ${training.date}`);
  saveAndClose("manageEvents");
}

function deleteTraining(trainingId) {
  const training = state.trainings.find((item) => item.id === trainingId);
  if (!training || !canManageScheduleItem(training)) return;
  if (!training || !confirm("Borrar este entreno?")) return;
  state.trainings = state.trainings.filter((item) => item.id !== trainingId);
  notifyAffectedPlayers(training.playerIds || [], "Entreno cancelado", `${training.date} ${training.time} · ${training.place}`, training.id);
  state.toast = "Entreno borrado";
  appendAudit("borrar entreno", "training", `${getTeam(training.teamId)?.name || t("allClub")} · ${training.date}`);
  save("manageEvents");
  render();
}

function createCallup(event) {
  event.preventDefault();
  if (!canCreateCallup()) return;
  const form = new FormData(event.currentTarget);
  const allowed = hasRole(currentUser(), "director") ? state.teams.map((team) => team.id) : state.teams.filter((team) => team.coachId === currentUser().id).map((team) => team.id);
  if (!allowed.includes(form.get("teamId"))) return;
  const playerIds = form.getAll("playerIds");
  if (!playerIds.length) return;
  const callup = {
    id: uid("call"),
    teamId: form.get("teamId"),
    seasonId: seasonIdForDate(form.get("date")),
    competitionId: form.get("competitionId") || defaultCompetitionId("league"),
    rival: form.get("rival"),
    date: form.get("date"),
    time: form.get("time"),
    place: form.get("place"),
    arrival: form.get("arrival"),
    kit: form.get("kit"),
    playerIds,
    notes: form.get("notes"),
    responses: Object.fromEntries(playerIds.map((id) => [id, "pending"])),
  };
  state.callups.push(callup);
  const eventItem = syncCallupEvent(state, callup);
  notifyAffectedPlayers(playerIds, "Nueva convocatoria publicada", `${eventItem.title} · ${eventItem.date} ${eventItem.time}`, eventItem.id);
  state.calendarCursor = `${callup.date.slice(0, 7)}-01`;
  goView("calendar");
  appendAudit("crear convocatoria", "callup", eventItem.title);
  saveAndClose("manageCallup");
}

function updateCallup(event, callupId) {
  event.preventDefault();
  const callup = state.callups.find((item) => item.id === callupId);
  if (!canManageCallup(callup)) return;
  const form = new FormData(event.currentTarget);
  const beforePlayers = callup.playerIds || [];
  const playerIds = form.getAll("playerIds");
  if (!playerIds.length) return;
  callup.teamId = form.get("teamId");
  callup.seasonId = seasonIdForDate(form.get("date"));
  callup.competitionId = form.get("competitionId") || callup.competitionId || defaultCompetitionId("league");
  callup.rival = form.get("rival");
  callup.date = form.get("date");
  callup.time = form.get("time");
  callup.place = form.get("place");
  callup.arrival = form.get("arrival");
  callup.kit = form.get("kit");
  callup.playerIds = playerIds;
  callup.notes = form.get("notes");
  callup.responses = Object.fromEntries(playerIds.map((id) => [id, callup.responses?.[id] || "pending"]));
  const eventItem = syncCallupEvent(state, callup);
  notifyAffectedPlayers([...new Set([...beforePlayers, ...playerIds])], "Convocatoria modificada", `${eventItem.title} · ${eventItem.date} ${eventItem.time}`, eventItem.id);
  state.toast = "Convocatoria actualizada";
  appendAudit("editar convocatoria", "callup", eventItem.title);
  saveAndClose("manageCallup");
}

function deleteCallup(callupId) {
  const callup = state.callups.find((item) => item.id === callupId);
  if (!canManageCallup(callup) || !confirm("Borrar esta convocatoria?")) return;
  state.callups = state.callups.filter((item) => item.id !== callupId);
  state.events = state.events.filter((item) => item.sourceCallupId !== callupId && item.id !== callup.eventId);
  notifyAffectedPlayers(callup.playerIds || [], "Convocatoria cancelada", `${getTeam(callup.teamId)?.name || ""} vs ${callup.rival}`, callup.eventId);
  state.toast = "Convocatoria borrada";
  appendAudit("borrar convocatoria", "callup", `${getTeam(callup.teamId)?.name || ""} vs ${callup.rival}`);
  save("manageCallup");
  render();
}

function createThread(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const assigned = state.users.find((user) => user.id === form.get("assignedToId"));
  const playerId = form.get("playerId");
  const thread = {
    id: uid("thread"),
    subject: `${currentUser().name} -> ${assigned?.name || "Club"}: ${form.get("subject")}`,
    assignedToId: form.get("assignedToId"),
    relatedPlayerIds: playerId ? [playerId] : [],
    participantUserIds: [currentUser().id],
    messages: [{ from: "user", text: form.get("message"), at: currentTime() }],
  };
  state.threads.unshift(thread);
  state.activeThreadId = thread.id;
  appendAudit("crear conversación", "thread", thread.subject);
  saveAndClose("messageClub");
}

async function createDocument(event) {
  event.preventDefault();
  if (!canUploadDocument()) return;
  const form = new FormData(event.currentTarget);
  const allowed = hasRole(currentUser(), "director") ? state.teams.map((team) => team.id) : staffTeamIds();
  if (!allowed.includes(form.get("teamId"))) return;
  const files = [...event.currentTarget.file.files];
  if (!files.length) return;
  let uploaded = 0;
  for (const file of files) {
    const url = await uploadDocumentFile(file);
    if (!url) continue;
    const doc = {
      id: uid("doc"),
      teamId: form.get("teamId"),
      folderId: form.get("folderId") || "",
      name: file?.name || "archivo",
      kind: file?.type || "archivo",
      size: file?.size || 0,
      url,
      notes: form.get("notes"),
      createdAt: iso(0),
      uploadedBy: currentUser().name,
    };
    state.documents.unshift(doc);
    notifyTeam(form.get("teamId"), t("fileAlert"), file?.name || "Archivo nuevo", doc.id);
    uploaded += 1;
  }
  if (!uploaded) {
    state.toast = "No se pudo subir el archivo";
    saveAndClose("uploadDocument");
    return;
  }
  state.toast = uploaded === 1 ? "Archivo subido" : `${uploaded} archivos subidos`;
  appendAudit("subir archivo", "document", `${uploaded} archivo${uploaded === 1 ? "" : "s"}`);
  saveAndClose("uploadDocument");
}

function updateDocument(event, docId) {
  event.preventDefault();
  if (!canUploadDocument()) return;
  const doc = state.documents.find((item) => item.id === docId);
  if (!doc) return;
  const form = new FormData(event.currentTarget);
  doc.name = form.get("name");
  doc.folderId = form.get("folderId") || "";
  doc.notes = form.get("notes");
  state.toast = "Archivo actualizado";
  appendAudit("editar archivo", "document", doc.name);
  saveAndClose("uploadDocument");
}

function deleteDocument(docId) {
  if (!canUploadDocument() || !confirm("Borrar este archivo?")) return;
  state.documents = state.documents.filter((item) => item.id !== docId);
  state.notifications = (state.notifications || []).filter((notice) => notice.documentId !== docId);
  state.toast = "Archivo borrado";
  appendAudit("borrar archivo", "document", docId);
  save("uploadDocument");
  render();
}

function createFolder(event) {
  event.preventDefault();
  if (!canUploadDocument()) return;
  const form = new FormData(event.currentTarget);
  state.documentFolders.push({
    id: uid("folder"),
    teamId: form.get("teamId"),
    name: form.get("name"),
  });
  state.activeDocumentTeamId = form.get("teamId");
  state.toast = "Carpeta creada";
  appendAudit("crear carpeta", "folder", form.get("name"));
  saveAndClose("uploadDocument");
}

function updateFolder(event, folderId) {
  event.preventDefault();
  if (!canUploadDocument()) return;
  const folder = state.documentFolders.find((item) => item.id === folderId);
  if (!folder) return;
  folder.name = new FormData(event.currentTarget).get("name");
  state.toast = "Carpeta actualizada";
  appendAudit("editar carpeta", "folder", folder.name);
  saveAndClose("uploadDocument");
}

function deleteFolder(folderId) {
  if (!canUploadDocument() || !confirm("Borrar esta carpeta? Los archivos pasaran a Todos los archivos.")) return;
  state.documentFolders = state.documentFolders.filter((folder) => folder.id !== folderId);
  state.documents.forEach((doc) => {
    if (doc.folderId === folderId) doc.folderId = "";
  });
  if (state.activeDocumentFolderId === folderId) state.activeDocumentFolderId = "";
  state.toast = "Carpeta borrada";
  appendAudit("borrar carpeta", "folder", folderId);
  save("uploadDocument");
  render();
}

function readFileDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

async function uploadDocumentFile(file) {
  const dataUrl = await readFileDataUrl(file);
  if (typeof fetch === "undefined" || location.protocol === "file:") return dataUrl;
  try {
    const response = await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...requestHeaders("uploadDocument") },
      body: JSON.stringify({ name: file.name, dataUrl }),
    });
    if (!response.ok) throw new Error("Upload failed");
    const payload = await response.json();
    return payload.url || dataUrl;
  } catch {
    return "";
  }
}

function createTeam(event) {
  event.preventDefault();
  if (!hasRole(currentUser(), "director")) return;
  const form = new FormData(event.currentTarget);
  const team = {
    id: uid("team"),
    category: form.get("category"),
    name: form.get("name"),
    coachId: form.get("coachId"),
    delegateId: form.get("delegateId"),
    federationTeamName: form.get("federationTeamName") || "",
    federationUrl: form.get("federationUrl") || "",
    standingsUrl: form.get("standingsUrl") || "",
    officialStandings: [],
    standingsUpdatedAt: "",
  };
  state.teams.push(team);
  assignPlayersToTeam(team.id, form.getAll("playerIds"));
  appendAudit("crear equipo", "team", team.name);
  saveAndClose("manageUsers");
}

function updateTeam(event, teamId) {
  event.preventDefault();
  const team = getTeam(teamId);
  if (!canEditTeam(team)) return;
  const form = new FormData(event.currentTarget);
  team.category = form.get("category");
  team.name = form.get("name");
  team.federationTeamName = form.get("federationTeamName") || "";
  team.federationUrl = form.get("federationUrl") || "";
  team.standingsUrl = form.get("standingsUrl") || "";
  if (hasRole(currentUser(), "director")) {
    team.coachId = form.get("coachId");
    team.delegateId = form.get("delegateId");
  }
  assignPlayersToTeam(team.id, form.getAll("playerIds"));
  appendAudit("editar equipo", "team", team.name);
  saveAndClose(hasRole(currentUser(), "director") ? "manageUsers" : "editTeam");
}

function assignPlayersToTeam(teamId, playerIds) {
  const selected = new Set(playerIds || []);
  state.players.forEach((player) => {
    player.teams ||= [];
    const hasTeam = player.teams.includes(teamId);
    if (selected.has(player.id) && !hasTeam) player.teams.push(teamId);
    if (!selected.has(player.id) && hasTeam) player.teams = player.teams.filter((id) => id !== teamId);
  });
}

function respondCallup(callupId, playerId, response) {
  const callup = state.callups.find((item) => item.id === callupId);
  callup.responses[playerId] = response;
  save("attendance");
  render();
}

function markAbsence(event, trainingId, playerId) {
  event.preventDefault();
  const training = state.trainings.find((item) => item.id === trainingId);
  training.absences[playerId] = new FormData(event.currentTarget).get("reason");
  saveAndClose("attendance");
}

function setAttendance(trainingId, playerId, value, reopenDetail = false) {
  const training = state.trainings.find((item) => item.id === trainingId);
  if (value) training.attendance[playerId] = value;
  else delete training.attendance[playerId];
  save("attendance");
  if (reopenDetail) {
    render();
    openScheduleDetail("training", trainingId);
  }
}

function confirmTraining(trainingId, reopenDetail = false) {
  const training = state.trainings.find((item) => item.id === trainingId);
  const players = state.players.filter((player) => player.teams.includes(training.teamId));
  players.forEach((player) => {
    if (!training.attendance[player.id]) training.attendance[player.id] = training.absences[player.id] ? "no" : "yes";
  });
  training.confirmed = true;
  save("attendance");
  render();
  if (reopenDetail) openScheduleDetail("training", trainingId);
}

function selectThread(threadId) {
  state.activeThreadId = threadId;
  const thread = state.threads.find((item) => item.id === threadId);
  if (thread) {
    thread.seenBy ||= {};
    thread.seenBy[currentUser().id] = thread.messages.length;
  }
  save();
  render();
}

function sendMessage(event, threadId) {
  event.preventDefault();
  const input = event.currentTarget.message;
  const text = input.value.trim();
  if (!text) return;
  const user = currentUser();
  const thread = state.threads.find((item) => item.id === threadId);
  thread.messages.push({
    from: thread.assignedToId === user.id || hasRole(user, "director") ? "club" : "user",
    text,
    at: currentTime(),
  });
  save("messageClub");
  render();
}

function currentTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function togglePermission(key) {
  state.permissions[key] = !state.permissions[key];
  save("managePermissions");
  render();
}

function toggleNotificationPref(key) {
  const user = currentUser();
  if (!user) return;
  user.notificationPrefs ||= defaultNotificationPrefs();
  user.notificationPrefs[key] = !notificationPreferenceEnabled(key, user);
  save();
  render();
}

async function togglePush() {
  if (!state.pushEnabled && typeof Notification !== "undefined" && Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      state.toast = t("pushBlocked");
      state.pushEnabled = false;
      save();
      render();
      return;
    }
  }
  state.pushEnabled = !state.pushEnabled;
  if (state.pushEnabled) pushNotification("KamikApp", "Notificaciones activadas");
  save();
  render();
}

async function testPushNotification() {
  if (!state.pushEnabled) {
    state.toast = "Activa push primero";
    save();
    render();
    return;
  }
  if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      state.toast = t("pushBlocked");
      save();
      render();
      return;
    }
  }
  pushNotification("KamikApp", "Aviso de prueba");
  state.toast = "Push de prueba enviado";
  save();
  render();
}

function setupBackToTop() {
  if (typeof window === "undefined") return;
  const button = document.querySelector("#back-to-top");
  if (!button) return;
  const sync = () => button.classList.toggle("visible", window.scrollY > 420);
  window.removeEventListener("scroll", window.__kamikBackToTopSync);
  window.__kamikBackToTopSync = sync;
  window.addEventListener("scroll", sync, { passive: true });
  sync();
}

function scrollToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetPageScroll() {
  if (typeof window === "undefined") return;
  window.requestAnimationFrame?.(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.querySelector(".main")?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
  document.querySelector(".content")?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
}

function exportAttendanceCsv() {
  if (!canViewStats()) return;
  const header = ["fecha", "hora", "equipo", "jugador", "estado", "ausencia"];
  const lines = attendanceRows().map((row) => [row.date, row.time, row.team, row.player, responseLabel(row.status), row.absence]);
  downloadCsv("asistencia-kamikapp.csv", [header, ...lines]);
}

function downloadCsv(filename, lines) {
  const csv = lines.map((line) => line.map(csvCell).join(",")).join("\n");
  downloadText(filename, `\uFEFF${csv}`, "text/csv;charset=utf-8");
}

function downloadText(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}

function saveAndClose(operation = "general") {
  save(operation);
  closeModal();
  render();
}

function clearToastSoon() {
  if (!state.toast || typeof window === "undefined") return;
  window.clearTimeout(window.__kamikToastTimer);
  window.__kamikToastTimer = window.setTimeout(() => {
    state.toast = "";
    save();
    render();
  }, 2200);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    if (state.mobileMenuOpen) closeMobileMenu();
  });
  startRemoteSync();
}

render();
loadRemoteState();
