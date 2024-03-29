const process = require('process')

const {Client, query} = require('faunadb')

/* configure faunaDB Client with our secret */
const client = new Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
})

/* export our lambda function as named "handler" export */
const handler = async (collection, event) => {


    /* parse the string body into a useable JS object */
    const data = JSON.parse(event.body)
    const item = {
        data,
    }
    /* construct the fauna query */
    try {
        const response = await client.query(query.Create(query.Collection(collection), item))
        console.log('success', response)
        /* Success! return the response with statusCode 200 */
        return {
            statusCode: 200,
            body: JSON.stringify(response),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }
    } catch (error) {
        console.log('error', error)
        /* Error! return the error with statusCode 400 */
        return {
            statusCode: 400,
            body: JSON.stringify(error),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }
    }
}

module.exports = {handler}
