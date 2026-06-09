import { useState, useEffect } from 'react';
import { Play, HeartOff, Music, ListMusic, Download, Upload, Trash2 } from 'lucide-react';
import { Track, Playlist } from '../types';

interface LibraryViewProps {
  likedTracks: Track[];
  playlists: Playlist[];
  downloadedTracks: Track[];
  uploadedTracks: Track[];
  defaultTab?: 'liked' | 'playlists' | 'downloaded' | 'uploaded';
  onPlay: (track: Track, queue: Track[]) => void;
  onRemoveLike: (trackId: string) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  onDeleteTrack?: (trackId: string) => void;
}

export function LibraryView({ likedTracks, playlists, downloadedTracks, uploadedTracks, defaultTab = 'liked', onPlay, onRemoveLike, onPlayPlaylist, onDeleteTrack }: LibraryViewProps) {
  const [activeTab, setActiveTab] = useState<'liked' | 'playlists' | 'downloaded' | 'uploaded'>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

   return (
    <div className="flex-1 overflow-y-auto pb-32 p-8">
       <h1 className="text-4xl font-bold tracking-tighter text-white mb-8">Your Library</h1>
       
       <div className="flex gap-4 mb-8">
         <button 
           onClick={() => setActiveTab('liked')}
           className={`px-4 py-2 flex items-center gap-2 rounded-full transition-colors text-sm font-medium ${activeTab === 'liked' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
           <HeartOff className="w-4 h-4" /> Liked Tracks
         </button>
         <button 
           onClick={() => setActiveTab('playlists')}
           className={`px-4 py-2 flex items-center gap-2 rounded-full transition-colors text-sm font-medium ${activeTab === 'playlists' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
           <ListMusic className="w-4 h-4" /> Your Playlists
         </button>
         <button 
           onClick={() => setActiveTab('downloaded')}
           className={`px-4 py-2 flex items-center gap-2 rounded-full transition-colors text-sm font-medium ${activeTab === 'downloaded' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
           <Download className="w-4 h-4" /> Downloaded
         </button>
         <button 
           onClick={() => setActiveTab('uploaded')}
           className={`px-4 py-2 flex items-center gap-2 rounded-full transition-colors text-sm font-medium ${activeTab === 'uploaded' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
           <Upload className="w-4 h-4" /> Uploaded Songs
         </button>
       </div>

       {activeTab === 'liked' && (
         <>
           {likedTracks.length === 0 ? (
             <div className="text-zinc-500 bg-white/5 rounded-2xl p-12 text-center border border-white/5">
                <p className="text-lg text-white font-medium">You haven't liked any songs yet.</p>
                <p className="text-sm mt-2 text-zinc-400">Heart a track while listening to add it to your library.</p>
             </div>
           ) : (
             <div className="space-y-2">
                <div className="grid grid-cols-[48px_1fr_1fr_48px] gap-4 px-4 py-2 text-sm text-zinc-500 border-b border-white/5 mb-2">
                  <span className="text-center">Play</span>
                  <span>Title</span>
                  <span>Genre</span>
                  <span className="text-right pr-2">Unlike</span>
               </div>
                {likedTracks.map((track) => (
                  <div 
                    key={track.id} 
                    className="group grid grid-cols-[48px_1fr_1fr_48px] gap-4 px-4 py-3 rounded-lg hover:bg-white/5 items-center transition-colors"
                  >
                    <div 
                      className="relative w-10 h-10 rounded overflow-hidden cursor-pointer"
                      onClick={() => onPlay(track, likedTracks)}
                    >
                      <img src={track.coverUrl} className="w-full h-full object-cover" alt={track.title} />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <Play className="w-4 h-4 text-white fill-current ml-1" />
                      </div>
                    </div>
                    <div className="cursor-pointer truncate" onClick={() => onPlay(track, likedTracks)}>
                      <p className="text-white font-medium group-hover:text-violet-400 transition-colors truncate">{track.title}</p>
                      <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                    </div>
                    <div className="text-sm text-zinc-400 font-mono truncate">{track.genre}</div>
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => onRemoveLike(track.id)}
                        className="text-violet-500 hover:text-white p-2 transition-colors focus:outline-none"
                        title="Remove from Liked Tracks"
                      >
                        <HeartOff className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
             </div>
           )}
         </>
       )}

       {activeTab === 'playlists' && (
         <>
           {playlists.length === 0 ? (
             <div className="text-zinc-500 bg-white/5 rounded-2xl p-12 text-center border border-white/5">
                <p className="text-lg text-white font-medium">No playlists created.</p>
                <p className="text-sm mt-2 text-zinc-400">Click the + icon in the player to add songs to a new playlist.</p>
             </div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {playlists.map((playlist) => (
                 <div 
                   key={playlist.id} 
                   className="bg-black/40 border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                   onClick={() => onPlayPlaylist(playlist)}
                 >
                   <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-zinc-800">
                     {playlist.coverUrl ? (
                        <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-12 h-12 text-zinc-600" />
                        </div>
                     )}
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-black/50 transform translate-y-4 group-hover:translate-y-0 transition-all">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                     </div>
                   </div>
                   <h3 className="font-semibold text-white text-lg truncate mb-1 group-hover:text-violet-400 transition-colors">{playlist.title}</h3>
                   <p className="text-sm text-zinc-400 truncate">{playlist.tracks.length} tracks • By {playlist.creator}</p>
                 </div>
               ))}
             </div>
           )}
         </>
       )}

       {activeTab === 'downloaded' && (
         <>
           {downloadedTracks.length === 0 ? (
             <div className="text-zinc-500 bg-white/5 rounded-2xl p-12 text-center border border-white/5">
                <p className="text-lg text-white font-medium">No downloaded songs yet.</p>
                <p className="text-sm mt-2 text-zinc-400">Download a track from the player to see it here.</p>
             </div>
           ) : (
             <div className="space-y-2">
                <div className="grid grid-cols-[48px_1fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-500 border-b border-white/5 mb-2">
                  <span className="text-center">Play</span>
                  <span>Title</span>
                  <span>Genre</span>
               </div>
                {downloadedTracks.map((track) => (
                  <div 
                    key={track.id} 
                    className="group grid grid-cols-[48px_1fr_1fr] gap-4 px-4 py-3 rounded-lg hover:bg-white/5 items-center transition-colors"
                  >
                    <div 
                      className="relative w-10 h-10 rounded overflow-hidden cursor-pointer"
                      onClick={() => onPlay(track, downloadedTracks)}
                    >
                      <img src={track.coverUrl} className="w-full h-full object-cover" alt={track.title} />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <Play className="w-4 h-4 text-white fill-current ml-1" />
                      </div>
                    </div>
                    <div className="cursor-pointer truncate" onClick={() => onPlay(track, downloadedTracks)}>
                      <p className="text-white font-medium group-hover:text-violet-400 transition-colors truncate">{track.title}</p>
                      <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                    </div>
                    <div className="text-sm text-zinc-400 font-mono truncate">{track.genre}</div>
                  </div>
                ))}
             </div>
           )}
         </>
       )}

       {activeTab === 'uploaded' && (
         <>
           {uploadedTracks.length === 0 ? (
             <div className="text-zinc-500 bg-white/5 rounded-2xl p-12 text-center border border-white/5">
                <p className="text-lg text-white font-medium">No uploaded songs yet.</p>
                <p className="text-sm mt-2 text-zinc-400">Head to the Creator dashboard to upload your first track.</p>
             </div>
           ) : (
             <div className="space-y-2">
                <div className="grid grid-cols-[48px_1fr_1fr_48px] gap-4 px-4 py-2 text-sm text-zinc-500 border-b border-white/5 mb-2">
                  <span className="text-center">Play</span>
                  <span>Title</span>
                  <span>Genre</span>
                  <span className="text-right pr-2">Delete</span>
               </div>
                {uploadedTracks.map((track) => (
                  <div 
                    key={track.id} 
                    className="group grid grid-cols-[48px_1fr_1fr_48px] gap-4 px-4 py-3 rounded-lg hover:bg-white/5 items-center transition-colors"
                  >
                    <div 
                      className="relative w-10 h-10 rounded overflow-hidden cursor-pointer"
                      onClick={() => onPlay(track, uploadedTracks)}
                    >
                      <img src={track.coverUrl} className="w-full h-full object-cover" alt={track.title} />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <Play className="w-4 h-4 text-white fill-current ml-1" />
                      </div>
                    </div>
                    <div className="cursor-pointer truncate" onClick={() => onPlay(track, uploadedTracks)}>
                      <p className="text-white font-medium group-hover:text-violet-400 transition-colors truncate">{track.title}</p>
                      <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                    </div>
                    <div className="text-sm text-zinc-400 font-mono truncate">{track.genre}</div>
                    <div className="flex items-center justify-end">
                      {onDeleteTrack && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTrack(track.id);
                          }}
                          className="text-zinc-500 hover:text-red-500 p-2 transition-colors focus:outline-none"
                          title="Delete Track"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
             </div>
           )}
         </>
       )}
    </div>
   );
}
