const fsPromises = require('fs/promises');
const path = require('path');
const stdout = process.stdout;

async function copyDir() {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'files'));

    if ((await fsPromises.readdir(path.join(__dirname))).includes('files-copy')) {
      const filesCopy = await fsPromises.readdir(path.join(__dirname, 'files-copy'));
      for (let fileCopy of filesCopy) {
        if (!files.includes(fileCopy)) {
          await fsPromises.rm(path.join(__dirname, 'files-copy', fileCopy));
        }
      }
    }
    await fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});
    for (let i = 0; i < files.length; i++) {
      await fsPromises.copyFile(path.join(__dirname, 'files', files[i]), path.join(__dirname, 'files-copy', files[i]));
    }
    stdout.write('"files" copied/updated to "files-copy"');
  } catch (err) {
    stdout.write(err.name + ': ' + err.message);
  }
}

copyDir();