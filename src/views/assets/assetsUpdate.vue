<template>
    <div class="box">
        <div class="content">
            <div class="result-title">
                    <el-card>
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>操作日志</strong></el-divider>
                        <p class="op-name">
                            <el-row :gutter="10">
                                <el-col :span="1.9" >
                                    <el-tag effect="plain"  type="success">{{ project }}</el-tag>
                                </el-col>
                                <el-col :span="1.9" >
                                    <el-tag effect="plain"  type="success">{{ ip }}</el-tag>
                                </el-col>
                                <el-col :span="1.9" >
                                    <el-tag effect="plain"  type="success">{{ curName }}</el-tag>
                                </el-col>
                            </el-row>
                        </p>
                    </el-card>
                </div>
                <div class="result-data">
                    <el-card class="layout-no" v-loading="updateLoading"
                            element-loading-text="正在拼命连接中..."
                            element-loading-spinner="el-icon-loading">
                        <el-divider><strong><i class="el-icon-platform-eleme"></i>实时更新日志</strong></el-divider>
                        <div class="format-code">
                            <pre><code>{{ content.join('') }}</code></pre>
                        </div>
                    </el-card>
                </div>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import { mapState } from 'vuex'
import store from '../../store/index'
import wssUrl from "../../utils/wssUrl";

export default {
    name: "assetsUpdate",
    data () {
        return {
            updateLoading: true,
            curName: "",
            content: [],
            uuid: "",
            project:"",    
            ip: "",    
            socket:"",
        }
    },
    methods: {
        wsInit () {
            if (typeof(WebSocket) === "undefined") {
                Message.error("您的浏览器不支持socket");
            } else {
                // 实例化socket
                this.wsUrl = wssUrl;
                this.socket = new WebSocket(this.wsUrl+"/assets/ws?user="+ sessionStorage.getItem("user") +"&token="+sessionStorage.getItem("token"));
                // 监听socket连接
                this.socket.onopen = this.open;
                // 监听socket错误信息
                try {
                    this.socket.onerror = this.error;
                } catch(err) {
                    console.log(err);
                    return
                }
                console.log(111);
                // 监听socket消息
                this.socket.onmessage = this.getMessage;
                // 监听socket关闭消息
                this.socket.onclose = this.close;
            }
        },
        open () {
            // Message.success('websocket连接成功')
            this.updateLoading = false;
            this.send();
        },
        error () {
            this.updateLoading = false;
            // Message.error("websocket连接失败");
            this.content.push("websocket连接失败");
        },
        getMessage (msg) {
            // let jd = JSON.parse(msg.data);
            this.content.push(msg.data);
            let div = document.querySelector(".result-data");
            div.scrollTop = div.scrollHeight - div.clientHeight;
        },
        send () {
            // this.socket.send(this.chatContent+'|'+this.value);
            let data = {
                ip: this.ip,
                name: this.curName,
                uuid: this.uuid
            };
            this.socket.send(JSON.stringify(data));
        },
        close () {
            // Message.error("websocket连接已关闭");
        },
    },
    mounted () {
        this.curName = this.$route.params.name;
        this.ip =  this.$route.params.ip;
        this.uuid = this.$route.params.uuid;
        this.project = this.$route.params.project;
        this.wsInit();
    },
    
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/assetsUpdate.css';
</style> -->

<style lang="scss" scoped>
.result-data {
    margin-top: 20px;
    height: 800px;
    overflow-y: auto;
}
.op-name {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
}
.format-code {
    // height: 700px;
    text-align: justify;
    font-size: 17px;
    overflow: auto;
    color: #c3c3c3;
    background-color: #292828;
    padding: 16px;
    box-sizing: border-box;
    width: auto;
    margin-top: 10px;
}
</style>
