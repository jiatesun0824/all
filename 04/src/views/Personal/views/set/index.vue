<template>
  <div class="personalSet">
    <div class="header-box">
      <div class="type-header">
        <span class="goback" @click="goBack"></span>
        <span>设置</span>
      </div>
    </div>
    <ul class="setItem">
      <li class="item" @click="goSetPhone">修改手机号</li>
      <li class="item" @click="toreset">修改密码</li>
      <!--<li @click="toFeedBack">反馈问题</li>-->
      <li>版本号 <span>{{versionText}}</span></li>
    </ul>
    <div class="loginOut" @click="loginOut">退出登录</div>
  </div>
</template>

<script type="text/ecmascript-6">
import { bus } from "api/api.js";

export default {
  data() {
    return {
      versionText: ""
    };
  },
  created() {
    this.versionText = process.env.VERSION;
  },
  methods: {
    goSetPhone() {
      this.$router.push("/setPhone");
    },
    goBack() {
      this.$store.state.intergralHeader = true;
      this.$router.go(-1);
    },
    toreset() {
      this.$router.push("/reset");
    },
    loginOut() {
      this.API.logout({
        Authorization: localStorage.getItem("token")
      }).then(res => {
        if (res) {
          localStorage.setItem("token", "");
          localStorage.setItem("isLogined", 0);
          sessionStorage.clear();
          // 初始化省份城市
          sessionStorage.setItem("provinceCode", 440000);
          sessionStorage.setItem("cityCode", 440300);
          this.$store.state.provinceName = "广东省";
          this.$store.state.cityName = "深圳市";
          bus.$emit("hideSearchResult"); // 派发隐藏户型搜索结果事件
          this.$store.commit("showComComponents", false);
          this.$store.state.is720 = true;
          this.$store.state.recom.planName = "";
          this.$router.push("/");
        }
      });
    },
    toFeedBack() {
      this.$router.replace("/personal/feedback");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";
.loginOut {
  width: 680px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background: #fff;
  border-radius: 100px;
  margin: 80px auto;
  color: #333;
  font-size: 28.000000000000004px;
}

.personalSet {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #eeeeee;
  overflow: hidden;
  z-index: 66;
}

.personalSet .header-box {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 3;
}

.personalSet .header-box .type-header {
  background: #fff;
  color: #333;
  font-size: 36px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  position: relative;
}

.personalSet .header-box .type-header:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  content: "";
}

.personalSet .header-box .type-header .goback {
  width: 25px;
  height: 41px;
  position: absolute;
  left: 34px;
  top: 24px;
  background-size: 25px 41px;
  background-image: url("../../images/back_nor.png");
}

.personalSet .header-box .type-header .type-text {
  display: block;
  width: 256px;
  margin: 0 auto;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.setItem {
  margin-top: 100px;
  font-size: 28.000000000000004px;
  background-color: #fff;
  padding-left: 28.000000000000004px;
  color: #333;
}

.setItem li {
  height: 88px;
  line-height: 88px;
  border-bottom: solid 1px #e3e3e3;
  position: relative;
}

.setItem li span {
  position: absolute;
  right: 50px;
  color: #999;
}

.setItem .item:after {
  content: "";
  position: absolute;
  height: 16px;
  width: 16px;
  border-bottom: solid 1px #999;
  border-right: solid 1px #999;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  right: 30px;
  top: 33px;
}
</style>
