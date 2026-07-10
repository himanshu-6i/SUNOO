const fs = require('fs');

let content = fs.readFileSync('src/components/Player.tsx', 'utf8');

const importRegex = /import { (.*?) } from 'lucide-react';/;
content = content.replace(importRegex, (match, p1) => {
  if (!p1.includes('ChevronDown')) {
    return `import { ${p1}, ChevronDown } from 'lucide-react';`;
  }
  return match;
});

fs.writeFileSync('src/components/Player.tsx', content);
