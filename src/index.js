const cron = require('node-cron');
const bggSync = require('./syncer');
const analyzer = require('./analyzer');

// cron.schedule('*/5 * * * * *', bggSync);

analyzer.analyzeLeastPlayed();

