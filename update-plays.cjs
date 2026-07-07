const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(/plays: 99400000/, 'plays: 15000');
data = data.replace(/plays: 5400000/, 'plays: 2000');
data = data.replace(/plays: 2100000/, 'plays: 1400');
data = data.replace(/plays: 1500000/, 'plays: 1000');
data = data.replace(/plays: 1200000/, 'plays: 1200');
data = data.replace(/plays: 980000/, 'plays: 980');

fs.writeFileSync('src/data.ts', data);
