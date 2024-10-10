<template>
    <div class="box">
        <el-divider>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon008-saving"></use>
            </svg>
        </el-divider>
        <el-divider>
            <strong><i class="el-icon-user"></i>姓名</strong>
        </el-divider>
        <div class="user-info">
            <el-link :underline="false" type="success">{{ userdetail.name }}</el-link>
        </div>
        <el-divider>
            <strong><i class="el-icon-mobile-phone"></i>电话</strong>
        </el-divider>
        <div class="user-info">
            <el-link :underline="false" type="success">{{ userdetail.tel }}</el-link>
        </div>
        <el-divider>
            <strong><i class="el-icon-edit-outline"></i>邮箱</strong>
        </el-divider>
        <div class="user-info">
            <el-link :underline="false" type="success">{{ userdetail.email }}</el-link>
        </div>
        <el-divider>
            <strong><i class="el-icon-orange"></i>所属组</strong>
        </el-divider>
        <div class="user-info">
            <el-link :underline="false" type="success">{{ userdetail.role[0].rolename }}</el-link>
        </div>
    </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
    name:"userDetail",
    computed: {
        ...mapState({
            'userdetail': state => state.userDetail.userdetail,
        })
    },
}
</script>

<!-- <style lang="scss" scoped>
    @import '../../../public/style/userDetail.css';
</style> -->

<style lang="scss" scoped>
.box {
    height: 342px;
}
.user-info {
  text-align: center;
}
.icon {
  position: relative;
  height: 33px;
  width: 33px;
  margin: 0 13px;
  background-color: #00BCD4;
  border-radius: 40px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>