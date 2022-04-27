const {sendDayStatuses} = require("./WebHooksDayStatus");
const {pool} = require("../db/db");

exports.generateLunchOfDay = (request, response) => {
  pool.query(
    `

      DELETE
      FROM lunchofdaytmp
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
    `
      insert into lunchofdaytmp (paiva, restaurantid, nimi, string_agg, totalscore, randommultiplier,
                                 restaurantMultiplier, genreMultiplier, usermultiplier, votes)
      SELECT date,
             restaurantid,
             nimi,
             lunch,
             (case when coalesce(votes, 0) > 0 then 1 else 0 end + kerroin ) * 1 + (0.10* coalesce(votes,0)) as totalscore,
             randommultiplier,
             restaurantMultiplier,
             genreMultiplier,
             usermultiplier,
             votes

      FROM (
             SELECT x.date,
                    x.restaurantid,
                    x.nimi,
                    x.lunch,
--1-(1/datediff) painotukseksi ravintolakohtaisen historian mukaan(viim 5 pv)
                    (1 - AVG(CASE WHEN historykerroin is null then 0 else historykerroin end))
--1-(0.8/datediff) painotukseksi genrekohtaisen historian mukaan(viim 5 pv)
                      * (1 - AVG(CASE WHEN genrehistorykerroin is null then 0 else genrehistorykerroin end))
                      * avg(kerroin)                                                                 kerroin,
                    avg(kerroin)                                                                  as randommultiplier,
                    (1 - AVG(CASE WHEN historykerroin is null then 0 else historykerroin end))    as restaurantMultiplier,
                    (1 - AVG(
                      CASE WHEN genrehistorykerroin is null then 0 else genrehistorykerroin end)) as genreMultiplier,
                    1                                                                             as usermultiplier,
                    votes
             from (

--Haetaan listat ravintoloille joilla automaattilistat
                    SELECT r.date, ra.apiid, 1 as rivi, r.lunch, ra.nimi, ra.ravintolaid restaurantid, random() kerroin,
                           votes
                    FROM lunchlist r
                           left join ravintolat ra on r.restaurantid = ra.ravintolaid
                    where date = to_number(to_char(now(), 'YYYYMMDD'), '99999999')

                    UNION

--Haetaan listat ravintoloille joilla käsinpäivitetytlistat
                    SELECT to_number(to_char(now(), 'YYYYMMDD'), '99999999') date,
                           0 as                                              apiid,
                           kpl.rivi                                          rivi,
                           string_agg(kpl.teksti, ' <br>')                   lunch,
                           r.nimi                                            nimi,
                           r.ravintolaid                                     restaurantid,
                           random()                                          kerroin,
                           llv.votes as votes
                    from kasinpaivitetytlistat kpl
                           left join ravintolat r on kpl.ravintolaid = r.ravintolaid
                    left join lunchlistvotes llv on llv.restaurantid = kpl.ravintolaid and dateid = to_number(to_char(now(), 'YYYYMMDD'), '99999999')
                    where r.nimi is not null
                    group by kpl.rivi, r.nimi, r.ravintolaid
                  ) x
--Tarkastetaan löytyykö tällepvlle jo lounas, myöhemmin rajaat is null l.paiva
                    left join lunchofday l on l.paiva = x.date
--Haetaan historiakertaimet ravintolakohtaisen historian mukaan
                    left join (
               select *,
                      1 / (DATE_PART('day', date( now())) -
                           DATE_PART('day', to_date(to_char(paiva, '99999999'), 'YYYYMMDD'))) historykerroin
               from lunchofday
               order by paiva desc
               limit 5
             ) history on history.restaurantid = x.restaurantid
--Haetaan historiakertoimset genrekohtaisen historian mukaan
                    left join (
               SELECT 0.8 / (DATE_PART('day', date(now())) -
                             DATE_PART('day', to_date(to_char(paiva, '99999999'), 'YYYYMMDD'))) genrehistorykerroin,
                      gor.genreid,
                      gor2.restaurantid
               from lunchofday lod
                      left join genreofrestaurant gor on lod.restaurantid = gor.restaurantid
                      left join genreofrestaurant gor2 on gor.genreid = gor2.genreid
               where DATE_PART('day', date(now())) -
                     DATE_PART('day', to_date(to_char(paiva, '99999999'), 'YYYYMMDD')) between 1 and 5
               order by paiva DESC
             ) genrehistory on genrehistory.restaurantid = x.restaurantid
             where l.paiva is NULL
             group by x.date, x.restaurantid, x.nimi, x.lunch, x.votes
           ) y
      order by 5 DESC;

    `,
    (error, results) => {
      console.log("luotiin tmp rivit");
      pool.query(
        `insert into lunchofday
         SELECT tmp.paiva, tmp.nimi, tmp.string_agg, tmp.restaurantid
         from lunchofdaytmp tmp
                left join lunchofday lod on tmp.paiva = lod.paiva
         where lod.paiva is NULL
         order by totalscore DESC
         limit 1;`,
        (error, results) => {
          console.log("luotiin lunchofday");

          if (error) {
            throw error;
          }
          sendDayStatuses(request, response).then(x => {

              response.status(201).json({
                status: "Success",
                message: "Lunchofday Generated"
              });
            }
          );
        }
      );
    }
  );
}
