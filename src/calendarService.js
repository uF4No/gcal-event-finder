/**
 * THIS IS A COPY OF APP.JS
 * Exports functions to authenticate and retrieve data from
 * Google calendar.
 */

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const debug = require('debug')('calendar:service')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

let filter = {}

// Load client secrets from a local file.
async function wrapper(f){
  try{
    const creds = fs.readFileSync('credentials.json').toString()
    debug('Credentials read ok! ')
    const oAuthClient = await authorize(JSON.parse(creds))
    debug('Authorized!!')

    filter = f
    const events = await listEvents(oAuthClient, filter)
    debug('Got the events!!!')

    return Promise.resolve(events)

  }catch(err){
    return console.log('Error loading client secret file:', err);
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 *NOOOOPP @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials) {
  // creates a oAuth2Client with the credentials. 
  // if it dont exist, calls to getAccessToken to generate one.

  try{
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    const token = fs.readFileSync(TOKEN_PATH)
    if(token !== undefined){

      oAuth2Client.setCredentials(JSON.parse(token));
    }else{
      oAuth2Client = await getAccessToken(oAuth2Client)
    }
    return Promise.resolve(oAuth2Client)

  }catch(err){
    //return await getAccessToken(oAuth2Client, callback);
    debug('Crashed badly... %j', err)
  }
    
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * NOPPPPP@param {getEventsCallback} callback The callback for the authorized client.
 */
async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      return Promise.resolve(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const filterBy = {
    calendarId: 'primary',
    timeMin: (new Date(filter.timeMin).toISOString()) || (new Date('2014-01-01')).toISOString(),
    timeMax: (new Date(filter.timeMax).toISOString())  || (new Date()).toISOString(),
    maxResults: 999,
    singleEvents: true,
    orderBy: 'startTime',
  }
  debug(filterBy)

  calendar.events.list(filterBy).then((err, res) => {
    if(err){
      console.log(err)

      return err
    }else{
      debug('Response from API is: %j', res)
      const events = res.data.items;
      if (events.length) {
        console.log('Listing events:');
        return Promise.resolve(events)

      } else {
        console.log('No events found.');
      }
    }
  })
}


  // try{
  //   const res = await calendar.events.list(filterBy);
  //   debug('Response from API is: %j', res)
  //   const events = res.data.items;
  //   if (events.length) {
  //     console.log('Listing events:');
  //     return Promise.resolve(events)

  //   } else {
  //     console.log('No events found.');
  //   }
  // }catch(err){
  //   debug('Error retrieving event list %j', err)
  //   console.log(err)
  //   return Promise.reject( new Error({message: 'Error in listEvents', error: err}))

  // }



module.exports = {wrapper}