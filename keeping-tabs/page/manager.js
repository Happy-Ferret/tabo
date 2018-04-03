// Curent Tabs
Vue.component("current-list", {
  template: `
    <li>
      <div class="currentTabs">
        <img :src=favicon>
        <span class="titles">
          <a
            :href=url
            target="_blank"
            class="medium-font has-text-weight-normal primary-color clickable"
          >{{ title }}</a>
        </span>
      </div>
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
            {{ count | pluralize }}
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
  props: ["name", "count", "date", "time", "remove"],
  filters: {
    pluralize: function(value) {
      var noun = "tab";
      if (value > 1) {
        noun += "s";
      }
      return `${value} ${noun}`;
    }
  },
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

      savedItems: []

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

    // Save tabs
    saveCurrentItems() {
      var vue = this;
      var items = vue.currentItems;
      if (items.length >= 1) {
        var session = {
          date: helper.getDateNow(),
          time: helper.getTimeNow(),
          name: "Test",
          count: items.length,
          remove: false
        };
        vue.savedItems.unshift(session);
      }
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

// Helper functions
var helper = {
  getDateNow: function() {
    var today = new Date();
    var date = [
      today.getFullYear(),
      today.getMinutes(),
      today.getSeconds()
    ].map(formatDigit);
    return date.join("/");
  },
  getTimeNow: function() {
    var today = new Date();
    var time = [
      today.getHours(),
      today.getMinutes(),
      today.getSeconds()
    ].map(formatDigit);
    return time.join(":");
  }
};

function formatDigit(number) {
  if (number < 10) {
    number = "0" + number;
  }
  return number;
}
