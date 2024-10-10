import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store/index"


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { name: '登录' },
    component: () => import('../views/login/login')
  },
  {
    path: '/ga/:user/:qr/:url',
    name: 'ga',
    meta: { name: '谷歌认证登录' },
    component: () => import('../views/login/ga')
  },
  {
    path: '/assets/update/:project/:ip/:name/:uuid',
    name: 'assets-update',
    meta: { name: '查看更新' },
    component: () => import('../views/assets/assetsUpdate')
  },
]

export const showDynamicRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/home'),
    redirect: 'index',
    meta: { requireAuth: true, name: '首页', keepAlive: true },
    children:[
      {
        path: '/index',
        name: 'index',
        component: () => import('../views/index/index'),
        meta: {name: '首页', keepAlive: false },
        hidden: false,
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//全局路由守卫（全局路由守卫会在每次路由地址发生变化时触发）
// 当if条件都成立时, next("/index")跳转到index页面, 此时的router.beforeEach并没有结束, 需要调用next()作为跳出出口,否则会发生死循环
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem('token') && sessionStorage.getItem('user') && sessionStorage.getItem('uid')) {
    // 已登录,显示对应用户权限的页面
    if (!store.state.addRouters.permissionList) {
      store.dispatch("getUserPerms").then(() => {
        next(to.path)
      });
    } else {
      if (to.path !== "/login") {
        next()
      } else {
        next(from.fullPath)
      }
    }
  } else {
    // 这里是判断页面是否需要登录才能访问
    if (to.matched.length > 0 && !to.matched.some(record => record.meta.requireAuth)) {
      next()
    } else {
      next('/login')
    }
  }
});

export default router
