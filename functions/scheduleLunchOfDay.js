const { schedule } = require('@netlify/functions')
const generateLunchOfDay = require('./GenerateLunchOfDay')

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func
module.exports.handler = schedule("58 8 * * *", async (event) => {
  const eventBody = JSON.parse(event.body)

  console.log("Calling generateLunchOfDay ");
  return await generateLunchOfDay.handler();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Lunch of day is generating on background' }),
  }
})
