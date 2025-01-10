<template>
    <div class="boxc">
        <el-tabs class="el-tabs-c" style="height: 200px;" v-model="activeNames">
            <el-tab-pane label="个人信息" name="user">
                <userDetailInfo></userDetailInfo>
            </el-tab-pane>
            <el-tab-pane label="密码修改" name="pwd">
                <password></password>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import password from './password'
import userDetailInfo from './userDetail'

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