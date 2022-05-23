const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

showFiles(path.join(__dirname, 'secret-folder'));

async function showFiles(p) {
  try {
    const files = await readdir(p);

    for (const file of files) {
      const currentPath = path.join(p, file);

      fs.stat(currentPath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isFile()) {
          console.log(
            `name: ${
              path.basename(currentPath).split('.')[0]
            }\textname: ${path.extname(currentPath)}\tsize: ${(stats.size/1024).toFixed(3)} kb`
          );
        } 
      });
    }
  } catch (err) {
    console.error(err);
  }
}
