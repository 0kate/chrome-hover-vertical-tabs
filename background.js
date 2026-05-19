chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabs') {
    chrome.tabs.query({}, (tabs) => {
      sendResponse({ tabs });
    });
    return true;
  }

  if (request.action === 'switchTab') {
    chrome.tabs.update(request.tabId, { active: true }, () => {
      chrome.windows.update(request.windowId, { focused: true });
    });
    sendResponse({ success: true });
    return true;
  }

  if (request.action === 'closeTab') {
    chrome.tabs.remove(request.tabId);
    sendResponse({ success: true });
    return true;
  }
});
