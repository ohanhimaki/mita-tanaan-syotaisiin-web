const { Pool } = require("pg");

let sslfromenv;

if (process.env.SSL === "false") {
  sslfromenv = false;
} else {
  sslfromenv = true;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  pool
};
