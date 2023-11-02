const getWebHooks = require('./HookSubscriptions-Get')
const getLunchOfDay = require('./lunchofday/lunchofday')
const lunchListsByParameters = require('./lunchlists/lunchlists')
const {sendRequest} = require("./helpers/webhookrequest");
const subscriptions = require("./subscriptions");
const {sendPwaNotifications} = require("./helpers/sendPwaNotification");

//WebHookTypes enum
const WebHookTypes = {
  LunchOfDayDiscord: 1
}
// To learn about scheduled functions and supported cron extensions,
function updateWebhookCalledAfterSuccess(hook) {
//TODO
}

const timer = ms => new Promise(res => setTimeout(res, ms))

// see: https://ntl.fyi/sched-func
exports.sendLunchOfDayWebHookMessages =  async () => {
  // console.log(`Next function run at ${eventBody.next_run}.`)
  var result = JSON.parse((await getWebHooks.handler()).body);

var lunchOfDayDiscordHooks = result.filter(x => x.data.WebHookSubscriptionTypeId === WebHookTypes.LunchOfDayDiscord );

// lunchOfDayDiscordHooks foreach


  var event = {
    httpMethod: 'GET'
  }
  var lunchOfDay = JSON.parse((await getLunchOfDay.handler(event)).body);

  var lunchListsOfToday = JSON.parse((await lunchListsByParameters.handler(event)).body)
  lunchListsOfToday = lunchListsOfToday.filter(x => x.data.votes  > 0);

  var payloadObjects = createPayloadObjects(lunchOfDay[0], lunchListsOfToday);

  console.log(payloadObjects);



  for (const hook of lunchOfDayDiscordHooks) {
    for (const payloadObject of payloadObjects) {
      console.log("Sending webhook request to " ,  hook.data.Url);
      sendRequest(payloadObject, hook.data.Url );
      updateWebhookCalledAfterSuccess(hook);
      await timer(1200);
    }

  }

  var today = new Date()
  if(today.getDay() !== 6 && today.getDay() !== 0) {
    console.log("haetaan pwaSubscriptions");
    var pwaSubscriptions = JSON.parse((await subscriptions.handler({httpMethod: 'GET' })).body);
    console.log("pwaSubscriptions", pwaSubscriptions);
    // pwa payloadobject is only lunch of day
    var pwaPayloadObject = {
      title: "Päivän lounaspaikka on valittu!",
      body: lunchOfDay[0].data.restaurantData.nimi,

    }
    // select subscription data elements to list
    pwaSubscriptionDatas = pwaSubscriptions.map(x => x.data);
    // cast payload as array
    pwaPayloadObjects = [pwaPayloadObject];
    await sendPwaNotifications(pwaSubscriptionDatas, pwaPayloadObjects );
  }




  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Webhooks called' }),
  }
}



function createPayloadObjects(lunchofday, allLunchLists) {
  let payloadObjects = [];
  let lunchlistCounter = 0;
  while (1 + (payloadObjects.length * 9) <= allLunchLists.length) {
    let payloadObject = {};
    payloadObject.content = "Päivän lounaspaikka on: " +
       lunchofday.data.restaurantData.nimi
      +"\n  https://www.mitastanaansyotaisiin.fi/"
      + ((allLunchLists.length > 8) ? " (" + (payloadObjects.length + 1).toString() + "/" + (Math.ceil(allLunchLists.length / 8)).toString() + ")" : "");
    payloadObject.embeds = [];
    if (lunchofday && payloadObjects.length === 0) {
      var tmpDesc = lunchofday.data.dayData.replace(/<br\s*\/?>/mg, "\n");
      var embed = {
        title: lunchofday.data.restaurantData.nimi + " on voittaja! :trophy:",
        description: tmpDesc
      }
      payloadObject.embeds.push(embed);
    }

    for (let i = 0; i < 8 && lunchlistCounter < allLunchLists.length; i++) {
      var tmpDesc = allLunchLists[lunchlistCounter].data.dayData.replace(/<br\s*\/?>/mg, "\n");
      var embed = {

        title: allLunchLists[lunchlistCounter].data.restaurantData.nimi + " ääniä: " + allLunchLists[lunchlistCounter].data.votes,
        description: tmpDesc
      }
      payloadObject.embeds.push(embed)
      lunchlistCounter++;
    }
    payloadObjects.push(payloadObject)
  }

  return payloadObjects;

}
