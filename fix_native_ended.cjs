const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const nativeEndedRegex = /  useEffect\(\(\) => \{\n    const audio = audioRef\.current;\n    if \(\!audio\) return;\n    \n    const handleNativeEnded = \(\) => \{\n      if \(playNextRef\.current\) \{\n        playNextRef\.current\(\);\n      \}\n    \};\n    \n    audio\.addEventListener\('ended', handleNativeEnded\);\n    return \(\) => audio\.removeEventListener\('ended', handleNativeEnded\);\n  \}, \[\]\);\n/g;

content = content.replace(nativeEndedRegex, '');

fs.writeFileSync('src/App.tsx', content);
