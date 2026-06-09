import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Mic2, MonitorSpeaker, Heart, PlusCircle, X, Download, Loader2 } from 'lucide-react';
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

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, percent)));
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onVolumeChange(Math.max(0, Math.min(1, percent)));
  };

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
    <div className="h-24 bg-black/80 backdrop-blur-xl border-t border-white/5 absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 z-50">
      
      {/* Current Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title}
          className="w-14 h-14 rounded-lg object-cover shadow-lg"
        />
        <div className="overflow-hidden">
          <p className="text-white font-medium truncate hover:underline cursor-pointer">{currentTrack.title}</p>
          <p className="text-xs text-zinc-400 truncate hover:underline cursor-pointer">{currentTrack.artist}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={onToggleLike} className="transition-colors focus:outline-none" title="Like">
            <Heart className={`w-5 h-5 ${isLiked ? 'text-violet-500 fill-current' : 'text-zinc-400 hover:text-white'}`} />
          </button>
          <button onClick={onAddToPlaylist} className="transition-colors focus:outline-none" title="Add to Playlist">
            <PlusCircle className="w-5 h-5 text-zinc-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center max-w-2xl w-2/4 gap-2">
        <div className="flex items-center gap-6">
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={onTogglePlay}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black fill-current" />
            ) : (
              <Play className="w-5 h-5 text-black fill-current ml-1" />
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
        <div className="flex items-center gap-2 w-full text-xs text-zinc-500 font-mono">
          <span className="w-10 text-right">{currentTime}</span>
          <div 
            onClick={handleSeekClick}
            className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer flex items-center relative"
          >
            <div 
              className="absolute left-0 top-0 h-full bg-white group-hover:bg-violet-400 transition-colors duration-300"
              style={{ width: `${progress * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm translate-x-1.5" />
            </div>
          </div>
          <span className="w-10 left">{duration}</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px] text-zinc-400">
        <button onClick={handleDownload} disabled={isDownloading} className="hover:text-white transition-colors disabled:opacity-50" title="Download">
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        </button>
        <button className="hover:text-white transition-colors"><Mic2 className="w-4 h-4" /></button>
        <button className="hover:text-white transition-colors"><MonitorSpeaker className="w-4 h-4" /></button>
        <div className="flex items-center gap-2 w-24 group cursor-pointer" onClick={handleVolumeClick}>
          <Volume2 className="w-5 h-5 hover:text-white transition-colors" />
          <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden flex items-center relative">
             <div 
               className="absolute left-0 top-0 h-full bg-white group-hover:bg-violet-400 transition-colors" 
               style={{ width: `${volume * 100}%` }}
             />
          </div>
        </div>
      </div>
    </div>
  );
}

