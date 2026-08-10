# KamikApp

PWA para comunicacion, calendario, convocatorias, resultados, documentos y mensajes de un club de hockey linea.

## Probar

Arranca la app:

```bash
npm start
```

Luego abre:

- En este ordenador: http://127.0.0.1:4173
- En movil/tablet/otro ordenador de la misma WiFi: usa la URL `http://IP-DE-ESTE-ORDENADOR:4173` que aparece en la consola al arrancar.

La app cambia sola entre escritorio y movil segun el dispositivo. Las URLs `?view=desktop` y `?view=mobile` quedan solo para pruebas de diseno.

Si el puerto 4173 ya esta ocupado, el servidor usara el siguiente libre. Usa la URL que aparezca en la consola.

Tambien puedes hacer doble click en `start-kamikapp.bat`.

La app guarda los cambios en `data/state.json` cuando se sirve con `npm start`, y mantiene `localStorage` como respaldo para pruebas.

En Render, los datos deben guardarse en un Disk persistente montado en `/var/data`.
El servidor usa `DATA_DIR=/var/data/kamikapp` en producción/beta para conservar perfiles, eventos, archivos y backups entre despliegues.

Antes de una demo o beta:

```bash
npm run check
npm run launch:check
npm run beta:prepare
```

Ver tambien:

- `docs/LAUNCH.md`
- `docs/BETA_DEPLOY.md`

## Alcance inicial

- Roles multiples por usuario: director deportivo, entrenador, delegado, padre/madre y jugador.
- Permisos configurables para entrenadores.
- Categorias y equipos editables.
- Anuncios segmentados por equipos, roles o todo el club.
- Calendario semanal y mensual de partidos, torneos, eventos y entrenamientos con boton para Google Calendar en eventos.
- Convocatorias publicadas por direccion con confirmacion.
- Ausencias marcadas por padres/jugadores y asistencia confirmada por entrenador/club.
- Comunicacion vertical empleado-familias/jugadores.
- Documentos, fotos y videos vinculados a equipos.
- Interfaz en espanol e ingles.

## Siguiente paso tecnico

Cuando el prototipo encaje, conviene sustituir los datos locales por backend con autenticacion, base de datos y notificaciones push reales.
