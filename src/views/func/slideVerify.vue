<template>
    <div>
        <VueSlideVerify ref="slideVerify" @success="handleSlideSuccess" @fail="handleSlideFail" />
    </div>
  </template>
  
  <script>
  import VueSlideVerify from 'vue-slide-verify';
  
  export default {
    components: {
      VueSlideVerify,
    },
    data() {
      return {
        isSlideSolved: false,
      };
    },
    methods: {
      handleSlideSuccess() {
        this.isSlideSolved = true;
        console.log('滑块验证码成功');
      },
      handleSlideFail() {
        this.isSlideSolved = false;
        console.log('滑块验证码失败');
      },
    },
  };
  </script>
  
  <style scoped>
  /* 你可以在这里添加自定义样式 */
  </style>