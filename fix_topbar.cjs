const fs = require('fs');

// 1. App.tsx - pass currentView to TopBar
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /<TopBar\s+searchQuery=\{searchQuery\}/,
  '<TopBar\n          currentView={currentView}\n          searchQuery={searchQuery}'
);
fs.writeFileSync('src/App.tsx', appContent);

// 2. TopBar.tsx - receive currentView and show search bar on mobile if currentView === 'search'
let topBarContent = fs.readFileSync('src/components/TopBar.tsx', 'utf8');

topBarContent = topBarContent.replace(
  /interface TopBarProps \{/,
  'interface TopBarProps {\n  currentView?: string;'
);

topBarContent = topBarContent.replace(
  /export function TopBar\(\{ searchQuery,/,
  'export function TopBar({ currentView, searchQuery,'
);

topBarContent = topBarContent.replace(
  /<div className="relative group w-full mr-4 hidden sm:block">/,
  '<div className={`relative group w-full mr-4 ${currentView === \'search\' ? \'block\' : \'hidden sm:block\'}`}>'
);

fs.writeFileSync('src/components/TopBar.tsx', topBarContent);

// 3. SearchView.tsx - hide the search bar on mobile since it's now in TopBar
let searchViewContent = fs.readFileSync('src/components/SearchView.tsx', 'utf8');
searchViewContent = searchViewContent.replace(
  /<div className="sm:hidden relative w-full mb-6 mt-2">[\s\S]*?<\/div>/,
  ''
);
fs.writeFileSync('src/components/SearchView.tsx', searchViewContent);
