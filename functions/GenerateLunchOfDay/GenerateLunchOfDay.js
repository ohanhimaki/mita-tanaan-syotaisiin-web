const readLunchListsByDate = require('../LunchLists/read-by-date')

/* Import faunaDB sdk */
const process = require('process')

const {Client, query} = require('faunadb')

const handler = async () => {

  var dateString = "20221125";

  const client = new Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  })
  let lunchOfDay;
  try {

    lunchOfDay = await client.query(
      query.Get(
        query.Match(
          query.Index('lunchofday_by_day'),
          dateString
        )
      )
    );
  } catch (error) {
    // if errorType: NotFound its ok
    if (error.requestResult.statusCode === 404) {
      console.log('LunchOfDay not found, creating new one')
    } else {

    console.log('error', error)
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
  }
  if(!lunchOfDay) {
    try {
      const response = await client.query
      (query.Paginate(query.Match(query.Index('all_LunchOfDayTemp'))))
      const itemRefs = response ? response.data : []
      // create new query out of item refs. http://bit.ly/2LG3MLg
      const deleteAllItemsDataQuery = itemRefs.map((ref) => query.Delete(ref))
      // then query the refs
      const ret
        = await
        client
          .query
          (deleteAllItemsDataQuery)
    } catch (error) {
      console.log('error', error)
    }

    // get all restaurants
    // const restaurants = await readAllRestaurants.handler()

    const lunchLists = (await readLunchListsByDate.handler(dateString)).body;

    const lunchListsParsed = JSON.parse(lunchLists);
    //sort by data.votes
    const sortedLunchLists = lunchListsParsed.sort((a, b) => {
      // votes can be undefined
      const votesA = a.data.votes ? a.data.votes : 0;
      const votesB = b.data.votes ? b.data.votes : 0;
      return votesB - votesA;
    })

    // insert sortedLunchLists into collection LunchOfDayTemp
    let i = 0;
    for (const lunchList of sortedLunchLists) {
      try {
        const response = await client.query
        (query.Create(query.Collection('LunchOfDayTemp'), {
          data:  lunchList.data ,
        }))
        if (i ===0) {
          // check if lunchofday_by_day retuns any
          let lunchofday_by_day;
          try {
          lunchofday_by_day = await client.query(
            query.Get(
              query.Match(
                query.Index('lunchofday_by_day'),
                dateString
              )
            )
          );
          } catch (error) {
            // if errorType: NotFound its ok
            if (error.requestResult.statusCode === 404) {
              console.log('LunchOfDay not found, creating new one')
            } else {

              console.log('error', error)
              return {
                statusCode: 400,
                body: JSON.stringify(error),
              }
            }
}


          if (!lunchofday_by_day) {
            const response2 = await client.query
            (query.Create(query.Collection('LunchOfDay'), {
              data: lunchList.data,
            }))
          }
        }
        i++;
      } catch (error) {
        console.log('error', error)
      }
    }
    lunchOfDay = await client.query(
      query.Get(
        query.Match(
          query.Index('lunchofday_by_day'),
          dateString
        )
      )
    )
    console.log("Luotiin uusi")
  }

  return {
    statusCode: 200,
    body: JSON.stringify(lunchOfDay),
  }
}

module.exports = {handler}
