import React, { useState } from 'react';
import { X, Plus, Music } from 'lucide-react';
import { Track, Playlist } from '../types';

interface AddToPlaylistModalProps {
  track: Track;
  playlists: Playlist[];
  onClose: () => void;
  onCreatePlaylist: (name: string, firstTrack: Track) => void;
  onAddToPlaylist: (playlistId: string, track: Track) => void;
}

export function AddToPlaylistModal({ track, playlists, onClose, onCreatePlaylist, onAddToPlaylist }: AddToPlaylistModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    onCreatePlaylist(newPlaylistName.trim(), track);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Add to Playlist</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex items-center gap-4 border-b border-white/5">
          <img src={track.coverUrl} className="w-12 h-12 rounded object-cover" alt="" />
          <div className="truncate">
            <p className="font-semibold text-white truncate">{track.title}</p>
            <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto p-2">
          {isCreating ? (
            <form onSubmit={handleCreate} className="p-2">
              <input 
                autoFocus
                type="text" 
                placeholder="Playlist name..."
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors mb-3"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={!newPlaylistName.trim()} className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer">
                  Create & Add
                </button>
              </div>
            </form>
          ) : (
            <>
              <button 
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left group"
              >
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-white group-hover:text-violet-400 transition-colors">New Playlist</span>
              </button>
              
              {playlists.map(playlist => (
                <button 
                  key={playlist.id}
                  onClick={() => {
                    onAddToPlaylist(playlist.id, track);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center overflow-hidden">
                    {playlist.coverUrl ? (
                      <img src={playlist.coverUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <Music className="w-5 h-5 text-zinc-500" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-white truncate">{playlist.title}</p>
                    <p className="text-xs text-zinc-400 truncate">{playlist.tracks.length} tracks</p>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
