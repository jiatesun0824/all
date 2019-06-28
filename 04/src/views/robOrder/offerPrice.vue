
<template>
  <div class="offerPrice">
    <div class="header">
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">报价</div>
    </div>
    <scroll :probeType="probeType"
            ref="scroll"
            :listenScroll="listenScroll">
      <div class="offerPrice-content">
          <div class="tip">报价后，系统会匹配与业主预算最接近的三家公司进行派单，报价越准确，接单率越高哟！</div>
          <div class="priceBox">
            <div class="price">
              <div class="price-item">
                <div class="item">
                  <p>设计费</p>
                  <div class="play-price">
                    <em>￥</em>
                    <input type="number" v-model="designFee" class="input-price" placeholder="0" oninput="if(value.length>10) value=value.slice(0,10)">
                  </div>
                </div>
                <div class="item">
                  <p>材料费</p>
                  <div class="play-price">
                    <em>￥</em>
                    <input type="number" v-model="materialFee" class="input-price" placeholder="0" oninput="if(value.length>10) value=value.slice(0,10)">
                  </div>
                </div>
              </div>
              <div class="price-item" style="padding-top: 56px">
                <div class="item">
                  <p>人工费</p>
                  <div class="play-price">
                    <em>￥</em>
                    <input type="number" v-model="labourFee" class="input-price" placeholder="0" oninput="if(value.length>10) value=value.slice(0,10)">
                  </div>
                </div>
                <div class="item">
                  <p>质检费</p>
                  <div class="play-price">
                    <em>￥</em>
                    <input type="number" v-model="checkFee" class="input-price" placeholder="0" oninput="if(value.length>10) value=value.slice(0,10)">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="item-middle">
            <div class="sum-text">合计</div>
            <div class="sum-price">￥<em>{{totalFee}}</em></div>
            <input type="button" value="提交报价" class="submit" @click="submit">
            <div class="left-time">剩余时间：{{orderDetailData.offerRemainingTime | timeFilter}}</div>
          </div>
          <owner :orderDetailData="orderDetailData"></owner>
      </div>
    </scroll>
  </div>
</template>

<script>
  import minix from "@/mixins/mixin";
  import { robOrderDetail,submitPrice } from 'api/home';
  import owner from './components/owner'
  export default {
    mixins: [minix],
    name: "offerPrice",
    components:{
      owner
    },
    data(){
      return{
        priceId:this.$route.params.id,
        orderDetailData:'',
        designFee:'',
        materialFee:'',
        labourFee:'',
        checkFee:'',
        timer:''
      }
    },
    computed:{
      totalFee(){
        return Number(this.designFee)+Number(this.materialFee)+Number(this.labourFee)+Number(this.checkFee)
      }
    },
    created(){
      robOrderDetail({priceId:this.priceId}).then(res=>{
        if(res.success){
          this.orderDetailData=res.obj;
          clearInterval(this.timer);
          let date = new Date();
          let SystemTimeAfterCountdown = date.getTime() + this.orderDetailData.offerRemainingTime; // 倒计时之后的系统时间
          this.timer=setInterval(()=>{
            if(this.orderDetailData.offerRemainingTime>=1000){
              let time = new Date();
              this.orderDetailData.offerRemainingTime = SystemTimeAfterCountdown - time.getTime();
            }else{
               clearInterval(this.timer)
            }

          },1000)
           setTimeout(()=>{
             this.$refs.scroll.refresh()
        },200)
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
      submit(){
        if(this.materialFee>0&&this.checkFee>0&&this.labourFee>0&&this.designFee>0){
          submitPrice({
            id:this.priceId,
            materialFee:this.materialFee,
            checkFee:this.checkFee,
            labourFee:this.labourFee,
            designFee:this.designFee,
          }).then(res=>{
             if(res.success){
               this.$router.push(`/orderDetail/${this.priceId}`)
             }else {
               this.$toast(res.message)
             }
          })
        }else{
          this.$toast('设计费、材料费、人工费、质检费必须都大于0');
        }

      }
    }
  }
</script>

<style lang="scss" scoped>
  .offerPrice {
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
    .offerPrice-content{
        padding-bottom: 90px;
        .tip{
          padding: 25px 32px;
          background-color: #ffeded;
          color: #ff4545;
          font-size: 24px;
          box-sizing: border-box;
          line-height: 36px;
        }
        .priceBox{
          padding: 0 32px;
          margin-top: 20px;
          .price{
            background-color: #fff;
            padding: 36px 42px;
            box-shadow: 0px 0px 87px 0px
            rgba(0, 0, 0, 0.06);
            border-radius: 8px;
            box-sizing: border-box;
            .price-item{
              display: flex;
              .item{
                width: 50%;
                p{
                  color: #333333;
                  font-size: 24px;
                  line-height: 32px;
                  margin-bottom: 20px;
                }
                .play-price{
                  display: flex;
                  border-bottom: 1px solid #dddddd;
                  .input-price{
                    font-size: 48px;
                    color: #333;
                    width: 100%;
                    &::-webkit-input-placeholder {
                      color: #999;
                    }
                  }
                  em{
                    color: #999999;
                    font-size: 28px;
                    font-style: normal;
                    margin-top: 20px;
                  }
                }
              }
              .item:nth-of-type(even){
                margin-left: 32px;
              }
            }
          }
        }
        .item-middle{
          background-color: #fff;
          margin-top: 32px;
        }
        .sum-text{
          color: #333333;
          font-size: 28px;
          line-height: 48px;
          text-align: center;
          padding-top: 20px;
        }
      .sum-price{
        font-size: 28px;
        color: #333333;
        text-align: center;
        line-height: 48px;
         em{
           font-size: 48px;
           font-style: normal;
         }
      }
      .submit{
        display: block;
        height: 80px;
        background-color: #ff6419;
        border-radius: 40px;
        width: 690px;
        margin: 32px auto 16px auto;
        font-size: 28px;
        color: #fff;
      }
      .left-time{
        color: #999999;
        font-size: 24px;
        text-align: center;
        padding-bottom: 80px;
      }
    }
  }
</style>
