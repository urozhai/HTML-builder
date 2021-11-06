const fsPromises = require('fs/promises')
const path = require('path');
const stdout = process.stdout;

async function getInfo() {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: 'true'});
    for (let file of files) {
      const fileStat = await fsPromises.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        if (err) {
          stdout.write(`${err.name}: ${err.message}`);
        } else {
          console.log(stats)
        }
      });

      if (file.isFile()) {
        stdout.write(`${file.name.slice(0, file.name.lastIndexOf('.'))} - ${path.extname(file.name).slice(1)} - ${(fileStat.size / 1024).toFixed(2)} kb\n`)
      }
    }
  } catch (err) {
    stdout.write(`${err.name}: ${err.message}`);
  }
}

getInfo();