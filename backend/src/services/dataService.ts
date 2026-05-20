// backend/src/services/dataService.ts
// In-memory data store. For production this should be replaced with
// PostgreSQL/DynamoDB but for portfolio/demo purposes this is sufficient.

import type { User, Conversation, Message } from '../models/types';

class DataService {
  private users = new Map<string, User>();
  private usersByEmail = new Map<string, string>();
  private conversations = new Map<string, Conversation>();
  private messages = new Map<string, Message[]>(); // conversationId -> messages[]

  // ── Users ────────────────────────────────────────────────────────────────
  createUser(user: User): User {
    this.users.set(user.userId, user);
    this.usersByEmail.set(user.email.toLowerCase(), user.userId);
    return user;
  }

  getUserById(userId: string): User | null {
    return this.users.get(userId) ?? null;
  }

  getUserByEmail(email: string): User | null {
    const id = this.usersByEmail.get(email.toLowerCase());
    return id ? this.users.get(id) ?? null : null;
  }

  searchUsers(query: string, excludeUserId?: string): User[] {
    const q = query.toLowerCase();
    return Array.from(this.users.values())
      .filter((u) => u.userId !== excludeUserId)
      .filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }

  updateUserStatus(userId: string, status: 'online' | 'offline'): void {
    const user = this.users.get(userId);
    if (user) {
      user.status = status;
      user.lastSeen = Date.now();
    }
  }

  // ── Conversations ────────────────────────────────────────────────────────
  createConversation(conversation: Conversation): Conversation {
    this.conversations.set(conversation.conversationId, conversation);
    this.messages.set(conversation.conversationId, []);
    return conversation;
  }

  getConversation(conversationId: string): Conversation | null {
    return this.conversations.get(conversationId) ?? null;
  }

  getUserConversations(userId: string): Conversation[] {
    return Array.from(this.conversations.values())
      .filter((c) => c.participants.includes(userId))
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }

  findIndividualConversation(userA: string, userB: string): Conversation | null {
    return (
      Array.from(this.conversations.values()).find(
        (c) =>
          c.type === 'individual' &&
          c.participants.length === 2 &&
          c.participants.includes(userA) &&
          c.participants.includes(userB)
      ) ?? null
    );
  }

  // ── Messages ─────────────────────────────────────────────────────────────
  addMessage(message: Message): void {
    const list = this.messages.get(message.conversationId) ?? [];
    list.push(message);
    this.messages.set(message.conversationId, list);

    // Update conversation lastMessage
    const conv = this.conversations.get(message.conversationId);
    if (conv) {
      conv.lastMessageAt = message.timestamp;
      conv.lastMessage = {
        text: message.text,
        senderId: message.senderId,
        timestamp: message.timestamp,
      };
    }
  }

  getMessages(conversationId: string): Message[] {
    return this.messages.get(conversationId) ?? [];
  }

  getMessage(messageId: string, conversationId: string): Message | null {
    const list = this.messages.get(conversationId) ?? [];
    return list.find((m) => m.messageId === messageId) ?? null;
  }

  updateMessageStatus(
    messageId: string,
    conversationId: string,
    status: Message['status']
  ): void {
    const list = this.messages.get(conversationId);
    if (!list) return;
    const msg = list.find((m) => m.messageId === messageId);
    if (msg) msg.status = status;
  }

  updateMessageReactions(
    messageId: string,
    conversationId: string,
    reactions: Record<string, string[]>
  ): void {
    const list = this.messages.get(conversationId);
    if (!list) return;
    const msg = list.find((m) => m.messageId === messageId);
    if (msg) msg.reactions = reactions;
  }
}

export const dataService = new DataService();
