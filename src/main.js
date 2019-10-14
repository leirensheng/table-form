import Vue from "vue";
import App from "./App.vue";
// import { Button, Select, Table } from "element-ui";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import fetch from "@/fetch";

Vue.use(Element);
// Vue.use(Select);
// Vue.use(Table);

Vue.config.productionTip = false;
Vue.prototype.$axios = fetch;
new Vue({
  render: h => h(App)
}).$mount("#app");
