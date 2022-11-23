const { Pool } = require("pg");

let sslfromenv;

if (process.env.SSL === "false") {
  sslfromenv = false;
} else {
  sslfromenv = true;
}
console.log('ConnectionString', process.env.DATABASE_URL);
console.log('SSL', sslfromenv);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  pool
};
