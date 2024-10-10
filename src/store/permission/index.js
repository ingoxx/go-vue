import { getUserPerms } from '../../api'
import router, { showDynamicRoutes } from '../../router/index'
import dynamicRouter from '../../router/dynamicRouter'
import clearRoutes from '../../router/clearUserRoutes'
import { getRouter } from '../../utils/getRouter'
import { Message } from 'element-ui'
import createPersistedState from 'vuex-persistedstate'


const addRouters = {
    namespace: true,
    state:{
        permissionList: null,
        permsLoad:true,
    },
    getters: {},
    mutations:{
        SET_PERMISSION(state, routes) {
            state.permissionList = routes;
        },
        CHANGE_PERM_LOAD(state, status) {
            state.permsLoad = status;
        },
        CLEAR_PERMISSION(state, data) {
            state.permissionList = data;
        },
    },
    actions:{
        async getUserPerms(state) {
            const permissionList = await getUserPerms({"uid": sessionStorage.getItem("uid")})
            if (permissionList == null || permissionList.data.data.lenght === 0) {
                return Message.error("数据获取失败");
            }
            
            state.commit('CHANGE_PERM_LOAD', false);
            let showRoutes = getRouter(permissionList.data.data, dynamicRouter);
            // 获取首页路由,首页默认所有已经登录的用户都可以访问
            let main = showDynamicRoutes.find(v => v.path === '/');
            // 获取首页下的子路由
            let children = main.children;
            // 将上面对比的路由结果添加到首页的子路由下
            children.push(...showRoutes);
            // 添加对比过后的路由
            for (let i = 0;i < showDynamicRoutes.length;i++) {
                let r = showDynamicRoutes[i];
                router.addRoute(r)
            }
            // router.addRoutes(showDynamicRoutes);
            // mutations修改不同用户所拥有的路由访问权限
            state.commit('SET_PERMISSION', showRoutes);
        },
    },
}

export default addRouters