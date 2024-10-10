import router from './index'
import store from "../store/index"

// 当if条件都成立时, next("/index")跳转到index页面, 此时的router.beforeEach并没有结束, 需要调用next()作为跳出出口,否则会发生死循环
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem('token') && sessionStorage.getItem('user') && sessionStorage.getItem('uid')) {
    // 已登录,显示对应用户权限的页面
    if (!store.state.addRouters.permissionList) {
      console.log("verifition >>> do");
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
