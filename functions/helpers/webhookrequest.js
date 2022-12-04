const https = require('https');
const querystring = require('querystring');

// const payload = querystring.stringify({
//   primaryFirstName: 'CrowdSync',
//   primaryLastName: 'Support',
//   primaryEmail: 'support@crowdsync.io',
// });
exports.sendRequest = (payload, url) => {
url = new URL(url);

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
    },
    hostname: url.hostname,
    method: 'POST',
    path: url.pathname,
  };
  const request = https.request(options, function (res) {
    res.on('data', function (data) {
      if (res.statusCode !== 200) {
        throw new Error('Not OK (non-200 status code received)');
      }

      if (data) {
        data = JSON.parse(data);

        // console.log('Response:', data);

        // Do some other awesome Node.js stuff here...
      }
    });
  })

  request.on('error', function (e) {
    throw new Error(e.message);
  });

  request.write(JSON.stringify(payload));
  request.end();
}

