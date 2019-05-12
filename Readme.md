# GCal Event finder
This is a command line program to search and extract events from yout Google calendar. You can enter a range of dates, keyword and limit the number of results.
A step-by-step guide to this project can be found [in this article in my blog](http://uf4no.com/articles/understanding-oauth2-authentication-to-use-google-apis-38) 

## Requirements

* Node.js and NPM installed - Visit nodejs.org to install it.

* Setup a new project in [Google's Developer console](https://console.developers.google.com/apis/dashboard), generate new project_id,client_id, client_secret and configure them in the file /keys/secrets.json

## Installation guide
Open a terminal and run
```
npm i
```

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
