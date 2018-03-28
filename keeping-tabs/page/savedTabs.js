Vue.component("v-title", {
  template: "<h1 class='title is-4'>{{ title }}</h1>",
  data: function() {
    return {
      title: "Saved Tabs"
    };
  }
});

new Vue({el: "#saved-tabs"});
