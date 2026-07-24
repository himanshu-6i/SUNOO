const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCode = `    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    
    const nextTrack = queue[nextIndex];
    if (nextTrack && audioRef.current) {
      audioRef.current.src = nextTrack.audioUrl;`;

const newCode = `    let nextIndex = currentIndex;
    let nextTrack;
    let attempts = 0;
    do {
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else {
        nextIndex = (nextIndex + 1) % queue.length;
      }
      nextTrack = queue[nextIndex];
      attempts++;
    } while (!nextTrack?.audioUrl && attempts < queue.length);
    
    if (nextTrack && nextTrack.audioUrl && audioRef.current) {
      audioRef.current.src = nextTrack.audioUrl;`;

content = content.replace(oldCode, newCode);

const oldPrevCode = `    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    }
    
    const prevTrack = queue[prevIndex];
    if (prevTrack && audioRef.current) {
      audioRef.current.src = prevTrack.audioUrl;`;

const newPrevCode = `    let prevIndex = currentIndex;
    let prevTrack;
    let attempts = 0;
    do {
      if (isShuffle) {
        prevIndex = Math.floor(Math.random() * queue.length);
      } else {
        prevIndex = (prevIndex - 1 + queue.length) % queue.length;
      }
      prevTrack = queue[prevIndex];
      attempts++;
    } while (!prevTrack?.audioUrl && attempts < queue.length);
    
    if (prevTrack && prevTrack.audioUrl && audioRef.current) {
      audioRef.current.src = prevTrack.audioUrl;`;

content = content.replace(oldPrevCode, newPrevCode);

fs.writeFileSync('src/App.tsx', content);
