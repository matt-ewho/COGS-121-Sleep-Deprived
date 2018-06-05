
//ON PAGE LOAD
  document.addEventListener("DOMContentLoaded", function(event) {
    //const optionsURL = window.location.href;
    console.log("options loaded");
    generateTable();
  });
  /******************************************************

                      Charts

  ******************************************************/

  var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]
        ],
        names:{
          data1:'dirt',
          data2:'poop'
        }
      }
  });


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

/*show whitelist in console

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
      console.log(i);
      var row = document.createElement("tr");
      var site = array[i];
      console.log(site);

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

/*
document.getElementById("testbutton").onclick=function() {
  $("#testbox").html("TEXT HAS CHANGED SUCCESSFULLY");
  console.log("Text has changed successfully on front end.");
};

document.getElementById("alertbutton").onclick=function() {
  alert('alert button works heck yes');
};*/

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
