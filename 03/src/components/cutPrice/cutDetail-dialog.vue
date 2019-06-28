<template>
  <transition name="slide-fade">
      <div class="cutDetail" v-show="cutDetailDialog">
        <div class="title">砍价详情</div>
        <div class="cutDetail-box">
          <ul>
            <li v-for="(item,index) in cutRecord" :key="index">
              <div class="list-left">
                <span>{{index+1}}</span>
                <img :src="item.headPic" alt="">
                <div class="list-info">
                  <p>{{item.nickname}}</p>
                  <p>{{item.cutTime}}</p>
                </div>
              </div>
              <div class="list-right">砍掉{{item.cutPrice}}元</div>
            </li>
          </ul>
        </div>
        <i class="ic_close" @click="setDialog({ cutDetailDialog:false });$parent.mask=false"></i>
      </div>
  </transition>
</template>

<script>
   import { mapGetters,mapActions } from 'Vuex'
    export default {
        name: "cutDetail",
        data(){
          return{

          }
        },
        computed:{
          ...mapGetters('cutprice',['cutRecord','cutDetailDialog'])
        },
        methods:{
          ...mapActions('cutprice',['setDialog']),
        }
    }
</script>

<style scoped lang="scss">
   .cutDetail{
     position: fixed;
     top: 50%;
     left: 50%;
     width: 560px;
     max-height: 805px;
     transform: translate(-50%,-50%);
     background-color: #fff;
     border-radius: 10px;
     overflow: hidden;
     overflow-y: scroll;
     z-index: 11;
     .title{
       height: 100px;
       line-height: 100px;
       font-size: 36px;
       color: #333333;
       text-align: center;
       border-bottom: 1px solid #F5F5F5;
     }
     ul{
       margin-top: 24px;
       padding: 0 30px 30px;
       li{
         display: flex;
         height: 88px;
         justify-content: space-between;
         align-items: center;
         border-bottom: 1px solid #F5F5F5;
         .list-left{
           display: flex;
           span{
             font-size: 32px;
             color: #333;
             line-height: 64px;
             padding-right: 28px;
           }
           img{
             width: 60px;
             height: 60px;
             border-radius: 100%;
           }
           .list-info{
             margin-left: 32px;
             p:nth-of-type(1){
               color: #333333;
               font-size: 24px;
               line-height: 30px;
             }
             p:nth-of-type(2){
               color: #999;
               font-size: 20px;
               line-height: 30px;
               margin-top: 6px;
             }
           }
         }
         .list-right{
           color: #ff6419;
           font-size: 24px;
           line-height: 30px;
         }
       }
       .cutList-lookMore{
         height: 88px;
         line-height: 88px;
         text-align: center;
         color: #ff6419;
         text-decoration: underline;
         &:active{
           opacity: .6;
         }
       }
     }
     .ic_close{
       position: absolute;
       right: 0;
       top: 0;
       display: inline-block;
       width: 80px;
       height: 80px;
       background: no-repeat center url("../../../static/image/cutPrice/pop_nav_icon_close.png");
       background-size: 35%;
       &:active{
         opacity: .6;
       }
     }
   }
   .slide-fade-enter-active {
     transition: all .3s ease;
   }
   .slide-fade-leave-active {
     transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
   }
   .slide-fade-enter, .slide-fade-leave-to
     /* .slide-fade-leave-active for below version 2.1.8 */ {
     //transform: translateX(10px);
     opacity: 0;
   }
</style>
