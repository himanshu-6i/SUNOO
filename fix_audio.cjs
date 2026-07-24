const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove nativeEnded useEffect and playNextRef/playPrevRef
const nativeEndedRegex = /  const playNextRef = useRef\(playNext\);\n  const playPrevRef = useRef\(playPrev\);\n  useEffect\(\(\) => \{\n    playNextRef\.current = playNext;\n    playPrevRef\.current = playPrev;\n  \}\);\n\n  useEffect\(\(\) => \{\n    const audio = audioRef\.current;\n    if \(\!audio\) return;\n    \n    const handleNativeEnded = \(\) => \{\n      if \(playNextRef\.current\) \{\n        playNextRef\.current\(\);\n      \}\n    \};\n    \n    audio\.addEventListener\('ended', handleNativeEnded\);\n    return \(\) => audio\.removeEventListener\('ended', handleNativeEnded\);\n  \}, \[\]\);\n/g;

content = content.replace(nativeEndedRegex, '');

// 2. Add back onEnded={handleEnded} to audio tag
content = content.replace(/<audio\s+ref=\{audioRef\}\s+onTimeUpdate=\{handleTimeUpdate\}\s+onLoadedMetadata=\{handleTimeUpdate\}/g, '<audio\n        ref={audioRef}\n        onTimeUpdate={handleTimeUpdate}\n        onLoadedMetadata={handleTimeUpdate}\n        onEnded={handleEnded}');

// 3. Remove .load() calls
content = content.replace(/audioRef\.current\.load\(\);\n/g, '');

fs.writeFileSync('src/App.tsx', content);
