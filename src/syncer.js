const { getCollection, getGameDetails, getGamePlays } = require('./bgg.js');
const { read, write, clear } = require('./fileHandler');
const logger = require('./logger');
// const player = require('./audio/player');

let alreadyCleared = false;

async function updateGames(myCollection, stopCron) {
  const gameToUpdate = myCollection.find(g => !g.details || !g.plays);
  if (!gameToUpdate) {
    logger.info('sync complete!');
    stopCron();
    // return player.success();
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
  return getCollection()
    .then(collection => collection.map((g) => {
      g.details = null;
      g.plays = null;
      return g;
    }))
    .then(collection => write(collection))
    .catch(err => logger.error(err));
}

async function bggSync(clearFirst, stopCron) {
  if (clearFirst && !alreadyCleared) {
    await clear();
    return retrieveCollectionAndSaveToFile()
      .then(() => { alreadyCleared = true; });
  }
  return read()
    .then(res => updateGames(res, stopCron))
    .catch(logger.error);
}

module.exports = bggSync;
