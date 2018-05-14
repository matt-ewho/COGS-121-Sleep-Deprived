document.addEventListener("DOMContentLoaded", function(event) {
  console.log("ready!");
});

document.getElementById("testbutton").onclick=function() {
  $("#testbox").html("TEXT HAS CHANGED SUCCESSFULLY");
  console.log("Text has changed successfully on front end.");
};

document.getElementById("alertbutton").onclick=function() {
  alert('alert button works heck yes');
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
