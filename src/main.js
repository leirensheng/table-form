import Vue from "vue";
import App from "./App.vue";
import router from './router'
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
  Message,
  Popover,
  MessageBox,
  Radio,
  RadioGroup,
  Alert,
  Tabs,
  TabPane
} from "element-ui";
// import Element from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import VTable from '@/components/vTable.vue'
Vue.component('VTable',VTable)
import VDialog from '@/components/vDialog.vue'
Vue.component('VDialog',VDialog)
import fetch from "@/fetch";
import VueSocketIo from 'vue-socket.io';

Vue.use(new VueSocketIo({
    debug: true,
    connection: 'http://metinseylan.com:1992' //地址+端口，由后端提供
}));

Vue.use(Tabs)
Vue.use(TabPane)
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
Vue.use(Popover);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Alert)
// Vue.use(MessageBox)

Vue.use(Loading.directive);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.config.productionTip = false;
Vue.prototype.$axios = fetch;
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
