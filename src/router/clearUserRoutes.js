const clearRoutes = [
    {
        path: '/index',
        name: 'index',
        component: () => import('../views/index/index'),
        meta: {name: '首页', keepAlive: false },
        hidden: false,
    },
]

export default clearRoutes