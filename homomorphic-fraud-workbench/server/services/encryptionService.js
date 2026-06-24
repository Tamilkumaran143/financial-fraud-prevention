const buffer = require('buffer');

const encrypt = (text) => {
  if (text === null || text === undefined) return null;
  return buffer.Buffer.from(String(text)).toString('base64');
};

const decrypt = (cipher) => {
  if (cipher === null || cipher === undefined) return null;
  return buffer.Buffer.from(String(cipher), 'base64').toString('utf8');
};

const batchEncrypt = (items, key) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({ ...item, [key]: encrypt(item[key]) }));
};

const batchDecrypt = (items, key) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({ ...item, [key]: decrypt(item[key]) }));
};

module.exports = { encrypt, decrypt, batchEncrypt, batchDecrypt };
