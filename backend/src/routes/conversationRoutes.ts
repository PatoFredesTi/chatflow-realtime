// backend/src/routes/conversationRoutes.ts
import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dataService } from '../services/dataService';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import type { Conversation } from '../models/types';

const router = Router();

// ── GET /api/conversations ─────────────────────────────────────────────────
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const conversations = dataService.getUserConversations(req.userId!);

  // Enrich with participant info for individual chats
  const enriched = conversations.map((c) => {
    if (c.type === 'individual') {
      const otherId = c.participants.find((p) => p !== req.userId);
      const otherUser = otherId ? dataService.getUserById(otherId) : null;
      return {
        ...c,
        displayName: otherUser?.username ?? 'Usuario',
        otherUserId: otherId,
        isOnline: otherUser?.status === 'online',
      };
    }
    return { ...c, displayName: c.name ?? 'Grupo', isOnline: false };
  });

  res.json({ success: true, conversations: enriched });
});

// ── POST /api/conversations ────────────────────────────────────────────────
router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const { participantIds, type, name } = req.body as {
    participantIds: string[];
    type: 'individual' | 'group';
    name?: string;
  };

  if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: 'participantIds es requerido' });
  }

  const allParticipants = Array.from(new Set([req.userId!, ...participantIds]));

  // For individual chats, return existing if found
  if (type === 'individual' && allParticipants.length === 2) {
    const existing = dataService.findIndividualConversation(
      allParticipants[0],
      allParticipants[1]
    );
    if (existing) {
      return res.json({ success: true, conversation: existing });
    }
  }

  const conversation: Conversation = {
    conversationId: uuidv4(),
    type: type || (allParticipants.length > 2 ? 'group' : 'individual'),
    name: type === 'group' ? name : undefined,
    participants: allParticipants,
    createdAt: Date.now(),
    lastMessageAt: Date.now(),
  };

  dataService.createConversation(conversation);
  res.json({ success: true, conversation });
});

// ── GET /api/conversations/:id/messages?limit=20&before=<timestamp> ────────
// RF-009: paginated messages
router.get('/:conversationId/messages', authMiddleware, (req: AuthRequest, res: Response) => {
  const { conversationId } = req.params;
  const limit = parseInt((req.query.limit as string) ?? '20');
  const before = req.query.before ? parseInt(req.query.before as string) : undefined;

  const conv = dataService.getConversation(conversationId);
  if (!conv) {
    return res.status(404).json({ success: false, error: 'Conversación no encontrada' });
  }
  if (!conv.participants.includes(req.userId!)) {
    return res.status(403).json({ success: false, error: 'No autorizado' });
  }

  let messages = dataService.getMessages(conversationId);

  if (before !== undefined) {
    messages = messages.filter((m) => m.timestamp < before);
  }

  // Most recent first → take page → return chronological
  messages = messages
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
    .reverse();

  res.json({ success: true, messages, hasMore: messages.length >= limit });
});

export default router;
