var managerTabId = null;

// Open extension page when toolbar button is clicked
browser.browserAction.onClicked.addListener(function() {
  // Check if manager tab already open
  checkTabIsOpen(managerTabId).then(function(open) {
    if (open) {
      // Switch to manager tab
      browser.tabs.update(managerTabId, {active: true});
    } else {
      // Create manager tab
      browser.tabs.create({
        url: "page/manager.html",
        active: true
      }).then(function(tab) {
        // Tab created
        managerTabId = tab.id;
      });
    }
  });
});

// Check if tab with given id is open in current window
function checkTabIsOpen(tabId) {
  return new Promise(function(resolve, reject) {
    browser.tabs.query({
      currentWindow: true
    }).then(function(tabs) {
      if (tabs.filter(tab => tab.id == tabId).length == 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    }, function(error) {
      reject(error);
    });
  });
}
