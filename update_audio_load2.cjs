const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCode = `        audioRef.current.src = track.audioUrl;
        loadedTrackIdRef.current = track.id;
      }`;
const newCode = `        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
        loadedTrackIdRef.current = track.id;
      }`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/App.tsx', content);
