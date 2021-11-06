const fsPromises = require('fs/promises');
const path = require('path');
const stdout = process.stdout;

async function getFiles(ext) {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'));
    let extFiles = [];
    for (let file of files) {
      if (file.slice(file.lastIndexOf('.') + 1) === ext) {
        extFiles.push(file);
      }
    }
    return extFiles;
  } catch (err) {
    stdout.write(`${err.name}: ${err.message}\n`);
  }
}

async function copyContent(file) {
  try {
    return await fsPromises.readFile(path.join(__dirname, 'styles', file));
  } catch (err) {
    stdout.write(`${err.name}: ${err.message}\n`);
  }
}

async function cssBundle() {
  try {
    const cssFiles = await getFiles('css');
    let content = '';
    for (let file of cssFiles) {
      content += ('\n' + await copyContent(file));
    }
    await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), content);
    stdout.write('CSS-files merged succesfully!')
  } catch (err) {
    stdout.write(`${err.name}: ${err.message}\n`);
  }
}

cssBundle();
