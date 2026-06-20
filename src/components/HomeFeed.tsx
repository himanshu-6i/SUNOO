import { Play, Sparkles, Clock, Flame, Music, Heart, MoreHorizontal } from 'lucide-react';
import { Track, Playlist, Artist } from '../types';
import { motion } from 'motion/react';

interface HomeFeedProps {
  trending: Track[];
  aiPlaylists: Playlist[];
  recentlyPlayed: Track[];
  popularArtists?: Artist[];
  onPlay: (track: Track, contextQueue: Track[]) => void;
  onSaveMix?: () => void;
  isMixSaved?: boolean;
  onArtistClick?: (artist: Artist) => void;
  onGenerateClick?: () => void;
}

export function HomeFeed({ trending, aiPlaylists, recentlyPlayed, popularArtists = [], onPlay, onSaveMix, isMixSaved, onArtistClick, onGenerateClick }: HomeFeedProps) {
  
  const quickLinks = [
    { icon: <Music className="w-6 h-6 text-[#a22bd8]" />, title: 'AI Generated', desc: 'Songs created by AI for you' },
    { icon: <Flame className="w-6 h-6 text-orange-500" />, title: 'Trending Now', desc: 'Most popular AI songs' },
    { icon: <Sparkles className="w-6 h-6 text-pink-400" />, title: 'New Releases', desc: 'Latest AI songs and albums' },
    { icon: <Heart className="w-6 h-6 text-rose-500" />, title: 'For You', desc: 'Personalized recommendations' },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-32 bg-[#050505] custom-scrollbar">
      <div className="p-8 max-w-[1400px] mx-auto space-y-12">
        {/* Hero Banner */}
        <div className="relative rounded-[2rem] bg-[#0f0f13] border border-white/5 overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0b2e]/50 to-transparent z-0" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 p-10 md:p-14 md:pr-0 md:w-[60%] lg:w-[50%]"
          >
            <div className="flex items-center gap-2 text-[#e24e5b] font-bold text-xs tracking-widest mb-6 uppercase">
              <Sparkles className="w-4 h-4" />
              <span>AI Powered Music</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
               Create. Upload.<br />Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a22bd8] via-[#e24e5b] to-[#f47f4d]">AI Music.</span>
            </h1>
            <p className="text-zinc-400 text-[15px] md:text-[17px] mb-10 max-w-md leading-relaxed">
               The future of music is here. Generate, upload and stream AI-powered songs in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => trending.length > 0 && onPlay(trending[0], trending)}
                className="px-8 py-3.5 bg-gradient-to-r from-[#e24e5b] to-[#f47f4d] text-white font-bold rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-[#e24e5b]/20"
              >
                <Play className="w-5 h-5 fill-current" />
                Play Mix
              </button>
              <button 
                onClick={onGenerateClick}
                className="px-8 py-3.5 bg-[#18181b] border border-white/10 text-white font-bold rounded-full hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-orange-400" />
                Generate Song
              </button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-[55%] flex items-center justify-center overflow-hidden pointer-events-none z-0"
          >
             {/* Central Profile Image seamlessly blended */}
             <div className="absolute inset-0 z-10 overflow-hidden">
               {/* Blending Gradients to make the image fade perfectly into the dark background */}
               <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0f0f13] via-[#0f0f13]/80 to-transparent z-20" />
               <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0f0f13] via-[#0f0f13]/80 to-transparent z-20" />
               <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/80 to-transparent z-20" />
               <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0f0f13] via-[#0f0f13]/80 to-transparent z-20" />
               
               <img 
                 src="/hero.png" 
                 onError={(e) => {
                   e.currentTarget.src = "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1000&auto=format&fit=crop";
                 }}
                 alt="AI Music DJ" 
                 className="w-full h-full object-cover object-center max-w-[600px] mx-auto mix-blend-screen opacity-100"
               />
             </div>
          </motion.div>
        </div>

        {/* Quick Links Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {quickLinks.map((link, i) => (
             <div key={i} className="bg-[#121215] border border-white/5 p-5 rounded-[1.5rem] flex items-center gap-4 hover:bg-[#18181b] transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {link.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-0.5">{link.title}</h3>
                  <p className="text-zinc-500 text-[11px] leading-tight">{link.desc}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Made For You Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-[22px] font-bold text-white tracking-tight">Made For You</h2>
             <span className="text-[13px] font-medium text-zinc-400 hover:text-white cursor-pointer transition-colors flex items-center">View all <ChevronRight className="w-4 h-4 ml-1"/></span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {aiPlaylists.map((playlist) => (
              <div key={playlist.id} className="group bg-transparent transition-all cursor-pointer">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-[1.5rem] shadow-lg">
                  <img src={playlist.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={playlist.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); onPlay(playlist.tracks[0], playlist.tracks); }}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                  >
                    <Play className="w-6 h-6 text-black fill-current ml-1" />
                  </button>
                </div>
                <h3 className="text-white font-bold text-[15px] mb-1 truncate">{playlist.title}</h3>
                <p className="text-[12px] text-zinc-500 truncate">AI Curated</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trending AI Songs */}
        <section>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-[22px] font-bold text-white tracking-tight">Trending AI Songs</h2>
             <span className="text-[13px] font-medium text-zinc-400 hover:text-white cursor-pointer transition-colors flex items-center">View all <ChevronRight className="w-4 h-4 ml-1"/></span>
          </div>
          <div>
            <div className="grid grid-cols-[32px_3fr_2fr_1fr_1fr_40px] gap-4 px-4 py-2 mb-2 text-[11px] font-bold tracking-wider text-zinc-500 uppercase border-b border-white/5">
              <span className="text-center">#</span>
              <span>Title</span>
              <span>Artist</span>
              <span>Plays</span>
              <span>Duration</span>
              <span className="text-center flex justify-center"><Clock className="w-4 h-4" /></span>
            </div>
            <div className="space-y-1">
              {trending.slice(0, 5).map((track, idx) => (
                <div 
                  key={track.id} 
                  onClick={() => onPlay(track, trending)}
                  className="group grid grid-cols-[32px_3fr_2fr_1fr_1fr_40px] gap-4 px-6 py-3 rounded-xl hover:bg-white/5 items-center cursor-pointer transition-colors"
                >
                  <div className="text-[13px] text-zinc-500 group-hover:text-white flex items-center justify-center font-mono">
                     <span className="group-hover:hidden">{idx + 1}</span>
                     <Play className="w-4 h-4 fill-current hidden group-hover:block" />
                  </div>
                  <div className="flex items-center gap-4 overflow-hidden">
                    <img src={track.coverUrl} className="w-[42px] h-[42px] rounded-lg object-cover flex-shrink-0 shadow-md" alt={track.title} />
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                         <p className="text-[14px] text-white font-bold group-hover:text-[#a22bd8] transition-colors truncate">{track.title}</p>
                         <span className="bg-[#a22bd8] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded leading-none">AI</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[13px] text-zinc-400 font-medium truncate">{track.artist}</div>
                  <div className="text-[13px] text-zinc-400 font-medium">
                    {/* Format plays as millions e.g. 2.1M if over 1M */}
                    {track.plays > 1000000 ? `${(track.plays / 1000000).toFixed(1)}M` : track.plays > 1000 ? `${(track.plays / 1000).toFixed(1)}K` : track.plays.toLocaleString()}
                  </div>
                  <div className="text-[13px] text-zinc-400 font-medium">
                    {track.duration}
                  </div>
                  <div className="flex justify-center">
                    <button className="text-zinc-500 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); }}>
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Artists Row */}
        {popularArtists.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-bold text-white tracking-tight">AI Artists</h2>
              <span className="text-[13px] font-medium text-zinc-400 hover:text-white cursor-pointer transition-colors flex items-center">View all <ChevronRight className="w-4 h-4 ml-1"/></span>
            </div>
            <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide snap-x">
              {popularArtists.map((artist) => (
                <div key={artist.id} className="group flex flex-col items-center gap-4 cursor-pointer snap-start shrink-0" onClick={() => onArtistClick?.(artist)}>
                  <div className="relative w-[140px] h-[140px] rounded-full p-[3px] bg-gradient-to-b from-[#a22bd8] to-[#f47f4d] group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-black overflow-hidden border-[4px] border-[#121215]">
                       <img src={artist.imageUrl} className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500" alt={artist.name} />
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-[14px] truncate text-center w-[140px] px-2">{artist.name}</h3>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
