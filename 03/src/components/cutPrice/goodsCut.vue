<template>
    <div class="goodsCut" >
        <div class="goodsCut-title">{{detailData.actName}}</div>
        <div class="goodsCut-time">
             <span>活动倒计时:</span><em>{{detailData.actRemainTime | timeFilter(0)}}</em><span>天</span><em>{{detailData.actRemainTime | timeFilter(1)}}</em><span>小时</span><em>{{detailData.actRemainTime | timeFilter(2)}}</em><span>分钟</span>
        </div>
        <div class="goodsCut-item">
           <img :src="baseUrl.resourceURL+detailData.productImg" alt="" @click="kankan">
           <div class="goodsCut-info">
               <p>{{detailData.productName}}</p>
               <p>优惠价 ¥{{detailData.productDiscountPrice}}</p>
               <p>原价 ¥{{detailData.productOriginalPrice}}</p>
           </div>
        </div>
        <div class="goodsCut-join">已有<span>{{detailData.registrationCount}}</span>人参与，剩余<span>{{detailData.productRemainCount}}</span>个{{detailData.productName}}</div>
        <div class="goodsCut-plan" ref="goodsCutPlan"><span :style="{width:changeWidth+'rem'}"></span></div>
        <div class="goodsCut-text"><span>{{detailData.productDiscountPrice}}元</span><span>还差<em>{{ leftPrice}}</em>元</span><span>{{detailData.productMinPrice}}元</span></div>
        <div v-if="urlParams.isUser==1">
          <div class="goodsCut-btn" v-if="activityParam.statusCode == 'UNINVITE'" @click="myCutprice">极速砍价</div>
          <div v-else-if="activityParam.statusCode=='INVITING'">
            <div class="goodsCut-btn" @click="invite">邀请好友，帮忙砍价</div>
            <div class="cutDetail" @click="cutDetail">砍价详情</div>
          </div>
          <div v-else-if="activityParam.statusCode=='UNAWARD'">
            <div class="goodsCut-btn" @click="getAward">领取奖品</div>
            <div class="cutDetail" @click="cutDetail">砍价详情</div>
          </div>
          <div v-else-if="activityParam.statusCode=='AWARDED'">
            <div class="goodsCut-btn bg">已领取</div>
            <div class="cutDetail" @click="cutDetail">砍价详情</div>
          </div>
          <div v-else-if="activityParam.statusCode=='ACT_ENDED'">
            <div class="goodsCut-btn bg" >活动已结束</div>
            <div class="cutDetail" @click="cutDetail" v-if="cutRecord.length>0">砍价详情</div>
          </div>

        </div>
        <!--statusCode:REG_COMPLETE 好友已经砍成功了 不能再砍了-->
        <div v-if="urlParams.isUser==2">
          <div class="goodsCut-btn" v-if="activityParam.statusCode == 'CUT'||activityParam.statusCode == 'REG_COMPLETE'" @click="toGet">我也要0元领</div>
          <div class="goodsCut-btn" v-else-if="activityParam.statusCode == 'UN_CUT'&&activityParam.statusCode != 'REG_COMPLETE'" @click="helpCutprice">帮好友砍价</div>
          <div class="goodsCut-btn bg" v-else-if="activityParam.statusCode=='ACT_ENDED'">活动已结束</div>
          <div class="goodsCut-btn bg" v-else-if="activityParam.statusCode=='ACT_UNBEGIN'">活动未开始</div>
        </div>
    </div>
</template>

<script>
  import { mapGetters,mapActions } from 'Vuex'
    export default {
        name: "goodsCut",
       inject:['reload'],
        data(){
          return{

          }
        },
        filters:{
          timeFilter(value,type) {
            /*本期结束倒计时*/
            if(value) {
              if(type == 0){
                let ts = Math.floor(value / 60 / 60 / 24).toString();
                if(ts.length <= 1) {
                  ts = "0" + ts; //天
                }
                return ts
              }else if(type == 1){
                let ss = Math.floor(value / 60 / 60 % 24).toString();
                if(ss.length <= 1) {
                  ss = "0" + ss; //时
                }
                return ss
              }else if(type == 2){
                let fs = Math.floor(value / 60 % 60).toString();
                if(fs.length <= 1) {
                  fs = "0" + fs; //分
                }
                return fs
              }

            }else{
              return '00'
            }
          },
        },
        computed:{
          ...mapGetters('cutprice',['activityParam','detailData','urlParams','cutRecord']),
          changeWidth(){
            if(this.detailData.productRemainPrice!=null||this.detailData.productRemainPrice!=''||this.detailData.productRemainPrice!=undefined){
              if(this.detailData.productRemainPrice<this.detailData.productDiscountPrice){
                this.detailData.productRemainPrice<0 ? this.detailData.productRemainPrice=0 : this.detailData.productRemainPrice;
                return  (this.detailData.productDiscountPrice-this.detailData.productRemainPrice)/this.detailData.productDiscountPrice*8.08;
              }
            }else{
              return 0
            }
          },
          leftPrice(){
            if(this.detailData.productRemainPrice!=null||this.detailData.productRemainPrice!=''||this.detailData.productRemainPrice!=undefined){
              this.detailData.productRemainPrice<0 ? this.detailData.productRemainPrice=0 : this.detailData.productRemainPrice;
              return this.detailData.productRemainPrice
            }else{
              return this.detailData.productDiscountPrice
            }
          }
        },
        created(){
          
        },
        methods:{
          ...mapActions('cutprice',['setDialog','setCutprice','setActivityParam']),
          kankan() {
            console.log("1212")
            console.log(this.cutprice)
          },
          myCutprice(){
             this.API.cutPriceByMyself({actId :this.urlParams.actId,formId:'',forwardPage:''}).then(res=>{
               console.log(res)
                if(res.success){
                    this.$parent.mask=true;
                    this.setDialog({startCutDialog:true});
                    this.setCutprice(res.obj);
                    this.$emit('changeState'); //生成registrationId  ，只有再次进来才会有registrationId
                }else {
                  this.$emit('changeHint', res.message)
                  //alert(res.message)
                }
             })
          },
          helpCutprice(){ //帮好友砍价
              this.API.cutPriceByInvite({actId:this.urlParams.actId,regId:this.activityParam.registrationId}).then(res=>{
                 if(res.success){
                   this.$parent.mask=true;
                   this.setDialog({startCutDialog:true});
                   this.setCutprice(res.obj);
                   this.$emit('changeState')
                 }else if(res.exceptionCode==200){ //任务已完成
                   this.setActivityParam({
                     statusCode:'REG_COMPLETE',
                     registrationId:this.activityParam.registrationId
                   });
                 }else {
                   //alert(res.message)
                   this.$emit('changeHint', res.message)
                 }
              })
          },
          invite(){
            this.$emit('showShare')
          },
          getAward(){ //领取台灯
            this.$parent.mask=true;
            this.setDialog({deliveryAddressDialog:true})
          },
          cutDetail(){
             this.$parent.mask=true;
             this.setDialog({ cutDetailDialog:true});
          },
          toGet(){
            try {
              wx.miniProgram.navigateTo({
                url: `/pages/cutprice/cutprice?actId=${this.urlParams.actId}&regId=&isUser=1`
              })
            }catch (e) {

            }
          }
        }
    }
</script>

<style scoped lang="scss">
    .goodsCut{
      width: 686px;
      padding: 40px;
      box-sizing: border-box;
      background-color: #ffffff;
      box-shadow: 0 1px 8px 0
      rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      margin: 0 auto 40px auto;
      position: relative;
      z-index: 10;
      .goodsCut-title{
        color: #333333;
        font-size: 36px;
        text-align: center;
        font-weight: bold;
      }
      .goodsCut-time{
        width: 546px;
        margin: 40px auto 0 auto;
        span{
          font-size: 20px;
        }
        em{
          display: inline-block;
          width: 64px;
          height: 64px;
          line-height: 64px;
          background-color: #ffcb46;
          border-radius: 4px;
          font-style: normal;
          color: #333333;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          vertical-align: bottom;
          margin-left: 18px;
          margin-right: 18px;
        }
      }
      .goodsCut-item{
          display: flex;
          padding: 16px;
          margin-top: 56px;
          background-color: #f5f5f5;
          img{
            width: 168px;
            height: 168px;
            background-color: #ffffff;
            border-radius: 4px;
          }
          .goodsCut-info{
              margin-left: 33px;
             p:nth-of-type(1){
               color: #333333;
               font-size: 32px;
               line-height: 32px;
               font-weight: bold;
             }
              p:nth-of-type(2){
                color: #ff6419;
                font-size: 28px;
                line-height: 32px;
                margin: 30px 0 23px 0;
              }
              p:nth-of-type(3){
                color: #999999;
                font-size: 24px;
                line-height: 32px;
                text-decoration: line-through;
              }
          }
      }
      .goodsCut-join{
          margin-top: 40px;
          text-align: center;
          color: #999999;
          font-size: 24px;
        span{
          color: #ff6419;
          font-size: 32px;
        }
      }
      .goodsCut-plan{
          width:8.08rem;
          height: 10px;
          background-color: #e8e8e8;
          border-radius: 5px;
          position: relative;
          margin-top: 40px;
        span{
          position: absolute;
          width: 0;
          height: 10px;
          display: inline-block;
          background-image: linear-gradient(90deg,
            #ff6419 0%,
            #ff9966 100%);
          border-radius: 5px;
          transition: width 2s;
        }
      }
      .goodsCut-text{
          display: flex;
          margin-top: 16px;
          justify-content: space-between;
          font-size: 24px;
          span{
            color: #999999;
             em{
               color: #ff6419;
               font-style: normal;
             }
          }
      }
      .goodsCut-btn{
        width: 606px;
        height: 80px;
        background-image: linear-gradient(0deg,
          #fea700 0%,
          #fff671 100%),
        linear-gradient(
            #ff6419,
            #ff6419);
        background-blend-mode: normal,
        normal;
        box-shadow: 0 10px 0 0
        rgba(204, 34, 0, 0.5);
        border-radius: 40px;
        color: #8d2121;
        font-size: 40px;
        text-align: center;
        line-height: 80px;
        font-weight: bold;
        margin-top: 40px;
        &:active{
          opacity: .6;
        }
      }
      .cutDetail{
         text-align: center;
         color: #ff6419;
         margin-top: 30px;
         text-decoration: underline;
         &:active{
            opacity: .6;
         }
      }
      .bg{
        background-image:none;
        background-color: #b3b0b1;
        box-shadow: 0px 10px 0px 0px
        rgba(147, 150, 149, 0.5);
        color: #fff;
      }
    }
</style>
