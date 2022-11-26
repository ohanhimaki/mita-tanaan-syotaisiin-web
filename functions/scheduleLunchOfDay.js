const { schedule } = require('@netlify/functions')
const generateLunchOfDay = require('./GenerateLunchOfDay')

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func
module.exports.handler = schedule("45 10 * * *", async (event) => {
  const eventBody = JSON.parse(event.body)
  console.log(`Next function run at ${eventBody.next_run}.`)
  return await generateLunchOfDay.handler(event);

  return {
    statusCode: 200,
  }
})
