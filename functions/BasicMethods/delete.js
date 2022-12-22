/* Import faunaDB sdk */
const process = require('process')

const { Client, query } = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async (collection, index_all, event) => {
  const { id } = event
  console.log(`Function 'delete' invoked. delete id: ${id}`)
  try {
    const response = await client.query(query.Delete(query.Ref(query.Collection(collection), id)))
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
