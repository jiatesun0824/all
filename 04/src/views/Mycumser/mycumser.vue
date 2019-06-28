<template>
  <div class="mycumser">
    <header>
      <i class="icon-left" @click="$router.push('/')"></i>
      <div class="title">我的客户</div>
      <img class="cimg" @click="goSet()" src="./images/mine_icon_setting.png">
    </header>
    <scroll :scrollX="true" :data="tab" class="tabwrapper">
      <div class="tabbox">
        <div class="tab_item" v-for="(item, index) in tab" :key="index" @click="selTab(index)">
          <span class="tan_tit" :class="item.active?'active' :''">{{item.tit}}</span>
        </div>
      </div>
    </scroll>
    <scroll class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true" :beforeScroll="true"
      :scrollX="true" :refreshScroll="true" :data="datalist" @scrollToEnd="loadmore" ref="wrapperScroll" v-if="datalist.length!=0">
      <div class="box">
        <div class="silder" v-for="(item, index) in datalist" :key="index" @click="goDetail(item.orderId)">
          <div class="silder_head">
            <img v-if="item.orderType==1&&item.orderStatus==0" class="head_img" src="./images/qiangdanchenggong@2x.png" alt="">
            <img v-if="item.orderType==3&&item.orderStatus==0" class="head_img" src="./images/sandutuijian@2x.png" alt="">
            <div class="silder_name">
              <span>{{item.userName}}</span>
              <span class="silder_status" style="color:#999" v-if="item.orderStatus==1">已取消</span>
              <span class="silder_status" style="color:#ff6419" v-if="item.orderStatus==2">待沟通</span>
              <span class="silder_status" style="color:#ff6419" v-if="item.orderStatus==3">有意向</span>
              <span class="silder_status" style="color:#999" v-if="item.orderStatus==4">无意向</span>
              <span class="silder_status" style="color:#76d483" v-if="item.contractStatus==0">待上传合同</span>
              <span class="silder_status" style="color:#76d483" v-if="item.orderStatus==7">待支付服务费</span>
              <span class="silder_status" style="color:#76d483" v-if="item.orderStatus==6">已完成</span>
            </div>
            <div class="sidler_phone">{{item.mobile}}</div>
          </div>
          <div class="service_price" v-if="item.orderStatus==7">
            <div class="service_price_item">
              <span>平台服务费用：</span>
              <span class="service_pricev">￥{{item.serviceFee}}</span>
            </div>
            <div class="service_price_item">
              <span>缴费截止时间：</span>
              <span class="service_pricev">{{item.endOfServicePayTimeStr}}</span>
            </div>
          </div>
          <div class="sidler_main" v-else>
            <div class="sidler_area">
              {{item.areaName}} · {{item.houseAcreage}}㎡ · {{item.bedroomNum}}室{{item.livingRoomNum}}厅{{item.toiletNum}}卫
            </div>
            <div class="silder_price">{{item.decorateHouseTypeInfo}} · {{item.decorateTypeInfo}} ·
              {{item.decorateBudgetInfo}}
            </div>
            <div class="silder_pos">
              <img class="posImg" src="./images/icon-dingwei.png" alt="">
              <span>{{item.provinceInfo}}·{{item.cityInfo}}</span>
            </div>
            <div class="silder_price" style="color:#ff6419">度币：{{item.price}}
            </div>
            <div class="pay" v-if="item.orderStatus==0" @click.stop="showRobPay(item)">
              <div class="pay_iconbox">
                <img class="pay_icon" src="./images/icon-payment@2x.png" alt="">
              </div>
              <div class="pay_tit">立即支付</div>
              <div class="pay_date" v-if="item.orderType ==1">剩余时间 {{item.payRemainingTime | timeFilterFen}}</div>
              <div class="pay_date" v-else-if="item.orderType ==2">剩余时间 {{item.payRemainingTime | timeFilter}}</div>
              <div class="pay_date" v-else>剩余时间 {{item.payRemainingTime | timeFilter}}</div>
            </div>
            <div class="pay" v-if="item.orderStatus==2">
              <div class="pay_iconbox">
                <img class="pay_icon" @click.stop='callShow = true;callPhoneValue = item.mobile' src="./images/icon-phone@2x.png"
                  alt="">
              </div>
              <div class="pay_tit" @click.stop='callShow = true'>立即沟通</div>
            </div>
            <div class="haveCancle" v-if="item.orderStatus==1">
              订单支付超时 ，您与他有缘无份了！
            </div>
            <div class="gameOver" v-if="item.orderStatus==6">
              <span>成交金额：</span> <span class="gameOver_price">￥{{item.contractFee}}</span>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </scroll>
    <robpay :robShow='robShow' :time='time' @payNow='payNow' @closePay='closePay'></robpay>
    <robpayfail :robPayFailShow='robPayFailShow' @closePayFail='robPayFailShow= false'></robpayfail>
    <call :callShow='callShow' :phone='callPhoneValue' @closeCall='callShow = false'></call>
    <dispatchtit :dispathShow='dispathShow' @closeDispath='dispathShow = false'></dispatchtit>

    <div class="empty" v-if="datalist.length==0">
      <img src="./images/list_empty.png" alt="">
      <div class="">您暂时还没有客户哦！</div>
    </div>
  </div>
</template>
<script>
  let timeInter;
  import mixins from '@/mixins/mixin'
    import {
    mapGetters, mapActions
  } from 'Vuex'
  export default {
    mixins: [mixins],
    data() {
      return {
        dispathShow: false, // 设置提示
        callShow: false,
        callPhoneValue: JSON.parse(localStorage.getItem('userInfo')).mobile,
        robShow: false,
        robPayFailShow: false,
        time: 0,
        tab: [{
            tit: "全部",
            active: true,
            status: ''
          },
          {
            tit: "待支付",
            active: false,
            status: 0
          },
          {
            tit: "待沟通",
            active: false,
            status: 2
          },
          {
            tit: "有意向",
            active: false,
            status: 3
          },
          {
            tit: "无意向",
            active: false,
            status: 4
          },
          {
            tit: "待上传合同",
            active: false,
            contractStatus: 0
          },
          {
            tit: "已完成",
            active: false,
            status: 6
          },
          {
            tit: "待付服务费",
            active: false,
            status: 7
          }
        ],
        datalist: [],
        curPayItem: {}, // 当前选择的支付的订单

        times: [],
        timesEnd: [],
        Mark: {
          type: 0,
          status: '',
          start: 1,
          limit: 20
        }
      }
    },
    watch: {
      isCancle(val) {
        if(val) {
          this.getData();
          this.setIsCancle(false);
        }else {
        }
      },
      isPaySuc(val) {
        if(val) {
          this.getData();
          this.setIsPaySuc(false);
          this.robShow = false;
        }
      }
    },
    computed: {
      ...mapGetters('rob', ['isCancle', 'isPaySuc'])
    },
    activated() {
      this.getData();
      if(!(localStorage.getItem('dispathShowCum')/1==1)) {
        this.dispathShow = true;
        localStorage.setItem('dispathShowCum', 1);
      }else {
        this.dispathShow = false;
      }
    },
    created() {
      this.getData();
    },
    // 描点定位
    beforeRouteEnter(to, from, next) {
      to.meta.keepNotAlive = false;
      next();
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepNotAlive = !(to.name === 'mycumser_detail');
      let keepAliveComponent = this.$parent.$vnode.parent;
      if (keepAliveComponent && from.meta.keepNotAlive) {
        delete keepAliveComponent.componentInstance.cache[keepAliveComponent.componentInstance.keys[0]];
        keepAliveComponent.componentInstance.keys = [];
      }
      next();
    },
    methods: {
      ...mapActions("rob", ['setIsCancle', 'setIsPaySuc']),
      showRobPay(item) {
        this.robShow = true;
        this.curPayItem = item;
        this.time = item.payRemainingTime;
        clearInterval(timeInter);
         let date = new Date();
        let SystemTimeAfterCountdown = date.getTime() + this.time; // 倒计时之后的系统时间
        timeInter = setInterval(() => {
          if (this.time >= 1000) {
             let time = new Date();
            this.time = SystemTimeAfterCountdown - time.getTime();
          } else {
            clearInterval(timeInter);
            this.getData();
          }
        }, 1000)
      },
      payNow() {
        this.API.myCummerPay(this.curPayItem.orderId).then(res => {
          if (res.obj.payStatus == 0) {
            this.setIsPaySuc(true);
            this.$router.push({
              path: '/mycumser_detail',
              query: {
                orderId: this.curPayItem.orderId,
                paysucc: true
              }
            })
          }else if (res.obj.payStatus == 2) {
            this.robShow = false;
            this.robPayFailShow = true;
          }  else {
            this.$toast(res.obj.message);
          }
        })
      },
      closePay() {
        this.robShow = false;
      },
      goDetail(orderId) {
        this.$router.push({
          path: '/mycumser_detail',
          query: {
            orderId: orderId
          }
        })
      },
      getData() { // type 0：不是上传合同，1：是
        this.API.getMyCumerList(this.Mark).then(res => {
          this.datalist = res.datalist;
          this.timer();
        })
      },
      loadmore() {
        this.Mark.start++;
        this.API.getMyCumerList(this.Mark).then(res => {
          this.datalist = this.datalist.concat(res.datalist);
          this.timer();
        })
      },
      goSet() {
        this.$router.push('/mycumser_set');
      },
      selTab(sindex) {
        this.tab.map((item, index) => {
          item.active = false;
        })
        this.tab.splice(sindex, 1, { ...this.tab[sindex],
          active: true
        });
        if (sindex == 0) {
          this.Mark.type = 0;
          this.Mark.start = 1;
          this.Mark.status = '';
          this.getData();
        } else if (sindex == 5) {
          this.Mark.type = 1;
          this.Mark.start = 1;
          this.getData(1, '');
        } else {
          this.Mark.type = 0;
          this.Mark.start = 1;
          this.Mark.status = this.tab[sindex].status;
          this.getData();
        }
      },
      timeEnd() { //endOfServicePayTimeStr
          this.datalist.map((res, index) => {
          if (res.endOfServicePayTimeStr != 0) {
            clearInterval(this.timesEnd[index]);
             let date = new Date();
            res.SystemTimeAfterCountdown = date.getTime() + res.endOfServicePayTimeStr; // 倒计时之后的系统时间
            this.timesEnd[index] = setInterval(() => {
              if (res.endOfServicePayTimeStr >= 1000) {
                 let time = new Date();
                res.endOfServicePayTimeStr = res.SystemTimeAfterCountdown - time.getTime();
              } else {
                clearInterval(this.timesEnd[index]);
                // this.Mark.type = 0;
                // this.Mark.start = 1;
                // this.Mark.status = '';
                this.getData();
              }
            }, 1000)
          }
        })
      },
      timer() {
        this.datalist.map((res, index) => {
          if (res.payRemainingTime != 0) {
            clearInterval(this.times[index]);
             let date = new Date();
            res.SystemTimeAfterCountdown = date.getTime() + res.payRemainingTime; // 倒计时之后的系统时间
            this.times[index] = setInterval(() => {
              if (res.payRemainingTime >= 1000) {
                 let time = new Date();
                res.payRemainingTime = res.SystemTimeAfterCountdown - time.getTime();
              } else {
                clearInterval(this.times[index]);
                // this.Mark.type = 0;
                // this.Mark.start = 1;
                // this.Mark.status = '';
                this.getData();
              }
            }, 1000)
          }
        })
      },
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../styles/header.scss';
  @import './styles/mycumser.scss';

</style>
