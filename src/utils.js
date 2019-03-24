
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {events} array of events.
 * @param {filter} object containing dates, keywords, limit...
 */
function filterEvents(events, filter){
    if(!events){
        console.log('Event list is empty!!!')
        return
    }
    let eventsFound = [];
    events.map((event, i) => {
      if(event.summary.includes('Vuelo') || event.summary.includes('Flight')){
          eventsFound.push(event)
          //console.log(`${start} - ${event.summary}`);
          if(eventsFound.length == filter.maxResults){
            console.log(`****There are ${eventsFound.length} results in this period :)`)
            for(let i =0; i < eventsFound.length; i++){
              const start = eventsFound[i].start.dateTime || eventsFound[i].start.date;
              console.log(`${start} - ${eventsFound[i].summary}`);
            }
            return Promise.resolve(eventsFound)
          }
      }
    });
}

module.exports = {filterEvents}