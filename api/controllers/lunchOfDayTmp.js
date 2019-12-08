const { pool } = require("../db/db");

exports.read = (request, response) => {
  pool.query(
    `SELECT *
 from lunchofdaytmp`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
