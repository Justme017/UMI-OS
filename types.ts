export type View = 'workspace' | 'settings';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatarInitials: string;
}

export interface MemoryItem {
  id: string;
  type: 'audio' | 'note' | 'task' | 'idea' | 'link' | 'email';
  title: string;
  timestamp: string;
  description: string;
  tags?: string[];
  progress?: number;
  completed?: boolean;
}