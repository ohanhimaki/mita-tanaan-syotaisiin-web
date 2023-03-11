/* Import faunaDB sdk */
const process = require('process')

const { Client, query } = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async (collection, event) => {
  const data = JSON.parse(event.body)
  const { id } = event
  try {
    const response = await client.query(query.Update(query.Ref(query.Collection(collection), id), { data }))
    console.log('success', response)
    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        'Access-Control-Allow-Origin': '*',
        },
    }
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

module.exports = { handler }
