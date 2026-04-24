import { Router, Request, Response } from 'express';
import { dataService } from '../services/dataService';

const router = Router();

// Obtener conversaciones del usuario
router.get('/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  const conversations = dataService.getUserConversations(userId);

  res.json({
    success: true,
    conversations,
  });
});

// Obtener mensajes de una conversación (con paginación opcional)
router.get('/:conversationId/messages', (req: Request, res: Response) => {
  const conversationId = req.params.conversationId as string;
  const before = req.query.before ? Number(req.query.before) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 20;

  const { messages, hasMore } = dataService.getMessagesPaginated(conversationId, before, limit);

  res.json({ success: true, messages, hasMore });
});

// Crear nueva conversación
router.post('/', (req: Request, res: Response) => {
  const { participants, type } = req.body;

  if (!participants || participants.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Se requieren al menos 2 participantes',
    });
  }

  const conversation = dataService.createConversation(participants, type);

  res.status(201).json({
    success: true,
    conversation,
  });
});

export default router;