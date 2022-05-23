const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const DIR_FOR_COPY = path.join(__dirname, 'project-dist');

const ASSETS = path.join(__dirname, 'assets');
const COPY_ASSETS = path.join(DIR_FOR_COPY, 'assets');

const STYLES = path.join(__dirname, 'styles');
const COPY_STYLES = path.join(DIR_FOR_COPY, 'style.css');

const HTML_TEMP = path.join(__dirname, 'template.html');
const COPY_HTML_FILE = path.join(DIR_FOR_COPY, 'index.html');
const HTML_COMPONENTS_DIR = path.join(__dirname, 'components');

(async () => {
  await createPackage();
  const writeCss = fs.createWriteStream(COPY_STYLES);
  cssConnect(STYLES, writeCss);
  dirCopy(ASSETS, COPY_ASSETS);
  htmlBuild();
})();

async function htmlBuild() {
  let srcHtml = await fs.promises.readFile(HTML_TEMP, 'utf-8');
  const htmlFiles = await fs.promises.readdir(HTML_COMPONENTS_DIR, { withFileTypes: true });
  const htmlTags = htmlFiles.map(el => ('{{' + el.name.split('.')[0]) + '}}');

  for(let i = 0; i < htmlFiles.length; i++) {
    const name = htmlFiles[i].name;
    const tag = htmlTags[i];
    const currentFile = await fs.promises.readFile(path.join(HTML_COMPONENTS_DIR, name), 'utf-8');

    srcHtml = srcHtml.replace(tag, currentFile);
  }
  fs.promises.writeFile(COPY_HTML_FILE, srcHtml);
}

async function createPackage() {
  await fs.promises.rm(DIR_FOR_COPY, { force: true, recursive: true });
  await fs.promises.mkdir(DIR_FOR_COPY, { force: true, recursive: true });
  await fs.promises.mkdir(COPY_ASSETS, { force: true, recursive: true });
  await fs.writeFile(COPY_STYLES, '', err => {
    if (err)
      console.log(err.message);
  });
  await fs.writeFile(COPY_HTML_FILE, '', err => {
    if (err)
      console.log(err.message);
  });
}

async function cssConnect(src, newFile) {
  try {
    const files = await readdir(src);

    files.forEach((file) => {
      const currentPath = path.join(src, file);

      if (path.extname(currentPath) === '.css') {

        fs.promises.readFile(currentPath).then((data) => {
          newFile.write(data + '\n/* ---------- gluing ---------- */\n\n');
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function dirCopy(src, dirSave) {
  try {
    await fs.promises.rm(dirSave, { force: true, recursive: true });
    await fs.promises.mkdir(dirSave, { force: true,recursive: true });

    const files = await fs.promises.readdir(src, { withFileTypes: true });

    files.forEach(file => {
      const currentPath = path.join(src, file.name);
      const copyPath = path.join(dirSave, file.name);
      if (file.isFile()) {
        fs.promises.copyFile(currentPath, copyPath);
      } else if (file.isDirectory()) {
        fs.promises.mkdir(copyPath, { force: true,recursive: true });
        dirCopy(currentPath, copyPath);
      }
    });

  } catch (error) {
    console.error(error);
  }
}