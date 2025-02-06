<template>
    <div>
        <div class="el-card-main">
            <el-card class="card-1">
                <div  class="title-4">
                    <span>仪表盘</span>
                </div>
            </el-card>
        </div>
        <div class="box-card">
            <el-card >
                <span class="ve-title"><i class="el-icon-s-help title-icon"></i> 用户登录平台次数占比</span>
                <VeBar :data="userLoginData" class="v-chart v-chart-3" :extend="loginExtend" />
            </el-card>
        </div>
        <div class="box-card">
            <el-card >
                <VeLine :data="loginData" :settings="chartSettings" :extend="chartExtend"/>
            </el-card>
        </div>
        <div class="box-card">
            <el-card >
                <VeHistogram :data="linuxCmdData" :settings="chartSettings" :extend="chartExtend"/>
            </el-card>
        </div>
    </div>
</template>
  
<script>
import VeBar from 'v-charts/lib/pie.common'; // 引入饼图组件
import VeLine from 'v-charts/lib/line.common'; // 引入折线图组件
import VeWaterfall from 'v-charts/lib/waterfall.common'; // 引入瀑布图组件
import VeCandle from 'v-charts/lib/candle.common'; // 引入K线图组件
import VeGauge from 'v-charts/lib/gauge.common'; // 引入仪表盘组件
import VeHistogram from 'v-charts/lib/histogram.common'; // 引入直方图组件
import VeRing from 'v-charts/lib/ring.common';
import { getLoginNum, getRunLinuxCmdNum, getUserLoginNum } from '../../api';
import { Message, MessageBox } from 'element-ui';
  
export default {
name: 'BarChart',
components: {
    VeBar,
    VeLine,
    VeWaterfall,
    VeCandle,
    VeGauge,
    VeHistogram,
    VeRing,
},
data() {
    return {
        loginExtend: {
            title: {
          show: true, // 确保标题显示
          text: '用户登录次数占比', // 主标题
          subtext: '统计前五名用户', // 副标题（可选）
          left: 'center', // 标题居中
          top: '10px',
          textStyle: {
            fontSize: 18, // 标题字体大小
            fontWeight: 'bold',
            color: '#333', // 颜色
          },
          subtextStyle: {
            fontSize: 14,
            color: '#666',
          },
        },
        },
        chartExtend: {
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval: 0, // 强制显示所有刻度
                    rotate: 30, // 旋转以防重叠
                },
            },
        },
        chartSettings: {
            smooth: true, // 开启平滑曲线
            xAxisType: 'category',
        },
        loginData: {
            columns: ['日期', '登录次数'],
            rows: [
                { '日期': '1月1日', '登录次数': 123 },
                { '日期': '1月2日', '登录次数': 1223 },
                { '日期': '1月3日', '登录次数': 2123 },
                { '日期': '1月4日', '登录次数': 4123 },
                { '日期': '1月5日', '登录次数': 3123 },
                { '日期': '1月6日', '登录次数': 7123 },
            ],
        },
        linuxCmdData: {
            columns: ['日期', 'linux命令执行次数'],
            rows: [
                { '日期': '1月1日', 'linux命令执行次数': 123 },
                { '日期': '1月2日', 'linux命令执行次数': 1223 },
                { '日期': '1月3日', 'linux命令执行次数': 2123 },
                { '日期': '1月4日', 'linux命令执行次数': 4123 },
                { '日期': '1月5日', 'linux命令执行次数': 3123 },
                { '日期': '1月6日', 'linux命令执行次数': 7123 },
            ],
        },
        userLoginData: {
            columns: ['用户名', '总的平台登陆次数'],
            rows: [
                    { '用户名': 'admin', '总的平台登陆次数': 10 },
                    { '用户名': '二毛', '总的平台登陆次数': 10 },
                ]
        }
    }
    },
    methods: {
        async getLoginNumMth() {
            const resp = await getLoginNum();
            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message)
            }
            
            this.loginData = resp.data.data;
        },
        async getRunLinuxCmdNumMth() {
            const resp = await getRunLinuxCmdNum();
            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message)
            }
            if (Object.keys(resp.data.data).length) {
                this.linuxCmdData = resp.data.data;
            }
        },
        async getUserLoginNumMth() {
            const resp = await getUserLoginNum();
            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message)
            }
            if (Object.keys(resp.data.data).length) {
                this.userLoginData = resp.data.data;
            }
        },
    },
    mounted() {
        this.getLoginNumMth();
        this.getRunLinuxCmdNumMth();
        this.getUserLoginNumMth();
    },
};
</script>

<style scoped>
.box-card {
    display: inline-block;
    padding: 10px 10px;
    width: 522px;
}
:deep .ve-pie {
    width: auto;
    height: 400px;
    position: relative;
}
.chart-title {
    font-weight: 700;
    color: #3b9142;
}
.el-card-main {
    padding-bottom: 10px;
}
.title-4 {
    text-align: left;
}
.card-1 {
    height: 47px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.v-chart-2 {
    width: 100%;
  height: 400px;
}
.ve-title {
    font-size: 12px;
    color: #414141;
}.v-chart-3 {
    width: auto;
    height: 382px!important;
    position: relative;
    top: 16px;
}
.title-icon {
    position: relative;
    top: 2px;
    font-size: 17px;
    color: #19d4ae;
}
</style>