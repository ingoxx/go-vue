<template>
  <div>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
    mounted() {
        Message.warning('权限不足, 大哥不要乱来！！！！！');
        let that = this;
        setTimeout(() => {
          let menuTabList = sessionStorage.getItem('menuTabList');
          if (menuTabList) {
            let nn = JSON.parse(menuTabList);
            if (nn.length == 0) {
              this.$router.replace('/index').catch((err) => err);
            } else {
              let backroute = nn[nn.length-1];
              this.$router.replace(backroute.path).catch((err) => err);
            }
          }
        }, 3000);
    }
}
</script>
