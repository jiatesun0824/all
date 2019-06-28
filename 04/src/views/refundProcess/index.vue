
<!--退款详情页面-->
<template>
  <div class="refundDetail">
    <div class="header">
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">详情</div>
    </div>
    <scroll :probeType="probeType"
            ref="scroll"
            :listenScroll="listenScroll">
      <div class="refundDetail-content">
         <div class="infobox clearfix">
             <div class="leftbox">
                <h1 class="name" v-if="OrderDetail.userName">{{OrderDetail.userName}}</h1>
                <h1  class="name" v-else>无</h1>
                <p class="num" v-if="OrderDetail.mobile">{{OrderDetail.mobile}}</p>
                <p class="num" v-else>无</p>
                <p class="text" v-if="OrderDetail.orderStatus==0">待支付</p>
                <p class="text" v-else-if="OrderDetail.orderStatus==1">订单超时</p>
                <p class="text" v-else-if="OrderDetail.orderStatus==2">待沟通</p>
                <p class="text" v-else-if="OrderDetail.orderStatus==3">有意向</p>
                <p class="text" v-else-if="OrderDetail.orderStatus==4">无意向</p>
                <p class="text" v-else-if="OrderDetail.orderStatus==5">已签约</p>
                <p class="text" v-else-if="OrderDetail.orderStatus==6">已完成</p>
                <p class="text" v-else-if="OrderDetail.orderStatus==6">待付服务费</p>
                <p class="text" v-else>无</p>
             </div>
             <div class="rightbox">
                <img class="phonelogo" src="./images/phone-03@2x.png">
             </div>
         </div>
         <div class="decorationIdea">
            <div class="ideabox">
                <p class="ideatext">记录客户装修意向，方便后续更快捷跟进哟！</p>
                <span class="havebtn">有装修意向</span>
                <span class="nonebtn">无装修意向</span>
            </div>
         </div>
         <div class="userInfo">
              <h2 class="usertitle">业主信息</h2>
              <p>位置信息：{{OrderDetail.provinceInfo}}{{OrderDetail.cityInfo}}{{OrderDetail.areaName}}</p>
              <p>房屋信息：{{OrderDetail.houseAcreage}}|{{OrderDetail.bedroomNum}}{{OrderDetail.livingRoomNum}}{{OrderDetail.toiletNum}}</p>
              <p>装修信息：{{OrderDetail.decorateHouseType}}|{{OrderDetail.decorateStyle}}|{{OrderDetail.decorateType}}</p>
              <p>预算：{{OrderDetail.decorateBudgetInfo}}</p>
              <p>来源：{{OrderDetail.clientSource}}</p>
              <p>客单价：{{OrderDetail.price}}度币</p>
              <p>三度备注：{{OrderDetail.remark1}}</p>
              <div class="remarkbox">
                  <h3 class="remark">备注信息</h3>
                  <p v-if="OrderDetail.remark2">{{OrderDetail.remark2}}</p>
                  <p v-else>无</p>
                  <span class="remarkeidt" @click="goRemarkEdit"></span>
              </div>
              <div class="refundbox">
                 <p class="refundtext" v-if="OrderDetail.refundStatus==0">退款审核中</p>
                 <p class="refundtext" v-if="OrderDetail.refundStatus==1">已退款</p>
                 <p class="refundtext" v-if="OrderDetail.refundStatus==2">退款申请驳回</p>
                 <span v-else class="refundbtn" @click="goWhy">申请退款</span>
              </div>
         </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import minix from "@/mixins/mixin";
  import { behaviorTotal } from 'api/home';
  export default {
    mixins: [minix],
    name: "refundDetail",
    components:{
  
    },
    data(){
      return{
         OrderDetail:{},
      }
    },
    activated () {
      this.GetOrderDetail();
    },
    mounted(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.$refs.scroll.refresh()
        },200)
      })
    },
    methods:{
      // goRemarkEdit(){
      //   sessionStorage.setItem('remarkText',this.OrderDetail.remark2)
      //   this.$router.push('/orderRemark');
      // },
      goWhy(){
        this.$router.push('refundWhy');
      },
      GetOrderDetail(){
        this.API.getorderDetail({
          orderId:262,
        }).then(res=>{
          console.log(res.obj);
          res.obj.mobile = res.obj.mobile.substring(0,3)+'-'+ res.obj.mobile.substring(3,7)+ '-'+ res.obj.mobile.substring(7, 11);
          this.OrderDetail = res.obj
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .refundDetail {
    height: 100%;
    background: #f7f7f7;
    overflow: hidden;
    .header{
      background-color: #ffffff;
      position: relative;
      .icon-left{
        position: absolute;
        left: 0;
        top: 0;
      }
      .title{
        height: 88px;
        line-height: 88px;
        text-align: center;
        font-size: 34px;
        color: #333333;
      }
    }
    .refundDetail-content{
      margin: 30px;
      background: white;
      .infobox{
         .leftbox{
           float: left;
           margin: 74px 0 30px 38px;
           .name{
             font-size: 40px;
             color: #333333;
             font-weight: bold;
           }
           .num{
             color: #333333;
             font-size: 24px;
             margin: 20px 0;
           }
           .text{
             color: #ff6419;
             font-size: 24px;
           }
         }
         .rightbox{
           float: right;
           margin: 74px 40px 70px 0;
           .phonelogo{
             width:72px;
             height:72px;
           }
         }
      }
      .decorationIdea{
        .ideabox{
          padding: 40px;
          .ideatext{
            color:#999999;
            font-size: 24px;
            margin-bottom: 24px;
          }
          .havebtn,.nonebtn{
            height: 64px;
            line-height: 64px;
            text-align: center;
            width: 206px;
            display: inline-block;
            color: #ffffff;
            font-size: 28px;
            border-radius: 32px;
          }
          .havebtn{
            background: #f25253;
            margin-right: 24px;
          }
          .nonebtn{
            background: #ff6419;
          }
        }
      }
      .userInfo{
        margin: 40px 40px  0 40px;
        .usertitle{
          color: #333333;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 30px;
        }
        >p{
          color: #333333;
          line-height: 40px;
          font-size: 24px;
        }
        .remarkbox{
          position: relative;
          .remark{
            color: #333333;
            font-size: 28px;
            font-weight: bold;
            margin: 52px 0 22px 0;
          }
          .remarkeidt{
            width: 24px;
            height: 22px;
            position: absolute;
            top: 0;
            right: 0;
            display: inline-block;
            background: url('./images/edit@2x.png') no-repeat;
            background-size: 24px 22px;
          }
          >p{
            color: #333333;
            font-size: 24px;
            line-height: 40px;
          }
        }
        .refundbox{
          text-align: right;
          height: 90px;
          border-top: 1px solid #e8e8e8;
          padding-bottom: 90px;
          margin-top: 72px;
          .refundbtn{
            margin-top: 32px;
            color:#333333;
            font-size: 28px;
            width: 160px;
            height: 56px;
            line-height: 56px;
            text-align: center;
            border:  2px solid #d7d7d7;
            border-radius: 28px;
            box-sizing: border-box;
            display: inline-block;
          }
          .refundtext{
            font-size: 28px;
            color: #ff6419;
            line-height: 90px;
          }
        }
      }
    }
  }
</style>
