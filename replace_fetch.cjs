const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `  useEffect(() => {
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
  }, [isAuthenticated]);`;

const replacement1 = `  useEffect(() => {
    if (!isAuthenticated) return;
    let unsubscribe: () => void;
    
    const fetchTracks = async () => {
      try {
        // Fetch from Supabase (old storage)
        const { data: supabaseData, error } = await supabase
          .from('tracks')
          .select('*')
          .eq('visibility', 'public')
          .order('createdAt', { ascending: false });
          
        let supabaseTracks = [];
        if (!error && supabaseData) {
          supabaseTracks = supabaseData;
        }

        const tracksRef = collection(db, 'tracks');
        const q = query(tracksRef, where('visibility', '==', 'public'));
        
        const fetchInitial = async () => {
          const snapshot = await getDocs(q);
          const fetchedTracks = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Track[];
          
          const combined = [...supabaseTracks, ...fetchedTracks];
          // Remove duplicates if any
          const uniqueTracks = Array.from(new Map(combined.map(item => [item.id, item])).values());
          
          setAllTracks(prev => {
            const localOnly = prev.filter(p => !uniqueTracks.some(f => f.id === p.id) && !p.createdAt); 
            return [...uniqueTracks, ...localOnly];
          });
        };
        
        fetchInitial();
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedTracks = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Track[];
          
          const combined = [...supabaseTracks, ...fetchedTracks];
          const uniqueTracks = Array.from(new Map(combined.map(item => [item.id, item])).values());
          
          setAllTracks(prev => {
            const localOnly = prev.filter(p => !uniqueTracks.some(f => f.id === p.id) && !p.createdAt); 
            return [...uniqueTracks, ...localOnly];
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
  }, [isAuthenticated]);`;

if (content.includes(target1)) {
    content = content.replace(target1, replacement1);
    fs.writeFileSync('src/App.tsx', content);
    console.log('Replaced fetchTracks successfully');
} else {
    console.log('Target not found!');
}
