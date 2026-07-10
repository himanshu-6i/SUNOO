const fs = require('fs');

let content = fs.readFileSync('src/components/Player.tsx', 'utf8');

const hookRegex = /const \[isMuted, setIsMuted\] = useState\(false\);/;
if (!content.includes('const [isExpanded, setIsExpanded] = useState(false);')) {
  content = content.replace(hookRegex, `const [isMuted, setIsMuted] = useState(false);\n  const [isExpanded, setIsExpanded] = useState(false);`);
}

const returnRegex = /return \([\s\S]*?\);\n}/;

const newReturn = `return (
    <>
      {/* Mobile Full Screen Player */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-b from-zinc-900 to-black flex flex-col px-6 pt-12 pb-8 md:hidden animate-in slide-in-from-bottom-full duration-300">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setIsExpanded(false)} className="text-white focus:outline-none">
              <ChevronDown className="w-8 h-8" />
            </button>
            <span className="text-xs tracking-widest font-medium uppercase text-zinc-400">Now Playing</span>
            <div className="w-8" />
          </div>

          <div className="flex-1 flex items-center justify-center mb-8 w-full max-w-sm mx-auto">
            <img src={currentTrack.coverUrl} className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl" />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="overflow-hidden pr-4">
              <h2 className="text-2xl font-bold text-white mb-1 truncate">{currentTrack.title}</h2>
              <p className="text-lg text-zinc-400 truncate">{currentTrack.artist}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onToggleLike(); }} className="transition-colors focus:outline-none shrink-0">
              <Heart className={\`w-8 h-8 \${isLiked ? 'text-fuchsia-400 fill-current' : 'text-zinc-400 hover:text-white'}\`} />
            </button>
          </div>

          <div className="mb-8">
            <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-3 group">
              <div className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100" style={{ width: \`\${progress * 100}%\` }} />
              <input 
                type="range" min="0" max="1" step="0.001" value={progress || 0}
                onChange={(e) => { e.stopPropagation(); onSeek(parseFloat(e.target.value)); }}
                className="absolute w-full h-full opacity-0 m-0"
              />
            </div>
            <div className="flex justify-between text-[13px] text-zinc-400 font-medium">
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 px-2">
            <button onClick={(e) => { e.stopPropagation(); onToggleShuffle(); }} className={\`\${isShuffle ? 'text-fuchsia-400' : 'text-zinc-400'} focus:outline-none\`}>
              <Shuffle className="w-7 h-7" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="text-white focus:outline-none">
              <SkipBack className="w-10 h-10 fill-current" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} className="w-16 h-16 bg-white rounded-full flex items-center justify-center focus:outline-none">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-black fill-current" />
              ) : (
                <Play className="w-8 h-8 text-black fill-current ml-1" />
              )}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="text-white focus:outline-none">
              <SkipForward className="w-10 h-10 fill-current" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleRepeat(); }} className={\`\${isRepeat ? 'text-fuchsia-400' : 'text-zinc-400'} focus:outline-none\`}>
              <Repeat className="w-7 h-7" />
            </button>
          </div>
          
          <div className="flex justify-between items-center px-2">
             <button onClick={(e) => { e.stopPropagation(); onToggleQueue?.(); setIsExpanded(false); }} className="text-zinc-400 hover:text-white transition-colors" title="Queue"><ListMusic className="w-6 h-6" /></button>
             <button onClick={(e) => { e.stopPropagation(); handleDownload(); }} disabled={isDownloading} className="text-zinc-400 hover:text-white transition-colors relative" title="Download Track">
               {isDownloading ? <Loader2 className="w-6 h-6 animate-spin text-fuchsia-400" /> : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
               )}
             </button>
          </div>
        </div>
      )}

      {/* Standard Bottom Player */}
      <div 
        className={\`h-20 md:h-24 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 absolute bottom-[60px] md:bottom-0 left-0 right-0 flex items-center justify-between px-2 md:px-6 z-50 overflow-hidden \${isExpanded ? 'hidden md:flex' : ''}\`}
        onClick={() => {
          if (window.innerWidth < 768) {
            setIsExpanded(true);
          }
        }}
      >
        {/* Current Track Info */}
        <div className="flex items-center gap-2 md:gap-4 w-1/2 md:w-1/4 md:min-w-[200px] pr-2">
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title}
            className="w-10 h-10 md:w-[50px] md:h-[50px] rounded object-cover shadow-lg shrink-0"
          />
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-[12px] md:text-[13px] text-white font-bold truncate hover:underline cursor-pointer tracking-wide">{currentTrack.title}</p>
            <p className="text-[10px] md:text-[11px] text-zinc-400 truncate hover:underline cursor-pointer">{currentTrack.artist}</p>
          </div>
          <div className="hidden md:flex items-center gap-3 ml-2 shrink-0">
            <button onClick={(e) => { e.stopPropagation(); onToggleLike(); }} className="transition-colors focus:outline-none" title="Like">
              <Heart className={\`w-[18px] h-[18px] \${isLiked ? 'text-fuchsia-400 fill-current' : 'text-zinc-500 hover:text-white'}\`} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onAddToPlaylist?.(); }} className="transition-colors focus:outline-none" title="Add to Playlist">
              <PlusCircle className="w-[18px] h-[18px] text-zinc-500 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex flex-col items-center max-w-[600px] w-1/2 md:w-2/4 gap-1 md:gap-2">
          <div className="flex items-center justify-end md:justify-center gap-2 md:gap-6 w-full">
            <button onClick={(e) => { e.stopPropagation(); onToggleShuffle(); }} className={\`hidden md:block \${isShuffle ? 'text-fuchsia-400' : 'text-zinc-400 hover:text-white'} transition-colors\`}>
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onAddToPlaylist?.(); }} className="md:hidden transition-colors focus:outline-none shrink-0" title="Add to Playlist">
              <PlusCircle className="w-5 h-5 text-zinc-400 hover:text-white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleLike(); }} className="md:hidden transition-colors focus:outline-none shrink-0" title="Like">
              <Heart className={\`w-5 h-5 \${isLiked ? 'text-fuchsia-400 fill-current' : 'text-zinc-400 hover:text-white'}\`} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="text-zinc-400 hover:text-white transition-colors shrink-0 hidden md:block">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
              className="w-9 h-9 md:w-11 md:h-11 shrink-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-current ml-0.5 md:ml-1" />
              )}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="text-zinc-400 hover:text-white transition-colors shrink-0 hidden md:block">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleRepeat(); }} className={\`hidden md:block \${isRepeat ? 'text-fuchsia-400' : 'text-zinc-400 hover:text-white'} transition-colors\`}>
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 md:relative md:h-4 md:flex items-center gap-4 md:w-full md:px-4 text-[11px] text-zinc-400 font-mono tracking-wider font-medium" onClick={(e) => e.stopPropagation()}>
            <span className="hidden md:block w-8 text-right">{currentTime}</span>
            <div className="flex-1 relative flex items-center h-full md:h-4 group w-full">
              <div className="absolute left-0 w-full h-full md:h-1 bg-[#1a1a1a] rounded-none md:rounded overflow-hidden pointer-events-none">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-colors duration-100"
                  style={{ width: \`\${progress * 100}%\` }}
                />
              </div>
              {/* The thumb */}
              <div 
                className="hidden md:block absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm pointer-events-none transition-opacity"
                style={{ left: \`calc(\${progress * 100}% - 6px)\` }}
              />
              <input 
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={progress || 0}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer m-0"
              />
            </div>
            <span className="hidden md:block w-8 text-left">{duration}</span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="hidden md:flex items-center justify-end gap-5 w-1/4 min-w-[200px] text-zinc-400">
          <div className="flex items-center gap-2 group w-24">
            <button onClick={(e) => {
              e.stopPropagation();
              if (isMuted) {
                setIsMuted(false);
                onVolumeChange(0.5); // Restore to a default volume or we could store previous volume
              } else {
                setIsMuted(true);
                onVolumeChange(0);
              }
            }}>
              {isMuted || volume === 0 ? <VolumeX className="w-[18px] h-[18px] text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0" /> : <Volume2 className="w-[18px] h-[18px] text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0" />}
            </button>
            <div className="relative flex-1 flex items-center h-4 group-hover:block" onClick={(e) => e.stopPropagation()}>
               <div className="absolute left-0 w-full h-1 bg-[#1a1a1a] rounded overflow-hidden pointer-events-none">
                 <div 
                    className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-colors"
                    style={{ width: \`\${isMuted ? 0 : volume * 100}%\` }}
                 />
               </div>
               <div 
                  className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm pointer-events-none"
                 style={{ left: \`calc(\${isMuted ? 0 : volume * 100}% - 5px)\` }}
               />
               <input 
                  type="range"
                 min="0"
                 max="1"
                 step="0.01"
                 value={isMuted ? 0 : volume}
                 onChange={(e) => {
                   const v = parseFloat(e.target.value);
                   if (v > 0 && isMuted) setIsMuted(false);
                   onVolumeChange(v);
                 }}
                 className="absolute w-full h-full opacity-0 cursor-pointer m-0"
               />
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleDownload(); }} disabled={isDownloading} className="hover:text-white transition-colors relative" title="Download Track">
            {isDownloading ? <Loader2 className="w-[18px] h-[18px] animate-spin text-fuchsia-400" /> : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            )}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onToggleEQ?.(); }} className="hover:text-white transition-colors" title="EQ"><SlidersHorizontal className="w-[18px] h-[18px]" /></button>
          <button onClick={(e) => { e.stopPropagation(); onToggleQueue?.(); }} className="hover:text-white transition-colors" title="Queue"><ListMusic className="w-[18px] h-[18px]" /></button>
          <button onClick={(e) => { e.stopPropagation(); onToggleFullscreen?.(); }} className="hover:text-white transition-colors" title="Full Screen"><Maximize2 className="w-[18px] h-[18px]" /></button>
        </div>
      </div>
    </>
  );
}
`;

content = content.replace(returnRegex, newReturn);

fs.writeFileSync('src/components/Player.tsx', content);
