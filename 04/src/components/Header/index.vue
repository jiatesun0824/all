<template>
  <div class="header border-1px" v-if="personalHideHeader">
    <span class="title">{{headerTxt}}</span>
    <!--<a v-if="personalFlag" class="exit" @click="exit"></a>-->
    <a v-if="searchBtnFlag" class="search" @click.self="search"></a>
    <!-- <a class="collectList"></a> -->
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  name: 'v-header',
  data() {
    return {};
  },
  methods: {
    exit() {
      localStorage.setItem("token", "");
      let designData = sessionStorage.getItem("designHouseType"); // 清空缓存前保存我的设计操作痕迹
      sessionStorage.clear();
      sessionStorage.setItem("designHouseType", designData); // 重新缓存我的设计操作痕迹
      this.$store.commit("showComComponents", false);
      this.$store.state.is720 = true;
      this.$router.push("/");
    },
    search() {
      this.$store.state.searchContentShow = true;
    }
  },
  computed: mapState({
    comComponentsShow: state => state.comComponentsShow,
    headerTxt: state => state.headerTxt,
    personalHideHeader: state => state.personalHideHeader,
    searchBtnFlag: state => state.searchBtnFlag,
    personalFlag: state => state.personalFlag
  })
};
</script>

<style lang="scss">
@import "styles/mixin.scss";

.header {
  position: fixed;
  text-align: center;
  height: 88px;
  z-index: 0;
  font-size: 0;
  position: relative;
  background-color: #fff;
}

.header:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  content: "";
}

.header .title {
  display: inline-block;
  line-height: 88px;
  text-align: center;
  font-size: 36px;
  color: #333;
}

.header .exit {
  position: absolute;
  display: block;
  top: 26px;
  right: 30px;
  width: 40px;
  height: 40px;
  background-size: 40px 40px;
  background-repeat: no-repeat;
  background-image: url("./images/eixt_nor.png");
}

.header .exit:active {
  background-image: url("./images/eixt_pre.png");
}

.header .search {
  position: absolute;
  display: block;
  top: 26px;
  left: 30px;
  z-index: 2;
  width: 40px;
  height: 40px;
  background-size: 40px 40px;
  background-repeat: no-repeat;
  background-image: url("./images/search_nor.png");
}

.header .collectList {
  position: absolute;
  display: block;
  top: 26px;
  left: 35px;
  z-index: 2;
  width: 40px;
  height: 28.000000000000004px;
  background-size: 40px 28.000000000000004px;
  background-repeat: no-repeat;
  background-image: url("./images/list_nor.png");
}
</style>
