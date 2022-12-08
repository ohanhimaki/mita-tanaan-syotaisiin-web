const readLunchListsByDate = require('./lunchlists/read-by-date')
const readLunchOfDay = require('./lunchofday/lunchofday')

/* Import faunaDB sdk */
const process = require('process')

const {Client, query} = require('faunadb')
const {sendLunchOfDayWebHookMessages} = require("./sendLunchOfDayWebHookMessages");

const handler = async () => {

  //get date as string yyyymmdd
   const date = new Date();
   const year = date.getFullYear();
   const month = date.getMonth() + 1;
   const day = date.getDate();
   const dateString = year + (month < 10 ? '0' : '') + month + (day < 10 ? '0' : '') + day;




  const client = new Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  })
  let lunchOfDay;
  try {

    console.log("readLunchListsByDate");
    lunchOfDay = await JSON.parse((await readLunchOfDay.handler({
      httpMethod:"GET"})).body);
  } catch (error) {
    // if errorType: NotFound its ok
    console.log("error", error);
    if (error?.requestResult?.statusCode === 404) {
      console.log('LunchOfDay not found, creating new one')
    } else {

    console.log('error', error)
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
  }
  const clientNew = new Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  })
  if(lunchOfDay.length ===0) {
    console.log('lunchOfDay', lunchOfDay);
    try {
      const response = await clientNew.query
      (query.Paginate(query.Match(query.Index('all_LunchOfDayTemp'))))
      const itemRefs = response ? response.data : []
      // create new query out of item refs. http://bit.ly/2LG3MLg
      const deleteAllItemsDataQuery = itemRefs.map((ref) => query.Delete(ref))
      // then query the refs
      const ret
        = await
        clientNew
          .query
          (deleteAllItemsDataQuery)
    } catch (error) {
      console.log('error', error)
    }

    // get all restaurants
    // const restaurants = await readAllRestaurants.handler()

    const lunchLists = JSON.parse((await readLunchListsByDate.handler(dateString)).body);
    if(lunchLists.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify("Lounaslistoja ei löytynyt"),
      }
    }
    const lunchListsParsed = lunchLists;
    //sort by data.votes
    const sortedLunchLists = lunchListsParsed.sort((a, b) => {
      // votes can be undefined
      const votesA = a.data.votes ? a.data.votes : 0;
      const votesB = b.data.votes ? b.data.votes : 0;
      return votesB - votesA;
    })

    // insert sortedLunchLists into collection LunchOfDayTemp
    let i = 0;
    let lunchofday_by_day;
    for (const lunchList of sortedLunchLists) {
      console.log(i);
      try {
        const response = await clientNew.query
        (query.Create(query.Collection('LunchOfDayTemp'), {
          data:  lunchList.data ,
        }))
        if (i ===0) {
          // check if lunchofday_by_day retuns any
          try {
          lunchofday_by_day = await (await readLunchOfDay.handler({queryStringParameters:{date:dateString},
          httpMethod:"GET"})).body;
          console.log("lunchofday_by_day", lunchofday_by_day);
          } catch (error) {
            // if errorType: NotFound its ok
            if (error.requestResult?.statusCode === 404) {
              console.log('LunchOfDay not found, creating new one')
            } else {

              console.log('error', error)
              return {
                statusCode: 400,
                body: JSON.stringify(error),
              }
            }
}
console.log("TULEE TÄHÄN")
console.log('lunchofday_by_day', lunchofday_by_day)
          if (JSON.parse(lunchofday_by_day).length === 0) {
            try {

            const response2 = await clientNew.query
            (query.Create(query.Collection('LunchOfDay'), {
              data: lunchList.data,
            }))
            } catch (error) {
              console.log('error', error)
            }
          }
        }
        i++;
      } catch (error) {
        console.log('error', error)
      }
    }
    const clientNew2 = new Client({
      secret: process.env.FAUNADB_SERVER_SECRET,
    })
    lunchOfDay = await (await readLunchOfDay.handler({queryStringParameters:{date:dateString},
      httpMethod:"GET"
    })).body;
    console.log('lunchOfDay', lunchOfDay)
    console.log("Luotiin uusi")
  }
  var result = await sendLunchOfDayWebHookMessages();

  return {
    statusCode: 200,
    body: JSON.stringify(lunchOfDay),
  }
}

module.exports = {handler}
