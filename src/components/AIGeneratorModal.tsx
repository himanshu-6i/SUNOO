import React, { useState } from 'react';
import { X, Sparkles, Loader2, Music } from 'lucide-react';
import { Track } from '../types';

interface AIGeneratorModalProps {
  onClose: () => void;
  onTrackGenerated: (track: Track, audioBase64: string, mimeType: string) => void;
}

export function AIGeneratorModal({ onClose }: AIGeneratorModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#18181b] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl relative flex flex-col items-center justify-center p-12 text-center">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-20 h-20 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl shadow-violet-500/10">
          <Sparkles className="w-10 h-10 text-violet-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Updating Soon</h2>
        <p className="text-zinc-400 max-w-sm text-base">
          Our AI Music Generator is getting a massive upgrade. Stay tuned for higher quality tracks and more control!
        </p>
      </div>
    </div>
  );
}
