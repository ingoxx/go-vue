<template>
    <div class="box">
        <el-card>
            <div class="search">
                <el-row :gutter="10">
                    <!-- <el-col :span="3" v-for="(k,i) in searchTitle" :key="i">
                        <el-input clearable size="small" :placeholder="k.title" suffix-icon="el-icon-date" v-model="k.value"></el-input>
                    </el-col> -->
                    <el-col :span="3">
                        <el-input clearable size="small" @clear="ListUser('search')" placeholder="请输入用户名搜索" suffix-icon="el-icon-date" v-model="name"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input clearable size="small" @clear="ListUser('search')" placeholder="请输入邮箱搜索" suffix-icon="el-icon-date" v-model="email"></el-input>
                    </el-col>
                    <el-col :span="3">
                        <el-input clearable size="small" @clear="ListUser('search')" placeholder="请输入号码搜索" suffix-icon="el-icon-date" v-model="tel"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-select v-model="rolename" placeholder="请输入角色搜索" clearable size="small" @clear="ListUser('search')">
                            <el-option
                                v-for="item in roles"
                                :key="item.ID"
                                :label="item.rolename"
                                :value="item.rolename">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="1" class="col-5">
                        <el-tooltip class="item" effect="dark" content="点击搜索" placement="top-start">
                            <el-button size="small" type="primary" icon="el-icon-search" circle @click="ListUser('search')"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
                <el-row :gutter="10" class="operate">
                    <el-col :span="2.5" v-if="!isHidden('/user/add', this.$router.options.routes)">
                        <el-button size="small" type="primary" icon="el-icon-document-add" @click="clearData" v-if="isHidden('/user/add', permissionList)">添加用户</el-button>
                    </el-col>
                    <el-col :span="1.9">
                        <el-popconfirm :title="'确定删除id为【 '+multipleSelection.map(item=>item.ID)+' 】吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='删除'
                                @confirm="handleMutilDelete()"
                                ref="fs"
                            >
                                <el-button size="small" type="danger" slot="reference" icon="el-icon-delete-solid" v-if="isHidden('/user/del', permissionList)">批量删除</el-button>
                        </el-popconfirm>
                    </el-col>
                </el-row>
            </div>
            <!-- 数据表格 -->
            <div class="table">
                <el-table v-loading="tableLoad" stripe  :data="userList" @selection-change="handleSelectionChange"
                    element-loading-text="拼命加载中" ref="multipleTable" @row-click="tableRowClick"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="ID" label="id"></el-table-column>
                    <el-table-column prop="name" label="name" ></el-table-column>
                    <el-table-column prop="isopenga" label="isopenga" >
                        <template slot-scope="scope">
                            <el-tag size="small" v-if="scope.row.isopenga == 1">ga认证开启</el-tag>
                            <el-tag size="small" type="danger" v-else-if="scope.row.isopenga == 2">ga认证关闭</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isopenqr" label="isopenqr" >
                        <template slot-scope="scope">
                            <el-tag size="small" v-if="scope.row.isopenqr == 1">ga二维码开启</el-tag>
                            <el-tag size="small" type="danger" v-else-if="scope.row.isopenqr == 2">ga二维码关闭</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="role" label="role">
                        <template slot-scope="scope">
                            <el-tag size="small" type="success" v-if="scope.row.role.length != 0">{{ scope.row.role[0].rolename }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tel" label="tel"></el-table-column>
                    <el-table-column prop="CreatedAt" label="createdAt" >
                        <template slot-scope="scope">
                            <el-tag size="small" type="success">{{ scope.row.CreatedAt | formatDate}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="operate" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="editUserData(scope.row)" icon="el-icon-edit" v-if="isHidden('/user/update', permissionList)">编辑</el-button>
                            <el-popconfirm :title="'确定删除'+scope.row.name+'吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='删除'
                                @confirm="handleDelete(scope.row)"
                            >
                                <el-button size="mini" type="danger" slot="reference" icon="el-icon-delete-solid" plain v-if="isHidden('/user/del', permissionList)">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 翻页 -->
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
        <!-- 添加修改 -->
        <el-dialog
            title="添加用户"
            :visible.sync="centerDialogVisible"
            width="500px"
            :close-on-click-modal="false"
            v-draggable
            center
            >
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="name">
                    <el-input type="text" v-model="ruleForm.name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="email" v-model="ruleForm.email" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="tel">
                    <el-input type="number" v-model="ruleForm.tel" autocomplete="off" clearable></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="repass">
                    <el-input type="password" v-model="ruleForm.repass" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户组" prop="role">
                    <el-select v-model="ruleForm.role" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in roles"
                            :key="item.ID"
                            :label="item.rolename"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否开启ga">
                    <el-switch
                        v-model="ruleForm.isopenga"
                        active-text="开启"
                        inactive-text="关闭">
                    </el-switch>
                </el-form-item>
                <el-form-item label="是否开启gaqr">
                    <el-switch
                        v-model="ruleForm.isopenqr"
                        active-text="开启"
                        inactive-text="关闭">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-popconfirm :title="'确定添加【'+ruleForm.name+'】吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='确定'
                                @confirm="submitForm('ruleForm', AddUser)"
                            >
                    <el-button type="primary" :loading="addLoad" slot="reference">确 定</el-button>
                </el-popconfirm>
            </span>
        </el-dialog>
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="500px"
            :close-on-click-modal="false"
            v-draggable
            center
            >
            <el-form :model="ruleForm" status-icon label-position="right" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="name">
                    <el-input type="name" v-model="ruleForm.name" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="upass">
                    <el-input type="password" v-model="ruleForm.upass" autocomplete="off" clearable></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="urepass">
                    <el-input type="password" v-model="ruleForm.urepass" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户组" prop="role">
                    <el-select v-model="ruleForm.role" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in roles"
                            :key="item.ID"
                            :label="item.rolename"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否开启ga">
                    <el-switch
                        v-model="ruleForm.isopenga"
                        active-text="开启"
                        inactive-text="关闭">
                    </el-switch>
                </el-form-item>
                <el-form-item label="是否开启gaqr">
                    <el-switch
                        v-model="ruleForm.isopenqr"
                        active-text="开启"
                        inactive-text="关闭">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-popconfirm :title="'确定更新【'+ruleForm.name+'】吗?'"
                                icon="el-icon-info"
                                icon-color="red"
                                confirm-button-text='确定'
                                @confirm="submitForm('ruleForm', UpdateUser)"
                            >
                    <el-button type="primary" :loading="updateLoad" slot="reference">确 定</el-button>
                </el-popconfirm>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import { addUsers, delUsers, updateUsers, getUserList, getRolesName } from '../../api'
import { mapState } from 'vuex'

export default {
    name: "user",
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
    data() {
        var validatename = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入用户名'));
            } else {
                callback();
            }
        };
        var validatetel = (rule, value, callback) => {
            if (!value) {
                callback(new Error('电话不能为空'));
            } else if (value.length < 6 ) {
                callback(new Error('电话长度需要大于7')); 
            } else {
                callback();
            }
        };
        var validaterole = (rule, value, callback) => {
            if (!value) {
                callback(new Error('用户组不能为空'));
            } else {
                callback();
            }
        };
        var validateemail = (rule, value, callback) => {
            if (!value) {
                callback(new Error('邮箱不能为空'));
                return
            }
            var emailRegExp=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            var ok=emailRegExp.test(value);
            if (!ok) {
                callback(new Error('邮箱格式错误'));
            } else {
                callback();
            }
        };
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
        var validateupass = (rule, value, callback) => {
           if (value) {
                if(value.length < 6 ) {
                callback(new Error('密码长度需要大于7'));
                } else {
                    callback();
                }
           } else {
                callback();
           }
        };
        var validateurepass = (rule, value, callback) => {
            if (this.ruleForm.upass != value) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        };
        return {
            userList:[],
            multipleSelection:[],
            delByID:[],
            roles: [],
            name:"",
            email:"",
            tel:"",
            rolename:"",
            userValue: "",
            centerDialogVisible: false,
            editDialogVisible:false,
            tableLoad:true,
            addLoad:false,
            updateLoad: false,
            total:0,
            pages: {
                curPage:1,
                pageSize:5,
            },
            ruleForm: {
                uid:'',
                name: '',
                email: '',
                isopenga: true,
                isopenqr: true,
                pass:'',
                repass:'',
                upass:'',
                urepass:'',
                tel:'',
                role:'',
            },
            rules: {
                name: [
                        { validator: validatename, trigger: 'blur' }
                    ],
                email: [
                        { validator: validateemail, trigger: 'blur' }
                    ],
                tel: [
                    { validator: validatetel, trigger: 'blur' }
                ],
                role: [
                        { validator: validaterole, trigger: 'blur' }
                ],
                pass: [
                        { validator: validatepass, trigger: 'blur' }
                ],
                repass: [
                        { validator: validaterepass, trigger: 'blur' }
                ],
                upass: [
                        { validator: validateupass, trigger: 'blur' }
                ],
                urepass: [
                        { validator: validateurepass, trigger: 'blur' }
                ],
            },
        }
    },
    computed: {
        ...mapState({
            'permissionList': state => state.addRouters.permissionList,
        })
    },
    methods:{
        tableRowClick(row, column, event) {
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        async ListUser(mode) {
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
            const resp = await getUserList(
                {
                    page:pageNum,
                    name:this.name,
                    email:this.email,
                    tel: this.tel,
                    rolename:this.rolename,
                }
            ).catch(err =>{
                this.tableLoad = false;
            })

            if (resp.data.code !== 10000) {
                this.tableLoad = false;
                return Message.error(resp.data.message);
            }

            this.pages.curPage = pageNum;

            this.userList = resp.data.data; //用户列表
            this.total = resp.data.total; //用户总数
            this.pages.pageSize = resp.data.pageSize; //一页显示的数据
            this.tableLoad = false;
        },
        async RolesNameList() {
            const resp = await getRolesName({
                role:11,
            })

            if (resp.data.code !== 10000) {
                return Message.error(resp.data.message);
            }

            this.roles = resp.data.data;       
        },
        async AddUser() {
            this.addLoad = true;
            var params = new URLSearchParams();
            var isopenqr = this.ruleForm.isopenqr ? 1 : 2;
            var isopenga = this.ruleForm.isopenga ? 1 : 2;
            params.append('password', this.ruleForm.pass);
            params.append('rePassword', this.ruleForm.repass);
            params.append('name', this.ruleForm.name);
            params.append('email', this.ruleForm.email);
            params.append('tel', this.ruleForm.tel);
            params.append('isopenqr', isopenqr);
            params.append('isopenga', isopenga);
            params.append('roleId', this.ruleForm.role);
            const resp = await addUsers(params, this.callMethod).catch(err => {
                this.addLoad = false;
            })

            if (resp.data.code !== 10000) {
                this.addLoad = false;
                this.centerDialogVisible = false;
                return Message.error(resp.data.message);
            }

            this.pages.curPage = 1; //添加删除更新重新刷新表格数据回到第一页
            this.ListUser("page");
            this.addLoad = false;
            this.centerDialogVisible = false;
            return Message.success(resp.data.message);
        },
        async DelUser(id, action) {
            var data = "";
            this.tableLoad = true;
            switch (action) {
                case "mul":
                    if (this.multipleSelection.length === 0) {
                        return Message.error("请先勾选需要删除的用户id")
                    }
                    data = JSON.stringify({uid: this.multipleSelection.map(item => item.ID),});
                    break
                case "sin":
                    if (this.delByID.length != 0 ){
                        this.delByID = [];
                        this.delByID.push(id);
                    } else {
                        this.delByID.push(id);
                    };
                    data = JSON.stringify({uid: this.delByID});
                    break
            };
            const resp = await delUsers(
                //必须是json格式
                data, this.callMethod
            ).catch(err => {
                Message.error(err)
            })

            if (resp.data.code !== 10000) {
                this.tableLoad = false;
                return Message.error(resp.data.message);
            }

            this.pages.curPage = 1; //添加删除重新刷新表格数据回到第一页
            this.ListUser("page");

            this.tableLoad = false;
            return Message.success(resp.data.message);
        },
        async UpdateUser() {
            this.updateLoad = true;
            var isopenqr = this.ruleForm.isopenqr ? 1 : 2;
            var isopenga = this.ruleForm.isopenga ? 1 : 2;
            const resp = await updateUsers({
                name: this.ruleForm.name,
                uid: this.ruleForm.uid,
                rid: this.ruleForm.role,
                isopenqr: isopenqr,
                isopenga: isopenga,
                password: this.ruleForm.upass,
                rePassword: this.ruleForm.urepass,
            }, this.callMethod).catch(err => {
                this.updateLoad = false;
            })
            
            if (resp.data.code !== 10000) {
                this.updateLoad = false;
                this.editDialogVisible = false;
                return Message.error(resp.data.message);
            }
            
            this.pages.curPage = 1; //添加删除更新重新刷新表格数据回到第一页
            this.ListUser("page");
            this.updateLoad = false;
            this.editDialogVisible = false;
            return Message.success(resp.data.message);

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
        editUserData(row) {
            this.editDialogVisible = true;
            this.ruleForm.name = row.name;
            this.ruleForm.role = row.role[0].ID;
            this.ruleForm.uid = row.ID
            this.ruleForm.isopenqr = row.isopenqr == 1 ? true : false;
            this.ruleForm.isopenga = row.isopenga == 1 ? true : false;
        },
        clearData() {
            this.centerDialogVisible = true;
            this.ruleForm.name = "";
            this.ruleForm.email = "";
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(row) {
            this.DelUser(row.ID, "sin");
        },
        handleMutilDelete() {
            this.DelUser(1, "mul");
        },
        handleCurrentChange(val) {
            this.pages.curPage = val;
            this.ListUser("page");
        },
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
        callMethod() {},
    },
    mounted() {
        this.ListUser("page");
        this.RolesNameList();
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

<!-- <style lang="scss" scoped>
    @import '../../../public/style/user.css';
</style> -->

<style lang="scss" scoped>
.box{

    margin: 10px auto;
}
.search {
    height: 42px;
    line-height: 42px;
    margin: 10px auto 10px auto;
}
.operate {
    margin: 9px auto 9px auto;
}
.table{
    margin-bottom: 15px;
}
.demo-ruleForm {
    margin: auto;
}
.cell button {
    margin-right: 7px;
}
.el-select {
    float: left;
}
.el-popover__reference-wrapper button  {
    margin-left: 20px;
}
:deep .el-form-item__content {
    width: 292px;
}
:deep .el-dialog__header {
    background-color: rgb(48, 65, 86);
    padding: 16px 20px 16px;
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
    // height: 351px !important;
    background-color: #f9f9f9;
}
:deep .el-dialog--center {
    cursor: move;
}
:deep .el-dialog--center .el-dialog__footer {
    background-color: #f9f9f9;
}
:deep .el-table tr {
    cursor: pointer;
}
</style>
