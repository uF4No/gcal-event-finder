
const {google} = require('googleapis');

const debug = require('debug')('gcal:calendarService')


async function getEvents(auth, filter){
  try{
    //google.options({auth: oAuth2Client});

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
    }
    debug('Searching with filter %j', filterBy)
    const events = await calendar.events.list(filterBy)
    debug('found events: ', events)
    return events
  }catch(err){
    debug('Captured error in getEvents: %s', err)
    console.log(err)
  }
  
}

module.exports = {getEvents}


