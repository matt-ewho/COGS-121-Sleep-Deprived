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


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


/**********************************************************************************
                                    TAB FUNCTIONS
***********************************************************************************/

/*global variables*/

var tab0; //with time0
var tab1; //with time1
var time0;
var time1;
var switchVar = true;

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
                console.log("active tab: " + domain + " @ " + timeStamp());
            }
          }
        });
      }

      //print: "active tab: DOMAIN @ TIME"
      else {
        console.log("active tab: " + domain + " @ " + timeStamp());
        //console.log(switchVar);
        if (switchVar == true) {
          console.log('true');
          switchVar = false;
        }
        else if (switchVar == false) {
          console.log('false');
          switchVar = true;
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
