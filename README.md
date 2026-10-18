# KidZania x Adidas - Experiencia de personalizacion 3D

Las tablets envian la personalizacion de una prenda al backend. El backend la guarda en PostgreSQL y la emite por WebSocket a 6 pantallas logicas (3 monitores, 2 por monitor), donde el visor 3D la muestra. Grafana lee la misma base para mostrar estadisticas.

| Carpeta | Contenido | Puerto |
|---|---|---|
| `backend/` | API NestJS + Socket.io + PostgreSQL (solo `dist/` compilado) | 4000 |
| `viewer/` | Visor 3D (HTML/JS, `<model-viewer>`). Pantalla: `visor.html` | 8090 |
| `tour/` | Recorrido virtual 3DVista | 8085 |
| `chrome-viewer/` | `.bat` que abren Chrome en 3 monitores | - |
| `database/` | `schema.sql` de PostgreSQL | 5432 |
| `grafana/` | Datasource para Grafana | 3000 |

## Puesta en marcha

Requisitos: Node 22, PostgreSQL 16, PM2 (`npm i -g pm2 serve`).

1. **Base de datos**: `.\scripts\setup-db.ps1`. Crea `adidas3d`, las tablas y la secuencia `sessions_sec`, y genera `backend\.env`.
2. **Backend**: edita `PG_PASS` en `backend\.env`, y luego `cd backend; npm ci --omit=dev; node --env-file=.env dist/main.js`.
3. **Modelos 3D**: los `.glb` van en `viewer/glb/`. Si no estan, el visor no muestra prendas. No estan en git por defecto (`viewer/.gitignore` los excluye). Para versionarlos con Git LFS: `git lfs install`, quita la linea `/glb/*.*` de `viewer/.gitignore` y haz `git add viewer/glb`. Si no, copialos manualmente a `viewer/glb/`.
4. **Todo con PM2**: `ecosystem.config.js` usa rutas `C:\MMC\...`; copia el repo a `C:\MMC\kidzania-adidas-experience` o ajusta las rutas. Grafana se instala aparte.

## API del backend (puerto 4000)

- `POST /sessions` abre una sesion (id `AAAAMMDD_NNN`); solo permite una activa. `POST /sessions/close` la cierra.
- `POST /customise` guarda una personalizacion: `tablet_id, screen, line_id, user_name, session_id, round_id, timestamp, product_type, product_id, personalization[]`.
- `GET /customise`, `GET /sessions`, y `GET|PATCH|DELETE /:id` en ambos.
- Eventos WebSocket: `newCustomisation`, `sessionClosed`. Cada pantalla se une a su sala con `?screen=1..6`. `visor.html` muestra las pantallas 1-2, `visor2.html` la 3-4 y `visor3.html` la 5-6.

## Variables (`backend/.env`)

`APP_PORT`, `PG_URI`, `PG_PORT`, `PG_DBNAME`, `PG_USER`, `PG_PASS`, `NUMBER_OF_SCREENS`, `CAROUSEL_DELAY_MS`. El `.env` real nunca se sube; usa `.env.example`.

## Notas

- El codigo fuente TypeScript del backend (`src/`) no esta en este repo: solo el compilado `dist/`.
- Documentacion del visor: `viewer/README.md` y `viewer/docs/`.
