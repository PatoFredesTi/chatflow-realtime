import { User, Conversation, Message } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// Simulación de base de datos en memoria
class DataService {
  private users: Map<string, User> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private userConversations: Map<string, string[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const user1: User = {
      userId: 'user1',
      email: 'juan@example.com',
      username: 'Juan Pérez',
      password: '12345678',
      createdAt: Date.now(),
      lastSeen: Date.now(),
      status: 'online',
    };

    const user2: User = {
      userId: 'user2',
      email: 'maria@example.com',
      username: 'María García',
      password: '12345678',
      createdAt: Date.now(),
      lastSeen: Date.now(),
      status: 'online',
    };

    this.users.set(user1.userId, user1);
    this.users.set(user2.userId, user2);

    const conv1: Conversation = {
      conversationId: 'conv1',
      type: 'individual',
      participants: ['user1', 'user2'],
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      lastMessageAt: Date.now() - 1000 * 60 * 5,
      lastMessage: {
        text: 'Hola, ¿cómo estás?',
        senderId: 'user2',
        timestamp: Date.now() - 1000 * 60 * 5,
      },
    };

    this.conversations.set(conv1.conversationId, conv1);
    this.userConversations.set('user1', ['conv1']);
    this.userConversations.set('user2', ['conv1']);

    const messages: Message[] = [
      {
        messageId: 'msg1',
        conversationId: 'conv1',
        senderId: 'user2',
        text: 'Hola, ¿cómo estás?',
        timestamp: Date.now() - 1000 * 60 * 10,
        status: 'read',
      },
      {
        messageId: 'msg2',
        conversationId: 'conv1',
        senderId: 'user1',
        text: '¡Muy bien! ¿Y tú?',
        timestamp: Date.now() - 1000 * 60 * 9,
        status: 'read',
      },
      {
        messageId: 'msg3',
        conversationId: 'conv1',
        senderId: 'user2',
        text: 'Genial, trabajando en un proyecto',
        timestamp: Date.now() - 1000 * 60 * 8,
        status: 'read',
      },
    ];

    this.messages.set('conv1', messages);
  }

  // ── Usuarios ──────────────────────────────────────────────────────────────

  findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  findUserById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  createUser(email: string, username: string, password: string): User {
    const user: User = {
      userId: uuidv4(),
      email,
      username,
      password,
      createdAt: Date.now(),
      lastSeen: Date.now(),
      status: 'online',
    };
    this.users.set(user.userId, user);
    this.userConversations.set(user.userId, []);
    return user;
  }

  updateUserStatus(userId: string, status: 'online' | 'offline') {
    const user = this.users.get(userId);
    if (user) {
      user.status = status;
      user.lastSeen = Date.now();
    }
  }

  // ── Conversaciones ────────────────────────────────────────────────────────

  getUserConversations(userId: string): Conversation[] {
    const convIds = this.userConversations.get(userId) || [];
    return convIds
      .map((id) => this.conversations.get(id))
      .filter((conv): conv is Conversation => conv !== undefined);
  }

  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId);
  }

  createConversation(
    participants: string[],
    type: 'individual' | 'group' = 'individual'
  ): Conversation {
    const conversation: Conversation = {
      conversationId: uuidv4(),
      type,
      participants,
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
    };

    this.conversations.set(conversation.conversationId, conversation);

    participants.forEach((userId) => {
      const userConvs = this.userConversations.get(userId) || [];
      userConvs.push(conversation.conversationId);
      this.userConversations.set(userId, userConvs);
    });

    this.messages.set(conversation.conversationId, []);
    return conversation;
  }

  // ── Mensajes ──────────────────────────────────────────────────────────────

  getMessages(conversationId: string): Message[] {
    return this.messages.get(conversationId) || [];
  }

  getMessagesPaginated(
    conversationId: string,
    before?: number,
    limit: number = 20
  ): { messages: Message[]; hasMore: boolean } {
    const all = this.messages.get(conversationId) || [];
    const filtered = before ? all.filter((m) => m.timestamp < before) : all;
    const start = Math.max(0, filtered.length - limit);
    return {
      messages: filtered.slice(start),
      hasMore: start > 0,
    };
  }

  // Obtener un mensaje específico por ID dentro de una conversación
  getMessage(messageId: string, conversationId: string): Message | undefined {
    const messages = this.messages.get(conversationId);
    if (!messages) return undefined;
    return messages.find((m) => m.messageId === messageId);
  }

  addMessage(message: Message): Message {
    const messages = this.messages.get(message.conversationId) || [];
    messages.push(message);
    this.messages.set(message.conversationId, messages);

    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      conversation.lastMessage = {
        text: message.text,
        senderId: message.senderId,
        timestamp: message.timestamp,
      };
      conversation.lastMessageAt = message.timestamp;
    }

    return message;
  }

  updateMessageStatus(
    messageId: string,
    conversationId: string,
    status: Message['status']
  ) {
    const messages = this.messages.get(conversationId);
    if (messages) {
      const message = messages.find((m) => m.messageId === messageId);
      if (message) {
        message.status = status;
      }
    }
  }

  // Reemplaza el mensaje completo en el array (usado para actualizar reactions)
  updateMessage(updatedMessage: Message): void {
    const messages = this.messages.get(updatedMessage.conversationId);
    if (!messages) return;

    const index = messages.findIndex(
      (m) => m.messageId === updatedMessage.messageId
    );
    if (index !== -1) {
      messages[index] = updatedMessage;
    }
  }
}

export const dataService = new DataService();