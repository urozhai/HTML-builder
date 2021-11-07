const fsPromises = require('fs/promises');
const path = require('path');
const stdout = process.stdout;

async function replaceTemplate(context) {
  let itemStartPosition;
  let itemEndPosition;
  let item;
  let replacement;
  while(context.includes('{{')) {
    itemStartPosition = await context.indexOf('{{');
    itemEndPosition = await context.indexOf('}}', itemStartPosition) + 2;
    item = await context.slice(itemStartPosition + 2, itemEndPosition - 2);
    replacement = (await fsPromises.readFile(path.join(__dirname, 'components', `${item}.html`))).toString();
    context = context.slice(0, itemStartPosition) + replacement + context.slice(itemEndPosition);
  }
  return context;
}


async function copyDir(pathFrom, pathTo) {
  try {
    const directoryFrom = await fsPromises.readdir(path.join(__dirname, pathFrom));
    const direntDirectoryFrom = await fsPromises.readdir(path.join(__dirname, pathFrom), {withFileTypes: 'true'});
    const nameOfDirectoryTo = (pathTo.lastIndexOf('\\') > 0) ? pathTo.slice(pathTo.lastIndexOf('\\') + 1) : pathTo;
    const partialPathTo = (pathTo.lastIndexOf('\\') > 0) ? pathTo.slice(0, pathTo.lastIndexOf('\\')) : '';

    if ((await fsPromises.readdir(path.join(__dirname, partialPathTo))).includes(nameOfDirectoryTo)) {
      const directoryTo = await fsPromises.readdir(path.join(__dirname, pathTo));

      for (let file of directoryTo) {
        if (!directoryFrom.includes(directoryTo)) {
          await fsPromises.rm(path.join(__dirname, pathTo, file), {recursive: true});
        }
      }
    }

    await fsPromises.mkdir(path.join(__dirname, pathTo), {recursive: true});
    for (let i = 0; i < directoryFrom.length; i++) {
      if (!direntDirectoryFrom[i].isFile()) {
        copyDir(`${pathFrom}\\${direntDirectoryFrom[i].name}`, `${pathTo}\\${direntDirectoryFrom[i].name}`);
      } else {
        await fsPromises.copyFile(path.join(__dirname, pathFrom, directoryFrom[i]), path.join(__dirname, pathTo, directoryFrom[i]));
      }
    }
  } catch (err) {
    stdout.write(err.name + ': ' + err.message);
  }
}

async function createBundle(pathFrom, pathTo) {
  try {
    const directoryFrom = await fsPromises.readdir(path.join(__dirname, pathFrom));
    let content = '';
    for (let file of directoryFrom) {
      content += (await fsPromises.readFile(path.join(__dirname, pathFrom, file)) + '\n');
    }
    await fsPromises.writeFile(path.join(__dirname, pathTo), content);
  } catch (err) {
    stdout.write(`${err.name}: ${err.message}\n`);
  }
}

async function buildPage() {
  try {
    const filePath = path.join(__dirname, 'template.html');
    let fileContent = (await fsPromises.readFile(filePath)).toString();
    
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});

    fileContent = await replaceTemplate(fileContent);
    await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), fileContent);

    copyDir('assets', 'project-dist\\assets');
    createBundle('styles', 'project-dist\\style.css');

  } catch (err) {
    stdout.write(`${err.name}: ${err.message}\n`);
  }
}

buildPage();