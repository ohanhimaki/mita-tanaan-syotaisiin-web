const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {
    pool
} = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors())

const haeRavintolat = (request, response) => {

    pool.query('SELECT * FROM ravintolat;', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const lisaaRavintola = (request, response) => {
    const {
        apiid,
        nimi
    } = request.body

    pool.query('INSERT INTO ravintolat (apiid, nimi) VALUES ($1, $2);', [apiid, nimi], error => {
        if (error) {
            throw error
        }
        response.status(201).json({
            status: 'success',
            message: 'Ravintola added.'
        })
    })
}

app
    .route('/ravintolat')
    // GET endpoint
    .get(haeRavintolat)
    // POST endpoint
    .post(lisaaRavintola)

// Start server
app.listen(process.env.PORT || 3002, () => {
    console.log(`Server listening`)
})