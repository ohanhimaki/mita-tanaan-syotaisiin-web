/* Import faunaDB sdk */
const process = require('process')

const {Client, query} = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async () => {
  console.log('Function `read-all` invoked')

  try {
    const response = await client.query(query.Paginate(query.Match(query.Index('all_Restaurants'))))
    const itemRefs = response.data
    // create new query out of item refs. http://bit.ly/2LG3MLg
    const getAllItemsDataQuery = itemRefs.map((ref) => query.Get(ref))
    // then query the refs
    const ret = await client.query(getAllItemsDataQuery)

    const restaurants = ret.map((responserow) => {

      const restaurant = {
        ravintolaid: responserow.data.ravintolaid,
        apiid: responserow.data.apiid,
        nimi: responserow.data.nimi,
        tassalista: responserow.data.tassalista,
        linkki: responserow.data.linkki
      }
      return restaurant
    })

    return {
      statusCode: 200,
      body: JSON.stringify(restaurants),
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
