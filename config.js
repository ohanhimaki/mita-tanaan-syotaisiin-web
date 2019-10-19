const dotenv = require('dotenv');
const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

dotenv.config();
module.exports = {
    pool

}