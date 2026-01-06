export interface User {
  userId: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: number;
  lastSeen: number;
  status: 'online' | 'offline';
}

export interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
}