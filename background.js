/* prints when extension has loaded successfully */
chrome.runtime.onInstalled.addListener(function() {
   console.log("extension loaded");
   sort();

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
                                    TIME FUNCTIONS
                              calculateTime, updateTime
***********************************************************************************/

/* global variables
 * used for determining which tab you're on (0 or 1) in order to calculate
 * the difference in time from tab 0 to 1 or 1 to 0; boolean switchVar
 * will change depending on which tab is current (true:false for 0:1) */

var tab0, tab1;
var time0, time1;
var switchVar = true;
var currentTab, currentTime;

/*calculates the difference in time (not accounting for AM/PM differences yet)*/
function calculateTime(currentTime, previousTime) {
  //grab hours and minutes of each time
  var hour0, hour1, minute0, minute1, second0, second1;

  //length is 10 for a 1 digit hour for hour 0
  if (currentTime.length == 10) {
    var hour0 = currentTime.substring(0,1);
    var hour0 = "0".concat(hour0);
    var minute0 = currentTime.substring(2,4);
    var second0 = currentTime.substring(5,7);
  } else if (currentTime.length == 11) {
    var hour0 = currentTime.substring(0,2);
    var minute0 = currentTime.substring(3,5);
    var second0 = currentTime.substring(6,8);
  }

  //lenght is 10 for a 1 digit hour for hour 1
  if (previousTime.length == 10) {
    var hour1 = previousTime.substring(0,1);
    var hour1 = "0".concat(hour1);
    var minute1 = previousTime.substring(2,4);
    var second1 = previousTime.substring(5,7);
  } else if (previousTime.length == 11) {
    var hour1 = previousTime.substring(0,2);
    var minute1 = previousTime.substring(3,5);
    var second1 = previousTime.substring(6,8);
  }

  var hourTotal, minuteTotal, secondTotal;

  //get absolute values of differences for amount of time spent
  var hourTotal = Math.abs(+hour0 - +hour1);
  var minuteTotal = Math.abs(+minute0 - +minute1);
  var secondTotal = Math.abs(+second0 - +second1);

  /* print out math for checking
  console.log(hour0 + " - " + hour1 + " = " + hourTotal);
  console.log(minute0 + " - " + minute1 + " = " + minuteTotal);
  console.log(second0 + " - " + second1 + " = " + secondTotal);
  */

  //turn into double digit spaces (e.g. 1 second == 01 second)
  if (hourTotal < 10) {
    var hourTotal = "0".concat(hourTotal);
  }
  if (minuteTotal < 10) {
    var minuteTotal = "0".concat(minuteTotal);
  }
  if (secondTotal < 10) {
    var secondTotal = "0".concat(secondTotal);
  }

  //print and return elapsed time
  //console.log("elapsed time: " + hourTotal + ":" + minuteTotal + ":" + secondTotal);
  return hourTotal + ":" + minuteTotal + ":" + secondTotal;
}

/*updates time by adding old time + new time*/
function updateTime(oldTime, timeToAdd) {
  //console.log("old time: " + oldTime + ", elapsed time: " + timeToAdd);
  //grab hours, minutes, and seconds
  let hour0 = oldTime.substring(0,2);
  let hour1 = timeToAdd.substring(0,2);
  let minute0 = oldTime.substring(3,5);
  let minute1 = timeToAdd.substring(3,5);
  let second0 = oldTime.substring(6,8);
  let second1 = timeToAdd.substring(6,8);

  var hourTotal, minuteTotal, secondTotal;

  //add hours, minutes, and seconds seprately
  hourTotal = +hour0 + +hour1;
  minuteTotal = +minute0 + +minute1;
  secondTotal = +second0 + +second1;

  //add "excess" seconds - anything over 60 will add a minute to minuteTotal
  /* debugging the math
  if (60%60 == 0) {
    console.log("120%60 = 0");
    console.log('set to 0');
    console.log('adding ' + 60/60 + ' minutes');
  }
  if (121%60 != 0) {
    console.log("121%60 != 0");
    console.log('subtracting ' + 121%60 + " from 121");
    console.log('adding ' + (121 - 121%60)/60 + " minutes");
    console.log('set to ' + 121%60);
  }
  */

  //first check if seconds is >= 60
  if (secondTotal >= 60) {
    //if seconds is a multiple of 60
    if (secondTotal%60 == 0) {
      var minuteTotal = minuteTotal + secondTotal/60;
      var secondTotal = 0;
      //if not, add the number of 60 multiples to minutes &
      //subtract remainder of seconds/60 and set seconds to that
    } else if (secondTotal%60 != 0) {
      var difference = secondTotal - secondTotal%60;
      var minuteTotal = minuteTotal + difference/60;
      var secondTotal = secondTotal%60;
    }
  } else {
    //console.log('seconds is less than 60');
  }

  //add "excess" minutes - anything over 60 will add an hour to the hourTotal
  if (minuteTotal >= 60) {
    //if seconds is a multiple of 60
    if (minuteTotal%60 == 0) {
      var hourTotal = hourTotal + minuteTotal/60;
      var minuteTotal = 0;
      //if not, add the number of 60 multiples to minutes &
      //subtract remainder of seconds/60 and set seconds to that
    } else if (minuteTotal%60 != 0) {
      var difference = minuteTotal - minuteTotal%60;
      var hourTotal = hourTotal + difference/60;
      var minuteTotal = minuteTotal%60;
    }
  } else {
    //console.log('minutes is less than 60');
  }

  //convert time to double digits again
  if (hourTotal < 10) {
    var hourTotal = "0".concat(hourTotal);
  }
  if (minuteTotal < 10) {
    var minuteTotal = "0".concat(minuteTotal);
  }
  if (secondTotal < 10) {
    var secondTotal = "0".concat(secondTotal);
  }

  return hourTotal + ":" + minuteTotal + ":" + secondTotal;
  //end of function
}


/**********************************************************************************
                                  PAGE/TAB FUNCTIONS
                      sort, checkPage, updateHistory, onActivated
***********************************************************************************/

/* variables for amount of time spent doing "work" and amount of time spent
 * NOT doing work ("play") */
var workTime, playTime;
var test;

/* looks through every item in history to see if the url is in the whitelist,
 * then adds up the amount of time spent on whitelisted websites vs. amount
 * of time spent on non-whitelisted websites
 * whitelisted time = workTime
 * non-whitelisted time = playTime */
function sort() {
  chrome.storage.local.get(["whitelist"], function(whitelist) {
    chrome.storage.local.get(["history"], function(history) {
      if (workTime == undefined && playTime == undefined) {
        console.log('initializing workTime & playTime');
        var workTime = "00:00:00";
        var playTime = "00:00:00";
      }

      console.log('whitelist: ' + Object.values(whitelist));
      console.log('history: ' + Object.values(history));

      //turn object data into strings
      const whitelistString = Object.values(whitelist).toString();
      const historyString = Object.values(history).toString();

      //turn strings into arrays
      const whitelistArray = whitelistString.split(",");
      const historyArray = historyString.split(",");

      //for each item in history, check if it's in the whitelist
      historyArray.forEach(function(url) {
        if (whitelistArray.includes(url) == true) {
          //console.log('whitelist has it!');
          chrome.storage.local.get([url], function(data) {
            //console.log("url: " + url + ", data: " + Object.values(data));
            let time = Object.values(data).toString();
            var newTime = updateTime(workTime, time);
            workTime = newTime;
            //console.log('work time: ' + workTime);
          });
        } else if (whitelistArray.includes(url) == false){
          //console.log('whitelist does not have it');
          chrome.storage.local.get([url], function(data) {
            //console.log("url: " + url + ", data: " + Object.values(data));
            let time = Object.values(data).toString();
            var newTime = updateTime(playTime, time);
            playTime = newTime;
            //console.log("play time: " + playTime);
          });
        }
      });
    });
  });
}

/* keeps track of all the visited websites
 * called in checkPage() function in onActivated */
 function updateHistory(urlToAdd) {
   console.log('updating history');
   chrome.storage.local.get(["history"], function(history) {
     chrome.storage.local.get([urlToAdd], function(result) {
       const list = Object.values(history);
       const listString = list.toString();

       //if history is empty, add first website
       if (list == "") {
         chrome.storage.local.set({"history": urlToAdd}, function() {
            console.log('set ' + urlToAdd);
         });
      //if history has one item and current tab is NOT in the database
       } else if (listString.includes(",") == false && listString.includes(urlToAdd) == false) {
         const array = [list, urlToAdd];
         const string = array.toString();

         chrome.storage.local.remove(["history"], function() {
           chrome.storage.local.set({"history":string}, function() {
             console.log('set ' + string);
           });
         });
      //if history has more than one item and current tab is NOT in the database
       } else if (listString.includes(",") == true && listString.includes(urlToAdd) == false) {
         const array = listString.split(",");
         array.push(urlToAdd);
         const string = array.toString();
         chrome.storage.local.remove(["history"], function() {
           chrome.storage.local.set({"history":string}, function() {
             console.log('set ' + string);
           });
         });
       }
     });
   });
 }

/* called whenever a tab is activated / decided (urL)
 * tabs will alternate between 0 and 1, decided by the boolean switchVar 3 */
function checkPage(currentTab, currentTime) {
  chrome.storage.local.get([currentTab], function(result) {
    //check which tab it's supposed to be on (either 0 or 1)
    if (switchVar == true && currentTab != "newtab") {
      tab0 = currentTab;
      time0 = currentTime;
      //console.log('setting tab 0 to ' + tab0 + " " + time0);
      switchVar = false;
    }
    else if (switchVar == false && currentTab != "newtab") {
      tab1 = currentTab;
      time1 = currentTime;
      //console.log('setting tab 1 to ' + tab1 + " " + time1);
      switchVar = true;
    }

    //once you have more than 1 tab, assign the previous tab
    if (time0 != undefined && time1 != undefined) { //check for undefined to wait until "newtab" is established/overwritten
      if (switchVar == true) {
        var previousTab = tab0;
        var previousTime = time0;
        //console.log("previous: " + previousTab);
      } else if (switchVar == false) {
        var previousTab = tab1;
        var previousTime = time1;
        //console.log('previous: ' + previousTab);
      }

      //figure out the time spent on the previous tab
      const timeInput = calculateTime(currentTime, previousTime);

      //after figuring out time, put into database
      //this allows us to use a string as a key for the object we insert
      var key = previousTab;
      var obj = {};
      obj[key] = timeInput;

      //if the url isn't in the database yet (grabbed at beginning of function)
      if (Object.values(result).length == 0) {
        console.log("adding new url: " + previousTab);
        //updateHistory(currentTab);

          chrome.storage.local.set(obj, function() {
            chrome.storage.local.get([previousTab], function(result) {
              console.log(result);
            });
          });
      //if the url is already in the database && currently the same url
      } else if (previousTab == currentTab) {
          //console.log('same');
          let newTime = updateTime(Object.values(result).toString(),timeInput);
          obj[key] = newTime;

          //remove and set in database again
          chrome.storage.local.remove([previousTab], function() {
            chrome.storage.local.set(obj, function() {
              chrome.storage.local.get([previousTab], function(result) {
                console.log(result);
              });
            });
          });
      } else if (previousTab != currentTab) {
          //console.log("urls are not the same");
          chrome.storage.local.get([previousTab], function(result) {
            let newTime = updateTime(Object.values(result).toString(), timeInput);
            obj[key] = newTime;

            chrome.storage.local.remove([previousTab], function() {
              chrome.storage.local.set(obj, function() {
                chrome.storage.local.get([previousTab], function(result) {
                  console.log(result);
                });
              });
            });
          });
        }
      } //end of if

  });
}

/* sets current tab in database to grab from pop-up */
function updateCurrentTab(url) {
  chrome.storage.local.remove(["currentTab"], function() {
    chrome.storage.local.set({"currentTab":url});
      console.log('current tab set in database: ' + url);
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
            }
            else if (domain != "newtab") {//so it doesn't print out "newtab"
              var time = timeStamp();
                console.log("active tab: " + domain + " @ " + time);
                checkPage(domain,time);
                console.log('UPDATING in NEWTAB');
                updateHistory(domain);
                updateCurrentTab(domain);
            }
          }
        });
      }

      //otherwise when already established, print: "active tab: DOMAIN @ TIME"
      else {
        if (tab.status === 'complete') {
          var time = timeStamp();
          console.log("active tab: " + domain + " @ " + time);
          checkPage(domain,time);
          console.log('UPDATING in ELSE');
          updateHistory(domain);
          updateCurrentTab(domain);
        }
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
