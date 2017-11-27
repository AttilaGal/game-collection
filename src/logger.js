/* eslint-disable no-console */

function log(message) {
  console.log(message);
}

function error(message) {
  console.error(message);
}

function info(message) {
  console.info(message);
}

function warning(message) {
  console.warning(message);
}

module.exports = {
  log,
  error,
  info,
  warning,
};

/* eslint-enable no-console */
