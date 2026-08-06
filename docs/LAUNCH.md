# KamikApp - guia de lanzamiento beta

Esta guia deja la app preparada para una beta privada del club. La version actual es valida para ensenar y probar flujo real con usuarios controlados, pero aun no sustituye a un backend con base de datos gestionada.

## Arranque

```bash
npm run launch:check
npm start
```

Abrir:

- Ordenador principal: `http://127.0.0.1:4173`
- Movil en la misma WiFi: usar la URL de red que imprime el servidor.

## Cuentas demo

- Direccion: `direccion@club.test` / `demo1234`
- Entrenador: `coach@club.test` / `demo1234`
- Delegado: `delegada@club.test` / `demo1234`
- Familia: `familia@club.test` / `demo1234`
- Jugador: `leo@club.test` / `demo1234`
- Jugadora: `vega@club.test` / `demo1234`

## Antes de abrir beta

1. Ejecutar `npm run check`.
2. Ejecutar `npm run launch:check`.
3. Entrar como direccion y comprobar Inicio, Resultados, Calendario, Convocatorias, Documentos, Mensajes y Perfiles.
4. Publicar un anuncio de prueba dirigido a un equipo.
5. Cerrar sesion y entrar como jugador/familia para confirmar que se ve solo lo que corresponde.
6. Revisar que `data/backups` tiene copias recientes.

## Datos y backups

- Estado principal: `data/state.json`
- Backups automaticos: `data/backups`
- Archivos subidos: `data/uploads`

Antes de una demo importante, copiar la carpeta `data` completa.

`npm run launch:check` migra automaticamente contrasenas antiguas en texto plano a hash y crea backup previo.

## Variables de entorno

Ver `.env.example`.

- `PORT`: puerto HTTP.
- `HOST`: interfaz de red.
- `DATA_DIR`: carpeta donde se guarda estado, backups y uploads.
- `SESSION_TTL_HOURS`: caducidad de sesion.

## Modo presentacion

La app rellena clasificaciones oficiales y actas demo para que Resultados se pueda ensenar sin depender de federaciones externas.

Los resultados demo principales estan colocados en el fin de semana del 1 y 2 de agosto de 2026.

## Riesgos conocidos

- La importacion automatica desde federaciones esta desactivada visualmente en la presentacion. Para produccion requiere conector especifico por web federativa.
- El almacenamiento actual es JSON local. Para produccion multiusuario real conviene migrar a base de datos.
- Las notificaciones push necesitan configuracion real de servidor/VAPID antes de abrirlas a todo el club.
- Los archivos se guardan en disco local. Para produccion conviene almacenamiento tipo S3, Cloudflare R2 o Supabase Storage.

## Siguiente salto tecnico

1. Base de datos gestionada.
2. Almacenamiento de archivos externo.
3. Dominio HTTPS.
4. Recuperacion de contrasena.
5. Push real.
6. Auditoria completa de permisos con usuarios piloto.
