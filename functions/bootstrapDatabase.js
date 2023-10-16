

/* Import faunaDB sdk */
const process = require('process')

const { Client, query } = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

async function createCollection(collectionName) {
  const collectionExists = await client
    .query(query.Exists(query.Collection(collectionName)))
    .catch((error) => {
      console.log('error', error)
    })
  if (collectionExists) {
    console.log(`Collection ${collectionName} already exists`)
    return
  }
  console.log(`Creating collection ${collectionName}`)
  await client
    .query(query.CreateCollection({ name: collectionName }))
    .catch((error) => {
      console.log('error', error)
    })
}


async function createIndex(indexName, collectionName, values, terms){
  //check if index already exists
  const indexExists = await client.query
  (query.Exists(query.Index(indexName)))
    .then((ret) => {
      console.log("indexExists - " + indexName, ret)
      return ret
    })
    .catch((err) => console.error(
      'Error: [%s] %s: %s',
      err.name,
      err.message,
      err.errors()[0].description,
    ))

  if (!indexExists) {
    console.log("Creating index", indexName)

    const basicInfos = {
      name: indexName,
      source: query.Collection(collectionName),
    }

    const params ={
      ... basicInfos,
      ...(values && values.length>0 && {values: values}),
      ...(terms && terms.length>0 && {terms: terms})
    } ;
    console.log(params);

    client.query(
      query.CreateIndex(
        params
         )
    )
      .then((ret) => console.log(ret))
      .catch((err) => console.error(
        'Error: [%s] %s: %s - %s',
        err.name,
        err.message,
        err.errors()[0].description,
        indexName,
      ))

  }
}


async function createFunction(functionName, functionBody) {
  let checkFunction;
  try {
    checkFunction = await client.query(
      query.Exists(query.Function(functionName))
    );
    console.log("Function already exists? - " + functionName, checkFunction)
  } catch (error){
    console.log("Function does not exist, creating it")

  }
  if (!checkFunction) {

    try {
      const createFunction = await client.query(
        query.CreateFunction({
          name: functionName,
          body: functionBody
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

}


  const Collections = {
    GenreOfRestaurant: "GenreOfRestaurant",
    HandHeldLists: "HandHeldLists",
    LunchLists: "LunchLists",
    LunchOfDay: "LunchOfDay",
    LunchOfDayTemp: "LunchOfDayTemp",
    RestaurantGenre: "RestaurantGenre",
    Restaurants: "Restaurants",
    WebHookSubscriptions: "WebHookSubscriptions",
    Subscriptions: "Subscriptions",
  };

  const Indexes = {
    all_LunchOfDay: "all_LunchOfDay",
    all_LunchOfDayTemp: "all_LunchOfDayTemp",
    all_Restaurants: "all_Restaurants",
    all_webhooksubscriptions: "all_webhooksubscriptions",
    lunchlists_by_date: "lunchlists_by_date",
    lunchlists_refs_by_date: "lunchlists_refs_by_date",
    lunchlists_refs_by_restaurant_and_date: "lunchlists_refs_by_restaurant_and_date",
    lunchlists_refs_by_restaurantid: "lunchlists_refs_by_restaurantid",
    lunchofday_by_day: "lunchofday_by_day",
    all_Subscriptions: "all_Subscriptions",
  };


const handler = async () => {
  console.log("Creating database")

  await createCollection(Collections.GenreOfRestaurant);
  await createCollection(Collections.HandHeldLists);
  await createCollection(Collections.LunchLists);
  await createCollection(Collections.LunchOfDay);
  await createCollection(Collections.LunchOfDayTemp);
  await createCollection(Collections.RestaurantGenre);
  await createCollection(Collections.Restaurants);
  await createCollection(Collections.WebHookSubscriptions);
  await createCollection(Collections.Subscriptions);

  await createIndex(Indexes.all_LunchOfDay, Collections.LunchOfDay, [], []);
  await createIndex(Indexes.all_LunchOfDayTemp, Collections.LunchOfDayTemp, [], []);
  await createIndex(Indexes.all_Restaurants, Collections.Restaurants, [], []);
  await createIndex(Indexes.all_webhooksubscriptions, Collections.WebHookSubscriptions, [], []);
  await createIndex(Indexes.lunchlists_by_date, Collections.LunchLists, [], [
    {
      field: ["data", "date"]
    }
  ]);
  await createIndex(Indexes.lunchlists_refs_by_date, Collections.LunchLists, [
    {
      field: ["data", "date"]
    },
    {
      field: ["ref"]
    }
  ], []);

  await createIndex(Indexes.lunchlists_refs_by_restaurant_and_date, Collections.LunchLists, [
    {
      field: ["ref"]
    }
  ], [
    {
      field: ["data", "restaurantData", "ravintolaid"]
    },
    {
      field: ["data", "date"]
    }
  ]);

  await createIndex(Indexes.lunchlists_refs_by_restaurantid, Collections.LunchLists, [
    {
      field: ["ref"]
    }
  ], [
    {
      field: ["data", "restaurantData", "ravintolaid"]
    }
  ]);

  await createIndex(Indexes.lunchofday_by_day, Collections.LunchOfDay, [
    {
      field: ["ref"]
    }
  ], [
    {
      field: ["data", "date"]
    }
  ]);
  await createIndex(Indexes.all_Subscriptions, Collections.Subscriptions, [], []);




  await createIndex(Indexes.lunchlists_by_date, Collections.LunchLists, [
    { field: ["data", "date"] },
    { field: ['ref']},
  ])
  //check if function already exists
  await createFunction("lunchListsByDateRange",
    query.Query(
      query.Lambda(
        ["start", "end"],
        query.Map(
          query.Select(
            ['data'],
            query.Paginate(
              query.Range(
                query.Match(query.Index(Indexes.lunchlists_refs_by_date)),
                query.Var('start'),
                query.Var('end')
              )
              ,
              { size: 1000}
            )
          ),
          query.Lambda(['date', 'ref'], query.Get(query.Var('ref')))
        )
      )
    )
  );


  await createIndex(Indexes.lunchofday_by_day, Collections.LunchOfDay, [
    { field: ["data", "date"] },
    { field: ['ref']},
  ])
  await createFunction("lunchOfDayByDateRange",
    query.Query(
      query.Lambda(
        ["start", "end"],
        query.Map(
          query.Select(
            ['data'],
            query.Paginate(
              query.Range(
                query.Match(query.Index(Indexes.lunchofday_by_day)),
                query.Var('start'),
                query.Var('end')
              )
            )
          ),
          query.Lambda(['date', 'ref'], query.Get(query.Var('ref')))
        )
      )
    )
  );

  await createFunction("voteLunchList",
    query.Query(
      query.Lambda(['lunchListRefId'],
        query.Let(
          {
            lunchListRef: query.Ref(query.Collection(Collections.LunchLists), query.Var("lunchListRefId")),
            lunchList: query.Get(query.Var("lunchListRef")),
            lunchListVotes: query.Select(["data", "votes"], query.Var("lunchList"), 0)
          },
          query.Update(query.Var('lunchListRef'),{data:{votes:query.Add(query.Var('lunchListVotes'),1)}})
        )
      )
    )
  );
  return {
    statusCode: 200,
    body: JSON.stringify("Done"),
  }

}

module.exports = { handler }
