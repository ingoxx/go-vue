<template>
    <div class="box">
        <el-card>
            <div class="search">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input clearable size="small" @keyup.enter.native="getClusterListMth('search')" @clear="getClusterListMth('search')" placeholder="集群名称" suffix-icon="el-icon-date" v-model="clusterName"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input clearable size="small" @keyup.enter.native="getClusterListMth('search')" @clear="getClusterListMth('search')" placeholder="集群ID" suffix-icon="el-icon-date" v-model="clusterCid"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input clearable size="small" @keyup.enter.native="getClusterListMth('search')" @clear="getClusterListMth('search')" placeholder="集群区域" suffix-icon="el-icon-date" v-model="clusterRegion"></el-input>
                    </el-col>
                    <el-col :span="1" class="col-el">
                        <el-tooltip class="item" effect="dark" content="点击搜索" placement="top-start">
                            <el-button size="small" type="primary" icon="el-icon-search" circle @click="getClusterListMth('search')"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </div>
            <div class="operate">
                <el-row :gutter="10">
                    <el-col :span="1"  class="col-1">
                        <el-button size="small" type="primary" icon="el-icon-document-add" @click="openDialog('add')" v-if="isHidden(getRouterPath('clusterAdd', permissionList), permissionList)">创建集群</el-button>
                    </el-col>
                    <el-col :span="2" class="col-2">
                        <el-button size="small" type="danger" icon="el-icon-delete" v-if="isHidden(getRouterPath('clusterDel', permissionList), permissionList)" @click="handleDeleteCluster(null, 'mul')">批量删除集群</el-button>
                    </el-col>
                </el-row>
            </div>
            <!-- 集群列表 -->
            <div class="table">
                <el-table v-loading="tableLoad" stripe  :data="clusterListData" @selection-change="handleSelectionChange"
                        element-loading-text="拼命加载中"
                    >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="id"></el-table-column>
                    <el-table-column prop="name" label="name" ></el-table-column>
                    <el-table-column prop="cluster_cid" label="cluster_id" width="210"></el-table-column>
                    <el-table-column prop="region" label="region" ></el-table-column>
                    <el-table-column prop="status" label="status" >
                        <template slot-scope="scope">
                            <el-link type="danger" :underline="false"  size="mini" plain v-if="scope.row.status === 100">异常</el-link>
                            <el-link type="success" :underline="false"  size="mini" plain v-else-if="scope.row.status === 200">正常</el-link>
                            <el-link type="warning" :underline="false"  size="mini" plain v-else>未知状态</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" label="change_time" >
                        <template slot-scope="scope">
                            <el-tag size="small" type="success">{{ scope.row.date | formatDate}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="operate" width="200">
                        <template slot-scope="scope">
                            <!-- <el-button size="mini" @click="editUserData(scope.row)" icon="el-icon-edit" v-if="isHidden(getRouterPath('userUpdate', permissionList), permissionList)">编辑</el-button>
                            <el-popconfirm :title="'确定删除'+scope.row.name+'吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='删除'
                                @confirm="handleDelete(scope.row)"
                            > -->
                                
                            <!-- </el-popconfirm> -->
                            <el-button size="mini" type="danger" slot="reference" icon="el-icon-delete-solid" plain v-if="isHidden(getRouterPath('userDel', permissionList), permissionList)" @click="handleDeleteCluster(scope.row, 'sig')">删除</el-button>
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
    <!-- 创建集群 -->
    <div>
        <el-dialog
            title="创建集群"
            :visible.sync="createClusterDialogVisible"
            width="500px"
            :close-on-click-modal="false"
            v-draggable
            center
            >
            <el-form :model="ruleForm" status-icon label-position="right" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="集群名称" prop="name">
                    <el-input type="name" v-model="ruleForm.name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="集群ID" prop="name">
                    <el-input type="name" v-model="ruleForm.cluster_cid" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="集群区域" prop="region">
                    <el-input type="name" v-model="ruleForm.region" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-popconfirm :title="'确定添加【'+ruleForm.name+'】吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='确定'
                                @confirm="submitForm('ruleForm', createClusterMth)"
                            >
                    <el-button type="primary" :loading="createClusterLoading" slot="reference">确 定</el-button>
                </el-popconfirm>
            </span>
        </el-dialog>
    </div>
    </div>
</template>

<script>
import { createCluster, getClusterList, delCluster } from '../../api';
import { Message } from 'element-ui';
import { isHidden, getRouterPath } from '@/utils/utils';
import { mapState } from 'vuex';
import { MessageBox } from 'element-ui';

export default {
    name:"cluster",
    data() {
        var validatename = (rule, value, callback) => {
            if (!value) {
                callback(new Error('集群名称不能为空'));
            } else {
                callback();
            }
        };
        var validateregion= (rule, value, callback) => {
            if (!value) {
                callback(new Error('集群区域不能为空'));
            } else {
                callback();
            }
        };
        var validateclusterid= (rule, value, callback) => {
            if (!value) {
                callback(new Error('集群ID不能为空'));
            } else {
                callback();
            }
        };
        return {
            multipleSelection: [],
            createClusterLoading: false,
            createClusterDialogVisible: false,
            clusterListData: [],
            datetime:"",
            clusterName:"",
            clusterCid:"",
            clusterRegion:"",
            tableLoad: true,
            pages: {
                curPage:1,
                pageSize:5,
            },
            total:0,
            ruleForm:{
                name:"",
                region:"",
                cluster_cid:"",
            },
            rules: {
                name:[
                    { validator: validatename, trigger: 'blur' }
                ],
                region:[
                    { validator: validateregion, trigger: 'blur' }
                ],
                cluster_cid:[
                    { validator: validateclusterid, trigger: 'blur' }
                ],
            },
        }
    },
    computed: {
        ...mapState({
            'permissionList': state => state.addRouters.permissionList,
        }),
    },
    methods: {
        isHidden,
        getRouterPath,
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleDeleteCluster(data, model) {
            if (model == 'sig') {
                MessageBox.confirm(`确定删除集群【${data.name}】吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let cids = [];
                    cids.push(data.id);
                    this.deleteClusterMth(cids);
                }).catch((err) => {     
                });
            } else if (model == 'mul') {
                if (this.multipleSelection.length == 0) {
                    return Message.error("请勾选需要删除的集群");
                }
                MessageBox.confirm(`确定删除集群【${this.multipleSelection.map(item => item.name)}】吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let cids = this.multipleSelection.map(item => item.id);
                    this.deleteClusterMth(cids);
                }).catch((err) => {     
                });
            }
            
        },
        deleteClusterMth(cids) {

        },
        async createClusterMth() {
            this.createClusterLoading = true;
            const resp = await createCluster({
                name: this.ruleForm.name, 
                region: this.ruleForm.region, 
                cluster_cid: this.ruleForm.cluster_cid}, 
                this.methodCall);
            if (resp.data && resp.data.code !== 10000) {
                this.createClusterLoading = false;
                this.createClusterDialogVisible = true;
                return Message.error(resp.data.message);
            }
            this.getClusterListMth("page");
            this.createClusterDialogVisible = true;
            this.createClusterLoading = false;

        },
        async getClusterListMth(mode) {
            this.tableLoad = true;
            var pageNum = 0;
            switch (mode) {
                case "page":
                    pageNum = this.pages.curPage;
                    break
                case "search":
                    pageNum = 1;
                    break
            }
            
            const resp = await getClusterList({
                page: pageNum,
                name: this.clusterName,
                cluster_cid: this.clusterCid,
                region: this.clusterRegion,
            }).catch(err => this.tableLoad = false); 
            if (resp.data && resp.data.code !== 10000) {
                this.tableLoad = false;
                return Message.error(resp.data.message)
            }

            this.pages.curPage = pageNum;
            this.clusterListData = resp.data.data;
            this.total = resp.data.total;
            this.pages.pageSize = resp.data.pageSize;
            this.tableLoad = false;
        },
        openDialog(name) {
            if (name == "add") {
                this.createClusterDialogVisible = true;
            }
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
        handleCurrentChange(val) {
            this.pages.curPage = val;
            this.getClusterListMth("page");
        },
        handleDatetime() {
            console.log(this.datetime);
        },
        methodCall() {

        },
    },
    mounted () {
        this.getClusterListMth("page");
    },
    filters: {
        formatDate(date) {
            var d = date ? new Date(date) : new Date();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var hours = d.getHours();
            var min = d.getMinutes();
            var seconds = d.getSeconds();
            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;
            if (hours < 0) hours = '0' + hours;
            if (min < 10) min = '0' + min;
            if (seconds < 10) seconds = '0' + seconds;
            return (year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + seconds);
        },
    },
}
</script>

<style lang="scss" scoped>
.box {
    padding: 20px;
}
.table{
    margin-top: 30px;
    margin-bottom: 15px;
}
.operate {
    margin: 15px 0 15px 0;
}
.col-1 {
    width: 100px;
}
.col-2 {
    width: 128px;
    margin: 0 14px;
}
.el-popover__reference-wrapper button  {
    margin-left: 20px;
}
:deep .el-form-item__content {
    width: 292px;
}
:deep .el-dialog__header {
    background-color: #1f211f;
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
.col-el {
    position: relative;
    bottom: 2px;
}
</style>