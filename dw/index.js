const dotenv = require("dotenv");
dotenv.config();
const { pool } = require("./config");
const https = require("https");
const $ = require("cheerio");
const format = require("pg-format");

const helpers = require("./helpers");

let thisWeekMonday = new Date(helpers.date.getPreviousMonday());
let ravintolat = [];
let rowsToInsert = [];

exports.suoritaDatanLataus = async function() {
  console.log("testitoimii");
  rowsToInsert = [];
  ravintolat = [];
  haeRavintolat(() => {
    console.log("Ravintoloita haettu" + ravintolat.length);

    poistaTamaViikko(() => {
      console.log("Tama viikko poistettiin");
      haeDatat(() => {
        console.log("Datat haettiin" + rowsToInsert.length);
        insertIntoRuokalistat(rowsToInsert);
      });
    });
  });
};

function haeRavintolat(_callback) {
  pool.query(
    "SELECT RavintolaID, apiid, Nimi FROM Ravintolat where tassalista = 1;",
    (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        ravintolat.push(row);
      }
      _callback();
    }
  );
}

function poistaTamaViikko(_callback) {
  console.log(
    "Poistetaan listat päiviltä joissa paiva >= " +
      helpers.date.formatDate(thisWeekMonday)
  );

  pool.query(
    "DELETE FROM lunchlist WHERE paiva >= $1;",
    [helpers.date.formatDate(thisWeekMonday)],
    async (err, res) => {
      if (err) throw err;
      _callback();
    }
  );
}

function haeDatat(_callback) {
  koskavalmis = [];
  koskavalmisapicall = [];
  let ravintolatProsessoitu = 0;
  ravintolat.forEach((ravintola, i, array) => {
    ravintolatProsessoitu++;
    let promise = new Promise((reso, rej) => {
      https
        .get(helpers.api.getApiUrl(ravintola.apiid), res => {
          let data = "";
          res.on("data", chunk => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              if (data[0] != "<") {
                let parsettuData = JSON.parse(data);
                parsettuData.ads.forEach(async (row, i) => {
                  if (row.ad.contentType === 0) {
                    koskavalmis.push(
                      htmlToObject(row.ad.body, ravintola.ravintolaID)
                    );
                  }
                });
              } else {
                console.error("apiId " + ravintola.apiid + " JSON virhe");
              }
            } catch (error) {
              console.error(error);
            }
          });
        })
        .on("finish", x => {
          reso("done");
        })
        .on("error", err => {
          rej();
          console.error("Error" + err.message);
        });
    });
    koskavalmisapicall.push(promise);
    // if (ravintolatProsessoitu === array.length) {
    //   setTimeout(() => {
    //     Promise.all(koskavalmis).then(x => {
    //       console.log(koskavalmis);
    //     });
    //   }, 1000);
    // }
  });

  Promise.all(koskavalmisapicall).then(x => {
    console.log(x);
    setTimeout(() => {
      Promise.all(koskavalmis).then(x => {
        console.log(x);
      });
    }, 300);
  });
}

function htmlToObject(html, ravintolaID) {
  let promise = new Promise((res, rej) => {
    let kaikkiLunchDescit = $("div.lunchDesc", html);
    for (var i = 0; i < 7; i++) {
      if (kaikkiLunchDescit[i]) {
        testi = kaikkiLunchDescit[i].children;
        for (var rivi in testi) {
          if (testi[rivi].type === "text") {
            rowsToInsert.push({
              paiva: helpers.date.formatDate(
                helpers.date.addDays(thisWeekMonday, i)
              ),
              ravintolaID: ravintolaID,
              rivi: rivi,
              teksti: testi[rivi].data
            });
          }
        }
      } else {
      }
    }

    setTimeout(() => {
      res("done");
    }, 1000);
  });
  return promise;
}

function insertIntoRuokalistat(rivit) {
  nestedArray = [];
  rivit.forEach(x => {
    nestedArray.push([x.paiva, x.ravintolaID, x.teksti]);
  });

  tehtyKysely = format(
    `INSERT INTO lunchlist (paiva,
     ravintolaid,
      string_agg)
      VALUES $L`,
    nestedArray
  );
  console.log(tehtyKysely);
  pool.query(tehtyKysely, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rowCount + " riviä tuotiin");
      done = "done";
    }
  });
}
