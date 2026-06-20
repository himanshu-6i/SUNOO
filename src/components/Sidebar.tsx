import { useState } from 'react';
import { Home, Search, Library, LayoutDashboard, PlusCircle, Heart, Grid, Music, Target, UploadCloud, Compass, Scissors, Crown, Users } from 'lucide-react';
import { ViewState, Artist } from '../types';
import { SunooLogo } from './SunooLogo';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  subscriptionPlan: string;
  popularArtists?: Artist[];
  onArtistClick?: (artist: Artist) => void;
  onNewPlaylist?: () => void;
}

export function Sidebar({ currentView, setView, subscriptionPlan, popularArtists = [], onArtistClick, onNewPlaylist }: SidebarProps) {
  const [showAllArtists, setShowAllArtists] = useState(false);
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'library', icon: Library, label: 'Your Library' },
  ];

  const aiTools = [
    { id: 'ai-generator', icon: Scissors, label: 'AI Music Generator', badge: 'New' },
    { id: 'creator', icon: LayoutDashboard, label: 'Creator Dashboard' },
    { id: 'upload', icon: UploadCloud, label: 'Upload Song' },
  ];

  const playlists = [
    { id: 'liked', icon: Heart, label: 'Liked Songs' },
    { id: 'followed-artists', icon: Users, label: 'Followed Artists' },
    { id: 'my-ai', icon: Grid, label: 'My AI Creations' },
    { id: 'chill', icon: Music, label: 'Chill Vibes' },
    { id: 'workout', icon: Target, label: 'Workout Mix' },
    { id: 'focus', icon: Compass, label: 'Focus Flow' },
    { id: 'new-playlist', icon: PlusCircle, label: 'New Playlist', isAction: true },
  ];

  return (
    <div className="w-[280px] bg-[#0A0A0A] flex flex-col h-full border-r border-[#222] pb-24 overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-3">
          <SunooLogo className="w-8 h-8" />
          SUNOO
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-8">
        <div className="space-y-[2px]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium relative overflow-hidden ${
                currentView === item.id 
                  ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {currentView === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-600 to-fuchsia-600 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </div>

        <div>
          <p className="px-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">AI Tools</p>
          <div className="space-y-[2px]">
             {aiTools.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id === 'upload' ? 'creator' : item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium relative overflow-hidden ${
                  currentView === item.id 
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {currentView === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-600 to-fuchsia-600 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                )}
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-[10px] text-white px-2 py-0.5 rounded font-bold tracking-wide ml-2 whitespace-nowrap">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="px-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Playlists</p>
          <div className="space-y-[2px]">
             {playlists.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'new-playlist') {
                    if (onNewPlaylist) onNewPlaylist();
                  } else {
                    setView(item.id);
                  }
                }}
                 className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-2xl transition-all duration-300 font-medium relative overflow-hidden ${
                  currentView === item.id || (item.id === 'liked' && currentView === 'library')
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-white'
                    : item.isAction ? 'text-zinc-300 mt-2 hover:text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {currentView === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-600 to-fuchsia-600 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-2">
           <div className="bg-[#18181b] border border-[#2a2a2a] p-5 rounded-2xl relative overflow-hidden">
             <div className="flex items-center gap-2 mb-2">
               <Crown className="w-4 h-4 text-orange-400 fill-orange-400" />
               <p className="text-sm font-bold text-white">Upgrade to Pro</p>
             </div>
             <p className="text-[13px] text-zinc-400 mb-4 leading-snug">Unlock high quality audio, offline listening & more.</p>
             <button 
               onClick={() => setView('premium')}
               className="w-full bg-gradient-to-r from-[#a22bd8] via-[#e24e5b] to-[#f47f4d] text-white text-sm font-bold py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(226,78,91,0.4)] hover:opacity-90"
             >
               Upgrade Now
             </button>
           </div>
        </div>

        <div className="pt-2 pb-6">
          <div className="flex items-center justify-between px-4 mb-4">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Popular Artists</p>
            {popularArtists.length > 5 && (
              <span className="text-[11px] text-zinc-400 hover:text-white cursor-pointer transition-colors" onClick={() => setShowAllArtists(!showAllArtists)}>
                {showAllArtists ? 'Show less' : 'View all'}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 px-2">
             {(showAllArtists ? popularArtists : popularArtists.slice(0, 5)).map(artist => (
               <div key={artist.id} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-white/5 transition-colors" onClick={() => onArtistClick?.(artist)}>
                  <img src={artist.imageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[13px] font-medium text-zinc-300 group-hover:text-fuchsia-400 transition-colors truncate">{artist.name}</span>
                    <span className="text-[11px] text-zinc-500">Artist</span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
