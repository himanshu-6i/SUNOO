const fs = require('fs');

let topBarContent = fs.readFileSync('src/components/TopBar.tsx', 'utf8');

topBarContent = topBarContent.replace(
  /<div className="lg:hidden flex items-center">/g,
  '<div className={`lg:hidden flex items-center ${currentView === \'search\' ? \'hidden sm:flex\' : \'\'}`}>'
);

fs.writeFileSync('src/components/TopBar.tsx', topBarContent);
