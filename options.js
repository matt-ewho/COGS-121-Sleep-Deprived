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
    alert("Whitelisted websites have been deleted.");
  }
};

/*SAVE CHANGES alerts*/
document.getElementById("saveWhitelist").onclick=function() {
  alert("Whitelist changes have been saved successfully.");
};

document.getElementById("saveInterval").onclick=function () {
  alert("Work Interval settings have been saved successfully.");
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
