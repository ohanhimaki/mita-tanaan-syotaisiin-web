/* Import faunaDB sdk */
const process = require('process')

const {Client, query} = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async (event, context) => {
  const lunchListRef = event.queryStringParameters.lunchlistref;

  console.log('Function `vote-up` invoked', event.queryStringParameters)

  try {

    //call voteLunchList function with lunchListRef
    var result = await client.query(
    query.Call('voteLunchList', lunchListRef)
    )
      .then((ret) => {
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          },
          body: JSON.stringify(ret),
        }
      }
      )
      .catch((err) => {
        console.error(
          'Error: [%s] %s: %s',
          err.name,
          err.message,
          err.errors()[0].description,
        )
      })
    return result;

  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 400,
      body: JSON.stringify(error),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  }
}

module.exports = {handler}
