const readbydaterange = require('./read-by-date-range.js')
const voteup = require('./vote-up.js')

const handler = async (event, context) => {

  console.log(event.httpMethod)
  switch (event.httpMethod) {
    case 'OPTIONS':
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      }
      return { statusCode: 204, headers: corsHeaders }
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

      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dateString = year + (month < 10 ? '0' : '') + month + (day < 10 ? '0' : '') + day;
      event.queryStringParameters.startdate = dateString;
      event.queryStringParameters.enddate = dateString;
      return await readbydaterange.handler(event, context);

    case 'PUT':
      if(event.queryStringParameters.lunchlistref && event.queryStringParameters.vote ){
        return await voteup.handler(event, context);
      }
      console.log("Eikai tänne tuu?")
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
