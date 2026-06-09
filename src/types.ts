export type Role = 'user' | 'artist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  isPremium: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
  audioUrl?: string;
  genre: string;
  plays: number;
  ownerId?: string;
  visibility?: 'public' | 'private';
  createdAt?: number;
}

export interface Playlist {
  id: string;
  title: string;
  creator: string;
  coverUrl: string;
  tracks: Track[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export type ViewState = 'home' | 'search' | 'library' | 'creator' | 'premium' | 'profile' | 'settings';
