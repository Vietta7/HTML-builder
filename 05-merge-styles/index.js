const fs = require('fs/promises');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesDir);

    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    const stylesArray = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
      }),
    );

    const bundleContent = stylesArray.join('\n');

    await fs.writeFile(outputFile, bundleContent, 'utf-8');

    console.log('Файл bundle.css успешно создан!');
  } catch (err) {
    console.error('Ошибка при создании bundle.css:', err);
  }
}

mergeStyles();
