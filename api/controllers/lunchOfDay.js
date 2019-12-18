const { pool } = require("../db/db");
const datehelper = require("../services/datehelpers");

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
      resultsArray = lunchofDayDateintToDate(results.rows);
      response.status(200).json(resultsArray);
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
      resultsArray = lunchofDayDateintToDate(results.rows);
      response.status(200).json(resultsArray);
    }
  );
};

function lunchofDayDateintToDate(results) {
  resultsArray = [];
  for (var i in results) {
    tmp = results[i];
    tmp.paiva = datehelper.dateintToDate(tmp.paiva);

    resultsArray.push(tmp);
  }
  return resultsArray;
}
