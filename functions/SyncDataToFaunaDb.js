

/* Import faunaDB sdk */
const process = require('process')

const { Client, query } = require('faunadb')
// const {pool} = require("../api/db/db");

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async () => {
  console.log('Sync started')
// get restaurants from api https://mita-tanaan-syotaisiin.herokuapp.com/api/ravintolat

  var restaurants = await fetch('https://mita-tanaan-syotaisiin.herokuapp.com/api/ravintolat');

  //log restaurant data

  console.log(restaurants);

  //convert to json

  var restaurantsJson = await restaurants.json();

  //log json

  console.log(restaurantsJson);

  //loop through json

  for (var i = 0; i < restaurantsJson.length; i++) {
    //write item to fauna

      try {
        const response = await client.query(query.Create(query.Collection('Restaurants'), { data: restaurantsJson[i] }))
        console.log('success', response)
      }
      catch (error) {
        console.log('error', error)
      }

  }


  return {
    statusCode: 200,
    body: JSON.stringify(restaurantsJson),
  }

}

module.exports = { handler }
