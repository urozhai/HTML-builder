const fs = require('fs');
const path = require('path');
let data = '';

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

stream.on('data', part => data += part);
stream.on('error', (err) => console.log('Error: ', err.message));
stream.on('end', () => console.log(data.trim()));
