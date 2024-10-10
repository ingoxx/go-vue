<template>
    <div class="box">
        <div class="section-4" v-if="isHidden('/assets/upload', permissionList)">
            <el-card>
                <el-divider><i class="el-icon-upload"></i>上传文件</el-divider>
                <div class="upload">
                    <el-row :gutter="10">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action="uploadUrl()"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :limit="10"
                            :on-success="handleSuccess"
                            :on-change="handleChange"
                            :on-error="handleError"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            :before-upload="beforeUpload"
                            multiple
                            :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="uploadFile()" :loading="uploadLoading">分发到指定服务器</el-button>
                            <div slot="tip" class="el-upload__tip size">这里可以上传文件, 系统会批量的分发到勾选的服务器然后再点击对应按钮更新或重启</div>
                        </el-upload>
                    </el-row>
                </div>
            </el-card>
        </div>
        <div class="section-2" v-if="isHidden('/assets/api', permissionList)">
            <el-card>
                <el-divider><i class="el-icon-s-tools"></i>操作</el-divider>
                <div class="operate">
                    <el-row :gutter="10">
                        <template v-for="(data, index) in processList">
                            <template>
                                <el-col :span="1.9" :key="data.pid">
                                    <el-button v-if="data.type==1" type="primary" size="mini" icon="el-icon-basketball" @click="runProcess('sin', data.name, index)" :loading="data.load">{{ data.name }}</el-button>
                                    <el-button v-else-if="data.type==2" type="warning" size="mini" icon="el-icon-basketball" @click="runProcess('sin', data.name, index)" :loading="data.load">{{ data.name }}</el-button>
                                </el-col>
                            </template>
                        </template>
                    </el-row>
                </div>
            </el-card>
        </div>
        <div class="section-3">
            <el-card>
                <el-divider><i class="el-icon-s-platform"></i>服务器列表</el-divider>
                <div class="search">
                    <el-row :gutter=10>
                        <el-col :span="3.9">
                            <el-input v-model="projectSearch" placeholder="请输入项目名" size="mini" clearable @keyup.enter.native="getAssetsList('search')" @clear="getAssetsList('search')"></el-input>
                        </el-col>
                        <el-col :span="3.9">
                            <el-input v-model="serverSearch" placeholder="请输入ip" size="mini" clearable @keyup.enter.native="getAssetsList('search')" @clear="getAssetsList('search')"></el-input>
                        </el-col>
                        <div class="mul-op">
                        <el-col :span="3.9">
                            <el-select v-model="selectVal" placeholder="更多操作" size="mini" clearable
                                multiple
                                filterable
                                allow-create
                                default-first-option
                            >
                                <el-option
                                    v-for="item in processList"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="3.9">
                            <el-button type="primary" icon="el-icon-upload" size="mini" @click="runProcess('mul', '')" v-if="isHidden('/assets/api', permissionList)" :loading="submitLoading">提交</el-button>
                        </el-col>
                        <el-col :span="3.9">
                            <el-button type="primary"  size="mini" icon="el-icon-circle-plus-outline" @click="openCreateDialog()" v-if="isHidden('/assets/add', permissionList)">新建</el-button>
                        </el-col>
                        <el-col :span="2" class="c1">
                            <el-link type="primary" @click="updateSetup">{{ detailContent }}<i :class="detailICon"></i> </el-link>
                        </el-col>
                    </div>
                    </el-row>
                </div>
                <div class="table">
                    <transition name="el-zoom-in-center">
                        <div class="detail" v-show="detailView">
                            <el-row :gutter="5">
                                <h3 class="title-2">更新设置</h3>
                            </el-row>
                            <el-row :gutter="10" class="detail-content">
                                <el-col :span="4">
                                   <label class="detail-2">是否查看更新过程(默认关闭):</label> <el-switch v-model="isJump" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="detail-content">
                                <el-col :span="4">
                                   <label class="detail-2">是否删除更新记录(默认不删除):</label> <el-switch v-model="isDelUpdateLog" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                </el-col>
                            </el-row>
                        </div>
                    </transition>
                    
                    <el-table v-loading="tableLoad" stripe  :data="dataList" @selection-change="handleSelectionChange"
                        element-loading-text="拼命加载中" ref="multipleTable" @row-dblclick="tableRowClick"
                    >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="id"></el-table-column>
                    <el-table-column prop="project" label="项目"></el-table-column>
                    <el-table-column prop="ip" label="服务器"></el-table-column>
                    
                    <el-table-column prop="start" label="添加/修改时间">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.start | formatDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="250">
                        <template slot-scope="scope">
                            <el-button size="mini" icon="el-icon-edit" v-if="isHidden('/assets/update', permissionList)" @click="openEditDialog(scope.row)">编辑</el-button>
                            <el-popconfirm :title="'确定删除'+scope.row.ip+'吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='删除'
                                @confirm="handleDelete(scope.row)"
                            >
                                <el-button size="mini" type="danger" slot="reference" icon="el-icon-delete-solid" plain v-if="isHidden('/assets/del', permissionList)">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                </div>
                <div class="page">
                    <el-pagination
                    background
                    small
                    @current-change="handleCurrentChange"
                    :current-page.sync="pages.curPage"
                    :page-size="pages.pageSize"
                    layout="prev, pager, next, total, jumper"
                    :total="total"
                    >
                    </el-pagination>
                </div>
            </el-card>
        </div>
        <div class="section-5" v-if="isHidden('/assets/process/update/list', permissionList)">
            <el-card>
                <el-divider><i class="el-icon-s-help"></i>更新记录列表</el-divider>
                <div class="search">
                    <el-row :gutter=10>
                        <el-col :span=3.9>
                            <el-button-group>
                                <!-- <el-button type="primary"  size="mini">全部</el-button> -->
                                <el-button type="warning"  size="mini" @click="getUpdateList('search','更新中', 300)">更新中</el-button>
                                <el-button type="success" size="mini" @click="getUpdateList('search','完成', 300)">完成</el-button>
                                <el-button type="danger"  size="mini" @click="getUpdateList('search','失败', 300)">失败</el-button>
                            </el-button-group>
                        </el-col>
                        <el-col :span="3.9">
                            <el-input v-model="updatestatus" placeholder="请输入更新状态" size="mini" clearable @keyup.enter.native="getUpdateList('search', updatestatus)" @clear="getUpdateList('search', updatestatus)"></el-input>
                        </el-col>
                        <el-col :span="3.9">
                            <el-input v-model="updateip" placeholder="请输入ip" size="mini" clearable @keyup.enter.native="getUpdateList('search', updatestatus)" @clear="getUpdateList('search', updatestatus)"></el-input>
                        </el-col>
                        <el-col :span="3.9">
                            <el-input v-model="updateuuid" placeholder="请输入uuid" size="mini" clearable @keyup.enter.native="getUpdateList('search', updatestatus)" @clear="getUpdateList('search', updatestatus)"></el-input>
                        </el-col>
                        <el-col :span="3.9">
                            <el-input v-model="updatename" placeholder="请输入更新程序" size="mini" clearable @keyup.enter.native="getUpdateList('search', updatestatus)" @clear="getUpdateList('search', updatestatus)"></el-input>
                        </el-col>
                        <el-col :span="3.9">
                            <el-input v-model="updateuser" placeholder="请输入操作人" size="mini" clearable @keyup.enter.native="getUpdateList('search', updatestatus)" @clear="getUpdateList('search', updatestatus)"></el-input>
                        </el-col>
                        <el-col :span="3.9">
                            <el-input v-model="updateproject" placeholder="请输入项目" size="mini" clearable @keyup.enter.native="getUpdateList('search', updatestatus)" @clear="getUpdateList('search', updatestatus)"></el-input>
                        </el-col>
                    </el-row>
                </div>
                <div class="table">
                    <el-table v-loading="tableLoad2" stripe  :data="dataList2" @selection-change="handleSelectionChange2"
                        element-loading-text="拼命加载中" :row-key="getRowKey" ref="multipleTable2" @row-dblclick="tableRowClick2"
                    >
                    <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                    <el-table-column prop="id" label="id"></el-table-column>
                    <el-table-column prop="uuid" label="uuid" width="350"></el-table-column>
                    <el-table-column prop="project" label="项目"></el-table-column>
                    <el-table-column prop="ip" label="服务器" width="160"></el-table-column>
                    <el-table-column prop="operator" label="操作人" width="160"></el-table-column>
                    <el-table-column prop="update_name" label="更新程序" width="160">
                        <template slot-scope="scope">
                            <el-tag effect="plain" size="mini">{{ scope.row.update_name }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="更新状态"  width="160">
                        <template slot-scope="scope">
                            <el-button type="warning" size="mini"  v-if="scope.row.status === 400" :loading="true" plain>更新中</el-button>
                            <el-link type="success" :underline="false"  size="mini" v-else-if="scope.row.status === 200" plain>完成</el-link>
                            <el-link type="danger" :underline="false"  size="mini" v-else-if="scope.row.status === 300" plain>失败</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="progress" label="更新进度" width="250">
                        <template slot-scope="scope">
                            <el-progress :percentage="scope.row.progress" v-if="scope.row.status === 300" status="exception"></el-progress>
                            <el-progress :percentage="scope.row.progress" v-else></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column prop="process" label="更新日志" width="200">
                        <template slot-scope="scope">
                            <el-link slot="reference" type="success" @click="viewContent(scope.row)">查看更新日志</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="start" label="开始时间" width="190">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.start | formatDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="end" label="结束时间" width="190">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.end | formatDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cost_time" label="耗时/秒" width="190">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.cost_time }}s</span>
                        </template>
                    </el-table-column>
                </el-table>
                </div>
                <div class="page">
                    <el-pagination
                    background
                    small
                    @current-change="handleCurrentChange2"
                    :current-page.sync="pages2.curPage"
                    :page-size="pages2.pageSize"
                    layout="prev, pager, next, total, jumper"
                    :total="total2"
                    >
                    </el-pagination>
                </div>
            </el-card>
        </div>
        <div class="create">
            <el-dialog
                title="添加服务器"
                :visible.sync="createVisible"
                :close-on-click-modal="false"
                center
                width="600px" 
                v-draggable
                >
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm fix-form-css">
                    <el-form-item label="项目名" prop="project">
                        <el-input  type="text" v-model="ruleForm.project" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="ip" prop="ip">
                        <el-input type="textarea" :rows="10" v-model="ruleForm.ip" autocomplete="off" placeholder="批量添加ip, 请换行输入" clearable></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-popconfirm :title="'确定添加吗?'"
                                    icon="el-icon-info"
                                    icon-color="red"
                                    confirm-button-text='确定'
                                    @confirm="submitForm('ruleForm', createServer)"
                                >
                        <el-button type="primary" :loading="createLoad" slot="reference">确 定</el-button>
                    </el-popconfirm>
                </span>
            </el-dialog>
        </div>
        <div class="edit">
            <el-dialog
                title="修改服务器"
                :close-on-click-modal="false"
                :visible.sync="editVisible"
                center
                width="600px" 
                v-draggable
                >
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm fix-form-css">
                    <el-form-item label="id" prop="selectId">
                        <el-input  type="text" v-model="selectId" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="项目名" prop="project">
                        <el-input  type="text" v-model="ruleForm.project" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="ip" prop="ip">
                        <el-input :rows="10" v-model="ruleForm.ip" autocomplete="off" placeholder="批量添加ip, 请换行输入" clearable></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-popconfirm :title="'确定添加吗?'"
                                    icon="el-icon-info"
                                    icon-color="red"
                                    confirm-button-text='确定'
                                    @confirm="submitForm('ruleForm', editServer)"
                                >
                        <el-button type="primary" :loading="editLoad" slot="reference">确 定</el-button>
                    </el-popconfirm>
                </span>
            </el-dialog>
        </div>
        <!-- 脚本日志 -->
        <div class="result">
            <el-dialog
                title="脚本输出"
                :visible.sync="resultVisible"
                v-draggable
                :close-on-click-modal="false"
                width="800px"
                center
                >
                <div class="result-title">
                    <el-card>
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>更新内容</strong></el-divider>
                        <p class="op-name">
                            <el-row :gutter="10">
                                <el-col :span="1.9" >
                                    <el-tag effect="plain"  type="success">{{ curProject }}</el-tag>
                                </el-col>
                                <el-col :span="1.9" >
                                    <el-tag effect="plain"  type="success">{{ curIp }}</el-tag>
                                </el-col>
                                <el-col :span="1.9" >
                                    <el-tag effect="plain"  type="success">{{ curName }}</el-tag>
                                </el-col>
                            </el-row>
                        </p>
                    </el-card>
                </div>
                <div class="result-data">
                    <el-card v-loading="logLoading"
                            element-loading-text="正在拼命连接中..."
                            element-loading-spinner="el-icon-loading">
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>脚本输出</strong></el-divider>
                        <div class="copy">
                            <el-button type="success" size="mini" plain @click="copy(content.join(''))">复制</el-button>
                        </div>
                        <div class="format-code">
                            <pre><code>{{ content.join('') }}</code></pre>
                        </div>
                    </el-card>
                </div>
                </el-dialog>
        </div>
        <!-- 分发文件窗口 -->
        <div class="syncFile">
            <el-dialog
                title="文件同步"
                :visible.sync="syncFileVisible"
                :close-on-click-modal="false"
                width="800px"
                center
                v-draggable
                >
                <div class="result-title">
                    <el-card v-loading="syncFileLoading"
                            element-loading-text="正在拼命同步中..."
                            element-loading-spinner="el-icon-loading">
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>文件同步</strong></el-divider>
                        <p class="op-name">
                            <el-row :gutter="10">
                                <el-col :span="1.9">
                                    <el-link effect="plain" :underline="false" type="success">{{ fileNameList.join('\n') }}</el-link>
                                </el-col>
                            </el-row>
                        </p>
                    </el-card>
                </div>
                <div class="result-data">
                    <el-card v-loading="logLoading"
                            element-loading-text="正在拼命连接中..."
                            element-loading-spinner="el-icon-loading">
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>文件同步</strong></el-divider>
                        <div class="copy">
                            <el-button type="success" size="mini" plain @click="copy(syncFileContent.join(''))">复制</el-button>
                        </div>
                        <div class="format-code">
                            <pre><code>{{ syncFileContent.join('') }}</code></pre>
                        </div>
                    </el-card>
                </div>
                </el-dialog>
        </div>
    </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import { mapState } from 'vuex'
import { getAssetsList, getProcessStatus, createProgramUpdateRecord, runProgram, getUpdateList, assetsUpload, createServer, delServer, editServer } from '../../api'
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import baseUrl from "../../utils/baseUrl";
import wssUrl from "../../utils/wssUrl";
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import SparkMD5 from 'spark-md5';
import md5 from 'blueimp-md5';
// import draggable from 'vuedraggable'
// import { VueDraggableResizable } from 'vue-draggable-resizable'

export default {
    name: "servers",
    // 弹窗可拖拽
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
        var validateproject = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入项目'));
            } else {
                callback();
            }
        };
        var validateip = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入ip'));
            } else {
                callback();
            }
        };
        return {
            searchData: "",
            updateListSeach: "",
            updatestatus:"",
            updateuuid:"",
            updateip:"",
            updatename: "",
            updateproject: "",
            updateuser: "",
            ws: "",
            curIp: "",
            curName: "",
            curProject:"",
            timer: "",
            serverSearch: "",
            projectSearch: "",
            selectProject: "",
            selectIp: "",
            selectId: "",
            runningNum: 0,
            finishedNum: 0,
            failedNum: 0,
            total:5,
            total2:5,
            syncFileLoading: true,
            nowLoading: false,
            syncFileVisible: false,
            isDelUpdateLog: false,
            submitLoading: false,
            isJump: false,
            isLoop: false,
            detailView: false,
            createVisible: false,
            editVisible: false,
            resultVisible: false,
            createLoad:false,
            editLoad:false,
            tableLoad2:true,
            tableLoad: true,
            logLoading: true,
            uploadLoading: false,
            detailContent: "更新设置",
            detailICon: "el-icon-arrow-down",
            updateRunning: [],
            fileList: [],
            selectVal: [],
            content: [],
            syncFileContent: [],
            projectList: [],
            finished: [],
            fileNameList: [],
            multipleSelection: [],
            multipleSelection2: [],
            dataList: [],
            dataList2: [],
            uploadData: {},
            ruleForm: {
                project:'',
                ip:'',
            },
            rules: {
                project: [
                    { validator: validateproject, trigger: 'blur' }
                ],
                ip: [
                    { validator: validateip, trigger: 'blur' }
                ],
            },
            processList: [],
            processName: {},
            pages: {
                curPage:1,
                pageSize:5,
            },
            pages2: {
                curPage:1,
                pageSize:5,
            },
            dragDialog: {
                // 记录拖拽的位置
                startX: 0,
                startY: 0,
                left: 0,
                top: 0,
                dragging: false,
            },
        }
    },
    computed: {
        ...mapState({
            'running': state => state.runProgram.running,
            'permissionList': state => state.addRouters.permissionList,
        }),
    },
    components: {
        // VueDraggableResizable
    },
    methods: {
        dialogDrag(event) {
            if (!this.dragDialog.dragging) {
                return;
            }
            // 计算拖拽距离
            const left = event.clientX - this.dragDialog.startX + this.dragDialog.left;
            const top = event.clientY - this.dragDialog.startY + this.dragDialog.top;
            // 更新对话框位置
            this.$refs.dialog.$el.style.left = `${left}px`;
            this.$refs.dialog.$el.style.top = `${top}px`;
        },
        dialogMouseDown(event) {
            // 开始拖拽
            this.dragDialog.dragging = true;
            // 记录起始位置
            this.dragDialog.startX = event.clientX;
            this.dragDialog.startY = event.clientY;
            // 记录当前位置
            const { left, top } = this.$refs.dialog.$el.getBoundingClientRect();
            this.dragDialog.left = left;
            this.dragDialog.top = top;
            // 添加事件监听器
            document.addEventListener('mousemove', this.dialogDrag);
            document.addEventListener('mouseup', this.dialogMouseUp);
        },
        dialogMouseUp() {
            // 结束拖拽
            this.dragDialog.dragging = false;
            // 移除事件监听器
            document.removeEventListener('mousemove', this.dialogDrag);
            document.removeEventListener('mouseup', this.dialogMouseUp);
        },
        onDragEnd(event) {  
            // 获取对话框的当前位置和鼠标位置  
            
            const dialogRect = this.$refs.dialog.getBoundingClientRect();  
            const mouseX = event.clientX;  
            const mouseY = event.clientY;  
            console.log(dialogRect);
                
            // 计算对话框应该移动到的位置  
            const newLeft = mouseX - (dialogRect.width - this.$refs.dialog.offsetWidth) / 2;  
            const newTop = mouseY - (dialogRect.height - this.$refs.dialog.offsetHeight) / 2;  
                
            // 移动对话框到计算得到的位置  
            this.$refs.dialog.style.left = `${newLeft}px`;  
            this.$refs.dialog.style.top = `${newTop}px`;  
        },
        tableRowClick(row, column, event) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        tableRowClick2(row, column, event) {
            this.$refs.multipleTable2.toggleRowSelection(row);
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
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
        async delServer(action, row) {
            let data = "";
            switch (action) {
                case 'multi':
                    if (this.multipleSelection.length == 0) {
                        return Message.error("请勾选需要删除的服务器");
                    }
                    data = JSON.stringify({ip: this.multipleSelection.map(item => item.ip)});
                    break
                case 'sig':
                    let dl  = [];
                    dl.push(row.ip)
                    data = JSON.stringify({ips: dl});
                    break
            }

            const resp = await delServer(data, this.callMethod)
            if (resp.data.code !== 10000) {
                Message.error(resp.data.message)
            } else {
                this.getAssetsList("page");
                Message.success(resp.data.message)
            }
        },
        async createServer() {
            this.createLoad = true;
            let data = [];
            const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            data = this.ruleForm.ip.split("\n").filter(ip => {
                return regex.test(ip);
            });

            if (data.length===0) {
                return Message.error("格式错误, 只接收ip格式参数")
            }

            let params = JSON.stringify({project: this.ruleForm.project, ip: data});

            const resp = await createServer(params, this.callMethod);
            if (resp.data.code !== 10000) {
                Message.error(resp.data.message)
            } else {
                this.getAssetsList("page");
                Message.success(resp.data.message)
            }

            this.createLoad = false;
        },
        openCreateDialog() {
            this.ruleForm.project = "";
            this.ruleForm.ip = "";
            this.createVisible = true;
        },
        async editServer() {
            this.editLoad = true;
            const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            if (!regex.test(this.ruleForm.ip)) {
                return Message.error("格式错误, 只接收ip格式参数")
            }

            let params = {project: this.ruleForm.project, ip: this.ruleForm.ip, id: this.selectId};

            const resp = await editServer(params, this.callMethod);
            if (resp.data.code !== 10000) {
                Message.error(resp.data.message)
            } else {
                this.getAssetsList("page");
                Message.success(resp.data.message)
            }

            this.editLoad = false;
        },
        openEditDialog(row) {
            this.editVisible = true;
            this.selectId = row.id;
            this.ruleForm.project = row.project;
            this.ruleForm.ip = row.ip;
        },
        copy(text) {
            this.$copyText(text).then(() => {
                Message.success("已复制");
            }, () => {
                Message.error('复制失败');
            })
        },
        getRowKey(row) {
            return row.id
        },
        async getProcessStatus() {
            const resp = await getProcessStatus({result: "run"}).catch(()=>{
                this.runningNum = 0;
                this.finishedNum = 0;
                this.failedNum = 0;
            })

            if (resp.data.code !== 10000) {
                clearInterval(this.timer);
                return Message.error(resp.data.message)
            }

            this.runningNum = resp.data.data.running;
            this.finishedNum = resp.data.data.finished;
            this.failedNum = resp.data.data.failed;

        },
        uploadUrl() {
            return `${baseUrl}/assets/upload`
        },
        // 显示文件MD5码
        showFileMd5() {
            let fl = this.$refs.upload.uploadFiles;
            let n = "";
            let o = "";
            fl.forEach((file)=>{
                let blob = new Blob([file.raw], { type: file.type });
                let reader = new FileReader();
                console.log("reader >>> ", reader);
                reader.onload = (event) => {
                    let arrayBuffer = event.target.result
                    let md5 = SparkMD5.ArrayBuffer.hash(arrayBuffer);
                    o = file.name;
                    n = o + " " + " " + " " + "md5: " + md5;
                    file.name = n;
                    this.fileNameList.push(o);
                }
                reader.readAsArrayBuffer(blob);
            })
            
        },
        // 文件MD5
        getFileMd5() {
            this.fileList.forEach((item)=>{
                let blob = new Blob([item.raw], { type: item.type });
                let reader = new FileReader();
                reader.onload = (event) => {
                    let arrayBuffer = event.target.result
                    let md5 = SparkMD5.ArrayBuffer.hash(arrayBuffer);
                    item.md5 = md5;
                }
                reader.readAsArrayBuffer(blob);
            })
            console.log("fileList", this.fileList);
        },
        // 文件上传
        async uploadFile() {
            if (this.$refs.upload.uploadFiles.length === 0) {
                return Message.error('请选取文件')
            }

            if (this.multipleSelection.length === 0) {
                return Message.error('请选勾选服务器')
            }

            this.uploadLoading = true;

            this.beforeUpload();

            let formData = new FormData();
            this.fileList.forEach(file=>{
                formData.append('file', file.raw);
            });

            this.multipleSelection.map(item => {
                formData.append('ips', item.ip)
            });

            const resp = await assetsUpload(formData, this.callMethod).catch(err => {console.log("assetsUpload err >>>", err)});
            if (resp.data.code === 10000) {
                this.uploadLoading = false;
                this.fileList.forEach(file=>{
                    this.handleSuccess(resp, file);
                })
                this.viewSyncFileContent();
                Message.success(resp.data.message);
            } else {
                Message.error(resp.data.message);
            }
        },
        beforeUpload() {
            this.fileNameList = [];
            let files = this.fileList;
            let o,n = "";
            for (let i=0; i < files.length; i++) {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    const fileData = e.target.result;
                    const filemd5 = SparkMD5.ArrayBuffer.hash(fileData);
                    o = files[i].name;
                    n = o + " " + " " + "md5: " + filemd5;
                    this.fileNameList.push(n);
                };
                fileReader.onerror = (e) => {
                    reject(e);
                };
                fileReader.readAsArrayBuffer(files[i].raw);
            }
            
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleSuccess(response, file) {
            if (response.data.code === 10000) {
                file.status = "success";
            } else {
                file.status = "error";
            }
        },
        handleChange(file, fileList) {
            this.fileList = fileList;
        },
        handleExceed(files, fileList) {
            Message.error("最多10个文件同时上传")
        },
        handleError(err) {
            Message.error(err);
        },
        uniqueRandom () {
            const now = Date.now();
            const randomSuffix = Math.floor(Math.random() * 1000000);
            return `${now}-${randomSuffix}`;
        },
        // 更新设置
        updateSetup () {
            // this.detailContent = this.detailContent === "展开" ? "收起" : "展开";
            this.detailICon = this.detailICon === "el-icon-arrow-down" ? "el-icon-arrow-up" : "el-icon-arrow-down";
            this.detailView = this.detailView === false ? true : false;
        },
        createUuid() {
            return uuidv4();
        },
        // 程序更新的入口
        runProcess(action, name, index) {
            if (this.multipleSelection.length === 0) {
                return Message.error("请勾选服务器");
            }

            if (action==="mul") {
                if (this.selectVal.length===0) {
                    return Message.error("请选择操作");
                }
            }

            let title = "";
            let ip = this.multipleSelection.map(item => item.ip);

            switch (action) {
                case "sin":
                    title = "服务器: " + ip.join("&") + ", 确定操作: " + name + "吗？";
                    this.open('sin', title, name, index);
                    break
                case "mul":
                    title = "服务器: " + ip.join("&") + ", 确定操作: " + this.selectVal.join("&") + "吗？";
                    this.open('mul', title, this.selectVal.join("&"), index);
                    break
            }
            
        },
        // 改成一次请求提交多个
        open(action, title, process, index) {
            MessageBox.confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.confirmUpdate(action, process, index);
                // Message.success(`${process}操作已提交`);
            }).catch((err) => {
                console.log(err);
                Message.info(`${process}操作已取消`);       
            });
        },
        // 确定更新
        async confirmUpdate(action,process, index) {
            let data_list = [];
            let ip = "";
            let uuid = "";
            let project = "";
            let params = "";
            let operator = sessionStorage.getItem("user");
            switch (action) {
                case 'sin':
                    this.processList[index].load = true;
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        ip = this.multipleSelection[i].ip;
                        project = this.multipleSelection[i].project;
                        uuid = this.createUuid();
                        params = {ip, uuid, project, update_name: process, operator};
                        data_list.push(params);
                    }
                    break
                case 'mul':
                    this.submitLoading = true;
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        for (let t = 0; t < this.selectVal.length; t++) {
                            ip = this.multipleSelection[i].ip;
                            uuid = this.createUuid();
                            project = this.multipleSelection[i].project;
                            params = {ip, uuid, project, update_name: this.selectVal[t], operator};
                            data_list.push(params);
                        }
                    }
                    break
            }

            // 先提交执行程序任务(后端异步执行)
            this.runningJumpOrNot(data_list);
            
            // 再提交更新记录
            const resp = await this.createProgramUpdateRecord(data_list).catch(err => console.log("createProgramUpdateRecord >>>", err));
            if (resp.data.code === 10000) {
                Message.success(resp.data.message);
                this.actualTimeGetTaskStatus();
                
            } else {
                Message.error(resp.data.message);
            }

            if (action==="sin") {
                this.processList[index].load = false;
            } else if (action==="mul") {
                this.submitLoading = false;
            }
        },
        // 添加更新记录
        async createProgramUpdateRecord(data) {
            const resp = await createProgramUpdateRecord(JSON.stringify({data_list: data}), this.callMethod).catch((err)=>{;Message.error(err);})
            return resp
        },
        // 实时获取任务状态
        actualTimeGetTaskStatus() {
            console.log("setInterval num");
            this.timer = setInterval(() => {
                this.getUpdateList("page", "", 200, false);
            }, 1000)
        },
        // 是否需要在新的页面打开，实时查看更新脚本的输出内容
        async runningJumpOrNot(data_list) {
            for (let i = 0;i < data_list.length;i++) {
                // 在新的页面执行
                if (this.isJump) {
                    let routeData = this.$router.resolve(
                        { path: `/assets/update/${data_list[i].project}/${data_list[i].ip}/${this.processName[data_list[i].update_name]}/${data_list[i].uuid}` }
                    );
                    window.open(routeData.href, '_blank');
                } else {
                    // 当前页面执行
                    const resp = await this.currentPageRunning(data_list[i]);
                    if (resp.data.code !== 10000) {
                        return Message.error(resp.data.message)
                    }
                }
            }
        },
        // 在当前页面执行
        async currentPageRunning(data) {
            const resp = await runProgram({
                ip: data.ip,
                uuid: data.uuid,
                update_name: this.processName[data.update_name]
            }, this.callMethod).catch((err)=>{Message.error(err)});
            return resp
        },
        // 查看脚本执行的输出
        viewContent (row) {
            this.content = [];
            this.resultVisible = true;
            this.curIp = row.ip;
            this.curName = row.update_name;
            this.curProject = row.project;
            this.contentOutput(row);
        },
        // 分发文件
        viewSyncFileContent() {
            this.syncFileVisible = true;
            this.syncFileContent = [];
            this.syncFileOutput();
        },
        // 服务器列表
        async getAssetsList(mode) {
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

            let data = {
                page: pageNum,
                ip: this.serverSearch,
                project: this.projectSearch,
            };

            const resp = await getAssetsList(data).catch((err) => {
                this.tableLoad = false;
                ;Message.error(err);
            })

            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message)
            }

            this.pages.curPage = pageNum;

            this.dataList = resp.data.data;
            this.pages.pageSize = resp.data.pageSize;
            this.total = resp.data.total;
            this.tableLoad = false;
            this.processList = resp.data.config.config;
            this.processName = resp.data.config.select;

        },
        // 更新记录列表
        async getUpdateList(action, status, cancel, isload) {
            // this.tableLoad2 = true;
            if (isload) {
                this.tableLoad2 = true;
            }

            let data = {};
            let check_status = "";
            let pageNum = 1;

            if (cancel==300) {
                clearInterval(this.timer);
            }

            if (status==="更新中") {
                this.updatestatus = status;
                check_status=400;
            } else if (status==="完成") {
                this.updatestatus = status;
                check_status=200;
            } else if (status==="失败") {
                this.updatestatus = status;
                check_status=300;
            }
            switch (action) {
                case "page":
                    pageNum = this.pages2.curPage;
                    break
                case "search":
                    pageNum = 1;
                    break
            }

            data = {
                page: pageNum,
                ip: this.updateip,
                uuid: this.updateuuid,
                update_name: this.updatename,
                project: this.updateproject,
                operator: this.updateuser,
                status: check_status,
            };
            
            const resp = await getUpdateList(data).catch((err)=>{this.tableLoad2 = false;Message.error(err)});
            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message)
            }

            this.pages2.curPage = pageNum;

            this.dataList2 = resp.data.data;
            this.pages2.pageSize = resp.data.pageSize;
            this.total2 = resp.data.total;
            this.tableLoad2 = false;

        },
        handleDelete (data) {
            this.delServer('sig', data);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSelectionChange2(val) {
            this.multipleSelection2 = val;
        },
        handleCurrentChange(val) {
            this.pages.curPage = val;
            this.getAssetsList("page");
        },
        handleSizeChange2(val) {
            this.pages2.curPage = val;
            this.getUpdateList('page', this.updatestatus, 200, true);
        },
        handleCurrentChange2(val) {
            this.pages2.curPage = val;
            this.getUpdateList('page', this.updatestatus, 200, true);
        },
        contentOutput(val) {
            this.logLoading = true;
            let data = {
                ip: val.ip,
                name: this.processName[val.update_name+"Log"],
                uuid: val.uuid
            }
            this.ws = new WebSocket(wssUrl+"/assets/ws?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"));
            this.ws.onopen = () => {
                this.logLoading = false;
                console.log('WebSocket连接已打开');
                this.ws.send(JSON.stringify(data));
            };
            this.ws.onmessage = (event) => {
                this.content.push(event.data);
                let div = document.querySelector(".result-data");
                div.scrollTop = div.scrollHeight - div.clientHeight;
            };
            this.ws.onclose = () => {
                console.log('WebSocket连接已关闭');
            };
            this.ws.onerror = (error) => {
                this.logLoading = false;
                Message.error('WebSocket连接出错:', error);
            };
        },
        // 分发文件并返回分发完毕后的文件md5码
        syncFileOutput() {
            this.logLoading = true;
            let data = {
                ip: this.multipleSelection.map(item => item.ip),
                file: this.fileList.map(file => file.name)
            }
            this.ws = new WebSocket(wssUrl+"/assets/file/ws?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"));
            this.ws.onopen = () => {
                this.logLoading = false;
                console.log('WebSocket连接已打开');
                this.ws.send(JSON.stringify(data));
            };
            this.ws.onmessage = (event) => {
                this.syncFileContent.push(event.data);
                let div = document.querySelector(".result-data");
                div.scrollTop = div.scrollHeight - div.clientHeight;
            };
            this.ws.onclose = () => {
                console.log('WebSocket连接已关闭');
                this.syncFileLoading = false;
                this.fileList = [];
                Message.success("同步完成");
            };
            this.ws.onerror = (error) => {
                this.logLoading = false;
                Message.error('WebSocket连接出错:', error);
                this.syncFileLoading = false;
            };
        },
        callMethod() {},
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
        this.getUpdateList("page", '', 200);
        this.getAssetsList("page");
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
        getIp(data) {
            let fd = data.map(ip => ip.ip);
            return fd.join(',');
        },
        getName(data) {
            let fd =  data.map(file => file.name);
            return fd.join(',');
        },
    },
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/assets.css';
</style> -->

<style lang="scss" scoped>
.box {
    // padding: 15px;
    // padding: 20px;
    overflow-y: auto;
    height: 96%;
    // background-color: #f5f5f5;
}
.section-2, .section-1-2, .section-3, .table, .page, .result-data, .section-5 {
    margin-top: 16px;
}
.search, .upload, .operate {
    margin-top: 26px;
}
.cell button {
    margin-right: 7px;
}
// .mul-op {
//     float: right;
// }
// 修改elementui css
.op-name {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
}
.format-code {
    height: 533px;
    text-align: justify;
    font-size: 17px;
    overflow: auto;
    color: #c3c3c3;
    background-color: #292828;
    padding: 16px;
    box-sizing: border-box;
    width: auto;
    margin-top: 10px;
    white-space: pre-wrap;
}
.c1 {
    padding-top: 5px;
}
.detail {
    text-align: left;
    margin-bottom: 45px;
    border-bottom: 1px solid #f3f3f3;
    padding-bottom: 11px;
}
.title-2 {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f3f3f3;
    padding-left: 30px;
}
.detail-content {
    margin-top: 10px;
}
.detail-2 {
    font-size: 14px;
    color: #6e6e6e;
}
.upload {
    float: left;
    margin-bottom: 19px;
}
.size {
    font-size: 12px;
    color: #e48686;
}
.upload-demo {
    text-align: left;
}
.el-popover__reference-wrapper button  {
    margin-left: 20px;
}
.fix-form-css {
    margin-right: 68px;
}
:deep .el-form-item .el-form-item--feedback {
    width: 500px;
    margin: 22px auto;
}

:deep .el-dialog__body {
    // height: 50px !important;
    background-color: #f9f9f9;
}
:deep .el-dialog--center {
    cursor: move;
}
:deep .el-dialog--center .el-dialog__footer {
    background-color: #f9f9f9;
}
.result-data {
    overflow-y: auto;
}
:deep .el-popover__title {
    font-weight: 600;
}
.el-divider--horizontal {
    margin: 7px 0;
}
.process-running-list > div{
    padding: 4px 1px;
}
:deep .el-table tr {
    cursor: pointer;
}
:deep .el-link--inner {
    white-space: break-spaces;
}
</style>

