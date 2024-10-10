<template>
    <div class="box">
        <el-card>
            <div class="operate">
                <el-row :gutter="10">
                    <el-col :span="2.5">
                        <el-button size="small" type="primary" icon="el-icon-document-add" @click="clearData" v-if="isHidden('/perms/create', permissionList)">创建菜单</el-button>
                    </el-col>
                    <el-col :span="1.9">
                        <el-popconfirm :title="'确定删除id为【 '+multipleSelection.map(item=>item.ID)+' 】吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='删除'
                                @confirm="handleMutilDelete()"
                                ref="fs"
                            >
                                <el-button v-if="isHidden('/perms/delete', permissionList)" size="small" type="danger" slot="reference" :loading="delLoad" icon="el-icon-delete-solid" >删除</el-button>
                        </el-popconfirm>
                    </el-col>
                </el-row>
            </div>
            <div class="table">
                <el-table v-loading="tableLoad" stripe  :data="permsList" @selection-change="handleSelectionChange"
                        element-loading-text="拼命加载中" ref="multipleTable" @row-click="tableRowClick"
                    >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="ID" label="id"></el-table-column>
                    <el-table-column prop="title" label="title" ></el-table-column>
                    <el-table-column prop="path" label="path" ></el-table-column>
                    <el-table-column prop="level" label="level" >
                        <template slot-scope="scope">
                            <el-tag size="small" type="success" v-if="scope.row.level == 1">一级菜单</el-tag>
                            <el-tag size="small" type="warning" v-else-if="scope.row.level == 2">二级菜单</el-tag>
                            <el-tag size="small" type="danger" v-else-if="scope.row.level == 3">三级菜单</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
        <el-dialog
            title="添加菜单"
            :visible.sync="centerDialogVisible"
            width="500px"
            :close-on-click-modal="false"
            v-draggable
            center
            >
            <el-form :model="ruleForm" status-icon label-position="right" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="路径" prop="path">
                    <el-input type="name" v-model="ruleForm.path" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="菜单名" prop="title">
                    <el-input type="name" v-model="ruleForm.title" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="父id" prop="parentId">
                    <el-input type="name" v-model="ruleForm.parentId" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="菜单等级" prop="level">
                    <el-input type="number" v-model="ruleForm.level" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-popconfirm :title="'确定添加【'+ruleForm.title+'】吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='确定'
                                @confirm="submitForm('ruleForm', CreatePermsMenu)"
                            >
                    <el-button type="primary" :loading="addLoad" slot="reference">确 定</el-button>
                </el-popconfirm>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import { getPermsList, createPerms, delPerms } from '../../api'
import { mapState } from 'vuex'

export default {
    name:"permsList",
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
        var validatepath = (rule, value, callback) => {
            if (!value) {
                callback(new Error('菜单路径不能为空'));
            } else {
                callback();
            }
        };
        var validatetitle= (rule, value, callback) => {
            if (!value) {
                callback(new Error('菜单名不能为空'));
            } else {
                callback();
            }
        };
        var validatelevel = (rule, value, callback) => {
            if (!value) {
                callback(new Error('菜单等级不能为空'));
            } else {
                callback();
            }
        };
        return {
            permsList: [],
            multipleSelection:[],
            tableLoad:true,
            addLoad: false,
            delLoad: false,
            centerDialogVisible: false,
            total:0,
            pages: {
                curPage:1,
                pageSize:5,
            },
            ruleForm:{
                path:"",
                title:"",
                parentId:0,
                level:"",
            },
            rules: {
                path:[
                    { validator: validatepath, trigger: 'blur' }
                ],
                title:[
                    { validator: validatetitle, trigger: 'blur' }
                ],
                level:[
                    { validator: validatelevel, trigger: 'blur' }
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
        async PermsList() {
            this.tableLoad = true;
            const resp = await getPermsList({
                page:this.pages.curPage,
            });

            if (resp.data.code !== 10000) {
                this.tableLoad = false;
                return Message.error(resp.data.message)
            }

            this.permsList = resp.data.data; //用户列表
            this.total = resp.data.total; //用户总数
            this.pages.pageSize = resp.data.pageSize; //一页显示的数据
            this.tableLoad = false;
        },
        async CreatePermsMenu() {
            this.addLoad = true;
            var params = new URLSearchParams();
            params.append('path', this.ruleForm.path);
            params.append('title', this.ruleForm.title);
            params.append('parentid', this.ruleForm.parentId);
            params.append('level', this.ruleForm.level);
            //添加删除更新重新刷新表格数据回到第一页
            this.pages.curPage = 1;
            const resp = await createPerms(params, this.PermsList);

            if (resp.data.code !== 10000) {
                this.addLoad = false;
                this.centerDialogVisible =  false;
                return Message.error(resp.data.message)
            }

            this.addLoad = false;
            this.centerDialogVisible =  false;
            return Message.success(resp.data.message);
        },
        async DelPerms() {
            this.delLoad = true;
            var data = "";
            if (this.multipleSelection.length === 0) {
                this.delLoad = false;
                return Message.error("请先勾选需要删除的权限id")
            }
            data = JSON.stringify({pid: this.multipleSelection.map(item => item.ID),});
            this.pages.curPage = 1; //添加删除重新刷新表格数据回到第一页
            const resp = await delPerms(data, this.PermsList)

            if (resp.data.code !== 10000) {
                this.delLoad = false;
                return Message.error(resp.data.message)
            }

            this.delLoad = false;
            return Message.success(resp.data.message);
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
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleCurrentChange(val) {
            this.pages.curPage = val;
            this.PermsList();
        },
        handleMutilDelete() {
            this.DelPerms();
        },
        clearData() {
            this.centerDialogVisible = true;
            this.ruleForm.path = "";
            this.ruleForm.title = "";
            this.ruleForm.level = "";
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
    },
    mounted () {
        this.PermsList();
    },
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/perms.css';
</style> -->

<style lang="scss" scoped>
.box{
    margin: 10px auto;
}
.box .operate {
    height: 42px;
    line-height: 42px;
    margin: 10px auto 10px auto;
}
.box .table{
    margin-bottom: 15px;
}
.el-popover__reference-wrapper button  {
    margin-left: 20px;
}
:deep .el-form-item__content {
    width: 292px;
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
    // height: 238px !important;
    background-color: #f9f9f9;
}
:deep .el-dialog--center {
    cursor: move;
}
:deep .el-dialog--center .el-dialog__footer {
    background-color: #f9f9f9;
}
:deep .el-table tr {
    cursor: pointer;
}
</style>