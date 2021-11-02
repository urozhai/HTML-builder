const fs = require('fs');
const path = require('path');
const stdin = process.stdin;
const stdout = process.stdout;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello, friend! Enter text:\n');

stdin.on('data', (str, err) => {
  try {
    let inputText = str.toString().trim();
    if (inputText === 'exit') {
      process.exit();
    }
    output.write(str);
  } catch (err) {
    stdout.write(`${err.name}: ${err.message}\n`);
    process.exit(() => stdout.write('Try again'));
  }
});

function goodBye() {
  stdout.write('Good bye, friend!\n');
};

process.on('exit', goodBye);
process.on('SIGINT', () => {
  process.exit();
});