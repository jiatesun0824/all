<template>
  <div class="account">
      <div class="account-wrapper">
        <div class="header-box">
          <div class="type-header">
            <span class="goback" @click="goBack"></span>
            <span>我的账户</span>
          </div>
        </div>
        <div class="line-first"></div>
        <div class="integral-wrapper">
          <div class="left-box">
            <span class="integral-title">剩余积分</span>
            <span class="integral-num" :class="{'size5' : integralFontSize === '60'}">{{integral}}</span>
            <div class="integral-button" @click="toPayPage">去充值</div>
          </div>
          <div class="right-box">
            <span class="meal-title" v-text="mealState !== '0' ? '已开通' : '未开通'"></span>
            <span class="meal-content">渲染套餐</span>
            <span class="meal-date" v-if="mealState !== '0'">{{mealExpiryTime}}到期</span>
            <div class="bg"></div>
          </div>
        </div>
        <div class="line-second"></div>
        <div class="record-wrapper">
          <div class="record-header border-1px clearfix">
            <span class="record-title">消费记录</span>
            <span class="record-total">总计:&nbsp;&nbsp;{{costIntegral}}分</span>
          </div>
          <scroll class="wrapper record-content"
                  :data="data"
                  :pullup="pullup"
                  :pulldown="pulldown"
                  :beforeScroll="beforeScroll"
                  @pullup="loadData"
                  @pulldown="topLoadData">
            <ul class="list-wrapper">
              <div class="loading-wrapper" v-if="topLoad">加载更多...</div>
              <li class="list-item" v-for="(item, index) in data" :key="index">
                <div class="left-wrap">
                  <div class="left-item">
                    <span class="name">{{item.productName}}</span>
                    <span class="data">{{item.orderDate}}</span>
                  </div>
                </div>
                <div class="right-wrap">
                <span class="integral" :class="item.totalFee == 0 ? 'free-integral' : ''">
                  <!-- 1、当产品类型为“mobile_postpone”表示开通移动端，支付类型为微信支付、支付宝支付、预存款支付。
                          此时如果是微信支付、支付宝支付，单位为元，否则为“分”
                       2、产品类型为：“render_product_pay”，“franchiser_product_pay”，单位为“元”，其它产品类型，单位为分
                        说明：当financeType为“In”表示收入，“Out”表示支出
                  -->
                  <template v-if="item.financeType == 'In'">+</template><template v-if="item.financeType == 'Out'">-</template><template>{{item.totalFee}}<template v-if="item.productType === 'mobile_postphone'"><template v-if="item.payType === 'weixinpay' || item.payType === 'alipay'">分</template><template v-else>元</template></template><template><template v-if="item.productType === 'render_product_pay' || item.productType === 'franchiser_product_pay'">元</template><template v-else>分</template></template></template>
                </span>
                </div>
              </li>
              <div class="loading-wrapper">{{loadEnd}}</div>
            </ul>
          </scroll>
          <loadfail v-if="loadfailFlag"></loadfail>
          <loading v-if="loadingFlag"></loading>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  data() {
    return {
      mealState: "0", // 套餐状态 默认0没有权限 1：送3个月免费渲染权限 2：包月 3：包年 4：包月
      mealExpiryTime: "", // 套餐到期时间
      beforeScroll: true,
      pullup: true,
      pulldown: true,
      integral: "", // 当前积分
      data: [],
      loadEnd: "",
      alreadyAppear: 0,
      loadfailFlag: false,
      page: 0, // 分页数
      costIntegral: null, // 消费的积分
      topLoad: false
    };
  },
  created() {
    this.initScroll();
    this._getIntegral();
  },
  methods: {
    toPayPage() {
      sessionStorage.setItem("returnPayUrl", "/personal/account");
      this.$router.push("/paypage");
    },
    _getIntegral() {
      let userName = localStorage.getItem("userName", userName);
      let pwd = localStorage.getItem("pwd", pwd);
      this.API.integralShow({
        account: userName,
        password: pwd
      }).then(res => {
        if (res) {
          this.integral = Math.floor(res.obj.balanceIntegral).toString();
          this.costIntegral = Math.floor(res.obj.consumAmount);
          this.mealState = res.obj.state;
          this.mealExpiryTime = res.obj.expiryTime;
        }
      });
    },
    goBack() {
      this.$store.state.intergralHeader = true;
      this.$router.push("/personal");
    },
    // 初始化上拉加载
    initScroll() {
      this.data = [];
      this.page = 0;
      this.loadEnd = "";
      this.loadData();
    },
    loadData() {
      if (this.loadEnd == "没有更多数据") {
        return;
      }
      let limit = 10,
        start = 0; // 分页初始位置
      let pageStart = start + limit * this.page; // 上拉加载分页起始位置
      this.alreadyAppear = pageStart;
      this.API.findExpenseRecordList({
        limit: limit,
        start: pageStart
      }).then(response => {
        if (response) {
          this.page++;
          let loadmore = response.obj;
          if (response.totalCount == 0 || loadmore == null) {
            this.loadfailFlag = true;
            this.$store.state.loadfailTxt = "暂时没有记录呀~";
            return;
          } else if (response.totalCount <= 10 || loadmore.length == 0) {
            this.loadEnd = "没有更多数据";
          } else {
            this.loadEnd = "加载更多...";
          }
          this.data = this.data.concat(loadmore);
          this.loadfailFlag = false;
        }
      });
    },
    topLoadData() {
      this.topLoad = true;
      this.$store.dispatch("cancelLoader");
      let start = 0; // 分页初始位置
      this.API.findExpenseRecordList({
        limit: this.alreadyAppear + 10,
        start: start
      }).then(response => {
        if (response) {
          this.$store.dispatch("setLoader");
          this.topLoad = false;
          this.data = response.obj;
        }
      });
    }
  },
  computed: mapState({
    loadfailTxt: state => state.loadfailTxt,
    loadingFlag: state => state.loadingFlag,
    integralFontSize() {
      let size =
        this.integral.length && this.integral.length > 5 ? "60" : "120";
      return size;
    }
  })
};
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";

.account {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: 100;
}

.account .account-wrapper {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.account .account-wrapper .header-box {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 3;
}

.account .account-wrapper .header-box .type-header {
  background: #fff;
  color: #333;
  font-size: 36px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  position: relative;
}

.account .account-wrapper .header-box .type-header:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  content: "";
}

.account .account-wrapper .header-box .type-header .goback {
  width: 25px;
  height: 41px;
  position: absolute;
  left: 34px;
  top: 24px;
  background-size: 25px 41px;
  background-image: url("../../images/back_nor.png");
}

.account .account-wrapper .header-box .type-header .goback:active {
  background-image: url("../../images/back_pre.png");
}

.account .account-wrapper .header-box .type-header .type-text {
  display: block;
  width: 256px;
  margin: 0 auto;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.account .account-wrapper .line-first {
  position: absolute;
  top: 88px;
  width: 100%;
  height: 24px;
  background-color: #eeeeee;
  z-index: 1;
}

.account .account-wrapper .line-second {
  position: absolute;
  top: 512px;
  width: 100%;
  height: 24px;
  background-color: #eeeeee;
  z-index: 1;
}

.account .account-wrapper .integral-wrapper {
  position: absolute;
  top: 112.00000000000001px;
  width: 100%;
  height: 400px;
  background-color: #fff;
  z-index: 1;
}

.account .account-wrapper .integral-wrapper .left-box {
  float: left;
  width: 50%;
  height: 400px;
}

.account .account-wrapper .integral-wrapper .left-box .integral-title {
  display: block;
  margin: 60px 0 30px 60px;
  font-size: 28.000000000000004px;
  color: #494949;
}

.account .account-wrapper .integral-wrapper .left-box .integral-num {
  display: block;
  margin: 0 0 60px 60px;
  font-size: 120px;
  /*font-family: PingFang-SC-Bold*/
  color: #ff6419;
}

.account .account-wrapper .integral-wrapper .left-box .integral-num.size5 {
  font-size: 60px;
}

.account .account-wrapper .integral-wrapper .left-box .integral-button {
  margin-left: 60px;
  width: 240px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 28.000000000000004px;
  color: #fff;
  background-color: #ff6419;
  border-radius: 30px;
}

.account .account-wrapper .integral-wrapper .right-box {
  float: left;
  position: relative;
  width: 40%;
  height: 400px;
}

.account .account-wrapper .integral-wrapper .right-box .meal-title {
  display: block;
  margin: 60px 0 40px 0;
  font-size: 28.000000000000004px;
  color: #494949;
}

.account .account-wrapper .integral-wrapper .right-box .meal-content {
  display: block;
  margin-bottom: 20px;
  font-size: 40px;
  font-family: PingFang-SC-Bold;
  color: #ff6419;
}

.account .account-wrapper .integral-wrapper .right-box .meal-date {
  display: block;
  font-size: 20px;
  color: #494949;
}

.account .account-wrapper .integral-wrapper .right-box .bg {
  position: absolute;
  bottom: 40px;
  right: -30px;
  width: 137px;
  height: 140px;
  background-image: url("../../images/accountBg.png");
  background-size: 137px 140px;
}

.account .account-wrapper .record-wrapper {
  position: absolute;
  top: 536px;
  bottom: 0;
  width: 100%;
  background-color: #eeeeee;
}

.account .account-wrapper .record-wrapper .record-header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 88px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  z-index: 1;
}

.account .account-wrapper .record-wrapper .record-header .record-title {
  display: block;
  float: left;
  margin-left: 30px;
  line-height: 88px;
  font-size: 30px;
  color: #494949;
}

.account .account-wrapper .record-wrapper .record-header .record-total {
  display: block;
  float: left;
  margin-right: 30px;
  line-height: 88px;
  font-size: 30px;
  color: #494949;
}

.account .account-wrapper .record-wrapper .record-content {
  position: absolute;
  top: 88px;
  bottom: 98px;
  width: 100%;
}

.account .account-wrapper .record-wrapper .record-content .list-wrapper {
  width: 100%;
}

.account
  .account-wrapper
  .record-wrapper
  .record-content
  .list-wrapper
  .list-item {
  display: flex;
  height: 140px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}

.account
  .account-wrapper
  .record-wrapper
  .record-content
  .list-wrapper
  .list-item
  .left-wrap {
  flex: 2;
}

.account
  .account-wrapper
  .record-wrapper
  .record-content
  .list-wrapper
  .list-item
  .left-wrap
  .left-item {
  margin: 30px 0;
}

.account
  .account-wrapper
  .record-wrapper
  .record-content
  .list-wrapper
  .list-item
  .left-wrap
  .left-item
  .name {
  display: block;
  margin-bottom: 26px;
  margin-left: 30px;
  width: 500px;
  font-size: 30px;
  color: #494949;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 43px;
  line-height: 43px;
}

.account
  .account-wrapper
  .record-wrapper
  .record-content
  .list-wrapper
  .list-item
  .left-wrap
  .left-item
  .data {
  display: block;
  margin-left: 30px;
  font-size: 24px;
  color: #8e8e8e;
}

.account
  .account-wrapper
  .record-wrapper
  .record-content
  .list-wrapper
  .list-item
  .right-wrap {
  flex: 1;
}

.account
  .account-wrapper
  .record-wrapper
  .record-content
  .list-wrapper
  .list-item
  .right-wrap
  .integral {
  display: block;
  float: right;
  line-height: 136px;
  margin-right: 30px;
  font-size: 36px;
  color: #ff6419;
}

.account
  .account-wrapper
  .record-wrapper
  .record-content
  .list-wrapper
  .list-item
  .right-wrap
  .free-integral {
  color: #494949;
}
</style>
