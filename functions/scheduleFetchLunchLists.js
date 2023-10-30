const { schedule } = require('@netlify/functions')
const fetchLunchLists = require('./FetchLunchLists')

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func
module.exports.handler = schedule("00 6 * * 1-5", async (event) => {
  const eventBody = JSON.parse(event.body)
  console.log(`Next function run at ${eventBody.next_run}.`)
  return await fetchLunchLists.handler(event);

  return {
    statusCode: 200,
  }
})
