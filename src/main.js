// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import "./assets/css/reset.css"
//公共组件
import "./components/index"

//路由组件格式

//utils/request.js

//filter
import "./filters/index"
//vuex
import store from "./store"

//element-ul
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"
Vue.use(ElementUI)

//utils

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
