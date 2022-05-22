const fs = require('fs');
const path = require('path');

const files = path.join(__dirname, 'files');
const filesCopy = path.join(__dirname, 'files-copy');

dirCopy(files, filesCopy);

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
