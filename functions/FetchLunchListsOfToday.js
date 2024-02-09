const {haeDatat, GetDataByDay} = require("./helpers/helpers");
const restaurants = require("./restaurants.json");


const handler = async () => {
  // read restaurants from restaurants.json
  const restaurants = require('./restaurants.json')

  const dayofweek = 1;

  let ravintolaData = [];
  for(let i = 0; i < restaurants.length; i++) {
    let result = (await haeDatat(restaurants[i], i));
    if(!result) continue;
    var dayData = GetDataByDay(result.data, dayofweek);

    // ravintolaData.push(dayData);

  }



  return {
    statusCode: 200,
    body: JSON.stringify(ravintolaData),
  }
}

module.exports = { handler }
