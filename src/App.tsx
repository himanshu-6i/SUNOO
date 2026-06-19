import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { TopBar } from './components/TopBar';
import { HomeFeed } from './components/HomeFeed';
import { CreatorDashboard } from './components/CreatorDashboard';
import { SearchView } from './components/SearchView';
import { LibraryView } from './components/LibraryView';
import { LoginView } from './components/LoginView';
import { PremiumView } from './components/PremiumView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { ViewState, Track, Notification, Playlist } from './types';
import { trendingTracks, aiPlaylists, initialNotifications, currentUser as mockUser } from './data';
import { auth, db, storage } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { supabase } from './supabase';

export default function App() {
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState | string>('home');
  const [libraryTab, setLibraryTab] = useState<'liked' | 'playlists' | 'downloaded' | 'uploaded'>('liked');
  const [history, setHistory] = useState<string[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>('Free');
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [downloadedTracks, setDownloadedTracks] = useState<Track[]>([]);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [trackToAddToPlaylist, setTrackToAddToPlaylist] = useState<Track | null>(null);
  
  const [allTracks, setAllTracks] = useState<Track[]>(trendingTracks);
  const [queue, setQueue] = useState<Track[]>(allTracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTrack = queue[currentIndex] || null;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.8);
  
  // Provide some initial mock liked tracks
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set([allTracks[0].id, allTracks[2].id]));

  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync audio state with player
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;
      const willSourceChange = audio.src !== currentTrack.audioUrl && currentTrack.audioUrl;
      
      if (willSourceChange) {
        audio.src = currentTrack.audioUrl;
      }
      
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            if (err.name !== 'AbortError') {
              console.error("Playback prevented:", err);
            }
          });
        }
      } else {
        audio.pause();
      }
    }
  }, [currentIndex, currentTrack, isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Check login on startup
  useEffect(() => {
    let unsubscribe: () => void;
    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setSessionUser(user);
        setIsAuthenticated(!!user);
        setIsAuthLoading(false);
      });
    } catch (e: any) {
      console.error(e);
      setInitError(e.message);
      setIsAuthLoading(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribe: () => void;
    
    const fetchTracks = async () => {
      try {
        const tracksRef = collection(db, 'tracks');
        const q = query(tracksRef, where('visibility', '==', 'public'));
        
        const fetchInitial = async () => {
          const snapshot = await getDocs(q);
          const fetchedTracks = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Track[];
          
          setAllTracks(prev => {
            const localOnly = prev.filter(p => !fetchedTracks.some(f => f.id === p.id) && !p.createdAt); 
            return [...fetchedTracks, ...localOnly];
          });
        };
        fetchInitial();

        unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedTracks = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Track[];
          
          setAllTracks(prev => {
            const localOnly = prev.filter(p => !fetchedTracks.some(f => f.id === p.id) && !p.createdAt); 
            return [...fetchedTracks, ...localOnly];
          });
        }, (error) => {
          console.error("Firestore onSnapshot error", error);
        });
      } catch (err) {
        console.error("Failed to fetch tracks", err);
      }
    };

    fetchTracks();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setIsPlaying(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(formatTime(current));
      setDuration(formatTime(total));
      setProgress(total > 0 ? current / total : 0);

      if ('mediaSession' in navigator && !isNaN(total) && total > 0) {
        try {
          navigator.mediaSession.setPositionState({
            duration: total,
            playbackRate: audioRef.current.playbackRate,
            position: current,
          });
        } catch (e) {
          // Ignore state update errors
        }
      }
    }
  };

  const handleEnded = () => playNext();

  const playNext = () => {
    if (queue.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % queue.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (queue.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist || 'Unknown Artist',
        album: currentTrack.genre,
        artwork: [
          { src: currentTrack.coverUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        setIsPlaying(true);
        if (audioRef.current) audioRef.current.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', playPrev);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
      navigator.mediaSession.setActionHandler('seekto', (details) => {
         if (details.seekTime && audioRef.current) {
           audioRef.current.currentTime = details.seekTime;
         }
      });
    }
  }, [currentTrack, queue, isPlaying]);

  const handlePlayTrack = (track: Track, newQueue?: Track[]) => {
    const q = newQueue && newQueue.length > 0 ? newQueue : [track];
    setQueue(q);
    const idx = q.findIndex(t => t.id === track.id);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setIsPlaying(true);

    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 10);
    });
  };

  const handleSeek = (percent: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q && currentView !== 'search') handleNavigate('search');
    if (!q && currentView === 'search') handleNavigate('home');
  };

  const toggleLike = (trackId: string) => {
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (initError) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-lg">
          <h1 className="text-xl font-bold text-red-500 mb-4">Configuration Error</h1>
          <p className="text-zinc-300 mb-6">{initError}</p>
          <p className="text-sm text-zinc-500">
            It looks like Firebase might not be configured properly. Please use the set_up_firebase tool.
          </p>
        </div>
      </div>
    );
  }

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 flex border-2 border-violet-500 border-r-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  const handleTrackUpload = async (newTrack: Track, files?: { audio: File | null; cover: File | null }) => {
    if (!sessionUser) return;
    
    try {
      const trackId = `t_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      
      let audioDownloadUrl = newTrack.audioUrl;
      let coverDownloadUrl = newTrack.coverUrl;

      if (files?.audio) {
        const safeName = files.audio.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const audioPath = `audio_${Date.now()}_${safeName}`;
        const { error } = await supabase.storage.from('tracks').upload(audioPath, files.audio);
        if (error) throw new Error(`Supabase Audio Upload Error: ${error.message}`);
        
        const { data: { publicUrl } } = supabase.storage.from('tracks').getPublicUrl(audioPath);
        audioDownloadUrl = publicUrl;
      }

      if (files?.cover) {
        const safeName = files.cover.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const coverPath = `cover_${Date.now()}_${safeName}`;
        const { error } = await supabase.storage.from('tracks').upload(coverPath, files.cover);
        if (error) throw new Error(`Supabase Cover Upload Error: ${error.message}`);
        
        const { data: { publicUrl } } = supabase.storage.from('tracks').getPublicUrl(coverPath);
        coverDownloadUrl = publicUrl;
      }
      
      const dbTrack = {
        title: newTrack.title,
        artist: newTrack.artist,
        coverUrl: coverDownloadUrl || '',
        duration: newTrack.duration,
        audioUrl: audioDownloadUrl || '',
        genre: newTrack.genre,
        plays: 0,
        ownerId: sessionUser.uid,
        visibility: 'public',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'tracks', trackId), dbTrack);
      
      const finalTrack = { ...newTrack, id: trackId, audioUrl: audioDownloadUrl || '', coverUrl: coverDownloadUrl || '', ownerId: sessionUser.uid, visibility: 'public' as const };
      
      const nextTracks = [finalTrack, ...allTracks];
      setAllTracks(nextTracks);
      
      setLikedTrackIds(prev => {
        const newSet = new Set(prev);
        newSet.add(finalTrack.id);
        return newSet;
      });

      handlePlayTrack(finalTrack, nextTracks);
      handleNavigate('library:uploaded');
    } catch (e: any) {
      console.error("Failed to upload track: ", e);
      throw e;
    }
  };

  const handleCreatePlaylist = (name: string, firstTrack: Track) => {
    const newPlaylist: Playlist = {
      id: `p_${Date.now()}`,
      title: name,
      creator: 'You',
      coverUrl: firstTrack.coverUrl,
      tracks: [firstTrack]
    };
    setUserPlaylists(prev => [...prev, newPlaylist]);
  };

  const handleAddToPlaylist = (playlistId: string, track: Track) => {
    setUserPlaylists(prev => prev.map(p => {
      if (p.id === playlistId && !p.tracks.some(t => t.id === track.id)) {
        return { ...p, tracks: [...p.tracks, track], coverUrl: p.coverUrl || track.coverUrl };
      }
      return p;
    }));
  };

  const handleSaveMix = () => {
    const newPlaylist: Playlist = {
      id: `p_${Date.now()}`,
      title: 'Your Evening Flow',
      creator: 'Sunoo AI',
      coverUrl: allTracks[0]?.coverUrl || '',
      tracks: [...allTracks],
    };
    setUserPlaylists(prev => {
      if (prev.some(p => p.title === 'Your Evening Flow')) {
        return prev;
      }
      return [...prev, newPlaylist];
    });
    setNotifications(prev => [
      {
        id: `n_${Date.now()}`,
        title: 'Mix Saved',
        message: 'Your Evening Flow has been saved to your playlists.',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const applyView = (view: string) => {
    if (view.startsWith('library:')) {
      setCurrentView('library');
      setLibraryTab(view.split(':')[1] as 'liked' | 'playlists' | 'downloaded' | 'uploaded');
    } else {
      setCurrentView(view as ViewState);
    }
  };

  const handleNavigate = (view: string) => {
    if (history[historyIndex] !== view) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(view);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    applyView(view);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      applyView(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      applyView(history[newIndex]);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      await deleteDoc(doc(db, 'tracks', trackId));
      
      setAllTracks(prev => prev.filter(t => t.id !== trackId));
      
      setLikedTrackIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(trackId);
        return newSet;
      });
      
      if (currentTrack?.id === trackId) {
        setIsPlaying(false);
      }
    } catch (e: any) {
      console.error("Failed to delete track:", e);
      alert(`Failed to delete track: ${e.message}`);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeFeed 
                 trending={allTracks} 
                 aiPlaylists={aiPlaylists} 
                 recentlyPlayed={recentlyPlayed} 
                 onPlay={handlePlayTrack} 
                 onSaveMix={handleSaveMix} 
                 isMixSaved={userPlaylists.some(p => p.title === 'Your Evening Flow')} 
               />;
      case 'creator':
        return <CreatorDashboard tracks={allTracks} onPlay={handlePlayTrack} onTrackUpload={handleTrackUpload} />;
      case 'search':
        return <SearchView query={searchQuery} tracks={allTracks} onPlay={handlePlayTrack} onGenreSelect={handleSearchChange} />;
      case 'library': {
        const liked = allTracks.filter(t => likedTrackIds.has(t.id));
        const currentUid = sessionUser?.uid;
        const userName = sessionUser?.displayName || mockUser.name;
        const isAdmin = sessionUser?.email === 'hm5080408@gmail.com';
        const uploaded = allTracks.filter(t => t.ownerId === currentUid || isAdmin || (currentUid ? false : t.artist === userName));
        return <LibraryView likedTracks={liked} playlists={userPlaylists} downloadedTracks={downloadedTracks} uploadedTracks={uploaded} onPlay={handlePlayTrack} onRemoveLike={toggleLike} onPlayPlaylist={(p) => handlePlayTrack(p.tracks[0], p.tracks)} defaultTab={libraryTab} onDeleteTrack={handleDeleteTrack} />;
      }
      case 'premium':
        return <PremiumView currentPlan={subscriptionPlan} onSubscribe={setSubscriptionPlan} />;
      case 'profile':
        return <ProfileView tracks={allTracks} recentlyPlayed={recentlyPlayed} onNavigate={handleNavigate} onPlay={handlePlayTrack} />;
      case 'settings':
        return <SettingsView currentPlan={subscriptionPlan} />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-zinc-500 pb-32">
            <p className="text-xl font-medium tracking-tight">View under construction</p>
          </div>
        );
    }
  };

  const displayDuration = duration === '0:00' || duration === 'NaN:NaN' ? (currentTrack?.duration || '0:00') : duration;

  return (
    <div className="h-screen w-full bg-black text-white flex overflow-hidden selection:bg-violet-500/30">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
        playsInline
      />
      <Sidebar currentView={currentView} setView={handleNavigate} subscriptionPlan={subscriptionPlan} />
      <main className="flex-1 flex flex-col relative bg-[#121212]">
        <TopBar 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onBack={goBack}
          onForward={goForward}
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < history.length - 1}
        />
        {renderContent()}
      </main>
      <Player 
        currentTrack={currentTrack} 
        isPlaying={isPlaying}
        progress={progress}
        currentTime={currentTime}
        duration={displayDuration}
        volume={volume}
        isLiked={currentTrack ? likedTrackIds.has(currentTrack.id) : false}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={playNext}
        onPrev={playPrev}
        onSeek={handleSeek}
        onVolumeChange={setVolume}
        onToggleLike={() => currentTrack && toggleLike(currentTrack.id)}
        onDownload={(track) => {
          setDownloadedTracks(prev => {
            if (!prev.find(t => t.id === track.id)) {
              return [...prev, track];
            }
            return prev;
          });
        }}
        onAddToPlaylist={() => {
          if (currentTrack) {
            setTrackToAddToPlaylist(currentTrack);
            setIsPlaylistModalOpen(true);
          }
        }}
      />
      {isPlaylistModalOpen && trackToAddToPlaylist && (
        <AddToPlaylistModal 
          track={trackToAddToPlaylist}
          playlists={userPlaylists}
          onClose={() => {
            setIsPlaylistModalOpen(false);
            setTrackToAddToPlaylist(null);
          }}
          onCreatePlaylist={handleCreatePlaylist}
          onAddToPlaylist={handleAddToPlaylist}
        />
      )}
    </div>
  );
}
