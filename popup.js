/* filename: popup.js
 * description: javascript code for the popup.html page; contains code that loads
 * the progress bar by grabbing data from the storage database and updates it; the
 * progress bar ratio is calculated here using generateProgressBar(), as well as the
 * colors that are used for indicating status (next to the numeric %). */

/* on-page load function for pop-up */
document.addEventListener("DOMContentLoaded", function(event) {
  console.log("pop-up loaded");

  //add descriptions to icon hovers
  $("#add-icon").attr('title', 'add current website to whitelist');
  $("#settings-icon").attr('title', 'settings');

  showHistory();

  //generate the progress bar (will work asynchronously)
  generateProgressBar();

  //grab the work time and play time and check if they're undefined
  chrome.storage.local.get(["workTime"], function(workTime) {
    chrome.storage.local.get(["playTime"], function(playTime) {
      if (Object.values(workTime) == "" && Object.values(playTime) == "") {
        chrome.storage.local.set({"workTime":"00:00:00"}, function() {
          chrome.storage.local.set({"playTime":"00:00:00"}, function() {
            console.log('initialized workTime / playTime');
            //sort();
          });
        });
        //if they're defined, update the times for the progress bar
      } else {
        console.log('else');
        //sort();
        console.log(Object.values(workTime));
        console.log(Object.values(playTime));
      }
    });
  });
});

/* debugging function for resetting database */
document.getElementById("resetDatabase").onclick=function() {
  chrome.storage.local.get(["whitelist"], function(result) {
    console.log(result);
    let string = Object.values(result);
    chrome.storage.local.clear(function() {
      console.log('database cleared');
      chrome.storage.local.set({"whitelist":string}, function() {
        console.log('restoring whitelist');
        chrome.storage.local.get(["whitelist"], function(list) {
          console.log(list);
        });
      });
    });
  });
}

/* adds current website to whitelist by grabbing "currentWebsite" object from database */
document.getElementById("add-icon").onclick=function() {
  chrome.storage.local.get(["currentTab"], function(url) {
    console.log(url);
    chrome.storage.local.get(["whitelist"], function(result) {
      const list = Object.values(result);
      const listString = list.toString();
      const urlString = Object.values(url);
      console.log(urlString);

      //if whitelist is empty, add the new value
      if (list == "") {
        chrome.storage.local.set({"whitelist":urlString}, function() {
          console.log('set ' + urlString);
          alert("Added " + urlString + " to whitelist!")
        });
        //if there is one entry already
      } else if (listString.includes(",") == false) {
        const array = [list, urlString];
        const string = array.toString();
        //remove entry, then re-input
        chrome.storage.local.remove(["whitelist"], function() {
          chrome.storage.local.set({"whitelist":string}, function() {
            console.log('set ' + string);
            alert("Added " + urlString + " to whitelist!")
          });
        });
        //if there is more than one entry
      } else if (listString.includes(",") == true) {
        //split up the string into array, then add new entry
        const array = listString.split(",");
        array.push(urlString);
        //turn back into string and remove/re-input
        const string = array.toString();
        chrome.storage.local.remove(["whitelist"], function() {
          chrome.storage.local.set({"whitelist":string}, function() {
            console.log('set ' + string);
            alert("Added " + urlString + " to whitelist!")
          });
        });
      }
    });
  });
}

/**********************************************************************************
                                  PROGRESS BAR FUNCTIONS
                    generateProgressBar, addTime (same as updateTime)
***********************************************************************************/

function generateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  chrome.storage.local.get(["workTime"], function(workTime) {
    chrome.storage.local.get(["playTime"], function(playTime) {
        //grab times and find total time spent
        let work = Object.values(workTime).toString();
        let play = Object.values(playTime).toString();
        console.log(work + " " + play + " alsdkfjlsdkfj");
        let total = addTime(work,play);

        //calculate ratios
        let playRatio = calculateRatio(play,total);
        let workRatio = calculateRatio(work,total);
        console.log("flag " + playRatio + " " + workRatio);

        let ratio;
        let text;
        if (+playRatio > +workRatio) {
          ratio = playRatio.concat("%");
          text = "play";
        } else if (+workRatio > playRatio) {
          ratio = workRatio.concat("%");
          text = "work";
        } else if (+playRatio == +workRatio | +playRatio == 50.00 | +workRatio == 50.00) {
          ratio = "50.00%";
        }

        //inject ratio into html to show on progress bar
        progressBar.style.width = ratio;
        console.log("hi hi hi " + ratio);

        //color the bar based on progress
        let color;
        if (text == "play") {
          if (+playRatio >= 0.00 && +playRatio < 25.00) {
            color = "progress-bar-success";
          }
          else if (+playRatio >= 25.00 && +playRatio <= 50.00) {
            color = "progress-bar-warning";
          }
          else if (+playRatio > 50.00 && +playRatio <= 100) {
            color = "progress-bar-danger";
          }
        } else if (text == "work") {
          if (+workRatio >= 50.00 && +workRatio <= 100.00) {
            color = "progress-bar-success";
          } else if (+workRatio < 50 && +workRatio >= 25.00) {
            color = "progress-bar-warning";
          } else if (+workRatio >= 0.00 && +workRatio < 25.00) {
            color = "progress-bar-danger";
          }
        }
        progressBar.classList.add(color);

        //display the percentage on the bar
        $("#progressBar").html(ratio + " " + text);
    });
  });
}

/* same as updateTime */
function addTime(oldTime, timeToAdd) {
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

/* calculates ratio out of total given */
function calculateRatio(timeToDivide, totalTime) {
  console.log(timeToDivide + " " + totalTime);
  //grab hours, minutes, and seconds
  let hour0 = timeToDivide.substring(0,2);
  let hour1 = totalTime.substring(0,2);
  let minute0 = timeToDivide.substring(3,5);
  let minute1 = totalTime.substring(3,5);
  let second0 = timeToDivide.substring(6,8);
  let second1 = totalTime.substring(6,8);

  //convert everything to seconds
  let hourToSecond0 = +hour0*3600;
  let hourToSecond1 = +hour1*3600;
  let minuteToSecond0 = +minute0*60;
  let minuteToSecond1 = +minute1*60;

  let secondTotal0 = +hourToSecond0 + +minuteToSecond0 + +second0;
  let secondTotal1 = +hourToSecond1 + +minuteToSecond1 + +second1;
  console.log("total seconds: " + secondTotal0 + "/" + secondTotal1);
  let ratio = (+secondTotal0/+secondTotal1)*100;

  return ratio.toString().substring(0,5);
}

/* for debugging - shows list of visited websites (generated and saved from background.js)
 * along with amount of time spent on website */
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
        //$("#historyDiv").append(historyText);
      })
    });
  });
}
