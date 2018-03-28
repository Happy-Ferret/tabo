Vue.component("v-title", {
  template: "<h1 class='title is-4'>{{ title }}</h1>",
  data: function() {
    return {
      title: "Current Tabs"
    };
  }
});

Vue.component("v-table", {
  template: "<b-table :data='data' :columns='columns'></b-table>",
  data: function() {
    return {
      data: [],
      columns: [
        {
          field: "favicon",
          label: "Favicon"
        },
        {
          field: "title",
          label: "Title"
        },
        {
          field: "url",
          label: "URL"
        }
      ]
    };
  },
  created: function() {
    let vue = this;
    vue.updateData();
    browser.tabs.onUpdated.addListener(function() {
      vue.updateData();
    });
    browser.tabs.onRemoved.addListener(function() {
      setTimeout(vue.updateData, 500);
    });
  },
  methods: {
    updateData() {
      let vue = this;
      browser.tabs.query({
        currentWindow: true
      }).then(function(tabs) {
        var openTabs = tabs.filter(tab => !tab.url.startsWith("about:") && 
          !tab.url.startsWith("moz-extension:"));
        var tabList = openTabs.map(function(tab) {
          return {
            "favicon": `<img src="${tab.favIconUrl}">`,
            "title": tab.title,
            "url": tab.url
          };
        });
        vue.data = tabList;
      });
    }
  }
});

new Vue({el: "#current-tabs"});
