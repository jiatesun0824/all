<template>
  <div class="mycumserdetail">
    <header>
      <i class="icon-left" @click="goBack()"></i>
      <div class="title">详情</div>
    </header>
    <div class="main">
      <scroll class="wrapper" :probeType="probeType"
            ref="scroll"
            :pullup="true"
            :listenScroll="listenScroll"
            :refreshScroll="true"
            >
        <div class="box">
          <div class="head" v-if="!paysucc&&dataDetail.orderStatus!=1">
            <img src="./images/phone-03@2x.png" class="callImg" v-if="dataDetail.orderStatus!=0" @click="callShow = true" alt="">
            <div class="name">{{dataDetail.userName}}</div>
            <div class="phone">{{dataDetail.mobile}}</div>
            <div class="status" v-if="dataDetail.orderStatus==2">待沟通</div>
            <div class="status" v-if="dataDetail.orderStatus==3">有意向</div>
            <div class="status" v-if="dataDetail.orderStatus==4">无意向</div>
            <div class="status" v-if="dataDetail.contractStatus==0">待上传合同</div>
            <div class="status" v-if="dataDetail.orderStatus==7">待支付服务费</div>
            <div class="status" v-if="dataDetail.orderStatus==6">已完成</div>
          </div>
          <div class="result" v-if="!paysucc&&dataDetail.orderStatus!=1">
            <div class="tit" v-if="dataDetail.orderStatus==2">记录客户装修意向，方便后续更快捷跟进哟！</div>
            <div class="tit" v-if="dataDetail.orderStatus==3">该用户已经签约了吗？</div>
            <div class="tit" v-if="dataDetail.orderStatus==7">您需要支付服务费 </div>

            <div class="intention" v-if="dataDetail.orderStatus==2">
              <span class="haveint" @click="updateOrder(3)">有装修意向</span> <span class="noint" @click="updateOrder(4)">无装修意向</span>
            </div>
            <div class="intention" v-if="dataDetail.orderStatus==3">
              <span class="noint" @click="updateOrder(5)">已签约</span>
            </div>
            <div class="money" v-if="dataDetail.orderStatus==7">
              <div class="money_price"><span style="font-size:0.32rem">￥</span>{{dataDetail.serviceFee}}</div>
              <div class="money_tit">缴费截止时间：{{dataDetail.endOfServicePayTimeStr}}</div>
            </div>
            <div class="gameOver" v-if="dataDetail.orderStatus==6&&dataDetail.contractFee!=0">
              <div class="gameOver_tit">成交金额</div>
              <div class="gameOver_price">
                <span>￥</span>
                {{dataDetail.contractFee}}
              </div>
            </div>
          </div>
          <div class="paySuccess" v-if="paysucc&&dataDetail.orderStatus!=1">
            <div class="paySuccess_IconBox">
              <img src="./images/icon-Success@2x.png" alt="">
            </div>
            <div class="paySuccess_title">支付成功</div>
            <div class="paySuccess_tit"> 恭喜您！{{dataDetail.userName}}已经是您的客户了</div>
            <div class="paySuccess_ButBox">
              <div class="paySuccess_But">
                <span @click.stop="callShow=true;callPhoneValue = dataDetail.mobile">📞立即联系他</span>
              </div>
            </div>
            <div class="paySuccess_ButTit">温馨提示：11:00-13:00和18:00-22:00间沟通业主更容易签单哦！</div>
          </div>
          <div class="body">
            <div class="payFail" v-if="dataDetail.orderStatus==1">
              <img src="./images/cancel@2x.png" alt="">
              <div class="payFail_title">很遗憾，支付超时！</div>
              <div class="payFail_tit">错过了Ta，下次记得要及时支付哟~</div>
            </div>
            <div class="quotation_head" v-if="dataDetail.orderStatus==1&&dataDetail.orderType==2">
              报价合计：
              <span class="quotation_head_val">¥{{dataDetail.totalFee}}</span>
            </div>
            <div class="quotation" v-if="dataDetail.orderStatus==1&&dataDetail.orderType==2">
              <div class="quotation_item">
                <div>
                  <span>设计费</span>￥{{dataDetail.designFee}}
                </div>
                <div>
                  <span>材料费</span>￥{{dataDetail.materialFee}}
                </div>
              </div>
              <div class="quotation_item">
                <div>
                  <span>质检费</span>￥{{dataDetail.checkFee}}
                </div>
                <div>
                  <span>人工费</span>￥{{dataDetail.labourFee}}
                </div>
              </div>
            </div>
            <div class="title">业主信息</div>
            <div class="body_item">位置信息：{{dataDetail.provinceInfo}}{{dataDetail.cityInfo}} {{dataDetail.areaName}}</div>
            <div class="body_item">房屋信息：{{dataDetail.houseAcreage}}㎡ |
              {{dataDetail.bedroomNum}}室{{dataDetail.livingRoomNum}}厅{{dataDetail.toiletNum}}卫</div>
            <div class="body_item">装修信息：{{dataDetail.decorateHouseTypeInfo}} | {{dataDetail.decorateStyleInfo}} |
              {{dataDetail.decorateTypeInfo}}</div>
            <div class="body_item">预算：{{dataDetail.decorateBudgetInfo}}</div>
            <div class="body_item" v-if="dataDetail.orderType==0">来源：客户店铺预约</div>
            <div class="body_item" v-if="dataDetail.orderType==1">来源：平台抢单</div>
            <div class="body_item" v-if="dataDetail.orderType==2">来源：平台派单</div>
            <div class="body_item" v-if="dataDetail.orderType==3">来源：三度推荐</div>
            <div class="body_item">客单价：{{dataDetail.price}}度币</div>
            <div class="body_item">三度备注：{{dataDetail.remark1}}</div>
            <div class="body_item" v-if="dataDetail.orderStatus>1&&dataDetail.orderStatus!=6&&dataDetail.orderStatus!=7&&dataDetail.contractStatus!=0&&dataDetail.orderStatus!=8">支付时间：{{dataDetail.payTime.substr(0, 16)}}</div>
            <div class="body_item" v-if="!paysucc&&dataDetail.orderStatus!=1&&dataDetail.orderType==2">报价合计：¥{{dataDetail.totalFee}}</div>
            <div class="quotation" v-if="!paysucc&&dataDetail.orderStatus!=1&&dataDetail.orderType==2">
              <div class="quotation_item">
                <div>
                  <span>设计费</span>￥{{dataDetail.designFee}}
                </div>
                <div>
                  <span>材料费</span>￥{{dataDetail.materialFee}}
                </div>
              </div>
              <div class="quotation_item">
                <div>
                  <span>质检费</span>￥{{dataDetail.checkFee}}
                </div>
                <div>
                  <span>人工费</span>￥{{dataDetail.labourFee}}
                </div>
              </div>
            </div>
            <div class="plan720" @click="go720(dataDetail)" v-if="dataDetail.planRecommendedId">
              <img :src="dataDetail.planPicPath | filtersIMg" alt="" class="planImg">
              <div class="plan720_tit">
                3D全景▶
              </div>
            </div>
            <div class="title mt89">
              <span>备注信息</span>
              <img class="edit_img" @click="goEdit" src="./images/edit@2x.png" alt="">
            </div>
            <div class="body_item">{{dataDetail.remark2}}</div>

            <div class="body_but_tit" v-if="dataDetail.orderStatus==0&&dataDetail.orderType==1">剩余：{{payRemainingTime |
              timeFilterFen}}</div>
            <div class="body_but_tit" v-if="dataDetail.orderStatus==0&&dataDetail.orderType==3">剩余：{{payRemainingTime |
              timeFilter}}</div>
              <div class="body_but_tit" v-if="dataDetail.orderStatus==0&&dataDetail.orderType==2">剩余：{{payRemainingTime |
              timeFilter}}</div>
            <div class="body_but" v-if="dataDetail.orderStatus==0" @click="payToastShow = true">
              立即支付
            </div>
            <div class="refundStatus" v-if="dataDetail.refundStatus==0||dataDetail.refundStatus==1||dataDetail.refundStatus==2">
              <span v-if="dataDetail.refundStatus==0">退款审核中</span>
              <span v-if="dataDetail.refundStatus==1">退款审核通过</span>
              <span v-if="dataDetail.refundStatus==2">退款申请被驳回</span>
              <div class="refundReason" v-if="dataDetail.refundStatus==2">
                <span>退款申请驳回原因：</span>　{{dataDetail.refundRejectReason}}
              </div>
            </div>
            <div v-else>
              <div class="refundBox" v-if="dataDetail.orderStatus>1&&dataDetail.orderStatus!=6&&dataDetail.orderStatus!=7&&dataDetail.contractStatus!=0&&dataDetail.orderStatus!=8">
                <div class="refundbut" @click="$router.push({path:'/refundWhy',query:{orderId:$route.query.orderId}})">申请退款</div>
              </div>
            </div>
          </div>
          <div style="height:5rem"></div>
        </div>
      </scroll>
    </div>
    <div class="payToast" v-if="payToastShow">
      <div class="payToast_main">
        <div class="close">
          <img src="./images/x.png" alt="" @click="payToastShow = false">
        </div>
        <div class="price">
          <span class="price_val">{{dataDetail.price}}</span>
          <span class="price_tit">度币</span>
        </div>
        <div class="price_but" @click.stop="payNow">
          <span>立即支付</span>
        </div>
        <div class="but_tit" v-if="dataDetail.orderStatus==0&&dataDetail.orderType==1">{{payRemainingTime | timeFilterFen}}后系统将取消此单的指派</div>
         <div class="but_tit" v-if="dataDetail.orderStatus==0&&dataDetail.orderType==2">{{payRemainingTime | timeFilter}}后系统将取消此单的指派</div>
          <div class="but_tit" v-if="dataDetail.orderStatus==0&&dataDetail.orderType==3">{{payRemainingTime | timeFilter}}后系统将取消此单的指派</div>
      </div>
    </div>
    <call :callShow='callShow' :phone='callPhoneValue' @closeCall='callShow = false'></call>
    <robpayfail :robPayFailShow='robPayFailShow' @closePayFail='robPayFailShow= false'></robpayfail>
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
        callShow: false,
        callPhoneValue: '',
        time: '',
        dataDetail: {},
        paysucc: false,
        payRemainingTime: 0,
      }
    },
    created() {
      if (this.$route.query.paysucc) {
        this.paysucc = true;
      }
      this.API.getCumerDetail(this.$route.query.orderId).then(res => {
        this.dataDetail = res.obj;
        this.callPhoneValue= res.obj.mobile;
        if (this.dataDetail.orderStatus == 0) {
          this.payRemainingTime = this.dataDetail.payRemainingTime;
          let date = new Date();
         let SystemTimeAfterCountdown = date.getTime() + this.payRemainingTime; // 倒计时之后的系统时间
          this.payToastShow = true;
          clearInterval(timeInter);
          timeInter = setInterval(() => {
            if (this.payRemainingTime >= 1000) {
              let time = new Date();
              this.payRemainingTime = SystemTimeAfterCountdown - time.getTime();
            } else {
              clearInterval(timeInter);
              this.API.getCumerDetail(this.$route.query.orderId).then(res => {
                this.dataDetail = res.obj;
              })
            }
          }, 1000)
        }
      })
    },
    mounted(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.$refs.scroll.refresh()
        },200)
      })
    },
    methods: {
      ...mapActions("rob", [ 'setIsPaySuc']),
      goBack() {
        if (this.paysucc) {
          this.$router.push('/mycumser')
        } else {
          this.$router.go(-1)
        }
      },
      updateOrder(type) {
        let Mark = {
          orderStatus: type,
          orderId: this.$route.query.orderId
        }
        this.API.updateRemark(Mark).then(res => {
          this.API.getCumerDetail(this.$route.query.orderId).then(res => {
            this.dataDetail = res.obj;
          })
        })
      },
      payNow() {
        this.API.myCummerPay(this.$route.query.orderId).then(res => {
          if (res.obj.payStatus == 0) {
            this.setIsPaySuc(true);
            this.paysucc = true;
            this.payToastShow = false;
            this.API.getCumerDetail(this.$route.query.orderId).then(res => {
              this.dataDetail = res.obj;
            })
          } else if (res.obj.payStatus == 2) {
            this.payToastShow = false;
            this.robPayFailShow = true;
          } else {
            this.$toast(res.obj.message);
          }
        })
      },
      goEdit() {
        this.$router.push({
          path: '/myCumserEdit',
          query: {
            orderId: this.$route.query.orderId
          }
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/detail.scss';

</style>
