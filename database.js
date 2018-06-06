
/*
  database.js, as of Milestone 4, creates a database from which our app
  can get its data

*/

//showing how we would create a database, but still working out the kinks
//of our particular data collection

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('sites.db');
const wdb = new sqlite3.Database('whitelist.db');

db.serialize(() => {

  db.run("CREATE TABLE visited_sites (hours TEXT, firstSite TEXT, sndSite TEXT)");
  db.run("INSERT INTO visited_sites VALUES ('PastHour', 'Google Docs', 'Netflix')");
  db.run("INSERT INTO visited_sites VALUES ('Past2Hours', 'Facebook', 'Google Docs')");
  db.run("INSERT INTO visited_sites VALUES ('PastDay', 'YouTube', 'Facebook')");

  console.log('created database of example sites');

  db.each("SELECT hours, firstSite, sndSite FROM visited_sites", (err, row) => {
    console.log(row.hours + ": " + row.firstSite + ' - ' + row.sndSite);
  });

  db.close();

});

wdb.serialize(() => {
  //creating white list database

  wdb.run("CREATE TABLE whitelist_sites (whiteSite TEXT)");
  //create whitelist table


  wdb.run("INSERT INTO whitelist_sites VALUES ('ted.ucsd.edu')");
  wdb.run("INSERT INTO whitelist_sites VALUES ('scholar.google.com')");
  wdb.run("INSERT INTO whitelist_sites VALUES ('wikipedia.org')");
  //inserted all pre-whitelisted values

  console.log('created database of pre-whitelisted sites');

   db.each("SELECT whiteSite FROM whitelist_sites", (err, row) => {
      //console.log(row.whiteSite);
      //for some reason the console log isn't working
  });

  wdb.close();

});
