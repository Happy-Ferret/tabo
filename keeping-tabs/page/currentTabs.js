Vue.component("v-title", {
  template: "<h1 class='title is-4'>{{ title }}</h1>",
  data: function() {
    return {
      title: "Current Tabs"
    };
  }
});

Vue.component("v-list", {
  template: `
    <ul id="current-tab-content">
      <li v-for="item in items">
        <article class="media">
          <figure class="media-left">
            <p class="image is-32x32">
              <img :src=item.favicon>
            </p>
          </figure>
          <div class="media-content">
            <p class="titles">{{ item.title }}</p>
            <p class="urls" :href=item.url>{{ item.url }}</p>
          </div>
        </article>
      </li>
    </ul>
  `,
  data: function() {
    return {
      items: [],
    };
  },
  created: function() {
    var vue = this;
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
      var vue = this;
      browser.tabs.query({
        currentWindow: true
      }).then(function(tabs) {
        var openTabs = tabs.filter(tab => !tab.url.startsWith("about:") && 
          !tab.url.startsWith("moz-extension:"));
        var tabList = openTabs.map(function(tab) {
          return {
            favicon: tab.favIconUrl,
            title: tab.title,
            url: tab.url
          };
        });
        vue.items = tabList;
      });
    }
  }
});

new Vue({el: "#current-tabs"});
