const { pool } = require("../db/db");

exports.read = (request, response) => {
  pool.query(
    `SELECT *
 from lunchofdaytmp
 ORDER BY totalscore desc`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
