# ChatFlow — Real-Time MSN Messenger Reborn

Aplicación de mensajería en tiempo real con estética MSN Messenger clásico, construida con React + TypeScript + Socket.io.

## ✨ Features

- 🔐 **Autenticación** con JWT (registro / login persistente)
- 💬 **Chat en tiempo real** con WebSockets
- 🌟 **Diseño MSN Messenger** con glassmorphism y animaciones retro
- 📳 **Zumbido (Nudge)** con sonido Web Audio API y shake de ventana
- ✓✓ **Estados de mensaje** — sending → sent → delivered → read
- 👍 **Reacciones emoji** con toggle por usuario
- 📜 **Paginación infinita** de historial con scroll inverso
- 👀 **Indicador "está escribiendo..."** con auto-timeout
- 👤 **Estado online/offline** en tiempo real
- 👥 **Chats individuales y grupales**

## 🚀 Quick Start

### Prerequisitos
- Node.js 18+ y npm

### Instalación

```bash
# Desde la raíz del proyecto
npm run install:all
```

Eso instala dependencias en `/`, `/backend` y `/frontend`.

### Correr en desarrollo

**Opción 1 — Una sola terminal (recomendado):**
```bash
npm run dev
```
Esto arranca backend (`localhost:3001`) y frontend (`localhost:5173`) en paralelo con `concurrently`.

**Opción 2 — Terminales separadas:**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Luego abre **http://localhost:5173** en el navegador.

### Probar el chat completo

1. Abre dos pestañas/navegadores distintos en `http://localhost:5173`
2. Regístrate con dos usuarios diferentes (ej. `pato@test.com` y `ana@test.com`)
3. En una de las cuentas, click en **"Nueva conversación"** y busca al otro usuario
4. ¡A chatear! Prueba el botón 📳 para enviar zumbidos.

## 📁 Estructura

```
chatflow/
├── backend/              # Node.js + Express + Socket.io
│   ├── src/
│   │   ├── index.ts              # Entry point + Socket.io handlers
│   │   ├── routes/               # REST endpoints
│   │   ├── services/dataService  # In-memory store
│   │   ├── middleware/           # JWT auth
│   │   └── models/types.ts       # Shared types
│   └── package.json
│
├── frontend/             # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # Login, Register
│   │   │   ├── chat/             # ChatWindow, MessageBubble, NudgeButton, etc
│   │   │   ├── common/           # Avatar
│   │   │   └── layout/           # Sidebar, Header, Dashboard
│   │   ├── hooks/                # useInfiniteMessages, useNudge, useReactions, etc
│   │   ├── stores/               # Zustand: auth, chat, socket
│   │   ├── services/             # api.ts (axios), socket.ts
│   │   ├── styles/               # globals, msn-theme, nudge animations
│   │   └── types/                # TypeScript definitions
│   └── package.json
│
└── package.json          # Root scripts (concurrently)
```

## 🔧 Variables de entorno

### `backend/.env`
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=change-me-in-production
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

> Ya hay archivos `.env` con valores por defecto incluidos en cada carpeta.

## 🛠 Stack

**Frontend:** React 18, TypeScript, Vite, Zustand, Socket.io-client, axios, date-fns, react-router-dom

**Backend:** Node.js, Express, Socket.io, TypeScript, JWT, bcryptjs, in-memory store

## 📝 Notas

- El backend usa **almacenamiento en memoria** — los datos se pierden al reiniciar. Para producción, conectar a PostgreSQL/MongoDB.
- Las contraseñas se hashean con bcrypt.
- Los tokens JWT duran 7 días.
- El nudge tiene cooldown de 10 segundos validado tanto cliente como servidor.

## 🧪 Testing manual

Funcionalidades a verificar:

- [ ] Registro de usuario nuevo
- [ ] Login con credenciales correctas
- [ ] Login persiste tras refresh (token en localStorage)
- [ ] Búsqueda de usuarios funciona
- [ ] Crear conversación 1-a-1
- [ ] Crear grupo con múltiples usuarios
- [ ] Enviar mensaje (aparece optimista, luego confirmado)
- [ ] Recibir mensaje en tiempo real en la otra pestaña
- [ ] Estados de mensaje cambian (sending → sent → delivered)
- [ ] Hover sobre mensaje muestra ReactionPicker
- [ ] Reaccionar con emoji actualiza badge en tiempo real
- [ ] Scroll hacia arriba carga mensajes anteriores
- [ ] Click en 📳 envía zumbido (sonido + cooldown)
- [ ] Otra pestaña recibe el zumbido (shake + banner)
- [ ] Indicador "escribiendo..." aparece y desaparece
- [ ] Estado online/offline cambia al cerrar pestaña

## 📦 Build para producción

```bash
npm run build
```

Genera:
- `backend/dist/` — JavaScript compilado
- `frontend/dist/` — Bundle estático listo para deploy

## 🚢 Deploy

- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **Backend:** Railway, Render, Fly.io, AWS EC2

Recuerda actualizar las variables de entorno en producción (especialmente `JWT_SECRET` y URLs).

---

Construido con 💙 inspirado en MSN Messenger clásico.
