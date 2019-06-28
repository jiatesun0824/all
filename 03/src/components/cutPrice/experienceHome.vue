<template>
    <div class="experienceHome">
         <div class="experienceHome-title">体验“装修我家”直减50</div>
         <img src="../../../static/image/cutPrice/pic_01.png" alt="" class="planImg">
         <div class="experienceHome-plan">
             <img class="item-img" src="/static/image/cutPrice/icon_01.png" alt="">
             <img class="item-next" src="/static/image/cutPrice/icon_next.png" alt="">
             <img class="item-img" src="/static/image/cutPrice/icon_02.png" alt="">
             <img class="item-next" src="/static/image/cutPrice/icon_next.png" alt="">
             <img class="item-img" src="/static/image/cutPrice/icon_03.png" alt="">
         </div>
         <div class="experienceHome-btn" @click="startExp">开始体验</div>
    </div>
</template>

<script>
    export default {
        name: "experienceHome",
        methods:{
          startExp(){
            try {
              wx.miniProgram.reLaunch({
                url: `/pages/plan/house-case/house-case?isExperience=1`
              })
            }catch (e) {
              console.log(e)
            }
          }
        }
    }
</script>

<style scoped lang="scss">
    .experienceHome{
        width: 686px;
        background-color: #ffffff;
        box-shadow: 0 1px 8px 0
        rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        margin: 0 auto 40px auto;
        padding: 40px 24px;
        box-sizing: border-box;
        .experienceHome-title{
          color: #333333;
          font-size: 36px;
          text-align: center;
          font-weight: bold;
        }
        .planImg{
          width: 100%;
          height: 363px;
          margin-top: 40px;
        }
        .experienceHome-plan{
           display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
          .item-img{
             width: 108px;
             height: 108px;
          }
          .item-next{
             width: 34px;
             height: 34px;
             margin: 0 40px;
          }
        }
        .experienceHome-btn{
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
          margin: 40px auto 0 auto;
          &:active{
            opacity: .6;
          }
        }
    }
</style>
