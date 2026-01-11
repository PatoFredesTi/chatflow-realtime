import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import authRoutes from './routes/authRoutes';
import conversationRoutes from './routes/conversationRoutes';
import { dataService } from './services/dataService';
import type { Message } from './models/types';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Rutas REST
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Socket.io - Conexiones en tiempo real
const connectedUsers = new Map<string, string>(); // socketId -> userId

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Autenticar usuario
  socket.on('authenticate', (userId: string) => {
    connectedUsers.set(socket.id, userId);
    dataService.updateUserStatus(userId, 'online');
    
    console.log(`Usuario ${userId} autenticado`);

    // Notificar a otros usuarios que este usuario está online
    socket.broadcast.emit('user:status', {
      userId,
      status: 'online',
    });
  });

  // Unirse a conversaciones
  socket.on('join:conversation', (conversationId: string) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} se unió a conversación ${conversationId}`);
  });

  // Enviar mensaje
socket.on('message:send', (data: { 
  conversationId: string; 
  text: string; 
  senderId: string;
  tempId?: string; // Agregar tempId como opcional
}) => {
  const { conversationId, text, senderId, tempId } = data;

  // Crear mensaje
  const message: Message = {
    messageId: uuidv4(),
    conversationId,
    senderId,
    text,
    timestamp: Date.now(),
    status: 'sent',
  };

  // Guardar en "base de datos"
  dataService.addMessage(message);

  // Enviar mensaje a todos en la conversación
  io.to(conversationId).emit('message:new', message);

  // Confirmar al emisor (solo si hay tempId)
  if (tempId) {
    socket.emit('message:sent', { 
      tempId,
      message 
    });
  }

  console.log(`Mensaje enviado en conversación ${conversationId}`);
});

  // Usuario está escribiendo
  socket.on('typing:start', (data: { conversationId: string; userId: string; username: string }) => {
    socket.to(data.conversationId).emit('typing:start', {
      userId: data.userId,
      username: data.username,
    });
  });

  // Usuario dejó de escribir
  socket.on('typing:stop', (data: { conversationId: string; userId: string }) => {
    socket.to(data.conversationId).emit('typing:stop', {
      userId: data.userId,
    });
  });

  // Marcar mensaje como leído
  socket.on('message:read', (data: { messageId: string; conversationId: string }) => {
    const { messageId, conversationId } = data;
    
    dataService.updateMessageStatus(messageId, conversationId, 'read');
    
    io.to(conversationId).emit('message:status', {
      messageId,
      status: 'read',
    });
  });

  // Desconexión
  socket.on('disconnect', () => {
    const userId = connectedUsers.get(socket.id);
    
    if (userId) {
      dataService.updateUserStatus(userId, 'offline');
      connectedUsers.delete(socket.id);
      
      // Notificar a otros usuarios
      socket.broadcast.emit('user:status', {
        userId,
        status: 'offline',
      });
      
      console.log(`Usuario ${userId} desconectado`);
    }
    
    console.log('Usuario desconectado:', socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Socket.io listo para conexiones`);
});