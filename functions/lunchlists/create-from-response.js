const process = require('process')


const { Client, query } = require('faunadb')
/* configure faunaDB Client with our secret */
const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

/* export our lambda function as named "handler" export */
const handler = async (data) => {
  /* parse the string body into a useable JS object */
  const item = {
    data,
  }
  /* construct the fauna query */
  try {
    //check if row still exists
    const response3 = await client.query
    (
      query.Paginate
      (
        query.Match
        (
          query.Index('lunchlists_refs_by_restaurant_and_date'),
          data.restaurantData.ravintolaid,
          data.date,
        )
      )
    )
    // delete LunchList items by restaurant id and date
    const response2 = await client.query
    (
      query.Map
      (
        query.Paginate
        (
          query.Match
          (
            query.Index('lunchlists_refs_by_restaurant_and_date'),
            data.restaurantData.ravintolaid,
            data.date,
          )
        ),
        query.Lambda
        (
          'X',
          query.Delete(query.Var('X'))
        )
      )
    )

    const response = await client.query(query.Create(query.Collection('LunchLists'), item))
    /* Success! return the response with statusCode 200 */
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    console.log('error', error)
    /* Error! return the error with statusCode 400 */
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
}

module.exports = { handler }
