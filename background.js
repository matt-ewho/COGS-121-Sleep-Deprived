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


chrome.tabs.onCreated.addListener(function(tab) {
 console.log("new tab created");
});

function search(website) {
  var string = JSON.stringify(website);
  console.log("before search");
}
//grab the whitelist with values
function getWhiteList(callback) {
  chrome.storage.local.get(["whitelist"], function(result) {
    console.log(result);
    return Object.values(result);
  });
  callback();
}

//for debugging: print whitelist values
function printWhitelist() {
  console.log("printing...");
  var list = getWhiteList(function() {
    console.log(list);
  });
}

function addToWhiteList(website) {
/*
  var list = array.toString();
  chrome.storage.local.set({"test":list}, function() {
    console.log("set");
  });

  chrome.storage.local.get(["test"], function(result) {
    console.log(Object.values(result));
  })*/

  /*
  var array = ["google.com", "wikipedia.org"];
  var list = array.toString();
  console.log(list);
  var array2 = list.split(",");
  array2.forEach(function(e) {
    console.log(e);
  });
  console.log("");

  array.push("facebook.com");
  list = array.toString();
  array2 = list.split(",");
  array2.forEach(function(e) {
    console.log(e);
  })*/

  /*
  chrome.storage.local.set({"whitelist":list}, function() {
    console.log('ajlfksdjf');
  });*/
}

//updates the website & time in the database
function update(website, time) {
  //turn shit into string so the dumb function can use it
  var string = JSON.stringify(website);
  /*
  chrome.storage.local.remove([string], function() {
    console.log("removakdjfsldj");
  });*/
  //after removing, add again bc screw efficiency
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
      chrome.storage.local.set({"whitelist": "website"}, function() {
        console.log("setting whitelist");
      });

      printWhitelist();

/*chrome.storage.local.set({"website": "50"}, function() {
  console.log("while it's setting");
});


chrome.storage.local.get(["website"], function(result) {
  console.log(result);
  console.log(Object.values(result))
});

chrome.storage.local.remove(["website"], function() {
  console.log("removed");
});

chrome.storage.local.get(["website"], function(result) {
  console.log(result);
})*/



}


    if (domain != "newtab") //so it doesn't print out "newtab"
{    console.log("active tab: " + domain);}
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo){
  console.log('activated');
  console.log(timeStamp());
   chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
}, function(tabs) {
    /*switching/active tabs debug - will print the FULL url of tab
    var tab = tabs[0];
    console.log("tab switched:" + tab.url);*/

    //prints ONLY the domain name
    chrome.tabs.getSelected(null, function (tab) {
      var url = new URL(tab.url)
      var domain = url.hostname

      if (domain == "newtab") {
        domain = "URL NOT SET";
      }
      console.log("active tab: " + domain);
      chrome.storage.local.set
      // `domain` now has a value like 'example.com'
    });
  });
})

/*prints when a tab is closed*/
/*extension will ALSO print new active tab*/
/*
chrome.tabs.onRemoved.addListener(function(tabid,removed){
  console.log("tab closed");
})*/
