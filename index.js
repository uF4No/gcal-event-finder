
const calendarService = require('./src/calendarService')
const googleAuth = require('./src/googleAuth')
const fs = require('fs');

const debug = require('debug')('gcal:index')


const secretsFile = './keys/secrets.json'

// Read secrets, 
const secrets = JSON.parse(fs.readFileSync(secretsFile));
const scopes = ['https://www.googleapis.com/auth/calendar.readonly']



async function getData(){
// get oAuthClient
const oAuth2Client = await googleAuth.generateOAuthClient(secrets, scopes)
debug('oAuthClient received, getting events....')
// get API service. Pass secrets and scope
const events = await calendarService.getEvents(oAuth2Client, {timeMin: '2018-10-01', timeMax: '2019-04-01'})
console.log(events)
}

getData()
