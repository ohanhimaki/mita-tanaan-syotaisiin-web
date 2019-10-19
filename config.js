const {
    Pool
} = require('pg');

console.log(process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})

module.exports = {
    pool

}