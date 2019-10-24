import App from './App'
import Vue from "vue";
import VueRouter from 'vue-router'
Vue.use(VueRouter);


const routes = [
  { path: '/', component: App },
  { path: '/host', component: ()=> import('./page/host/index.vue') },
  { path: '/tiancheng', component: ()=> import('./page/tiancheng/index.vue') },
  { path: '/record', component: ()=> import('./page/record/index.vue') }


]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

export default router