
const usersList = () => import('../views/user/user');
const permsList = () => import('../views/perms/perms');
const roleList = () => import('../views/roles/roles');
const logList = () => import('../views/operate/operate');
const layOut = () => import('../layout/layout');
const assetsList = () => import('../views/assets/assets')

const dynamicRoutes = [
  {
    path: '/perms',
    name: 'permsManage',
    redirect: 'list',
    component: layOut,
    meta: {name:'权限管理', icon: 'el-icon-key'},
    children:[
      {
        path:'/perms/list',
        name: 'permsList',
        component: permsList,
        hidden: false,
        meta: { title: ['权限管理', '权限列表'], name: '权限列表',  icon: 'el-icon-menu', keepAlive: true },
        children: [
          {
            path:'/perms/create',
            name: 'permsCreate',
            meta: { name: '权限创建'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/perms/delete',
            name: 'permsDel',
            meta: { name: '权限删除'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
        ],
      },
      {
        path:'/role/list',
        name: 'roleList',
        component: roleList,
        hidden: false,
        meta: { title: ['权限管理', '角色列表'], name: '角色列表',  icon: 'el-icon-menu', keepAlive: true },
        children: [
          {
            path:'/role/create',
            name: 'roleCreate',
            meta: { name: '角色创建'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/role/delete',
            name: 'roleDel',
            meta: { name: '角色删除'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/role/allotperms',
            name: 'roleAllotPerms',
            meta: { name: '分配权限'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/role/rmperms',
            name: 'roleRmPerms',
            meta: { name: '移除权限'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/role/userperms',
            name: 'userPerms',
            meta: { name: '用户权限'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/role/pmenu',
            name: 'rolePmenu',
            meta: { name: '菜单列表'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/role/rolesname',
            name: 'roleDetail',
            meta: { name: '角色详情'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/role/roleperms',
            name: 'rolePerms',
            meta: { name: '角色权限'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
        ],
      },
    ],
  },
  {
    path: '/user',
    name: 'userManage',
    redirect: 'list',
    hidden: false,
    component: layOut,
    meta: {name:'用户管理', icon: 'el-icon-s-custom'},
    children: [
    {
      path:'/user/list',
      name: 'userList',
      hidden: false,
      component: usersList,
      meta: { title: ['用户管理', '用户列表'], name: '用户列表',  icon: 'el-icon-menu', keepAlive: true },
      children: [
          {
            path:'/user/add',
            name: 'userAdd',
            meta: { name: '用户添加'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/user/del',
            name: 'userDel',
            meta: { name: '用户删除'},
            hidden: false,
          },
          {
            path:'/user/update',
            name: 'userUpdate',
            meta: { name: '用户更新'},
            hidden: false,
          },
          {
            path:'/user/get/:id',
            name: 'userGetById',
            meta: { name: '用户详情'},
            hidden: false,
          },
        ],
      },
    ],
  },
  {
    path: '/log',
    name: 'logManage',
    redirect: 'list',
    hidden: false,
    component: layOut,
    meta: {name:'日志管理', icon: 'el-icon-postcard'},
    children: [
    {
      path:'/log/list',
      name: 'logList',
      hidden: false,
      component: logList,
      meta: { title: ['日志管理', '日志列表'], name: '日志列表',  icon: 'el-icon-menu', keepAlive: true },
      },
    ],
  },
  {
    path: '/assets',
    name: 'assetsManage',
    redirect: 'list',
    hidden: false,
    component: layOut,
    meta: { name: '服务器管理', icon: 'el-icon-bangzhu'},
    children: [
    {
      path:'/assets/list',
      name: 'assetsList',
      hidden: false,
        component: assetsList,
      meta: { title: ['服务器管理', '服务器列表'], name: '服务器列表',  icon: 'el-icon-menu', keepAlive: true },
      children: [
          {
            path:'/assets/add',
            name: 'assetsAdd',
            meta: { name: '服务器添加'},
            hidden: false, //按钮级别的权限隐藏,false：不隐藏，true：隐藏
          },
          {
            path:'/assets/del',
            name: 'assetsDel',
            meta: { name: '服务器删除'},
            hidden: false,
          },
          {
            path:'/assets/update',
            name: 'assetsUpdate',
            meta: { name: '服务器更新'},
            hidden: false,
          },
          {
            path:'/assets/process/update/list',
            name: 'updateList',
            meta: { name: '更新列表'},
            hidden: false,
          },
          {
            path: '/assets/process/update/create',
            name: 'updateRecord',
            meta: { name: '更新记录' },
            hidden: false,
          },
          {
            path:'/assets/api',
            name: 'updateProgram',
            meta: { name: '更新程序1'},
            hidden: false,
          },
          {
            path:'/assets/upload',
            name: 'uploadFile',
            meta: { name: '上传文件'},
            hidden: false,
          },
          {
            path:'/assets/ws',
            name: 'assetsWs',
            meta: { name: 'websocket连接'},
            hidden: false,
          },
          {
            path:'/assets/file/ws',
            name: 'syncFileWs',
            meta: { name: '同步文件'},
            hidden: false,
          },
        ],
      },
    ],
  },
]

export default dynamicRoutes
