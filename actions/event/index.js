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
 *    - configure the manifest.yml under `event` to have an input field:
 *        inputs:
 *          myApiKey: $MY_API_KEY
 *    - access the apiKey in your action through params.myApiKey
 */

const { Core } = require('@adobe/aio-sdk')
const fetch = require('node-fetch')
const ZonedDateTime = require('@js-joda/core').ZonedDateTime
const ZoneOffset = require('@js-joda/core').ZoneOffset
const EventsSDK = require('@adobe/aio-lib-events')

const httpOptions = { retries: 3 }

async function publishEvent(sdkClient, providerId, eventCode) {
  // fire event
  console.log(eventCode)
  console.log(providerId)
  const publish = await sdkClient.publishEvent({
    id: 'like-' + Math.round(Math.random() * 100000),
    source: 'urn:uuid:' + providerId,
    time: ZonedDateTime.now(ZoneOffset.UTC).toString(),
    type: eventCode,
    data: {
      text: 'you got one like'
    }
  })
  return publish
}

async function main (params) {
  // create a Logger
  const myAppLogger = Core.Logger('main', { level: params.LOG_LEVEL })
  // 'info' is the default level if not set
  myAppLogger.info('Calling the main action')

  // log levels are cumulative: 'debug' will include 'info' as well (levels are in order of verbosity: error, warn, info, verbose, debug, silly)
  myAppLogger.debug(`params: ${JSON.stringify(params, null, 2)}`) // careful to not log any secrets!

  try {
    let sdkClient = await EventsSDK.init(params.orgId, params.apiKey, params.accessToken, httpOptions)

    event_ret = await publishEvent(sdkClient, params.providerId, params.eventCode)
    var returnObject = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: event_ret
    };

    return returnObject
  } catch (error) {
    myAppLogger.error(error)
    return {
      statusCode: 500,
      body: { error: 'server error!' }
    }
  }
}

exports.main = main
