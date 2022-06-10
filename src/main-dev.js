import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router/router'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入 nprogress 包对应的JS 和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入 element 
import './plugins/element.js'
import axios from 'axios'


// 在 request拦截器中,展示 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  // console.log(config);
  config.headers.Authorization = sessionStorage.getItem('token')
  return config //在最后,必须return config
})
// 在 response拦截器中,展示 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 将富文本编辑器注册为 全局可用的组件
Vue.use(VueQuillEditor)

// 格式化时间过滤器
Vue.filter('dateFormat', function (originVal) {
  originVal = originVal * 1000
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getMonth() + '').padStart(2, '0')
  const mm = (dt.getMonth() + '').padStart(2, '0')
  const ss = (dt.getMonth() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  el: "#app",
  router,
  render: h => h(App),
})
