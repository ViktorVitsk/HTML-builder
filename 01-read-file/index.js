const fs = require('fs');
const path = require('path');

const rearStream = fs.createReadStream(path.join(__dirname, 'text.txt'));

let buffer = '';

rearStream.on('data', chunk => buffer += chunk);
rearStream.on('end', () => console.log(buffer));

