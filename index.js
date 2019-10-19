const dotenv = require('dotenv');

dotenv.config();
const {
    client
} = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const {
    Pool
} = require("pg");
const cors = require('cors')

const app = express()

console.log(process.env.DATABASE_URL);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors())

const haeRavintolat = (request, response) => {

    client.connect();
    client.query('SELECT * FROM ravintolat;', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
        client.end();

    })

}

const lisaaRavintola = (request, response) => {
    const {
        apiid,
        nimi
    } = request.body

    client.connect();
    client.query('INSERT INTO ravintolat (apiid, nimi) VALUES ($1, $2);', [apiid, nimi], error => {
        if (error) {
            throw error
        }
        response.status(201).json({
            status: 'success',
            message: 'Ravintola added.'
        })
        client.end();

    })

}

const testi = () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });


    pool.query("SELECT RavintolaID, apiid, Nimi FROM Ravintolat;", (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(row);
        }
    });
}

app
    .route('/ravintolat')
    // GET endpoint
    .get(haeRavintolat)
    // POST endpoint
    .post(lisaaRavintola)
app
    .route('/testi')
    .get(testi)



// Start server
app.listen(process.env.PORT || 3002, () => {
    console.log(`Server listening`)
})