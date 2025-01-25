<template>
    <div>
      <vue-page-transition name="fade-in-right">
          <keep-alive v-if="this.$route.meta.keepAlive">
              <router-view></router-view>
          </keep-alive>
      </vue-page-transition>
    </div>
  </template>
  
  <script>
  
  export default {
    name:"layout"
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  