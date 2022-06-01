import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/', // 重定向: 如果访问的路径是/,则自动跳转到 /login url
            redirect: '/login'  // redirect  重定向路径
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home
        }
    ]
})

// 挂载全局前置路由守卫
router.beforeEach((to, from, next) => {
    // to 将要跳转的路径
    // from 从哪个路径跳转而来
    // next 是一个函数,表示放行
    // next() 直接放行  next('/login') 强制跳转
    if (to.path === '/login') return next()
    const tokenStr = sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')  // 如果用户没有token值,则不允许访问守卫的页面,强制跳转到 登录login 页面
    next()
})

export default router