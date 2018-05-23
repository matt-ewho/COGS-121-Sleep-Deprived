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

/*drafts*/


chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  if (info.status === 'complete') {
    var tabURL = new URL(tab.url);
    //console.log("inside:" + tabURL);
    var domain = tabURL.hostname;

    if (domain == "newtab") {
      console.log('skdlfj');
      sleep(1000);
      resetWhitelist(function(list) {
        printWhitelist();
      });
      sleep(1000);
      console.log('hi');
      }
    }
});


/* *********************************************************************************



convert: getWhitelist, setWhitelist, resetWhitelist, addToWhitelist, printWhitelist



************************************************************************************/

/**********************************************************************************
                                  WHITELIST FUNCTIONS
***********************************************************************************/

//get whitelist in form of string, not array yet
function getWhitelist(callback) {
  chrome.storage.local.get(['whitelist'], function(result) {
    //turn the resultant string into a real string (sneaky sneaky)
    var string = Object.values(result).toString();
    var array = string.split(",");
    if (array[0] != "") {
      console.log("list: " + string);
    }
    //send the string-to-array'd value to the callback function AFTER it finishes
    callback(array);
  });
}

function resetWhitelist(callback) {
  chrome.storage.local.remove(['whitelist'], function() {
    console.log('removed');
    var list = [];
    callback(list);
  });
}

/*using getWhitelist(callback)
  how to call: arg will be the "returned" result of getWhitelist, pass into callback function "function(args)"
    getWhitelist(function(arg) {
      do something here if you want, optional instruction
    })
*/

function addToWhitelist(website) {
  getWhitelist(function(list) {
    if (list[0] == "") {
       console.log('adding to empty whitelist...');
       chrome.storage.local.set({"whitelist": website}, function() {
         printWhitelist();
       });
    }
    else {
      console.log('else');
      //console.log(list);
    }
  })
}

//for debugging purposes
function printWhitelist() {
  getWhitelist(function(list) {
    if (list.length == 1 && list[0] == "") {
      console.log("whitelist is empty");
    }
    else {
      console.log("printing whitelist...");
      list.forEach(function(e) {
        console.log(e);
      })
    }
  })
}

/**********************************************************************************
                                    TAB FUNCTIONS
***********************************************************************************/




//updates the website & time in the database
function update(website, time) {
  //turn shit into string so the dumb function can use it
  var string = JSON.stringify(website);
  /*
  chrome.storage.local.remove([string], function() {
    console.log("removakdjfsldj");
  });*/
  //after removing, add gain bc screw efficiency
  chrome.storage.local.set({[string]:time}, function() {
    console.log("updating by adding");
  });

  chrome.storage.local.get([string], function(result) {
    console.log(Object.values(result));
    console.log("finished updating: " + Object.values(result));
  });
}

//for updating blank tabs and same tabs to different urls
chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  if (info.status === 'complete') {
    var tabURL = new URL(tab.url);
    //console.log("inside:" + tabURL);
    var domain = tabURL.hostname;

    if (domain == "newtab") {
      domain = "url not set";
    }

    if (domain != "newtab") //so it doesn't print out "newtab"
      {
        console.log("active tab: " + domain);
      }
  }
});

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

      if (domain == "newtab") {
        domain = "URL NOT SET"; //blank tab has url as "newtab", so don't print and relocate domain
      }
      //print: "active tab: DOMAIN @ TIME"
      console.log("active tab: " + domain + " @ " + timeStamp());
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
