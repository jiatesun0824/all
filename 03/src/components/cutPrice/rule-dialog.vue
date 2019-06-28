<template>
    <transition name="slide-fade">
         <div class="ruleDialog" v-show="ruleShow">
             <div class="title">活动规则</div>
             <div class='ruleDialog-content' v-html="detailData.actRule"></div>
             <!-- <ul>
               <li>{{detailData.actRule}}</li>
             </ul> -->
             <i class="ic_close" @click="close();$parent.mask=false"></i>
          </div>
    </transition>
</template>

<script>
  import { mapGetters,mapActions } from 'Vuex'
export default {
    name: "ruleDialog",
    data(){
      return{
        ruleShow:false
      }
    },
    computed:{
      ...mapGetters('cutprice',['detailData'])
    },
    created(){

    },
    methods:{
       show(){
         this.ruleShow=true;
       },
       close(){
           this.ruleShow=false;
       }
    }
}
</script>

<style scoped lang="scss">
   .ruleDialog{
     position: fixed;
     top: 50%;
     left: 50%;
     width: 560px;
     margin-left: -280px;
     margin-top: -290px;
     background-color: #fff;
     border-radius: 10px;
     z-index: 11;
     .title{
       height: 100px;
       line-height: 100px;
       font-size: 36px;
       color: #333333;
       text-align: center;
       border-bottom: 1px solid #F5F5F5;
     }
     .ruleDialog-content{
       padding:40px;
       max-height: 580px;
       overflow-y: scroll;
       font-size: 24px;
       word-break:break-all;
     }
     ul{
       padding:40px;
       max-height: 580px;
       overflow-y: scroll;
       li{
         font-size: 24px;
         line-height: 36px;
         color: #333333;
         margin-bottom: 10px;
       }
     }
     .ic_close{
       position: absolute;
       right: 0;
       top: 0;
        display: inline-block;
        width: 80px;
        height: 80px;
        background: no-repeat center url("/static/image/cutPrice/pop_nav_icon_close.png");
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
     transform: translateX(10px);
     opacity: 0;
   }
</style>
