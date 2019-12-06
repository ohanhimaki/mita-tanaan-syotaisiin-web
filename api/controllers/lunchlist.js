const { pool } = require("../db/db");

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
    FROM (SELECT r.*, ra.nimi
FROM ruokalistat r
left join ravintolat ra on r.apiid = ra.apiid
where (paiva = $1 OR 1 = $2) AND (r.apiid = $3  OR 1 = $4)

UNION

SELECT CASE WHEN $2 = 1 then 20191201 else $1 end paiva,
0 as apiid,
kpl.rivi rivi,
kpl.teksti teksti,
r.nimi nimi
from kasinpaivitetytlistat kpl
left join ravintolat r on kpl.ravintolaid = r.ravintolaid
where r.nimi is not null
) x
order by paiva, nimi, apiid,  rivi`,
    [paiva, kaikkiPaivat, ravintolaid, kaikkiRavintolat],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
