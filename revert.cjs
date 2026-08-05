const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target3 = `      const { error: insertError } = await supabase.from('tracks').insert([dbTrack]);
      if (insertError) {
         throw new Error(\`Failed to save track in Supabase Database: \${insertError.message}\`);
      }`;
      
const replacement3 = `      await setDoc(doc(db, 'tracks', trackId), dbTrack);`;
content = content.replace(target3, replacement3);

const target4 = `  const handleDeleteTrack = async (trackId: string) => {
    try {
      await supabase.from('tracks').delete().eq('id', trackId);
      try { await deleteDoc(doc(db, 'tracks', trackId)); } catch(e) {}`;
      
const replacement4 = `  const handleDeleteTrack = async (trackId: string) => {
    try {
      await deleteDoc(doc(db, 'tracks', trackId));`;
content = content.replace(target4, replacement4);

const target2 = `    if (track.createdAt || !track.id.startsWith('t')) { 
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
    
const replacement2 = `    if (track.createdAt || !track.id.startsWith('t')) { // Ensure it's likely a firestore document
      try {
        const trackRef = doc(db, 'tracks', track.id);
        await updateDoc(trackRef, { plays: increment(1) });
      } catch (err) {
        console.error("Failed to increment plays in Firestore", err);
      }
    }`;
content = content.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', content);
console.log('Reverted successfully');
