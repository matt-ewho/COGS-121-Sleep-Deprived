  //initialize firebase
     var config = {
      apiKey: "AIzaSyCo8rjvxcOKTgHNXhQqcmSsi6EmG2h1SgA",
      authDomain: "cogs121-830e5.firebaseapp.com",
      databaseURL: "https://cogs121-830e5.firebaseio.com",
      projectId: "cogs121-830e5",
      storageBucket: "cogs121-830e5.appspot.com",
      messagingSenderId: "1030210360810"
    };
 firebase.initializeApp(config);

 const whitelist = firebase.database();
 const timeInt = firebase.database();

/*
//require is not working even after adding require.js
const sqlite3 = require('sqlite3');
const wdb = new sqlite3.Database('whitelist.db');
*/

document.addEventListener("DOMContentLoaded", function(event) {
  const optionsURL = window.location.href;
  console.log("ready!");
  console.log(optionsURL);
});

document.getElementById("testbutton").onclick=function() {
  $("#testbox").html("TEXT HAS CHANGED SUCCESSFULLY");
  console.log("Text has changed successfully on front end.");
};

document.getElementById("alertbutton").onclick=function() {
  alert('alert button works heck yes');
};

/*RESET alerts*/

document.getElementById("deleteWhitelist").onclick=function() {
  if (confirm("Are you sure you wish to delete all of your whitelisted websites?")) {
    //deletes entire whitelist
    whitelist.remove();
    alert("Whitelisted websites have been deleted.");
  }
};

//alert will tell what site was added
document.getElementById("addWhitelist").onclick=function() {
  const addedSite = document.getElementById("whitelist-add-url").value;
  console.log(addedSite);
  //add to database using push function
  alert(addedSite+ " saved into database!");
}

/*SAVE CHANGES alerts*/
document.getElementById("saveWhitelist").onclick=function() {
  alert("Whitelist changes have been saved successfully.");
};

document.getElementById("saveInterval").onclick=function () {
  const saveInterval = document.getElementById("intervalSelect").value;
  console.log(saveInterval);
  timeInt.ref('timeInt/').set(saveInterval);
  alert("Work Interval settings have been set to: " + saveInterval);
};

document.getElementById("saveAll").onclick=function () {
  alert("All settings have been saved successfully.");
};

/*
let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);
*/
