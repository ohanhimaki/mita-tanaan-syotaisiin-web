

/* Import faunaDB sdk */
const process = require('process')

const { Client, query } = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async () => {
  console.log("Creating database")

  //check if index already exists
  const indexExists = await client.query
    (query.Exists(query.Index('lunchlists_refs_by_date')))
    .then((ret) => {
      console.log("indexExists", ret)
      return ret
    })
    .catch((err) => console.error(
      'Error: [%s] %s: %s',
      err.name,
      err.message,
      err.errors()[0].description,
    ))

  if (!indexExists) {
console.log("Creating index", "lunchlists_refs_by_date")

    client.query(
      query.CreateIndex({
        name: 'lunchlists_refs_by_date',
        source: query.Collection('LunchLists'),
        values: [
          {field: ['data', 'date']},
          {field: ['ref']},
        ],
      })
    )
      .then((ret) => console.log(ret))
      .catch((err) => console.error(
        'Error: [%s] %s: %s',
        err.name,
        err.message,
        err.errors()[0].description,
      ))

  }

  //check if function already exists
  let checkFunction;
  try {
    checkFunction = await client.query(
      query.Exists(query.Function("lunchListsByDateRange"))
    );
    console.log("Function already exists? ", checkFunction)
  } catch (error){
    console.log("Function does not exist, creating it")

  }
  if (!checkFunction) {

    try {
      const createFunction = await client.query(
        query.CreateFunction({
          name: "lunchListsByDateRange",
          body: query.Query(
            query.Lambda(
              ["start", "end"],
              query.Map(
                query.Select(
                  ['data'],
                  query.Paginate(
                    query.Range(
                      query.Match(query.Index('lunchlists_refs_by_date')),
                      query.Var('start'),
                      query.Var('end')
                    )
                  )
                ),
                query.Lambda(['date', 'ref'], query.Get(query.Var('ref')))
              )
            )
          ),
        }),
      )
        .then((ret) => {
          console.log("Function created", ret)
        })
        .catch((error) => {
          console.log("Function creation failed", error)
        })
    } catch (error) {
      console.log("Function creation failed", error)
    }
  }








  return {
    statusCode: 200,
    body: JSON.stringify("Done"),
  }

}

module.exports = { handler }
