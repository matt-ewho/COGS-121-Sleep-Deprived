document.addEventListener("DOMContentLoaded", function(event) {
  console.log("pop-up loaded");
});


document.getElementById("testbutton").addEventListener("click", function() {
  console.log('hi');
});

document.getElementById("add").addEventListener("click", function() {
  chrome.storage.local.set({"test":"testing"}, function() {
    console.log("complete");
  });
});

document.getElementById("paste").addEventListener("click", function() {
  chrome.storage.local.get(["test"], function(result) {
    console.log(result);
  })
})
/*let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.body.style.backgroundColor = "' + color + '";'});
  });
};*/
