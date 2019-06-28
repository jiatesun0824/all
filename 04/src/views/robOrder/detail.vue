
<template>
  <div class="detail">
    <div class="header">
      <i class="icon-left" @click="$router.push('/robOrder')"></i>
      <div class="title">详情</div>
    </div>
    <scroll :probeType="probeType"
            ref="scroll"
            :listenScroll="listenScroll">
      <div class="detail-content">
           <div class="detail-section">
               <div class="detail-item" v-if="orderDetailData.priceStatus==1||orderDetailData.priceStatus==4">
                  <img src="./images/icon-Success@2x.png" alt="">
                  <p v-if="orderDetailData.priceStatus==1">报价成功，等待平台反馈</p>
                  <p v-if="orderDetailData.priceStatus==4">您已经被选中，等待平台反馈</p>
                  <p>我们会在24小时内反馈是否成功接单，请留意APP内消息提醒。成功接单后，系统会自动扣取度币</p>
               </div>
               <div class="detail-item" v-else>
                 <img src="./images/cancel@2x.png" alt="">
                 <p v-if="orderDetailData.priceStatus==2">很遗憾，您未被选中！</p>
                 <p v-else-if="orderDetailData.priceStatus==3">很遗憾，超时将取消报价</p>
               </div>
               <div class="detail-total">
                   <div class="total">
                      <span>报价合计：</span>
                      <em>￥{{orderDetailData.totalFee}}</em>
                   </div>
                   <div class="total-price">
                       <div class="total-price-item">
                           <span>设计费<em>￥{{orderDetailData.designFee}}</em></span>
                           <span>材料费<em>￥{{orderDetailData.materialFee}}</em></span>
                       </div>
                       <div class="total-price-item">
                           <span>质检费<em>￥{{orderDetailData.checkFee}}</em></span>
                           <span>人工费<em>￥{{orderDetailData.labourFee}}</em></span>
                       </div>
                   </div>
               </div>
           </div>
           <owner :orderDetailData="orderDetailData"></owner>
      </div>
    </scroll>
  </div>
</template>

<script>
  import minix from "@/mixins/mixin";
  import { robOrderDetail } from 'api/home';
  import owner from './components/owner'
  export default {
    mixins: [minix],
    name: "detail",
    components:{
      owner
    },
    data(){
      return{
        priceId:this.$route.params.id,
        orderDetailData:''
      }
    },
    created(){
      robOrderDetail({priceId:this.priceId}).then(res=>{
        if(res.success){
           this.orderDetailData=res.obj;
           this.orderDetailData.planRecommendedId=res.obj.designplanId;
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
    methods:{

    }
  }
</script>

<style lang="scss" scoped>
  .detail {
    height: 100%;
    background-color: #f7f7f7;
    overflow: hidden;
    .header{
      background-color: #fff;
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
    .detail-content{
       padding: 0 32px 120px 32px;
       .detail-section{
           background-color: #fff;
           padding: 40px;
           margin-top: 30px;
           .detail-item{
             padding-bottom: 30px;
             border-bottom: 1px solid #f7f7f7;
              img{
                display: block;
                width: 87px;
                height: 87px;
                margin: 0 auto;
              }
             p:nth-of-type(1){
               text-align: center;
               color: #333333;
               font-size: 28px;
               line-height: 32px;
               margin-top: 40px;
               margin-bottom: 24px;
             }
             p:nth-of-type(2){
               text-align: center;
               color: #999;
               font-size: 24px;
               line-height: 38px;
             }
           }
         .detail-total{
             .total{
                margin-top: 40px;
               font-size: 28px;
               color: #333333;
               position: relative;
               font-weight: bold;
               em{
                 position: absolute;
                 right: 0;
                 top: 0;
                 font-style: normal;
                 color: #ff6419;
               }
             }
           .total-price{
              margin-top: 25px;
              background-color: #fff9f6;
              padding: 20px;
             .total-price-item{
               position: relative;
                span{
                  color: #999999;
                  font-size: 24px;
                  line-height: 48px;
                  em{
                    color: #333333;
                    font-style: normal;
                    margin-left: 10px;
                  }
                }
                span:nth-of-type(2){
                   position: absolute;
                    right: 0;
                    top: 0;
                }
             }
           }

         }
       }
    }
  }
</style>
