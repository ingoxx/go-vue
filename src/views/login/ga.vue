<template>
    <div class="box-ga">
        <el-card>
            <el-row :gutter="10" class="content-ga">
                <el-col>
                    <h3 class="title">MFA多因素认证登录</h3>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="content-ga" v-if="isShowQr == 1">
                <el-col>
                    <vue-qr 
                        :logo-src="appSrc"
                        :size="191"
                        :margin="0"
                        :auto-color="true"
                        :dot-scale="1"
                        :text="url"
                    />
                    <p class="notice">打开MFA应用扫码登陆</p>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="content-ga">
                <el-col>
                    <el-input v-model="gacode" placeholder="请输入MFA认证码" suffix-icon="el-icon-edit" clearable @keyup.enter.native="GaLogin()"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="content-ga">
                <el-col>
                    <el-button type="success" plain @click="GaLogin()" :loading="submitLoad">{{ logintext }}</el-button>
                </el-col>
            </el-row>
        </el-card>
        <div class="add-operate">
            <el-dialog
                title="验证"
                :visible.sync="loginVerifyVisible"
                width="500px"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
                :destroy-on-close="true"
                center
                >
                <slideVerify @update-success="handleSuccessMth"></slideVerify>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { gaLogin } from '../../api'
import store from '../../store/index'
import VueQr from 'vue-qr'
import { Message } from 'element-ui'
import  slideVerify  from '../func/slideVerify'

export default {
    name:"ga",
    data () {
        return {
            loginVerifyVisible: false,
            user: "",
            appSrc:"",
            gacode:"",
            hidden: true,
            isShowQr:2,
            submitLoad: false,
            logintext:"确定",
            url: "otpauth://totp/lxb?secret=NR4GEYLMNRQTAMLMNNQWI&issuer=cmdb&algorithm=SHA1&digits=6&period=30",
        }
    },
    components: {
        VueQr,
        slideVerify,
    },
    methods: {
        handleSuccessMth(success) {
            this.loginVerifyVisible = success;
        },
        async GaLogin() {
            if (!this.gacode) {
                return Message.error("请输入谷歌验证码");
            }

            this.logintext = "确定...";
            this.submitLoad = true;
            const resp = await gaLogin({code: this.gacode, user: this.user}, this.user, this.callMethod).catch(err => {this.submitLoad = false;})
            if (resp.status) {
                this.submitLoad = false;
                this.logintext = "确定";
            }

            if (resp.data.code === 10002) {
                this.loginVerifyVisible = true;
                return Message.error(resp.data.message);
            } else if (resp.data.code === 10001 || resp.data.code === 10003) {
                return Message.error(resp.data.message);
            }

            sessionStorage.setItem("token", resp.data.data.token);
            sessionStorage.setItem("user", resp.data.data.name);
            sessionStorage.setItem("uid", resp.data.data.uid);
            // this.$router.replace('/').catch((err) => err);
            // 登录成功后拉取当前用户的权限列表
            // await store.dispatch("getUserPerms");
            // 跳转到主页
            this.$router.push({ name: 'home' }).catch((err) => err);
            this.submitLoad = false;
            this.logintext = "确定";
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
