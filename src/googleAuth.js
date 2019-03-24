// Generates an OAuthClient to be used by an API service
// Requires path to file that contains clientId/clientSecret and scopes


const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const debug = require('debug')('calendar:service')

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

async function generateOAuthClient(keysObj, scopes){
  let oAuth2Client
  try{
    const {clientSecret, clientId, redirect_uris} = keysObj
    debug('Secrets read %s %s', clientId, clientSecret)
    // create oAuthClient using clientId and Secret
    oAuthClient = new google.auth.OAuth2(clientId, clientSecret, redirect_uris[0])
    // check if we have a valid token
    const tokenFile = fs.readFileSync(TOKEN_PATH)
    if(tokenFile !== undefined){
      oAuthClient.setCredentials(JSON.parse(tokenFile))
    }
    return Promise.resolve(oAuth2Client)
  }catch(err){
    debug('Token not found, generating a new one...')
    // get new token and set it to the oAuthClient
    oAuthClient = await getAccessToken(oAuthClient, scopes)
    return Promise.resolve(oAuth2Client)

  }

}

/**
 * Get and store new token after prompting for user authorization
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {array<string>} scopes The scopes for your oAuthClient

 */
async function getAccessToken(oAuth2Client, scopes) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
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

module.exports = {generateOAuthClient}
