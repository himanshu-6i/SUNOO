const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCode1 = `      audioRef.current.src = nextTrack.audioUrl;
      const playPromise = audioRef.current.play();`;
const newCode1 = `      audioRef.current.src = nextTrack.audioUrl;
      audioRef.current.load();
      const playPromise = audioRef.current.play();`;

content = content.replace(oldCode1, newCode1);

const oldCode2 = `      audioRef.current.src = prevTrack.audioUrl;
      const playPromise = audioRef.current.play();`;
const newCode2 = `      audioRef.current.src = prevTrack.audioUrl;
      audioRef.current.load();
      const playPromise = audioRef.current.play();`;

content = content.replace(oldCode2, newCode2);

fs.writeFileSync('src/App.tsx', content);
