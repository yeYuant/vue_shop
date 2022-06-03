import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router/router'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入 element 
import element from './plugins/element'
import axios from 'axios'
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = sessionStorage.getItem('token')
  return config //在最后,必须return config
})
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$axios = axios

Vue.config.productionTip = false


new Vue({
  el: "#app",
  router,
  element,
  render: h => h(App),
})
