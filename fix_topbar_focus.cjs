const fs = require('fs');

let topBarContent = fs.readFileSync('src/components/TopBar.tsx', 'utf8');

if (!topBarContent.includes('const searchInputRef = useRef<HTMLInputElement>(null);')) {
  topBarContent = topBarContent.replace(
    /const profileRef = useRef<HTMLDivElement>\(null\);/,
    'const profileRef = useRef<HTMLDivElement>(null);\n  const searchInputRef = useRef<HTMLInputElement>(null);\n\n  useEffect(() => {\n    if (currentView === \'search\' && searchInputRef.current) {\n      searchInputRef.current.focus();\n    }\n  }, [currentView]);'
  );

  topBarContent = topBarContent.replace(
    /<input\s+type="text"/,
    '<input\n             ref={searchInputRef}\n             type="text"'
  );
  
  fs.writeFileSync('src/components/TopBar.tsx', topBarContent);
}
