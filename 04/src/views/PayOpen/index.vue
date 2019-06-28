<template>
  <div class="payopening">
    <div class="account-renew clearfix" v-if="isRenew">
      <div class="quondam" @click="goLogin"></div>
      <span class="quondam-text">账户续费</span>
    </div>
    <div class="goLogin" @click="goLogin" v-else></div>
    <div class="payopening-wrap">
      <div class="pay-top">
        <div class="top-header">
          {{isRenew ? '续费' : '付费'}}开通<span class="cut-off-rule"></span>尊享三大特权
        </div>
        <div class="hint-text">{{isRenew ? '续费后可以继续使用三度云享家移动版功能' : '您需要付费开通才能使用三度云享家移动版功能'}}</div>
        <div class="results-show">
          <div class="result-item" 
            v-for="(item, index) in resultData" 
            :style="'backgroundImage: url(' + item.backgroundUrl + ')'"
            :key="index"
          >
            <div class="specific-text">
              <img :src="item.imgUrl" alt="" class="img">
              <div class="text">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pay-bottom">
        <div class="payment-amount clearfix">
          <div class="text">支付金额</div>
          <div class="pay-price">￥{{showIntegral/10}}<span class="integral">({{showIntegral}}积分)</span>/年</div>
        </div>
        <div class="payment-mode">
          <div class="text">支付方式</div>
          <div class="specific-mode">
            <span class="currentIntegral">当前积分:{{jifenShow}}</span>
            <div class="mode clearfix" v-for="(item,index) in paymentMode" :key="index">
              <img :src="item.imgUrl" alt="" class="img">
              <div class="mode-name">{{item.name}}</div>
              <div class="select-box" :class="selectIndex == index ? 'select-box-active' : ''" @click="selectPayMode(index)"></div>
            </div>
          </div>
        </div>
        <div class="payment-btn" @click="immediatePayment">立即支付</div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapState } from "Vuex";
import { bus } from "api/api.js";

export default {
  data() {
    return {
      jifenShow: 0,
      resultData: [
        {
          name: "多种效果图展示",
          imgUrl: require("./images/login_pay_icon_01.png"),
          backgroundUrl: require("./images/login_pay_bg_01.png")
        },
        {
          name: "方案装进我家",
          imgUrl: require("./images/login_pay_icon_02.png"),
          backgroundUrl: require("./images/login_pay_bg_02.png")
        },
        {
          name: "在线替换装修",
          imgUrl: require("./images/login_pay_icon_03.png"),
          backgroundUrl: require("./images/login_pay_bg_03.png")
        }
      ],
      paymentMode: [
        {
          name: "账户积分充值",
          imgUrl: require("./images/login_icon_score.png")
        },
        {
          name: "微信充值",
          imgUrl: require("./images/score_icon_wechat.png")
        },
        {
          name: "支付宝充值",
          imgUrl: require("./images/score_icon_alipay.png")
        }
      ],
      selectIndex: 0, // 选择的支付方式索引
      userId: 0, // 用户id
      showIntegral: null
    };
  },
  created() {
    this.jifenShow = localStorage.getItem("jifenShow") || 0;
  },
  activated() {
    this.API.getUserBalanceAmount({
      userId: localStorage.getItem("pauopenUserId")
    }).then(res => {
      this.jifenShow = Math.floor(res.obj.balanceIntegral);
      this.showIntegral = Math.floor(res.obj.dredgeIntegral);
      localStorage.setItem("jifenShow", res.obj.balanceIntegral);
    });
    this.userId = localStorage.getItem("pauopenUserId");
  },
  methods: {
    goLogin() {
      // 开通页面返回登录页面
      this.$router.push("/");
    },
    selectPayMode(index) {
      // 选择支付方式
      this.selectIndex = index;
    },
    immediatePayment() {
      if (this.selectIndex == 0) {
        this.API.integralPay({
          // 通过积分开通移动端功能
          payType: "predeposit",
          userId: this.userId
        }).then(response => {
          if (response) {
            this.$store.commit("popupMsg", "您已成功开通移动版三度云享家");
            this.$store.commit("showPopup");
            this.goLoginSuccess();
          }
        });
      } else {
        if (this.selectIndex == 1) {
          try {
            Wechat;
            this.APPWeiXinPay();
          } catch (e) {
            this.API.wechatPay({
              payType: "weixinpay",
              userId: this.userId
            }).then(response => {
              if (response.status) {
                this.code_url = response.obj.mwebUrl;
                location.href = this.code_url;
              }
            });
          }
        } else if (this.selectIndex == 2) {
          try {
            cordova;
            this.APPAliPay();
          } catch (e) {
            this.API.aliPay({
              payType: "alipay",
              userId: this.userId
            }).then(res => {
              if (res) {
                let form = res.obj.form;
                document.write(form);
              }
            });
          }
        }
      }
    },
    APPWeiXinPay() {
      // 微信支付
      let params;
      let _that = this;
      this.API.getNewPayData({
        userId: this.userId,
        payType: "weixinpay"
      }).then(res => {
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
          Wechat.sendPaymentRequest(
            params,
            function() {
              _that.$store.commit("popupMsg", "支付成功");
              _that.$store.commit("showPopup");
              _that.goLoginSuccess();
            },
            function(reason) {
              _that.$store.commit("popupMsg", "支付失败");
              _that.$store.commit("showPopup");
            }
          );
        }
      });
    },
    APPAliPay() {
      // 支付宝支付
      let _that = this;
      this.API.getAliPayPayInfo({
        userId: this.userId,
        payType: "alipay"
      }).then(res => {
        if (res.status && res.obj !== null) {
          cordova.plugins.alipay.payment(
            res.obj.form,
            function success(e) {
              _that.$store.commit("popupMsg", "支付成功");
              _that.$store.commit("showPopup");
              _that.goLoginSuccess();
            },
            function error(e) {
              _that.$store.commit("popupMsg", "支付失败");
              _that.$store.commit("showPopup");
            }
          );
        }
      });
    },
    goLoginSuccess() {
      // 登录成功
      this.$store.state.personalHideHeader = true;
      let userName = localStorage.getItem("userName");
      let pwd = localStorage.getItem("pwd");
      let form = new FormData(); // 创建form对象
      form.append("account", userName); // 通过append向form对象添加数据
      form.append("password", pwd);
      form.append("msgId", 0);
      form.append("loginFlag", 1);
      this.API.getFranchiserCompanyList(form).then(res => {
        if (res) {
          if (res.datalist.length && res.datalist.length > 1) {
            localStorage.setItem("companyList", JSON.stringify(res.datalist));
            this.$store.commit("showComComponents", false);
            this.$router.push("/company");
          } else {
            this.API.login(form).then(response => {
              if (response) {
                if (!response.flag) {
                  this.$store.commit("showComComponents", false);
                  this.$store.commit("popupMsg", response.message);
                  this.$store.commit("showPopup");
                  if (
                    response.message === "您尚未开通移动版功能，请联系客服开通!"
                  ) {
                    this.$store.state.isRenew = false;
                    localStorage.setItem("pauopenUserId", response.msgId);
                    this.$router.push("/payopen");
                    return;
                  }
                  if (
                    response.message === "未开通此平台权限,请联系客服." ||
                    response.message === "平台权限已到期,请续费开通!"
                  ) {
                    let userId = response.msgId; // 缓存用户id
                    localStorage.setItem("pauopenUserId", userId);
                    this.$store.state.isRenew = false;
                    this.$router.push("/payopen");
                    return;
                  }
                  return;
                }
                if (response.message === "移动版已到期，请续费开通！") {
                  this.$store.state.isRenew = true;
                  this.$router.push("/payopen");
                  return;
                }
                if (this.$store.state.errorCount > 3) {
                  this.$store.commit("showComComponents", false);
                  this.$store.commit(
                    "popupMsg",
                    "账号或密码错误超过3次，请修改密码！"
                  );
                  this.$store.commit("showPopup");
                  setTimeout(() => {
                    router.push("/reset");
                  }, 2500);
                  return;
                }
                // 如果登录成功则保存登录状态并设置有效期
                localStorage.setItem("token", response.obj.token);
                localStorage.setItem("userId", response.obj.id);
                if (response.obj.passwordUpdateFlag === 1) {
                  // 字段为1为首次登陆，需要绑定手机号、修改密码
                  this.$store.state.footerShow = false;
                  this.$router.push("/setAccount");
                  return;
                }
                if (!sessionStorage.getItem("designHouseType")) {
                  sessionStorage.setItem("designHouseType", "3"); // 第一次登录初始化我的设计筛选条件
                }
                this.$store.state.timeOut = false;
                this.$store.state.errorCount = 0; // 登录失败次数初始化为0
                // 初始化省份城市
                sessionStorage.setItem("provinceCode", 440000);
                sessionStorage.setItem("cityCode", 440300);
                localStorage.removeItem("companyList");
                // 获取菜单数据
                if (!response.obj.menuTree) {
                  this.$store.commit("showComComponents", false);
                  this.$store.commit("popupMsg", "请先配置用户菜单！");
                  this.$store.commit("showPopup");
                  return;
                }
                let menu = JSON.stringify(response.obj.menuTree);
                bus.$emit("footerTabShow", menu);
                localStorage.setItem("menu", menu);
                this.API.integralShow({
                  account: userName,
                  password: pwd
                }).then(res => {
                  if (res) {
                    localStorage.setItem(
                      "balanceAmount",
                      response.obj.balanceIntegral
                    );
                    localStorage.setItem(
                      "consumAmount",
                      response.obj.consumAmount
                    );
                  }
                });
                this.$store.commit("showComComponents", true);
                localStorage.setItem("isLogined", 1);
                localStorage.setItem("mobile", response.obj.mobile);
                this.$store.state.footerShow = true;
                this.$router.push("/recom");
                let companyForm = new FormData();
                companyForm.append("account", userName); // 通过append向form对象添加数据
                companyForm.append("password", pwd);
                companyForm.append("msgId", 0);
                this.API.getFranchiserCompanyList(companyForm).then(res => {
                  if (res) {
                    if (res.datalist.length && res.datalist.length > 1) {
                      localStorage.setItem(
                        "companyList",
                        JSON.stringify(res.datalist)
                      );
                    }
                  }
                });
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
          }
        }
      });
    }
  },
  computed: mapState({
    isRenew: state => state.isRenew,
    popupShow: state => state.popupShow,
    popupMsg: state => state.popupMsg,
    jifen: state => state.jifenShow
  })
};
</script>

<style lang="scss">
@import "styles/mixin.scss";
.specific-mode {
  position: relative;
}

.specific-mode .currentIntegral {
  font-size: 24px;
  position: absolute;
  right: 60px;
  top: 10px;
  color: #999;
}

.payopening {
  position: relative;
  /*position: absolute
    top: 0
    bottom: 0*/
  width: 100%;
  height: 100%;
}

.payopening .account-renew {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 40px;
}

.payopening .account-renew .quondam {
  width: 48px;
  height: 48px;
  background-size: 48px 48px;
  background-image: url("./images/nav_icon_back.png");
  position: absolute;
  left: 30px;
}

.payopening .account-renew .quondam-text {
  display: inline-block;
  line-height: 88px;
  text-align: center;
  font-size: 36px;
  color: #333;
  // float: absolute;
}

.payopening .goLogin {
  position: absolute;
  left: 30px;
  width: 48px;
  height: 48px;
  background-size: 48px 48px;
  background-image: url("./images/nav_icon_back.png");
  /*margin: 0.2rem 0 0 0.4rem*/
}

.payopening .payopening-wrap {
  font-size: 28.000000000000004px;
  margin-top: 50px;
}

.payopening .payopening-wrap .pay-top .top-header {
  width: 100%;
  font-size: 50px;
  color: #ff6419;
  text-align: center;
}

.payopening .payopening-wrap .pay-top .top-header .cut-off-rule {
  display: inline-block;
  height: 40px;
  border-left: 1px solid #999999;
  color: #999999;
  margin: 0 20px;
}

.payopening .payopening-wrap .pay-top .hint-text {
  width: 100%;
  margin-top: 20px;
  font-size: 24px;
  color: #999999;
  text-align: center;
}

.payopening .payopening-wrap .pay-top .results-show {
  width: 640px;
  margin: 30px auto;
}

.payopening .payopening-wrap .pay-top .results-show .result-item {
  width: 640px;
  height: 120px;
  border-radius: 10px;
  background-size: 640px 120px;
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.payopening
  .payopening-wrap
  .pay-top
  .results-show
  .result-item
  .specific-text {
  width: 100%;
  height: 44px;
  line-height: 44px;
  padding-left: 40px;
}

.payopening
  .payopening-wrap
  .pay-top
  .results-show
  .result-item
  .specific-text
  .img {
  width: 44px;
  height: 44px;
  float: left;
}

.payopening
  .payopening-wrap
  .pay-top
  .results-show
  .result-item
  .specific-text
  .text {
  float: left;
  margin-left: 16px;
  color: #fff;
}

.payopening .payopening-wrap .pay-bottom {
  width: 640px;
  margin: 40px auto;
}

.payopening .payopening-wrap .pay-bottom .payment-amount {
  margin: 60px 0;
}

.payopening .payopening-wrap .pay-bottom .payment-amount .text {
  float: left;
}

.payopening .payopening-wrap .pay-bottom .payment-amount .pay-price {
  float: right;
}

.payopening .payopening-wrap .pay-bottom .payment-amount .pay-price .integral {
  color: #999999;
  margin: 0 15px;
}

.payopening .payopening-wrap .pay-bottom .payment-mode {
  margin: 30px 0;
}

.payopening .payopening-wrap .pay-bottom .payment-mode .mode {
  margin-top: 20px;
  height: 52px;
  line-height: 52px;
}

.payopening .payopening-wrap .pay-bottom .payment-mode .mode .img {
  width: 52px;
  height: 52px;
  float: left;
}

.payopening .payopening-wrap .pay-bottom .payment-mode .mode .mode-name {
  float: left;
  margin-left: 20px;
}

.payopening .payopening-wrap .pay-bottom .payment-mode .mode .select-box {
  width: 41px;
  height: 41px;
  background-size: 41px 41px;
  border: 1px solid #e0e0e0;/*no*/
  border-radius: 20.5px;
  float: right;
}

.payopening
  .payopening-wrap
  .pay-bottom
  .payment-mode
  .mode
  .select-box-active {
  border: 0;
  background-image: url("./images/round_check_fill.png");
}

.payopening .payopening-wrap .pay-bottom .payment-btn {
  margin: 20px auto 0;
  width: 600px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 32px;
  color: #fff;
  background: #ff6419;
  border-radius: 40px;
}
</style>
