<template>
  <div class="home__layout">
    <div class="home__content">
      <router-view :isShowBottomMenu = "isShowBottomMenu"></router-view>
    </div>
    <bottom-menu :isShow = "isShowBottomMenu.show"></bottom-menu>
  </div>
</template>

<script>

  export default {
    name: 'home-layout',
    data() {
      return {
        isShowBottomMenu: {
          show: true
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
