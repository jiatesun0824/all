<template>
  <div class="allload__container">
    <div class="allload__content">没有更多数据</div>
  </div>
</template>

<script>
export default {
  name: 'all-load'
}
</script>

<style lang="scss" scoped>
.allload {
  @at-root #{&}__container {
    flex-basis: 100%;
  }
  
  @at-root #{&}__content {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    color: #777;
  }
}
</style>

