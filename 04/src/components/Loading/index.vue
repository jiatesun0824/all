<template>
  <div class="loading">
    <div class="loading-wrap">
      <img class="loading-img" :src="require('assets/images/loading.gif')">
      <span class="loading-msg">{{loadingMsg}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'loading',
  props: {
    loadingMsg: {
      type: String,
      default: "载入中..."
    }
  }
};
</script>

<style lang="scss">
.loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  z-index: 999;
  background: #eee;
}

.loading .loading-wrap .loading-img {
  display: block;
  width: 50px;
  height: 50px;
  margin: 0 auto;
}

.loading .loading-wrap .loading-msg {
  padding: 20px;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 24px;
}
</style>
