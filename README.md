# 💧 Water Habit

App web PWA para seguimiento de hidratación diaria con mascota animada, gamificación e integración con Google Sheets y Atajos de iPhone.

---

## 📦 Archivos del proyecto

```
water-habit/
├── index.html              ← App completa (abre este en el navegador)
├── sw.js                   ← Service Worker (PWA offline)
├── manifest.json           ← Manifest PWA (instalación en móvil)
├── google-apps-script.gs   ← Script para Google Sheets
├── assets/
│   ├── icon-72.png         ← Icono app (crea uno o usa placeholder)
│   ├── icon-192.png        ← Icono app principal
│   └── icon-512.png        ← Icono splash screen
└── README.md
```

---

## 🚀 Publicar en internet (3 opciones, todas gratis)

### Opción A — GitHub Pages (recomendada)
1. Crea una cuenta en [github.com](https://github.com) si no tienes una.
2. Haz clic en "New repository" → nombra: `water-habit` → Public → Create.
3. Sube todos los archivos (arrastra a la interfaz web o usa git).
4. Ve a **Settings → Pages → Branch: main → Save**.
5. Tu app estará en: `https://TU-USUARIO.github.io/water-habit/`

### Opción B — Netlify (drag & drop)
1. Ve a [netlify.com](https://netlify.com) → inicia sesión con GitHub o email.
2. En el dashboard: arrastra la **carpeta completa** `water-habit/` al área de deploy.
3. Listo. Te da una URL tipo `https://algo-random.netlify.app`.
4. Puedes conectar tu dominio propio desde Settings.

### Opción C — Tiiny.host (1 minuto, sin cuenta)
1. Ve a [tiiny.host](https://tiiny.host).
2. Comprime la carpeta `water-habit/` en un ZIP.
3. Arrastra el ZIP → elige subdominio → Deploy.
4. URL: `https://water-habit.tiiny.site` (o el nombre que elijas).
> **Nota**: Tiiny.host es gratis pero borra sitios sin cuenta después de 24h. Con cuenta gratuita duran más.

---

## 📊 Configurar Google Sheets (guardar datos en la nube)

### Paso 1: Crear el script
1. Ve a [script.google.com](https://script.google.com).
2. Haz clic en **"Nuevo proyecto"**.
3. Borra el código que aparece por defecto.
4. Pega todo el contenido de `google-apps-script.gs`.
5. Guarda (Ctrl+S) → ponle nombre: "Water Habit Script".

### Paso 2: Vincular con Google Sheets
- El script automáticamente crea la hoja en **la hoja de cálculo activa del script**.
- Para usar una hoja específica: ve a Google Sheets, copia el ID de la URL (la parte larga entre `/d/` y `/edit`), y pégalo en la variable `SPREADSHEET_ID` del script.

### Paso 3: Desplegar como Web App
1. Clic en **"Implementar"** (botón azul arriba a la derecha).
2. Selecciona **"Nueva implementación"**.
3. Clic en el engranaje ⚙️ → **"Aplicación web"**.
4. Configuración:
   - **Descripción**: Water Habit API
   - **Ejecutar como**: Yo
   - **Acceso**: Cualquier persona
5. Clic en **"Implementar"** → autoriza los permisos → copia la URL.

### Paso 4: Conectar con la app
1. Abre Water Habit en tu navegador.
2. Ve a **Perfil → Google Sheets**.
3. Pega la URL del paso anterior → **Guardar URL**.
4. ¡Listo! Cada registro de agua se enviará automáticamente a Sheets.

### Verificar que funciona
- Desde el editor del script: clic en **"Ejecutar"** → selecciona `testRegistro`.
- Si aparece un log exitoso → todo está bien.
- Abre tu Google Sheets y verifica la hoja "Registros".

---

## 📱 Atajos de iPhone (registrar agua con 1 toque)

### Crear el Atajo
1. Abre la app **Atajos** en tu iPhone.
2. Toca **"+"** para crear uno nuevo.
3. Busca y agrega la acción: **"Obtener contenidos de URL"**.
4. Configura:
   - **URL**: (tu URL de Google Apps Script)
   - **Método**: POST
   - **Cuerpo**: JSON
   - Agrega estos campos al JSON:
     ```
     amount: 250
     source: atajo-iphone
     ```
5. Dale nombre: **"💧 250ml"** → agrega a pantalla de inicio.

### Crear múltiples Atajos (recomendado)
Repite el proceso para:
- **"💧 250ml"** → amount: 250
- **"🥛 500ml"** → amount: 500
- **"🍶 750ml"** → amount: 750
- **"🏺 1 Litro"** → amount: 1000

### Agregar como widget
- En la pantalla de inicio, mantén presionado → **"+"** → busca "Atajos" → agrega el widget → selecciona tus atajos de agua.

---

## 📲 Instalar como app en el móvil

### iPhone (Safari)
1. Abre tu URL publicada en **Safari** (no Chrome).
2. Toca el botón de compartir **↑** (abajo al centro).
3. Selecciona **"Agregar a pantalla de inicio"**.
4. Nombre: "Water Habit" → **Agregar**.

### Android (Chrome)
1. Abre la URL en **Chrome**.
2. Toca el menú **⋮** (tres puntos arriba a la derecha).
3. Selecciona **"Agregar a pantalla de inicio"** o **"Instalar app"**.
4. Confirma.

---

## 🔔 Iconos (opcional pero recomendado)

Para que la app se vea bien al instalarla necesitas los iconos PNG.

**Opción rápida**: Crea un emoji 💧 como imagen usando:
- [favicon.io/emoji-favicons](https://favicon.io/emoji-favicons) → descarga → renombra a `icon-192.png` y `icon-512.png`.
- O usa [realfavicongenerator.net](https://realfavicongenerator.net).
- Colócalos en la carpeta `assets/`.

Sin los iconos la app funciona igual, solo no mostrará icono personalizado en la pantalla de inicio.

---

## ✨ Funcionalidades incluidas

| Función | Estado |
|---|---|
| Dashboard con anillo de progreso | ✅ |
| Botones rápidos +250/500/750/1000ml | ✅ |
| Campo personalizado | ✅ |
| Mascota Splash animada | ✅ |
| Estadísticas semanales con barras | ✅ |
| Historial completo por día | ✅ |
| Sistema de logros y XP | ✅ |
| 5 niveles de progreso | ✅ |
| Racha de días | ✅ |
| Recordatorios configurables | ✅ |
| Google Sheets sync | ✅ |
| Atajos iPhone API | ✅ |
| PWA instalable | ✅ |
| Modo offline | ✅ |
| Datos locales (localStorage) | ✅ |

---

## 🛠️ Personalizar

### Cambiar la meta por defecto
En `index.html`, busca:
```javascript
goal: parseInt(localStorage.getItem('wh_goal')||'2000'),
```
Cambia `2000` por tu meta en ml.

### Cambiar los recordatorios
Busca el array `reminders` en el JS y ajusta los horarios.

### Cambiar colores
Al inicio del `<style>`, modifica las variables CSS:
```css
--cyan: #0BCDF4;   /* color principal */
--green: #16C809;  /* color de meta cumplida */
```

---

## 📋 Estructura de Google Sheets

Columnas creadas automáticamente:

| Fecha | Hora | Cantidad (ml) | Fuente | Total del día (ml) | ID |
|---|---|---|---|---|---|
| 03/06/2026 | 08:30 | 500 | manual | 500 | abc12345 |
| 03/06/2026 | 10:15 | 250 | atajo-iphone | 750 | def67890 |

---

*Hecho con 💧 · Water Habit v1.0*
