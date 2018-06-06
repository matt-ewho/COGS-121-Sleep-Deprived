const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('sites.db');

//static files in public
app.use(express.static('public/'));

app.listen(3000, () => {
  console.log('server started on http://localhost:3000/');
});

//trying to print out the data
const timeframeToLookup = 'PastDay';
app.get('/data', (req, res) => {
db.all(
  'SELECT * FROM visited_sites WHERE hours=$hours',
  {
    $hours:timeframeToLookup
  },
  (err, rows) => {
    console.log(db.hours);
    console.log(rows);
  });
});

//data goes here
/* const fakeData = {
  'PastHour':{Most:'YouTube', SecMost:'Facebook' },
  'Past2Hours':{Most:'Facebook',SecMost:'Google Doc' },
  'PastDay':{Most:'Google Doc',SecMost:'YouTube' },
  'Past2Day':{Most:'Google Doc',SecMost:'YouTube' },
};
*/

/* app.get('/data',(req,res)=>{
  const allData = Object.keys(fakeData);
  console.log('allData is:', allData);
  res.send(allData);
});
*/

app.get('/data', (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all('SELECT hours FROM visited_sites', (err, rows) => {
    console.log(rows);
    const timeFrame = rows.map(e => e.hours);
    console.log(timeFrame);
    res.send(timeFrame);
  });
});

/* app.get('/data/:timeframe',(req,res)=>{
  const timeframeToLookup = req.params.timeframe;
  const val = fakeData[timeframeToLookup];
  console.log(timeframeToLookup, '->', val);
  if (val){
    res.send(val);
  } else {
    res.send({});
  }
}); */
app.get('/data/:timeframe',(req,res)=>{
  const timeframeToLookup = req.params.timeframe;
  db.all(
    'SELECT * FROM visited_sites WHERE hours=$hours',
    {
      $hours:timeframeToLookup
    },
    (err, rows) => {
      console.log(rows);
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.send({});
      }
    }
    );
  })
