const readbydaterange = require('./read-by-date-range.js')
const voteup = require('./vote-up.js')

const handler = async (event, context) => {
  const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '')
  const segments = path.split('/').filter(Boolean)

  console.log(event.httpMethod)
  switch (event.httpMethod) {
    case 'GET':
      // e.g. GET /.netlify/functions/fauna-crud/123456
      if (event.queryStringParameters.startdate && event.queryStringParameters.enddate) {
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

    case 'OPTIONS':
      if(event.queryStringParameters.lunchlistref && event.queryStringParameters.vote ){
        return await voteup.handler(event, context);
      }
      return {
        statusCode: 500,
        body: 'too many segments in GET request, must be either /.netlify/functions/fauna-crud or /.netlify/functions/fauna-crud/123456',
      }
    default:
      console.log('tulee tänne1')
      return {
        statusCode: 500,
        body: 'unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE',
      }

  }
}

module.exports = {handler}
