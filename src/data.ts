import { Track, Playlist, User, Notification } from './types';

export const currentUser: User = {
  id: 'u1',
  name: 'Alex Chen',
  email: 'alex@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  role: 'artist',
  isPremium: true,
};

export const initialNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'New Release',
    message: 'Synthwave Specter just dropped a new track!',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    title: 'Playlist Updated',
    message: 'Your Morning Energy Flow playlist was updated.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 'n3',
    title: 'Creator Milestone',
    message: 'Your track "Midnight Drive" reached 1M streams!',
    time: '3 days ago',
    read: true,
  }
];

export const trendingTracks: Track[] = [
  {
    id: 't1',
    title: 'Neon Nights',
    artist: 'Synthwave Specter',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
    duration: '6:12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Electronic',
    plays: 1250300
  },
  {
    id: 't2',
    title: 'Midnight Drive',
    artist: 'Luna Eclipse',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5281b?auto=format&fit=crop&w=300&q=80',
    duration: '7:01',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Pop',
    plays: 890400
  },
  {
    id: 't3',
    title: 'Echoes of You',
    artist: 'The Wanderers',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
    duration: '5:44',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Indie',
    plays: 450100
  },
  {
    id: 't4',
    title: 'Quantum Lullaby',
    artist: 'AI Genesis',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80',
    duration: '5:02',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Ambient',
    plays: 2100000
  },
  {
    id: 't5',
    title: 'Urban Jungle',
    artist: 'Metro Flow',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
    duration: '6:12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Hip Hop',
    plays: 1805000
  }
];

export const aiPlaylists: Playlist[] = [
  {
    id: 'p1',
    title: 'Deep Focus (AI Curated)',
    creator: 'SUNOO AI',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80',
    tracks: [trendingTracks[3], trendingTracks[0]]
  },
  {
    id: 'p2',
    title: 'Morning Energy Flow',
    creator: 'SUNOO AI',
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80',
    tracks: [trendingTracks[1], trendingTracks[4], trendingTracks[2]]
  }
];
