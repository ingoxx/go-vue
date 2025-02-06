<template>
    <div class="boxc">
        <el-tabs class="el-tabs-c" style="height: 200px;" v-model="activeNames">
            <el-tab-pane label="个人信息" name="user">
                <userDetailInfo></userDetailInfo>
            </el-tab-pane>
            <el-tab-pane label="密码修改" name="pwd" v-if="isHidden(getRouterPath('userUpdatePwd', permissionList), permissionList)">
                <password ></password>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import password from './password';
import userDetailInfo from './userDetail';
import { mapState } from 'vuex';
import { isHidden, getRouterPath } from '@/utils/utils';

export default {
    name:"userCenter",
    props: ['active'],
    data () {
        return {
            activeNames: this.active,
        }
    },
    components: {
        password,
        userDetailInfo,
    },
    computed: {
        ...mapState({
            'permissionList': state => state.addRouters.permissionList,
        })
    },
    methods: {
        isHidden,
        getRouterPath,
    },
    mounted() {
        console.log(getRouterPath); 
    },
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/userCenter.css';
</style> -->

<style  lang="scss" scoped>
:deep .boxc {
    height: 342px;
}
.el-tabs-c  {
    :deep .el-tabs__item.is-active {
       background-color: unset;
       border-color: unset;
       color: unset;
    }
}
</style>