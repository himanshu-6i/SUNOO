const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace('onEnded={handleEnded}', '');

fs.writeFileSync('src/App.tsx', content);
