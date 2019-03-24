
// Build commnand line app that asks for range of dates and keywords

const program = require('commander')
const debug = require('debug')('calendar')
const figlet = require('figlet')

const utils = require('./src/utils')
const calendarApi = require('./src/calendarService')


console.log(figlet.textSync('gCal Event finder', { horizontalLayout: 'full' }))


const inquirer = require('inquirer')
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
  return calendarApi.wrapper(filter);
}).then(events => {
  const response = utils.filterEvents(events, filter)
  console.log('##############################################')
  console.log(response)

})

// program.version('0.0.1', '-v, --version').description('Search events in google calendar by dates and keywords')

// program
//   .command('last <n> <start> <end>')
//   .alias('l')
//   .description('Generates a secure password of the indicated length')
//   .action((n, start, end) => {
//       const filter = {
//         maxResults: n,
//         timeMin: start,
//         timeMax: end
//       }
//       cal.wrapper(filter);
// })

// program.parse(process.argv)

