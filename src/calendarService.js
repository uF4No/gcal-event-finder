/**
 * calendarService.js
 * 
 * Methods to interact with the Google Calendar API
 * 
 */
const {google} = require('googleapis');
const debug = require('debug')('gcal:calendarService')

/**
 * creates a Google Calendar instance using the OAuth2 client and call the list events with the filter
 * @param {google.auth.OAuth2} auth The OAuth2 client already authenticated
 * @param {object} filter Properties to filter by
 */
async function getEvents(auth, filter){
  try{

    const calendar = google.calendar({
      version: 'v3',
      auth
    })

    const filterBy = {
      calendarId: 'primary',
      timeMin: (new Date(filter.timeMin).toISOString()) || (new Date('2014-01-01')).toISOString(),
      timeMax: (new Date(filter.timeMax).toISOString())  || (new Date()).toISOString(),
      maxResults: filter.maxResults ,
      singleEvents: true,
      orderBy: 'startTime',
      q:filter.keyword
    }
    debug('Searching with filter %j', filterBy)
    const events = await calendar.events.list(filterBy)
    debug('found events: ', events)
    return events
  }catch(err){
    debug('🤬🤬🤬 Captured error in getEvents: %s', err)
    console.log(err)
  }
  
}

module.exports = {getEvents}

