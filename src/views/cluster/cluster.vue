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
                    <el-col :span="4">
                        <el-input clearable size="small" @keyup.enter.native="getClusterListMth('search')" @clear="getClusterListMth('search')" placeholder="集群类型" suffix-icon="el-icon-date" v-model="clusterType"></el-input>
                    </el-col>
                    <el-col :span="1" class="col-el">
                        <el-tooltip class="item" effect="dark" content="点击搜索" placement="top-start">
                            <el-button size="small" type="primary" icon="el-icon-search" circle @click="getClusterListMth('search')"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="1" class="col-last">
                        <el-tooltip class="item" effect="dark" content="刷新集群列表" placement="top-start">
                            <el-button size="small" type="info" icon="el-icon-refresh" circle @click="getClusterListMth('page')"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </div>
            <div class="operate">
                <el-row :gutter="10">
                    <el-col :span="1"  class="col-1">
                        <el-button size="small" type="primary" icon="el-icon-document-add" @click="renderDialogInput(null, 'add')" v-if="isHidden(getRouterPath('clusterAdd', permissionList), permissionList)">添加集群</el-button>
                    </el-col>
                    <!-- <el-col :span="1" class="col-2">
                        <el-button size="small" type="primary" icon="el-icon-switch-button" v-if="isHidden(getRouterPath('clusterHealthCheck', permissionList), permissionList)" @click="handleStartHealthCheckMth()">启动健康检测</el-button>
                    </el-col> -->
                    <el-col :span="1" class="col-3">
                        <el-button size="small" type="danger" icon="el-icon-delete" v-if="isHidden(getRouterPath('clusterDel', permissionList), permissionList)" @click="handleDeleteClusterMth(null, 'mul')">批量删除集群</el-button>
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
                    <el-table-column prop="cluster_cid" label="cluster_id" width="250"></el-table-column>
                    <el-table-column prop="master_ip" label="manager_ip" width="210">
                        <template slot-scope="scope">
                            <el-link type="warning" :underline="false"  size="mini" plain v-if="scope.row.master_ip == ''" :loading="true"><i class="el-icon-loading"></i>集群正在重新选举leader</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="region" label="region" ></el-table-column>
                    <el-table-column prop="status" label="status" >
                        <template slot-scope="scope">
                            <el-link type="danger" :underline="false"  size="mini" plain v-if="scope.row.status === 100">异常</el-link>
                            <el-link type="success" :underline="false"  size="mini" plain v-else-if="scope.row.status === 200">正常</el-link>
                            <el-link type="warning" :underline="false"  size="mini" plain v-else-if="scope.row.status === 300" :loading="true"><i class="el-icon-loading"></i>正在初始化</el-link>
                            <el-link type="danger" :underline="false"  size="mini" plain v-else>未知状态</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" label="change_time" width="200">
                        <template slot-scope="scope">
                            <el-tag size="small" type="success">{{ scope.row.date | formatDate}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="operate" width="450">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" slot="reference" icon="el-icon-delete-solid" plain v-if="isHidden(getRouterPath('clusterDel', permissionList), permissionList)" @click="handleDeleteClusterMth(scope.row, 'sig')">删除</el-button>
                            <el-button size="mini" type="info" slot="reference" icon="el-icon-edit" plain v-if="isHidden(getRouterPath('clusterUpdate', permissionList), permissionList)" @click="renderDialogInput(scope.row, 'update')">更新</el-button>
                            <el-button size="mini" type="primary" slot="reference" icon="el-icon-top" plain 
                            v-if="isHidden(getRouterPath('clusterJoinWork', permissionList), permissionList) || isHidden(getRouterPath('clusterJoinManager', permissionList), permissionList)" 
                            @click="renderDialogInput(scope.row, 'expand')">扩容</el-button>
                            <el-button size="mini" type="warning" slot="reference" icon="el-icon-bottom" plain 
                            v-if="isHidden(getRouterPath('clusterLeave', permissionList), permissionList)" 
                            @click="renderDialogInput(scope.row, 'shrink')">缩容</el-button>
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
                <el-form-item label="集群类型" prop="name">
                    <el-input type="name" v-model="ruleForm.cluster_type" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="集群区域" prop="region">
                    <el-input type="name" v-model="ruleForm.region" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="主节点" prop="master_ip">
                    <el-select v-model="ruleForm.master_ip" placeholder="请选择主节点" clearable>
                        <el-option
                            v-for="item in createClusterServers"
                            :key="item.id"
                            :label="item.ip"
                            :value="item.ip"
                            v-if="!ruleForm.work_ip.includes(item.ip)"
                            :disabled="item.disabled"
                            >
                            <span style="color: #8492a6; font-size: 13px">{{item.name}} | {{ item.ip }} | {{ item.node_type|showNodeTypeName() }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作节点" prop="work_ip">
                    <el-select v-model="ruleForm.work_ip" placeholder="请选择工作节点" clearable
                                        multiple
                                        filterable
                                        allow-create
                                        default-first-option
                    >
                        <el-option
                            v-for="item in createClusterServers"
                            :key="item.id"
                            :label="item.ip"
                            :value="item.ip"
                            v-if="ruleForm.master_ip != item.ip"
                            :disabled="item.disabled"
                            >
                            <span style="color: #8492a6; font-size: 13px">{{item.name}} | {{ item.ip }} | {{ item.node_type|showNodeTypeName() }}</span>
                        </el-option>
                    </el-select>
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
    <!-- 更新集群 -->
    <div>
        <el-dialog
            title="更新集群"
            :visible.sync="updateClusterDialogVisible"
            width="500px"
            :close-on-click-modal="false"
            v-draggable
            center
            >
            <el-form :model="ruleForm" status-icon label-position="right" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="集群ID" prop="id">
                    <el-input type="name" v-model="ruleForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="集群名称" prop="name">
                    <el-input type="name" v-model="ruleForm.name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="集群类型" prop="name">
                    <el-input type="name" v-model="ruleForm.cluster_type" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="集群区域" prop="region">
                    <el-input type="name" v-model="ruleForm.region" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-popconfirm :title="'确定更新【'+ruleForm.name+'】吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='确定'
                                @confirm="submitForm('ruleForm', updateClusterMth)"
                            >
                    <el-button type="primary" :loading="updateClusterLoading" slot="reference">确 定</el-button>
                </el-popconfirm>
            </span>
        </el-dialog>
    </div>
    <!-- 集群扩容 -->
    <div>
        <el-dialog
            title="集群扩容"
            :visible.sync="expandClusterDialogVisible"
            width="500px"
            :close-on-click-modal="false"
            v-draggable
            @closed="handleClosedMth"
            center
            >
            <el-form :model="ruleForm" status-icon label-position="right" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="集群ID" prop="id">
                    <el-input type="name" v-model="ruleForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="集群名称" prop="name">
                    <el-input type="name" v-model="ruleForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="扩容节点" prop="name">
                    <el-radio-group v-model="selectNode">
                        <el-radio :label="1">管理节点</el-radio>
                        <el-radio :label="2">工作节点</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择服务器" prop="work_ip">
                    <el-select v-model="ruleForm.work_ip" placeholder="选择服务器" clearable
                                        multiple
                                        filterable
                                        allow-create
                                        default-first-option
                    >
                        <el-option
                            v-for="item in serverNodeType"
                            :key="item.id"
                            :label="item.ip"
                            :value="item.ip"
                            :disabled="item.disabled"
                            >
                            <span style="color: #8492a6; font-size: 13px">{{item.name}} | {{ item.ip }} | {{ item.node_type|showNodeTypeName() }}</span>
                        </el-option>
                    </el-select>
                    <el-button class="refresh" size="small" :loading="tableLoad" type="info" icon="el-icon-refresh" circle @click="getClusterListMth('page')"></el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-popconfirm :title="`确定将${this.ruleForm.work_ip}加入到集群【${this.ruleForm.name}】吗?`"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='确定'
                                @confirm="submitForm('ruleForm', expandClusterMth)"
                            >
                    <el-button type="primary" :loading="expandClusterLoading" slot="reference">确 定</el-button>
                </el-popconfirm>
            </span>
        </el-dialog>
    </div>
    <!-- 集群缩容 -->
    <div>
        <el-dialog
            title="集群缩容"
            :visible.sync="shrinkClusterDialogVisible"
            width="500px"
            :close-on-click-modal="true"
            v-draggable
            @closed="handleClosedMth"
            center
            >
            <el-form :model="ruleForm" status-icon label-position="right" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="集群ID" prop="id">
                    <el-input type="name" v-model="ruleForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="集群名称" prop="name">
                    <el-input type="name" v-model="ruleForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="缩容节点" prop="name">
                    <el-radio-group v-model="selectNode" @change="filterSeversMth">
                        <el-radio :label="1">管理节点</el-radio>
                        <el-radio :label="2">工作节点</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择服务器" prop="work_ip">
                    <el-select v-model="ruleForm.work_ip" placeholder="选择服务器" @visible-change="leaveManagerNodeNoticeMth" clearable
                                        multiple
                                        filterable
                                        allow-create
                                        default-first-option
                                        
                    >
                        <el-option
                            v-for="item in clusterServers"
                            :key="item.id"
                            :label="item.ip"
                            :value="item.ip"
                            >
                            <span style="color: #8492a6; font-size: 13px">{{ruleForm.name}} | {{ item.ip }} | {{ item.node_type|showNodeTypeName() }}</span>
                        </el-option>
                    </el-select>
                    <el-button class="refresh" size="small" :loading="tableLoad" type="info" icon="el-icon-refresh" circle @click="getClusterListMth('page')"></el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-popconfirm :title="`确定将${this.ruleForm.work_ip}从集群【${this.ruleForm.name}】中移除吗?`"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='确定'
                                @confirm="submitForm('ruleForm', leaveClusterMth)"
                            >
                    <el-button type="primary" :loading="shrinkClusterLoading" slot="reference" :disabled="noticeManagerLeave">确 定</el-button>
                </el-popconfirm>
            </span>
        </el-dialog>
    </div>
    </div>
</template>

<script>
import { createCluster, getClusterList, delCluster,joinMasterCluster,joinWorkCluster,leaveCluster,updateCluster,startHealthCheck } from '../../api';
import { Message } from 'element-ui';
import { isHidden, getRouterPath } from '@/utils/utils';
import { mapState } from 'vuex';
import { MessageBox } from 'element-ui';

export default {
    name:"cluster",
    // 弹窗可拖拽
    directives: {
        draggable: {
            bind(el) {
            // 设置弹窗的基础样式，确保宽度固定
            const computedStyle = window.getComputedStyle(el);
            el.style.position = "fixed";
            el.style.zIndex = 1000;

            // 锁定宽度和高度
            el.style.width = computedStyle.width;
            el.style.height = computedStyle.height;

            // 初始化拖动参数
            el.dragging = false;
            el.startX = 0;
            el.startY = 0;
            el.left = 0;
            el.top = 0;

            // 监听弹窗头部的鼠标按下事件
            const header = el.querySelector('.el-dialog__header');
            header.addEventListener("mousedown", function (event) {
                // 判断右键点击
                if (event.button === 2) return;  // 阻止右键触发拖动
                
                el.dragging = true;
                el.startX = event.clientX;
                el.startY = event.clientY;

                // 获取弹窗的初始位置
                const rect = el.getBoundingClientRect();
                el.left = rect.left;
                el.top = rect.top;

                // 添加鼠标移动和松开事件
                document.addEventListener("mousemove", mouseMove);
                document.addEventListener("mouseup", mouseUp);
            });

            // 鼠标移动事件
            function mouseMove(event) {
                if (el.dragging) {
                    const left = event.clientX - el.startX + el.left;
                    const top = event.clientY - el.startY + el.top;

                    // 仅更新 left 和 top，避免影响宽度和高度
                    el.style.left = `${left}px`;
                    el.style.top = `${top}px`;
                }
            }

            // 鼠标松开事件
            function mouseUp() {
                if (el.dragging) {
                    el.dragging = false;
                    // 移除事件监听
                    document.removeEventListener("mousemove", mouseMove);
                    document.removeEventListener("mouseup", mouseUp);
                }
            }
            },
        },
    },
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
        var validatemasterip= (rule, value, callback) => {
            if (!value) {
                callback(new Error('主节点不能为空'));
            } else {
                callback();
            }
        };
        var validateworkip= (rule, value, callback) => {
            if (!value) {
                callback(new Error('工作节点不能为空'));
            } else {
                callback();
            }
        };
        return {
            noticeManagerLeave: false,
            updateClusterDialogVisible: false,
            updateClusterLoading: false,
            createClusterServers: [],
            serverNodeType: [],
            clusterServers: [],
            shrinkClusterLoading: false,
            shrinkClusterDialogVisible: false,
            expandClusterLoading: false,
            expandClusterDialogVisible: false,
            selectNode:2,
            servers: [],
            multipleSelection: [],
            createClusterLoading: false,
            createClusterDialogVisible: false,
            clusterListData: [],
            datetime:"",
            clusterName:"",
            clusterCid:"",
            clusterRegion:"",
            clusterType:"",
            tableLoad: true,
            pages: {
                curPage:1,
                pageSize:5,
            },
            total:0,
            ruleForm:{
                id: "",
                name:"",
                region:"",
                health_port: 12306,
                cluster_cid:"",
                cluster_type:"",
                master_ip: [],
                work_ip: [],
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
        handleClosedMth() {
            this.clusterServers = [];
            this.ruleForm.work_ip = [];
            this.resetForm('ruleForm');
        },
        formatServersWhenCreateCluster() {
            let servers = [];
            let isAdd = false;
            this.servers.forEach(item1 => {
                this.clusterListData.forEach(item2 => {
                    if (item2.servers && item2.servers.length > 0) {
                        item2.servers.forEach(item3 => {
                            if (item3.ip == item1) {
                                const s = {node_type: item3.node_type, ip: item3.ip, name: item2.name, disabled: true};
                                servers.push(s);
                                isAdd = true;
                            }
                        })
                    }
                });
                if (!isAdd) {
                    const s = {node_type: 3, ip: item1, name: "未加入集群", disabled: false};
                    servers.push(s);
                };
                isAdd = false;
            });

            this.createClusterServers = servers;
        },
        formatServersMth(id) {
            let selectedServer = [];
            let isAdd = false;

            this.clusterListData.forEach(item => {
                if (item.id == id && item.servers && item.servers.length > 0) {
                    this.serverNodeType = item.servers;
                }
            });

            this.servers.forEach(item1 => {
                this.serverNodeType.forEach(item2 => {
                    if (item1 == item2.ip) {
                        const f1 = {node_type: item2.node_type, ip: item2.ip, name: this.ruleForm.name, disabled: true};
                        selectedServer.push(f1);
                        isAdd = true;
                    }
                });
                if (!isAdd) {
                    const f2 = {node_type: 3, ip: item1, name: "未加入集群", disabled: false};
                    selectedServer.push(f2);
                };
                isAdd = false;
            });

            this.serverNodeType = selectedServer;
        },
        async filterSeversMth(row) {
            await this.clusterListData.forEach(item => {
                if (item.id == this.ruleForm.id && item.servers.length > 0) {
                    this.clusterServers = item.servers.filter(item => item.node_type == this.selectNode);
                    return;
                }
            });
            return true;
        },
        // 打开所有的dialog
        renderDialogInput(row, name) {
            if (name == 'add') {
                this.createClusterDialogVisible = true;
                this.formatServersWhenCreateCluster();
                return;
            };

            this.ruleForm.work_ip = [];
            this.ruleForm.id = row.id;
            this.ruleForm.name = row.name;
            this.ruleForm.master_ip = row.master_ip;
            this.ruleForm.region = row.region;
            this.ruleForm.cluster_type = row.cluster_type;
            this.clusterListData.forEach(item => {
                if (item.id == row.id && item.servers.length > 0) {
                    this.clusterServers = item.servers;
                    return;
                }
            });
            if (name == 'expand') {
                this.expandClusterDialogVisible = true;
                this.formatServersMth(row.id);
            } else if (name == 'shrink') {
                this.shrinkClusterDialogVisible = true;
                this.filterSeversMth(row);
            } else if (name == 'update') {
                this.updateClusterDialogVisible = true;
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleDeleteClusterMth(data, model) {
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
        handleStartHealthCheckMth() {
            if (this.multipleSelection.length == 0) {
                return Message.error("请勾选需要启动健康检测的集群");
            }
            MessageBox.confirm(`集群【${this.multipleSelection.map(item => item.name)}】确定启动健康检测吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let cids = this.multipleSelection.map(item => item.id);
                this.startHealthCheckMth(cids);
            }).catch((err) => {     
            });
        },
        async startHealthCheckMth() {
            let data = {
                id: cids,
            };
            this.tableLoad = true;
            const resp = await startHealthCheck(JSON.stringify(data), this.methodCall);
            if (resp.data && resp.data.code !== 10000) {
                Message.error(resp.data.message);
            } else {
                Message.success(resp.data.message);
            }

            this.getClusterListMth("page");
        },
        async deleteClusterMth(cids) {
            let servers = [];
            const bdata = {ip: this.ruleForm.master_ip, node_type: 1};
            servers.push(bdata);
            this.ruleForm.work_ip.forEach(item => {
                const idata = {ip: item, node_type: 2};
                servers.push(idata);
            });

            let data = {
                id: cids,
            };
            this.tableLoad = true;
            const resp = await delCluster(JSON.stringify(data), this.methodCall);
            if (resp.data && resp.data.code !== 10000) {
                Message.error(resp.data.message);
            } else {
                Message.success(resp.data.message);
            }

            this.getClusterListMth("page");
        },
        async expandClusterMth() {
            let servers = [];
            const bdata = {ip: this.ruleForm.master_ip, node_type: 1};
            servers.push(bdata);
            this.expandClusterLoading = true;
            if (this.selectNode == '1') {
                servers = [];
                this.ruleForm.work_ip.forEach(item => {
                    const idata = {ip: item, node_type: 1};
                    servers.push(idata);
                });
                let data = {
                    id: this.ruleForm.id, 
                    master_ip: this.ruleForm.master_ip,
                    servers: servers,
                };
                const resp = await joinMasterCluster(JSON.stringify(data), this.methodCall);
                if (resp.data && resp.data.code !== 10000) {
                    Message.error(resp.data.message);
                } else {
                    Message.success(resp.data.message);
                }
                
            } else if (this.selectNode == '2') {
                this.ruleForm.work_ip.forEach(item => {
                    const idata = {ip: item, node_type: 2};
                    servers.push(idata);
                });
                let data = {
                    id: this.ruleForm.id, 
                    master_ip: this.ruleForm.master_ip,
                    servers: servers,
                };
                const resp = await joinWorkCluster(JSON.stringify(data), this.methodCall);
                if (resp.data && resp.data.code !== 10000) {
                    Message.error(resp.data.message);
                } else {
                    Message.success(resp.data.message);
                }
            }

            this.expandClusterLoading = false;
            this.expandClusterDialogVisible = false;
            
        },
        // 提醒用户移除的是管理节点，如果集群中的管理节点小于3，移除管理节点会导致集群无法选举出leader的错误，让用户慎重操作
        leaveManagerNodeNoticeMth(visible) {
            if (!visible) {
                let managerIPs = [];
                this.clusterServers.forEach(element => {
                    this.ruleForm.work_ip.forEach(item => {
                        if (element.ip == item && element.node_type == 1) {
                            managerIPs.push(element.ip);
                        }
                    });
                });
                
                if (managerIPs.length > 0){
                    this.noticeManagerLeave = true;
                    Message({
                        message: `${managerIPs}是管理节点, 确定从集群${this.ruleForm.name}移除吗? 根据Raft算法, 当集群管理节点小于3的时候, 如果移除管理节点会导致无法选举出leader, 请慎重!`,
                        showClose: true,
                        duration: 0,
                        type: 'warning',
                        onClose: () => {
                            this.noticeManagerLeave = false;
                        },
                    });
                }
            }
        },
        async leaveClusterMth() {
            let servers = [];
            // const bdata = {ip: this.ruleForm.master_ip, node_type: 1};
            // servers.push(bdata);
            this.ruleForm.work_ip.forEach(item => {
                const idata = {ip: item, node_type: 2};
                servers.push(idata);
            });
            let data = {
                id: this.ruleForm.id, 
                master_ip: this.ruleForm.master_ip,
                servers: servers,
            };

            this.shrinkClusterLoading = true;
            const resp = await leaveCluster(JSON.stringify(data), this.methodCall);
            if (resp.data && resp.data.code !== 10000) {
                Message.error(resp.data.message);
            } else {
                Message.success(resp.data.message);
            }
            
            this.shrinkClusterLoading = false;
            this.shrinkClusterDialogVisible = false;
        },
        async createClusterMth() {
            this.createClusterLoading = true;
            let servers = [];
            const bdata = {ip: this.ruleForm.master_ip, node_type: 1};
            servers.push(bdata);
            this.ruleForm.work_ip.forEach(item => {
                const idata = {ip: item, node_type: 2};
                servers.push(idata);
            });

            let data = {
                name: this.ruleForm.name, 
                region: this.ruleForm.region, 
                master_ip: this.ruleForm.master_ip,
                servers: servers,
                cluster_type: this.ruleForm.cluster_type,
            };
            const resp = await createCluster(JSON.stringify(data), this.methodCall);
            if (resp.data && resp.data.code !== 10000) {
                Message.error(resp.data.message);
            } else {
                Message.success(resp.data.message);
            }

            this.getClusterListMth("page");
            this.createClusterLoading = false;
            this.createClusterDialogVisible = false;
        },
        async updateClusterMth() {
            let data = {
                id: this.ruleForm.id,
                name: this.ruleForm.name, 
                region: this.ruleForm.region, 
                master_ip: this.ruleForm.master_ip,
                cluster_type: this.ruleForm.cluster_type,
            };
            this.updateClusterLoading = true;
            const resp = await updateCluster(data, this.methodCall);
            if (resp.data && resp.data.code !== 10000) {
                Message.error(resp.data.message);
            } else {
                Message.success(resp.data.message);
            }

            this.getClusterListMth("page");
            this.updateClusterLoading = false;
            this.updateClusterDialogVisible = false;
        },
        leaveCheckMth(id) {
            this.clusterListData.forEach(item => {
                if (item.servers && item.servers.length > 0) {
                    this.clusterServers = item.servers.filter(item => item.node_type == this.selectNode);
                    return;
                }
            });
        },
        async getClusterListMth(mode) {
            this.clusterServers = [];
            this.servers = [];
            this.serverNodeType = [];
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
                cluster_type: this.clusterType,
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
            this.servers = resp.data.servers;
            
            if (this.shrinkClusterDialogVisible) {
                this.filterSeversMth();
            }

            if (this.expandClusterDialogVisible) {
                this.formatServersMth(this.ruleForm.id);
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
        showNodeTypeName(data) {
            if (data == 1) {
                return "master节点";
            } else if (data ==2 ) {
                return "work节点";
            }  else {
                return "未分配节点";
            } 
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
    margin-left: 14px;
}
.col-3 {
    width: 128px;
    margin-left: 11px;
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
    cursor: move!important;
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
    cursor: default;
}
:deep .el-dialog--center {
    cursor: default;
}
:deep .el-dialog--center .el-dialog__footer {
    background-color: #f9f9f9;
}
.el-message-box__message p {
    overflow-wrap: break-word;
    height: 96px;
    overflow-y: auto;
}
.col-el {
    position: relative;
    bottom: 2px;
}
.refresh {
    margin-left: 20px;
}
.col-last {
    float: right;
}
</style>