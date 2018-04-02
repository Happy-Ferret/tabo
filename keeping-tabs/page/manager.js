Vue.component("current-list", {
  template: `
    <li>
      <article class="media">
        <figure class="media-left">
          <p class="image is-16x16">
            <img :src=favicon>
          </p>
        </figure>
        <div class="media-content">
          <a
            :href=url
            target="_blank"
            class="medium-font primary-color clickable"
          >{{ title }}</a>
        </div>
      </article>
    </li>
  `,
  props: ["favicon", "title", "url"]
});

Vue.component("saved-list", {
  template: `
    <li>
      <p class="names medium-font clickable">{{ name }}</p>
      <p class="small-font secondary-color">
        <span class="primary-color clickable">{{ count }} tabs</span>
        @ {{ date }} {{ time }}
      </p>
    </li>
  `,
  props: ["date", "count", "time", "name"]
});

new Vue({
  el: "#vue-app",
  data: function() {
    return {
      currentItems: [],
      savedItems: [
        {date: "2018/04/02", time: "10:57 AM", name: "Apple Pie", count: "2"},
        {date: "2018/04/02", time: "10:57 AM", name: "Apple Pie", count: "2"},
      ]
    };
  },
  created: function() {
    var vue = this;
    vue.updateCurrentItems();
    browser.tabs.onUpdated.addListener(function() {
      vue.updateCurrentItems();
    });
    browser.tabs.onRemoved.addListener(function() {
      setTimeout(vue.updateCurrentItems, 500);
    });
  },
  methods: {
    updateCurrentItems() {
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
        vue.currentItems = tabList;
      });
    },
    greet() {
      alert("Hello!");
    }
  }
});
