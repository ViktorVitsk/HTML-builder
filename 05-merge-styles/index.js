const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const BUNDLE = path.join(__dirname, 'project-dist', 'bundle.css');
const SRC = path.join(__dirname, 'styles');

const writeStream = fs.createWriteStream(BUNDLE);
cssConnect(SRC, writeStream);

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
