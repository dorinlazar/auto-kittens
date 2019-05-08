chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.type == "settings") {
    localStorage['settings'] = JSON.stringify(req.settings);
  } else if (req.type == "load") {
    if ('settings' in localStorage) {
      sendResponse(JSON.parse(localStorage['settings']));
    }
    sendResponse({});
  }
});
