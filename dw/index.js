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
  rowsToInsert = [];
  ravintolat = [];

  pool.query(
    "SELECT RavintolaID, apiid, Nimi FROM Ravintolat where tassalista = 1;",
    async (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        ravintolat.push(row);
      }
      //onko async?
      done = await poistaTamaViikko();
    }
  );
  return await done;
};

async function poistaTamaViikko() {
  console.log(helpers.date.formatDate(thisWeekMonday));

  pool.query(
    "DELETE FROM ruokalistat WHERE paiva >= $1;",
    [helpers.date.formatDate(thisWeekMonday)],
    async (err, res) => {
      if (err) throw err;
      console.log("Poistetaan rivit joissa paiva >= taman viikon maanantai");
      //onko async?
      done = await haeDatat();
    }
  );
  return done;
}

async function haeDatat() {
  let ravintolatProsessoitu = 0;
  ravintolat.forEach((ravintola, i, array) => {
    ravintolatProsessoitu++;
    https
      .get(helpers.api.getApiUrl(ravintola.apiid), resp => {
        let data = "";
        resp.on("data", chunk => {
          data += chunk;
        });
        resp.on("end", () => {
          try {
            if (data[0] != "<") {
              let parsettuData = JSON.parse(data);
              parsettuData.ads.forEach((row, i) => {
                if (row.ad.contentType === 0) {
                  htmlToObject(row.ad.body, ravintola.apiid);
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
      .on("error", err => {
        console.error("Error" + err.message);
      });

    if (ravintolatProsessoitu === array.length) {
    }
  });
  setTimeout(async function() {
    done = await insertIntoRuokalistat(rowsToInsert);
  }, 10000);
  return done;
}

async function insertIntoRuokalistat(rivit) {
  nestedArray = [];
  rivit.forEach(x => {
    nestedArray.push([x.paiva, x.ravintolaID, x.rivi, x.teksti]);
  });

  tehtyKysely = format(
    "INSERT INTO Ruokalistat (paiva, apiid, rivi, teksti) VALUES %L ",
    nestedArray
  );

  pool.query(tehtyKysely, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rowCount + " riviä tuotiin");
      done = "done";
    }
  });
  return done;
}

function htmlToObject(html, ravintolaID) {
  var paivat = [];

  let kaikkiLunchHeader = $("div.lunchHeader", html);
  for (var i = 0; i < 7; i++) {
    if (kaikkiLunchHeader[i]) {
      testi = kaikkiLunchHeader[i].children;
      for (var rivi in testi) {
        if (testi[rivi].type === "text") {
          paivat.push(testi[rivi].data);
        }
      }
    } else {
      console.error(ravintolaID + " ei lunchHeadereita");
    }
  }

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
      console.error(ravintolaID + " ei lunchDescejä");
    }
  }
  return;
}
