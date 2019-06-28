<template>
  <transition name="slide-fade">
      <div class="dialog">
        <div class="getMoving" v-show="dialog.getMoving">
          <img src="/static/image/festivalActivity/prize_pop_01.png" alt="">
          <div class="title">恭喜您，领取电影票1张</div>
          <div class="item">
            <span>电影票码</span>
            <div class="item-copy">
              <p>{{movingInfo.ticketCode}}</p>
              <button type="button" v-clipboard:copy="movingInfo.ticketCode" v-clipboard:success="copy" class="copyCode">复制票码</button>
            </div>
          </div>
          <div class="item">
            <span>使用时间</span>
            <div class="item-copy">活动日期1月31日~2月9日，可兑换卖座网3D电影票（普通厅/非限价）1张；</div>
          </div>
          <div class="item">
            <span>兑换方式</span>
            <div class="item-copy">
              <p>卖座网手机客户端、公众号，选择“卖座卡支付”或至影城前台出示短信兑换使用。</p>
              <!--<p class="copyCode">查询影城</p>-->
            </div>
          </div>
          <div class="tip">如有其它疑问可咨询卖座网客服热线4001808400</div>
          <i class="ic_close" @click="setDialog({ getMoving:false });move()"></i>
        </div>
        <div class="mask" v-show="dialog.getMoving"></div>
      </div>
  </transition>
</template>

<script>
  import festivalActivity from "@/mixin/festivalActivity"
    export default {
        name: "getMoving",
      mixins:[festivalActivity],
      data(){
          return{

          }
      }
    }
</script>

<style scoped lang="scss">
  .getMoving{
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 10;
    width: 620px;
    background-color: #ffffff;
    border-radius: 20px;
    padding: 40px;
    box-sizing: border-box;
    img{
      display: block;
      width: 360px;
      height: 320px;
      margin: 0 auto;
    }
    .title{
      text-align: center;
      font-size: 40px;
      color: #333333;
      margin-bottom: 40px;
    }
    .item{
      display: flex;
      margin-bottom: 20px;
      span:nth-of-type(1){
        display: inline-block;
        color: #333333;
        font-size: 24px;
      }
      .item-copy{
        margin-left: 20px;
        width: 390px;
        color: #999999;
        font-size: 24px;
        text-align: justify;
        p:nth-of-type(1){
          color: #999999;
        }
        .copyCode{
          width: 120px;
          height: 44px;
          background-color: #666666;
          border-radius: 4px;
          color: #ffffff;
          text-align: center;
          line-height: 44px;
          font-size: 24px;
          margin-top: 16px;
          &:active{
            opacity: .6;
          }
        }
      }
    }
    .tip{
       margin-top: 30px;
      color: #999999;
      font-size: 24px;
      text-align: center;
    }
  }
</style>
