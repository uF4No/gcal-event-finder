
const calendarService = require('./src/calendarService')
const googleAuth = require('./src/googleAuth')
const fs = require('fs');

const secretsFile = './keys/secrets.json'
// Read secrets, 
const secrets = JSON.parse(fs.readFileSync(secretsFile));
const scopes = ['https://www.googleapis.com/auth/calendar.readonly']



async function getData(){
// get oAuthClient
const oAuthClient = await googleAuth.generateOAuthClient(secrets, scopes)


// get API service. Pass secrets and scope
const events = await calendarService.getEvents(oAuthClient)
console.log(events)
}

getData()
