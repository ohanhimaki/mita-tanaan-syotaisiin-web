const { pool } = require("../db/db");
const datehelper = require("../services/datehelpers");
const datehelper2 = require("../../dw/helpers/datehelpers");

exports.sendDayStatuses = (request, response) => {
  const lunchofday = getLunchOfDay();
  const allLunchLists = lunchListsByParameters(datehelper2(new Date(), undefined, false))


};

function getLunchOfDay() {

  pool.query(
    `SELECT distinct l.*, r.linkki as link
     from lunchofday l
            left join ravintolat r on l.restaurantid = r.ravintolaid
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
}

function lunchofDayDateintToDate(results) {
  resultsArray = [];
  for (var i in results) {
    tmp = results[i];
    tmp.paiva = datehelper.dateintToDate(tmp.paiva);

    resultsArray.push(tmp);
  }
  return resultsArray;
}


function lunchListsByParameters (dateInt, restaurantId, showHandheld){
  let kaikkiPaivat = 0;
  let kaikkiRavintolat = 0;

  let paiva = 0;
  if (!dateInt) {
    paiva = 0;
    kaikkiPaivat = 1;
  } else {
    paiva = request.query.paiva;
  }
  if (!restaurantId) {
    ravintolaid = 0;
    kaikkiRavintolat = 1;
  } else {
    ravintolaid = restaurantId;
  }
  let showHandheldLists = showHandheld ? 1 : 0;

  console.log(showHandheldLists);
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
and ($5 = 1)
group by kpl.ravintolaid, r.nimi, r.linkki
) x
order by date DESC, nimi, restaurantid


`,

    [paiva, kaikkiPaivat, ravintolaid, kaikkiRavintolat, showHandheldLists],
    (error, results) => {
      if (error) {
        throw error;
      }
      resultsArray = lunchListDateintToDate(results.rows);
      return resultsArray;
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
