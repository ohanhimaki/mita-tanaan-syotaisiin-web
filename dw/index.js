const https = require("https");
const $ = require("cheerio");
const { Client } = require("pg");
const format = require("pg-format");
const { pgUrl } = require("./config");

const helpers = require("./helpers");

const client = new Client({
  connectionString: pgUrl,
  ssl: true
});

let thisWeekMonday = new Date(helpers.date.getPreviousMonday());
let ravintolat = [];
let rowsToInsert = [];

client.connect();

client.query("SELECT RavintolaID, apiid, Nimi FROM Ravintolat;", (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    ravintolat.push(row);
  }
  client.end().then(poistaTamaViikko());
});

function poistaTamaViikko() {
  const delRowsClient = new Client({
    connectionString: pgUrl,
    ssl: true
  });
  console.log(helpers.date.formatDate(thisWeekMonday));

  delRowsClient.connect();
  delRowsClient.query(
    "DELETE FROM ruokalistat WHERE paiva >= " +
      helpers.date.formatDate(thisWeekMonday) +
      ";",
    (err, res) => {
      if (err) throw err;
      console.log("Poistetaan rivit joissa paiva >= taman viikon maanantai");
      delRowsClient.end().then(haeDatat());
    }
  );
}

function haeDatat() {
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
  setTimeout(function() {
    insertIntoRuokalistat(rowsToInsert);
  }, 10000);
}

function insertIntoRuokalistat(rivit) {
  const clientInsert = new Client({
    connectionString: pgUrl,
    ssl: true
  });
  clientInsert.connect();

  nestedArray = [];
  rivit.forEach(x => {
    nestedArray.push([x.paiva, x.ravintolaID, x.rivi, x.teksti]);
  });

  tehtyKysely = format(
    "INSERT INTO Ruokalistat (paiva, RavintolaID, rivi, teksti) VALUES %L ",
    nestedArray
  );

  clientInsert.query(tehtyKysely, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rows[0]);
      clientInsert.end();
    }
  });
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
