
 //hidden: false：隐藏, true：不隐藏

const usersList = () => import('../views/user/user');
const permsList = () => import('../views/perms/perms');
const roleList = () => import('../views/roles/roles');
const logList = () => import('../views/operate/operate');
const layOut = () => import('../layout/layout');
const assetsList = () => import('../views/assets/assets')
const clusterList = () => import('../views/cluster/cluster')

const dynamicRoutes = [
  {
    path: '/perms',
    name: 'permsManage',
    redirect: '/perms/list',
    hidden: false,
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
            hidden: false,
          },
          {
            path:'/perms/delete',
            name: 'permsDel',
            meta: { name: '权限删除'},
            hidden: false,
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
            hidden: false,
          },
          {
            path:'/role/delete',
            name: 'roleDel',
            meta: { name: '角色删除'},
            hidden: false,
          },
          {
            path:'/role/allotperms',
            name: 'roleAllotPerms',
            meta: { name: '分配权限'},
            hidden: false,
          },
          {
            path:'/role/rmperms',
            name: 'roleRmPerms',
            meta: { name: '移除权限'},
            hidden: false,
          },
          {
            path:'/role/userperms',
            name: 'userPerms',
            meta: { name: '用户权限'},
            hidden: false,
          },
          {
            path:'/role/pmenu',
            name: 'rolePmenu',
            meta: { name: '菜单列表'},
            hidden: false,
          },
          {
            path:'/role/rolesname',
            name: 'roleDetail',
            meta: { name: '角色详情'},
            hidden: false,
          },
          {
            path:'/role/roleperms',
            name: 'rolePerms',
            meta: { name: '角色权限'},
            hidden: false,
          },
        ],
      },
    ],
  },
  {
    path: '/user',
    name: 'userManage',
    redirect: '/user/list',
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
            hidden: false,
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
            path:'/user/update-pwd',
            name: 'userUpdatePwd',
            meta: { name: '密码更新'},
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
        redirect: '/log/list',
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
                children: [
                    {
                        path:'/log/get-login-num',
                        name: 'loginCount',
                        meta: { name: '登录日志统计'},
                        hidden: false,
                    },
                    {
                        path:'/log/get-run-linux-cmd-num',
                        name: 'runLinuxCmdCount',
                        meta: { name: 'linux命令执行统计'},
                        hidden: false,
                    },
                    {
                        path:'/log/get-user-login-num',
                        name: 'userLoginCount',
                        meta: { name: '用户登录统计'},
                        hidden: false,
                    },
                ],
            },
        ],
    },
    {
        path: '/cluster',
        name: 'clusterManage',
        redirect: '/cluster/list',
        hidden: false,
        component: layOut,
        meta: {name:'集群管理', icon: 'el-icon-takeaway-box'},
        children: [
            {
                path:'/cluster/list',
                name: 'clusterList',
                hidden: false,
                component: clusterList,
                meta: { title: ['集群管理', '集群列表'], name: '集群列表',  icon: 'el-icon-menu', keepAlive: true },
                children: [
                    {
                        path:'/cluste/add',
                        name: 'clusterAdd',
                        meta: { name: '集群创建'},
                        hidden: false,
                    },
                    {
                      path:'/cluste/update',
                      name: 'clusterUpdate',
                      meta: { name: '集群更新'},
                      hidden: false,
                  },
                    {
                        path:'/cluste/del',
                        name: 'clusterDel',
                        meta: { name: '集群删除'},
                        hidden: false,
                    },
                    {
                      path:'/cluste/join-work',
                      name: 'clusterJoinWork',
                      meta: { name: '工作节点扩容'},
                      hidden: false,
                  },
                  {
                    path:'/cluste/join-master',
                    name: 'clusterJoinManager',
                    meta: { name: '管理节点扩容'},
                    hidden: false,
                  },
                  {
                    path:'/cluste/leave-cluster',
                    name: 'clusterLeave',
                    meta: { name: '集群缩容'},
                    hidden: false,
                  },
                  {
                    path:'/cluster/health-check',
                    name: 'clusterHealthCheck',
                    meta: { name: '集群健康检测'},
                    hidden: false,
                  },
                ],
            },
        ],
    },
  {
    path: '/assets',
    name: 'assetsManage',
    redirect: '/assets/list',
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
            hidden: false,
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
            path:'/assets/program/update/list',
            name: 'updateList',
            meta: { name: '更新列表'},
            hidden: false,
          },
          {
            path: '/assets/program/update/create',
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
            meta: { name: '更新程序2'},
            hidden: false,
          },
          {
            path:'/assets/file/ws',
            name: 'syncFileWs',
            meta: { name: '同步文件'},
            hidden: false,
          },
          {
            path:'/assets/javaupdate',
            name: 'javaupdate',
            meta: { name: '更新java'},
            hidden: false,
          },
          {
            path:'/assets/dockerupdate',
            name: 'dockerupdate',
            meta: { name: '更新docker'},
            hidden: false,
          },
          {
            path:'/assets/dockerreboot',
            name: 'dockerreboot',
            meta: { name: '重启docker'},
            hidden: false,
          },
          {
            path:'/assets/rpcupdate',
            name: 'rpcupdate',
            meta: { name: '更新rpc'},
            hidden: false,
          },
          {
            path:'/assets/rpcboot',
            name: 'rpcboot',
            meta: { name: '重启rpc'},
            hidden: false,
          },
          {
            path:'/assets/javareboot',
            name: 'javareboot',
            meta: { name: '重启java'},
            hidden: false,
          },
          {
            path:'/assets/program/add',
            name: 'program-add',
            meta: { name: '添加程序'},
            hidden: false,
          },
          {
            path:'/assets/program/list',
            name: 'program-list',
            meta: { name: '程序列表'},
            hidden: false,
          },
          {
            path:'/assets/view-system-log',
            name: 'view-system-log',
            meta: { name: '查看系统日志'},
            hidden: false,
          },
          {
            path:'/assets/run-linux-cmd',
            name: 'run-linux-cmd',
            meta: { name: '批量ansible作业'},
            hidden: false,
          },
          {
            path:'/assets/terminal',
            name: 'web-terminal',
            meta: { name: '连接终端'},
            hidden: false,
          },
          {
            path:'/assets/terminal2',
            name: 'web-terminal2',
            meta: { name: '连接终端2'},
            hidden: false,
          },
        ],
      },
    ],
  },
]

export default dynamicRoutes
