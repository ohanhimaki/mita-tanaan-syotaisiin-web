const {pool} = require("../db/db");
const datehelper = require("../services/datehelpers");
const {sendRequest} = require("../services/webhookrequest");


function createPayloadObjects(lunchofday, allLunchLists) {
  let payloadObjects = [];
  let lunchlistCounter = 0;
  while (1 + (payloadObjects.length * 9) <= allLunchLists.length) {
    let payloadObject = {};
    payloadObject.content = "Päivän lounaspaikka on: "
      + lunchofday.nimi + ((allLunchLists.length > 8) ? " (" + (payloadObjects.length + 1).toString() + "/" + (Math.ceil(allLunchLists.length / 8)).toString() + ")" : "");
    payloadObject.embeds = [];
    if (lunchofday && payloadObjects.length === 0) {
      var tmpDesc = lunchofday['string_agg'].replace(/<br\s*\/?>/mg, "\n");
      var embed = {
        title: lunchofday.nimi,
        description: tmpDesc
      }
      payloadObject.embeds.push(embed);
    }

    for (let i = 0; i < 8 && lunchlistCounter < allLunchLists.length; i++) {
      var tmpDesc = allLunchLists[lunchlistCounter].lunch.replace(/<br\s*\/?>/mg, "\n");
      var embed = {

        title: allLunchLists[lunchlistCounter].nimi,
        description: tmpDesc
      }
      payloadObject.embeds.push(embed)
      lunchlistCounter++;
    }
    payloadObjects.push(payloadObject)
  }

  return payloadObjects;

}

async function getWebhookUrls() {
  let rows = await executeSelectQuery(`
    SELECT url
    from webhookSubscriptions l
    where (webhooksubscriptiontypeid = 1
      OR webhooksubscriptiontypeid is null)
      and (lastCall <  now() - INTERVAL '12 hour' OR lastcall is null)
    ;`)
  let urls = [];
  rows.forEach(x => urls.push(x.url));
  return urls;
}
function updateWebhookCalledAfterSuccess(url) {

  pool.query(
    `UPDATE webhookSubscriptions
      SET lastCall = now()
    WHERE url = $1;`,
    [url],
    (error, results) => {
      if (error) {
        throw error;
      }
    }
  );
}

exports.sendDayStatuses = async (request, response) => {
  const webhookUrls = await getWebhookUrls();

  const lunchofday = await getLunchOfDay();
  const allLunchLists = await lunchListsByParameters(datehelper.dateToDateInt(new Date()), undefined, false);

  const timer = ms => new Promise(res => setTimeout(res, ms))
  var payloadObjects = createPayloadObjects(lunchofday, allLunchLists);
  for (const webhookUrl of webhookUrls) {
    for (const payloadObject of payloadObjects) {
      sendRequest(payloadObject, webhookUrl);

      updateWebhookCalledAfterSuccess(webhookUrl);
      await timer(1200);
    }
  }


  response.status(200).json({
    status: "Success",
    message: "Lounaslistoja: " + allLunchLists.length + " WebHookkeja: " + webhookUrls.length
  });
};


async function getLunchOfDay() {
  var rows = await executeSelectQuery(`
    SELECT distinct l.*, r.linkki as link
    from lunchofday l
           left join ravintolat r on l.restaurantid = r.ravintolaid
    where paiva = to_number(to_char(now(), 'YYYYMMDD'), '99999999')
    ;`)

  return rows[0];

}

function lunchofDayDateintToDate(results) {
  resultsArray = [];
  let tmp;
  for (var i in results) {
    tmp = results[i];
    tmp.paiva = datehelper.dateintToDate(tmp.paiva);

    resultsArray.push(tmp);
  }
  return resultsArray;
}


async function lunchListsByParameters(dateInt, restaurantId, showHandheld) {
  let kaikkiPaivat = 0;
  let kaikkiRavintolat = 0;

  let paiva = 0;
  if (!dateInt) {
    paiva = 0;
    kaikkiPaivat = 1;
  } else {
    paiva = dateInt
  }
  let ravintolaid;
  if (!restaurantId) {
    ravintolaid = 0;
    kaikkiRavintolat = 1;
  } else {
    ravintolaid = restaurantId;
  }
  let showHandheldLists = showHandheld ? 1 : 0;

  return await executeSelectQuery(
    `SELECT *
     FROM (SELECT r.date, r.restaurantid, r.lunch, ra.nimi, ra.linkki link
           FROM lunchlist r
                  left join ravintolat ra on r.restaurantid = ra.ravintolaid
           where (date = $1 OR 1 = $2)
             AND (ra.ravintolaid = $3 OR 1 = $4)

           UNION

           SELECT CASE WHEN 0 = 1 then 20191201 else $1 end date,
kpl.ravintolaid as restaurantid,
string_agg(kpl.teksti, ' <br>') lunch,
r.nimi nimi,
r.linkki link
           from kasinpaivitetytlistat kpl
             left join ravintolat r
           on kpl.ravintolaid = r.ravintolaid
           where r.nimi is not null
             and (kpl.ravintolaid = $3
              OR 1= $4)
             and ($5 = 1)
           group by kpl.ravintolaid, r.nimi, r.linkki
          ) x
     order by date DESC, nimi, restaurantid


    `,
    [paiva, kaikkiPaivat, ravintolaid, kaikkiRavintolat, showHandheldLists]
  );

}


function executeSelectQuery(query, parameters) {
  return new Promise((resolve, rej) => {
    try {
      pool.query(
        query, parameters
        ,
        (err, res) => {
          if (err) throw err;
          let tmpArray = [];
          res.rows.forEach(row => {
            tmpArray.push(row);
          });
          resolve(tmpArray);
        }
      );
    } catch (error) {
      rej(error);
    }
  });
}
