# ChatFlow - Real-Time Messaging Platform

<div align="center">
  <h3>🚀 Aplicación de mensajería en tiempo real con React, TypeScript y AWS</h3>
  <p>Demostración de arquitectura escalable, WebSockets y gestión de estado complejo</p>
</div>

---

## 📋 Descripción

ChatFlow es una aplicación de mensajería instantánea que implementa comunicación en tiempo real utilizando WebSockets, con un backend serverless en AWS y una interfaz moderna construida con React y TypeScript.

### ✨ Características Principales

- 💬 **Mensajería en tiempo real** con WebSockets
- 👥 **Chats individuales y grupales**
- 🔐 **Autenticación segura** con AWS Cognito
- ✅ **Estados de mensaje** (enviado, entregado, leído)
- 📝 **Indicador de "escribiendo..."**
- 😊 **Reacciones con emojis**
- 📱 **Diseño responsive** (mobile-first)
- 🔔 **Notificaciones en tiempo real**
- 📜 **Historial infinito** con paginación
- 🟢 **Estados de presencia** (online/offline)

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18+** - Framework UI
- **TypeScript** - Type safety
- **Zustand** - Gestión de estado global
- **TanStack Query** - Server state management
- **Socket.io Client** - WebSocket client
- **TailwindCSS** - Styling
- **React Router** - Navegación
- **React Hook Form + Zod** - Formularios y validación
- **date-fns** - Manejo de fechas

### Backend (AWS Serverless)
- **AWS Cognito** - Autenticación
- **AWS Lambda** - Funciones serverless
- **Amazon API Gateway** - REST + WebSocket APIs
- **Amazon DynamoDB** - Base de datos NoSQL

---

## 📁 Estructura del Proyecto
```
chatflow-realtime/
├── frontend/                 # Aplicación React
├── backend/                  # Infraestructura AWS
├── docs/                     # Documentación
└── README.md
```

---

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+
- npm o yarn
- Cuenta de AWS (para deploy)

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/PatoFredesTi/chatflow-realtime.git
cd chatflow-realtime

# Instalar dependencias del frontend
cd frontend
npm install

# Iniciar desarrollo
npm run dev
```

---

## 🎯 Roadmap

- [x] Setup inicial del proyecto
- [ ] Configuración frontend (React + Vite + TypeScript)
- [ ] Autenticación con Cognito
- [ ] WebSocket connection
- [ ] Chat 1-a-1
- [ ] Chats grupales
- [ ] Estados de mensaje
- [ ] Reacciones
- [ ] Notificaciones
- [ ] Testing
- [ ] Deploy a producción

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Patricio Fredes**

---

<div align="center">
  <p>Hecho con ❤️ y ☕</p>
</div>