/* Import faunaDB sdk */
const process = require('process')

const {Client, query} = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async (event, context) => {
  console.log('Function `read-all` invoked')
  // http://localhost:8888/.netlify/functions/lunchlists?startdate=20221122&enddate=20221122
  //event.queryStringParameters.startdate
  const startdate = event.queryStringParameters.startdate;
  const enddate = event.queryStringParameters.enddate;

  try {
    var result = await client.query(
      query.Call('lunchListsByDateRange', startdate, enddate)
    )
      .then((ret) => {
        console.log("test", ret)
        return {
          statusCode: 200,
          body: JSON.stringify(ret),
        }
      })
      .catch((err) => console.error(
        'Error: [%s] %s: %s',
        err.name,
        err.message,
        err.errors()[0].description,
      ))
    return result;
  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
}

module.exports = {handler}
