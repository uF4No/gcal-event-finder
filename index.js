#!/usr/bin/env node

const calendarService = require('./src/calendarService')
const googleAuth = require('./src/googleAuth')
const fs = require('fs');

const debug = require('debug')('gcal:index')

const secretsFile = './keys/secrets.json'

// Program
const inquirer = require('inquirer')
const figlet = require('figlet')


// Read secrets, 
const secrets = JSON.parse(fs.readFileSync(secretsFile));
const scopes = ['https://www.googleapis.com/auth/calendar.readonly']

async function getData(filter){
  try{
    // get oAuthClient
    const oAuth2Client = await googleAuth.generateOAuthClient(secrets, scopes)
    debug('oAuthClient received, getting events....')
    // get API service. Pass secrets and scope
    //  const events = await calendarService.getEvents(oAuth2Client, {timeMin: '2018-10-01', timeMax: '2019-04-01'})
    const events = await calendarService.getEvents(oAuth2Client, filter)
      
    console.log(`Found ${events.data.items.length} events`)

    //write t a file???
    return Promise.resolve(events.data.items)

  }catch(err){
    console.log('ERROR!!!' + err)
    return Promise.reject(err)
  }
}

//getData()


console.log(figlet.textSync('gCal Event finder', { horizontalLayout: 'full' }))
console.log(`Let's find some events in your calendar!`)

let filter = {};
let questions = [
{
  type: 'input',
  name: 'nResults',
  message: 'How many results do you want? (default 100)'  
},
{
  type: 'input',
  name: 'dateFrom',
  message: 'Start date? (default 3 months ago)'  
},
{
  type: 'input',
  name: 'dateTo',
  message: 'End Date? (default today)'  
},
{
  type: 'input',
  name: 'keywords',
  message: 'Search by keywords? (empty = all)'  
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
    keywords: answers['keywords']
  }
  debug('Searching with filter: %j ', filter)
  
  return getData(filter);

}).catch(err => {
  console.log('Error retrieving events from the calendar :(' + err)
})

