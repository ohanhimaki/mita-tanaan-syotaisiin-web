const { pool } = require("../db/db");
const datehelper = require("../services/datehelpers");

exports.haeListat = (request, response) => {
  let kaikkiPaivat = 0;
  let kaikkiRavintolat = 0;

  let paiva = 0;
  if (!request.query.paiva) {
    paiva = 0;
    kaikkiPaivat = 1;
  } else {
    paiva = request.query.paiva;
  }
  if (!request.query.ravintolaid) {
    ravintolaid = 0;
    kaikkiRavintolat = 1;
  } else {
    ravintolaid = request.query.ravintolaid;
  }

  pool.query(
    `SELECT *
    FROM (SELECT r.date, r.restaurantid, r.lunch, ra.nimi, ra.linkki link
FROM lunchlist r
left join ravintolat ra on r.restaurantid = ra.ravintolaid
where (date = $1 OR 1 = $2) AND (ra.ravintolaid = $3  OR 1 = $4)

UNION

SELECT CASE WHEN 0 = 1 then 20191201 else $1 end date,
kpl.ravintolaid as restaurantid,
string_agg(kpl.teksti, ' <br>') lunch,
r.nimi nimi,
r.linkki link
from kasinpaivitetytlistat kpl
left join ravintolat r on kpl.ravintolaid = r.ravintolaid
where r.nimi is not null
and (kpl.ravintolaid = $3 OR 1= $4)
group by kpl.ravintolaid, r.nimi, r.linkki
) x
order by date DESC, nimi, restaurantid


`,
    [paiva, kaikkiPaivat, ravintolaid, kaikkiRavintolat],
    (error, results) => {
      if (error) {
        throw error;
      }
      resultsArray = lunchListDateintToDate(results.rows);
      response.status(200).json(resultsArray);
    }
  );
};

function lunchListDateintToDate(results) {
  resultsArray = [];
  for (var i in results) {
    tmp = results[i];
    tmp.date = datehelper.dateintToDate(tmp.date);

    resultsArray.push(tmp);
  }
  return resultsArray;
}
