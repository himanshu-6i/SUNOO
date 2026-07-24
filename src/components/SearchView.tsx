import { Play, Music, Clock, X, Search } from 'lucide-react';
import { Track } from '../types';
import React, { useState, useEffect } from 'react';
import { BROWSE_CATEGORIES } from '../categories';

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
    <div className="flex-1 overflow-y-auto pb-40 px-4 md:px-8 pt-4 md:pt-8 custom-scrollbar">
      

      <h2 className="text-2xl font-bold text-white mb-6">
        {query ? `Search results for "${query}"` : 'Browse all'}
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
            {BROWSE_CATEGORIES.map((category) => (
              <div 
                key={category.title} 
                onClick={() => onGenreSelect && onGenreSelect(category.title)}
                className="rounded-lg p-3 md:p-4 h-24 md:h-40 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform shadow-md"
                style={{ backgroundColor: category.color }}
              >
                <h3 className="text-sm md:text-xl font-bold text-white relative z-10 leading-tight pr-4 drop-shadow-md">{category.title}</h3>
                <img 
                  src={category.img} 
                  alt={category.title} 
                  className="absolute -bottom-2 -right-4 md:-bottom-4 md:-right-6 w-14 h-14 md:w-28 md:h-28 object-cover rounded-sm shadow-2xl rotate-[25deg] group-hover:rotate-[20deg] transition-transform"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {query && filtered.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-[48px_1fr_1fr_48px] gap-4 px-4 py-2 text-sm text-zinc-500 border-b border-white/5 mb-2 hidden md:grid">
            <span className="text-center">Play</span>
            <span>Title</span>
            <span>Genre</span>
            <span className="text-center">Time</span>
          </div>
          {filtered.map((track) => (
            <div 
              key={track.id} 
              onClick={() => onPlay(track, filtered)}
              className="group grid grid-cols-[48px_1fr] md:grid-cols-[48px_1fr_1fr_48px] gap-4 px-2 md:px-4 py-3 rounded-lg hover:bg-white/5 items-center cursor-pointer transition-colors border border-transparent hover:border-white/5"
            >
              <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                <img src={track.coverUrl} className="w-full h-full object-cover" alt={track.title} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <Play className="w-4 h-4 text-white fill-current ml-1" />
                </div>
              </div>
              <div className="truncate flex flex-col justify-center">
                <p className="text-white font-medium group-hover:text-violet-400 transition-colors truncate text-sm md:text-base">{track.title}</p>
                <p className="text-xs md:text-sm text-zinc-400 truncate">{track.artist}</p>
              </div>
              <div className="text-sm text-zinc-400 font-mono truncate hidden md:block">{track.genre}</div>
              <div className="text-sm text-zinc-400 font-mono text-center hidden md:block">{track.duration}</div>
            </div>
          ))}
        </div>
      )}

      {query && filtered.length === 0 && (
        <div className="text-zinc-500 text-center py-20 flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/5 mx-2 md:mx-0">
          <Music className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg">No tracks found for "{query}"</p>
          <p className="text-sm text-zinc-600 mt-2">Try searching by artist or genre instead.</p>
        </div>
      )}
    </div>
  );
}
