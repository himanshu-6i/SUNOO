const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

const newTracks = `
  {
    id: 't_hindi1',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    coverUrl: 'https://images.unsplash.com/photo-1533174000224-6aa5220070b4?auto=format&fit=crop&w=300&q=80',
    duration: '4:22',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Hindi',
    plays: 15400000
  },
  {
    id: 't_hindi2',
    title: 'Chaiyya Chaiyya',
    artist: 'A.R. Rahman',
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80',
    duration: '6:54',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Hindi',
    plays: 8400000
  },
  {
    id: 't_new1',
    title: 'Starboy',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
    duration: '3:50',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'New Releases',
    plays: 99400000
  },
`;

data = data.replace('export const trendingTracks: Track[] = [', 'export const trendingTracks: Track[] = [' + newTracks);
fs.writeFileSync('src/data.ts', data);
