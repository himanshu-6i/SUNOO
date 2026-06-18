import React, { useState, useRef, useEffect, DragEvent } from 'react';
import { Upload, BarChart3, Users, DollarSign, Music, CheckCircle2, X, Image as ImageIcon, Music4, Check, Play, FileAudio } from 'lucide-react';
import { currentUser as mockUser, trendingTracks } from '../data';

import { Track } from '../types';

const extractAudioMetadata = async (file: File): Promise<{ duration: number; bitrate: number }> => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    const url = URL.createObjectURL(file);
    audio.src = url;
    
    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      const bitrate = Math.round((file.size * 8) / duration / 1000);
      URL.revokeObjectURL(url);
      resolve({ duration, bitrate });
    };
    
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not extract metadata"));
    };
  });
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface CreatorDashboardProps {
  tracks: Track[];
  onTrackUpload?: (track: Track, files?: { audio: File | null, cover: File | null }) => void;
  onPlay?: (track: Track, queue: Track[]) => void;
}

export function CreatorDashboard({ tracks, onTrackUpload, onPlay }: CreatorDashboardProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    import('../firebase').then(({ auth }) => {
      auth.onAuthStateChanged((u) => {
        setUser(u);
      });
    });
  }, []);
  
  const userName = user?.displayName || mockUser.name;
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  // Audio Extraction State
  const [audioMetadata, setAudioMetadata] = useState<{ duration: number; bitrate: number } | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // Drag State
  const [isDragOverAudio, setIsDragOverAudio] = useState(false);
  const [isDragOverCover, setIsDragOverCover] = useState(false);

  // Keeping object URLs alive to allow playback in the app
  // Avoid revoking URLs when unmounting if they have been added to the queue

  const stats = [
    { label: 'Total Streams', value: '12.4M', icon: Music, increment: '+12%' },
    { label: 'Monthly Listeners', value: '840K', icon: Users, increment: '+5%' },
    { label: 'Estimated Revenue', value: '$45,200', icon: DollarSign, increment: '+18%' }
  ];

  const processAudioFile = async (file: File) => {
    setUploadError('');
    setAudioMetadata(null);
    
    // Check file size (500MB limit)
    const MAX_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max 500MB limit.`);
      setAudioFile(null);
      return;
    }

    const fileName = file.name.toLowerCase();
    const validExtensions = ['.mp3', '.wav', '.flac', '.m4a', '.aac', '.ogg', '.aiff', '.aif'];
    const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));
    
    // Broad MIME checking to capture AI generated content, generic streams, etc.
    const isAudioMime = file.type.startsWith('audio/') || file.type.startsWith('video/') || file.type === 'application/octet-stream' || file.type === '';

    console.log(`[Debug] Processing File: ${file.name}`);
    console.log(`[Debug] Valid Ext: ${hasValidExt}, MIME: ${file.type || 'unknown'}, Size: ${file.size}`);

    if (!hasValidExt && !isAudioMime) {
      setUploadError(`Format not recognized (${file.name}). Please use a standard audio format.`);
      setAudioFile(null);
      return;
    }

    setIsExtracting(true);
    try {
      const meta = await extractAudioMetadata(file).catch(() => null);
      if (meta) {
        setAudioMetadata(meta);
      }
      setAudioFile(file);
      setAudioPreviewUrl(URL.createObjectURL(file));
      setUploadError('');
    } catch (err: any) {
      setUploadError('Failed to process file.');
      setAudioFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const processCoverFile = (file: File) => {
    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file for the cover art.');
      setCoverFile(null);
      return;
    }
    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processAudioFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processCoverFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate multi-step processing and progress
    let progress = 0;
    const interval = setInterval(async () => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 100) progress = 100;
      setUploadProgress(progress);

      if (progress === 100) {
        clearInterval(interval);
        
        // Generate a new Track object
        const newTrack: Track = {
          id: `t_${Date.now()}`,
          title: title,
          artist: userName,
          coverUrl: coverPreviewUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
          duration: audioMetadata ? formatDuration(audioMetadata.duration) : '0:00',
          audioUrl: audioPreviewUrl || '',
          genre: genre,
          plays: 0
        };

      try {
        if (onTrackUpload && newTrack.audioUrl) {
          await Promise.resolve(onTrackUpload(newTrack, { audio: audioFile, cover: coverFile }));
        }

        setIsUploading(false);
        setShowUploadModal(false);
        setShowToast(true);
        setTitle('');
        setGenre('');
        setCoverFile(null);
        setAudioFile(null);
        setUploadProgress(0);
        // Notice: we do not revoke URLs here if they are being used by the player
        setTimeout(() => setShowToast(false), 4000);
      } catch (err: any) {
        setIsUploading(false);
        const errMsg = err.message || String(err) || '';
        if (errMsg.includes('storage/') || errMsg.includes('unauthorized') || errMsg.includes('retry-limit-exceeded')) {
           setUploadError(`Upload failed (${errMsg}). If you just created this Firebase project, make sure "Storage" is enabled in your Firebase Console.`);
        } else if (errMsg.includes('JSON')) {
           setUploadError(`Storage is not fully initialized. Please go to your Firebase Console, click on "Storage" in the left sidebar, and click "Get Started" to initialize it.`);
        } else if (errMsg.includes('Missing or insufficient permissions')) {
           setUploadError(`Database permission denied. Ensure Firestore Rules are deployed and match the app schema.`);
        } else {
           setUploadError(errMsg || 'Failed to publish track.');
        }
      }
      }
    }, 250);
  };

  // Drag events
  const preventDefault = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 p-8 relative z-0">
      {showToast && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-full flex items-center gap-2 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">Upload complete! Track is now processing & optimizing.</span>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181b] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Upload className="w-6 h-6 text-violet-400" />
                New Release Distribution
              </h2>
              <button 
                onClick={() => !isUploading && setShowUploadModal(false)}
                className="text-zinc-400 hover:text-white transition-colors"
                disabled={isUploading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg flex items-start gap-3 animate-in fade-in">
                  <X className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Upload Failed</p>
                    <p>{uploadError}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Track Title</label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium"
                      placeholder="E.g., Midnight Drive"
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Primary Genre</label>
                    <select 
                      required
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium appearance-none"
                      disabled={isUploading}
                    >
                      <option value="" disabled>Select Genre</option>
                      <option value="Pop">Pop</option>
                      <option value="Electronic">Electronic</option>
                      <option value="Hip Hop">Hip Hop</option>
                      <option value="Rock">Rock</option>
                      <option value="Ambient">Ambient</option>
                      <option value="Classical">Classical</option>
                      <option value="Jazz">Jazz</option>
                    </select>
                  </div>
                  
                  {audioPreviewUrl && (
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Audio Preview</p>
                      <audio controls src={audioPreviewUrl} className="w-full h-8" />
                      <p className="text-xs text-zinc-500 mt-2 truncate">File: {audioFile?.name}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label 
                    htmlFor="cover-upload"
                    onDragOver={(e) => { preventDefault(e); setIsDragOverCover(true); }}
                    onDragLeave={(e) => { preventDefault(e); setIsDragOverCover(false); }}
                    onDrop={(e) => {
                      preventDefault(e);
                      setIsDragOverCover(false);
                      if (e.dataTransfer.files?.[0]) processCoverFile(e.dataTransfer.files[0]);
                    }}
                    className={`relative border-2 border-dashed ${isDragOverCover ? 'border-violet-400 bg-violet-500/20' : coverPreviewUrl ? 'border-violet-500/50 border-solid bg-black/40' : 'border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5'} rounded-xl w-full aspect-square flex flex-col items-center justify-center text-center transition-all cursor-pointer group overflow-hidden`}
                  >
                    <input 
                      id="cover-upload"
                      type="file" 
                      accept="image/*,.jpg,.jpeg,.png"
                      className="sr-only" 
                      onChange={handleCoverSelect}
                      disabled={isUploading}
                    />
                    {coverPreviewUrl ? (
                      <div className="absolute inset-0">
                        <img src={coverPreviewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-sm font-medium">Change Cover</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-violet-500/20 group-hover:text-violet-400 transition-colors">
                          <ImageIcon className="w-6 h-6 text-zinc-400 group-hover:text-violet-400" />
                        </div>
                        <p className="text-sm font-medium text-zinc-300">Upload Cover Art</p>
                        <p className="text-xs text-zinc-500 mt-1">JPEG/PNG, min 3000x3000px</p>
                      </>
                    )}
                  </label>

                  <label 
                    htmlFor="audio-upload"
                    onDragOver={(e) => { preventDefault(e); setIsDragOverAudio(true); }}
                    onDragLeave={(e) => { preventDefault(e); setIsDragOverAudio(false); }}
                    onDrop={(e) => {
                      preventDefault(e);
                      setIsDragOverAudio(false);
                      if (e.dataTransfer.files?.[0]) processAudioFile(e.dataTransfer.files[0]);
                    }}
                    className={`border-2 border-dashed ${isDragOverAudio || audioFile ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5'} rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group`}
                  >
                    <input 
                      id="audio-upload"
                      type="file" 
                      accept="audio/*,video/*,.mp3,.wav,.flac,.m4a,.aac,.ogg,.aiff,application/octet-stream"
                      className="sr-only" 
                      onChange={handleAudioSelect}
                      disabled={isUploading}
                    />
                    {audioFile ? (
                      <div className="flex flex-col items-center">
                        <Check className="w-6 h-6 text-violet-400 mb-1" />
                        <p className="text-sm font-medium text-violet-300 truncate w-full max-w-[200px] px-2">{audioFile.name}</p>
                        {audioMetadata ? (
                          <p className="text-xs text-emerald-400 mt-1">
                            {formatDuration(audioMetadata.duration)} • {audioMetadata.bitrate} kbps
                          </p>
                        ) : (
                          <p className="text-xs text-zinc-500 mt-1">Click or drag to replace</p>
                        )}
                      </div>
                    ) : (
                      <>
                        {isExtracting ? (
                          <div className="flex flex-col items-center">
                             <div className="w-5 h-5 border-2 border-violet-500/50 border-r-transparent rounded-full animate-spin mb-3" />
                             <p className="text-sm font-medium text-violet-300">Analyzing audio...</p>
                          </div>
                        ) : (
                          <>
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-violet-500/20 group-hover:text-violet-400 transition-colors">
                            <FileAudio className="w-5 h-5 text-zinc-400 group-hover:text-violet-400" />
                          </div>
                          <p className="text-sm font-medium text-zinc-300">Drop Master Audio File</p>
                          <p className="text-xs text-zinc-500 mt-1">Lossless format preferred (Max 500MB)</p>
                          </>
                        )}
                      </>
                    )}
                  </label>
                </div>
              </div>

              {isUploading && (
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-violet-500 h-full transition-all duration-300 ease-out" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                  <p className="text-center text-xs text-zinc-400 mt-2">Processing formatting & metadata... {uploadProgress}%</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="px-6 py-2.5 text-zinc-300 font-medium hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading || !title || !genre || !coverFile || !audioFile}
                  className="bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-500 text-white px-8 py-2.5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center min-w-[140px]"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                       <Upload className="w-4 h-4 animate-bounce" />
                       {uploadProgress < 100 ? 'Processing...' : 'Uploading to Cloud...'}
                    </div>
                  ) : 'Publish Release'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Creator Hub</h1>
          <p className="text-zinc-400">Welcome back, {userName}. Here's how your music is performing.</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          <Upload className="w-5 h-5" />
          Upload Release
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/20 transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center z-10 relative">
                <stat.icon className="w-6 h-6 text-violet-400" />
              </div>
              <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-2 py-1 rounded">
                {stat.increment}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1 font-mono tracking-tight z-10 relative">{stat.value}</p>
            <p className="text-sm text-zinc-400 z-10 relative">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content Management */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Your Recent Releases</h2>
        {tracks.filter(t => t.artist === userName).length === 0 ? (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center text-zinc-500">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium text-white mb-2">No releases yet</p>
            <p>Upload your first track to start sharing your music.</p>
          </div>
        ) : (
          <div className="bg-[#0f0f13] border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[48px_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-white/5 text-sm font-semibold text-zinc-400">
              <span className="text-center">Play</span>
              <span>Release</span>
              <span>Date</span>
              <span>Streams</span>
              <span>Status</span>
            </div>
            {tracks.filter(t => t.artist === userName).map((track, i) => (
              <div key={i} className="group grid grid-cols-[48px_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <div 
                  className="relative w-10 h-10 flex items-center justify-center cursor-pointer group/btn"
                  onClick={() => onPlay && onPlay(track, tracks.filter(t => t.artist === userName))}
                >
                  <div className="w-full h-full rounded bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover/btn:bg-violet-500 group-hover/btn:text-white transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <div className="flex items-center gap-4 truncate">
                  <img src={track.coverUrl} className="w-12 h-12 rounded object-cover" alt="" />
                  <div className="truncate cursor-pointer" onClick={() => onPlay && onPlay(track, tracks.filter(t => t.artist === userName))}>
                    <p className="font-semibold text-white truncate group-hover:text-violet-400 transition-colors">{track.title}</p>
                    <p className="text-xs text-zinc-500 truncate">{track.genre}</p>
                  </div>
                </div>
                <div className="text-zinc-400 text-sm">Just now</div>
                <div className="text-white font-mono text-sm">{track.plays.toLocaleString()}</div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
