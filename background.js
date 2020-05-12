chrome.browserAction.onClicked.addListener(function(tab) {
  if (/^http(s)?:\/\//.test(tab.url)) {
    chrome.tabs.executeScript(tab.id, {file: "download.js", allFrames:true});			
  }
})
