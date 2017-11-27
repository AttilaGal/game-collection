const { getCollection, getGameDetails, getGamePlays } = require('./bgg.js');
const { read, write, clear } = require('./fileHandler');
const logger = require('./logger');
const player = require('./audio/player');

async function updateGames(myCollection) {
  const gameToUpdate = myCollection.find(g => !g.details || !g.plays);
  if (!gameToUpdate) {
    logger.info('sync complete!');
    return player.success();
  }
  const collectionIndex = myCollection.findIndex(g => g.objectid === gameToUpdate.objectid);
  if (!gameToUpdate.details) {
    const details = await getGameDetails(gameToUpdate);
    myCollection[collectionIndex].details = details;
    return write(myCollection);
  }
  const plays = await getGamePlays(gameToUpdate);
  myCollection[collectionIndex].plays = plays;
  return write(myCollection);
}

function retrieveCollectionAndSaveToFile() {
  getCollection()
    .then(collection => collection.map((g) => {
      g.details = null;
      g.plays = null;
      return g;
    }))
    .then(collection => write(collection))
    .catch(err => logger.error(err));
}

async function bggSync(clearFirst) {
  if (clearFirst) {
    await clear();
    return retrieveCollectionAndSaveToFile();
  }
  return read()
    .then(updateGames)
    .catch(logger.error);
}

module.exports = bggSync;
