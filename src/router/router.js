import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../page/Login'
import Home from '../page/Home'
import Welcome from '../page/Welcome'
import Users from '../page/user/Users'
import Rights from '../page/power/Rights'
import Roles from '../page/power/Roles'

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
            component: Home,
            redirect: '/home/welcome',  // 进入home页面时重定向到 /welcome欢迎页面
            children: [
                {
                    path: '/home/welcome',
                    component: Welcome
                },
                {
                    path: '/home/users',
                    component: Users
                },
                {
                    path: '/home/rights',
                    component: Rights
                },
                {
                    path: '/home/roles',
                    component: Roles
                }
            ]
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