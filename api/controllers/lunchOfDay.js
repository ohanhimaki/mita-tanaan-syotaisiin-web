const { pool } = require("../db/db");

exports.getLunchOfDay = (request, response) => {
  pool.query(
    `SELECT distinct *
from lunchofday
where paiva = to_number(to_char(now(), 'YYYYMMDD'), '99999999')
;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

exports.getLunchOfDayHistory = (request, response) => {
  pool.query(
    `SELECT distinct *
from lunchofday
where paiva != to_number(to_char(now(), 'YYYYMMDD'), '99999999')
ORDER BY paiva DESC
LIMIT 5;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
