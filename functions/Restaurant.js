const createRoute = require('./BasicMethods/create.js')
const deleteRoute = require('./BasicMethods/delete.js')
const readAllByOwner = require('./BasicMethods/read-all-by-owner')
const readRoute = require('./BasicMethods/read.js')
const updateRoute = require('./BasicMethods/update.js')
const {Indexes, Collections, IndexesLoopaple} = require("./bootstrapDatabase");

const collection = Collections.Restaurants;
const index_all = Indexes.all_Restaurants;

const handler = async (event, context) => {
  const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '')
  const segments = path.split('/').filter(Boolean)

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
      if (segments.length === 0) {
        return readAllByOwner.handler(collection, index_all, event, context)
      }
      // e.g. GET /.netlify/functions/fauna-crud/123456
      if (segments.length === 1) {
        const [id] = segments
        event.id = id
        return readRoute.handler(collection, index_all, event, context)
      }
      return {
        statusCode: 500,
        body: 'too many segments in GET request, must be either /.netlify/functions/fauna-crud or /.netlify/functions/fauna-crud/123456',
      }
    case 'POST':
      if (segments.length === 0) {
        return createRoute.handler(collection, event, context)

      }
    case 'PUT':
      // e.g. PUT /.netlify/functions/fauna-crud/123456 with a body of key value pair objects, NOT strings
      if (segments.length === 1) {
        const [id] = segments
        event.id = id
        return updateRoute.handler(collection, event, context)

      }
      return {
        statusCode: 500,
        body: 'invalid segments in POST request, must be /.netlify/functions/fauna-crud/123456',
      }
    case 'DELETE':
      // e.g. DELETE /.netlify/functions/fauna-crud/123456
      if (segments.length === 1) {
        const [id] = segments
        event.id = id
        return deleteRoute.handler(collection, index_all, event, context)
      }
      return {
        statusCode: 500,
        body: 'invalid segments in DELETE request, must be /.netlify/functions/fauna-crud/123456',
      }
    default:
      return {
        statusCode: 500,
        body: 'unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE',
      }
  }
}

module.exports = { handler }
