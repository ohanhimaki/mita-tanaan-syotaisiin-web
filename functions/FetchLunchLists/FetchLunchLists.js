
const readAllRestaurants = require('../Restaurants/read-all.js')
const insertLunchLists = require('../LunchLists/create-from-response.js')


const { Client, query } = require('faunadb')
const { haeDatat, haeDatat2, getDateData } = require('./helpers.js')

const handler = async () => {
  // ravintolat = await haeRavintolat();
  let ravintolat = (await readAllRestaurants.handler()).body;

  // response to array
  ravintolat = JSON.parse(ravintolat);


  let ravintolaData = [];
  ravintolat.forEach((ravintola, i) => {
    ravintolaData.push(haeDatat(ravintola.data, i));
  });
  let rowsToFormat = [];
  ravintolaData.forEach(x => {
    rowsToFormat.push(haeDatat2(x));
  });
  let rowsToInsert = [];
  let responsesOfInsert = [];
  rowsToFormat.forEach(x => {
    rowsToInsert.push(getDateData(x));
  });
  Promise.all(rowsToInsert).then(x => {
    x.forEach((restaurantLunchLists, i) => {
      if (restaurantLunchLists === undefined) return;
      restaurantLunchLists.forEach((lunchList, j) => {

        if (lunchList === undefined) return;

        // console.log(lunchList);
        responsesOfInsert.push(insertLunchLists.handler(lunchList));
      })
    })
    Promise.all(responsesOfInsert).then(x => {
      console.log("Ruokalistojen haku suoritettiin");

      return {
        statusCode: 200,
        body: JSON.stringify("Ruokalistojen haku suoritettiin"),
      }
    });
  });

  let x = await Promise.all(rowsToInsert);
  let y = await Promise.all(responsesOfInsert);
  return {
    statusCode: 200,
    body: JSON.stringify("Ruokalistojen haku suoritettiin"),
  }
}

module.exports = { handler }
