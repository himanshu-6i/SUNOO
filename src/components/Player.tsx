import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Mic2, Heart, PlusCircle, Maximize2, ListMusic, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Track } from '../types';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  currentTime: string;
  duration: string;
  volume: number;
  isLiked: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (percent: number) => void;
  onVolumeChange: (percent: number) => void;
  onToggleLike: () => void;
  onAddToPlaylist?: () => void;
  onDownload?: (track: Track) => void;
}

export function Player({ currentTrack, isPlaying, progress, currentTime, duration, volume, isLiked, onTogglePlay, onNext, onPrev, onSeek, onVolumeChange, onToggleLike, onAddToPlaylist, onDownload }: PlayerProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!currentTrack) return null;

  const handleDownload = async () => {
    if (!currentTrack?.audioUrl || isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(currentTrack.audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${currentTrack.title} - ${currentTrack.artist}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      if (onDownload) onDownload(currentTrack);
    } catch (error) {
      // Fallback for CORS restricted files
      const a = document.createElement('a');
      a.href = currentTrack.audioUrl;
      a.download = `${currentTrack.title} - ${currentTrack.artist}.mp3`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (onDownload) onDownload(currentTrack);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-24 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 z-50">
      
      {/* Current Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title}
          className="w-[50px] h-[50px] rounded object-cover shadow-lg"
        />
        <div className="overflow-hidden">
          <p className="text-[13px] text-white font-bold truncate hover:underline cursor-pointer tracking-wide">{currentTrack.title}</p>
          <p className="text-[11px] text-zinc-400 truncate hover:underline cursor-pointer">{currentTrack.artist}</p>
        </div>
        <div className="flex items-center gap-3 ml-2">
          <button onClick={onToggleLike} className="transition-colors focus:outline-none" title="Like">
            <Heart className={`w-[18px] h-[18px] ${isLiked ? 'text-[#a22bd8] fill-current' : 'text-zinc-500 hover:text-white'}`} />
          </button>
          <button onClick={onAddToPlaylist} className="transition-colors focus:outline-none" title="Add to Playlist">
            <PlusCircle className="w-[18px] h-[18px] text-zinc-500 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center max-w-[600px] w-2/4 gap-2">
        <div className="flex items-center gap-6">
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={onTogglePlay}
            className="w-11 h-11 bg-[#d946ef] rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-[#d946ef]/20"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white fill-current" />
            ) : (
              <Play className="w-5 h-5 text-white fill-current ml-1" />
            )}
          </button>
          <button onClick={onNext} className="text-zinc-400 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-4 w-full px-4 text-[11px] text-zinc-400 font-mono tracking-wider font-medium">
          <span className="w-8 text-right">{currentTime}</span>
          <div className="flex-1 relative flex items-center h-4 group">
            <div className="absolute left-0 w-full h-1 bg-[#1a1a1a] rounded overflow-hidden pointer-events-none">
              <div 
                className="h-full bg-[#a22bd8] group-hover:bg-[#c333ff] transition-colors duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            {/* The thumb */}
            <div 
              className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm pointer-events-none transition-opacity"
              style={{ left: `calc(${progress * 100}% - 6px)` }}
            />
            <input 
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress || 0}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer m-0"
            />
          </div>
          <span className="w-8 text-left">{duration}</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex items-center justify-end gap-5 w-1/4 min-w-[200px] text-zinc-400">
        <div className="flex items-center gap-2 group w-24">
          <Volume2 className="w-[18px] h-[18px] text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0" />
          <div className="relative flex-1 flex items-center h-4 group-hover:block">
             <div className="absolute left-0 w-full h-1 bg-[#1a1a1a] rounded overflow-hidden pointer-events-none">
               <div 
                 className="h-full bg-[#a22bd8] group-hover:bg-[#c333ff] transition-colors" 
                 style={{ width: `${volume * 100}%` }}
               />
             </div>
             <div 
               className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm pointer-events-none"
               style={{ left: `calc(${volume * 100}% - 5px)` }}
             />
             <input 
               type="range"
               min="0"
               max="1"
               step="0.01"
               value={volume || 0}
               onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
               className="absolute w-full h-full opacity-0 cursor-pointer m-0"
             />
          </div>
        </div>
        <button className="hover:text-white transition-colors"><SlidersHorizontal className="w-[18px] h-[18px]" /></button>
        <button className="hover:text-white transition-colors"><ListMusic className="w-[18px] h-[18px]" /></button>
        <button className="hover:text-white transition-colors"><Maximize2 className="w-[18px] h-[18px]" /></button>
      </div>
    </div>
  );
}

