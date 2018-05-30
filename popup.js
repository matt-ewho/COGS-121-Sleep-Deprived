document.addEventListener("DOMContentLoaded", function(event) {
  console.log("pop-up loaded");
});

/*
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
        })
      })
    });
  });
}

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
