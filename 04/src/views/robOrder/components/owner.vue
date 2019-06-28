<template>
    <div class="owner">
        <div class="title">业主信息</div>
        <ul>
          <li>业主姓名：{{orderDetailData.userName}}</li>
          <li>位置信息：{{orderDetailData.provinceInfo}}{{orderDetailData.cityInfo}}{{orderDetailData.priceStatus==0||orderDetailData.priceStatus==3 ? '' : orderDetailData.areaName }}</li>
          <li>房屋信息：{{orderDetailData.houseAcreage}}㎡ | {{orderDetailData.bedroomNum}}室{{orderDetailData.livingRoomNum}}厅{{orderDetailData.toiletNum}}卫</li>
          <li>装修信息：{{orderDetailData.decorateHouseType==0 ? '新房装修' : '旧房改造'}} | {{orderDetailData.decorateStyleInfo}} | {{orderDetailData.decorateTypeInfo}}</li>
          <li>预算：{{orderDetailData.decorateBudgetInfo}}</li>
          <li>来源：{{orderDetailData.orderType==0 ? '客户店铺预约' : orderDetailData.orderType==1 ? '抢单' : orderDetailData.orderType==2 ? '平台自动派单' : orderDetailData.orderType==3 ? '内部推荐' : '平台派单'}}</li>
          <li v-if="orderDetailData.price">客单价：{{orderDetailData.price}}度币</li>
          <li>三度备注：{{orderDetailData.remark1}}</li>
        </ul>
        <div class="view720" v-if="orderDetailData.designplanId">
          <img :src="orderDetailData.planPicPath | filtersIMg" alt="">
          <div class="img-3D" @click="go720(orderDetailData)"><span>3D全景</span></div>
        </div>
    </div>
</template>

<script>
  import minix from "@/mixins/mixin";
    export default {
        mixins: [minix],
        name: "owner",
        props:['orderDetailData']
    }
</script>

<style lang="scss" scoped>
   .owner{
     background-color: #fff;
     padding: 0 32px 32px 32px;
     .title{
       color: #333333;
       font-size: 28px;
     }
     ul{
       margin-top: 40px;
       li{
         color: #333333;
         font-size: 24px;
         line-height: 48px;
       }
     }
     .view720{
       position: relative;
       height: 349px;
       img{
         height: 349px;
         width: 100%;
       }
       .img-3D{
         width: 180px;
         height: 68px;
         background-image: linear-gradient(-53deg,
           #29cccc 0%,
           #2cd9ba 60%,
           #2ee5a8 100%),
         linear-gradient(
             #29cccc,
             #29cccc);
         background-blend-mode: normal,
         normal;
         border-radius: 34px;
         opacity: 0.8;
         color: #fff;
         line-height: 68px;
         font-size: 28px;
         text-align: center;
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%,-50%);
         span{
           &:after{
             content: '';
             display: inline-block;
             width: 0;
             height: 0;
             border-top: 12px solid transparent;
             border-left: 20px solid #fff;
             border-bottom:12px solid transparent;
             vertical-align: middle;
             margin-left: 10px;
             margin-top: -6px;
           }
         }
       }
     }
   }
</style>
