# KamikApp - despliegue beta

Guia corta para subir KamikApp a un servidor gratuito durante la pretemporada sin tocar la web original del club.

## Objetivo

- Mantener `www.3cpatinclub.com` en IONOS intacta.
- Publicar KamikApp en un subdominio de pruebas, por ejemplo `beta.3cpatinclub.com`.
- Usar servidor compatible con Node.js.
- Usar HTTPS.
- No subir contrasenas demo.

## Antes de subir

Ejecutar:

```bash
npm run check
npm run launch:check
npm run beta:prepare
```

`npm run beta:prepare` crea:

- `data/state.beta.json`: estado limpio para beta.
- `data/beta-credentials.txt`: contrasenas temporales para usuarios activos.
- backup previo en `data/backups`.

Cuando quieras aplicar la beta limpia al archivo principal:

```bash
npm run beta:apply
```

Esto reemplaza `data/state.json` por la beta limpia y crea backup previo.

## Variables de entorno recomendadas

En el panel del servidor:

```bash
APP_MODE=beta
APP_LABEL=Beta privada
PRESENTATION_DEMO=0
SHOW_LOGIN_PROFILES=0
SESSION_TTL_HOURS=168
MAX_UPLOAD_MB=15
HOST=0.0.0.0
```

El servidor suele asignar `PORT` automaticamente. Si el panel lo permite, deja que use su variable `PORT`.

## Comando de arranque

```bash
npm start
```

## Archivos que hay que subir

Subir todo el proyecto excepto `.git` y logs antiguos. Imprescindibles:

- `app.js`
- `server.js`
- `styles.css`
- `index.html`
- `sw.js`
- `manifest.webmanifest`
- `package.json`
- `assets/`
- `data/state.json`

Si quieres empezar sin archivos subidos, no subas `data/uploads` o dejala vacia.

## Avisos importantes

- En Render hay que activar un Disk persistente. Sin Disk, cada redeploy puede perder perfiles, asignaciones, eventos y archivos creados desde la web.
- Render no permite Persistent Disks en servicios gratuitos: hay que cambiar el servicio a una instancia de pago mínima antes de añadir el Disk.
- Montaje recomendado: `/var/data`.
- Variable recomendada: `DATA_DIR=/var/data/kamikapp`.
- El repo incluye `render.yaml` con un Disk de 1 GB (`kamikapp-data`) para servicios gestionados como Blueprint.
- Para uso real con equipos, conviene migrar a base de datos y almacenamiento externo.
- No publiques `data/beta-credentials.txt` en una carpeta servida como web estatica.

## Activar Disk en Render si el servicio ya existe

1. Entra en Render y abre el servicio `kamikapp-beta`.
2. Ve a `Settings`.
3. Busca `Disks`.
4. Pulsa `Add Disk`.
5. Usa:
   - Name: `kamikapp-data`
   - Mount Path: `/var/data`
   - Size: `1 GB`
6. En `Environment`, comprueba o añade:
   - `DATA_DIR=/var/data/kamikapp`
   - `APP_MODE=beta`
   - `PRESENTATION_DEMO=0`
7. Guarda cambios. Render redeployará la app.
8. Después del deploy, entra como dirección y revisa `Diagnóstico`: `dataDir` debe mostrar `/var/data/kamikapp`.

## Prueba despues de subir

1. Abrir la URL beta con HTTPS.
2. Entrar como direccion con una credencial temporal.
3. Cambiar la contrasena de direccion.
4. Crear un aviso dirigido a un equipo.
5. Entrar con un jugador/familia y comprobar que lo ve.
6. Subir un archivo pequeno y abrirlo.
7. Revisar Diagnostico y Backups desde direccion.
