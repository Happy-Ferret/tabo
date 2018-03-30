Vue.component("tab-list", {
  template: `
    <li>
      <article class="media">
        <figure class="media-left">
          <p class="image is-32x32">
            <img :src=favicon>
          </p>
        </figure>
        <div class="media-content">
          <p class="titles">{{ title }}</p>
          <p class="urls" :href=url>{{ url }}</p>
        </div>
      </article>
    </li>
  `,
  props: ["favicon", "title", "url"]
});

new Vue({
  el: "#current-tabs",
  data: function() {
    return {
      count: 0,
      items: []
    };
  },
  created: function() {
    var vue = this;
    vue.updateItems();
    browser.tabs.onUpdated.addListener(function() {
      vue.updateItems();
    });
    browser.tabs.onRemoved.addListener(function() {
      setTimeout(vue.updateItems, 500);
    });
  },
  methods: {
    updateItems() {
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
        vue.count = tabList.length;
      });
    }
  }
});
