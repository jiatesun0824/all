<template>
  <div class="pay-result">
    <div class="main-wrapper">
      <template v-if="status === 'SUCCESS'">
        <div class="icon" :style="'backgroundImage: url(' + successIcon + ')'"></div>
        <div class="status">支付成功</div>
        <div class="pay-details">你已支付成功</div>
        <div class="pay-result-btn" @click="enter">返回</div>
      </template>

      <template v-if="status === 'PAYING'">
        <div class="icon" :style="'backgroundImage: url(' + payingIcon + ')'"></div>
        <div class="status">支付中</div>
        <div class="pay-details">订单支付中，请重新获取订单状态</div>
        <div class="pay-result-btn" @click="enter">更新订单</div>
      </template>

      <template v-if="status === 'NOTPAY'">
        <div class="icon" :style="'backgroundImage: url(' + failIcon + ')'"></div>
        <div class="status">未支付</div>
        <div class="pay-details">Sorry，支付时发生错误，请重新支付</div>
        <div class="pay-result-btn" @click="enter">重新支付</div>
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

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        showFlag: true,
        failIcon: require('./images/login_pay_faile@3x.png'),
        successIcon: require('./images/login_pay_success@3x.png'),
        payingIcon: require('./images/login_pay_paying.gif'),
        logo: require('./images/login_pay_logo@3x.png'),
        status: '',
        footerText: '客服电话：0755-23895307',
        orderNo: ''
      };
    },
    created() {
      setTimeout(() => {
        this.handleUrl();
      }, 2000);
      setTimeout(() => {
        this.showFlag = false;
      }, 2500);
    },
    methods: {
      /**
       * 跳转
       */
      enter() {
        if (this.status === 'SUCCESS' || this.status === 'NOTPAY') { // 支付成功 或 未支付
          this.$router.replace('/paypage');
        } else { // 支付中 this.status === 'PAYING'
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
        res = url.split('?');
        if (res[1].indexOf('&') > -1) {
          res = res[1].split('&');
          res = res[0].split('=');
          this.orderNo = res[1];
        } else {
          res = res[1].split('=');
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
        }).then((res) => {
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
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
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

.pay-result .main-wrapper .pay-result-btn {
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
