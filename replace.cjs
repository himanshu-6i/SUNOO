const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `      try {
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
        });`;

const replacement1 = `      try {
        const fetchInitial = async () => {
          const { data: fetchedTracks, error } = await supabase
            .from('tracks')
            .select('*')
            .eq('visibility', 'public')
            .order('createdAt', { ascending: false });
            
          if (error) {
            console.error("Supabase fetch error", error);
            return;
          }
          
          if (fetchedTracks) {
            setAllTracks(prev => {
              const localOnly = prev.filter(p => !fetchedTracks.some(f => f.id === p.id) && !p.createdAt); 
              return [...fetchedTracks, ...localOnly];
            });
          }
        };
        fetchInitial();`;
content = content.replace(target1, replacement1);

const target2 = `    if (track.createdAt || !track.id.startsWith('t')) { // Ensure it's likely a firestore document
      try {
        const trackRef = doc(db, 'tracks', track.id);
        await updateDoc(trackRef, { plays: increment(1) });
      } catch (err) {
        console.error("Failed to increment plays in Firestore", err);
      }
    }`;
    
const replacement2 = `    if (track.createdAt || !track.id.startsWith('t')) { 
      try {
        // Increment plays in Supabase
        const { data: currentData, error: fetchError } = await supabase
          .from('tracks')
          .select('plays')
          .eq('id', track.id)
          .single();
          
        if (!fetchError && currentData) {
          await supabase
            .from('tracks')
            .update({ plays: (currentData.plays || 0) + 1 })
            .eq('id', track.id);
        }
      } catch (err) {
        console.error("Failed to increment plays in Supabase", err);
      }
    }`;
content = content.replace(target2, replacement2);

const target3 = `      const dbTrack = {
        title: newTrack.title,
        artist: newTrack.artist,
        coverUrl: coverDownloadUrl || '',
        duration: newTrack.duration,
        audioUrl: audioDownloadUrl || '',
        genre: newTrack.genre,
        plays: 0,
        ownerId: userId,
        visibility: 'public',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'tracks', trackId), dbTrack);`;
      
const replacement3 = `      const dbTrack = {
        id: trackId,
        title: newTrack.title,
        artist: newTrack.artist,
        coverUrl: coverDownloadUrl || '',
        duration: newTrack.duration,
        audioUrl: audioDownloadUrl || '',
        genre: newTrack.genre,
        plays: 0,
        ownerId: userId,
        visibility: 'public',
        createdAt: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase.from('tracks').insert([dbTrack]);
      if (insertError) {
         throw new Error(\`Failed to save track in Supabase Database: \${insertError.message}\`);
      }`;
content = content.replace(target3, replacement3);

const target4 = `  const handleDeleteTrack = async (trackId: string) => {
    try {
      await deleteDoc(doc(db, 'tracks', trackId));`;
      
const replacement4 = `  const handleDeleteTrack = async (trackId: string) => {
    try {
      await supabase.from('tracks').delete().eq('id', trackId);`;
content = content.replace(target4, replacement4);

fs.writeFileSync('src/App.tsx', content);
console.log('Replaced successfully');
