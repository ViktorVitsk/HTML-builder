const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

rl.write('Введите текст для записи: \n');

rl.on('line', (txt) => {
  if (txt.trim() === 'exit') {
    console.log('\nПрограмма закрыта');
    writeText(txt.replace('exit', ''));
    rl.close();
  } else {
    writeText(txt);
  }
  
});

rl.on('SIGINT', () => {
  rl.close();
  console.log('\nПрограмма закрыта');
});

function writeText(txt) {
  writeStream.write(`${txt}\n`, (err) => {
    if (err) throw err;
  });
}