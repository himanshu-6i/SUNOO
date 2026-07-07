const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

// remove Arijit Singh track
data = data.replace(/  \{\n    id: 't_hindi1'.*?\n  \},\n/s, '');
// remove A.R. Rahman track
data = data.replace(/  \{\n    id: 't_hindi2'.*?\n  \},\n/s, '');
// remove Luna Eclipse track
data = data.replace(/  \{\n    id: 't2'.*?\n  \},\n/s, '');

// remove Luna Eclipse artist
data = data.replace(/  \{ id: 'a3', name: 'Luna Eclipse'.*?\n/s, '');
// remove Digital Karma artist
data = data.replace(/  \{ id: 'a6', name: 'Digital Karma'.*?\n/s, '');

// Fix last comma in array if Digital Karma was the last element
data = data.replace(/  \{ id: 'a5', name: 'Metro Flow'(.*?) \},\n\];/s, "  { id: 'a5', name: 'Metro Flow'$1 }\n];");

fs.writeFileSync('src/data.ts', data);
