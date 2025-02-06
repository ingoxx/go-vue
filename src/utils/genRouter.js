/**
 * 递归匹配用户权限，并设置 hidden
 * @param {Array} userRouter - 后端返回的权限列表
 * @param {Array} allRoutes - 前端所有路由
 * @returns {Array} - 处理后的前端路由
 */

export function getRouter(userRouter = [], allRoutes = []) {
    if (!userRouter.length) return allRoutes;

    let userMap = new Map();
    function buildUserMap(routes) {
        routes.forEach(route => {
            userMap.set(route.title, route);
            if (route.children && route.children.length > 0) {
                buildUserMap(route.children);
            }
        });
    }
    buildUserMap(userRouter);

    function processRoutes(routes) {
        return routes.map(route => {
            let updatedRoute = { ...route };
            let isMatched = userMap.has(route.meta.name); 
            updatedRoute.hidden = isMatched;
            if (updatedRoute.children && updatedRoute.children.length > 0) {
                updatedRoute.children = processRoutes(updatedRoute.children);
            }

            return updatedRoute;
        });
    }

    return processRoutes(allRoutes);
}
