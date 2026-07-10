const fs = require('fs');
let content = fs.readFileSync('src/components/TopBar.tsx', 'utf8');
const original = `      <div className="flex items-center gap-4">
        {/* Mobile Logo */}
        <button 
          onClick={onMenuClick}
          className="flex md:hidden items-center gap-2 text-white font-bold tracking-tighter text-lg hover:opacity-80 transition-opacity"
        >
          <SunooLogo className="w-6 h-6" />
          SUNOO
        </button>

        {/* We can hide these or keep them for functionality, the design doesn't show them but they are useful */}
        <button 
          onClick={onBack}
          disabled={!canGoBack}
          className={\`w-8 h-8 rounded-full bg-[#111] items-center justify-center transition-colors \${canGoBack ? 'flex' : 'hidden md:flex'} \${canGoBack ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}\`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button 
          onClick={onForward}
          disabled={!canGoForward}
          className={\`w-8 h-8 rounded-full bg-[#111] items-center justify-center transition-colors hidden md:flex \${canGoForward ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}\`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>`;

const newStr = `      <div className="flex items-center gap-4">
        {/* We can hide these or keep them for functionality, the design doesn't show them but they are useful */}
        <button 
          onClick={onBack}
          disabled={!canGoBack}
          className={\`w-8 h-8 rounded-full bg-[#111] items-center justify-center transition-colors \${canGoBack ? 'flex' : 'hidden md:flex'} \${canGoBack ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}\`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Mobile Logo */}
        <button 
          onClick={onMenuClick}
          className="flex md:hidden items-center gap-2 text-white font-bold tracking-tighter text-lg hover:opacity-80 transition-opacity"
        >
          <SunooLogo className="w-6 h-6" />
          SUNOO
        </button>

        <button 
          onClick={onForward}
          disabled={!canGoForward}
          className={\`w-8 h-8 rounded-full bg-[#111] items-center justify-center transition-colors hidden md:flex \${canGoForward ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}\`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>`;

content = content.replace(original, newStr);
fs.writeFileSync('src/components/TopBar.tsx', content);
