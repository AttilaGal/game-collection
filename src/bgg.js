const request = require('request-promise-native');
const pRetry = require('p-retry');
const { parseString } = require('xml2js');
const logger = require('./logger');

const baseUrl = 'http://www.boardgamegeek.com/xmlapi2/';
const bggusername = 'junglejoker';

function removeStrangeRoot(obj) {
  const newObj = { ...obj };
  const root = Object.assign({}, obj.$);
  delete newObj.$;
  return {
    ...newObj,
    ...root,
  };
}

const collectionCall = () => request.get({
  uri: `${baseUrl}collection?username=${bggusername}&own=1`,
  simple: true,
  transform: (body, response) => {
    if (response.statusCode !== 200) {
      throw new Error('invalid response');
    }
    return body;
  },
})
  .then(result => new Promise((resolve, reject) => {
    parseString(result, (err, parsed) => {
      if (err) {
        reject(err);
      }
      const transformed = parsed.items.item.map(removeStrangeRoot);
      resolve(transformed);
    });
  }));

function getCollection() {
  return pRetry(collectionCall, {
    retries: 5,
    minTimeout: 3000,
  });
}

function getGameDetails(game) {
  logger.log(`requesting details for ${game.name[0]._}`);
  return request.get({
    uri: `${baseUrl}thing?id=${game.objectid}`,
    simple: true,
    transform: (body, response) => {
      if (response.statusCode !== 200) {
        throw new Error(`invalid details response for ${game.name[0]._}`);
      }
      return body;
    },
  })
    .then(result => new Promise((resolve, reject) => {
      parseString(result, (err, parsed) => {
        if (err) {
          reject(err);
        }
        const transformed = parsed.items.item.map(removeStrangeRoot);
        resolve(transformed[0]);
      });
    }));
}


function getGamePlays(game) {
  logger.log(`requesting plays for ${game.name[0]._}`);
  return request.get({
    uri: `${baseUrl}plays?username=${bggusername}&id=${game.objectid}`,
    simple: true,
    transform: (body, response) => {
      if (response.statusCode !== 200) {
        throw new Error(`invalid play response for ${game.name[0]._}`);
      }
      return body;
    },
  })
    .then(result => new Promise((resolve, reject) => {
      parseString(result, (err, parsed) => {
        if (err) {
          reject(err);
        }
        const transformed = removeStrangeRoot(parsed.plays);
        if (!transformed.play) {
          return resolve([]);
        }
        transformed.play = transformed.play.map(removeStrangeRoot);
        return resolve(transformed);
      });
    }));
}

module.exports = {
  getCollection,
  getGameDetails,
  getGamePlays,
};
