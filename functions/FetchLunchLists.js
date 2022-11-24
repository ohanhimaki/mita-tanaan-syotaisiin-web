
const readAllRestaurants = require('./restaurants/read-all.js')
const insertLunchLists = require('./lunchlists/create-from-response.js')
const { haeDatat, haeDatat2, getDateData } = require('./helpers/helpers.js')


const { Client, query } = require('faunadb')

const handler = async () => {
  // ravintolat = await haeRavintolat();
  let ravintolat = (await readAllRestaurants.handler()).body;

  // response to array
  ravintolat = JSON.parse(ravintolat);

  let ravintolaData = [];
  let i = 0;
  ravintolat.forEach((ravintola, i) => {
    if (ravintola?.apiid){
      i++;
      ravintolaData.push(haeDatat(ravintola, i));

    }
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
      console.log("Ruokalistojen haku suoritettiin " + i.toString() + " ravintolalle");

      return {
        statusCode: 200,
        body: JSON.stringify("Ruokalistojen haku suoritettiin " + i.toString() + " ravintolalle"),
      }
    });
  });

  let x = await Promise.all(rowsToInsert);
  let y = await Promise.all(responsesOfInsert);
  return {
    statusCode: 200,
    body: JSON.stringify("Ruokalistojen haku suoritettiin " + i.toString() + " ravintolalle"),
  }
}

module.exports = { handler }
