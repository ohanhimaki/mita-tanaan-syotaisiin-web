const readbydate = require('./read-by-date.js')
const readbydaterange = require('./read-by-date-range.js')
const readbyrestaurantid = require('./read-by-restaurant.js')

const handler = async (event, context) => {
  const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '')
  const segments = path.split('/').filter(Boolean)

  switch (event.httpMethod) {
    case 'GET':
      // e.g. GET /.netlify/functions/fauna-crud/123456
      if(event.queryStringParameters.startdate && event.queryStringParameters.enddate) {
          return await readbydaterange.handler(event, context);

      }
      // if (segments.length === 1) {
      //   const [id] = segments
      //   event.id = id
      //   return readbyrestaurantid.handler(event, context)
      // }
      return {
        statusCode: 500,
        body: 'too many segments in GET request, must be either /.netlify/functions/fauna-crud or /.netlify/functions/fauna-crud/123456',
      }

    default:
      return {
        statusCode: 500,
        body: 'unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE',
      }
  }
}

module.exports = { handler }
