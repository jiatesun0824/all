<template>
  <div class="home-tab">
    这是tabs局部组件
    <svg-icon icon-name="wrong"></svg-icon>
  </div>
</template>

<script>
export default {
  name: 'tabs'
}
</script>

<style lang="scss">
  $color: blue;

  .home-tab {
    color: $color;
    font-size: 30px;
  }
</style>
