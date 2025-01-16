const fs = require('fs/promises');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.mkdir(targetDir, { recursive: true });
    const files = await fs.readdir(sourceDir);

    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      await fs.copyFile(sourceFile, targetFile);
    }

    const copiedFiles = await fs.readdir(targetDir);

    for (const copiedFile of copiedFiles) {
      if (!files.includes(copiedFile)) {
        await fs.unlink(path.join(targetDir, copiedFile));
      }
    }

    console.log('Копирование успешно завершено!');
  } catch (err) {
    console.error('Ошибка при копировании:', err);
  }
}

copyDir();
