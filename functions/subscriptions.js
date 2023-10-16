const createRoute = require('./BasicMethods/create.js')
const deleteRoute = require('./BasicMethods/delete.js')
const readRoute = require('./BasicMethods/read.js')
const readAllRoute = require('./BasicMethods/read-all.js')
const updateRoute = require('./BasicMethods/update.js')
const {Indexes, Collections} = require("./bootstrapDatabase");


const handler = async (event, context) => {
  console.log("event.httpMethod: " + event.httpMethod)
  console.log("event.body: " + event.body)
  // const collection = Collections.Subscriptions;
  // const index_all = Indexes.all_Subscriptions;
  const collection = "Subscriptions";
  const index_all = "all_Subscriptions";

  switch (event.httpMethod) {
    case 'OPTIONS':
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      }
      return { statusCode: 204, headers: corsHeaders }
    case 'GET':
      // e.g. GET /.netlify/functions/fauna-crud
        return readAllRoute.handler(collection, index_all)
    case 'POST':
        // e.g. POST /.netlify/functions/fauna-crud with a body of key value pair objects, NOT strings
        return createRoute.handler(collection, event, context)
    default:
      return {
        statusCode: 500,
        body: 'unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE',
      }
  }
}

module.exports = { handler }
