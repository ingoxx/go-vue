<template>
    <div class="sv">
        <VueSlideVerify ref="slideVerify" @success="handleSlideSuccess" @fail="handleSlideFail" />
    </div>
</template>
  
<script>
import VueSlideVerify from 'vue-slide-verify';
import { Message } from 'element-ui'

export default {
    props: ['active'],
    name: 'SlideVerify',
    components: {
        VueSlideVerify,
    },
    data() {
        return {
            isSlideSolved: false,
            succeed: true,
        };
    },
    methods: {
        handleSucceed(status) {
            this.succeed = status;
        },
        handleSlideSuccess() {
            this.isSlideSolved = true;
            this.succeed = false;
            this.$emit('update-success', this.succeed);
        },
        handleSlideFail() {
            this.isSlideSolved = false;
            this.succeed = true;
            this.$emit('update-success', this.succeed);
            Message.error('滑块验证码失败');
        },
    },
};
</script>

<style scoped>
/* 你可以在这里添加自定义样式 */
.sv {
    height: 100%;
}
.slide-verify {
    position: relative;
    margin: 0 auto;
    top: 10%;
}
</style>