<template>
  <transition name="slide-fade">
    <div class="dialog">
      <div class="inviteRecord" v-show="dialog.inviteRecord">
         <div class="title">我的邀请记录</div>
         <div class="content">
             <div class="record-list" v-if="inviteRecordData.datalist">
               <ul>
                 <li v-for="(item,index) in inviteRecordData.datalist" :key="index">
                   <img :src="item.headPic ? baseUrl.resourceURL+item.headPic : '/static/image/festivalActivity/home_icon_head_nor.png'" alt="">
                   <div class="info">
                     <div class="userName">
                       <span>{{item.nickName}}</span>
                       <span>{{item.inviteDate}}</span>
                     </div>
                     <p v-if="item.cardFlag">帮你获得一张拼图卡片【{{item.cardWord}}】</p>
                     <p v-if="!item.cardFlag">未帮你获得卡片({{item.remark}})</p>
                   </div>
                 </li>
               </ul>
             </div>
             <div class="no-page" v-else>
               <img src="/static/image/festivalActivity/prize_pop_no.png" alt="">
               <p>暂时还没有记录哦~</p>
             </div>
         </div>
         <i class="ic_close" @click.stop="setDialog({inviteRecord:false});move()"></i>
      </div>
      <div class="mask" v-show="dialog.inviteRecord"></div>
    </div>
  </transition>
</template>

<script>
  import festivalActivity from "@/mixin/festivalActivity"
    export default {
        name: "inviteRecord",
        mixins:[festivalActivity],
        data(){
            return{

            }
        }
    }
</script>

<style scoped lang="scss">
  .inviteRecord{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 10;
    width: 590px;
    height: 680px;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;
    .title{
        line-height: 96px;
        text-align: center;
        color: #333333;
        font-size: 32px;
        border-bottom: 1px solid #e8e8e8;
    }
    .content{
       .no-page{
         margin-top: 110px;
          img{
            display: block;
            width: 290px;
            height: 295px;
            margin: 0 auto;
          }
         p{
           text-align: center;
           color: #999999;
           font-size: 24px;
         }
       }
      .record-list{
         max-height: 580px;
        overflow-y: scroll;
        overflow-x: hidden;
        border-radius: 20px;
         ul{
           li{
             padding: 30px 40px;
             display: flex;
             border-bottom: 1px solid #e8e8e8;
             img{
               width: 80px;
               height: 80px;
               border-radius: 100%;
             }
             .info{
               font-size: 24px;
               width: 100%;
               margin-left: 16px;
               .userName{
                 position: relative;
                  span:nth-of-type(1){
                    color: #333333;
                  }
                 span:nth-of-type(2){
                   position: absolute;
                   right: 0;
                   color: #999999;
                 }
               }
               p{
                 color: #333333;
                 font-size: 24px;
                 line-height: 48px;
               }
             }
           }
         }
      }
    }
  }

</style>
