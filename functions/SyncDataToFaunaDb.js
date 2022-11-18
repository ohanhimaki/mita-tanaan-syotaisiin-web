

/* Import faunaDB sdk */
const process = require('process')

const { Client, query } = require('faunadb')
// const {pool} = require("../api/db/db");

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async () => {
  const dontAllowRun = true;
  const filepath = 'C:/MTSDataBackup/restaurantGenre.json';
  const tableName = "RestaurantGenre";
  console.log('Sync started')
  if (dontAllowRun) {
    return {
      statusCode: 200,
      body: JSON.stringify(rowsJson),
    }
  }
// get restaurants from api https://mita-tanaan-syotaisiin.herokuapp.com/api/ravintolat

  // var restaurants = await fetch('https://mita-tanaan-syotaisiin.herokuapp.com/api/ravintolat');

  // read data from json file
  var fs = require('fs');
  var fileSync = fs.readFileSync(filepath);




  //convert to json
  var rows = JSON.parse(fileSync);

  console.log(rows);

  // var rowsJson = await rows.json();
  var rowsJson = rows;

  //log json

  console.log(rowsJson);

  //loop through json

  for (var i = 0; i < rowsJson.length; i++) {
    //write item to fauna

      try {
        const response = await client.query(query.Create(query.Collection(tableName), { data: rowsJson[i] }))
        console.log('success', response)
      }
      catch (error) {
        console.log('error', error)
      }

  }


  return {
    statusCode: 200,
    body: JSON.stringify(rowsJson),
  }

}

module.exports = { handler }
