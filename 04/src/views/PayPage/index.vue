<template>
  <div class="pay-page">
    <div class="pay-page-wrapper">
      <div class="header-box">
        <div class="type-header">
          <span class="goback" @click="goBack"></span>
          <span>度币充值</span>
        </div>
      </div>
      <div class="account-info-box">
        <div class="left-wrap"><span class="left-item">充值账号:&nbsp;&nbsp;{{account}}</span></div>
        <div class="right-wrap"><span class="right-item">余额:&nbsp;&nbsp;{{integral}}度币</span></div>
      </div>
      <div class="options-box">
        <div class="options">
          <!-- <div class="pay-tab">
            <div class="tab-item" v-for="(item,index) in tabs" :class="{'current-tab' : index === tabIndex}" @click="openTab(index)" :key="index">{{item.tabName}}</div>
          </div> -->
          <div class="meal-box" v-show="tabIndex === 0">
            <div class="meal-item" v-for="(item,index) in mealItems" @click.stop="selMeal(item, index)" :class="{'active': activeMeal === index}" :key="index">
              <span class="meal-name" :class="{'active': activeMeal === index}">{{item.packageName}}</span>
              <span class="meal-cost" :class="{'active': activeMeal === index}">¥{{item.packagePrice}}</span>
            </div>
            <span class="meal-details" v-if="mealItems.length">{{mealItems[0].packageDetails}}</span>
          </div>
          <div class="recharge-box" v-show="tabIndex === 1">
            <div class="recharge-item" v-for="(item,index) in rechargeItems" @click.stop="selRecharge(item, index)" :class="{'active': activeRecharge === index}" :key="index">
              <span class="intergral" :class="{'active': activeRecharge === index}">{{item.att2 / 10}}</span>
              <span class="cost" :class="{'active': activeRecharge === index}">¥{{item.value}}</span>
              <!-- <span class="discount" v-show="item.att1 !== '0'">赠送{{item.att1 / 10}}度币</span> -->
            </div>
          </div>
        </div>
        <div class="pay-wrapper">
          <div class="pay-box">
            <div class="pay-item" @click.stop="selectPayOption('alipay')">
              <img class="pay-icon" :src="aliIcon">
              <span class="text">支付宝充值</span>
              <span class="tick" :class="{'active': activeOption === 'alipay'}"></span>
            </div>
            <div class="pay-item" @click.stop="selectPayOption('weixinpay')">
              <img class="pay-icon" :src="wechatIcon">
              <span class="text">微信充值</span>
              <span class="tick" :class="{'active': activeOption === 'weixinpay'}"></span>
            </div>
          </div>
          <div class="pay-btn" @click.stop="pay">去支付</div>
          <div class="agreement-box">
            <p class="text first-text">点击去充值，即表示已经阅读并同意<i class="agreement" @click="$router.push({path:'/Userprotocol',query:{title:'用户协议'}})">《用户使用协议》</i></p>
            <p class="text second-text">本公司不会以任何形式要求您输入银行卡账户和密码</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        tabIndex: 1,
        goBackPath: '',
        account: '',
        integral: null,
        activeRecharge: 0,
        activeMeal: 0,
        activeOption: 'alipay',
        aliIcon: require('./images/alipay.png'),
        wechatIcon: require('./images/wechatpay.png'),
        mealItems: [], // 套餐选项集合
        mealId: null,  // 已选套餐id
        rechargeItems: [], // 积分充值选项集合
        rechargeId: null, // 已选积分充值项
        tabs: [
        //   {
        //   tabName: '渲染套餐',
        //   tabCode: 'renderMeal'
        // }, 
        {
          tabName: '度币充值',
          tabCode: 'integralPay'
        }],
        options: [{
          type: '支付宝充值'
        }, {
          type: '微信充值'
        }],
        fromPage: ''
      };
    },
    created() {
      this._getRenderPayConfigList();
      this._getRechargeIntegral();
    },
    activated() {
      this._getUserData();
    },
    methods: {
      openTab(index) {
        this.tabIndex = index;
      },
      /**
       * 包年包月支付 / 积分充值
       * 支付方式：alipay支付宝支付、weixinpay微信支付
       * 支付类型：H5支付、app支付
       */
      pay() {
        // 包年包月支付
        if (this.tabIndex === 0) {
          if (this.activeOption === 'alipay') { // 支付宝支付
            try { // 支付宝app支付
              cordova;
              this.APPAliPay();
            } catch (e) { // 支付宝H5支付
              let url = window.location.href;
              let redirectUrl = url.split('#')[0] + '#/rechargeResult';
              this.API.rechargePayModelByH5Pay({
                payType: 'alipay',
                payModelConfigId: Number(this.mealId),
                redirectUrl: redirectUrl
              }).then((res) => {
                if (res) {
                  let form = res.obj.form;
                  document.write(form);
                }
              });
            }
          } else if (this.activeOption === 'weixinpay') { // 微信支付
            try { // 微信app支付
              Wechat;
              this.APPWeiXinPay();
              // console.log(Wechat, '微信支付, app')
            } catch (e) { // 微信H5支付
              let url = window.location.href;
              let redirectUrl = url.split('#')[0] + '#/rechargeResult';
              this.API.rechargePayModelByH5Pay({
                payType: 'weixinpay',
                payModelConfigId: Number(this.mealId),
                redirectUrl: redirectUrl
              }).then((res) => {
                if (res) {
                  this.code_url = res.obj.mwebUrl;
                  location.href = this.code_url;
                }
              });
            }
          }
        } else if (this.tabIndex === 1) {
          // 积分充值
          if (this.activeOption === 'alipay') { // 支付宝支付
            try { // 支付宝app支付
              cordova;
              this.APPAliPay();
            } catch (e) { // 支付宝H5支付
              let url = window.location.href;
              let redirectUrl = url.split('#')[0] + '#/rechargeResult';
              this.API.payIntergralByH5({
                payType: 'alipay',
                productId: this.rechargeId,
                redirectUrl: redirectUrl
              }).then((res) => {
                if (res) {
                  let form = res.obj.form;
                  document.write(form);
                }
              });
            }
          } else if (this.activeOption === 'weixinpay') { // 微信支付
            try { // 微信app支付
              Wechat;
              this.APPWeiXinPay();
            } catch (e) { // 微信H5支付
              let url = window.location.href;
              let redirectUrl = url.split('#')[0] + '#/rechargeResult';
              this.API.payIntergralByH5({
                payType: 'weixinpay',
                productId: this.rechargeId,
                redirectUrl: redirectUrl
              }).then((res) => {
                if (res) {
                  this.code_url = res.obj.mwebUrl;
                  location.href = this.code_url;
                }
              });
            }
          }
        }
      },
      APPWeiXinPay() { // 微信app支付
        if (this.tabIndex === 0) {
          let params;
          let _that = this;
          this.API.rechargePayModelByAppPay({
            payModelConfigId: Number(this.mealId),
            payType: 'weixinpay'
          }).then((res) => {
            if (res.status && res.obj !== null) {
              params = {
                partnerid: res.obj.partnerid, // merchant id
                prepayid: res.obj.prepayid, // prepay id
                noncestr: res.obj.noncestr, // nonce
                timestamp: res.obj.timestamp, // timestamp
                sign: res.obj.sign, // signed string
                appid: res.obj.appid,
                package: res.obj.package
              };
              Wechat.sendPaymentRequest(params, function () {
                _that.$toast('支付成功')
                // _that.$store.commit('popupMsg', '支付成功');
                // _that.$store.commit('showPopup');
              }, function (reason) {
                _that.$toast('支付失败');
                // _that.$store.commit('popupMsg', '支付失败');
                // _that.$store.commit('showPopup');
              });
            }
          });
        } else if (this.tabIndex === 1) {
          let params;
          let _that = this;
          this.API.payIntergralByApp({
            productId: this.rechargeId,
            payType: 'weixinpay'
          }).then((res) => {
            if (res.status && res.obj !== null) {
              params = {
                partnerid: res.obj.partnerid, // merchant id
                prepayid: res.obj.prepayid, // prepay id
                noncestr: res.obj.noncestr, // nonce
                timestamp: res.obj.timestamp, // timestamp
                sign: res.obj.sign, // signed string
                appid: res.obj.appid,
                package: res.obj.package
              };
              Wechat.sendPaymentRequest(params, function () {
                _that.$toast('支付成功')
                // _that.$store.commit('popupMsg', '支付成功');
                // _that.$store.commit('showPopup');
              }, function (reason) {
                _that.$toast('支付失败');
                // _that.$store.commit('popupMsg', '支付失败');
                // _that.$store.commit('showPopup');
              });
            }
          });
        }
      },
      APPAliPay() {  // 支付宝app支付
        if (this.tabIndex === 0) { // 包年包月
          let _that = this;
          this.API.rechargePayModelByAppPay({
            payModelConfigId: Number(this.mealId),
            payType: 'alipay'
          }).then((res) => {
            if (res.status && res.obj !== null) {
              cordova.plugins.alipay.payment(res.obj.form, function success (e) {
                _that.$toast('支付成功')
                // _that.$store.commit('popupMsg', '支付成功');
                // _that.$store.commit('showPopup');
              }, function error (e) {
                _that.$toast('支付失败');
                // _that.$store.commit('popupMsg', '支付失败');
                // _that.$store.commit('showPopup');
              });
            }
          });
        } else if (this.tabIndex === 1) { // 积分充值
          let _that = this;
          this.API.payIntergralByApp({
            productId: this.rechargeId,
            payType: 'alipay'
          }).then((res) => {
            if (res.status && res.obj !== null) {
              cordova.plugins.alipay.payment(res.obj.form, function success (e) {
                _that.$toast('支付成功');
                // _that.$store.commit('popupMsg', '支付成功');
                // _that.$store.commit('showPopup');
              }, function error (e) {
                _that.$toast('支付失败');
                // _that.$store.commit('popupMsg', '支付失败');
                // _that.$store.commit('showPopup');
              });
            }
          });
        }
      },
      goBack() {
        if (this.fromPage === 'rechargeResult') { // 跳转
           return this.$router.push(sessionStorage.getItem('payBeforePage'))
        } else if (sessionStorage.getItem('paypageBack')){
          this.$router.push(sessionStorage.getItem('paypageBack'));
        } else{
          this.$router.back()
        }
      },
      selectPayOption(type) {
        type === 'alipay' ? this.activeOption = 'alipay' : this.activeOption = 'weixinpay';
      },
      selMeal(mealItem, index) {
        this.activeMeal = index;
        this.mealId = mealItem.payModelConfigId;
      },
      selRecharge(rechargeItem, index) {
        this.activeRecharge = index;
        this.rechargeId = rechargeItem.id;
      },
      _getRechargeIntegral() {
        this.API.getRechargeIntegral().then((res) => {
          if (res) {
            this.rechargeItems = res.obj;
            this.rechargeId = this.rechargeItems[0].id;
          }
        });
      },
      _getRenderPayConfigList() {
        this.API.getRenderPayConfigList({
          msgId: '0'
        }).then((res) => {
          if (res) {
            this.mealItems = res.obj;
            this.mealId = this.mealItems[0].payModelConfigId;
          }
        });
      },
      _getUserData() {
        this.API.integralShow().then((response) => {
          if (response) {
            this.$store.dispatch('setLoader');
            let balanceIntegral = Math.floor(response.obj.balanceIntegral); // 积分
            let usableHouseNumber = response.obj.usableHouseNumber; // 可使用户型套数
            this.integral = balanceIntegral;
            this.account = JSON.parse(localStorage.getItem('userInfo')).loginPhone;
            localStorage.setItem('balanceAmount', balanceIntegral);
            localStorage.setItem('consumAmount', usableHouseNumber);
          }
        });
      }
    },
    beforeRouteEnter(to, from, next) {
      if(from.name !== 'rechargeResult') sessionStorage.setItem('payBeforePage', from.fullPath);
      next(vm => {
        vm.fromPage = from.name;
      })
    }
  };
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";

.pay-page {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  background-color: #eee;
  z-index: 100;
}

.pay-page .pay-page-wrapper {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.pay-page .pay-page-wrapper .header-box {
  position: static;
  width: 100%;
}

.pay-page .pay-page-wrapper .header-box .type-header {
  background: #fff;
  color: #333;
  font-size: 36px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  position: relative;
}

.pay-page .pay-page-wrapper .header-box .type-header:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  content: "";
}

.pay-page .pay-page-wrapper .header-box .type-header .goback {
  width: 48px;
  height: 48px;
  position: absolute;
  left: 34px;
  top: 24px;
  background-size: 48px 48px;
  background-image: url("./images/back_nor.png");
}

.pay-page .pay-page-wrapper .header-box .type-header .type-text {
  display: block;
  width: 256px;
  margin: 0 auto;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pay-page .pay-page-wrapper .account-info-box {
  width: 100%;
  height: 88px;
  background-color: #fff;
  clear: both;
}

.pay-page .pay-page-wrapper .account-info-box .left-wrap {
  float: left;
  margin-left: 32px;
  height: 88px;
}

.pay-page .pay-page-wrapper .account-info-box .left-wrap .left-item {
  display: block;
  line-height: 88px;
  font-size: 28.000000000000004px;
  color: #333;
}

.pay-page .pay-page-wrapper .account-info-box .right-wrap {
  float: right;
  margin-right: 32px;
  height: 88px;
}

.pay-page .pay-page-wrapper .account-info-box .right-wrap .right-item {
  display: block;
  line-height: 88px;
  font-size: 28.000000000000004px;
  color: #999;
}

.pay-page .pay-page-wrapper .options-box {
  margin-top: 28.000000000000004px;
}

.pay-page .pay-page-wrapper .options-box .options {
  padding: 30px 0;
  background-color: #fff;
}

.pay-page .pay-page-wrapper .options-box .options .pay-tab {
  margin: 0 100px;
  font-size: 0;
}

.pay-page .pay-page-wrapper .options-box .options .pay-tab .tab-item {
  display: inline-block;
  margin: 0 80px;
  padding-bottom: 20px;
  font-size: 28.000000000000004px;
  color: #333;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .pay-tab
  .tab-item.current-tab {
  color: #ff6419;
  border-bottom: 2px solid #ff6419;
}

.pay-page .pay-page-wrapper .options-box .options .tip {
  display: block;
  margin: 0 0 28.000000000000004px 32px;
  font-size: 28.000000000000004px;
  color: #999;
}

.pay-page .pay-page-wrapper .options-box .options .recharge-box {
  // margin: 34px 21px 0 21px;
  margin: 0.1rem 0.28rem 0 0.28rem;
}

.pay-page .pay-page-wrapper .options-box .options .recharge-box .recharge-item {
  position: relative;
  display: inline-block;
  margin: 10px;
  width: 210px;
  height: 140px;
  background-color: #fff;
  border-radius: 5px;
  border: 2px solid #e0e0e0;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .recharge-box
  .recharge-item.active {
  border: 2px solid #ff6419;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .recharge-box
  .recharge-item
  .intergral {
  display: block;
  margin: 30px 0 20px;
  text-align: center;
  color: #333;
  font-size: 32px;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .recharge-box
  .recharge-item
  .intergral.active {
  color: #ff6419;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .recharge-box
  .recharge-item
  .cost {
  display: block;
  text-align: center;
  font-size: 32px;
  color: #999;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .recharge-box
  .recharge-item
  .cost.active {
  color: #ff6419;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .recharge-box
  .recharge-item
  .discount {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 180px;
  height: 36px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  font-size: 22px;
  background-size: 100%;
  background-image: url("./images/discount_bg.png");
}

.pay-page .pay-page-wrapper .options-box .options .meal-box {
  margin: 44px 21px 0 21px;
}

.pay-page .pay-page-wrapper .options-box .options .meal-box .meal-item {
  position: relative;
  display: inline-block;
  margin: 10px;
  width: 330px;
  height: 160px;
  background-color: #fff;
  border-radius: 5px;
  border: 2px solid #e0e0e0;
  box-sizing: border-box;
}

.pay-page .pay-page-wrapper .options-box .options .meal-box .meal-item.active {
  border: 2px solid #ff6419;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .meal-box
  .meal-item
  .meal-name {
  display: block;
  margin: 38px 0 28px;
  text-align: center;
  color: #333;
  font-size: 32px;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .meal-box
  .meal-item
  .meal-name.active {
  color: #ff6419;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .meal-box
  .meal-item
  .meal-cost {
  display: block;
  text-align: center;
  font-size: 32px;
  color: #999;
}

.pay-page
  .pay-page-wrapper
  .options-box
  .options
  .meal-box
  .meal-item
  .meal-cost.active {
  color: #ff6419;
}

.pay-page .pay-page-wrapper .options-box .options .meal-box .meal-details {
  display: block;
  margin: 15px 0;
  text-align: center;
  font-size: 24px;
  color: #999;
}

.pay-page .pay-page-wrapper .pay-wrapper {
  margin-top: 20px;
  width: 100%;
}

.pay-page .pay-page-wrapper .pay-wrapper .pay-box .pay-item {
  height: 88px;
  background-color: #fff;
  border-bottom: 1px solid #f1f1f1; /*no*/
}

.pay-page .pay-page-wrapper .pay-wrapper .pay-box .pay-item .pay-icon {
  display: block;
  float: left;
  margin: 18px 0 18px 32px;
  width: 52px;
  height: 52px;
}

.pay-page .pay-page-wrapper .pay-wrapper .pay-box .pay-item .text {
  display: block;
  float: left;
  margin-left: 20px;
  line-height: 88px;
  font-size: 28px;
  color: #333;
}

.pay-page .pay-page-wrapper .pay-wrapper .pay-box .pay-item .tick {
  display: block;
  float: right;
  margin: 20px;
  width: 42px;
  height: 42px;
  background-image: url("./images/select.png");
  background-size: 100%;
}

.pay-page .pay-page-wrapper .pay-wrapper .pay-box .pay-item .tick.active {
  background-image: url("./images/selected.png");
}

.pay-page .pay-page-wrapper .pay-wrapper .pay-btn {
  margin: 80px auto 40px;
  width: 600px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 36px;
  color: #fff;
  border-radius: 40px;
  background-color: #ff6419;
}

.pay-page .pay-page-wrapper .pay-wrapper .agreement-box {
  margin: 0 auto;
  width: 584px;
}

.pay-page .pay-page-wrapper .pay-wrapper .agreement-box .text {
  padding: 10px 0;
  font-size: 24px;
  color: #999;
}

.pay-page .pay-page-wrapper .pay-wrapper .agreement-box .agreement {
  color: #333;
}
</style>
