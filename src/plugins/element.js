import Vue from 'vue'
// 按需引入 element-ui 组件 和 message弹框提示组件
import { Form, FormItem, Button, Input, Message } from 'element-ui'
// Message需要进行全局挂载

// 使用插件
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.prototype.$message = Message