import Vue from "vue";
import App from "./App.vue";
import {
  Button,
  Select,
  Table,
  Pagination,
  Input,
  TableColumn,
  FormItem,
  Loading,
  Dialog,
  Form,
  Option,
  Upload,
  Message
} from "element-ui";
// import Element from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import fetch from "@/fetch";

// Vue.use(Element);
Vue.use(Select);
Vue.use(Table);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Input);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Dialog);
Vue.use(Option);
Vue.use(Upload);
Vue.use(FormItem);

Vue.use(Loading.directive);
Vue.prototype.$message = Message;

Vue.config.productionTip = false;
Vue.prototype.$axios = fetch;
new Vue({
  render: h => h(App)
}).$mount("#app");
