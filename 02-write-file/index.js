const fs = require('fs');
const path = require('path');
const readline = require('readline');

const textPath = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Привет! :) Введите текст для записи в файл: (выход: ctrl + c или exit)');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    rl.close();
    } else {
      textPath.write(input + '\n');
    }
});

rl.on('close', () => {
  console.log('Запись файла завершена. До свидания!');
  textPath.close();

  })
process.on('SIGINT', () => {
  console.log('До свидания! Процесс завершен.');
  rl.close();
  textPath.close();
});
