/* filename: options.js
 * description: javascript file for options.html; contains code for charts to be shown
 * as well as functions to add, remove, and clear the whitelist. */
//ON PAGE LOAD

var seconds = [];
  document.addEventListener("DOMContentLoaded", function(event) {
    //const optionsURL = window.location.href;
    console.log("options loaded");
    generateTable();
    generateChart();
  });

  showHistory();

  /******************************************************

                       Bar Charts w/ worktime & playtime

  ******************************************************/

function generateChart()
{
  //get data of work and play time from the chrome storage. then convert
  //into a raw number of seconds to display on the bar chart
  chrome.storage.local.get(["workTime"], function(workTime) {
    //grab times and find total time spent
    let work = Object.values(workTime).toString();
    // your input string
    var a = work.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var workSec = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    chrome.storage.local.get(["playTime"], function(playTime) {
      //grab times and find total time spent
      let play = Object.values(playTime).toString();
      // your input string
      var b = play.split(':'); // split it at the colons

      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      var playSec = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);

        console.log(seconds);

      //generate the chart with the specified data
    var chart = c3.generate({
        data: {
            columns: [
            ['data1', workSec],
            ['data2', playSec]
            ],
            names: {
                data1: 'Work Time',
                data2: 'Non Work Time'
                },
            type: 'bar'
        },
        axis: {
          y: {
              max: 2000,
              min: 5,
              // Range includes padding, set 0 if no padding needed
              // padding: {top:0, bottom:0}
          }
      },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        }
    });

});
});
}


  function workTime(){
  chrome.storage.local.get(["workTime"], function(workTime) {
    let work = Object.values(workTime).toString();
    console.log("work: "+work)
  })
};

  function playTime(){
    chrome.storage.local.get(["playTime"], function(playTime) {
      //grab times and find total time spent
      let play = Object.values(playTime).toString();
      console.log("play: "+play);
      return play;
    })
  };

  function playTimeToSec(){
    chrome.storage.local.get(["playTime"], function(playTime) {
      //grab times and find total time spent
      let play = Object.values(playTime).toString();
      // your input string
      var a = play.split(':'); // split it at the colons

      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

        console.log(seconds);

  })
};

      function workTimeToSec(){
        chrome.storage.local.get(["workTime"], function(workTime) {
          //grab times and find total time spent
          let work = Object.values(workTime).toString();
          // your input string
          var a = work.split(':'); // split it at the colons

          // minutes are worth 60 seconds. Hours are worth 60 minutes.
          var newSec = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

          seconds.push(newSec);

            console.log(seconds);


          })
          return seconds;
      };


  /******************************************************

                  tab for individual site and time

  ******************************************************/
  function showHistory() {
    chrome.storage.local.get(["workTime"], function(workTime) {
      chrome.storage.local.get(["playTime"], function(playTime) {
        //grab times and find total time spent
        let work = Object.values(workTime).toString();
        let play = Object.values(playTime).toString();
        let total = addTime(work,play);

        //display times
        $("#historyDiv").append("work time: " + work);
        let br = document.createElement("br");
        $("#historyDiv").append(br);
        $("#historyDiv").append("non-work time: " + play);
        br = document.createElement("br");
        $("#historyDiv").append(br);
        $("#historyDiv").append("total time spent: " + total);

        //display history
        chrome.storage.local.get(["history"], function(history) {
          br = document.createElement('br');
          $("#historyDiv").append(br);
          var historyText = Object.values(history).toString();
          var historyArray = historyText.split(",");

  //        $("#historyDiv").append();
          historyArray.forEach(function(url) {
            chrome.storage.local.get([url], function(data) {
              br = document.createElement('br');
              var time = Object.values(data);
              $("#historyDiv").append(br);
              $("#historyDiv").append(url + " " + time);
            })
          });
          console.log('array: ' + historyArray);
          ("#historyDiv").append(historyText);
        })
      });
    });
  };

/******************************************************

                    FUNCTIONS

******************************************************/

//add to whitelist
document.getElementById("addWhitelist").onclick=function() {
  chrome.storage.local.get(["whitelist"], function(result) {
    const list = Object.values(result);
    const listString = list.toString();
    var newURL = $("#whitelist-add-url").val();

    //edge cases: if URL is blank / URL doesn't have a domain extension
    if (newURL == "") {
      alert("Entry is blank!");
      return;
    }
    if (newURL.includes(".org") == false && newURL.includes(".com") == false &&
          newURL.includes(".net") == false && newURL.includes(".gov") == false &&
          newURL.includes(".edu") == false) {
      alert("URL entry must have one of the following domain extensions: .ORG, .COM, .NET, .GOV, .EDU");
      return;
    }

    //if whitelist is empty, add the new value
    if (list == "") {
      chrome.storage.local.set({"whitelist":newURL}, function() {
        console.log('set ' + newURL);
        reloadTable();
      });
      //if there is one entry already
    } else if (listString.includes(",") == false) {
      const array = [list, newURL];
      const string = array.toString();
      //remove entry, then re-input
      chrome.storage.local.remove(["whitelist"], function() {
        chrome.storage.local.set({"whitelist":string}, function() {
          console.log('set ' + string);
          reloadTable();
        });
      });
      //if there is more than one entry
    } else if (listString.includes(",") == true) {
      //split up the string into array, then add new entry
      const array = listString.split(",");
      array.push(newURL);
      //turn back into string and remove/re-input
      const string = array.toString();
      chrome.storage.local.remove(["whitelist"], function() {
        chrome.storage.local.set({"whitelist":string}, function() {
          console.log('set ' + string);
          reloadTable();
        });
      });
    }
  });
};

//delete whitelist
document.getElementById("deleteWhitelist").onclick=function() {
  chrome.storage.local.get(["whitelist"], function(result) {
    const list = Object.values(result);
    if (list=="") {
        alert("The whitelist is empty already!");
    } else {
      if (confirm("Are you sure you wish to delete all of your whitelisted websites?")) {
        //deletes entire whitelist
        chrome.storage.local.remove(["whitelist"], function() {
          console.log('cleared');
          reloadTable()
        });
      }
    }
  });
};

/*show whitelist in console for debugging

document.getElementById("show").onclick=function() {
  chrome.storage.local.get(["whitelist"], function(result) {
    const list = Object.values(result);
    if (list == "") {
      console.log('empty');
    }
    else {
      console.log(result);
    }
  })
}*/

//create the table & call this function for the page ready
function generateTable() {
  chrome.storage.local.get(["whitelist"], function(result) {
    console.log(result);
    //get length of list, if 0, 1, or >1
    const list = Object.values(result);
    const listString = list.toString();
    var length;

    //list length = 0 if it's blank
    if (list == "") {
      console.log('length is 0');
      var length = 0;
    }
    //list length = 1 if it doesn't have a comma
    else if (listString.includes(",") == false) {
      console.log('length is 1');
      var length = 1;
    }
    //list length > 1 if it has a comma
    else if (listString.includes(",") == true) {
      const array = listString.split(",");
      var length = array.length;
    }

    //create an array for the loop
    const array = listString.split(",");

    //create table & give it a class
    var table = document.createElement("table");
    table.classList.add("table");
    var tableBody = document.createElement("tbody");

    //create rows with i

    //i must be LET, because it changes the scope in javascript
    //let allows the removesite function to work properly
    for (let i=0; i<length; i++) {
      var row = document.createElement("tr");
      var site = array[i];

      //create cell & cell text for WEBSITE
      var cellWebsite = document.createElement("td");
      var website = document.createTextNode(array[i]);

      //append cell text to cell, then cell to row (like setting a "stage")
      cellWebsite.appendChild(website);
      row.appendChild(cellWebsite);

      //create a cell & cell text for BUTTON
      var cellDelete = document.createElement("td");
      var button = document.createElement("BUTTON"); //has its own element
      var text = document.createTextNode("x");
      button.appendChild(text);
      cellDelete.appendChild(button);
      row.appendChild(cellDelete);

      //event listener for the X button, runs deleteSite function
      //with the site text passed through it
      button.addEventListener('click', function(e)
      {
        deleteSite(site);
        console.log("deleted  : " +site);

        reloadTable();
      });

      //create a row or whatever? row dividers don't show otherwise
      tableBody.appendChild(row);
    }

    //append the table body to the table & then append the table to the table id
    table.appendChild(tableBody);
    document.getElementById("table").appendChild(table);
  })
}

//function for re-loading table (used in adding to whitelist)
function reloadTable() {
  var table = document.getElementById("table");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  console.log("reloaded table");
  //re-generate table
  generateTable();
}

//delete one item from the whitelist

function deleteSite(site) {
  //get the whitelist as a string
  chrome.storage.local.get(["whitelist"], function(result) {
  const list = Object.values(result);
  let listString = list.toString();

//im not 100% sure why this works but it does
  const substring = site;

  let str = site + ",";

  //if its the last item (there are no commas)
  if(listString.indexOf(',') == -1){
    str = site;
  }
//checking if ' site, ' exists (if its at the end or not)
//if it IS at the end, delete ' ,site '
  else if(listString.indexOf(substring) !== -1){
    str = ","+site;
  }
  else{
    str = site + ",";
  }

  console.log(str);

  //replace the site with blank - "remove"
  const newString = listString.replace(str, "");

//if theres still a comma on the end of the string, remove the comma
  if(listString.lastIndexOf(",") == listString.length-1)
  {
    console.log("there is still a comma at the end");
    listString = listString.substring(0, listString.lastIndexOf(","));

  }

  //replace old whitelist with new string of whitelist
  chrome.storage.local.remove(["whitelist"], function() {
  chrome.storage.local.set({"whitelist":newString}, function() {
      reloadTable();
    });
  });
 });
}


/*RESET alerts*/


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
