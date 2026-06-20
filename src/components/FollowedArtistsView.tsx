import React from 'react';
import { Artist } from '../types';

interface FollowedArtistsViewProps {
  artists: Artist[];
  onArtistClick: (artist: Artist) => void;
}

export function FollowedArtistsView({ artists, onArtistClick }: FollowedArtistsViewProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
      <div className="p-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-8">Followed Artists</h1>
        
        {artists.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-lg">You haven't followed any artists yet.</p>
            <p className="text-sm mt-2">Discover and follow new creators.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {artists.map((artist) => (
              <div 
                key={artist.id} 
                className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl cursor-pointer transition-colors group flex flex-col items-center text-center"
                onClick={() => onArtistClick(artist)}
              >
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg group-hover:shadow-2xl transition-all group-hover:scale-105 mb-4" 
                />
                <h3 className="text-white font-bold text-lg truncate w-full">{artist.name}</h3>
                <p className="text-zinc-500 text-sm mt-1">Artist</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
