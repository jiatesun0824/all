<template>
     <div class="cutList">
         <div class="cutList-record">
             <div class="cutList-title">砍价记录</div>
             <div class="cutList-person">已有<span>{{cutRecord.length}}</span>人帮砍</div>
             <ul>
                 <li v-for="(item,index) in cutRecord" v-if="index < current" :key='index'>
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
                 <div class="cutList-lookMore" @click="lookmore" v-if="cutRecord.length>8">查看更多</div>
             </ul>
             <div v-if="cutRecord.length==0" class="noRecord">暂无记录</div>
         </div>
     </div>
</template>

<script>
    import { mapGetters,mapActions } from 'Vuex'
    export default {
        name: "cutList",
        data(){
            return{
               timer:'',
               current:8
            }
        },
        computed:{
          ...mapGetters('cutprice',['cutRecord'])
        },
        methods:{
          lookmore(){
             this.current=this.cutRecord.length;
             this.$parent.toast=true;
             this.$parent.msg='暂无更多';
             this.timer=setTimeout(()=>{
               this.$parent.toast=false;
               this.$parent.msg='';
             },2500)
          }
        },
        destroyed(){
            clearTimeout(this.timer)
        }
    }
</script>

<style scoped lang="scss">
   .cutList{
     width: 686px;
     padding: 40px 40px 0 40px;
     box-sizing: border-box;
     background-color: #ffffff;
     box-shadow: 0 1px 8px 0
     rgba(0, 0, 0, 0.2);
     border-radius: 10px;
     margin: 0 auto 40px auto;
     .cutList-title{
       color: #333333;
       font-size: 36px;
       text-align: center;
       font-weight: bold;
     }
     .cutList-person{
        text-align: center;
       line-height: 48px;
       color: #999;
       font-size: 24px;
       span{
         color: #ff6419;
       }
     }
     ul{
        margin-top: 24px;
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
     .noRecord{
       text-align: center;
       line-height: 88px;
     }
   }
</style>
