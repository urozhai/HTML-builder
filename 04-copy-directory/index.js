const fsPromises = require('fs/promises');
const path = require('path');
const stdout = process.stdout;

async function copyDir() {
  try {
    await fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});
    const files = await fsPromises.readdir(path.join(__dirname, 'files'));
    for (let i = 0; i < files.length; i++) {
      await fsPromises.copyFile(path.join(__dirname, 'files', files[i]), path.join(__dirname, 'files-copy', files[i]));
    }
    stdout.write('"files" copied to "files-copy"');
  } catch (err) {
    stdout.write(err.name + ': ' + err.message);
  }
}

copyDir();