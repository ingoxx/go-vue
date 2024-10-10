<template>
    <div class="box">
        <el-container class="home" v-loading="permsLoad">
            <el-aside >
                <el-menu
                    :default-active="editableTabsValue"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    :router="true"
                    :collapse="isCollapse"
                    :collapse-transition="true"
                    background-color="#1f211f"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item index="/" @click.native="TabsHome('/')">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <!-- 菜单 -->
                    <el-submenu v-for="(item1, index1) in permissionList" :key="index1" :index="item1.path">
                        <template slot="title">
                            <i :class="item1.meta.icon"></i>
                            <span slot="title">{{ item1.meta.name }}</span>
                        </template>
                        <template v-if="item1.children && item1.children.length > 0">
                            <template v-for="(item2, index2) in item1.children">
                                <el-menu-item  v-if="item2.hidden"
                                            :key="index2"
                                            :index="item2.path"
                                            :is="'el-menu-item'"
                                            @click.native="addTabs(item2.meta.name, item2.path)"
                                >
                                    <i :class="item2.meta.icon"></i>{{ item2.meta.name }}
                                </el-menu-item>
                            </template>
                        </template>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <el-tag size="mini" class="switch1" type="success" v-if="isCollapse"  @click="toggleHandle">展开<i class="el-icon-caret-right"></i></el-tag>
                    <el-tag size="mini" class="switch1" type="warning" v-else @click="toggleHandle"><i class="el-icon-caret-left"></i>折叠</el-tag>
                    <el-breadcrumb separator="/" class="c-el-bread">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(item, index) in this.$route.meta.title" :key="index">{{ item }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon008-saving"></use>
                            </svg>
                            {{ user }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-user" @click.native="userCenterActive('user')">个人中心</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-key" @click.native="userCenterActive('pwd')">密码修改</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-lock" @click.native="logout()">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>
                <el-tabs v-model="editableTabsValue" type="card" @tab-click="tabChange" @tab-remove="removeTab">
                    <el-tab-pane label="首页" name="/" :closable="false" :lazy="true"></el-tab-pane>
                    <el-tab-pane
                        :closable="true"
                        v-for="item in editableTabs"
                        :key="item.path"
                        :label="item.title"
                        :name="item.path"
                    >
                    </el-tab-pane>
                </el-tabs>
                <el-main>
                    <vue-page-transition name="fade-in-right">
                        <keep-alive>
                            <router-view v-if="this.$route.meta.keepAlive"></router-view>
                        </keep-alive>
                    </vue-page-transition>
                    <router-view v-if="!this.$route.meta.keepAlive"></router-view>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog
            class="dialog-h"
            title="个人中心"
            :visible.sync="userCenterDialogVisible"
            width="800px"
            center
            ref="dia"
            :close-on-click-modal="false"
            v-draggable
            @close="handlediaclose"
            >
            <!-- 用户详情及密码修改 -->
            <userCenter :active="activeTabName" v-if="userCenterDialogVisible"></userCenter>
        </el-dialog>
    </div>
    
</template>

<script>
import { logout } from '../../api'
import { mapState } from 'vuex'
import store from '../../store/index'
import  userCenter  from '../user/userCenter'

export default {
    name:"home",
    directives: {
        draggable: {
            bind(el, binding, vnode) {
                el.style.position = 'fixed';
                el.style.zIndex = 1000;

                el.dragging = false;
                el.startX = 0;
                el.startY = 0;
                el.left = 0;
                el.top = 0;

                el.addEventListener('mousedown', function (event) {
                    el.dragging = true;
                    el.startX = event.clientX;
                    el.startY = event.clientY;

                    const rect = el.getBoundingClientRect();
                    el.left = rect.left;
                    el.top = rect.top;

                    document.addEventListener('mousemove', mouseMove);
                    document.addEventListener('mouseup', mouseUp);
                });

                function mouseMove(event) {
                    if (el.dragging) {
                        const left = event.clientX - el.startX + el.left;
                        const top = event.clientY - el.startY + el.top;
                        el.style.left = `${left}px`;
                        el.style.top = `${top}px`;
                    }
                }

                function mouseUp() {
                    if (el.dragging) {
                        el.dragging = false;
                        document.removeEventListener('mousemove', mouseMove);
                        document.removeEventListener('mouseup', mouseUp);
                    }
                }
            },
        },
    },
    data () {
        return {
            isCollapse: true,
            userCenterDialogVisible: false,
            pwdDialogVisible: false,
            editableTabs: [],
            editableTabsValue: '',
            activeName: 'second',
            user: '',
            activeTabName:"",
        }
    },
    components: {
        userCenter,
    },
    computed: {
        ...mapState({
            'permissionList': state => state.addRouters.permissionList,
            'permsLoad': state => state.addRouters.permsLoad,
            'menuList': state => state.menuTabs.menuTabList,
        })
    },
    watch: {
        active(val) {
            this.activeTabName = val;
        },
    },
    methods: {
        async logout() {
            var params = new URLSearchParams();
            params.append('user', this.user);
            await logout(params, sessionStorage.getItem("user"), this.callMethod);
            sessionStorage.clear();
            store.commit('CLEAR_PERMISSION', null);
            location.reload();
            // this.$router.replace('/login').catch((err) => err);
        },
        addTabs (title, path) {
            let data = {title, path};
            let tabs = this.editableTabs.filter(item => item.title === data.title);
            if (tabs.length === 0) {
                this.editableTabs.push(data);
            }
            this.editableTabsValue = data.path;
            store.commit('UPDATE_TABS', this.editableTabs);
        },
        removeTab (targetName) {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.path === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.path;
                        } else {
                            activeName = '/';
                        }
                    }
                });
            }
            this.editableTabsValue = activeName;
            this.editableTabs = tabs.filter(tab => tab.path !== targetName);
            this.$router.replace(this.editableTabsValue,
                onComplete => {},
                onAbort => {}
            );
            store.commit('UPDATE_TABS', this.editableTabs);
        },
        tabChange(tab) {
            this.$router.replace(tab.name,
                onComplete => {},
                onAbort => {}
            )
        },
        TabsHome (path) {
            this.editableTabsValue = path
        },
        toggleHandle() {
            this.isCollapse = !this.isCollapse
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        handlediaclose() {
            this.userCenterDialogVisible = false;
        },
        toggleHandle () {
            this.isCollapse = !this.isCollapse
        },
        userCenterActive(active) {
            this.userCenterDialogVisible = true;
            this.activeTabName = active;
        },
        callMethod() {},
    },
    beforeMount() {
        store.dispatch("GetUserDetail");
    },
    mounted () {
        if (this.$route.meta.name !== '首页') {
            this.editableTabs.push({
                title: this.$route.meta.name,
                path: this.$route.path
            });
        }
        let tl = window.sessionStorage.getItem('menuTabList');
        //this.editableTabsValue = this.$route.path;
        if (tl && tl.length > 0) {
            this.editableTabs = JSON.parse(tl);
            this.editableTabsValue = this.$route.path;
        } else {
            this.editableTabsValue = this.$route.path;
        }
        
        this.user = window.sessionStorage.getItem('user');
    },
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/home.css';
</style> -->

<style lang="scss" scoped>
.box {
    height: 100%;
  }
:deep .boxc {
    height: 342px;
}
.home {
    height: 100%;
}
.user {
    float: right;
}
:deep .el-dropdown {
    color: #fff;
}
:deep .el-menu-vertical-demo {
    height: 100%;
}
:deep .el-menu {
text-align: left;
}
.el-header {
    line-height: 60px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.el-header > * {
    display: block;
    float: left;
}
.el-footer {
    // background-color: rgb(48, 65, 86);
    color: #fff;
    text-align: left;
    line-height: 60px;
}
.el-aside {
  background-color: #545c64;
  text-align: left;
  overflow-y: auto;
  overflow-x: hidden;
  width: auto!important;
}

.el-main {
    overflow: hidden;
    overflow-y: auto;
}
.el-main::-webkit-scrollbar {
  width: 10px!important; /* 设置滚动条宽度 */
}

.el-main::-webkit-scrollbar-track {
  background-color: #f9f9f9!important; /* 设置滚动条背景颜色 */
}

.el-main::-webkit-scrollbar-thumb {
  background-color: #cecece!important; /* 设置滚动条滑块颜色 */
  border-radius: 5px; /* 设置滑块的圆角 */
}

.el-main::-webkit-scrollbar-thumb:hover {
  background-color: #bdbdbd!important; /* 设置滚动条滑块悬停时的颜色 */
}
body > .el-container {
    margin-bottom: 40px;
}
:deep .el-container {
    overflow: hidden;
    overflow-y: auto;
}
:deep .el-submenu .el-menu-item {
    min-width: 199px;
}
:deep .el-breadcrumb {
  line-height: 60px;
  padding: 0 20px;
}
:deep .el-tabs__item.is-active {
  background-color: #42b983;
  border-color: #42b983;
  color: #fff;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.el-icon-caret-left, .el-icon-caret-right {
    line-height: 20px;
}
:deep .el-tag--mini {
    line-height: 20px;
}
.switch1 {
    cursor: pointer;
    margin-top: 20px;
}
.drop-min-width {
  min-width: 98px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.el-dropdown {
  float: right;
  margin: 0 10px;
  font-size: 16px;
}
:deep .el-dialog--center {
    cursor: move;
}
:deep .el-dialog__header {
    background-color: rgb(48, 65, 86);
    padding: 16px 20px 16px;
}
:deep .el-dialog__title {
    color: #fff;
    font-size: 16px;
}
:deep .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
}
:deep .el-dialog__headerbtn .el-dialog__close:hover {
    color: rgb(187, 160, 102);
}
:deep .el-dialog__body {
    // height: 340px;
    background-color: #f9f9f9;
}
.el-dropdown-menu .el-popper {
    min-width: 117px;
}
.icon {
  position: relative;
  height: 38px;
  width: 38px;
  margin: 0 8px;
  top: 12px;
  background-color: #00BCD4;
  border-radius: 50%;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>