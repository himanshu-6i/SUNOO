import React from 'react';
import { Track, Artist } from '../types';
import { Play } from 'lucide-react';

interface ArtistViewProps {
  artist: Artist;
  tracks: Track[];
  onPlay: (track: Track, queue?: Track[]) => void;
  isFollowed?: boolean;
  onToggleFollow?: () => void;
}

export function ArtistView({ artist, tracks, onPlay, isFollowed, onToggleFollow }: ArtistViewProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#050505] pt-20 custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-8 pb-8 pt-12 bg-gradient-to-t from-black/50 to-[#1a0b2e]/50">
        <img 
          src={artist.imageUrl} 
          alt={artist.name} 
          className="w-48 h-48 md:w-60 md:h-60 rounded-full object-cover shadow-2xl"
        />
        <div className="flex flex-col items-center md:items-start flex-1 w-full text-center md:text-left">
          <span className="text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">Artist</span>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 tracking-tight line-clamp-2">
            {artist.name}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
            <span>{tracks.length} track{tracks.length !== 1 ? 's' : ''} uploaded</span>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="p-8">
        <div className="flex items-center gap-6 mb-8">
          <button 
            className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center text-white hover:scale-105 hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            onClick={() => tracks.length > 0 && onPlay(tracks[0], tracks)}
          >
            <Play fill="currentColor" size={28} className="translate-x-0.5" />
          </button>
          
          <button 
            onClick={onToggleFollow}
            className={`px-6 py-2 rounded-full font-bold text-sm border hover:scale-105 transition-all ${isFollowed ? 'bg-transparent text-white border-white/50 hover:border-white' : 'bg-transparent text-white border-white hover:bg-white/10'}`}
          >
            {isFollowed ? 'Following' : 'Follow'}
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-4">Uploaded Tracks</h2>
          {tracks.length === 0 ? (
            <p className="text-zinc-400">This artist hasn't uploaded any tracks yet.</p>
          ) : (
            <div className="space-y-1">
              {tracks.map((track, index) => (
                <div 
                  key={track.id}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-white/10 group transition-colors cursor-pointer"
                  onClick={() => onPlay(track, tracks)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 w-6 text-right font-mono tabular-nums group-hover:text-white transition-colors">{index + 1}</span>
                    <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <div>
                      <p className="text-white font-medium group-hover:text-[#a22bd8] transition-colors">{track.title}</p>
                      <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                     {/* Can add more actions like like, menu here if needed */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
