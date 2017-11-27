const { read } = require('./fileHandler');
const moment = require('moment');
const logger = require('./logger');
const chalk = require('chalk');

const neverPlayed = 99999999;

function removeExpansions(game) {
  if (!game.details) {
    return false;
  }
  return game.details.type === 'boardgame';
}

function calculateTimeSinceMostRecentPlay(game) {
  let mostRecentPlay = null;
  let daysSinceMostRecentPlay = neverPlayed;
  if (!Array.isArray(game.plays) && game.plays.play.length) {
    const sortedPlays = game.plays.play
      .sort((playA, playB) => moment(playB.date, 'YYYY-MM-DD').toDate() - moment(playA.date, 'YYYY-MM-DD').toDate());
    mostRecentPlay = sortedPlays[0];
    daysSinceMostRecentPlay = moment().diff(moment(mostRecentPlay.date), 'days');
  }
  game.plays.mostRecentPlay = mostRecentPlay;
  game.plays.daysSinceMostRecentPlay = daysSinceMostRecentPlay;
  return game;
}

function sortByOldestPlay(gameA, gameB) {
  if (gameA.plays.daysSinceMostRecentPlay === neverPlayed) {
    return -1;
  }
  if (gameB.plays.daysSinceMostRecentPlay === neverPlayed) {
    return 1;
  }
  return gameB.plays.daysSinceMostRecentPlay - gameA.plays.daysSinceMostRecentPlay;
}

function printOutGame(game) {
  let days = game.plays.daysSinceMostRecentPlay;
  const title = chalk.bold.cyan(game.name[0]._);
  if (days === neverPlayed) {
    return logger.log(`${chalk.bold.red('never')} played ${title}`);
  }
  if (days > 365) {
    const mdays = days % 365;
    const years = (days - mdays) / 365;
    days = chalk.bold.red(`${years} years, `) + chalk.bold.yellow(`${mdays} days`);
  } else {
    days = chalk.bold.green(days);
  }
  return logger.log(`${days} days since you played ${title}`);
}

async function analyzeLeastPlayed() {
  const collection = await read();
  collection.filter(removeExpansions)
    .map(calculateTimeSinceMostRecentPlay)
    .sort(sortByOldestPlay)
    .map(printOutGame);
}

module.exports = { analyzeLeastPlayed };
