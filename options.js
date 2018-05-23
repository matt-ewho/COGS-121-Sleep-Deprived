
//ON PAGE LOAD
  document.addEventListener("DOMContentLoaded", function(event) {
    //const optionsURL = window.location.href;
    console.log("ready!");
    generateTable();
  });

/******************************************************

                    FUNCTIONS

******************************************************/

//add to whitelist
document.getElementById("add").onclick=function() {
  chrome.storage.local.get(["whitelist"], function(result) {
    const list = Object.values(result);
    const listString = list.toString();
    const newURL = $("#test-input").val();
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

/*show whitelist*/
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
}

//create the table & call this function for the page ready
function generateTable() {
  chrome.storage.local.get(["whitelist"], function(result) {
    console.log(result);
    //get length of list, if 0, 1, or >1
    const list = Object.values(result);
    const listString = list.toString();
    var length;

    //list length = 0
    if (list == "") {
      console.log('length is 0');
      var length = 0;
    }
    else if (listString.includes(",") == false) {
      console.log('length is 1');
      var length = 1;
    }
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
    for (var i=0; i<length; i++) {
      var row = document.createElement("tr");

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
  console.log("done");
  generateTable();
}


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
    chrome.storage.local.remove(["whitelist"], function() {
      console.log('cleared');
      reloadTable()
    });

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
