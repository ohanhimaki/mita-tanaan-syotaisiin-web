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
    // if lunchlist exists, update it
    if (response3.data.length > 0) {
      const lunchlistRef = response3.data[0];
      const response4 = await client.query
      (
        query.Update
        (
          lunchlistRef,
          {
            data: {
              dayData: data.dayData,
            }
          }
        )
      );
      console.log('Päivitettiin', data.restaurantData.ravintolaid, data.date)
      return {
        statusCode: 200,
        body: JSON.stringify(response4),
      }
    } else {
      const response = await client.query(query.Create(query.Collection('LunchLists'), item))
      /* Success! return the response with statusCode 200 */
      console.log('Lisättiin', data.restaurantData.ravintolaid, data.date)
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      }

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
