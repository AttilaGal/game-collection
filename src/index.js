const cron = require('node-cron');
const bggSync = require('./syncer');
const analyzer = require('./analyzer');

const scheduled = cron.schedule('*/5 * * * * *', () => bggSync(true, stopCron));

function stopCron() {
  scheduled.stop();
  console.log('cron job stopped');
  analyzer.analyzeLeastPlayed();
}

