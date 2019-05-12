/**
 * gCal Event Finder
 * CLI program to search and extract events from the user's calendar
 * using the Google Calendar API. Requires 
 * 
 */

const fs = require('fs');
const inquirer = require('inquirer')
const figlet = require('figlet')
const calendarService = require('./src/calendarService')
const googleAuth = require('./src/googleAuth')

const debug = require('debug')('gcal:index')

// IMPORTANT!: Define path to your secrets file, which should contain client_id, client_secret etc...
// To generate one, create a new project in Google's Developer console
const secretsFile = './keys/secrets.json'
const secrets = JSON.parse(fs.readFileSync(secretsFile));

// define the scope for our app
const scopes = ['https://www.googleapis.com/auth/calendar.readonly']



/**
 * Function that trigger calls to googleAuth and calendarService to 
 * retrieve the events from the calendar API.
 * @param {object} filter with properties maxResults, timeMin, timeMax and keyword 
 */
async function triggerCalendarAPI(filter){
  try{
    // get authenticated oAuth2 client 
    const oAuth2Client = await googleAuth.generateOAuthClient(secrets, scopes)
    debug('oAuthClient received, getting events....')
    // call the calendar service to retrieve the events. Pass secrets and scope
    const events = await calendarService.getEvents(oAuth2Client, filter)
    debug('Events are %j', events)
    // check if the are events returned
    if(events.data.items.length > -1){
      //write raw results to file
      console.log(`Found ${events.data.items.length} events!`)
      await fs.writeFileSync('./results_raw.json', JSON.stringify(events.data.items))
      let res = [];
      // loop events array to filter properties
      events.data.items.forEach(event => {
        const start = event.start.dateTime || event.start.date;
        res.push({date:start,summary:event.summary, location: event.location})
      });
      //write filtered properties to another file
      await fs.writeFileSync('./results.json', JSON.stringify(res))

      console.log(`👏👏👏 - Results extracted to file results.json and results_raw.json`)
      return Promise.resolve(events)
    }else{
      throw new Error('🤯 No records found')
    }

  }catch(err){
    console.log('🤬🤬🤬 ERROR!!!' + err)
    return Promise.reject(err)
  }
}

/**
 * #########  Starts CLI program  #################
**/

console.log(figlet.textSync('gcal-finder', { horizontalLayout: 'full' }))
console.log(`Let's find some events in your calendar 🤔!`)

let filter = {};
let questions = [
{
  type: 'input',
  name: 'nResults',
  message: 'How many results do you want to retrieve? (default 100)'  
},
{
  type: 'input',
  name: 'dateFrom',
  message: 'Start date (YYYY-MM-DD)? (default 3 months ago)'  
},
{
  type: 'input',
  name: 'dateTo',
  message: 'End Date (YYYY-MM-DD)? (default today)'  
},
{
  type: 'input',
  name: 'keyword',
  message: 'Search by keyword? (just one 😬  default all)'  
},
]

inquirer.prompt(questions).then(answers => {
  const today = new Date();
  const temp = new Date()
  temp.setMonth(temp.getMonth() -3)
  const monthsAgo = temp.toISOString();
  filter = {
    maxResults: answers['nResults'] || 100,
    timeMin: answers['dateFrom'] || monthsAgo,
    timeMax: answers['dateTo'] || today,
    keyword: answers['keyword'] || undefined
  }
  debug('Searching with filter: %j ', filter)
  
  return triggerCalendarAPI(filter);

}).catch(err => {
  console.log('🤬🤬🤬 Error retrieving events from the calendar' + err)
})

