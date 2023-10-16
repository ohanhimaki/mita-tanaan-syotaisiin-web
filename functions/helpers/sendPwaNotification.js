const webpush = require('web-push');
const timer = ms => new Promise(res => setTimeout(res, ms));

// Initialize VAPID keys from environment variables
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Function to send PWA notifications
const sendPwaNotifications = async (subscriptions, payloadObjects) => {
  for (const subscription of subscriptions) { // Loop through each subscription
    for (const payloadObject of payloadObjects) { // Loop through each payload
      console.log("Sending PWA notification", subscription);

      var payload = JSON.stringify(payloadObject);

      // Send the notification
      try {
        await webpush.sendNotification(subscription, payload);
      } catch (error) {
        // TODO 410 remove subscription
        console.error('Failed to send PWA notification', error);
      }
    }
  }
};

module.exports = {
  sendPwaNotifications
};
