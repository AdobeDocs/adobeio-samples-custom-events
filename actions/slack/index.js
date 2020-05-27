/*  */

/**
 * This is a sample action showcasing how to access an external service
 *
 * You can invoke this function via:
 *     aio rt:action:invoke <action_path>
 *
 * To find your <action_path>, run this command:
 *     aio rt:ls
 *
 * To show debug logging for this function, you can add the LOG_LEVEL parameter as well:
 *     aio rt:action:invoke <action_path> -p LOG_LEVEL '<log_level>'
 * ... where LOG_LEVEL can be one of [ error, warn, info, verbose, debug, silly ]
 *
 * Then, you can view your app logs:
 *     aio app:logs
 *
 * Secrets to access the external API can be passed to the action using default parameters and dotenv variables:
 *    - set MY_API_KEY=1234 in .env
 *    - configure the manifest.yml under `slack` to have an input field:
 *        inputs:
 *          myApiKey: $MY_API_KEY
 *    - access the apiKey in your action through params.myApiKey
 */

/* this is a sample action for how to receive aem events and sent a message to slack */
var request = require('request');

/* default slackwebhook and channel add yours here and replace the TODO below */
var slackWebhook = "https://hooks.slack.com/services/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";
var slackChannel = "Jie Yu";

async function main (params) {
  
  /* print event detail */
  console.log('in main + event detail: ', params.event);

  var returnObject = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: ""
  };

  /* handle the challenge */
  if (params.challenge) {

    console.log('Returning challenge: ' + params.challenge);

    returnObject.body = new Buffer(JSON.stringify({
      "challenge": params.challenge
    })).toString('base64');

    return returnObject;

  } else {

    /* we need it to run asynchronously, so we are returning a Promise */
    return new Promise(function (resolve, reject) {

      var slackMessage = " Event received: " + JSON.stringify(params);

      var payload = {
        "channel": slackChannel,
        "username": "incoming-webhook",
        "text": slackMessage,
        "mrkdwn": true,
      };

      var options = {
        method: 'POST',
        url: slackWebhook,
        headers:
            { 'Content-type': 'application/json' },
        body: JSON.stringify(payload)
      };

      request(options, function (error, response, body) {
        if (error) {

          console.log("ERROR: fail to post " + response);

          reject(error);

        } else {

          console.log ("SUCCESS: posted to slack " + slackMessage);

          returnObject.body = new Buffer(JSON.stringify({
            "slackMessage": slackMessage
          })).toString('base64');

          resolve(returnObject);
        }

      });

    });

  }
}

exports.main = main
