// Curent Tabs
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
            class="medium-font has-text-weight-normal primary-color clickable"
          >{{ title }}</a>
        </div>
      </article>
    </li>
  `,
  props: ["favicon", "title", "url"]
});

// Saved Sessions
Vue.component("saved-list", {
  template: `
    <li>
      <div class="sessions">
        <p class="names medium-font has-text-weight-normal clickable">
          {{ name }}
        </p>
        <p class="small-font has-text-weight-light secondary-color">
          <span class="primary-color clickable">
            {{ count }} tabs
          </span>
          @ {{ date }} {{ time }}
        </p>
      </div>
      <p
        v-if="remove"
        @click="$emit('remove-item')"
        class="removes medium-font primary-color has-text-weight-light"
      >x</p>
    </li>
  `,
  props: ["name", "count", "date", "time", "remove"]
});

// Application
new Vue({
  el: "#vue-app",
  data: function() {
    return {

      /* General */

      actionClasses: ["medium-font", "has-text-weight-normal", "clickable"],

      /* Current Tabs */

      currentItems: [],

      /* Saved Sessions */

      savedItems: [
        {
          date: "2018/04/02",
          time: "10:57:34",
          name: "Apple Pie",
          count: "2",
          remove: false
        },
        {
          date: "2018/04/02",
          time: "10:57:34",
          name: "Orange",
          count: "4",
          remove: false
        },
      ]

    };
  },
  created: function() {

    var vue = this;

    /* Current Tabs */

    vue.updateCurrentItems();
    browser.tabs.onUpdated.addListener(function() {
      vue.updateCurrentItems();
    });
    browser.tabs.onRemoved.addListener(function() {
      setTimeout(vue.updateCurrentItems, 500);
    });

  },
  computed: {

    /* Current Tabs */

    // Toggle save action
    currentActionClasses: function() {
      var classes = this.actionClasses.join(" ");
      if (this.currentItems.length == 0) {
        classes += " disabled";
      }
      return classes;
    },

    /* Saved Sessions */

    // Toggle remove and clear actions
    savedActionClasses: function() {
      var classes = this.actionClasses.join(" ");
      if (this.savedItems.length == 0) {
        classes += " disabled";
      }
      return classes;
    }

  },
  methods: {

    /* Current Tabs */

    // Refresh tabs
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

    /* Saved Sessions */

    // Handler function for remove action
    removeActionHandler() {
      this.toggleRemoveButtons();
      if (!this.savedActionClasses.endsWith("disabled")) {
        var action = document.getElementById("remove-action");
        action.classList.toggle("active");
      }
    },

    // Toggle showing remove buttons
    toggleRemoveButtons() {
      this.savedItems.forEach(item => item.remove = !item.remove);
    },

    // Remove session
    removeSavedItem(index) {
      this.savedItems.splice(index, 1);
    },

    // Remove all sessions
    clearSavedItems() {
      this.savedItems = [];
    }

  }
});
