<template>
    <div class="box-ga">
        <el-card>
            <el-row :gutter="10" class="content-ga">
                <el-col>
                    <h3 class="title">打开微信扫一扫下载MFA应用</h3>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="content-ga">
                <el-col>
                    <el-image
                        :src="appUrl"
                        fit="fill"
                    >
                    </el-image>
                    <p class="notice">如果已下载请点击下一步</p>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="content-ga">
                <el-col>
                    <el-button type="success" plain @click="GaLogin()">{{ logintext }}</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { gaLogin } from '../../api'
import store from '../../store/index'
import VueQr from 'vue-qr'
import { Message } from 'element-ui'

export default {
    name:"mfa",
    data () {
        return {
            appUrl: "https://www.anythingai.online/img/mfa_download.png",
            user: "",
            appSrc:"",
            gacode:"",
            hidden: true,
            isShowQr:2,
            submitLoad: false,
            logintext:"下一步",
            url: "otpauth://totp/lxb?secret=NR4GEYLMNRQTAMLMNNQWI&issuer=cmdb&algorithm=SHA1&digits=6&period=30",
        }
    },
    components: {
        VueQr
    },
    methods: {
        async GaLogin() {
            this.$router.push(
                { 
                    name: 'ga', 
                    query: { 
                            user: this.user, 
                            qr: this.isShowQr,
                            url: this.url,
                    }, 
                });
        },
        callMethod() {},
    },
    created () {
        this.user = this.$route.query.user;
        this.isShowQr =  this.$route.query.qr;
        if (this.isShowQr == 1) {
            this.url = this.$route.query.url;
        }
    },
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/ga.scss';
</style> -->

<style lang="scss" scoped>
.box-ga {
    padding-top: 150px;
    // height: 100%;
    // background-color: #e9e9e9;
}
.title {
    position: relative;
    width: 400px;
    height: 45px;
    line-height: 45px;
    color: #fff;
    right: 20px;
    bottom: 30px;
    background-color: #1ab395;
}
.content-ga {
    margin-top: 10px;
}
.notice {
    font-size: 12px;
    color: #c78282;
}
:deep .el-button--success.is-plain {
    width: 100%;
}
.el-card {
    width: 400px;
    margin: 0 auto;
}
</style>
