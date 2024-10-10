<template>
    <div class="box">
        <el-card>
            <div class="operate">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-input clearable size="small" @clear="OperateLogList('search')" placeholder="请输入操作者搜索" suffix-icon="el-icon-date" v-model="operator"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input clearable size="small" @clear="OperateLogList('search')" placeholder="请输入url搜索" suffix-icon="el-icon-date" v-model="url"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input clearable size="small" @clear="OperateLogList('search')" placeholder="请输入ip搜索" suffix-icon="el-icon-date" v-model="ip"></el-input>
                    </el-col>
                    <el-col :span="2.5">
                        <el-date-picker
                            v-model="datetime"
                            type="daterange"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            size="small"
                            @change="OperateLogList('search')"
                            >
                        </el-date-picker>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="点击搜索" placement="top-start">
                            <el-button size="small" type="primary" icon="el-icon-search" circle @click="OperateLogList('search')"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </div>
            <div class="table">
                <el-table v-loading="tableLoad" stripe  :data="operateList"
                        element-loading-text="拼命加载中"
                    >
                    <el-table-column prop="ID" label="id"></el-table-column>
                    <el-table-column prop="operator" label="operator" ></el-table-column>
                    <el-table-column prop="ip" label="ip" ></el-table-column>
                    <el-table-column prop="url" label="url" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="CreatedAt" label="visit_time" ></el-table-column> -->
                    <el-table-column prop="CreatedAt" label="visit_time" >
                        <template slot-scope="scope">
                            <el-tag size="small" type="success">{{ scope.row.CreatedAt | formatDate}}</el-tag>
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
    </div>
</template>

<script>
import { getOperateLogList } from '../../api'
import { Message } from 'element-ui'

export default {
    name:"operate",
    data() {
        return {
            operateList: [],
            datetime:"",
            url:"",
            ip:"",
            operator: "",
            tableLoad: true,
            pages: {
                curPage:1,
                pageSize:5,
            },
            total:0,
        }
    },
    methods: {
        async OperateLogList(mode) {
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
            
            const resp = await getOperateLogList({
                page: pageNum,
                url: this.url,
                ip: this.ip,
                operator:this.operator,
                starttime: this.datetime ? this.datetime[0] : "",
                endtime: this.datetime ? this.datetime[1] : "",
            }).catch(err => this.tableLoad = false); 
            
            if (resp.data.code !== 10000) {
                this.tableLoad = false;
                return Message.error(resp.data.message)
            }

            this.pages.curPage = pageNum;

            // this.handleCurrentChange(pageNum);
            this.operateList = resp.data.data;
            this.total = resp.data.total;
            this.pages.pageSize = resp.data.pageSize;
            this.tableLoad = false;
        },
        handleCurrentChange(val) {
            console.log("handleCurrentChange >>> ", val);
            this.pages.curPage = val;
            this.OperateLogList("page");
        },
        handleDatetime() {
            console.log(this.datetime);
        },
    },
    mounted () {
        this.OperateLogList("page");
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
.table{
    margin-top: 30px;
    margin-bottom: 15px;
}

</style>