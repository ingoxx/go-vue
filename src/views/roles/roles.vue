<template>
    <div class="box">
        <el-card>
            <div class="search">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input clearable size="small" @clear="RolesList()" placeholder="请输入角色名搜索" suffix-icon="el-icon-date" v-model="rolename"></el-input>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="点击搜索" placement="top-start">
                            <el-button size="small" type="primary" icon="el-icon-search" circle @click="RolesList()"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </div>
            <div  class="operate">
                <el-row :gutter="10">
                    <el-col :span="2.5">
                        <el-button size="small" type="primary" icon="el-icon-document-add" @click="clearData" v-if="isHidden('/role/create', permissionList)">添加角色</el-button>
                    </el-col>
                </el-row>
            </div>
            <!-- 数据表格 -->
            <div class="table">
                <el-table v-loading="tableLoad" stripe border :data="roleList" :header-cell-style="{background: '#FAFAFA'}"
                    element-loading-text="拼命加载中"  ref="multipleTable" @row-click="tableRowClick"
                >
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <template v-if="scope.row.mm.length != 0">
                            <el-row :class="['level-bottom', index === 0 ? 'level-top' : '', 'center']" v-for="(item1, index) in scope.row.mm" :key="item1.ID">
                                <!---一级菜单--->
                                <el-col :span="5">
                                    <el-tag closable @close="removeRolePerms(item1.ID, scope.row, 'tag')">{{ item1.title }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!---二级,三级菜单--->
                                <el-col :span="19">
                                    <el-row :class="[index === 0 ? '' : 'level-top']" v-for="(item2, index) in item1.children" :key="item2.ID">
                                        <!---二级菜单--->
                                        <el-col :span="5">
                                            <el-tag closable type="success" @close="removeRolePerms(item2.ID, scope.row, 'tag')">{{ item2.title }}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <!---三级菜单--->
                                        <el-col :span="18">
                                            <el-tag closable type="warning" @close="removeRolePerms(item3.ID, scope.row, 'tag')" v-for="item3 in item2.children" :key="item3.ID">{{ item3.title }}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="ID" label="id"></el-table-column>
                <el-table-column prop="rolename" label="rolename"></el-table-column>
                <el-table-column prop="operate" label="operate" width="226">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" plain @click="showAllotPerms(scope.row)" v-if="isHidden('/role/allotperms', permissionList)">权限分配</el-button>
                        <el-popconfirm :title="'确定删除'+scope.row.name+'吗?'"
                            icon="el-icon-info"
                            icon-color="red"
                            confirm-button-text='删除'
                            @confirm="handleDelete(scope.row)"
                        >
                            <el-button size="mini" type="danger" slot="reference" icon="el-icon-delete-solid" plain v-if="isHidden('/role/delete', permissionList)">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
                </el-table>
            </div>
            <!-- 翻页 -->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :current-page.sync="pages.curPage"
                    :page-size="pages.pageSize"
                    layout="prev, pager, next, total, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </el-card>
        <!-- 添加角色 -->
        <el-dialog
            title="添加角色"
            :visible.sync="centerDialogVisible"
            width="600px"
            :close-on-click-modal="false"
            v-draggable
            center
            >
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名" prop="rolename">
                    <el-input type="text" v-model="ruleForm.rolename" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-popconfirm :title="'确定添加【'+ruleForm.rolename+'】吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='确定'
                                @confirm="submitForm('ruleForm', addRole)"
                            >
                    <el-button type="primary" :loading="addLoad" slot="reference">确 定</el-button>
                </el-popconfirm>
            </span>
        </el-dialog>
        <!-- 权限分配 -->
        <el-dialog
            title="分配权限"
            :visible.sync="allotDialogVisible"
            width="600px"
            :close-on-click-modal="false"
            v-draggable
            center
            >
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名" prop="arolename">
                    <el-input type="text" v-model="arolename" autocomplete="off" disabled></el-input>
                </el-form-item>
            </el-form>
            <!-- 权限树 -->
            <div class="perms-tree">
                <el-tree :data="permsTreeList" :props="permProps" show-checkbox
                   node-key="ID"
                   ref="tree"
                   v-loading="treeLoading"
                   default-expand-all
                   :check-strictly="true"
                   @check="handleRemovePerms"
                   :default-checked-keys="roleHavePerms">
                </el-tree>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-popconfirm :title="'确定给【'+arolename+'】分配选中的权限吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='确定'
                                @confirm="submitForm('ruleForm', allotPermsToRole)"
                        >
                    <el-button type="warning" icon="el-icon-warning" :loading="allotLoad" slot="reference">确定</el-button>
                </el-popconfirm>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getRolesList, removePerms, getPermsTree, allotPerms, getRolePerms, createRole } from '../../api'
import { mapState } from 'vuex'
import { Message } from 'element-ui'

export default {
    name: "roles",
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
    data() {
        var validaterolename = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入角色名'));
            } else {
                callback();
            }
        };
        return {
            roleHavePerms:[],
            roleList: [],
            multipleSelection: [],
            rolePermsList: {},
            roleId: [],
            permsTreeList:[],
            routers:[],
            rolename: "",
            arolename:"",
            arid:"",
            centerDialogVisible: false,
            allotDialogVisible: false,
            treeLoading: false,
            tableLoad: true,
            allotLoad: false,
            removeLoad: false,
            addLoad:false,
            total:0,
            permProps: {
                children: 'children',
                label: 'title'
            },
            pages: {
                curPage:1,
                pageSize:5,
            },
            ruleForm: {
                rolename:'',
            },
            rules: {
                rolename: [
                        { validator: validaterolename, trigger: 'blur' }
                    ],
            },
        }
    },
    computed: {
        ...mapState({
            'permissionList': state => state.addRouters.permissionList,
        })
    },
    methods:{
        tableRowClick(row, column, event) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        async RolesList() {
            this.tableLoad = true;
            const resp = await getRolesList({
                rolename: this.rolename,
                page: this.pages.curPage,
            }).catch(err => {
                this.tableLoad = false;
            })

            if (resp.data.code !== 10000) {
                this.tableLoad = false;
                return Message.error(resp.data.message);
            }

            this.roleList = resp.data.data;
            this.pages.pageSize = resp.data.pageSize;
            this.total = resp.data.total;
            this.tableLoad = false;
        },
        async addRole() {
            this.addLoad = true;
            var params = new URLSearchParams();
            params.append('rolename', this.ruleForm.rolename);
            await createRole(params, this.RolesList).catch(err => {
                this.addLoad = false;
            });

            if (resp.data.code !== 10000) {
                this.addLoad = false;
                this.centerDialogVisible = false;
                return Message.error(resp.data.message);
            }

            this.addLoad = false;
            this.centerDialogVisible = false;
            return Message.success(resp.data.message);
        },
        async removeRolePerms(pid , row, action) {
            var pidlist = [], data = "", rid = "", rolename = "";
            switch (action) {
                case "tag":
                    pidlist.push(pid);
                    rid = row.ID;
                    rolename = row.rolename;
                    break
                case "button":
                    this.removeLoad = true;
                    if (this.roleHavePerms === null ) {
                        pidlist.push(0);
                    } else {
                        pidlist = this.roleHavePerms;
                    }
                    rid = this.arid;
                    rolename = this.arolename;
            }
            data = JSON.stringify({pid: pidlist, rid, rolename});
            const resp = await removePerms(data, this.callMethod)

            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message);
            }

            if (action == "tag") {
                row.mm = resp.data.data;
            }

            return Message.success(resp.data.message);
        },
        async allotPermsToRole() {
            // await this.removeRolePerms("", "", "button");
            this.allotLoad = true;
            let pidlist = this.$refs.tree.getCheckedKeys();
            let data = "";
            data = JSON.stringify({pid: pidlist, rid: this.arid, rolename: this.arolename});
            const resp = await allotPerms(data, this.callMethod).catch(err => {
                this.allotLoad = false;
            });

            if (resp.data.code !== 10000) {
                this.allotLoad = false;
                return Message.error(resp.data.message);
            }

            this.allotLoad = false;
            return Message.success(resp.data.message);
        },
        async permsTree(rid) {
            const resp = await getPermsTree({all: 11}).catch(err => {
                this.treeLoading = false;
            });

            if (resp.data.code !== 10000) {
                this.treeLoading = false;
                return Message.error(resp.data.message);
            }

            this.permsTreeList = resp.data.data;
            this.RolePerms(rid);
            this.treeLoading = false;
        },
        async RolePerms(rid) {
            const resp = await getRolePerms({ rid });

            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message);
            }

            this.roleHavePerms = resp.data.pidList;
        },
        showAllotPerms(row) {
            this.treeLoading = true;
            this.roleHavePerms = [];
            this.allotDialogVisible = true;
            this.arolename = row.rolename;
            this.arid = row.ID;
            this.permsTree(row.ID);
        },
        submitForm(formName, method) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    method.call();
                } else {
                    return false;
                }
            });
        },
        handleRemovePerms(data, cur) {
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        clearData() {
            this.centerDialogVisible = true;
            this.ruleForm.rolename = "";
        },
        handleCurrentChange(val) {
            this.pages.curPage = val;
            this.RolesList();
        },
        isHidden(path, routers=[]) {
            if (routers !== null){
                for (var i=0; i<routers.length; i++) {
                if (routers[i].path === path) {
                    return  routers[i].hidden;
                }
                if (routers[i].children != undefined && routers[i].children.length > 0) {
                    let hidden = this.isHidden(path, routers[i].children);
                    if (hidden) {
                        return  hidden
                    }
                }
                }
            }
        },
        callMethod() {},
    },
    mounted() {
        this.RolesList();
    },
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/roles.css';
</style> -->

<style lang="scss" scoped>
.box{
    margin: 10px auto;
}
.search {
    height: 42px;
    line-height: 42px;
    margin: 10px auto 10px auto;
}
.operate {
    margin: 9px auto 9px auto;
}
.table{
    margin-top: 30px;
    margin-bottom: 15px;
}
.el-table .warning-row {
    background: oldlace;
  }

.el-table .success-row {
    background: #f0f9eb;
}
.demo-ruleForm {
    margin: auto;
}
.cell button {
    margin-right: 7px;
}
.el-select {
    float: left;
}
.el-popover__reference-wrapper button  {
    margin-left: 20px;
}
:deep .el-form-item__content {
    width: 292px;
    margin: 0 auto !important;
}
:deep .el-form-item__label {
    padding: 0;
}
.level-top {
  border-top: 1px solid #eee;
}
.level-bottom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
.perms-tree {
    margin: 0 auto;
    text-align: center;
}
// ::-webkit-scrollbar {
//   display: none;
// }
:deep .el-tree {
    height: 550px;
    overflow-y: auto;
    margin-left: 49px;
    background-color: #f9f9f9;
}
.el-tree::-webkit-scrollbar {
  width: 6px!important; /* 设置滚动条宽度 */
}

.el-tree::-webkit-scrollbar-track {
  background-color: #f9f9f9!important; /* 设置滚动条背景颜色 */
}

.el-tree::-webkit-scrollbar-thumb {
  background-color: #cecece!important; /* 设置滚动条滑块颜色 */
  border-radius: 5px; /* 设置滑块的圆角 */
}

.el-tree::-webkit-scrollbar-thumb:hover {
  background-color: #bdbdbd!important; /* 设置滚动条滑块悬停时的颜色 */
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
    // height: 50px !important;
    background-color: #f9f9f9;
}
:deep .el-dialog--center .el-dialog__footer {
    background-color: #f9f9f9;
}
:deep .el-table tr {
    cursor: pointer;
}
</style>
