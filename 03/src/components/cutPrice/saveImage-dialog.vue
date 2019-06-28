<template>
  <transition name="slide-fade">
    <div class="saveImage" v-show="saveImage">
        <div class="saveImage-way">
          <img src="/static/image/720_share_01.png" alt="">
        </div>
        <div class="saveImage-way2">
          <img src="/static/image/cutPrice/haibao.png" alt="">
          <div class="saveImage-btn">保存图片后分享到朋友圈</div>
        </div>
        <div class="ic_close"><img src="/static/image/cutPrice/plan_pop_close.png" alt="" @click="close();$parent.mask=false"></div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "saveImage",
    data(){
      return{
        saveImage:false
      }
    },
    created(){

    },
    methods:{
      show(){
        this.saveImage=true;
      },
      close(){
        this.saveImage=false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .saveImage{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 620px;
    margin-left: -310px;
    margin-top: -560px;
    border-radius: 10px;
    z-index: 11;
  .saveImage-way{
     img{
        width: 100%;
     }
  }
    .saveImage-way2{
      margin-top: 20px;
      background-color: #fff;
      border-radius: 10px;
      padding: 30px;
      img{
         width: 100%;
      }
      .saveImage-btn{
        width: 540px;
        height: 80px;
        background-color: #29cccc;
        border-radius: 40px;
        color: #ffffff;
        text-align: center;
        line-height: 80px;
        margin: 0 auto;
        &:active{
          opacity: .6;
        }
      }
    }
    .ic_close{
      img{
        height: 150px;
        display: block;
        margin: 0 auto;
        &:active{
          opacity: .6;
        }
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
