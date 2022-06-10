import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../page/Login'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../page/Login')
// import Home from '../page/Home'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../page/Home')
// import Welcome from '../page/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../page/Welcome')


// import Users from '../page/user/Users'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../page/user/Users')
// import Rights from '../page/power/Rights'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../page/power/Rights')
// import Roles from '../page/power/Roles'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../page/power/Roles')


// import Cate from '../page/goods/Cate'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../page/goods/Cate')
// import Params from '../page/goods/Params'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../page/goods/Params')


// import Goods from '../page/goods/Goods'
const Goods = () => import(/* webpackChunkName: "Goods_Add" */ '../page/goods/Goods')
// import Add from '../page/goods/Add'
const Add = () => import(/* webpackChunkName: "Goods_Add" */ '../page/goods/Add')


// import Order from '../page/order/Order'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../page/order/Order')
// import Report from '../page/report/Report'
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../page/report/Report')


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
                },
                {
                    path: '/home/categories',
                    component: Cate
                },
                {
                    path: '/home/params',
                    component: Params
                },
                {
                    path: '/home/goods',
                    component: Goods,
                },
                {
                    path: '/home/goods/add',
                    component: Add
                },
                {
                    path: '/home/orders',
                    component: Order
                },
                {
                    path: '/home/reports',
                    component: Report
                },
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