import { Play, Music, Clock, X } from 'lucide-react';
import { Track } from '../types';
import React, { useState, useEffect } from 'react';

interface SearchViewProps {
  query: string;
  tracks: Track[];
  onPlay: (track: Track, queue: Track[]) => void;
  onGenreSelect?: (genre: string) => void;
}

export function SearchView({ query, tracks, onPlay, onGenreSelect }: SearchViewProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    const timeoutId = setTimeout(() => {
      setRecentSearches(prev => {
        const trimmedQuery = query.trim();
        const updated = [trimmedQuery, ...prev.filter(q => q.toLowerCase() !== trimmedQuery.toLowerCase())].slice(0, 8);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        return updated;
      });
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const removeHistory = (e: React.MouseEvent, q: string) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== q);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const filtered = tracks.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) || 
    t.artist.toLowerCase().includes(query.toLowerCase()) ||
    t.genre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto pb-32 p-8">
       <h2 className="text-2xl font-bold text-white mb-6">
         {query ? `Search results for "${query}"` : 'Discover New Music'}
       </h2>
       
       {!query && (
         <>
           {recentSearches.length > 0 && (
             <div className="mb-8">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-zinc-400" />
                 Recent Searches
               </h3>
               <div className="flex flex-wrap gap-2">
                 {recentSearches.map(q => (
                   <div key={q} 
                     onClick={() => onGenreSelect && onGenreSelect(q)}
                     className="bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors group"
                   >
                     <span className="text-sm font-medium text-zinc-300">{q}</span>
                     <button 
                       onClick={(e) => removeHistory(e, q)}
                       className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-white/10 transition-all"
                     >
                       <X className="w-3 h-3 text-zinc-400" />
                     </button>
                   </div>
                 ))}
               </div>
             </div>
           )}
           <h3 className="text-xl font-bold text-white mb-4">Browse Genres</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             {['Pop', 'Electronic', 'Hip Hop', 'Ambient', 'Indie', 'Jazz', 'Classical', 'Rock'].map((genre, i) => (
               <div 
                 key={genre} 
                 onClick={() => onGenreSelect && onGenreSelect(genre)}
                 className={`bg-white/5 rounded-xl p-6 aspect-video flex items-end relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform`}
                 style={{ backgroundColor: `hsl(${i * 45}, 50%, 20%)` }}
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                 <h3 className="text-xl font-bold text-white relative z-10">{genre}</h3>
               </div>
             ))}
           </div>
         </>
       )}

       {query && filtered.length > 0 && (
         <div className="space-y-2">
           <div className="grid grid-cols-[48px_1fr_1fr_48px] gap-4 px-4 py-2 text-sm text-zinc-500 border-b border-white/5 mb-2">
              <span className="text-center">Play</span>
              <span>Title</span>
              <span>Genre</span>
              <span className="text-center">Time</span>
           </div>
           {filtered.map((track) => (
              <div 
                key={track.id} 
                onClick={() => onPlay(track, filtered)}
                className="group grid grid-cols-[48px_1fr_1fr_48px] gap-4 px-4 py-3 rounded-lg hover:bg-white/5 items-center cursor-pointer transition-colors border border-transparent hover:border-white/5"
              >
                <div className="relative w-10 h-10 rounded overflow-hidden">
                  <img src={track.coverUrl} className="w-full h-full object-cover" alt={track.title} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <Play className="w-4 h-4 text-white fill-current ml-1" />
                  </div>
                </div>
                <div className="truncate">
                  <p className="text-white font-medium group-hover:text-violet-400 transition-colors truncate">{track.title}</p>
                  <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                </div>
                <div className="text-sm text-zinc-400 font-mono truncate">{track.genre}</div>
                <div className="text-sm text-zinc-400 font-mono text-center">{track.duration}</div>
              </div>
           ))}
         </div>
       )}

       {query && filtered.length === 0 && (
         <div className="text-zinc-500 text-center py-20 flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/5">
           <Music className="w-12 h-12 mb-4 opacity-20" />
           <p className="text-lg">No tracks found for "{query}"</p>
           <p className="text-sm text-zinc-600 mt-2">Try searching by artist or genre instead.</p>
         </div>
       )}
    </div>
  );
}
