/* Import faunaDB sdk */
const process = require('process')

const { Client, query } = require('faunadb')
const {log} = require("util");

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async (event) => {
  const { id } = event
  console.log(`Function 'read' invoked. Read id: ${id}`)
  console.log(id+id);
  //try to convert id to int
  const idInt = parseInt(id);


  try {
    const response = await client
      .query(query.Paginate(query.Match(query.Index('lunchlists_refs_by_restaurantid'),
        idInt
      )))
    console.log(response);

    //get all lunchlists by refs
    const lunchlistsRefs = response.data
    const getAllLunchlistsDataQuery = lunchlistsRefs.map((ref) => query.Get(ref))
    const lunchlists = await client.query(getAllLunchlistsDataQuery)


    // export class Listrow {
    //   date: string;
    //   restaurantid: number;
    //   votes: number;
    //   nimi: string;
    //   lunch: string;
    //   link: string;
    // }


    const listRows = lunchlists.map((lunchlist) => {
      const data = lunchlist.data;
      return {date : data.date,
        restaurantid : data.restaurantData.ravintolaid,
        votes : data.votes,
        nimi : data.restaurantData.nimi,
        lunch : data.dayData,
        link : data.restaurantData.link};

    })

    return {
      statusCode: 200,
      body: JSON.stringify(listRows),
    }
  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    }
  }
}

module.exports = { handler }
