<template>
  <div class="pay-result">
    <div class="main-wrapper">
      <template v-if="status === 'SUCCESS'">
        <div class="icon" :style="'backgroundImage: url(' + successIcon + ')'"></div>
        <div class="status">支付成功</div>
        <div class="pay-details">你已成功开通移动版三度云享家</div>
        <div class="btn" @click="enter">进入主页</div>
      </template>

      <template v-if="status === 'PAYING'">
        <div class="icon" :style="'backgroundImage: url(' + payingIcon + ')'"></div>
        <div class="status">支付中</div>
        <div class="pay-details">订单支付中，请重新获取订单状态</div>
        <div class="btn" @click="enter">更新订单</div>
      </template>

      <template v-if="status === 'NOTPAY'">
        <div class="icon" :style="'backgroundImage: url(' + failIcon + ')'"></div>
        <div class="status">未支付</div>
        <div class="pay-details">Sorry，支付时发生错误，请重新支付开通</div>
        <div class="btn" @click="enter">重新支付</div>
      </template>

    </div>
    <div class="footer-wrapper">
      <div class="logo" :style="'backgroundImage: url(' + logo + ')'"></div>
      <div class="footer-text">{{footerText}}</div>
    </div>
    <div class="mask" v-if="showFlag">
      <img class="loading-img" :src="require('assets/images/loading.gif')">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showFlag: true,
      failIcon: require("./images/login_pay_faile@3x.png"),
      successIcon: require("./images/login_pay_success@3x.png"),
      payingIcon: require("./images/login_pay_paying.gif"),
      logo: require("./images/login_pay_logo@3x.png"),
      status: "",
      footerText: "客服电话：0755-23895307",
      orderNo: ""
    };
  },
  created() {
    //      this.handleUrl();
    setTimeout(() => {
      this.handleUrl();
    }, 2500);
    setTimeout(() => {
      this.showFlag = false;
    }, 2800);
  },
  methods: {
    /**
     * 跳转
     */
    enter() {
      if (this.status === "SUCCESS") {
        // 支付成功
        let userName = localStorage.getItem("userName");
        let pwd = localStorage.getItem("pwd");
        this.API.login({
          account: userName,
          password: pwd
        }).then(response => {
          if (response) {
            // 如果登录成功则保存登录状态并设置有效期
            localStorage.setItem("token", response.obj.token);
            localStorage.setItem("userId", response.obj.id);
            localStorage.setItem("serverUrl", response.obj.serverUrl);
            localStorage.setItem("resourcesUrl", response.obj.resourcesUrl);
            localStorage.setItem("balanceAmount", response.obj.balanceAmount);
            localStorage.setItem("consumAmount", response.obj.consumAmount);
            if (!sessionStorage.getItem("designHouseType")) {
              sessionStorage.setItem("designHouseType", "3"); // 第一次登录初始化我的设计筛选条件
            }
            // 获取域名
            this.$store.commit("setResourcesUrl", response.obj.resourcesUrl);
            // 跳转
            this.$store.commit("showComComponents", true);
            this.$store.state.timeOut = false;
            this.$store.state.errorCount = 0; // 登录失败次数初始化为0
            this.$router.push("/");
            this.API.space().then(response => {
              // 获取空间的列表（客餐厅、卧室...）
              if (response) {
                this.$store.state.spaceList = response.datalist;
                sessionStorage.setItem(
                  "selType",
                  this.$store.state.spaceList[0].name
                );
                sessionStorage.setItem(
                  "name",
                  this.$store.state.spaceList[0].name
                ); // 推荐页面参数
                sessionStorage.setItem(
                  "houseType",
                  this.$store.state.spaceList[0].value
                ); // 设置选择的空间类型作为传参使用(推荐页面)
                this.$store.state.loginToDesign = true;
                this.$store.state.loginToRecom = true;
                sessionStorage.setItem("replaceList", "");
                //                this.$router.push('/design');
              }
            });
            this.API.getShape().then(response => {
              // 获取按空间搜索形状信息列表
              if (response) {
                this.$store.state.shapeList = response.datalist;
                this.$store.state.shapeList.push(this.supplement);
                sessionStorage.setItem("spaceShape", "");
              }
            });
            this.API.getFavoritesList({
              // 获取默认收藏夹
              msgId: localStorage.getItem("userId"),
              token: response.obj.token
            }).then(response => {
              if (response) {
                this.$store.state.favoritesList = response.datalist;
              }
            });
          }
        });
      } else if (this.status === "NOTPAY") {
        // 未支付
        this.$router.push("/payopen");
      } else {
        // 支付中 this.status === 'PAYING'
        this.showFlag = true;
        this._getOrderInfo();
        setTimeout(() => {
          this.showFlag = false;
        }, 2500);
      }
    },
    /**
     * 处理地址，获取订单号 ordNo
     */
    handleUrl() {
      let url = window.location.href;
      let res;
      res = url.split("?");
      if (res[1].indexOf("&") > -1) {
        res = res[1].split("&");
        res = res[0].split("=");
        this.orderNo = res[1];
      } else {
        res = res[1].split("=");
        this.orderNo = res[1];
      }
      this._getOrderInfo();
    },
    /**
     * 获取订单数据
     */
    _getOrderInfo() {
      this.API.getOrder({
        orderNo: this.orderNo
      }).then(res => {
        if (res) {
          this.status = res.obj.payState; // 保存订单状态
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.pay-result {
  position: relative;
  width: 100%;
  height: 100%;
}

.pay-result .main-wrapper {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 200px;
  max-width: 550px;
}

.pay-result .main-wrapper .icon {
  margin: 0 auto;
  margin-bottom: 60px;
  width: 110.00000000000001px;
  height: 120px;
  background-size: 100%;
}

.pay-result .main-wrapper .status {
  margin: 0 auto;
  margin-bottom: 40px;
  text-align: center;
  font-size: 36px;
  color: #333;
}

.pay-result .main-wrapper .pay-details {
  margin: 0 auto;
  margin-bottom: 160px;
  text-align: center;
  font-size: 28.000000000000004px;
  color: #999;
}

.pay-result .main-wrapper .btn {
  margin: 0 auto;
  width: 280px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  font-size: 32px;
  color: #fff;
  background-color: #ff6419;
  border-radius: 40px;
}

.pay-result .footer-wrapper {
  position: absolute;
  z-index: 1;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  width: 360px;
}

.pay-result .footer-wrapper .logo {
  margin: 0 auto;
  margin-bottom: 40px;
  width: 199px;
  height: 38px;
  text-align: center;
  background-size: 100%;
}

.pay-result .footer-wrapper .footer-text {
  margin: 0 auto;
  text-align: center;
  font-size: 28.000000000000004px;
  color: #999;
}

.pay-result .mask {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}

.pay-result .mask .loading-img {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
  display: block;
  width: 50px;
  height: 50px;
  margin: 0 auto;
}
</style>
