const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const playNextRef = `  const playNextRef = useRef(playNext);
  const playPrevRef = useRef(playPrev);
  useEffect(() => {
    playNextRef.current = playNext;
    playPrevRef.current = playPrev;
  });`;

const nativeEnded = `
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleNativeEnded = () => {
      if (playNextRef.current) {
        playNextRef.current();
      }
    };
    
    audio.addEventListener('ended', handleNativeEnded);
    return () => audio.removeEventListener('ended', handleNativeEnded);
  }, []);
`;

if (content.includes('playNextRef.current = playNext;')) {
  content = content.replace(playNextRef, playNextRef + nativeEnded);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Added native ended event listener');
} else {
  console.log('playNextRef not found');
}
