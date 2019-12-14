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

exports.suoritaDatanLataus = async () => {
  ravintolat = await haeRavintolat();
  console.log(ravintolat);

  console.log(await poistaTamaViikko());
  ravintolaData = [];
  ravintolat.forEach((ravintola, i) => {
    ravintolaData.push(haeDatat(ravintola, i));
  });
  setTimeout(() => {
    console.log(ravintolaData);
    Promise.all(ravintolaData).then(x => {
      console.log(x);
    });
  }, 1500);
};

exports.suoritaDatanLatausvanha = function() {
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
function haeRavintolat() {
  return new Promise((resolve, rej) => {
    try {
      pool.query(
        "SELECT RavintolaID, apiid, Nimi FROM Ravintolat where tassalista = 1;",
        (err, res) => {
          if (err) throw err;
          let tmpArray = [];
          res.rows.forEach(ravintola => {
            tmpArray.push(ravintola);
          });
          resolve(tmpArray);
        }
      );
    } catch (error) {
      rej(error);
    }
  });
}

function poistaTamaViikko() {
  return new Promise((resolve, reject) => {
    try {
      console.log(
        "Poistetaan listat päiviltä joissa paiva >= " +
          helpers.date.formatDate(thisWeekMonday)
      );

      pool.query(
        "DELETE FROM lunchlist WHERE paiva >= $1;",
        [helpers.date.formatDate(thisWeekMonday)],
        async (err, res) => {
          if (err) throw err;
          resolve("Viikot poistettiin");
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
function haeDatat(ravintola, index) {
  return new Promise((resolve, reject) => {
    try {
      https.get(helpers.api.getApiUrl(ravintola.apiid), res => {
        let tmpdata = "";
        res.on("data", chunk => {
          tmpdata += chunk;
        });
        res.on("end", () => {
          if (tmpdata[0] != "<") {
            let tmp = JSON.parse(tmpdata);
            resolve(tmp);
          } else resolve();
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

function haeDatatvanha(_callback) {
  koskavalmis = [];
  koskavalmisapicall = [];
  let ravintolatProsessoitu = 0;
  let restaurantsPromise = new Promise((resolve, reject) => {
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
          .on("finish", x => {})
          .on("error", err => {
            rej();
            console.error("Error" + err.message);
          });
        Promise.all(koskavalmis).then(x => {
          reso(x);
        });
      });
      koskavalmisapicall.push(promise);
    });
    Promise.all(koskavalmisapicall).then(x => {
      resolve("Kaikki apicallit valmiita");
    });
  });
  restaurantsPromise.then(x => {
    console.log(x);
    Promise.all(koskavalmisapicall).then(x => {
      console.log(x);
      Promise.all(koskavalmis).then(x => {
        console.log(x);
      });
    });
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

    res("done");
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
