<template>
    <div class="box">
        <!-- 分发文件 -->
        <div class="section-4" v-if="isHidden(getRouterPath('uploadFile', permissionList), permissionList)">
            <el-card>
                <el-divider><i class="el-icon-upload"></i>文件分发</el-divider>
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
                            <el-button slot="trigger" size="small" type="primary" icon="el-icon-s-finance">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="uploadFile()" :loading="uploadLoading" icon="el-icon-s-promotion">分发到指定服务器</el-button>
                            <div slot="tip" class="el-upload__tip size">*这里可以上传文件, 系统会批量的分发到勾选的服务器然后再点击对应按钮更新或重启</div>
                        </el-upload>
                    </el-row>
                </div>
            </el-card>
        </div>
        <!-- 程序操作 -->
        <div class="section-2" v-if="isHidden(getRouterPath('updateProgram', permissionList), permissionList)">
            <el-card>
                <el-divider><i class="el-icon-s-tools"></i>程序操作</el-divider>
                <div class="operate">
                    <el-row :gutter="10">
                        <template v-for="(data, index) in programList">
                            <template>
                                <el-col :span="1.9" :key="data.id" v-if="isHidden(data.path, permissionList)">
                                    <el-button  type="primary" size="mini" icon="el-icon-basketball" @click="runProcess('sin', data.cnname, index)" :loading="data.load">{{ data.cnname }}</el-button>
                                </el-col>
                            </template>
                        </template>
                        <el-col :span="1.9" v-if="isHidden(getRouterPath('program-add', permissionList), permissionList)"><el-button  type="info" size="mini" icon="el-icon-document-add" @click="handleCreateProgramOpMth">添加程序</el-button></el-col>
                    </el-row>
                </div>
            </el-card>
        </div>
        <!-- 服务器列表 -->
        <div class="section-3">
            <el-card>
                <el-divider><i class="el-icon-s-platform"></i>服务器列表</el-divider>
                <div class="search">
                    <div class="server-search">
                        <el-row :gutter=10>
                            <el-col :span="3.9">
                                <el-input v-model="projectSearch" placeholder="请输入项目名查询" size="mini" clearable @keyup.enter.native="getAssetsList('search')" @clear="getAssetsList('search')"></el-input>
                            </el-col>
                            <el-col :span="3.9">
                                <el-input v-model="serverSearch" placeholder="请输入ip查询" size="mini" clearable @keyup.enter.native="getAssetsList('search')" @clear="getAssetsList('search')"></el-input>
                            </el-col>
                            <el-col :span="3.9">
                                <el-select v-model="serverOsTypeSearch" placeholder="请输入系统类型查询" @change="getAssetsList('search')" size="mini" clearable filterable @clear="getAssetsList('search')">
                                    <el-option
                                        v-for="item in osList"
                                        v-if="item.id != 300"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="3.9">
                                <!-- <el-input v-model="serverStatusSearch" placeholder="请输入服务器状态查询" size="mini" clearable @keyup.enter.native="getAssetsList('search')" @clear="getAssetsList('search')"></el-input> -->
                                <el-select v-model="serverStatusSearch" placeholder="请输入服务器状态查询" @change="getAssetsList('search')" size="mini" clearable filterable @clear="getAssetsList('search')">
                                    <el-option
                                        v-for="item in statusList"
                                        v-if="item.id != 300"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="3.9">
                                <!-- <el-input v-model="serverNodeTypeSearch" placeholder="请输入节点类型查询" size="mini" clearable @keyup.enter.native="getAssetsList('search')" @clear="getAssetsList('search')"></el-input> -->
                                <el-select v-model="serverNodeTypeSearch" placeholder="请输入节点类型查询" @change="getAssetsList('search')" size="mini" clearable filterable @clear="getAssetsList('search')">
                                    <el-option
                                        v-for="item in nodeTypeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="3.9">
                                <!-- <el-input v-model="serverNodeStatusSearch" placeholder="请输入节点状态查询" size="mini" clearable @keyup.enter.native="getAssetsList('search')" @clear="getAssetsList('search')"></el-input> -->
                                <el-select v-model="serverNodeStatusSearch" placeholder="请输入节点状态查询" @change="getAssetsList('search')" size="mini" clearable filterable @clear="getAssetsList('search')">
                                    <el-option
                                        v-for="item in statusList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="3.9">
                                <el-select v-model="clusterSearch" placeholder="选择集群名称查询" @change="getAssetsList('search')" size="mini" clearable filterable @clear="getAssetsList('search')">
                                    <el-option
                                        v-for="item in clusterList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="1">
                                <el-tooltip class="item" effect="dark" content="点击搜索" placement="top-start">
                                    <el-button size="small" type="primary" icon="el-icon-search" circle @click="getAssetsList('search')"></el-button>
                                </el-tooltip>
                            </el-col>
                            <el-col :span="1" class="col-last">
                                <el-tooltip class="item" effect="dark" content="刷新服务器表" placement="top-start">
                                    <el-button size="small" type="info" icon="el-icon-refresh" circle @click="getAssetsList('page')"></el-button>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="server-operate">
                        <el-row :gutter=10>
                            <el-col :span="3.9">
                                    <el-select v-model="selectVal" placeholder="更多操作" size="mini" clearable
                                        multiple
                                        filterable
                                        allow-create
                                        default-first-option
                                    >
                                        <el-option
                                            v-for="item in programList"
                                            v-if="isHidden(item.path, permissionList)"
                                            :key="item.cnname"
                                            :label="item.cnname"
                                            :value="item.cnname">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="3.9">
                                <el-button type="primary" icon="el-icon-mouse" size="mini" @click="runProcess('mul', null)" v-if="isHidden(getRouterPath('updateProgram', permissionList), permissionList)" :loading="submitLoading">批量更新程序</el-button>
                            </el-col>
                            <el-col :span="3.9">
                                <el-button type="primary" icon="el-icon-mouse" size="mini" @click="openDialogMth('cmd', null)" v-if="isHidden(getRouterPath('run-linux-cmd', permissionList), permissionList)" :loading="submitLoading">批量ansible作业</el-button>
                            </el-col>
                                <el-col :span="2" class="c3">
                                    <el-link type="primary" @click="updateSetup">{{ detailContent }}<i :class="detailICon"></i> </el-link>
                                </el-col>
                        </el-row>
                    </div>
                    <div class="linux-op">
                        <el-row :gutter=10>
                            <el-col :span="3.9">
                                <el-button type="primary"  size="mini" icon="el-icon-circle-plus-outline" @click="openDialogMth('add-assets', null)" v-if="isHidden(getRouterPath('assetsAdd', permissionList), permissionList)">新建服务器</el-button>
                            </el-col>
                            <el-col :span="3.9">
                                <el-button type="danger"  size="mini" icon="el-icon-delete-solid" @click="handleDelete(null, 'multi')" v-if="isHidden(getRouterPath('assetsDel', permissionList), permissionList)">删除服务器</el-button>
                            </el-col>
                            <!-- <el-col :span="3.9">
                                <el-button type="danger" icon="el-icon-mouse" size="mini" @click="runProcess('mul', null)" v-if="isHidden(getRouterPath('updateProgram', permissionList), permissionList)" :loading="submitLoading">批量更新程序</el-button>
                            </el-col>
                            <el-col :span="3.9">
                                <el-button type="danger" icon="el-icon-mouse" size="mini" @click="openDialogMth('cmd', null)" v-if="isHidden(getRouterPath('run-linux-cmd', permissionList), permissionList)" :loading="submitLoading">批量ansible作业</el-button>
                            </el-col> -->
                        </el-row>
                    </div>
                </div>
                <div class="table">
                    <transition name="el-zoom-in-center">
                        <div class="detail" v-show="detailView">
                            <el-row :gutter="5">
                                <h3 class="title-2">更新设置</h3>
                            </el-row>
                            <el-row :gutter="10" class="detail-content">
                                <el-col :span="6">
                                   <label class="detail-2">是否查看更新过程(默认关闭):</label> <el-switch v-model="isJump" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="detail-content">
                                <el-col :span="7">
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
                    <el-table-column prop="ip" label="服务器" width="180">
                        <template slot-scope="scope">
                            <el-link  :underline="false"  size="mini" plain @click="copyTextMth(scope.row.ip)">{{ scope.row.ip }}<i class="el-icon-document-copy el-icon-s"></i></el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="os_type" label="系统类型">
                        <template slot-scope="scope">
                            <el-link  :underline="false"  size="mini" v-if="scope.row.os_type === 1" plain>ubuntu</el-link>
                            <el-link  :underline="false"  size="mini" v-else-if="scope.row.os_type === 2" plain>centos</el-link>
                            <el-link  :underline="false"  size="mini" v-else-if="scope.row.os_type === 3" plain>debian</el-link>
                            <el-link  :underline="false"  size="mini" v-else plain>linux</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cluster" label="所属集群" width="180">
                        <template slot-scope="scope">
                            <!-- <el-link  :underline="false"  size="mini" v-if="scope.row.cluster.name != ''" plain>{{scope.row.cluster.name}}</el-link> -->
                            <el-link type="primary" :underline="false"  size="mini" plain v-if="scope.row.cluster.name != ''" >
                                <el-popover trigger="hover" placement="top">
                                    <p>集群ID: {{ scope.row.cluster.cluster_cid }}</p>
                                    <p>集群状态: {{ scope.row.cluster.status | getClusterStatus }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        {{ scope.row.cluster.name }}
                                    </div>
                                </el-popover>
                            </el-link>
                            <el-link type="danger" :underline="false"  size="mini" v-else plain>未分配集群</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="node_type" label="节点类型" width="150">
                        <template slot-scope="scope">
                            <el-link type="primary" :underline="false"  size="mini" v-if="scope.row.node_type === 1 && scope.row.cluster_id != ''" plain>主管理节点</el-link>
                            <el-link type="primary" :underline="false"  size="mini" v-else-if="scope.row.node_type === 2  && scope.row.cluster_id != ''" plain>工作节点</el-link>
                            <el-link type="danger" :underline="false"  size="mini" v-else plain>未分配节点类型</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="node_status" label="节点状态" width="150">
                        <template slot-scope="scope">
                            <el-link type="danger" :underline="false"  size="mini" v-if="scope.row.node_status === 100 && scope.row.cluster_id != ''" plain>异常</el-link>
                            <el-link type="primary" :underline="false"  size="mini" v-else-if="scope.row.node_status === 200  && scope.row.cluster_id != ''" plain>正常</el-link>
                            <el-link type="danger" :underline="false"  size="mini" v-else plain>未知节点状态</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="服务器状态" width="130">
                        <template slot-scope="scope">
                            <el-link type="success" :underline="false"  size="mini" v-if="scope.row.status === 200" plain>正常</el-link>
                            <el-link type="danger" :underline="false"  size="mini" v-else-if="scope.row.status === 100" plain>异常</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cpu_usage" label="cpu使用率" width="130">
                        <template slot-scope="scope">
                            <el-link type="danger" :underline="false"  size="mini" plain v-if="scope.row.cpu_usage >= 50">
                                <el-popover trigger="hover" placement="top" v-if="scope.row.cpu_usage >= 50">
                                    <p>cpu使用率已超过50%, 请及时处理!</p>
                                    <div slot="reference" class="name-wrapper">
                                        {{ scope.row.cpu_usage }}%
                                    </div>
                                </el-popover>
                            </el-link>
                            <!-- <el-link type="danger" :underline="false"  size="mini" plain v-if="scope.row.cpu_usage >= 50">{{ scope.row.cpu_usage }}%</el-link> -->
                            <el-link type="success" :underline="false"  size="mini" plain v-else>{{ scope.row.cpu_usage }}%</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ram_usage" label="内存使用率" width="130">
                        <template slot-scope="scope">
                            <el-link type="danger" :underline="false"  size="mini" plain v-if="scope.row.ram_usage >= 50">
                                <el-popover trigger="hover" placement="top" v-if="scope.row.ram_usage >= 50">
                                    <p>内存使用率已超过50%, 请及时处理!</p>
                                    <div slot="reference" class="name-wrapper">
                                        {{ scope.row.ram_usage }}%
                                    </div>
                                </el-popover>
                            </el-link>
                            <el-link type="success" :underline="false"  size="mini" plain v-else>{{ scope.row.ram_usage }}%</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="disk_usage" label="根磁盘使用率" width="180">
                        <template slot-scope="scope">
                            <el-link type="danger" :underline="false"  size="mini" plain v-if="scope.row.disk_usage >= 50">
                                <el-popover trigger="hover" placement="top" v-if="scope.row.disk_usage >= 50">
                                    <p>根磁盘使用率已超过50%, 请及时处理!</p>
                                    <div slot="reference" class="name-wrapper">
                                        {{ scope.row.disk_usage }}%
                                    </div>
                                </el-popover>
                            </el-link>
                            <!-- <el-link type="danger" :underline="false"  size="mini" plain v-if="scope.row.disk_usage >= 50">{{ scope.row.disk_usage }}%</el-link> -->
                            <el-link type="success" :underline="false"  size="mini" plain v-else>{{ scope.row.disk_usage }}%</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="start" label="更新时间" width="180">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.start | formatDate }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="580">
                        <template slot-scope="scope">
                            <el-button size="mini" type="warning" plain icon="el-icon-connection" @click="openDialogMth('term2', scope.row)" v-if="isHidden(getRouterPath('web-terminal', permissionList), permissionList)">终端连接</el-button>
                            <el-button size="mini" type="success" plain icon="el-icon-s-marketing" @click="getServerStatusMth(scope.row.ip, 1)" v-if="isHidden(getRouterPath('assets-res-vis', permissionList), permissionList)">资源监控</el-button>
                            <el-button size="mini" type="primary" plain icon="el-icon-view" @click="openDialogMth('log', scope.row)" v-if="isHidden(getRouterPath('view-system-log', permissionList), permissionList)">查看系统日志</el-button>
                            <el-button size="mini" icon="el-icon-edit" v-if="isHidden(getRouterPath('assetsUpdate', permissionList), permissionList)" @click="openDialogMth('update-assets', scope.row)">编辑</el-button>
                            <el-button class="pop-btn" size="mini" type="danger" slot="reference" @click="handleDelete(scope.row, 'sig')" icon="el-icon-delete-solid" plain v-if="isHidden(getRouterPath('assetsDel', permissionList), permissionList)">删除</el-button>
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
        <!-- 更新记录 -->
        <div class="section-5" v-if="isHidden(getRouterPath('updateList', permissionList), permissionList)">
            <el-card>
                <el-divider><i class="el-icon-s-help"></i>更新记录</el-divider>
                <!-- 状态查询 -->
                <div class="search">
                    <el-row :gutter=10>
                        <el-col :span=3.9>
                            <el-button-group>
                                <el-button type="warning"  size="mini" @click="getUpdateList('search','更新中', 300)">更新中</el-button>
                                <el-button type="success" size="mini" @click="getUpdateList('search','完成', 300)">完成</el-button>
                                <el-button type="danger"  size="mini" @click="getUpdateList('search','失败', 300)">失败</el-button>
                                <el-button type="primary" size="mini" @click="getUpdateList('page', '', 300)">取消实时刷新</el-button>
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
                        <transition name="el-zoom-in-center">
                            <el-col :span="3.9" v-if="realTimeRefreshBotVisible">
                                <el-link class="rr" type="primary" size="mini" :underline="false"><span>实时刷新中{{ realTimeRefreshBot }}</span></el-link>
                            </el-col>
                        </transition>
                        <el-col :span="1" class="col-last">
                            <el-tooltip class="item" effect="dark" content="刷新更新记录表" placement="top-start">
                                <el-button size="small" type="info" icon="el-icon-refresh" circle @click="getUpdateList('page', '', 200)"></el-button>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </div>
                <!-- 删除记录 -->
                <div  class="mv-bt">
                    <el-row :gutter=5>
                        <el-col :span="0.5">
                            <el-button type="danger" icon="el-icon-delete-solid" size="mini" @click="handleDelete2Mth">删除记录</el-button>
                        </el-col>
                    </el-row>
                </div>
                <!-- 更新记录表 -->
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
                            <el-link type="success" :underline="false"  size="mini" v-if="scope.row.status === 200" plain>完成</el-link>
                            <el-link type="danger" :underline="false"  size="mini" v-else-if="scope.row.status === 300" plain>失败</el-link>
                            <el-button type="warning" size="mini"  v-else-if="scope.row.status === 400" :loading="true" plain>更新中</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="progress" label="更新进度" width="250">
                        <template slot-scope="scope">
                            <el-progress :percentage="scope.row.progress" v-if="scope.row.status === 300" status="exception"></el-progress>
                            <el-progress :percentage="scope.row.progress" v-else-if="scope.row.progress === 100" status="success"></el-progress>
                            <el-progress :percentage="scope.row.progress" v-else></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column prop="process" label="更新日志" width="200">
                        <template slot-scope="scope">
                            <el-link slot="reference" type="success" @click="viewUpdateLog(scope.row)" v-if="scope.row.status === 300" disabled>查看更新日志</el-link>
                            <el-link slot="reference" type="success" @click="viewUpdateLog(scope.row)" v-else>查看更新日志</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="process" label="失败日志" width="200">
                        <template slot-scope="scope">
                            <el-link type="danger" @click="viewUpdateLog(scope.row)" v-if="scope.row.status === 200" disabled>
                                <el-popover trigger="hover" placement="top">
                                    <p class="p-pop">更新失败可以点击这里查看失败日志</p>
                                    <div slot="reference" class="name-wrapper">
                                        查看失败日志
                                    </div>
                                </el-popover>
                            </el-link>
                            <el-link type="danger" @click="viewUpdateLog(scope.row)" v-else>
                                <el-popover trigger="hover" placement="top">
                                    <p class="p-pop">更新失败可以点击这里查看失败日志</p>
                                    <div slot="reference" class="name-wrapper">
                                        查看失败日志
                                    </div>
                                </el-popover>
                            </el-link>
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
                            <i class="el-icon-odometer"></i>
                            <span style="margin-left: 10px" v-if="scope.row.cost_time">{{ scope.row.cost_time }}s</span>
                            <span style="margin-left: 10px" v-else>0s</span>
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
        <!-- 系统日志 -->
        <div class="create" >
            <el-dialog
                title="系统日志"
                :visible.sync="systemLogVisible"
                center
                @close="clearIplistMth"
                v-draggable
                :width="setDialogWth"
                >
                <div class="result-title run-linux-cmd-title">
                    <el-card>
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>已选择的服务器</strong></el-divider>
                        <p class="op-name">
                            <el-row :gutter="10">
                                <template v-for="(data, index) in ipList">
                                    <el-col :span="1.9">
                                        <el-tag :key="data.id" effect="plain"  type="success">{{ data.ip }}</el-tag>
                                    </el-col>
                                </template>
                            </el-row>
                        </p>
                    </el-card>
                </div>
                <div class="run-linux-cmd run-linux-cmd-content">
                    <el-card>
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>日志选择与查询</strong></el-divider>
                        <div class="one">
                            <el-radio-group v-model="logSelected">
                                <!-- <el-radio class="raido-el" size="mini" :border="true" :label="item.log" :key="item.id" v-for="(item, index) in systemLogList">{{ item.label }}</el-radio> -->
                                <el-radio class="raido-el" size="mini" :border="true" :label="item.log" :key="item.id" v-for="(item, index) in systemLogList">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{ item.desc }}</p>
                                        <span slot="reference" class="name-wrapper">
                                            {{ item.label }}
                                        </span>
                                    </el-popover>
                                </el-radio>                       
                            </el-radio-group>
                        </div>
                        <div class="two log-filter">
                            <el-row :gutter="10" class="detail-content">
                                <el-col :span="3.9" class="el-col-111">
                                    <el-input v-model="logFilterText" placeholder="过滤信息" size="mini" clearable></el-input>
                                </el-col>
                                <el-col :span="3.9" class="el-col-111">
                                    <el-date-picker
                                        size="mini"
                                        v-model="logDate"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        format="yyyy 年 MM 月 dd 日"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-col>
                                <el-col :span="3.9" class="el-col-111">
                                    <el-popconfirm :title="'确定查询吗?'"
                                            icon="el-icon-info"
                                            icon-color="red"
                                            confirm-button-text='确定'
                                            @confirm="filterSystemLogMth()"
                                        >
                                        <el-button class="pop-btn2" type="primary" :loading="filterSystemLogLoading" size="mini" slot="reference" plain icon="el-icon-search">查 询</el-button>
                                    </el-popconfirm>
                                </el-col>
                                <el-col :span="3.9" class="el-col-111">
                                    <el-popconfirm :title="'确定停止吗?'"
                                            icon="el-icon-info"
                                            icon-color="red"
                                            confirm-button-text='确定'
                                            @confirm="stopWsOutputMth()"
                                        >
                                        <el-button class="pop-btn2" type="danger" size="mini" slot="reference" plain icon="el-icon-video-pause">停 止</el-button>
                                    </el-popconfirm>
                                </el-col>
                            </el-row>
                        </div>

                    </el-card>
                </div>
                <div class="result-data">
                    <el-card v-loading="getLinuxCmdOutputLoading"
                            element-loading-text="正在拼命捕获命令输出..."
                            element-loading-spinner="el-icon-loading">
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>日志输出</strong></el-divider>
                        <div class="copy">
                            <!-- <el-button type="success" size="mini" plain @click="copy(content.join(''))" icon="el-icon-copy-document">复制</el-button> -->
                            <el-row :gutter=10>
                                <el-col :span="1.9">
                                    <el-button type="success" size="mini" plain @click="copy(content.join(''))" icon="el-icon-copy-document">复制</el-button>
                                </el-col>
                                <el-col :span="1.9">
                                    <el-button type="success" size="mini" plain @click="clearOutputMth()" icon="el-icon-delete-solid">清空</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="format-code">
                            <pre><code>{{ content.join('') }}</code></pre>
                        </div>
                    </el-card>
                </div>
            </el-dialog>
        </div>
        <!-- ansible作业 -->
        <div class="create">
            <el-dialog
                title="批量ansible作业"
                :visible.sync="runLinuxCmdVisible"
                :close-on-click-modal="true"
                center
                @close="clearIplistMth"
                :width="setDialogWth"
                v-draggable
                >
                <div class="result-title run-linux-cmd-title">
                    <el-card class="server-card">
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>已选择的服务器</strong></el-divider>
                        <p class="op-name server-op">
                            <el-row :gutter="10">
                                <template v-for="(data, index) in ipList">
                                    <el-col :span="1.9"  class="server-col">
                                        <el-tag :key="data.id" effect="plain"  type="success">{{ data.ip }}</el-tag>
                                    </el-col>
                                </template>
                            </el-row>
                        </p>
                    </el-card>
                </div>
                <div class="run-linux-cmd run-linux-cmd-content">
                    <el-card>
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>输入linxu命令</strong></el-divider>
                        <div class="run-linux-cmd-input">
                            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm fix-form-css">
                                <el-form-item prop="cmd">
                                    <el-input type="textarea" :rows="5" v-model="ruleForm.cmd" autocomplete="off" placeholder="请输入linux命令如:df -h" clearable></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer run-linux-cmd-footer">
                                <el-button @click="resetForm('ruleForm')" size="small" icon="el-icon-delete-solid">清空</el-button>
                                <el-popconfirm :title="'确定执行吗?'"
                                                icon="el-icon-info"
                                                icon-color="red"
                                                confirm-button-text='确定'
                                                @confirm="submitForm('ruleForm', runLinuxCmdMth)"
                                            >
                                    <el-button type="danger" :loading="runLinuxCmdlogLoading" size="small" slot="reference" icon="el-icon-mouse">确 定</el-button>
                                </el-popconfirm>
                            </span>
                        </div>
                    </el-card>
                </div>
                <div class="result-data">
                    <el-card v-loading="getLinuxCmdOutputLoading"
                            element-loading-text="正在拼命捕获命令输出..."
                            element-loading-spinner="el-icon-loading">
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>命令输出</strong></el-divider>
                        <div class="copy">
                            <!-- <el-button type="success" size="mini" plain @click="copy(content.join(''))" icon="el-icon-copy-document">复制</el-button> -->
                            <el-row :gutter=10>
                                <el-col :span="1.9">
                                    <el-button type="success" size="mini" plain @click="copy(content.join(''))" icon="el-icon-copy-document">复制</el-button>
                                </el-col>
                                <el-col :span="1.9">
                                    <el-button type="success" size="mini" plain @click="clearOutputMth()" icon="el-icon-delete-solid">清空</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="format-code">
                            <pre><code>{{ content.join('') }}</code></pre>
                        </div>
                    </el-card>
                </div>
            </el-dialog>
        </div>
        <!-- 添加服务器 -->
        <div class="create">
            <el-dialog
                title="添加服务器"
                :visible.sync="createVisible"
                center
                width="600px"
                v-draggable
                :before-close="clearDialogDataMth"
                >
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm fix-form-css">
                    <el-form-item label="项目名" prop="project">
                        <el-input  type="text" v-model="ruleForm.project" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="ip" prop="ip">
                        <el-input  type="text" v-model="ruleForm.ip" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="user">
                        <el-input  type="text" v-model="ruleForm.user" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input  type="password" v-model="ruleForm.password" autocomplete="off" show-password clearable></el-input>
                    </el-form-item>
                    <el-form-item label="秘钥" prop="key">
                        <div class="upload key">
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
                                    :file-list="keyFiles"
                                    :before-upload="fileList"
                                    multiple
                                    :auto-upload="false">
                                    <el-button slot="trigger" size="mini" type="info" icon="el-icon-s-finance">选取文件</el-button>
                                </el-upload>
                            </el-row>
                        </div>
                    </el-form-item>
                    <el-form-item label="端口" prop="port">
                        <el-input  type="text" v-model="ruleForm.port" autocomplete="off" clearable></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-popconfirm :title="`确定创建${ruleForm.ip}服务器吗?`"
                                    icon="el-icon-info"
                                    icon-color="red"
                                    confirm-button-text='确定'
                                    @confirm="submitForm('ruleForm', createServerMth)"
                                >
                        <el-button type="primary" :loading="createLoad" slot="reference">确 定</el-button>
                    </el-popconfirm>
                </span>
            </el-dialog>
        </div>
        <!-- 更新服务器 -->
        <div class="edit">
            <el-dialog
                title="更新服务器"
                :visible.sync="editVisible"
                center
                width="600px" 
                :before-close="clearDialogDataMth"
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
                        <el-input  type="text" v-model="ruleForm.ip" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="user">
                        <el-input  type="text" v-model="ruleForm.user" autocomplete="off" clearable :key="inputKey"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input  type="password" v-model="ruleForm.password" autocomplete="off" clearable show-password :key="inputKey"></el-input>
                    </el-form-item>
                    <el-form-item label="秘钥" prop="key">
                        <div class="upload key">
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
                                    :file-list="keyFiles"
                                    :before-upload="fileList"
                                    multiple
                                    :auto-upload="false">
                                    <el-button slot="trigger" size="mini" type="info" icon="el-icon-s-finance">选取文件</el-button>
                                </el-upload>
                            </el-row>
                        </div>
                    </el-form-item>
                    <el-form-item label="端口" prop="port">
                        <el-input  type="text" v-model="ruleForm.port" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="集群" prop="cluster">
                        <el-select v-model="ruleForm.cluster" placeholder="请选择集群" clearable>
                            <el-option
                                v-for="item in clusterList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="节点类型" prop="node_type">
                        <el-select v-model="ruleForm.node_type" placeholder="请选择节点类型" clearable>
                            <el-option
                                v-for="item in nodeTypeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-popconfirm :title="'确定修改吗?'"
                                    icon="el-icon-info"
                                    icon-color="red"
                                    confirm-button-text='确定'
                                    @confirm="submitForm('ruleForm', editServerMth)"
                                >
                        <el-button type="primary" :loading="editLoad" slot="reference">确 定</el-button>
                    </el-popconfirm>
                </span>
            </el-dialog>
        </div>
        <!-- 脚本日志 -->
        <div class="result">
            <el-dialog
                :title="upText"
                :visible.sync="resultVisible"
                v-draggable
                :close-on-click-modal="false"
                width="800px"
                center
                >
                <div class="result-title">
                    <el-card>
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>服务器</strong></el-divider>
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
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>日志输出</strong></el-divider>
                        <div class="copy">
                            <el-row :gutter="10">
                                <el-col :span="1.9">
                                    <el-button type="success" size="mini" plain @click="copy(content.join(''))" icon="el-icon-copy-document">复制</el-button>
                                </el-col>
                                <el-col :span="1.9">
                                    <el-button type="success" size="mini" plain @click="clearOutputMth()" icon="el-icon-copy-document">清空</el-button>
                                </el-col>
                            </el-row>
                            <!-- <el-button type="success" size="mini" plain @click="copy(content.join(''))" icon="el-icon-copy-document">复制</el-button> -->
                        </div>
                        <div class="format-code">
                            <pre><code>{{ content.join('') }}</code></pre>
                        </div>
                    </el-card>
                </div>
                </el-dialog>
        </div>
        <!-- 添加操作 -->
        <div class="add-operate">
            <el-dialog
                title="添加操作"
                :visible.sync="addOpDialogVisible"
                width="500px"
                :close-on-click-modal="true"
                v-draggable
                center
                >
                <el-form :model="ruleForm" status-icon label-position="right" :rules="rules" ref="ruleForm" label-width="100px" class="progame-add">
                    <el-form-item label="操作中文名" prop="cnname">
                        <el-input type="name" v-model="ruleForm.cnname" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="操作英文名" prop="enname">
                        <el-input type="name" v-model="ruleForm.enname" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="请求地址" prop="path">
                        <el-input type="name" v-model="ruleForm.path" autocomplete="off" clearable></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-popconfirm :title="'确定添加【'+ruleForm.cnname+'】吗?'"
                                    icon="el-icon-info"
                                    icon-color="red"
                                    confirm-button-text='确定'
                                    @confirm="submitForm('ruleForm', createProgramOpMth)"
                                >
                        <el-button type="primary" :loading="addOpLoad" slot="reference">确 定</el-button>
                    </el-popconfirm>
                </span>
            </el-dialog>
        </div>
        <!-- 分发文件窗口 -->
        <div class="syncFile">
            <el-dialog
                title="文件同步"
                :visible.sync="syncFileVisible"
                :close-on-click-modal="true"
                width="800px"
                center
                :width="setDialogWth"
                @close="clearIplistMth"
                v-draggable
                >
                <div class="result-title">
                    <el-card v-loading="syncFileLoading"
                            element-loading-text="正在拼命同步中..."
                            element-loading-spinner="el-icon-loading">
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>文件MD5</strong></el-divider>
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
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>分发到服务器返回的文件MD5</strong></el-divider>
                        <div class="copy">
                            <el-button type="success" size="mini" plain @click="copy(syncFileContent.join(''))"  icon="el-icon-copy-document">复制</el-button>
                        </div>
                        <div class="format-code">
                            <pre><code>{{ syncFileContent.join('') }}</code></pre>
                        </div>
                    </el-card>
                </div>
                </el-dialog>
        </div>
        <!-- 连接终端 -->
        <div class="result">
            <el-dialog
                title="linux终端"
                :visible.sync="terminal2Visible"
                v-draggable
                :close-on-click-modal="false"
                width="800px"
                @opened="handleTerminalOpenMth"
                @closed="handleTerminalClosedMth"
                center
                >
                <div class="result-title run-linux-cmd-title">
                    <el-card>
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>已选择的服务器</strong></el-divider>
                        <p class="op-name">
                            <el-row :gutter="10">
                                <template v-for="(data, index) in ipList">
                                    <el-col :span="1.9">
                                        <el-tag :key="data.id" effect="plain"  type="success">{{ data.project }}</el-tag>
                                    </el-col>
                                    <el-col :span="1.9">
                                        <el-tag :key="data.id" effect="plain"  type="success">{{ data.ip }}</el-tag>
                                    </el-col>
                                </template>
                            </el-row>
                        </p>
                    </el-card>
                </div>
                
                <div class="result-data">
                    
                    <el-card v-loading="terminalLoading"
                            element-loading-text="正在拼命连接中..."
                            element-loading-spinner="el-icon-loading">
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>终端</strong></el-divider>
                        <div class="copy">
                            <el-button type="warning" size="mini" plain @click="reConnectMth" icon="el-icon-connection">重新连接</el-button>
                        </div>
                        <div class="format-code format-code-terminal">
                            <terminal ref="terminalComponent" v-if="terminal2Visible" :key="terminalKey" :ws-url="wsUrl"></terminal>
                        </div>
                    </el-card>
                </div>
                </el-dialog>
        </div>
        <!-- 资源使用率可视化 -->
        <div class="res-vis">
            <el-dialog
                :title="serverInfo"
                :visible.sync="resourcesVisible"
                v-draggable
                :close-on-click-modal="false"
                center
                :width="setDialogWth"
                custom-class="cus-dia-center"
                :show-close="true"
           
                >
                <!-- <div class="time-select" >
                    <el-button type="info" size="mini" plain @click="getServerStatusMth(selectIp, 3)">近5天</el-button>
                </div> -->
                <div class="box-card" v-loading="statuLoading">
                    <!-- <VeLine :title="cpuTitle" :legend="legend" :data="cpuLoadData" :settings="chartSettings" :extend="chartExtend1"/> -->
                    <VeLine :data="cpuLoadData" :settings="chartSettings" :extend="chartExtend1"/>
                </div>
                <div class="box-card" v-loading="statuLoading">
                    <VeLine :data="memUsageData" :settings="chartSettings" :extend="chartExtend2"/>
                </div>
                <div class="box-card" v-loading="statuLoading">
                    <VeLine :data="diskUsageData" :settings="chartSettings" :extend="chartExtend3"/>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'; // 引入折线图组件
import 'v-charts/lib/style.css'
import { Message, MessageBox } from 'element-ui';
import { mapState } from 'vuex';
import { getServerStatus, getClusterList, getAssetsList, getProcessStatus, createProgramUpdateRecord, runProgram, getUpdateList, assetsUpload, createServer, delServer, editServer, ProgramAdd, getProgramList, webTerminal, programUpdateRecordDel } from '../../api';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import baseUrl from "../../utils/baseUrl";
import wssUrl from "../../utils/wssUrl";
import {validatePath, validateCmd, validateproject, validateip, validateuser, validateOpCNName, validateOpENName} from "../../utils/validators";
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import SparkMD5 from 'spark-md5';
import md5 from 'blueimp-md5';
import { isHidden, getRouterPath } from '@/utils/utils';
import  terminal  from '../assets/terminal'
// import 'xterm/css/xterm.css';
// import { Terminal } from "xterm";

// import draggable from 'vuedraggable'
// import { VueDraggableResizable } from 'vue-draggable-resizable'

export default {
    name: "servers",
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
    data () {
        return {
            chartExtend: {
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0, // 强制显示所有刻度
                        rotate: 30, // 旋转以防重叠
                    },
                },
            },
            chartExtend1: {
                legend: {
                    left: 'left',
                    top: 'bottom'
                },
                title: {
                    text: '服务器cpu负载走势图',
                    subtext: '单位：1分钟负载',
                    left: 'center',
                    top: 'top',
                    subtextStyle: {
                        color: '#de4751',
                        fontSize: 12
                    },
                    textStyle: {
                        fontSize: 12
                    }
                },
                color: ['#409EFF'], // 这里设置线条和区域颜色
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0, // 强制显示所有刻度
                        rotate: 30, // 旋转以防重叠
                    },
                },
                series: {
                    // 也可以更细致地设置线条样式、填充色等
                    areaStyle: {
                        opacity: 0.3
                    }
                }
            },
            chartExtend2: {
                legend: {
                    left: 'left',
                    top: 'bottom'
                },
                title: {
                    text: '服务器内存使用率走势图',
                    subtext: '单位：百分比',
                    left: 'center',
                    top: 'top',
                    subtextStyle: {
                        color: '#de4751',
                        fontSize: 12
                    },
                    textStyle: {
                        fontSize: 12
                    }
                },
                color: ['#ff7f50'], // 这里设置线条和区域颜色
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0, // 强制显示所有刻度
                        rotate: 30, // 旋转以防重叠
                    },
                },
                series: {
                    // 也可以更细致地设置线条样式、填充色等
                    areaStyle: {
                        opacity: 0.3
                    }
                }
            },
            chartExtend3: {
                legend: {
                    left: 'left',
                    top: 'bottom'
                },
                title: {
                    text: '服务器根目录使用率走势图',
                    subtext: '单位：百分比',
                    left: 'center',
                    top: 'top',
                    subtextStyle: {
                        color: '#de4751',
                        fontSize: 12
                    },
                    textStyle: {
                        fontSize: 12
                    }
                },
                color: ['#67C23A'], // 这里设置线条和区域颜色
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0, // 强制显示所有刻度
                        rotate: 30, // 旋转以防重叠
                    },
                },
                series: {
                    // 也可以更细致地设置线条样式、填充色等
                    areaStyle: {
                        opacity: 0.3
                    }
                }
            },
            chartSettings: {
                area: true, // 区域内填充颜色
                smooth: true, // 开启平滑曲线
                xAxisType: 'category',
            },
            cpuLoadData: {
                columns: ["time", "data"],
                rows: [{"time": "06/17 15:04", "data": 0}],
            },
            memUsageData: {
                columns: ["time", "data"],
                rows: [{"time": "06/17 15:04", "data": 0}],
            },
            diskUsageData: {
                columns: ["time", "data"],
                rows: [{"time": "06/17 15:04", "data": 0}],
            },
            windowWidth: window.innerWidth,
            resourcesVisible: false,
            filterSystemLogLoading: false,
            serverOsTypeSearch: "",
            serverNodeStatusSearch: "",
            serverNodeTypeSearch: "",
            serverStatusSearch: "",
            terminalKey:0,
            clusterSearch: "",
            nodeTypeList: [
                {id: 1, name: "主管理节点",},
                {id: 2, name: "工作节点",},
                {id: 3, name: "未分配节点类型",},
            ],
            statusList: [
                {id: 100, name: "异常",},
                {id: 200, name: "正常",},
                {id: 300, name: "未知节点状态",},
            ],
            osList: [
                {id: 1, name: "ubuntu",},
                {id: 2, name: "centos",},
                {id: 3, name: "debain",},
            ],
            inputKey: 0,
            nodeTypeSelected:"",
            clusterIDSelected: "",
            clusterList: [],
            keyFiles: [],
            wsUrl: "",
            termWs: null,
            term: null,
            terminal2Visible: false,
            frameVisible: false,
            iframeKey: 0,
            terminalUrl: "",
            terminalLoading: false,
            terminalVisible: false,
            loopAssetsListSetInterval: null,
            setDialogWth: "500px",
            outputWs: null,
            logFilterText: "",
            logDate: "",
            logSelected: "",
            systemLogVisible: false,
            cmdIPListKey: "cmd-ip-list",
            refreshAssetsStatusInterval: 3600000,
            ipList: [],
            getLinuxCmdOutputLoading: false,
            runLinuxCmdlogLoading: false,
            runLinuxCmdVisible: false,
            realTimeRefreshBotVisible: false,
            realTimeInterval: null,
            realTimeRefreshBot: "",
            upText: "更新日志",
            addOpLoad: false,
            addOpDialogVisible: false,
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
            statuLoading: false,
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
                user: '',
                password: '',
                key: '',
                port: 22,
                key: '',
                cnname: '',
                enname: '',
                path: '',
                cmd: '',
                cluster: '',
                node_type: '',
            },
            rules: {
                project: [
                    { validator: validateproject, trigger: 'blur' }
                ],
                ip: [
                    { validator: validateip, trigger: 'blur' }
                ],
                user: [
                    { validator: validateuser, trigger: 'blur' }
                ],
                cnname: [
                    { validator: validateOpCNName, trigger: 'blur' }
                ],
                enname: [
                    { validator: validateOpENName, trigger: 'blur' }
                ],
                path: [
                    { validator: validatePath, trigger: 'blur' }
                ],
                cmd: [
                    { validator: validateCmd, trigger: 'blur' }
                ],
            },
            systemLogList: [
                {id: 1, log: "cron", label: "cron日志", desc: "如果系统中有定时任务需要检查，或者任务执行失败时，查看该日志文件"},
                {id: 2, log: "syslog", label: "syslog日志", desc: "包含系统中几乎所有的日志信息，包括启动过程、应用程序日志和其他系统事件"},
                {id: 3, log: "auth.log", label: "auth日志", desc: "对于用户行为审计和安全分析至关重要"},
                {id: 4, log: "kern.log", label: "kern日志", desc: "对于内核崩溃、硬件故障及与内核相关的问题，kern.log 是诊断的关键"},
                {id: 5, log: "secure", label: "secure日志", desc: "对于用户行为审计和安全分析至关重要"},
                {id: 6, log: "boot.log", label: "boot日志", desc:"用于分析系统启动过程中出现的问题，检查启动过程中某些服务是否没有成功启动"},
            ],
            programList: [],
            programName: {},
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
        terminal,
        VeLine,
    },
    methods: {
        isHidden, 
        getRouterPath,
        async getServerStatusMth(ip, days) {
            this.statuLoading = true;
            this.resourcesVisible = true;
            this.serverInfo = `${ip} 状态监控`;
            this.selectIp = ip;
            const resp = await getServerStatus({ip: this.selectIp, days: days}).finally(()=>{
                this.statuLoading = false;
            });
            if (resp.data.code === 10000) {
                this.cpuLoadData = resp.data.cpu;
                this.memUsageData = resp.data.mem;
                this.diskUsageData = resp.data.disk;
                return;
            }
            Message.error(resp.data.message);
        },
        copyTextMth(text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    Message.success('复制成功！');
                })
                .catch(err => {
                    Message.error('复制失败，请手动复制');
                });
        },
        handleDelete2Mth() {
            if (this.multipleSelection2.length == 0) {
                Message.error("请勾选需要删除的内容");
                return;
            }
            MessageBox.confirm(`确定删除勾选的id：${this.multipleSelection2.map(item => item.id)}吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delProgramUpdateRecordMth();
            }).catch((err) => {     
            });
        },
        async delProgramUpdateRecordMth() {
            var data = JSON.stringify({id: this.multipleSelection2.map(item => item.id),});
            const resp = await programUpdateRecordDel(data, this.callMethod);
            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message);
            }
            this.getUpdateList("page", '', 200);
            Message.success(resp.data.message);
        },
        reConnectMth() {
            this.$refs.terminalComponent.clearTerminal();
            // this.handleTerminalOpenMth();
        },
        clearDialogDataMth(done ) {
            this.resetForm('ruleForm');
            done();
        },
        handleTerminalClosedMth() {
            if (this.$refs.terminalComponent) {
                this.$refs.terminalComponent.disconnect();
                this.terminalKey++;
            }
        },
        handleTerminalOpenMth() {
            this.$nextTick(() => {
            // 延迟确保DOM更新完成
            setTimeout(() => {
                if (this.$refs.terminalComponent) {
                    // 调用子组件初始化方法
                    this.$refs.terminalComponent.initConnection();
                    // 强制刷新组件解决缓存问题

                }
                }, 300)
            })
        },
        beforeCloseDiaMth(done) {
            this.terminal2Visible = false;
            done();
            this.$nextTick(() => {
                document.body.focus();
            });
        },
        webTerminalMth() {
            if (this.ipList.length == 0) {
                return Message.error("请选择服务器");
            }
            let id = this.ipList[0].id;
            return `${baseUrl}${this.getRouterPath('web-terminal', this.permissionList)}?server_id=${id}&user=${sessionStorage.getItem("user")}&token=${sessionStorage.getItem("token")}`;
        },
        getRouterPathMth(name, routes) {
            for (const route of routes) {
                if (route.name === name) {
                    return route.path;
                }
                if (route.children && route.children.length) {
                    const childPath = this.getRouterPathMth(name, route.children);
                    if (childPath) {
                        return childPath;
                    }
                }
            }
            return null;
        },
        getCurrentWindowsResizeMth() {
            const browserWidth = document.documentElement.clientWidth;
            const halfWidth = browserWidth / 2;
            this.setDialogWth = Math.round(halfWidth)+"px";
        },
        listenWindowsResizeMth() {
            window.addEventListener("resize", () => {
                const browserWidth = window.innerWidth;
                const halfWidth = browserWidth / 2;
                this.setDialogWth = Math.round(halfWidth)+"px";
            });
        },
        stopWsOutputMth() {
            this.outputWs.close();
            this.outputWs = null;
        },
        formatDateStringMth(dateString) {
            // 定义月份的缩写
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            
            // 拆分日期字符串
            const [month, day] = dateString.split('-');
            
            // 解析月份和日期
            const monthIndex = parseInt(month, 10) - 1;
            const dayWithoutLeadingZero = parseInt(day, 10); // 去掉前导 0
            
            // 获取缩写的月份名
            const monthName = monthNames[monthIndex];
            
            return `${monthName} \\+${dayWithoutLeadingZero}`;
        },
        filterSystemLogMth() {
            if (!this.logSelected) {
                return Message.error("请选择日志类型");
            }
            if (!this.logFilterText) {
                return Message.error("过滤字段不能为空");
            }
            this.filterSystemLogLoading = true;
            this.getLinuxCmdOutputLoading = true;
            let data = {
                ip: this.ipList.map(item => item.ip),
                name: "checkSystemLog",
                log_name: this.logSelected,
                start: this.logDate[0],
                end: this.logDate[1],
                field: this.logFilterText,
            };
            var path = this.getRouterPathMth('view-system-log', this.permissionList);
            this.multiContentOutputMth(path, data, false, 'filter-system-log');
        },
        clearIplistMth() {
            this.delstrogage(this.cmdIPListKey);
        },
        delstrogage(key) {
            sessionStorage.removeItem(key);
        },
        setDataStroage(key, data) {
            sessionStorage.setItem(key, JSON.stringify(data));
        },
        getDataStroage(key) {
            return JSON.parse(sessionStorage.getItem(key));
        },
        clearOutputMth() {
            this.content = [];
        },
        runLinuxCmdMth() {
            this.runLinuxCmdlogLoading = true;
            this.getLinuxCmdOutputLoading = true;
            this.ipList = this.getDataStroage(this.cmdIPListKey);
            let data = {
                ip: this.ipList.map(item => item.ip),
                name: "runLinuxCmd",
                uuid: "",
                cmd: this.ruleForm.cmd,
            };
            var path = this.getRouterPathMth('run-linux-cmd', this.permissionList);
            this.multiContentOutputMth(path, data, false, 'run-cmd');
        },
        openDialogMth(name, data) {
            this.content = [];
            var ipList = [];
            if (name === "cmd") {
                if (this.multipleSelection.length === 0) {
                    return Message.error("请选择服务器");
                }
                this.setDataStroage(this.cmdIPListKey, this.multipleSelection);
                this.ipList = this.getDataStroage(this.cmdIPListKey);
                this.runLinuxCmdVisible = true;
            } else if (name === "log") {
                this.setDataStroage(this.cmdIPListKey, [data]);
                this.ipList = this.getDataStroage(this.cmdIPListKey);
                this.systemLogVisible = true;
            } else if (name === "term") {
                this.setDataStroage(this.cmdIPListKey, [data]);
                this.ipList = this.getDataStroage(this.cmdIPListKey);
                this.terminalVisible = true;
                this.frameVisible = true;
                this.terminalUrl = this.webTerminalMth();
            } else if (name === "term2") {
                this.setDataStroage(this.cmdIPListKey, [data]);
                this.ipList = this.getDataStroage(this.cmdIPListKey);
                this.frameVisible = true;
                this.terminal2Visible = true;
                let ip = this.ipList[0].ip;
                this.wsUrl = `${wssUrl}${this.getRouterPath('web-terminal', this.permissionList)}?ip=${ip}&user=${sessionStorage.getItem("user")}&token=${sessionStorage.getItem("token")}`
            } else if (name === "update-assets") {
                this.setDataStroage(this.cmdIPListKey, [data]);
                this.ipList = this.getDataStroage(this.cmdIPListKey);
                this.editVisible = true;
                this.openEditDialog(data);
                
            } else if (name === "add-assets") {
                this.createVisible = true;
            }
        },
        updateRealTimeRefreshMth() {
            this.realTimeInterval = setInterval(() => {
                this.realTimeRefreshBot += '.';
                if (this.realTimeRefreshBot.length > 3) {
                    this.realTimeRefreshBot = ''; 
                }
            }, 500);
        },
        handleCreateProgramOpMth() {
            this.addOpDialogVisible = true;
        },
        async getProgramListMth() {
            let data = {
                cnname: "",
                enname: "",
                path: "",
            };
            const resp = await getProgramList(data);
            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message)
            }
            this.programList = resp.data.data.pl;
            this.programName = resp.data.data.pn;
        },
        async createProgramOpMth() {
            const resp = await ProgramAdd({cnname: this.ruleForm.cnname, enname: this.ruleForm.enname, path: this.ruleForm.path}, this.callMethod)
            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message);
            }

            this.programList = resp.data.data.pl;
            this.programName = resp.data.data.pn;
            Message.success(resp.data.message);
        },
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
        async delServerMth(action, row) {
            let data = "";
            if (action == 'multi') {
                data = JSON.stringify({id: this.multipleSelection.map(item => item.id)});
            } else if (action == 'sig') {
                let dl  = [];
                dl.push(row.id)
                data = JSON.stringify({id: dl});
            } else {
                Message.error("未知类型");
                return;
            }
            this.tableLoad = true;

            const resp = await delServer(data, this.callMethod)
            if (resp.data.code !== 10000) {
                Message.error(resp.data.message);
            } else {
                this.getAssetsList("page");
                Message.success(resp.data.message)
            }
            this.tableLoad = false;
        },
        async createServerMth() {
            if (this.$refs.upload.uploadFiles.length === 0 && this.ruleForm.password == "") {
                return Message.error('服务器密码或者密钥不能为空, 请选择其中一个');
            }

            if (this.$refs.upload.uploadFiles.length != 0 && this.ruleForm.password != "") {
                return Message.error('服务器密码或者密钥不能同时选择, 请选择其中一个');
            }

            let formData = new FormData();
            formData.append('project', this.ruleForm.project);
            formData.append('operator', sessionStorage.getItem('user'));
            formData.append('ip', this.ruleForm.ip);
            formData.append('user', this.ruleForm.user);
            formData.append('password', this.ruleForm.password);
            formData.append('port', this.ruleForm.port);
            // formData.append('cluster_id', this.ruleForm.cluster);
            // formData.append('node_type', this.ruleForm.node_type);
            if (this.$refs.upload.uploadFiles.length === 0) {
                formData.append('connect_type', 1); // 密码登陆
            } else { // key登陆
                let file = this.fileList[0];
                formData.append('file', file.raw);
                formData.append('connect_type', 2);
            }
            
            // 操作
            this.createLoad = true;
            const resp = await createServer(formData, this.callMethod);
            if (resp.data.code !== 10000) {
                Message.error(resp.data.message)
            } else {
                this.getAssetsList("page");
                Message.success(resp.data.message)
            }
            this.fileList = [];
            this.createLoad = false;
        },
        async editServerMth() {
            if (this.$refs.upload.uploadFiles.length === 0 && this.ruleForm.password == "") {
                return Message.error('服务器密码或者密钥不能为空, 请选择其中一个');
            }

            if (this.$refs.upload.uploadFiles.length != 0 && this.ruleForm.password != "") {
                return Message.error('服务器密码或者密钥不能同时选择, 请选择其中一个');
            }

            let formData = new FormData();
            formData.append('id', this.selectId);
            formData.append('project', this.ruleForm.project);
            formData.append('operator', sessionStorage.getItem('user'));
            formData.append('ip', this.ruleForm.ip);
            formData.append('user', this.ruleForm.user);
            formData.append('password', this.ruleForm.password);
            formData.append('port', this.ruleForm.port);
            // formData.append('cluster_id', this.ruleForm.cluster);
            // formData.append('node_type', this.ruleForm.node_type);
            if (this.$refs.upload.uploadFiles.length === 0) {
                formData.append('connect_type', 1); // 密码登陆
            } else { // key登陆
                let file = this.fileList[0];
                formData.append('file', file.raw);
                formData.append('connect_type', 2);
            }
            
            // 操作
            this.editLoad = true;
            const resp = await editServer(formData, this.callMethod);
            if (resp.data.code !== 10000) {
                Message.error(resp.data.message)
            } else {
                this.getAssetsList("page");
                Message.success(resp.data.message)
            }
            
            this.fileList = [];
            this.editLoad = false;
        },
        openCreateDialog() {
            this.ruleForm.project = "";
            this.ruleForm.ip = "";
            this.createVisible = true;
        },
        openEditDialog(row) {
            // this.editVisible = true;
            this.selectId = row.id;
            this.ruleForm.project = row.project;
            this.ruleForm.ip = row.ip;
            if (row.cluster.id > 0) {
                this.ruleForm.cluster = row.cluster.id;
            }
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
            var path = this.getRouterPathMth('uploadFile', this.permissionList);
            return `${baseUrl}${path}`;
        },
        // 显示文件MD5码
        showFileMd5() {
            let fl = this.$refs.upload.uploadFiles;
            let n = "";
            let o = "";
            fl.forEach((file)=>{
                let blob = new Blob([file.raw], { type: file.type });
                let reader = new FileReader();
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
        },
        // 文件上传
        async uploadFile() {
            
            if (this.$refs.upload.uploadFiles.length === 0) {
                console.log("this.$refs.upload.uploadFiles.length 111 >>> ", this.$refs.upload.uploadFiles.length);
                return Message.error('请选取文件')
            }
            
            if (this.multipleSelection.length === 0) {
                return Message.error('请选勾选服务器')
            }

            this.setDataStroage(this.cmdIPListKey, this.multipleSelection);
            this.ipList = this.getDataStroage(this.cmdIPListKey);

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
                    title = "服务器: " + ip.join("&") + ", 确定操作: 【" + name + "】吗？";
                    this.open('sin', title, name, index);
                    break
                case "mul":
                    title = "服务器: " + ip.join("&") + ", 确定操作: 【" + this.selectVal.join("&") + "】吗？";
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
            })
        },
        // 创建uuid
        createUuid() {
            return uuidv4();
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
                    this.programList[index].load = true;
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
            const resp = await this.createProgramUpdateRecordMth(data_list);
            if (resp.data.code === 10000) {
                this.actualTimeGetTaskStatus();
                Message.success(resp.data.message);
            } else {
                Message.error(resp.data.message);
            }

            if (action==="sin") {
                this.programList[index].load = false;
            } else if (action==="mul") {
                this.submitLoading = false;
            }
        },
        // 添加更新记录
        async createProgramUpdateRecordMth(data) {
            const resp = await createProgramUpdateRecord(JSON.stringify({data_list: data}), this.callMethod);
            return resp
        },
        // 实时获取任务状态
        actualTimeGetTaskStatus() {
            this.realTimeRefreshBotVisible = true;
            this.timer = setInterval(() => {
                this.getUpdateList("page", "", 200, false);
            }, 2500)
        },
        // 是否需要在新的页面打开，实时查看更新脚本的输出内容
        async runningJumpOrNot(data_list) {
            var path = this.getRouterPathMth('assetsUpdate', this.permissionList);
            for (let i = 0;i < data_list.length;i++) {
                // 在新的页面执行
                if (this.isJump) {
                    let routeData = this.$router.resolve(
                        { path: `${path}/${data_list[i].project}/${data_list[i].ip}/${this.programName[data_list[i].update_name]}/${data_list[i].uuid}` }
                    );
                    sessionStorage.setItem("not_allow_flush", 1);
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
                update_name: this.programName[data.update_name]
            }, this.callMethod).catch((err)=>{Message.error(err)});
            return resp
        },
        // 查看脚本执行的输出
        viewUpdateLog (row) {
            this.content = [];
            this.resultVisible = true;
            this.curIp = row.ip;
            this.curName = row.update_name;
            this.curProject = row.project;
            this.upText = (row.status == 200 || row.status == 400) ? "更新日志" : "失败日志";
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
            var data = {};
            switch (mode) {
                case "page":
                    pageNum = this.pages.curPage;
                    break
                case "search":
                    pageNum = 1;
                    break
            }
            
            if (this.clusterSearch) {
                let cluser_id = this.clusterList.find(item => item.id === this.clusterSearch)?.id;
                data = {
                    page: pageNum,
                    ip: this.serverSearch,
                    project: this.projectSearch,
                    cluster_id: cluser_id,
                    status: this.serverStatusSearch,
                    node_status: this.serverNodeStatusSearch,
                    node_type: this.serverNodeTypeSearch,
                    os_type: this.serverOsTypeSearch,
                };
            } else {
                data = {
                    page: pageNum,
                    ip: this.serverSearch,
                    project: this.projectSearch,
                    status: this.serverStatusSearch,
                    node_status: this.serverNodeStatusSearch,
                    node_type: this.serverNodeTypeSearch,
                    os_type: this.serverOsTypeSearch,
                };
            }

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

            // 1️⃣ 过滤掉 name 为空的对象
            const filteredArr = this.dataList.filter(item => item.cluster.name);

            // 2️⃣ 根据 name 去重，保留第一次出现的
            const seen = new Set();
            const result = filteredArr.filter(item => {
            if (seen.has(item.cluster.name)) {
                return false;
            }
            seen.add(item.cluster.name);
            return true;
            });

            this.clusterList = result.map(item => item.cluster);
            
            // this.programList = resp.data.config.config;
            // this.programName = resp.data.config.select;

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
                this.realTimeRefreshBotVisible = false;
                clearInterval(this.timer);
                this.timer = null;
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
            
            const resp = await getUpdateList(data).catch((err)=>{
                this.tableLoad2 = false;
                this.realTimeRefreshBotVisible = false;
            });

            if (resp.data.code !== 10000) {
                clearInterval(this.timer);
                this.timer = null;
                return Message.error(resp.data.message)
            }

            this.pages2.curPage = pageNum;
            this.dataList2 = resp.data.data;
            this.pages2.pageSize = resp.data.pageSize;
            this.total2 = resp.data.total;
            this.tableLoad2 = false;
        },
        handleDelete (data, actionType) {
            if (actionType == 'multi') {
                if (this.multipleSelection.length == 0) {
                    Message.error("请勾选需要删除的服务器");
                    return;
                }
                MessageBox.confirm(`确定删除勾选的ip：${this.multipleSelection.map(item => item.ip)}？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.delServerMth(actionType, null);
                }).catch((err) => {     
                });
            } else if (actionType == 'sig') {
                MessageBox.confirm(`确定删除ip：${data.ip}？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delServerMth(actionType, data);
                }).catch((err) => {     
                });
            } else {
                Message.error("未知类型");
            }
            
            
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
        multiContentOutputMth(ws, data, loading, operate_type) {
            this.outputWs = new WebSocket(`${wssUrl}${ws}?user=${sessionStorage.getItem("user")}&token=${sessionStorage.getItem("token")}`);
            this.outputWs.onopen = () => {
                console.log('WebSocket连接已打开');
                this.outputWs.send(JSON.stringify(data));
            };
            this.outputWs.onmessage = (event) => {
                this.getLinuxCmdOutputLoading = loading;
                this.content.push(event.data);
                let div = document.querySelector(".result-data");
                div.scrollTop = div.scrollHeight - div.clientHeight;
            };
            this.outputWs.onclose = () => {
                if (operate_type=='run-cmd') {
                    this.runLinuxCmdlogLoading = false;
                }
                if (operate_type=='filter-system-log') {
                    this.filterSystemLogLoading = false;
                }
                this.getLinuxCmdOutputLoading = loading;
                console.log('WebSocket连接已关闭');
            };
            this.outputWs.onerror = (error) => {
                if (operate_type=='run-cmd') {
                    this.runLinuxCmdlogLoading = false;
                }
                if (operate_type=='filter-system-log') {
                    this.filterSystemLogLoading = false;
                }
                this.getLinuxCmdOutputLoading = loading;
                Message.error('WebSocket连接失败:', error);
            };
        },
        contentOutput(val) {
            var path = this.getRouterPathMth('assetsWs', this.permissionList);
            this.logLoading = true;
            var ipList = [];
            ipList.push(val.ip);
            let data = {
                ip: ipList,
                name: this.programName[val.update_name]+"Log",
                uuid: val.uuid,
                cmd: val.cmd ? val.cmd : "",
            };
            this.ws = new WebSocket(`${wssUrl}${path}?user=${sessionStorage.getItem("user")}&token=${sessionStorage.getItem("token")}`);
            this.ws.onopen = () => {
                console.log('WebSocket连接已打开');
                this.ws.send(JSON.stringify(data));
            };
            this.ws.onmessage = (event) => {
                this.logLoading = false;
                this.content.push(event.data);
                let div = document.querySelector(".result-data");
                div.scrollTop = div.scrollHeight - div.clientHeight;
            };
            this.ws.onclose = () => {
                console.log('WebSocket连接已关闭');

            };
            this.ws.onerror = (error) => {
                this.logLoading = false;
                Message.error('WebSocket操作失败:', error);
            };
        },
        // 分发文件并返回分发完毕后的文件md5码
        syncFileOutput() {
            var path = this.getRouterPathMth('syncFileWs', this.permissionList);
            this.logLoading = true;
            this.syncFileLoading = true;
            let data = {
                ip: this.multipleSelection.map(item => item.ip),
                file: this.fileList.map(file => file.name)
            }
            this.ws = new WebSocket(`${wssUrl}${path}?user=${sessionStorage.getItem("user")}&token=${sessionStorage.getItem("token")}`);
            this.ws.onopen = () => {
                this.logLoading = false;
                console.log('WebSocket连接成功');
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
                // Message.success("同步完成");
            };
            this.ws.onerror = (error) => {
                this.logLoading = false;
                Message.error('WebSocket连接失败: ', error);
                this.syncFileLoading = false;
            };
        },
        loopGetAssetsList() {
            this.loopAssetsListSetInterval = setInterval(() => {
                this.getAssetsList("page");
            }, this.refreshAssetsStatusInterval);
        },
        callMethod() {},
    },
    mounted () {
        // this.terminal2Visible = true;
        this.getUpdateList("page", '', 200);
        this.getAssetsList("page");
        // this.loopGetAssetsList();
        this.getProgramListMth();
        this.updateRealTimeRefreshMth();
        this.getCurrentWindowsResizeMth();
        this.listenWindowsResizeMth();
    },
    beforeDestroy() {
        // 3️⃣ 页面销毁时，关闭 ws 并移除监听this.outputWs
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        if (this.outputWs) {
            this.outputWs.close();
            this.outputWs = null;
        }
   
        // 移除监听，避免内存泄露
        window.removeEventListener('resize', this.listenWindowsResizeMth);
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
        getClusterStatus(data) {
            if (data == 100) {
                return "异常"
            } else if (data == 200) {
                return "正常"
            }  else if (data == 300) {
                return "正在初始化"
            } else {
                return "未知状态"
            }
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
    padding: 20px;
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
.server-op {
    margin-top: 1px!important;
}
.format-code {
    height: 533px;
    text-align: justify;
    font-size: 14px;
    overflow: auto;
    color: #c3c3c3;
    background-color: #292828;
    padding: 16px;
    box-sizing: border-box;
    width: auto;
    margin-top: 10px;
    white-space: pre-wrap;
    border-radius: 3px;
}
.format-code-terminal {
    overflow: hidden;
    background-color: #000000;
    padding: 0;
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
    cursor: default!important;
}
:deep .el-dialog__header {
    background-color: #1f211f;
    padding: 16px 20px 16px;
    cursor: move!important;
}
:deep .el-dialog--center {
    cursor: default!important;
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
.progame-add .el-form-item {
    margin-right: 22px;
}
.p-pop {
    color: #f56c6c
}
.rr {
    padding-top: 9px;
}
.c3 {
    position: relative;
    top: 10px;
    width:auto!important;
}
.run-linux-cmd-input {
    margin-top: 19px;
}
.run-linux-cmd-title,.run-linux-cmd-content {
    margin-top: 19px;
}
.run-linux-cmd-footer {
    display: flex;
    justify-content: center;
}
.linux-op {
    margin-top: 19px;
}
.server-card {
    height: 138px;
    overflow-y: auto;
}
.server-col {
    padding: 10px!important;
}
.raido-el {
    margin-top: 10px;
    margin-left: 1px!important;
}
.log-filter {
    margin-top: 33px;
}
.pop-btn {
    margin-left: 8px!important;
}
.pop-btn2 {
    margin-left: 0!important;
}
.el-col-111 {
    padding-top: 10px;
}
.key {
    margin: 0;
    margin-left: 5px;
}
.server-operate {
    margin: 20px 0;
}
.col-last {
    float: right;
}
.col-last {
    float: right;
}
.mv-bt {
    margin-top: 18px;
}
.btn-c-4 {
    background: #409eff !important;
    color: #fff;
}

</style>

<style lang="scss" scoped>
    @import '../../../public/style/assets.css';
</style>
