<template>
    <div class="login">
        <h2>CMDB登录</h2>
        <div class="login-body">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item  prop="username">
                    <el-input type="text" placeholder="用户名" v-model="ruleForm.username" autocomplete="off" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item  prop="password">
                    <el-input @keyup.enter.native="submitForm('ruleForm')" type="password" placeholder="密码" v-model="ruleForm.password" autocomplete="off" prefix-icon="el-icon-lock" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loginLoad" @click.native="submitForm('ruleForm')">{{ logintext }}</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { login } from '../../api'
import { Message } from 'element-ui'

export default {
    name:"login",
    data() {
        var validateusername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入用户名'));
            } else {
                callback();
            }
        };
        var validatepassword = (rule, value, callback) => {
            if (!value) {
                callback(new Error('密码不能为空'));
            } else {
                callback();
            }
        };
        return {
            loginLoad:false,
            logintext:"登录",
            ruleForm:{
                username:"",
                password:"",
            },
            rules: {
                username:[
                    { validator: validateusername, trigger: 'blur' }
                ],
                password:[
                    { validator: validatepassword, trigger: 'blur' }
                ],
            },
        }
    },
    methods:{
        // async和await的组合也可以写成 login().then(res=>{console.log(111)})但不建议这样写，最好就是async和await的组合避免了primiss.then()的回调地狱，如：func().then().then().then().....
        async Login() {
            this.loginLoad = true;
            this.logintext = "登录..."
            // login() 返回的是一个promise对象, await 会拿到reslove结果，是then函数的语法糖
            const resp = await login(
                {user: this.ruleForm.username, password: this.ruleForm.password}, 
                this.ruleForm.username, 
                this.callMethod
            )

            if (resp.data.code !== 10000) {
                this.loginLoad = false;
                this.logintext = "登录";
                return Message.error(resp.data.message)
            }

            if (resp.data.data.isopenga == 1) {
                this.$router.push(
                    { 
                        name: 'ga', 
                        params: { 
                                user: resp.data.data.name, 
                                qr: resp.data.data.isopenqr,
                                url: resp.data.data.qrurl,
                        }, 
                    });
            } else {
                sessionStorage.setItem("token", resp.data.data.token);
                sessionStorage.setItem("user", resp.data.data.name);
                sessionStorage.setItem("uid", resp.data.data.uid);
                this.$router.replace('/').catch((err) => err);
            }
            
            this.logintext = "登录"
            this.loginLoad = false;
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Login();
                } else {
                    return false;
                }
            });
        },
        callMethod() {

        },
    },
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/login.css';
</style> -->

<style lang="scss" scoped>
.login {
    height: 100%;
    // padding: 80px auto;
    background-color:#2d3a4b;
}
.login h2 {
    color: #ffffff;
    padding: 150px 0 26px 0;
}
.demo-ruleForm {
    margin: auto;
}
:deep .el-input input {
    background-color: #283443;
    border: 1px solid rgba(0,0,0,.1)
}
:deep .el-form-item__content {
    margin: 0 auto !important;
    width: 450px;
}
:deep .el-button+.el-button, .el-checkbox.is-bordered+.el-checkbox.is-bordered {
    margin-left: 30px;
}
</style>

