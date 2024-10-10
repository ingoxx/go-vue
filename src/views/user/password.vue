<template>
    <div class="box">
        <el-form :model="ruleForm" status-icon label-position="right" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名">
                    <el-input type="text" v-model="userdetail.name" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="repass">
                    <el-input type="password" v-model="ruleForm.repass" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item class="submit">
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-popconfirm :title="'确定修改【'+this.user+'】的密码吗?'"
                                    icon="el-icon-info"
                                    icon-color="red"
                                    confirm-button-text='确定'
                                    @confirm="submitForm('ruleForm', UpdateUser)"
                                >
                        <el-button type="primary" :loading="updateLoad" slot="reference">确 定</el-button>
                    </el-popconfirm>
                </el-form-item>
            </el-form>
    </div>
</template>

<script>
import { updateUsers } from '../../api'
import { mapState } from 'vuex'


export default {
    name:"password",
    data () {
        var validatepass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('密码不能为空'));

            } else if (value.length < 6 ) {
                callback(new Error('密码长度需要大于7'));
            } else {
                callback();
            }
        };
        var validaterepass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('确认密码不能为空'));
            } else if (value != this.ruleForm.pass){
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        };
        return {
            updateLoad: false,
            user: "",
            ruleForm: {
                pass:'',
                repass:'',
            },
            rules: {
                pass: [
                        { validator: validatepass, trigger: 'blur' }
                ],
                repass: [
                        { validator: validaterepass, trigger: 'blur' }
                ],
            },
        }
    },
    computed: {
        ...mapState({
            'userdetail': state => state.userDetail.userdetail,
        })
    },
    methods: {
        async UpdateUser() {
            this.updateLoad = true;
            await updateUsers({
                name: this.userdetail.name,
                uid: this.userdetail.ID,
                rid: this.userdetail.role[0].ID,
                password: this.ruleForm.pass,
                rePassword: this.ruleForm.repass,
            }, this.callMethod).catch(err => {
                this.updateLoad = false;
            })
            this.updateLoad = false;

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
        callMethod() {},
    },
    mounted () {
        this.user = sessionStorage.getItem('user');
    },
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/password.css';
</style> -->

<style lang="scss" scoped>
.el-popover__reference-wrapper button  {
    margin-left: 20px;
}
:deep .el-form-item__content {
    width: 292px;
}
.demo-ruleForm {
    margin-left: 145px;
    margin-top: 34px;
}
.submit {
    text-align: center;
}
</style>