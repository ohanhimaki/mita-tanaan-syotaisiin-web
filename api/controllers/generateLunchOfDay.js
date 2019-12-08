const { pool } = require("../db/db");

exports.generateLunchOfDay = (request, response) => {
  pool.query(
    `

DELETE FROM lunchofdaytmp
where paiva < to_number(to_char(now(), 'YYYYMMDD'), '99999999')
`,
    results => {
      console.log("truncatoitiin taulu");

      luoLunchofdayTmp(request, response);
    }
  );
};

function luoLunchofdayTmp(request, response) {
  pool.query(
    `insert into lunchofdaytmp (paiva,restaurantid,nimi, string_agg, totalscore, randommultiplier, restaurantMultiplier, genreMultiplier, usermultiplier)
SELECT paiva,
restaurantid,
nimi,
string_agg,
kerroin as totalscore,
randommultiplier,
restaurantMultiplier,
genreMultiplier,
usermultiplier

FROM(
SELECT x.paiva, x.restaurantid, x.nimi, string_agg(x.teksti, ' <br>' ),
--1-(1/datediff) painotukseksi ravintolakohtaisen historian mukaan(viim 5 pv)
(1-AVG(CASE WHEN historykerroin is null then 0 else historykerroin end ))
--1-(0.8/datediff) painotukseksi genrekohtaisen historian mukaan(viim 5 pv)
* (1-AVG(CASE WHEN genrehistorykerroin is null then 0 else genrehistorykerroin end))
* avg(kerroin) kerroin,
avg(kerroin) as randommultiplier,
(1-AVG(CASE WHEN historykerroin is null then 0 else historykerroin end )) as restaurantMultiplier,
(1-AVG(CASE WHEN genrehistorykerroin is null then 0 else genrehistorykerroin end)) as genreMultiplier,
1 as usermultiplier
from (

--Haetaan listat ravintoloille joilla automaattilistat
SELECT r.*, ra.nimi, ra.ravintolaid restaurantid, random() kerroin
FROM ruokalistat r
left join ravintolat ra on r.apiid = ra.apiid
where paiva = to_number(to_char(now(), 'YYYYMMDD'), '99999999')

UNION

--Haetaan listat ravintoloille joilla käsinpäivitetytlistat
SELECT to_number(to_char(now(), 'YYYYMMDD'), '99999999') paiva,
0 as apiid,
kpl.rivi rivi,
kpl.teksti teksti,
r.nimi nimi,
r.ravintolaid restaurantid,
random() kerroin
from kasinpaivitetytlistat kpl
left join ravintolat r on kpl.ravintolaid = r.ravintolaid
where r.nimi is not null

) x
--Tarkastetaan löytyykö tällepvlle jo lounas, myöhemmin rajaat is null l.paiva
left join lunchofday l on l.paiva = x.paiva
--Haetaan historiakertaimet ravintolakohtaisen historian mukaan
left join (
    select * ,
     1/ (DATE_PART('day', date(now())) - DATE_PART('day',to_date(to_char(paiva, '99999999'), 'YYYYMMDD'))) historykerroin
    from lunchofday
    order by paiva desc
    limit 5
    ) history on history.restaurantid  = x.restaurantid
--Haetaan historiakertoimset genrekohtaisen historian mukaan
left join (
    SELECT 0.8/ (DATE_PART('day', date(now())) - DATE_PART('day',to_date(to_char(paiva, '99999999'), 'YYYYMMDD'))) genrehistorykerroin,
    gor.genreid,
    gor2.restaurantid
    from lunchofday lod
    left join genreofrestaurant gor on lod.restaurantid = gor.restaurantid
    left join genreofrestaurant gor2 on gor.genreid = gor2.genreid
    order by paiva DESC
    limit 5
) genrehistory on genrehistory.restaurantid = x.restaurantid
where l.paiva is NULL
group by x.paiva, x.restaurantid, x.nimi
) y
order by kerroin DESC;

`,
    (error, results) => {
      console.log("luotiin tmp rivit");
      pool.query(
        `insert into lunchofday
SELECT paiva,nimi, string_agg, restaurantid
from lunchofdaytmp
order by totalscore DESC
limit 1;`,
        (error, results) => {
          console.log("luotiin lunchofday");

          if (error) {
            throw error;
          }
          response.status(201).json({
            status: "Success",
            message: "Lunchofday Generated"
          });
        }
      );
    }
  );
}
