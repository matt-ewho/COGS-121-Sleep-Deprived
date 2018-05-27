/* prints when extension has loaded successfully */
chrome.runtime.onInstalled.addListener(function() {
   console.log("extension loaded")
   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
     chrome.declarativeContent.onPageChanged.addRules([{
       conditions: [new chrome.declarativeContent.PageStateMatcher({
         pageUrl: {schemes: ['https', 'http', 'ftp'] },
       })
       ],
           actions: [new chrome.declarativeContent.ShowPageAction()]
     }]);
   });
 });

 /**********************************************************************************
                                   TIMESTAMP FUNCTIONS
 ***********************************************************************************/

/**
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 */

function timeStamp() {
// Create a date object with the current time
  var now = new Date();

// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12
  time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

// Return the formatted string
  return time.join(":") + " " + suffix;
}


/**********************************************************************************
                                    TAB FUNCTIONS
***********************************************************************************/

/* global variables
 * used for determining which tab you're on (0 or 1) in order to calculate
 * the difference in time from tab 0 to 1 or 1 to 0; boolean switchVar
 * will change depending on which tab is current (true:false for 0:1) */

var tab0; //with time0
var tab1; //with time1
var time0;
var time1;
var switchVar = true;

/*calculates the difference in time (not accounting for AM/PM differences yet)*/
function calculateTime(time0, time1) {
  //grab hours and minutes of each time
  var hour0 = time0.substring(0,2);
  var minute0 = time0.substring(3,5);
  var hour1 = time1.substring(0,2);
  var minute1 = time1.substring(3,5);

  //grab seconds (more for debugging and seeing faster changes)
  var second0 = time0.substring(6,8);
  var second1 = time1.substring(6,8);

  var hourTotal, minuteTotal, secondTotal;

  //get absolute values of differences for amount of time spent
  var hourTotal = Math.abs(+hour0 - +hour1);
  var minuteTotal = Math.abs(+minute0 - +minute1);
  var secondTotal = Math.abs(+second0 - +second1);
  console.log(hourTotal + ":" + minuteTotal + ":" + secondTotal);
  return hourTotal + ":" + minuteTotal + ":" + secondTotal;
}

/*updates time by adding old time + new time*/
function updateTime(oldTime, timeToAdd) {

}

/* called whenever a tab is activated / decided (urL)
 * tabs will alternate between 0 and 1, decided by the boolean switchVar 3 */
function checkPage(url, time) {
  chrome.storage.local.get([url], function(result) {
    //check which tab it's supposed to be on (either 0 or 1)
    if (switchVar == true && url != "newtab") {
      tab0 = url;
      time0 = time;
      console.log('setting tab 0 to ' + tab0 + " " + time0);
      switchVar = false;
    }
    else if (switchVar == false && url != "newtab") {
      tab1 = url;
      time1 = time;
      console.log('setting tab 1 to ' + tab1 + " " + time1);
      switchVar = true;
    }

    //once you have more than 1 tab, calculate the time spent on the previous tab
    if (time0 != undefined && time1 != undefined) { //check for undefined to wait until "newtab" is established/overwritten
      var timeInput;
      //if the urls are the same domain
      if (tab0 == tab1) {
        console.log('same');
        timeInput = calculateTime(time0, time1);

      }
      else {
        console.log('not');
      }

      //after figuring out time, put into database
      //this allows us to use a string as a key for the object we insert
      var key = url;
      var obj = {};
      obj[key] = timeInput;

      //if the url isn't in the database yet (grabbed at beginning of function)
      if (Object.values(result).length == 0) {
        console.log("adding new url: " + url);

          chrome.storage.local.set(obj, function() {
            chrome.storage.local.get([url], function(result) {
              console.log(result);
            });
          });
      //if the url is already in the database
      } else {
        console.log("updating url: " + url);
        console.log(Object.values(result));
        //update the time
        updateTime(Object.values(result).toString(),timeInput);

        //remove and set in database again
        chrome.storage.local.remove([url], function () {
          chrome.storage.local.set(obj, function() {
            chrome.storage.local.get([url], function(result) {
              console.log(result);
            });
          });
        });
      }

    }
  });
}

/* listener for when the tab gets activated / new tab is updated */
chrome.tabs.onActivated.addListener(function(activeInfo){
   chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
}, function(tabs) {
    /*switching/active tabs debug - will print the FULL url of tab
    var tab = tabs[0];
    console.log("tab switched:" + tab.url);*/

    //prints ONLY the domain name
    chrome.tabs.getSelected(null, function (tab) {
      var url = new URL(tab.url);
      var domain = url.hostname;

      //wait until new tab is updated to print
      if (domain == "newtab") {
        chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
          if (info.status === 'complete') {
            var tabURL = new URL(tab.url);
            var domain = tabURL.hostname;

            if (domain == "newtab") {
              console.log('active tab: url not set');
              checkPage(domain);
            }
            else if (domain != "newtab") {//so it doesn't print out "newtab"
              var time = timeStamp();
                console.log("active tab: " + domain + " @ " + time);
                checkPage(domain,time);
            }
          }
        });
      }

      //otherwise when already established, print: "active tab: DOMAIN @ TIME"
      else {
        var time = timeStamp();
        console.log("active tab: " + domain + " @ " + time);
        checkPage(domain,time);
        }
    });
  });
})

/*prints when a tab is closed*/
/*extension will ALSO print new active tab*/
/*
chrome.tabs.onRemoved.addListener(function(tabid,removed){
  console.log("tab closed");
})*/


//listener for creating new tabs
/*
chrome.tabs.onCreated.addListener(function(tab) {
 console.log("new tab created");
});
*/
