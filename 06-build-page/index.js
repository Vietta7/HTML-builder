const fs = require('fs').promises;
const path = require('path');

const sourceStylesDir = path.join(__dirname, 'styles');
const outputStylesFile = path.join(__dirname, 'project-dist', 'style.css');
const sourceAssetsDir = path.join(__dirname, 'assets');
const outputAssetsDir = path.join(__dirname, 'project-dist', 'assets');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const outputHtmlFile = path.join(__dirname, 'project-dist', 'index.html');

async function combineStyles() {
  try {
    const files = await fs.readdir(sourceStylesDir);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    let combinedStyles = '';

    for (const file of cssFiles) {
      const filePath = path.join(sourceStylesDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      combinedStyles += content + '\n';
    }

    await fs.writeFile(outputStylesFile, combinedStyles);
  } catch (err) {
    console.log(err);
  }
}

async function copyFolder(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyFolder(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function cleanFolder(folder) {
  try {
    try {
      await fs.access(folder);
    } catch {
      return;
    }
    const entries = await fs.readdir(folder, { withFileTypes: true });

    for (const entry of entries) {
      const currentPath = path.join(folder, entry.name);

      if (entry.isDirectory()) {
        await cleanFolder(currentPath);
        await fs.rmdir(currentPath);
      } else {
        await fs.unlink(currentPath);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function replaceTags() {
  try {
    let templateContent = await fs.readFile(templateFile, 'utf-8');
    const componentFiles = await fs.readdir(componentsDir);

    for (const file of componentFiles) {
      if (path.extname(file) === '.html') {
        const componentName = path.basename(file, '.html');
        const componentPath = path.join(componentsDir, file);
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        const tagRegex = new RegExp(`{{${componentName}}}`, 'g');
        templateContent = templateContent.replace(tagRegex, componentContent);
      }
    }

    await fs.writeFile(outputHtmlFile, templateContent);
  } catch (err) {
    console.log(err);
  }
}

async function buildProject() {
  try {
    const distDir = path.join(__dirname, 'project-dist');
    await cleanFolder(distDir);
    await fs.mkdir(distDir, { recursive: true });
    
    await replaceTags();
    await combineStyles();

    await copyFolder(sourceAssetsDir, outputAssetsDir);
  } catch (err) {
    console.log(err);
  }
}

buildProject();