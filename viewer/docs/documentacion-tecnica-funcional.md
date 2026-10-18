# Documentación Técnica y Funcional
## Adidas x KidZania - Experiencia Interactiva de Personalización 3D

---

## 1. Documentación Funcional

### 1.1 Objetivo Principal del Sistema

El sistema es una **experiencia interactiva de visualización 3D en tiempo real** diseñada para la activación **Adidas x KidZania**. Permite a los niños (usuarios finales) personalizar prendas Adidas (playeras, sudaderas, pantalones, gorras) seleccionando colores, emblemas y texturas, visualizando el resultado instantáneamente en un modelo 3D interactivo.

**Casos de Uso Principales:**

| ID | Caso de Uso | Descripción |
|----|-------------|-------------|
| UC-01 | Personalización de prenda | Usuario selecciona tipo de prenda, color, emblema y textura desde la interfaz de KidZania |
| UC-02 | Visualización 3D en tiempo real | Modelo 3D se actualiza instantáneamente al cambiar variantes |
| UC-03 | Multi-pantalla sincronizada | Hasta 3 pantallas muestran la misma personalización simultáneamente |
| UC-04 | Gestión de sesión | Inicio, seguimiento y cierre de sesión de personalización |
| UC-05 | Modo atracción (idle) | Pantalla muestra imagen de marca cuando no hay sesión activa |

### 1.2 Roles de Usuario y Permisos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Niño (Usuario Final)** | Participante en la activación KidZania | Selecciona opciones de personalización desde tablet/kiosco externo |
| **Operador/Staff** | Personal de KidZania | Inicia/termina sesiones, reinicia pantallas, monitorea estado |
| **Sistema Backend (API/Socket Server)** | Orquestador central | Envía eventos `newCustomisation` y `sessionClosed` via WebSocket |

**Flujo de Interacción:**

```
[Tablet KidZania] → [Backend API] → [WebSocket Server:4000] → [3 Pantallas Visor (index.html?screen=1,2,3)]
                                    ↓
                          [visor.html (contenedor iframes)]
```

### 1.3 Reglas de Negocio Clave

1. **Identificación de producto**: El `product_id` determina qué modelo GLB cargar (mapeo: `prd_{linea}_{tipo}_{variante}`)
2. **Variantes GLB**: Cada modelo `.glb` contiene variantes definidas internamente (`var_color_*`, `var_emb_*`, `var_texture_*`)
3. **Sincronización multi-pantalla**: Parámetro `screen` (1, 2, 3) en URL + query `screen` en socket.io filtra eventos por pantalla
4. **Estados visuales**:
   - **Idle**: Imagen estática Adidas (`adidas.png`)
   - **Cargando**: Imagen inicial 4s → Modelo 3D con transición suave
   - **Activo**: Modelo 3D visible 25s mínimo (configurable)
   - **Cierre**: Reset a variantes por defecto + imagen estática
5. **Diccionario de texturas**: Mapeo interno `01→jaguar`, `02→zebra`, `03→forest`, `no→-`

---

## 2. Documentación Técnica

### 2.1 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA GENERAL                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    HTTP/WS     ┌──────────────────────────┐  │
│  │  Tablet/     │ ─────────────► │  Backend KidZania        │  │
│  │  Kiosco      │   REST + WS    │  (Puerto 4000)           │  │
│  └──────────────┘                └───────────┬──────────────┘  │
│                                              │                  │
│                    ┌─────────────────────────┼───────────────┐  │
│                    │                         │               │  │
│              ┌─────▼─────┐           ┌──────▼──────┐  ┌──────▼──────┐
│              │ Screen 1  │           │ Screen 2    │  │ Screen 3    │
│              │ index.html│           │ index.html  │  │ index.html  │
│              │?screen=1  │           │?screen=2    │  │?screen=3    │
│              └───────────┘           └─────────────┘  └─────────────┘
│                    │                         │               │
│                    └─────────────────────────┼───────────────┘
│                                              │
│                                        ┌─────▼─────┐
│                                        │ visor.html│
│                                        │ (3 iframes)│
│                                        └───────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Patrones de Diseño Identificados:**

| Patrón | Aplicación |
|--------|------------|
| **Observer/Event-Driven** | Socket.io para recibir eventos `newCustomisation` y `sessionClosed` |
| **Strategy** | `construirSrcModelo()` resuelve rutas GLB dinámicamente |
| **State Machine** | Estados: Idle → Loading → Active → Closing → Idle |
| **Facade** | `model-viewer` web component abstrae Three.js/WebGL |
| **Module Pattern** | IIFE en script principal encapsula lógica |

**Separación de Capas:**

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| **Presentación** | `index.html`, `visor.html`, CSS embebido | UI, layout responsive, animaciones |
| **Lógica de Negocio** | Script en `index.html` (líneas 380-600) | Manejo eventos, mapeo variantes, transiciones |
| **Datos/Comunicación** | Socket.io client | Conexión WebSocket, filtrado por `screen` |
| **Assets 3D** | `/glb/*.glb` | Modelos con variantes embebidas |

### 2.2 Stack Tecnológico

| Categoría | Tecnología | Versión/Detalle |
|-----------|------------|-----------------|
| **Core 3D** | `<model-viewer>` (Google) | v3.4.0 via CDN |
| **Comunicación** | Socket.io Client | v4.7.5 via CDN |
| **Renderizado** | Three.js (interno model-viewer) | r150+ |
| **Formato 3D** | GLTF/GLB | Modelos con variantes KHR_materials_variants |
| **Estilos** | CSS Vanilla | Custom Properties, Flexbox, Media Queries |
| **Fuentes** | Adineue Pro (Adidas) | Fallback: Helvetica, sans-serif |
| **Entorno** | Navegador moderno | ES Modules, WebGL2, WebXR opcional |
| **Despliegue** | Estático | Servidor HTTP simple + WebSocket server externo |

**Dependencias Externas (CDN):**
```html
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
```

### 2.3 Estructura de Directorios

```
kidzania-interactivo-adidas-visor/
├── index.html              # Visor principal (lógica + UI)
├── visor.html              # Contenedor multi-pantalla (3 iframes)
├── css/
│   └── animate.css         # Animaciones CSS (no usado actualmente)
├── img/
│   ├── adidas.png          # Imagen idle/branding principal
│   ├── adidas_old.png      # Versión anterior logo
│   ├── fondo.png           # Background "Urban Creator" (1.9MB)
│   └── escenario.png       # Escenario alternativo (529KB)
├── glb/                    # Modelos 3D (21 archivos, ~150MB total)
│   ├── prd_dep_gorra_01.glb           (10MB)
│   ├── prd_dep_gorra_02.glb           (9.6MB)
│   ├── prd_dep_pantalon_01.glb        (14.8MB)
│   ├── prd_dep_pantalon_02.glb        (6MB)
│   ├── prd_dep_pantalon_03.glb        (10.4MB)
│   ├── prd_dep_playera_01.glb         (13MB)
│   ├── prd_dep_playera_02.glb         (10.5MB)
│   ├── prd_dep_playera_03.glb         (4.7MB)
│   ├── prd_dep_sudadera_01.glb        (6.2MB)
│   ├── prd_dep_sudadera_02.glb        (8.8MB)
│   ├── prd_dep_sudadera_02_ok.glb     (8.4MB)
│   ├── prd_dep_sudadera_03.glb        (4.9MB)
│   ├── prd_mod_playera_01.glb         (15.1MB)
│   ├── prd_mod_playera_02.glb         (6.7MB)
│   ├── prd_mod_playera_03.glb         (5.7MB)
│   ├── prd_mod_sudadera_01.glb        (6.1MB)
│   ├── prd_mod_sudadera_02.glb        (5.1MB)
│   ├── prd_mod_sudadera_03.glb        (12.2MB)
│   └── prd_playera_originals_02.glb   (15.6MB)
├── docs/
│   └── documentacion-tecnica-funcional.md  (este archivo)
└── .gitignore              # Ignora /glb/*.*
```

### 2.4 Modelo de Datos / Entidades Principales

**Payload evento `newCustomisation` (entrada WebSocket):**
```typescript
interface CustomisationEvent {
  screen?: string;                    // "1" | "2" | "3" | undefined (todas)
  user_name?: string;                 // Nombre del niño
  product_type?: string;              // "Playera" | "Sudadera" | "Pantalón" | "Gorra"
  product_id?: string;                // "prd_dep_playera_01" (clave para GLB)
  productId?: string;                 // Alias camelCase
  customisation?: {
    product_id?: string;
    productId?: string;
  };
  payload?: {
    product_id?: string;
    productId?: string;
  };
  session?: {
    product_id?: string;
    productId?: string;
  };
  personalization: string[];          // ["var_color_rojo", "var_emb_01", "var_texture_02"]
}
```

**Estados UI (Side Panel):**
```typescript
interface UIState {
  userName: string;        // "---" | nombre real
  prenda: string;          // "---" | tipo prenda
  color: string;           // "---" | última parte variante color
  emblema: string;         // "---" | última parte variante emblema
  textura: string;         // "---" | "jaguar" | "zebra" | "forest" | "-"
}
```

**Mapeo Producto → GLB:**
| Línea | Tipo | Variantes | Archivo GLB |
|-------|------|-----------|-------------|
| `dep` (Deportiva) | Playera | 01, 02, 03 | `prd_dep_playera_XX.glb` |
| `dep` | Sudadera | 01, 02, 03 | `prd_dep_sudadera_XX.glb` |
| `dep` | Pantalón | 01, 02, 03 | `prd_dep_pantalon_XX.glb` |
| `dep` | Gorra | 01, 02 | `prd_dep_gorra_XX.glb` |
| `mod` (Moderna) | Playera | 01, 02, 03 | `prd_mod_playera_XX.glb` |
| `mod` | Sudadera | 01, 02, 03 | `prd_mod_sudadera_XX.glb` |
| `originals` | Playera | 02 | `prd_playera_originals_02.glb` |

### 2.5 Endpoints / Contratos de Comunicación

**WebSocket Server:** `http://localhost:4000` (configurable via `?api_port=`)

| Evento | Dirección | Payload | Descripción |
|--------|-----------|---------|-------------|
| `connection` | Client → Server | `{ screen: "1\|2\|3" }` | Handshake con identificación de pantalla |
| `newCustomisation` | Server → Client | `CustomisationEvent` | Nueva personalización a aplicar |
| `sessionClosed` | Server → Client | `{ screen: "1\|2\|3" }` | Cierre de sesión, reset visor |

**Parámetros URL (`index.html`):**
| Parámetro | Default | Descripción |
|-----------|---------|-------------|
| `screen` | `"1"` | Identificador de pantalla (1, 2, 3) |
| `api_port` | `"4000"` | Puerto del servidor WebSocket |

---

## 3. Revisión y Buenas Prácticas

### 3.1 Cuellos de Botella y Rendimiento

| Problema | Severidad | Impacto | Ubicación |
|----------|-----------|---------|-----------|
| **Tamaño modelos GLB excesivo** | 🔴 Crítico | Carga inicial 5-15MB por modelo; 21 modelos = ~150MB total | `/glb/*.glb` |
| **Sin compresión/optimización GLB** | 🔴 Crítico | No usan Draco compression, texturas sin optimizar | Modelos 3D |
| **Carga síncrona bloqueante** | 🟠 Alto | `await esperar(4000)` hardcoded en `cargarModelo()` | `index.html:480` |
| **Sin lazy loading / precarga** | 🟠 Alto | Modelo se carga solo al recibir evento; latencia visible | `cargarModelo()` |
| **Memory leaks potenciales** | 🟡 Medio | Event listeners en `load`/`error` no siempre removidos | `index.html:440-460` |
| **CSS/JS inline en HTML** | 🟡 Medio | Dificulta caching, minificación, mantenimiento | `index.html` (380+ líneas) |

**Métricas estimadas actuales:**
- First Contentful Paint: ~2-4s (imagen inicial)
- Time to Interactive (modelo): ~6-10s (descarga GLB + parse)
- Memoria GPU: ~200-400MB por modelo complejo

### 3.2 Vulnerabilidades de Seguridad

| Vulnerabilidad | Severidad | Descripción | Mitigación |
|----------------|-----------|-------------|------------|
| **XSS via `user_name`** | 🔴 Crítico | `innerText` usado correctamente, pero `product_type` y otros campos van a `innerText` - OK actual, pero riesgo si cambian a `innerHTML` | Mantener `innerText` / `textContent` |
| **Sin validación de origen WebSocket** | 🟠 Alto | Cualquier cliente puede conectarse a `ws://localhost:4000` y enviar eventos | Validar `origin`, tokens por pantalla |
| **Puerto hardcoded / expuesto** | 🟡 Medio | Puerto 4000 expuesto en red local sin autenticación | Firewall, VPN, autenticación WS |
| **CSP ausente** | 🟡 Medio | Sin Content Security Policy; CDN externos permitidos | Agregar `<meta http-equiv="Content-Security-Policy">` |
| **HTTPS no enforzado** | 🟡 Medio | CDN Google/Socket.io cargan por HTTP en desarrollo | Usar HTTPS en producción |

### 3.3 Deuda Técnica y Mantenibilidad

| Item | Descripción | Esfuerzo |
|------|-------------|----------|
| **Lógica monolítica en HTML** | 600+ líneas en un solo archivo; mezclar HTML/CSS/JS | Alto |
| **Magic numbers** | `180_000`, `4_000`, `3_000`, `25_000`, `5`, `150`, `10` ms | Bajo |
| **Hardcoded strings** | `"var_color_"`, `"var_emb_"`, `"var_texture_"`, `"color_default"` | Bajo |
| **Comentarios en español/inglés mixto** | Inconsistencia en código | Bajo |
| **Código muerto comentado** | Theme switcher, líneas de info-card, logs | Bajo |
| **Sin TypeScript / tipos** | Props complejas sin tipado | Medio |
| **Sin tests** | Ningún test unitario, integración o E2E | Alto |
| **Sin build pipeline** | No minificación, bundling, optimización assets | Medio |
| **Gitignore incompleto** | Solo ignora `/glb/*.*`; debería ignorar `node_modules`, `.env`, `dist` | Bajo |

### 3.4 Recomendaciones de Optimización

#### 🔴 Crítico (Implementar YA)

1. **Optimizar modelos GLB**
   ```bash
   # Usar gltf-transform para compresión Draco + textura WebP
   npx gltf-transform draco input.glb output.glb
   npx gltf-transform textureresize --width 1024 --height 1024 input.glb output.glb
   npx gltf-transform texturecompress --format webp input.glb output.glb
   ```
   **Objetivo**: Reducir 60-80% tamaño (15MB → 3-5MB)

2. **Implementar precarga inteligente**
   ```javascript
   // Precargar modelos probables al idle
   const PRELOAD_MODELS = [
     'prd_dep_playera_01', 'prd_dep_sudadera_01', 'prd_dep_pantalon_01'
   ];
   PRELOAD_MODELS.forEach(id => {
     const link = document.createElement('link');
     link.rel = 'preload';
     link.as = 'model';
     link.href = `./glb/${id}.glb`;
     document.head.appendChild(link);
   });
   ```

3. **Separar arquitectura: HTML / CSS / JS modules**
   ```
   src/
   ├── index.html          # Solo estructura
   ├── styles/
   │   ├── main.css        # Estilos principales
   │   ├── themes.css      # Gallery/Urban themes
   │   └── responsive.css  # Media queries
   ├── scripts/
   │   ├── main.js         # Entry point
   │   ├── model-loader.js # Carga GLB + variantes
   │   ├── socket-handler.js # WebSocket logic
   │   ├── ui-controller.js  # Side panel updates
   │   └── constants.js    # Config, timings, mappings
   └── types/
       └── index.d.ts      # TypeScript definitions
   ```

#### 🟠 Alto (Próximo Sprint)

4. **State Machine formal para ciclos de vida**
   ```typescript
   enum ViewerState { IDLE, LOADING_IMAGE, LOADING_MODEL, ACTIVE, CLOSING }
   class ViewerStateMachine {
     transition(to: ViewerState): void { /* validar transiciones */ }
   }
   ```

5. **Configuración externalizable**
   ```json
   // config.json
   {
     "timings": { "imageAppear": 4000, "modelAppear": 3000, "minVisibility": 25000, "cronInterval": 180000 },
     "variants": { "colorPrefix": "var_color_", "emblemPrefix": "var_emb_", "texturePrefix": "var_texture_" },
     "defaults": { "color": "color_default", "emblem": "emblema_default", "texture": "textura_default" }
   }
   ```

6. **Error boundaries y reintentos**
   ```javascript
   async function cargarModeloConReintentos(productId, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try { return await cargarModelo(productId); }
       catch { if (i === maxRetries - 1) throw; await esperar(1000 * (i + 1)); }
     }
   }
   ```

#### 🟡 Medio (Tech Debt)

7. **Añadir TypeScript + ESLint + Prettier**
8. **Implementar CSP header**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' https://ajax.googleapis.com https://cdn.socket.io; 
                  style-src 'self' 'unsafe-inline'; 
                  img-src 'self' data: https:; 
                  connect-src 'self' ws://localhost:4000; 
                  model-src 'self'">
   ```

9. **WebSocket authentication**
   ```javascript
   const socket = io(`http://localhost:${API_PORT}`, {
     query: { screen, token: generateScreenToken(screen) },
     auth: { screenToken: getStoredToken() }
   });
   ```

10. **Monitoring / Telemetría**
    ```javascript
    // Métricas clave a trackear
    metrics.track('model_load_time', { modelId, durationMs, success: true });
    metrics.track('variant_switch', { variantName, fromCache: true });
    metrics.track('session_duration', { screen, durationMs });
    ```

#### 🟢 Bajo (Nice to Have)

11. **PWA / Service Worker** para cache offline de modelos
12. **WebXR / AR mode** opcional via `model-viewer ar ar-modes="webxr scene-viewer"`
13. **Admin dashboard** para monitorear pantallas en tiempo real
14. **Automated visual regression tests** (Chromatic / Playwright)

---

## 4. Resumen Ejecutivo

| Aspecto | Estado | Prioridad |
|---------|--------|-----------|
| **Funcionalidad core** | ✅ Completa | - |
| **Multi-pantalla** | ✅ Funcional | - |
| **Rendimiento carga** | 🔴 Crítico | Inmediata |
| **Seguridad** | 🟠 Alto | Sprint actual |
| **Arquitectura/Modularidad** | 🟠 Alto | Próximo sprint |
| **Testing** | ❌ Ausente | Planificar |
| **Documentación** | ✅ Este doc | - |

**Esfuerzo estimado refactor crítico**: 2-3 semanas (1 dev senior)
**Esférfuerzo refactor completo + tests**: 6-8 semanas

---

## 5. Apéndice: Diccionario de Variantes GLB

Basado en análisis de código (`index.html:540-570`):

| Prefijo Variante | Propiedad UI | Transformación | Ejemplos |
|------------------|--------------|----------------|----------|
| `var_color_` | `card-color` | `extraerUltimaParte()` → "rojo", "azul", "negro" | `var_color_rojo` |
| `var_emb_` | `card-emblema` | `extraerUltimaParte()` → "01", "02", "logo" | `var_emb_01` |
| `var_texture_` | `card-textura` | `diccionario[extraerUltimaParte()]` | `var_texture_01` → "jaguar" |

**Variantes default (reset al cerrar sesión):**
- `color_default`
- `emblema_default`  
- `textura_default`

---

*Documento generado automáticamente - Revisar y actualizar con cada release*
*Versión: 1.0 | Fecha: 2026-07-23 | Autor: Análisis Arquitectónico Automatizado*