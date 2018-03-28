// var content = document.getElementById("content");

// document.getElementById("save").addEventListener("click", function() {
//   browser.tabs.query({
//     currentWindow: true,
//     active: false
//   }).then(function(tabs) {
//     var openTabs = tabs.filter(tab => !tab.url.startsWith("about:"));
//     content.innerHTML += openTabs.map(tab => formatTab(tab));
//   });
// });

// function formatTab(tab) {
//   return `
//     <img src="${tab.favIconUrl}" alt="Favicon">
//     <p>${tab.title}</p>
//     <p>${tab.url}</p>
//   `;
// }

Vue.use(Buefy.default);

new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!"
  }
});
