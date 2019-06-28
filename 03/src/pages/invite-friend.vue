<template>
   <div class="invite-friend">
       <img src="/static/image/festivalActivity/spring_share_bg.png" alt="" class="spring_share_bg">
       <div class="invite-content">
         <div class="help-friend" @click="helpFriend" :class="{'active':isSuccess==2||isSuccess==1}">
           <i class="ic_success" v-if="isSuccess==1"></i>
           <i class="ic_fail" v-if="isSuccess==2"></i>{{msg}}</div>
         <div class="my-join" @click="myJoin">我也要参与</div>
         <div class="spring_share_pic" @click="myJoin"><img src="/static/image/festivalActivity/spring_share_pic.png" alt="" class="spring_share_pic"></div>
         <!--<div class="infoScroll">-->
           <!--<ul :class="{marquee_top:animate}">-->
             <!--<li v-for="(item,index) in dataList" :key="index">-->
               <!--<img :src="item.headPic" alt="">-->
               <!--<span>{{item.nickName}}</span>-->
               <!--<span>免费领取了一张电影票</span>-->
             <!--</li>-->
           <!--</ul>-->
         <!--</div>-->
       </div>
   </div>
</template>

<script>
    import { indexMixin } from "@/mixin";
    export default {
        name: "invite-friend",
        mixins:[indexMixin],
        data(){
          return{
              isSuccess:0,
              msg:'帮好友助力',
              dataList:[],
              animate:false
          }
        },
        created(){
          document.title="随选拜大年";
          // this.API.getRewardList({ activityId:this.$route.query.activityId}).then(res=>{
          //     if(res.success){
          //       this.dataList=res.datalist;
          //       clearInterval(this.timer);
          //       this.timer=setInterval(this.infoScroll,3000);
          //     }else{
          //       this.$toast(res.message);
          //     }
          // })
        },
        methods:{
          infoScroll(){
            this.animate = true;
            setTimeout(() => {
              this.dataList.push(this.dataList[0]);
              this.dataList.shift();
              this.animate = false;
            }, 800);
          },
          helpFriend(){
               if(this.isSuccess==0){
                 this.API.giveMeFive({activityId:this.$route.query.activityId,inviteUserId:this.$route.query.inviteUserId}).then(res=>{
                   if(res.success){
                     this.isSuccess=1;
                     this.$toast('助力成功');
                     this.msg='助力成功';
                   }else {
                     this.isSuccess=2;
                     this.msg=res.message;
                     this.$toast(res.message)
                   }
                 })
               }
          },
          myJoin(){
              this.$router.push(`/festivalActivity?activityId=${this.$route.query.activityId}&wheelId=${this.$route.query.wheelId}&token=${this.$route.query.token}`)
          }
        }
    }
</script>

<style scoped lang="scss">
   .invite-friend{
     position: absolute;
     width: 100%;
     height: 100%;
     overflow-y: scroll;
      .spring_share_bg{
        width: 100%;
        height: 750px;
      }
     .spring_share_pic{
       width: 670px;
       margin: 20px auto;
       img{
         width: 100%;
       }

     }
     .invite-content{
       background-color: #fff;
       border-radius: 20px 20px 0 0;
       overflow: hidden;
       margin-top: -20px;
       padding-bottom: 40px;
     }
     .help-friend{
       width: 670px;
       height: 88px;
       background-color: #c22f3d;
       box-shadow: 0px 20px 40px 0px
       rgba(194, 47, 61, 0.2);
       border-radius: 44px;
       margin: 48px auto 0 auto;
       text-align: center;
       line-height: 88px;
       color: #ffffff;
       font-size: 32px;
       &:active{
         opacity: .6;
       }
       .ic_success{
           display: inline-block;
           width: 36px;
           height: 36px;
           background: no-repeat center url("/static/image/festivalActivity/spring_share_success.png");
           background-size: 100%;
           vertical-align: middle;
         margin-right: 10px;
       }
       .ic_fail{
         display: inline-block;
         width: 36px;
         height: 36px;
         background: no-repeat center url("/static/image/festivalActivity/spring_share_failed.png");
         background-size: 100%;
         vertical-align: middle;
         margin-right: 10px;
       }
     }
     .active{
       opacity: .2;
     }
     .my-join{
       width: 670px;
       height: 88px;
       background-color: #ffb266;
       box-shadow: 0px 15px 20px 0px
       rgba(247, 165, 83, 0.4);
       border-radius: 44px;
       margin: 30px auto 0 auto;
       text-align: center;
       line-height: 88px;
       color: #ffffff;
       font-size: 32px;
       &:active{
         opacity: .6;
       }
     }
     .infoScroll{
       width: 670px;
       height: 245px;
       background-color: #fff2e5;
       border-radius: 20px;
       padding: 0 40px 0 40px;
       margin: 40px auto 0 auto;
       box-sizing: border-box;
       overflow: hidden;
        ul{
          li{
             display: flex;
             align-items: center;
             height: 80px;
             line-height: 80px;
             position: relative;
              img{
                width: 40px;
                height: 40px;
                border-radius: 100%;
                margin-right: 20px;
              }
            span{
              color: #999999;
              font-size: 28px;
            }
            span:nth-of-type(2){
               position: absolute;
               right: 0;
            }
          }
        }
        .marquee_top {
          transition: all 0.5s;
          margin-top: -80px
        }
     }
   }
</style>
