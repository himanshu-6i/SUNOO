import React from 'react';
import { Play, Pause, Compass, Music, Target } from 'lucide-react';
import { Track } from '../types';

interface GenrePlaylistViewProps {
  id: string;
  title: string;
  description: string;
  tracks: Track[];
  onPlay: (track: Track, queue: Track[]) => void;
  playingTrackId?: string;
  isPlaying?: boolean;
}

export function GenrePlaylistView({ id, title, description, tracks, onPlay, playingTrackId, isPlaying }: GenrePlaylistViewProps) {
  const getIcon = () => {
    switch (id) {
      case 'chill': return <Music className="w-16 h-16 text-blue-400" />;
      case 'workout': return <Target className="w-16 h-16 text-orange-400" />;
      case 'focus': return <Compass className="w-16 h-16 text-emerald-400" />;
      default: return <Music className="w-16 h-16 text-violet-400" />;
    }
  };

  const getGradient = () => {
    switch (id) {
      case 'chill': return 'from-blue-500/20 to-black';
      case 'workout': return 'from-orange-500/20 to-black';
      case 'focus': return 'from-emerald-500/20 to-black';
      default: return 'from-violet-500/20 to-black';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className={`p-8 bg-gradient-to-b ${getGradient()} pb-32 min-h-full`}>
        <div className="flex items-end gap-6 mb-8 group mt-8">
          <div className="w-48 h-48 bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center relative">
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
             {getIcon()}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Playlist</span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white mt-2 mb-4 tracking-tight drop-shadow-lg">{title}</h1>
            <p className="text-zinc-300 font-medium text-sm tracking-wide">{description}</p>
            <p className="text-zinc-500 text-sm mt-2">{tracks.length} track{tracks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {tracks.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => onPlay(tracks[0], tracks)}
              className="w-14 h-14 rounded-full bg-violet-500 flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]"
            >
              {isPlaying && playingTrackId === tracks[0].id ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
          </div>
        )}

        <div className="mt-8">
          <div className="grid grid-cols-[16px_1fr_1fr_minmax(120px,50px)] gap-4 px-4 py-2 border-b border-white/5 text-xs tracking-wider text-zinc-500 font-semibold uppercase mb-4">
            <div>#</div>
            <div>Title</div>
            <div>Genre</div>
            <div className="text-right">Plays</div>
          </div>
          {tracks.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              <p>No tracks uploaded in this genre yet.</p>
              <p className="mt-2 text-sm">Head to the Creator Dashboard to upload songs.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {tracks.map((track, index) => {
                const isCurrentTrack = playingTrackId === track.id;
                return (
                  <div 
                    key={track.id}
                    className={`grid grid-cols-[16px_1fr_1fr_minmax(120px,50px)] gap-4 px-4 py-3 rounded-lg flex items-center group cursor-pointer transition-colors ${isCurrentTrack ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    onClick={() => onPlay(track, tracks)}
                  >
                    <div className="text-zinc-500 text-sm w-4 text-center">
                      {isCurrentTrack && isPlaying ? (
                        <div className="w-3 h-3 flex items-end gap-0.5 justify-center">
                          <div className="w-0.5 bg-violet-400  animate-pulse" style={{ height: '40%' }}></div>
                          <div className="w-0.5 bg-violet-400  animate-pulse delay-75" style={{ height: '80%' }}></div>
                          <div className="w-0.5 bg-violet-400  animate-pulse delay-150" style={{ height: '100%' }}></div>
                        </div>
                      ) : isCurrentTrack ? (
                        <span className="text-violet-400">▶</span>
                      ) : (
                        <span className="group-hover:hidden">{index + 1}</span>
                      )}
                      {!isCurrentTrack && <Play className="w-4 h-4 text-white hidden group-hover:block ml-[-4px]" />}
                    </div>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={track.coverUrl} className="w-10 h-10 rounded shadow-md object-cover" alt="" />
                      <div className="truncate">
                        <div className={`font-medium truncate ${isCurrentTrack ? 'text-violet-400' : 'text-white group-hover:text-violet-200'} transition-colors`}>{track.title}</div>
                        <div className="text-sm text-zinc-500 truncate">{track.artist}</div>
                      </div>
                    </div>
                    <div className="text-sm text-zinc-400 truncate">{track.genre}</div>
                    <div className="text-sm text-zinc-400 text-right font-mono">{track.plays.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
