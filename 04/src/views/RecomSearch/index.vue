<template>
  <div class="search">
    <div class="header-box">
      <div class="type-header">
        <!-- <span class="goback" @click="goBack"></span> -->
        <span>户型</span>
      </div>
    </div>
    <div class="search-box">
      <div class="search-nav">
        <router-link class="nav-text" to="/recomsearch/area">
          <span class="text-contant">按小区</span>
        </router-link>
        <router-link class="nav-text" to="/recomsearch/space">
          <span class="text-contant">按空间</span>
        </router-link>
      </div>
      <div class="search-wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  data() {
    return {};
  },
  activated() {},
  created() {},
  methods: {
    goBack() {
      this.$store.state.comeFromPlan = false;
      this.$router.push("/recom");
    }
  },
  computed: mapState({
    comeFromPlan: state => state.comeFromPlan
  })
};
</script>

<style lang="scss">
@import "styles/mixin.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.search-box {
  position: absolute;
  top: 88px;
  width: 100%;
  bottom: 0;
  background-color: #eeeeee;
}

.search-box .search-nav {
  display: flex;
  background-color: #fff;
  margin-bottom: 24px;
}

.search-box .search-nav .nav-text {
  flex: 1;
  color: #333333;
  font-size: 30px;
  height: 74px;
  line-height: 74px;
  text-align: center;
  border-bottom: 1px solid #ddd;/*no*/
}

.search-box .search-nav .router-link-exact-active .text-contant {
  border-bottom: 4px solid #ff6419;
  color: #ff6419;
  display: inline-block;
  height: 72px;
}

.header-box {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 3;
}

.header-box .type-header {
  background: #fff;
  font-size: 36px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  position: relative;
}

.header-box .type-header:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  content: "";
}

.header-box .type-header .goback {
  width: 25px;
  height: 41px;
  position: absolute;
  left: 34px;
  top: 24px;
  background-size: 25px 41px;
  background-image: url("./images/back_nor.png");
}

.header-box .type-header .goback:active {
  background-image: url("./images/back_pre.png");
}

.header-box .type-header .type-text {
  display: block;
  margin: 0 auto;
}

.house-show {
  width: 100%;
  position: absolute;
  top: 88px;
  bottom: 98px;
  overflow: hidden;
  padding-top: 24px;
  background: #eeeeee;
}

.house-show .house-wrapper {
  width: 100%;
  padding: 10px;
  background: #fff;
}

.house-show .house-wrapper .house-item {
  float: left;
  width: 345px;
  margin: 10px;
  position: relative;
}

.house-show .house-wrapper .house-item img {
  width: 345px;
  height: 248px;
  border: 1px solid #eeeeee;
}

.house-show .house-wrapper .house-item .text {
  display: block;
  font-size: 24px;
  height: 40px;
  line-height: 40px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 5px 0 20px;
  padding-right: 50px;
}

.house-show .house-wrapper .house-item .details {
  position: absolute;
  bottom: 85px;
  right: 10px;
  width: 46px;
  height: 45px;
  background-size: 46px 45px;
  background-image: url("./images/search_nor.png");
}

.big-image {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.big-image .image-wrapper {
  display: 24px;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.size-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.size-image .image-wrapper {
  display: 24px;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.img-show {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 102;
}

.close {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 78px;
  height: 79px;
  background-size: 78px 79px;
  background-image: url("./images/close_nor.png");
  z-index: 103;
}
</style>
