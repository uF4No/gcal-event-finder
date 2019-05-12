# GCal Event finder
This is a command line program to search and extract events from yout Google calendar. You can enter a range of dates, keyword and limit the number of results. Results are written in files results.json and results_raw.json

__A step-by-step guide to this project can be found [in this article in my blog](https://uf4no.com/articles/understanding-oauth2-authentication-to-use-google-apis-38)__

## Requirements

* Node.js and NPM installed - Visit [nodejs.org](https://nodejs.org) to install it.

* __Important!!__ Setup a new project in [Google's Developer console](https://console.developers.google.com/apis/dashboard), generate new project_id,client_id, client_secret and configure them in the file /keys/secrets.json

## Installation guide
* Clone or download.

* Open a terminal, go to the project folder and run:
```
npm i
```

* Setup your project_id,client_id, client_secret in the file /keys/secrets.json

### How to run
From the project folder, execute the following command
```
node .
```
Or if you want to see some debug traces, run:
```
DEBUG="gcal*" node .
```

Results will be returned in two files:
* results_raw.json : contains the full event objects.
* results.json : contains just the date, location and summary of the events.

## Author & license
Coded by Antonio Ufano. Feel free to clone this repo and modify the code as you wish.  

Visit my web [uF4No.com](https://www.uf4no.com) to check my blog or send me a message from the contact section.
