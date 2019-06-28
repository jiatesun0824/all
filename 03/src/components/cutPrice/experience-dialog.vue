<template>
  <transition name="slide-fade">
    <div class="experienceDialog" v-show="experienceShowDialog">
      <img src="/static/image/cutPrice/pop_icon_success.png" alt="">
      <p>您已体验完装进我家功能，</p>
       <p>已为您减{{urlParams.cutPrice}}元！</p>
       <div class="experience-btn" @click="backPage">返回活动页面</div>
       <i class="ic_close" @click="backPage"></i>
    </div>
  </transition>
</template>

<script>
  import { mapGetters,mapActions} from 'Vuex'
  export default {
    name: "experience-dialog",
    data(){
      return{

      }
    },
    computed:{
      ...mapGetters('cutprice',['experienceShowDialog','activityParam','urlParams'])
    },
    created(){

    },
    methods:{
      ...mapActions('cutprice',['setDialog']),
      backPage(){
        this.setDialog({experienceShowDialog:false});this.$parent.mask=false;
        // try {
        //   wx.miniProgram.navigateTo({
        //     url: `/pages/cutprice/cutprice?actId=${this.urlParams.actId}&regId=${this.activityParam.registrationId}&isUser=1&clearCutprice=1`
        //   })
        // }catch (e) {
        //
        // }
      }
    }
  }
</script>

<style scoped lang="scss">
  .experienceDialog{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 560px;
    margin-left: -280px;
    margin-top: -257px;
    background-color: #fff;
    border-radius: 10px;
    padding: 60px 0 80px 0;
    z-index: 11;
    img{
      display: block;
      width: 160px;
      height: 160px;
      margin: 0 auto;
    }
    p{
      text-align: center;
      color: #333333;
      font-size: 28px;
      line-height: 48px;
      span{
        color: #ff6419;
      }
    }
    .experience-btn{
      width: 400px;
      height: 80px;
      line-height: 80px;
      background-color: #29cccc;
      border-radius: 40px;
      color: #fff;
      font-size: 32px;
      text-align: center;
      margin: 40px auto 0 auto;
      &:active{
        opacity: .6;
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
