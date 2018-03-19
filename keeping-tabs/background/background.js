// Open extension page when toolbar button is clicked
browser.browserAction.onClicked.addListener(function() {
  // Create tab for extension page
  browser.tabs.create({
    url: "page/manager.html",
    active: true
  }).then(function(tab) {
    // Tab created
    console.log(`Created tab: ${tab.id}`);
  }, function(error) {
    // Handle error
    console.log(`Error: ${error}`);
  });
});
