import { Play, Sparkles, Clock } from 'lucide-react';
import { Track, Playlist } from '../types';

interface HomeFeedProps {
  trending: Track[];
  aiPlaylists: Playlist[];
  recentlyPlayed: Track[];
  onPlay: (track: Track, contextQueue: Track[]) => void;
  onSaveMix?: () => void;
  isMixSaved?: boolean;
}

export function HomeFeed({ trending, aiPlaylists, recentlyPlayed, onPlay, onSaveMix, isMixSaved }: HomeFeedProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* Hero Banner / AI Recommendation */}
      <div className="relative h-80 bg-gradient-to-br from-violet-900/40 via-black to-blue-900/20 p-8 flex flex-col justify-end overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-violet-400 font-medium text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered Discovery</span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tighter text-white mb-4">
             Your Evening Flow
          </h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl">
             Generated based on your recent listening history and current atmosphere.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onPlay(trending[0], trending)}
              className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <Play className="w-5 h-5 fill-current" />
              Play Mix
            </button>
            <button 
              onClick={onSaveMix}
              disabled={isMixSaved}
              className={`px-8 py-3 font-semibold rounded-full transition-colors backdrop-blur-md border ${
                isMixSaved 
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/20 cursor-default' 
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/5'
              }`}
            >
              {isMixSaved ? 'Saved to Library' : 'Save to Library'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-12">
        {/* AI Playlists Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Made for You</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {aiPlaylists.map((playlist) => (
              <div key={playlist.id} className="group bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
                  <img src={playlist.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={playlist.title} />
                  <button 
                    onClick={(e) => { e.stopPropagation(); onPlay(playlist.tracks[0], playlist.tracks); }}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                  >
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </button>
                </div>
                <h3 className="text-white font-semibold mb-1 truncate">{playlist.title}</h3>
                <p className="text-sm text-zinc-400 truncate">By {playlist.creator}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Played Section */}
        {recentlyPlayed.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-violet-400" />
              <h2 className="text-2xl font-bold text-white">Recently Played</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recentlyPlayed.map((track) => (
                <div key={track.id} className="group bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
                    <img src={track.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={track.title} />
                    <button 
                      onClick={(e) => { e.stopPropagation(); onPlay(track, recentlyPlayed); }}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                    >
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </button>
                  </div>
                  <h3 className="text-white font-semibold mb-1 truncate">{track.title}</h3>
                  <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Tracks List */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-[32px_1fr_1fr_48px] gap-4 px-4 py-2 text-sm text-zinc-500 border-b border-white/5 mb-2">
              <span className="text-center">#</span>
              <span>Title</span>
              <span>Plays</span>
              <span className="text-center">Time</span>
            </div>
            {trending.map((track, idx) => (
              <div 
                key={track.id} 
                onClick={() => onPlay(track, trending)}
                className="group grid grid-cols-[32px_1fr_1fr_48px] gap-4 px-4 py-3 rounded-lg hover:bg-white/5 items-center cursor-pointer transition-colors"
              >
                <div className="text-zinc-500 group-hover:text-white flex items-center justify-center">
                   <span className="group-hover:hidden">{idx + 1}</span>
                   <Play className="w-4 h-4 fill-current hidden group-hover:block" />
                </div>
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={track.coverUrl} className="w-10 h-10 rounded object-cover flex-shrink-0" alt={track.title} />
                  <div className="truncate">
                    <p className="text-white font-medium group-hover:text-violet-400 transition-colors truncate">{track.title}</p>
                    <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                  </div>
                </div>
                <div className="text-sm text-zinc-400 font-mono">
                  {track.plays.toLocaleString()}
                </div>
                <div className="text-sm text-zinc-400 font-mono text-center">
                  {track.duration}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
