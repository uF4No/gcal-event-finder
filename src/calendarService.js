
const {google} = require('googleapis');

const debug = require('debug')('calendar:service')


async function getEvents(oAuthClient, filter){
  try{
    const calendar = google.calendar({
      version: 'v3',
      auth: oAuthClient
    })
    const filterBy = {
      calendarId: 'primary',
      timeMin: (new Date(filter.timeMin).toISOString()) || (new Date('2014-01-01')).toISOString(),
      timeMax: (new Date(filter.timeMax).toISOString())  || (new Date()).toISOString(),
      maxResults: 999,
      singleEvents: true,
      orderBy: 'startTime',
    }
    debug('Searching with filter %j', filterBy)
    const events = await calendar.events.list(filterBy)
    debug('found %s events', events.length)
    return events
  }catch(err){
    console.log(err)
  }
  
}

module.exports = {getEvents}


