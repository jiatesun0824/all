<template>
  <transition name="slide-fade">
    <div class="submit" v-show="submitDialog">
      <img src="/static/image/cutPrice/pop_icon_success02.png" alt="">
      <p>提交成功</p>
      <div class="tip">您的信息填写成功，请耐心等待发货！</div>
      <i class="ic_close" @click="setDialog({submitDialog:false});$parent.mask=false"></i>
    </div>
  </transition>
</template>

<script>
  import { mapGetters,mapActions} from 'Vuex'
  export default {
    name: "submit-dialog",
    data(){
      return{

      }
    },
    computed:{
      ...mapGetters('cutprice',['submitDialog'])
    },
    created(){

    },
    methods:{
      ...mapActions('cutprice',['setDialog'])
    }
  }
</script>

<style scoped lang="scss">
  .submit{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 560px;
    margin-left: -280px;
    margin-top: -200px;
    background-color: #fff;
    border-radius: 10px;
    padding: 60px 0 70px 0;
    z-index: 11;
    img{
      display: block;
      width: 160px;
      height: 160px;
      margin: 0 auto;
    }
    p{
      text-align: center;
      color: #ff6419;
      font-size: 36px;
      line-height: 48px;
    }
    .tip{
      font-size: 28px;
      line-height: 48px;
      color: #999999;
      text-align: center;
      margin-top: 20px;
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
