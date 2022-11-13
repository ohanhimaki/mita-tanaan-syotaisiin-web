// /* code from functions/todos-read-all.js */
// import faunadb from 'faunadb'
//
// const q = faunadb.query
// const client = new faunadb.Client({
//   secret: process.env.FAUNADB_SECRET
// })
//
// exports.handler = (event, context, callback) => {
//   /// Faunadb get all webhooksubscriptions from the database
//   return client.query(q.Paginate(q.Match(q.Ref('indexes/all_webhooksubscriptions'))))
//
//     .then((response) => {
//       const webhooksubscriptionRefs = response.data
//       console.log('WebhookSubscription refs', webhooksubscriptionRefs)
//       console.log(`${webhooksubscriptionRefs.length} webhooksubscriptions found`)
//       const getAllWebhookSubscriptionDataQuery = webhooksubscriptionRefs.map((ref) => {
//         return q.Get(ref)
//       })
//       return client.query(getAllWebhookSubscriptionDataQuery).then((ret) => {
//         return callback(null, {
//           statusCode: 200,
//           body: JSON.stringify(ret)
//         })
//       })
//     })
// }


/* Import faunaDB sdk */
const process = require('process')

const { Client, query } = require('faunadb')

const client = new Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

const handler = async () => {
  console.log('Function `read-all` invoked')

  try {
    const response = await client.query(query.Paginate(query.Match(query.Index('all_webhooksubscriptions'))))
    const itemRefs = response.data
    // create new query out of item refs. http://bit.ly/2LG3MLg
    const getAllItemsDataQuery = itemRefs.map((ref) => query.Get(ref))
    // then query the refs
    const ret = await client.query(getAllItemsDataQuery)
    return {
      statusCode: 200,
      body: JSON.stringify(ret),
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
