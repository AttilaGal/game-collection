const player = require('play-sound')();
const logger = require('../logger');

function success() {
  player.play(`${__dirname}/tada.mp3`, (err) => {
    if (err) logger.error(`Could not play sound: ${err}`);
  });
}

module.exports = {
  success,
};
