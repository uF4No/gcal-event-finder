// Generates an OAuthClient to be used by an API service
// Requires path to file that contains clientId/clientSecret and scopes


const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');

//var prompt = require('prompt');

const inquirer = require('inquirer')

const debug = require('debug')('gcal:googleAuth')

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

async function generateOAuthClient(keysObj, scopes){
  let oAuth2Client
  try{
    const {clientSecret, clientId, redirect_uris} = keysObj
    debug('Secrets read')
    // create oAuthClient using clientId and Secret
    oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirect_uris[0])
    google.options({auth: oAuth2Client});

    // check if we have a valid token
    const tokenFile = fs.readFileSync(TOKEN_PATH)
    if(tokenFile !== undefined && tokenFile !== {}){
      debug('Token already exists and is not empty')

      //oAuth2Client.setCredentials(JSON.parse(tokenFile.tokens))
      oAuth2Client.credentials = JSON.parse(tokenFile)
    }else{
      debug('Token is empty!')
      throw new Error('Empty token')
    }
    return Promise.resolve(oAuth2Client)
  }catch(err){
    debug('Token not found or empty, generating a new one...')
    // get new token and set it to the oAuthClient
    oAuth2Client = await getAccessToken(oAuth2Client, scopes)
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
  let question = [
    { type: 'input',
    name: 'code',
    message: 'Enter the code from that page here:'

    }
  ]
  const answer = await inquirer.prompt(question)
  debug('Answer received is %o', answer)
  // get new token in exchange of the auth code
  const token = await oAuth2Client.getToken(answer['code'])
  debug('Token received from Google :)')
  // save token in oAuth2Client
  //oAuth2Client.setCredentials(token) 
  oAuth2Client.credentials = token 
  // save token in disk
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))

  return Promise.resolve(oAuth2Client)
  
  
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  // ask for auth code
  
  // rl.question('Enter the code from that page here: ')
  // //rl.close()
  // // get new token in exchange of the auth code
  // const token = oAuth2Client.getToken(code)
  // // save token in oAuth2Client
  // oAuth2Client.setCredentials(token) 
  // // save token in disk
  // fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))

  //return Promise.resolve(oAuth2Client)


  // // ask for auth code
  // rl.question('Enter the code from that page here: ', (code) => {
  //   rl.close();
  //     //get new token in exchange of the auth code
  //   oAuth2Client.getToken(code, (err, token) => {
  //     if (err) return console.error('Error retrieving access token', err);
  //     oAuth2Client.setCredentials(token);
  //     // Store the token to disk for later program executions
  //     fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
  //       if (err) console.error(err);
  //       console.log('Token stored to', TOKEN_PATH);
  //     });
  //     return Promise.resolve(oAuth2Client);
  //   });
  // });
}


module.exports = {generateOAuthClient}
