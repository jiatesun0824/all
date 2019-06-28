<template>
    <div class="dialog">
       <div class="guidePage" v-show="dialog.guidePage">
          <div class="img-box">
            <img src="/static/image/festivalActivity/design_step_01.png" alt="" v-if="guideIndex==1">
            <img src="/static/image/festivalActivity/design_step_02.png" alt="" v-if="guideIndex==2">
          </div>
          <i class="ic_arrow_close" @click="close"></i>
       </div>
       <div class="mask" v-show="dialog.guidePage"></div>
    </div>
</template>

<script>
  import festivalActivity from "@/mixin/festivalActivity"
    export default {
        name: "guidePage",
        mixins:[festivalActivity],
        methods:{
            close(){
              this.move();
              this.setDialog({ guidePage:false,taskDialog:true })
            }
        }
    }
</script>

<style scoped lang="scss">
   .guidePage{
     position: fixed;
     top: 45%;
     left: 50%;
     transform: translate(-50%,-50%);
     z-index: 10;
     width: 620px;
     height: 880px;
     background-color: #ffffff;
     border-radius: 20px;
     box-sizing: border-box;
     overflow: hidden;
     .img-box{
       width: 100%;
       height: 100%;
       overflow-y: scroll;
     }
     img{
       width: 100%;
     }
     .ic_arrow_close{
       position: fixed;
       display: block;
       width: 60px;
       height: 60px;
       background: no-repeat center url("/static/image/festivalActivity/pop_icon_close_02.png");
       background-size: 100%;
       right: 0;
       top: 0;
       &:active{
         opacity: .6;
       }
     }
   }
</style>
