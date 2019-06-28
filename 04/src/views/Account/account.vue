<template>
  <div class="account">
      <div class="account-wrapper">
      <header>
        <i class="icon-left" @click="$router.push('/user')"></i>
        <div class="title">我的账户</div>
      </header>
        <div class="line-first"></div>
        <div class="integral-wrapper">
          <div class="left-box">
            <span class="integral-title">剩余度币</span>
            <!-- <span class="integral-num" :class="{'size5' : integralFontSize === '60'}">{{integral}}</span> -->
            <span class="integral-num">{{integral}}</span>
            <div class="integral-button" @click="toPayPage">去充值</div>
          </div>
          <!-- 全网去除度币，走包年包月逻辑，故去掉提示 -->
          <!-- <div class="right-box">
            <span class="meal-title" v-text="mealState !== '0' ? '已开通' : '未开通'"></span>
            <span class="meal-content">渲染套餐</span>
            <span class="meal-date" v-if="mealState !== '0'">{{mealExpiryTime}}到期</span>
            <div class="bg"></div>
          </div> -->
        </div>
        <div class="line-second"></div>
        <div class="record-wrapper">
          <div class="record-header border-1px clearfix">
            <span class="record-title">消费记录</span>
            <span class="record-total">总计:&nbsp;&nbsp;{{costIntegral}}度币</span>
          </div>
          <scroll class="wrapper record-content"
                  :data="data"
                  :pullup="pullup"
                  :pulldown="pulldown"
                  :beforeScroll="beforeScroll"
                  @pullup="loadData"
                  @scrollToEnd="topLoadData"
                  >
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
                  <template v-if="item.financeType == 'In'">+</template><template v-if="item.financeType == 'Out'">-</template><template>{{item.totalFee}}<template v-if="item.productType === 'mobile_postphone'"><template v-if="item.payType === 'weixinpay' || item.payType === 'alipay'">度币</template><template v-else>元</template></template><template><template v-if="item.productType === 'render_product_pay' || item.productType === 'franchiser_product_pay'">元</template><template v-else>度币</template></template></template>
                </span>
                </div>
              </li>
              <div class="loading-wrapper">{{loadEnd}}</div>
            </ul>
          </scroll>
          <!-- <loadfail v-if="loadfailFlag"></loadfail>
          <loading v-if="loadingFlag"></loading> -->
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import { mapState } from 'Vuex';
  import minix from '@/mixins/mixin'
  import { findExpenseRecordList, getUserBalance } from '@/api/account'
  export default {
   mixins:[minix],
    data() {
      return {
        mealState: '0', // 套餐状态 默认0没有权限 1：送3个月免费渲染权限 2：包月 3：包年 4：包月
        mealExpiryTime: '', // 套餐到期时间
        beforeScroll: true,
        pullup: true,
        pulldown: true,
        integral: '', // 当前积分
        data: [],
        loadEnd: '',
        alreadyAppear: 0,
        loadfailFlag: false,
        page: 0, // 分页数
        costIntegral: null, // 消费的积分
        topLoad: false,
        Mark: {
          curPage: 1,
          pageSize: 10
        }
      };
    },
    activated() {
      this.Mark.curPage= 1;
      this.initScroll();
      this._getIntegral()
    },
    methods: {
      toPayPage() {
        sessionStorage.setItem('returnPayUrl', 'account');
        this.$router.push('/paypage');
      },
      _getIntegral() {
        let userName = JSON.parse(localStorage.getItem('userInfo')).mobile;
        let pwd = JSON.parse(localStorage.getItem('userInfo')).userKey;
        // let userName = '17603083951';
        // let pwd = "be44dc89aaeff5e196ea0aa905bd5512";
        getUserBalance({
          account: userName,
          password: pwd
        }).then((res) => {
          if (res) {
            this.integral = Math.floor(res.obj.balanceIntegral).toString();
            this.costIntegral = Math.floor(res.obj.consumAmount);
            this.mealState = res.obj.state;
            this.mealExpiryTime = res.obj.expiryTime;
          }
        });
      },
      // 初始化上拉加载
      initScroll() {
        this.data = [];
        this.page = 0;
        this.loadEnd = '';
        this.loadData();
      },
      loadData() {
        if (this.loadEnd == '没有更多数据') {
          return;
        }
        /*
        let limit = 10,
          start = 0;  // 分页初始位置
        let pageStart = start + limit * this.page; // 上拉加载分页起始位置
        this.alreadyAppear = pageStart;
        **/
        findExpenseRecordList(this.Mark).then((response) => {
          if (response) {
            this.page++;
            let loadmore = response.obj;
            if (response.totalCount == 0 || loadmore == null) {
              this.loadfailFlag = true;
              this.$store.state.loadfailTxt = '暂时没有记录呀~';
              return;
            } else if (response.totalCount <= 10 || loadmore.length == 0) {
              this.loadEnd = '没有更多数据';
            } else {
              this.loadEnd = '加载更多...';
            }
            this.data = this.data.concat(loadmore);
            this.loadfailFlag = false;
          }
        });
      },
      topLoadData() {
        this.Mark.curPage++;
        this.topLoad = true;
        this.$store.dispatch('cancelLoader');
        let start = 0;  // 分页初始位置
        findExpenseRecordList(this.Mark).then((response) => {
          if (response) {
            this.$store.dispatch('setLoader');
            this.topLoad = false;
            //this.data = response.obj;
            this.data = this.data.concat(response.obj);
          }
        });
      }
    },
    // computed: mapState({
    //   loadfailTxt: state => state.loadfailTxt,
    //   loadingFlag: state => state.loadingFlag,
    //   integralFontSize() {
    //     let size = this.integral.length && this.integral.length > 5 ? '60' : '120';
    //     return size;
    //   }
    // })
  };
</script>
<style lang="scss" scoped>
  @import '../../styles/header.scss';
</style>
<style lang="scss" scoped>
  .account{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 100;
    .account-wrapper{
      position: relative;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      .header-box{
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 3;
        .type-header{
          background: #fff;
          color: #333;
          font-size: 36px;
          height:88px;
          line-height:88px;
          text-align: center;
          border: solid 1px #ddd;
          .goback{
            width: 25px;
            height:41px;
            position: absolute;
            left: 34px;
            top: 24px;
            background-size: 25px41px;
            // bg-image: ('back_nor')
            // &:active
            //   bg-image: ('back_pre')
          }
          .type-text{
            display: block;
            width: 256px;
            margin: 0 auto;
            word-break: keep-all;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
      .line-first{
        position: absolute;
        top:88px;
        width: 100%;
        height: 24px;
        background-color: #eeeeee;
        z-index: 1;
      }
      .line-second{
        position: absolute;
        top: 512px;
        width: 100%;
        height: 24px;
        background-color: #eeeeee;
        z-index: 1;
      }
      .integral-wrapper{
        position: absolute;
        top: 1.12rem;
        width: 100%;
        height: 400px;
        background-color: #fff;
        z-index: 1;
        .left-box{
          float: left;
          width: 50%;
          height: 400px;
          .integral-title{
            display: block;
            margin: 60px 0 30px 60px;
            font-size: 28px;
            color: #494949;
          }
          .integral-num{
            display: block;
            margin: 0 0 60px 60px;
            font-size: 120px;
            /*font-family: PingFang-SC-Bold*/
            color: #ff6419;
            // &.size5
            //   font-size: 60px
          }
          .integral-button{
            margin-left: 60px;
            width: 240px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 28px;
            color: #fff;
            background-color: #ff6419;
            border-radius: 30px;
          }
        }
      }
        .right-box{
          float: right;
          position: relative;
          width: 40%;
          height: 400px;
          .meal-title{
            display: block;
            margin: 60px 0 40px 0;
            font-size: 28px;
            color: #494949;
          }
          .meal-content{
            display: block;
            margin-bottom: 20px;
            font-size: 40px;
            font-family: PingFang-SC-Bold;
            color: #ff6419;
          }
          .meal-date{
            display: block;
            font-size: 20px;
            color: #494949;
          }
          .bg{
            position: absolute;
            bottom: 40px;
            right: -30px;
            width: 137px;
            height: 140px;
            // bg-image('accountBg')
            background-size: 137px 140px
          }
          
        }
          
      .record-wrapper{
        position: absolute;
        top: 536px;
        bottom: 0;
        width: 100%;
        background-color: #eeeeee;
        .record-header{
          position: absolute;
          top: 0;
          width: 100%;
          height:88px;
          border-bottom: 1px solid #eee;
          background-color: #fff;
          z-index: 1;
          .record-title{
            display: block;
            float: left;
            margin-left: 30px;
            line-height:88px;
            font-size: 30px;
            color: #494949;
          }
          .record-total{
            display: block;
            float: right;
            margin-right: 30px;
            line-height:88px;
            font-size: 30px;
            color: #494949;
          }
        }
      }
        .record-content{
          position: absolute;
          top:88px;
          bottom: 98px;
          width: 100%;
          .list-wrapper{
            width: 100%;
            .list-item{
              display: flex;
              height: 140px;
              border-bottom: 1px solid #eee;
              background-color: #fff;
              .left-wrap{
                flex: 1;
                .left-item{
                  margin: 30px 0;
                  .name{
                    display: block;
                    margin-bottom: 26px;
                    margin-left: 30px;
                    width: 400px;
                    font-size: 30px;
                    color: #494949;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    height: 43px;
                    line-height: 43px;
                  }
                  .data{
                    display: block;
                    margin-left: 30px;
                    font-size: 24px;
                    color: #8e8e8e;
                    }
                }
              }
              .right-wrap{
                flex: 1;
                .integral{
                  display: block;
                  float: right;
                  line-height: 136px;
                  margin-right: 30px;
                  font-size: 36px;
                  color: #ff6419;
                .free-integral{
                  color: #494949;
                  }
                }
              }
            }
          }
        }
  }
</style>
