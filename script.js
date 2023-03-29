const fs = require('fs');
const crypto = require('crypto');

const filePath = './pass.txt';
const password = crypto.randomBytes(32);

// 1. Шифрування та заміна тексту в файлі на зашифрований
function encryptFile(filePath, password) {
  const text = fs.readFileSync(filePath, 'utf-8');
  const iv = crypto.randomBytes(16); // генерація випадкового вектора
  const cipher = crypto.createCipheriv('aes-256-cbc', password, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const data = iv.toString('hex') + ':' + encrypted;
  fs.writeFileSync(filePath, data);
}

// 2. Дешифрування та заміна тексту в файлі на дешифрований
function decryptFile(filePath, password) {
  const data = fs.readFileSync(filePath, 'utf-8');
  const parts = data.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', password, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  fs.writeFileSync(filePath, decrypted);
}

// 3. Шифрування файлу з розширенням .enc
function encryptAndSaveFile(filePath, password) {
  const text = fs.readFileSync(filePath, 'utf-8');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', password, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const newFilePath = `${filePath}.enc`;
  const data = iv.toString('hex') + ':' + encrypted;
  fs.writeFileSync(newFilePath, data);
}

// 4. Дешифрування файлу з розширенням .enc та збереження в .txt
function decryptAndSaveFile(filePath, password) {
  const data = fs.readFileSync(filePath, 'utf-8');
  const parts = data.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', password, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  const newFilePath = filePath.replace(/\.enc$/, '.txt');
  fs.writeFileSync(newFilePath, decrypted);
}

encryptFile(filePath, password);
decryptFile(filePath, password);
encryptAndSaveFile(filePath, password);
decryptAndSaveFile(`${filePath}.enc`, password);