// backend/src/index.ts
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
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

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'ChatFlow server running' });
});

// ── Nudge cooldown ──────────────────────────────────────────────────────────
const nudgeCooldowns = new Map<string, number>();
const NUDGE_COOLDOWN_MS = 10_000;

interface NudgeSendPayload {
  conversationId: string;
  senderId: string;
  senderName: string;
  timestamp: number;
}

// ── Socket.io ───────────────────────────────────────────────────────────────
const connectedUsers = new Map<string, string>(); // socketId -> userId

io.on('connection', (socket: Socket) => {
  console.log('🔌 Socket conectado:', socket.id);

  // ── Authenticate ──────────────────────────────────────────────────────
  socket.on('authenticate', (userId: string) => {
    connectedUsers.set(socket.id, userId);
    dataService.updateUserStatus(userId, 'online');
    console.log(`✅ Usuario ${userId} autenticado en socket ${socket.id}`);
    socket.broadcast.emit('user:status', { userId, status: 'online' });
  });

  // ── Join conversation room ────────────────────────────────────────────
  socket.on('join:conversation', (conversationId: string) => {
    socket.join(conversationId);
    console.log(`📥 Socket ${socket.id} se unió a ${conversationId}`);
  });

  // ── Send message ──────────────────────────────────────────────────────
  socket.on(
    'message:send',
    (data: {
      conversationId: string;
      text: string;
      senderId: string;
      tempId?: string;
    }) => {
      const { conversationId, text, senderId, tempId } = data;

      const message: Message = {
        messageId: uuidv4(),
        conversationId,
        senderId,
        text,
        timestamp: Date.now(),
        status: 'sent',
      };

      dataService.addMessage(message);
      io.to(conversationId).emit('message:new', message);

      if (tempId) {
        socket.emit('message:sent', { tempId, message });
      }

      // RF-010: simulate "delivered" after 400ms
      setTimeout(() => {
        dataService.updateMessageStatus(message.messageId, conversationId, 'delivered');
        io.to(conversationId).emit('message:status', {
          messageId: message.messageId,
          status: 'delivered',
        });
      }, 400);

      console.log(`💬 Mensaje enviado en ${conversationId}`);
    }
  );

  // ── Typing indicators ─────────────────────────────────────────────────
  socket.on(
    'typing:start',
    (data: { conversationId: string; userId: string; username: string }) => {
      socket.to(data.conversationId).emit('typing:start', {
        userId: data.userId,
        username: data.username,
      });
    }
  );

  socket.on('typing:stop', (data: { conversationId: string; userId: string }) => {
    socket.to(data.conversationId).emit('typing:stop', { userId: data.userId });
  });

  // ── RF-010: Mark as read ──────────────────────────────────────────────
  socket.on('message:read', (data: { messageId: string; conversationId: string }) => {
    const { messageId, conversationId } = data;
    dataService.updateMessageStatus(messageId, conversationId, 'read');
    io.to(conversationId).emit('message:status', { messageId, status: 'read' });
  });

  // ── RF-011: Reactions ─────────────────────────────────────────────────
  socket.on(
    'reaction:toggle',
    (data: {
      messageId: string;
      conversationId: string;
      emoji: string;
      userId: string;
    }) => {
      const { messageId, conversationId, emoji, userId } = data;
      if (!messageId || !conversationId || !emoji || !userId) return;

      const message = dataService.getMessage(messageId, conversationId);
      if (!message) return;

      const reactions: Record<string, string[]> = { ...(message.reactions ?? {}) };
      const current = reactions[emoji] ?? [];

      reactions[emoji] = current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId];

      // Clean empty emoji entries
      Object.keys(reactions).forEach((k) => {
        if (reactions[k].length === 0) delete reactions[k];
      });

      dataService.updateMessageReactions(messageId, conversationId, reactions);
      io.to(conversationId).emit('reaction:updated', {
        messageId,
        conversationId,
        reactions,
      });

      console.log(`👍 ${userId} toggleó ${emoji} en ${messageId}`);
    }
  );

  // ── 📳 Nudge ──────────────────────────────────────────────────────────
  socket.on('nudge:send', (payload: NudgeSendPayload) => {
    const { conversationId, senderId, senderName, timestamp } = payload;
    if (!conversationId || !senderId) return;

    const cooldownKey = `${senderId}:${conversationId}`;
    const lastSent = nudgeCooldowns.get(cooldownKey) ?? 0;

    if (Date.now() - lastSent < NUDGE_COOLDOWN_MS) {
      const remaining = Math.ceil((NUDGE_COOLDOWN_MS - (Date.now() - lastSent)) / 1000);
      socket.emit('nudge:cooldown', { remaining });
      return;
    }

    nudgeCooldowns.set(cooldownKey, Date.now());
    socket.to(conversationId).emit('nudge:received', {
      conversationId,
      senderId,
      senderName,
      timestamp,
    });

    console.log(`📳 ${senderName} zumbó ${conversationId}`);
  });

  // ── Disconnect ────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      dataService.updateUserStatus(userId, 'offline');
      connectedUsers.delete(socket.id);
      socket.broadcast.emit('user:status', { userId, status: 'offline' });
      console.log(`👋 Usuario ${userId} desconectado`);
    }
  });
});

// ── Start server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 ChatFlow Backend running on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
  console.log(`📳 Nudge system active (cooldown: ${NUDGE_COOLDOWN_MS / 1000}s)`);
  console.log(`💬 RF-009 (pagination) RF-010 (status) RF-011 (reactions) ✓`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});
