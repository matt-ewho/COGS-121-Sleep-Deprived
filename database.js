
/*
  database.js, as of Milestone 4, creates a database from which our app
  can get its data

*/

//showing how we would create a database, but still working out the kinks
//of our particular data collection

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('sites.db');

db.serialize(() => {

  db.run("CREATE TABLE visited_sites (hours TEXT, firstSite TEXT, sndSite TEXT)");
  db.run("INSERT INTO visited_sites VALUES ('PastHour', 'Google Docs', 'Netflix')");
  db.run("INSERT INTO visited_sites VALUES ('Past2Hours', 'Facebook', 'Google Docs')");
  db.run("INSERT INTO visited_sites VALUES ('PastDay', 'YouTube', 'Facebook')");

  console.log('created database of example sites');

  db.each("SELECT hours, firstSite, sndSite FROM visited_sites", (err, row) => {
      console.log(row.hours + ": " + row.firstSite + ' - ' + row.sndSite);
  });
});

db.close();
