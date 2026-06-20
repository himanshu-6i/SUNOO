import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePlaylistModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreatePlaylistModal({ onClose, onCreate }: CreatePlaylistModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Create Smart Playlist</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <input 
            autoFocus
            type="text" 
            placeholder="E.g., Deep Focus, Phonk, Synthwave..."
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors mb-4"
          />
          <p className="text-xs text-zinc-400 mb-4 px-1">
            Tracks matching this name/genre will be added automatically, including past and future uploads!
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim()} className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 border-0 rounded-lg transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
