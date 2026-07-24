const fs = require('fs');
let content = fs.readFileSync('src/components/SearchView.tsx', 'utf8');

content = content.replace(
  /<input\s+type="text"/g,
  '<input\n          autoFocus\n          type="text"'
);

fs.writeFileSync('src/components/SearchView.tsx', content);
