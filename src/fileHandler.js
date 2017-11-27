const fs = require('fs');
const logger = require('./logger');

const fileName = 'myCollection.json';

function read() {
  return new Promise((resolve, reject) => {
    fs.readFile(`./${fileName}`, 'utf8', (err, data) => {
      if (err) {
        return reject(logger.error(`reading error: ${JSON.stringify(err)}`));
      }
      try {
        const obj = JSON.parse(data);
        return resolve(obj);
      } catch (parseError) {
        return reject(logger.error(`parseError: ${JSON.stringify(err)}`));
      }
    });
  });
}

function write(jsonObject) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, JSON.stringify(jsonObject), 'utf8', (err) => {
      if (err) {
        return reject(logger.error(`writing error: ${JSON.stringify(err)}`));
      }
      return resolve(logger.log('successfully saved collection'));
    });
  });
}

function clear() {
  return new Promise((resolve, reject) => {
    const exists = fs.existsSync(`./${fileName}`);
    if (exists) {
      fs.unlink(fileName, err => (err ? reject(logger.error(err)) : resolve('success')));
    }
    resolve();
  });
}

module.exports = {
  read,
  write,
  clear,
};
