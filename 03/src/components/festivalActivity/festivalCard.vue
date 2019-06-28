<template>
    <div class="festivalCard">
         <img src="/static/image/festivalActivity/spring_line.png" alt="" class="spring-line">
         <div class="title"><img src="/static/image/festivalActivity/spring_title_02.png" alt=""></div>
         <div class="tip">
             <p>通过【做任务】和【邀好友】可获得拼图</p>
             <p>获取所有拼图即可获得电影票</p>
         </div>
         <div class="cards-box">
             <ul>
               <li v-for="(item,index) in imgList" :key="index">
                 <img :src="item.active ? item.selectUrl : item.defaultUrl" alt="">
               </li>
             </ul>
             <i class="ic-spring-finish" v-if="!cardsInfo.hasTicketRemain"></i>
             <i class="ic-spring-get" v-if="cardsInfo.totalCard>=12" @click="getMoving"></i>
         </div>
         <div class="task-btn">
              <div class="doTask" @click="dotask">做任务<i :class="{'redPoint':redPoint==1}"></i></div>
              <div class="doTask" @click="setDialog({ sharePoster:true })">邀好友 <i :class="{'redPoint':redPoint==2}"></i></div>
         </div>
         <div class="invite-record"><span @click="invite">我的邀请记录</span></div>
         <img src="/static/image/festivalActivity/spring_line.png" alt="" class="spring-line">
    </div>
</template>

<script>
  import festivalActivity from "@/mixin/festivalActivity"
    export default {
        name: "festivalCard",
        mixins:[festivalActivity],
        data(){
           return{

           }
        },
        created(){
           this.setCardsList({ vm:this });//卡片
           this.setMsgTip({ vm:this }); //消息红点
           this.setUnReceivedCard({ vm:this });//未领取的卡片
        },
        methods:{
          dotask(){
            this.stop();
            this.setTaskList({ vm:this });
          },
          invite(){
             this.stop();
             this.setInviteRecord({ vm:this })
          },
          getMoving(){
             this.stop();
             this.setGetMoving({ vm:this });
          }
        }
    }
</script>

<style scoped lang="scss">
   .festivalCard{
      width: 100%;
     background-color: #c22f3d;
     .spring-line{
       width: 100%;
     }
     .title{
       text-align: center;
       /*font-family: SourceHanSerifCN-Heavy;*/
       padding-top: 40px;
       background: linear-gradient(to right, #fddbb0, #ffb25c);
       -webkit-background-clip: text;
       color: transparent;
       font-weight: bold;
       img{
         width: 80%;
         height: 100%;
       }
     }
     .tip{
       text-align: center;
       font-size: 28px;
       margin-top: 20px;
       p{
         line-height: 48px;
         color: #fddbb0;
       }
     }
     .cards-box{
       padding: 40px;
       position: relative;
       ul{
         display: flex;
         flex-wrap: wrap;
         justify-content: space-between;
         li{
            height: 160px;
            width: 160px;
            border-radius: 10px;
            margin-bottom: 10px;
           img{
              width: 100%;
           }
         }
       }
       .ic-spring-finish{
          display: inline-block;
          width: 200px;
          height: 200px;
          background: no-repeat center url("/static/image/festivalActivity/spring_icon_finish.png");
          background-size: 100%;
       }
       .ic-spring-get{
         display: inline-block;
         width: 200px;
         height: 200px;
         background: no-repeat center url("/static/image/festivalActivity/spring_icon_get.png");
         background-size: 100%;
       }
       i{
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%,-50%);
       }

     }
     .task-btn{
       display: flex;
       justify-content: space-between;
       padding: 0 40px;
       .doTask{
         width: 320px;
         height: 88px;
         background-image: linear-gradient(180deg,
           #ffbf7f 0%,
           #f59f49 100%),
         linear-gradient(
             #ffb86c,
             #ffb86c);
         background-blend-mode: normal,
         normal;
         box-shadow: 0px 15px 20px 0px
         rgba(153, 31, 45, 0.6);
         border-radius: 44px;
         color: #c12034;
         font-size: 32px;
         line-height: 88px;
         text-align: center;
         position: relative;
         font-weight: bold;
         &:active{
           opacity: .6;
         }
       }
       .redPoint{
          display: inline-block;
         width: 16px;
         height: 16px;
         border-radius: 100%;
         background-color: #c12034;
         position: absolute;
         top: 36px;
         left: 76px;
       }
     }
     .invite-record{
       padding-top: 50px;
       text-align: center;
       padding-bottom: 40px;
       span{
         color: #ffffff;
         font-size: 32px;
         opacity: .5;
         &:active{
           opacity: .6;
         }
       }
     }
   }
</style>
