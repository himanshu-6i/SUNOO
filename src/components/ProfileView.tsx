import React, { useState, useRef } from 'react';
import { currentUser as mockUser } from '../data';
import { Track } from '../types';
import { BadgeCheck, LayoutDashboard, Upload, Heart, ListMusic, Download, Clock, History, Edit, Link as LinkIcon, Instagram, Twitter, Play } from 'lucide-react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';

interface ProfileViewProps {
  tracks: Track[];
  recentlyPlayed: Track[];
  onNavigate?: (view: string) => void;
  onPlay?: (track: Track, queue: Track[]) => void;
}

export function ProfileView({ tracks, recentlyPlayed, onNavigate, onPlay }: ProfileViewProps) {
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const userName = auth.currentUser?.displayName || mockUser.name;
  const userPhoto = localPhotoUrl || auth.currentUser?.photoURL || mockUser.avatarUrl;
  const userRole = mockUser.role;

  const uploadedTracks = tracks.filter(t => t.artist === userName).length;

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (auth.currentUser) {
        updateProfile(auth.currentUser, { photoURL: url })
          .then(() => setLocalPhotoUrl(url))
          .catch(err => console.error(err));
      } else {
        setLocalPhotoUrl(url);
      }
    }
  };

  const scrollToHistory = () => {
    document.getElementById('recently-played')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* Header Profile Section */}
      <div className="relative h-64 bg-gradient-to-b from-violet-900/40 to-[#121212]">
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative group cursor-pointer" onClick={handleEditPhoto}>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <img 
              src={userPhoto} 
              alt={userName} 
              className="w-40 h-40 rounded-full border-4 border-[#121212] object-cover bg-zinc-800 shadow-2xl" 
            />
            <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit className="w-8 h-8 text-white" />
            </button>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-bold text-white tracking-tight">{userName}</h1>
              {userRole === 'artist' && (
                <BadgeCheck className="w-8 h-8 text-blue-400 mt-2" />
              )}
            </div>
            <p className="text-lg text-zinc-400 mt-1">
              @{auth.currentUser?.email ? auth.currentUser.email.split('@')[0] : 'supercreator123'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 mt-24 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Left Column: Basic Info & Stats */}
        <div className="lg:w-1/3 space-y-8">
          <section>
            <p className="text-zinc-300 leading-relaxed">
              Based in the digital realm. Creating soundscapes for the soul. Always experimenting with new electronic frequencies.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors text-zinc-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors text-zinc-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors text-zinc-400">
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </section>

          <section className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Music Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">{uploadedTracks}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Uploads</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12.4k</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Streams</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">4.2k</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Listeners</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1,024</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">128</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Following</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">8.9k</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Likes</p>
              </div>
            </div>
          </section>

          {userRole === 'artist' && (
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-white mb-2">Creator Features</h3>
              <button 
                onClick={() => onNavigate?.('creator')}
                className="w-full flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white p-4 rounded-xl transition-colors font-medium shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              >
                <LayoutDashboard className="w-5 h-5" />
                Artist Dashboard
              </button>
              <button 
                onClick={() => onNavigate?.('creator')}
                className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-colors font-medium"
              >
                <Upload className="w-5 h-5" />
                Upload New Song
              </button>
              <div className="w-full flex border border-white/10 items-center justify-between bg-black/50 text-white p-4 rounded-xl font-medium">
                <span>Earnings (Future)</span>
                <span className="text-violet-400">$0.00</span>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Library & Activity */}
        <div className="lg:w-2/3 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Library Activity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigate?.('library:liked')}
                className="bg-gradient-to-br from-violet-900/50 to-blue-900/50 p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform border border-white/5"
              >
                <Heart className="w-8 h-8 text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-1">Liked Songs ❤️</h3>
                <p className="text-sm text-zinc-300">View liked tracks</p>
              </div>
              <div 
                onClick={() => onNavigate?.('library:playlists')}
                className="bg-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5"
              >
                <ListMusic className="w-8 h-8 text-violet-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-1">Your Playlists 🎵</h3>
                <p className="text-sm text-zinc-400">View created playlists</p>
              </div>
              <div 
                onClick={() => onNavigate?.('library:downloaded')}
                className="bg-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5"
              >
                <Download className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-1">Downloaded Songs 📥</h3>
                <p className="text-sm text-zinc-400">Ready offline</p>
              </div>
              <div 
                onClick={scrollToHistory}
                className="bg-white/5 p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5"
              >
                <History className="w-8 h-8 text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-1">Watch History 🕒</h3>
                <p className="text-sm text-zinc-400">Past activity</p>
              </div>
            </div>
          </section>

          {recentlyPlayed.length > 0 && (
            <section id="recently-played" className="scroll-mt-24">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-violet-400" />
                <h3 className="text-2xl font-bold text-white">Recently Played 🕒</h3>
              </div>
              <div className="space-y-2">
                {recentlyPlayed.slice(0, 10).map((track, i) => (
                  <div key={track.id + i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <span className="text-sm font-medium text-zinc-500 w-4 text-center">{i + 1}</span>
                    <div 
                      className="relative w-12 h-12 rounded-md overflow-hidden cursor-pointer"
                      onClick={() => onPlay?.(track, recentlyPlayed)}
                    >
                      <img src={track.coverUrl} className="w-full h-full object-cover" alt={track.title} />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onPlay?.(track, recentlyPlayed)}>
                      <p className="text-base text-white font-medium truncate group-hover:text-violet-400 transition-colors">{track.title}</p>
                      <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                    </div>
                    <span className="text-sm text-zinc-500">Recently</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
