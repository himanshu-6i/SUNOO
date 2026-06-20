import React, { useState } from 'react';
import { X, Sparkles, Loader2, Music } from 'lucide-react';
import { Track } from '../types';

interface AIGeneratorModalProps {
  onClose: () => void;
  onTrackGenerated: (track: Track, audioBase64: string, mimeType: string) => void;
}

export function AIGeneratorModal({ onClose, onTrackGenerated }: AIGeneratorModalProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<'clip' | 'full'>('clip');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, duration }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate music');
      }

      // Convert the base64 audio and create an object URL initially for immediate playback.
      // The parent will upload it to Firebase/Supabase in `onTrackGenerated`.
      const newTrack: Track = {
        id: `ai_${Date.now()}`,
        title: prompt.split(' ').slice(0, 4).join(' ') + '...',
        artist: 'AI Generated',
        coverUrl: 'https://images.unsplash.com/photo-1614680376593-9c2f7344b420?auto=format&fit=crop&w=300&q=80',
        audioUrl: `data:${data.mimeType};base64,${data.audioBase64}`,
        duration: duration === 'full' ? '2:30' : '0:30',
        genre: 'AI',
        plays: 0,
      };

      onTrackGenerated(newTrack, data.audioBase64, data.mimeType);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#18181b] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl relative flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Music Generator
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
             <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
               {error}
             </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Prompt (Describe your song)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A fast-paced synthwave track with heavy bass, cyberpunk vibe..."
              className="w-full bg-black/50 border border-white/10 rounded-xl max-h-[150px] min-h-[100px] p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 resize-y"
            />
          </div>

          <div>
             <label className="block text-sm font-semibold text-zinc-300 mb-3">Length</label>
             <div className="flex gap-4">
               <button 
                 onClick={() => setDuration('clip')}
                 className={`flex-1 py-3 rounded-xl border font-medium transition-all ${duration === 'clip' ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' : 'bg-black/50 border-white/10 text-zinc-400 hover:bg-white/5'}`}
               >
                 Short Clip (30s)
               </button>
               <button 
                 onClick={() => setDuration('full')}
                 className={`flex-1 py-3 rounded-xl border font-medium transition-all ${duration === 'full' ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' : 'bg-black/50 border-white/10 text-zinc-400 hover:bg-white/5'}`}
               >
                 Full Track
               </button>
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20 rounded-b-3xl">
          <button 
             onClick={handleGenerate}
             disabled={!prompt.trim() || isGenerating}
             className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
             {isGenerating ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin" />
                 Generating Music...
               </>
             ) : (
               <>
                 <Music className="w-5 h-5" />
                 Generate Track
               </>
             )}
          </button>
        </div>
      </div>
    </div>
  );
}
