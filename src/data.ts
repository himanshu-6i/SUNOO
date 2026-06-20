import { Track, Playlist, User, Notification, Artist } from './types';

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
    title: 'Echoes of Tomorrow',
    artist: 'AI Genesis',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
    duration: '3:24',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/131011_02_J_S_Bach_The_Well_Tempered_Clavier_Book_1_Prelude_and_Fugue_1_in_C_Major_BWV_846.ogg',
    genre: 'Electronic',
    plays: 2100000
  },
  {
    id: 't2',
    title: 'Midnight Drive',
    artist: 'Luna Eclipse',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5281b?auto=format&fit=crop&w=300&q=80',
    duration: '3:12',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/J_S_Bach_The_Well_Tempered_Clavier_Book_1_No_2_Prelude_in_C_Minor_BWV_847.ogg',
    genre: 'Pop',
    plays: 1800000
  },
  {
    id: 't3',
    title: 'Digital Dreams',
    artist: 'The Wanderers',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
    duration: '3:45',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/J._S._Bach%2C_WTC_Book_1%2C_Fugue_2_in_C_Minor%2C_BWV_847.ogg',
    genre: 'Electronic',
    plays: 1500000
  },
  {
    id: 't4',
    title: 'Neon Nights',
    artist: 'Synthwave Specter',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
    duration: '3:28',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/J._S._Bach%2C_WTC_Book_1%2C_Prelude_3_in_C-Sharp_Major%2C_BWV_848.ogg',
    genre: 'Pop',
    plays: 1200000
  },
  {
    id: 't5',
    title: 'Lost in Algorithms',
    artist: 'AI Genesis',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5281b?auto=format&fit=crop&w=300&q=80',
    duration: '3:36',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/J._S._Bach%2C_WTC_Book_1%2C_Fugue_3_in_C-Sharp_Major%2C_BWV_848.ogg',
    genre: 'Pop',
    plays: 980000
  }
];

export const popularArtists: Artist[] = [
  { id: 'a1', name: 'AI Genesis', imageUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=300&q=80' },
  { id: 'a2', name: 'The Wanderers', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80' },
  { id: 'a3', name: 'Luna Eclipse', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5281b?auto=format&fit=crop&w=300&q=80' },
  { id: 'a4', name: 'Synthwave Specter', imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80' },
  { id: 'a5', name: 'Metro Flow', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80' },
  { id: 'a6', name: 'Digital Karma', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80' }
];

export const aiPlaylists: Playlist[] = [
  {
    id: 'p1',
    title: 'Deep Focus',
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
  },
  {
    id: 'p3',
    title: 'Chill AI Vibes',
    creator: 'SUNOO AI',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    tracks: [trendingTracks[2], trendingTracks[3]]
  },
  {
    id: 'p4',
    title: 'Late Night Thoughts',
    creator: 'SUNOO AI',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80',
    tracks: [trendingTracks[4], trendingTracks[0]]
  }
];
