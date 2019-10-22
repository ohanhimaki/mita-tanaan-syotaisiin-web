const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    pgUrl: process.env.DATABASE_URL

}