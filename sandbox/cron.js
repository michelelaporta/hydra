var CronJob = require('cron').CronJob;
// every second new CronJob('* * * * * *', function() {
// every minutes
new CronJob('*/1 * * * * ', function() {
  console.log('You will see this message every minute ' +new Date());
}, null, true, 'America/Los_Angeles');