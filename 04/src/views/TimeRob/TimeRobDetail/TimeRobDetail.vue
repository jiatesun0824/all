<template>
  <div class="TimeRobDetail">
    <header>
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">详情</div>
    </header>
    <div class="main">
      <div class="box">
        <div class="name">{{dataDetail.userName}}</div>
        <div class="phone">{{dataDetail.mobile}}</div>
        <div class="status" v-if="dataDetail.orderStatus ==2">待支付</div>
        <div class="status" v-if="dataDetail.orderStatus ==1">已抢购</div>
        <div class="status" v-if="dataDetail.orderStatus ==0">待抢购</div>
        <div class="title">业主信息</div>
        <div class="info">位置信息：{{dataDetail.positionInfo}} </div>
        <div class="info">房屋信息：{{dataDetail.houseInfo}} </div>
        <div class="info">装修信息：{{dataDetail.decorateInfo}} </div>
        <div class="info">预算：{{dataDetail.budgetInfo}} </div>
        <div class="info">来源：{{dataDetail.clientSource}} </div>
        <div class="info">客单价：{{dataDetail.priceInfo}} </div>
        <div class="info">三度备注：{{dataDetail.remark}} </div>
        <div class="time" v-if="dataDetail.orderStatus==2">剩余：{{remainingTime | timeFilterFen}}</div>
        <div class="butBox" v-if="dataDetail.orderStatus==2">
          <span class="pay_but" @click="pay">立即支付</span>
        </div>
        <div class="butBox" v-if="dataDetail.orderStatus==2">
          <span class="pay_but" @click="cancleOrder" style="background: none;border: solid 1px #ddd; color: #333;margin-top: 0.3rem;">取消订单</span>
        </div>
        <div class="butBox" v-if="dataDetail.orderStatus==0" style="margin-top:0.9rem">
          <span class="pay_but" @click="seckillpost">立即抢购</span>
        </div>
      </div>
    </div>
    <div class="payToast" v-if="payToastShow">
      <div class="payToast_main">
        <div class="close">
          <img src="./images/x.png" alt="" @click="closePayToast">
        </div>
        <div class="price">
          <span class="price_val">{{dataDetail.priceInfo}}</span>
          <!-- <span class="price_tit">度币</span> -->
        </div>
        <div class="price_but" @click.stop="payNow">
          <span>立即支付</span>
        </div>
        <div class="but_tit">{{remainingTime | timeFilterFen}}后系统将取消此单的指派</div>
      </div>
    </div>
    <robpayfail :robPayFailShow='robPayFailShow' @closePayFail ='robPayFailShow= false'></robpayfail>
    <div class="noCount" v-show="noCountShow">
      <div class="noCount_main">
        <img class="qiangdan" src="../images/icon-qiangdan@2x.png" alt="">
        <div class="qiangdan_tit">每日一次抢单机会，您今日已用完咯</div>
        <div class="noCount_but" @click="noCountShow = false">知道了，再看看</div>
      </div>
    </div>
  </div>
</template>
<script>
  let timeInter;
  import mixins from "@/mixins/mixin";
  import {mapActions} from "Vuex";
  export default {
    mixins: [mixins],
    data() {
      return {
        robPayFailShow: false,
        payToastShow: false,
        dataDetail: {},
        noCountShow: false,
        remainingTime: 0
      }
    },
    activated() {
      this.API.getTimeRobDetails(this.$route.query.item.id).then(res => {
        this.dataDetail = res.obj;
        if (this.dataDetail.orderStatus == 2) {
            this.remainingTime = this.dataDetail.remainingTime;
            this.TimeRemain();
        }
      })
    },
    methods: {
      ...mapActions("rob", ['setIsCancle', 'setIsPaySuc']),
      // 取消订单
      cancleOrder() {
        this.API.updateStatus({id: this.dataDetail.id, status: 8}).then(res=> {
          if(res.message == 'success') {
            this.setIsCancle(true);
            this.API.getTimeRobDetails(this.$route.query.item.id).then(res => {
              this.dataDetail = res.obj;
              if (this.dataDetail.orderStatus == 2) {
                this.remainingTime = this.dataDetail.remainingTime;
                this.TimeRemain();
              }
            })
          }
        })
      },
      TimeRemain() {
        clearInterval(timeInter);
         let date = new Date();
         let SystemTimeAfterCountdown = date.getTime() + this.remainingTime; // 倒计时之后的系统时间
          timeInter = setInterval(() => {
            if (this.remainingTime >= 1000) {
              let time = new Date();
              this.remainingTime = SystemTimeAfterCountdown - time.getTime();
            } else {
              clearInterval(timeInter);
              this.API.getTimeRobDetails(this.$route.query.item.id).then(res => {
                this.dataDetail = res.obj;
              })
            }
          }, 1000)
      },
      seckillpost() {
        this.API.seckill(this.dataDetail.id).then(res => {
          if (res.obj.status == 1) {
            this.API.getTimeRobDetails(this.$route.query.item.id).then(res => {
              this.dataDetail = res.obj;
              if (this.dataDetail.orderStatus == 2) {
                this.remainingTime = this.dataDetail.remainingTime;
                 this.TimeRemain();
              }
            })
          } else if (res.obj.status == 3) {
            this.noCountShow = true;
          } else {
            this.$toast(res.obj.message);
          }
        })
      },
      // 支付
      payNow() {
        this.API.timeRobPay(this.dataDetail.id).then(res => {
          if (res.obj.payStatus == 0) {
            this.setIsPaySuc(true);
            this.$router.push({
              path: '/mycumser_detail',
              query: {
                orderId: res.obj.orderId,
                paysucc: true
              }
            })
          }else if(res.obj.payStatus==2) {
            this.payToastShow = false;
            this.robPayFailShow = true;
          } else {
            this.$toast(res.obj.message);
          }
        })
      },
      pay() {
        this.payToastShow = true;
      },
      closePayToast() {
        this.payToastShow = false;
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/timeRobDetail.scss';

</style>
