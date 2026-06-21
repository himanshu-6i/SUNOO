import { useState, useRef, useEffect, useMemo } from 'react';
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
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { UpdatingSoonView } from './components/UpdatingSoonView';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { AIChatModal } from './components/AIChatModal';
import { ArtistView } from './components/ArtistView';
import { FollowedArtistsView } from './components/FollowedArtistsView';
import { GenrePlaylistView } from './components/GenrePlaylistView';
import { ViewState, Track, Notification, Playlist, Artist } from './types';
import { trendingTracks, aiPlaylists, initialNotifications, currentUser as mockUser, popularArtists } from './data';
import { auth, db, storage } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, getDocs, doc, setDoc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, listAll, deleteObject, getDownloadURL, uploadBytes } from 'firebase/storage';

export default function App() {
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState | string>('home');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
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
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [isAiChatModalOpen, setIsAiChatModalOpen] = useState(false);
  const [trackToAddToPlaylist, setTrackToAddToPlaylist] = useState<Track | null>(null);
  
  const [allTracks, setAllTracks] = useState<Track[]>(trendingTracks);
  const [followedArtistIds, setFollowedArtistIds] = useState<Set<string>>(new Set());
  
  const dynamicUserPlaylists = useMemo(() => {
    return userPlaylists.map(playlist => {
      const pTitle = playlist.title.toLowerCase();
      const matchedTracks = allTracks.filter(t => 
        t.genre?.toLowerCase() === pTitle ||
        t.title.toLowerCase().includes(pTitle) ||
        t.artist?.toLowerCase() === pTitle
      );
      
      const combinedTracks = [...playlist.tracks];
      matchedTracks.forEach(mt => {
        if (!combinedTracks.some(t => t.id === mt.id)) {
          combinedTracks.push(mt);
        }
      });
      return {
        ...playlist,
        tracks: combinedTracks,
        coverUrl: playlist.coverUrl !== 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80' ? playlist.coverUrl : (combinedTracks[0]?.coverUrl || playlist.coverUrl)
      };
    });
  }, [userPlaylists, allTracks]);
  const [queue, setQueue] = useState<Track[]>(allTracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTrack = queue[currentIndex] || null;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isEQOpen, setIsEQOpen] = useState(false);
  
  // Provide some initial mock liked tracks
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set([allTracks[0].id, allTracks[2].id]));

  const dynamicArtists = useMemo(() => {
    const artistsMap = new Map<string, Artist>();
    
    // Add default popular artists first
    popularArtists.forEach(artist => {
      artistsMap.set(artist.name, artist);
    });

    // Get user info
    const sessionUserName = sessionUser?.displayName || mockUser.name;
    const sessionUserPhoto = sessionUser?.photoURL || mockUser.avatarUrl;

    // Add unique artists from tracking uploads
    allTracks.forEach(track => {
      if (track.artist && !artistsMap.has(track.artist)) {
        let imageUrl = track.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80';
        
        // If the artist is the current user (by name or ownerId), use their profile photo instead of the track cover
        if (track.artist === sessionUserName || track.ownerId === sessionUser?.uid) {
           imageUrl = sessionUserPhoto || imageUrl;
        }

        artistsMap.set(track.artist, {
          id: `dyn_${track.artist.replace(/\s+/g, '').toLowerCase()}`,
          name: track.artist,
          imageUrl: imageUrl
        });
      }
    });

    return Array.from(artistsMap.values());
  }, [allTracks, sessionUser]);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync audio state with player
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;
      
      if (!currentTrack.audioUrl) {
        console.warn("Track has no audioUrl");
        setIsPlaying(false);
        return;
      }

      // Check if URL actually changed by converting to absolute just in case
      const currentUrlStr = audio.src || '';
      // We do endsWith or construct proper object just to be robust
      const willSourceChange = !currentUrlStr.endsWith(currentTrack.audioUrl);
      
      if (willSourceChange) {
        audio.src = currentTrack.audioUrl;
        audio.load(); // sometimes required when changing src programmatically
      }
      
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            if (err.name !== 'AbortError') {
              console.warn("Playback prevented:", err.message);
              // Wait for user interaction
              setIsPlaying(false);
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
    }
  };

  const handleEnded = () => playNext();

  const playNext = () => {
    if (queue.length === 0) return;
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    if (isShuffle) {
      setCurrentIndex(Math.floor(Math.random() * queue.length));
    } else {
      setCurrentIndex((prev) => (prev + 1) % queue.length);
    }
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (queue.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (isShuffle) {
      setCurrentIndex(Math.floor(Math.random() * queue.length));
    } else {
      setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist || 'Unknown Artist',
        album: currentTrack.genre || 'Single',
        artwork: [
          { src: currentTrack.coverUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' },
        ]
      });
    }
  }, [currentTrack]); // Only recreate metadata when the track changes

  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.setActionHandler('play', () => {
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('previoustrack', playPrev);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
      navigator.mediaSession.setActionHandler('seekto', (details) => {
         if (details.seekTime && audioRef.current) {
           audioRef.current.currentTime = details.seekTime;
         }
      });
    }
  }, [currentTrack, queue, isShuffle, isRepeat]); // Update handlers when these states change

  const handlePlayTrack = async (track: Track, newQueue?: Track[]) => {
    const q = newQueue && newQueue.length > 0 ? newQueue : [track];
    setQueue(q);
    const idx = q.findIndex(t => t.id === track.id);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setIsPlaying(true);

    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 10);
    });

    if (track.createdAt || !track.id.startsWith('t')) { // Ensure it's likely a firestore document
      try {
        const trackRef = doc(db, 'tracks', track.id);
        await updateDoc(trackRef, { plays: increment(1) });
      } catch (err) {
        console.error("Failed to increment plays in Firestore", err);
      }
    }
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

  const toggleFollowArtist = (artistId: string) => {
    setFollowedArtistIds(prev => {
      const next = new Set(prev);
      if (next.has(artistId)) next.delete(artistId);
      else next.add(artistId);
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
        const audioPath = `tracks/audio_${Date.now()}_${safeName}`;
        
        const storageRef = ref(storage, audioPath);
        await uploadBytes(storageRef, files.audio);
        audioDownloadUrl = await getDownloadURL(storageRef);
      }

      if (files?.cover) {
        const safeName = files.cover.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const coverPath = `tracks/cover_${Date.now()}_${safeName}`;
        
        const storageRef = ref(storage, coverPath);
        await uploadBytes(storageRef, files.cover);
        coverDownloadUrl = await getDownloadURL(storageRef);
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

  const handleAITrackGenerated = async (newTrack: Track, audioBase64: string, mimeType: string) => {
    try {
      // Decode base64 to File
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const file = new File([blob], `ai_music_${Date.now()}.wav`, { type: mimeType });
      
      // Upload via the existing handleTrackUpload
      await handleTrackUpload(newTrack, { audio: file, cover: null });
    } catch (error) {
      console.error("Failed to save AI generated track:", error);
    }
  };

  const handleCreateEmptyPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: `p_${Date.now()}`,
      title: name,
      creator: 'You',
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
      tracks: []
    };
    setUserPlaylists(prev => [...prev, newPlaylist]);
    setIsCreatePlaylistModalOpen(false);
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
    if (view === 'ai-generator') {
      setIsGeneratorModalOpen(true);
      return;
    }
    if (view === 'ai-chat') {
      setIsAiChatModalOpen(true);
      return;
    }
    
    let targetView = view;
    if (view === 'liked') {
      targetView = 'library:liked';
    }

    if (history[historyIndex] !== targetView) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(targetView);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    applyView(targetView);
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

  const handleArtistClick = (artist: Artist) => {
    setSelectedArtist(artist);
    handleNavigate('artist');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home': {
        const liked = allTracks.filter(t => likedTrackIds.has(t.id));
        const newReleases = [...allTracks].reverse().slice(0, 5); // Just a simulation of new releases
        const trendingSorted = [...allTracks].sort((a, b) => (b.plays || 0) - (a.plays || 0));
        return <HomeFeed 
                 trending={trendingSorted} 
                 aiPlaylists={aiPlaylists} 
                 recentlyPlayed={recentlyPlayed} 
                 popularArtists={dynamicArtists}
                 newReleases={newReleases}
                 likedTracks={liked}
                 onPlay={handlePlayTrack} 
                 onSaveMix={handleSaveMix} 
                 isMixSaved={dynamicUserPlaylists.some(p => p.title === 'Your Evening Flow')} 
                 onArtistClick={handleArtistClick}
                 onGenerateClick={() => setIsGeneratorModalOpen(true)}
                 onNavigate={handleNavigate}
               />;
      }
      case 'artist':
        if (selectedArtist) {
          const artistTracks = allTracks.filter(t => t.artist === selectedArtist.name);
          return <ArtistView 
                   artist={selectedArtist} 
                   tracks={artistTracks} 
                   onPlay={handlePlayTrack} 
                   isFollowed={followedArtistIds.has(selectedArtist.id)}
                   onToggleFollow={() => toggleFollowArtist(selectedArtist.id)}
                 />;
        }
        return null;
      case 'followed-artists':
        const followedArtists = dynamicArtists.filter(a => followedArtistIds.has(a.id));
        return <FollowedArtistsView artists={followedArtists} onArtistClick={handleArtistClick} />;
      case 'my-ai':
        return <UpdatingSoonView />;
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
        return <LibraryView likedTracks={liked} playlists={dynamicUserPlaylists} downloadedTracks={downloadedTracks} uploadedTracks={uploaded} onPlay={handlePlayTrack} onRemoveLike={toggleLike} onPlayPlaylist={(p) => handlePlayTrack(p.tracks[0], p.tracks)} defaultTab={libraryTab} onDeleteTrack={handleDeleteTrack} />;
      }
      case 'premium':
        return <PremiumView currentPlan={subscriptionPlan} onSubscribe={setSubscriptionPlan} />;
      case 'profile':
        return <ProfileView tracks={allTracks} recentlyPlayed={recentlyPlayed} onNavigate={handleNavigate} onPlay={handlePlayTrack} />;
      case 'settings':
        return <SettingsView currentPlan={subscriptionPlan} />;
      case 'chill':
      case 'workout':
      case 'focus': {
        let title = '';
        let description = '';
        let filterGenres: string[] = [];
        
        if (currentView === 'chill') {
          title = 'Chill Vibes';
          description = 'Relax, kick back, and enjoy these chill beats.';
          filterGenres = ['Chill', 'Ambient', 'Lofi Hip Hop', 'Jazz'];
        } else if (currentView === 'workout') {
          title = 'Workout Mix';
          description = 'High energy tracks to push your limits.';
          filterGenres = ['Workout', 'Electronic', 'Pop', 'Rock', 'Hip Hop'];
        } else {
          title = 'Focus Flow';
          description = 'Deep focus music for study and work.';
          filterGenres = ['Focus', 'Classical', 'Ambient', 'Electronic'];
        }

        const genreTracks = allTracks.filter(t => 
           filterGenres.some(g => t.genre?.toLowerCase().includes(g.toLowerCase())) || 
           t.genre?.toLowerCase().includes(currentView.toLowerCase())
        );

        return (
          <GenrePlaylistView 
            id={currentView} 
            title={title} 
            description={description} 
            tracks={genreTracks} 
            onPlay={handlePlayTrack} 
            playingTrackId={currentTrack?.id} 
            isPlaying={isPlaying} 
          />
        );
      }
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
        onError={(e) => {
          console.warn("Audio element error:", e.currentTarget.error);
          setIsPlaying(false);
        }}
        playsInline
      />
      <Sidebar 
        currentView={currentView} 
        setView={handleNavigate} 
        subscriptionPlan={subscriptionPlan} 
        popularArtists={dynamicArtists} 
        onArtistClick={handleArtistClick} 
        onNewPlaylist={() => setIsCreatePlaylistModalOpen(true)}
      />
      <main className="flex-1 flex flex-col relative bg-[#050505] overflow-hidden min-w-0">
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
          onOpenAIChat={() => setIsAiChatModalOpen(true)}
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
        isShuffle={isShuffle}
        isRepeat={isRepeat}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={playNext}
        onPrev={playPrev}
        onSeek={handleSeek}
        onVolumeChange={setVolume}
        onToggleLike={() => currentTrack && toggleLike(currentTrack.id)}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        onToggleRepeat={() => setIsRepeat(!isRepeat)}
        onToggleQueue={() => setIsQueueOpen(!isQueueOpen)}
        onToggleFullscreen={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            if (document.exitFullscreen) document.exitFullscreen();
          }
        }}
        onToggleEQ={() => setIsEQOpen(true)}
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
          playlists={dynamicUserPlaylists}
          onClose={() => {
            setIsPlaylistModalOpen(false);
            setTrackToAddToPlaylist(null);
          }}
          onCreatePlaylist={handleCreatePlaylist}
          onAddToPlaylist={handleAddToPlaylist}
        />
      )}
      {isCreatePlaylistModalOpen && (
        <CreatePlaylistModal 
          onClose={() => setIsCreatePlaylistModalOpen(false)}
          onCreate={handleCreateEmptyPlaylist}
        />
      )}
      {isGeneratorModalOpen && (
        <AIGeneratorModal 
          onClose={() => setIsGeneratorModalOpen(false)}
          onTrackGenerated={handleAITrackGenerated}
        />
      )}
      {isAiChatModalOpen && (
        <AIChatModal onClose={() => setIsAiChatModalOpen(false)} />
      )}
      
      {/* Queue Sidebar */}
      {isQueueOpen && (
        <div className="absolute top-0 bottom-24 right-0 w-[400px] bg-[#0a0a0a] border-l border-white/5 shadow-2xl z-40 flex flex-col transform transition-transform">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Play Queue</h2>
            <button onClick={() => setIsQueueOpen(false)} className="text-zinc-400 hover:text-white">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {currentTrack && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-zinc-400 mb-3 ml-2">Now Playing</h3>
                <div className="flex items-center gap-3 p-2 rounded-md bg-white/5">
                  <img src={currentTrack.coverUrl} className="w-10 h-10 rounded object-cover" alt="" />
                  <div>
                    <p className="text-sm text-fuchsia-400 font-medium">{currentTrack.title}</p>
                    <p className="text-xs text-zinc-400">{currentTrack.artist}</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 mb-3 ml-2">Next Up</h3>
              {queue.slice(currentIndex + 1, currentIndex + 20).map((t, idx) => (
                <div key={`${t.id}-${idx}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer" onClick={() => {
                  setCurrentIndex(currentIndex + 1 + idx);
                  setIsPlaying(true);
                }}>
                  <img src={t.coverUrl} className="w-10 h-10 rounded object-cover" alt="" />
                  <div>
                    <p className="text-sm text-white font-medium">{t.title}</p>
                    <p className="text-xs text-zinc-400">{t.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EQ Overlay */}
      {isEQOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center" onClick={() => setIsEQOpen(false)}>
          <div className="bg-[#121215] border border-white/10 p-8 rounded-2xl max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsEQOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="flex items-center gap-3 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <h2 className="text-xl font-bold mt-1">Equalizer</h2>
            </div>
            <div className="flex items-end justify-between h-40 gap-2 mb-6">
              {[40, 70, 30, 90, 50, 80, 60].map((h, i) => (
                <div key={i} className="w-full bg-[#1a1a1a] rounded-t-sm h-full flex items-end">
                  <div className="w-full bg-gradient-to-t from-violet-600 to-fuchsia-600 rounded-t-sm transition-all" style={{ height: `${h}%` }}></div>
                </div>
              ))}
            </div>
            <p className="text-center text-zinc-400 text-sm">Advanced audio equalization coming soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}
