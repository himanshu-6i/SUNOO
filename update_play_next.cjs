const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldPlayNext = `    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };`;

const newPlayNext = `    setCurrentIndex(nextIndex);
    setIsPlaying(true);
    stateRef.current.currentIndex = nextIndex;
  };`;

content = content.replace(oldPlayNext, newPlayNext);

const oldPlayPrev = `    setCurrentIndex(prevIndex);
    setIsPlaying(true);
  };`;

const newPlayPrev = `    setCurrentIndex(prevIndex);
    setIsPlaying(true);
    stateRef.current.currentIndex = prevIndex;
  };`;

content = content.replace(oldPlayPrev, newPlayPrev);

fs.writeFileSync('src/App.tsx', content);
