const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Ошибка при чтении папки:', err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(secretFolderPath, file.name);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Ошибка при получении информации о файле`, err);
          return;
        }

        const fileName = path.parse(file.name).name;
        const fileExt = path.parse(file.name).ext.slice(1);
        const fileSize = stats.size;

        console.log(`${fileName} - ${fileExt} - ${fileSize} bytes`);
      });
    }
  });
});
