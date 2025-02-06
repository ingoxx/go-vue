export function isHidden(path, routers=[]) {
    if (routers !== null){
        for (var i=0; i<routers.length; i++) {
            if (routers[i].path === path) {
                return  routers[i].hidden;
            }
            if (routers[i].children != undefined && routers[i].children.length > 0) {
                let hidden = isHidden(path, routers[i].children);
                if (hidden) {
                    return  hidden
                }
            }
        }
    }
}

export function getRouterPath(name, routes) {
    for (const route of routes) {
        if (route.name === name) {
            return route.path;
        }
        if (route.children && route.children.length) {
            const childPath = getRouterPath(name, route.children);
            if (childPath) {
                return childPath;
            }
        }
    }
    return null;
}
