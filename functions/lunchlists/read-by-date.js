/* Import faunaDB sdk */
const process = require('process')

const {Client, query} = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async (date) => {
  console.log('Function `read-all` invoked')

  try {
    const response = await client
      .query(query.Paginate(query.Match(query.Index('lunchlists_by_date'),
        date
      )))
    //get all lunchlists by refs
    const lunchlistsRefs = response.data
    const getAllLunchlistsDataQuery = lunchlistsRefs.map((ref) => query.Get(ref))
    const lunchlists = await client.query(getAllLunchlistsDataQuery)


    return {
      statusCode: 200,
      body: JSON.stringify(lunchlists),
    }
  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
}

  module.exports = {handler}
