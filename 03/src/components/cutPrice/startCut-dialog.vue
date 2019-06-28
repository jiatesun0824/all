<template>
  <transition name="slide-fade">
    <div class="startCut" v-show="startCutDialog">
      <img src="/static/image/cutPrice/pop_icon_01.png" alt="">
      <p v-if="urlParams.isUser==2">恭喜您帮好友砍掉<span>{{cutprice}}</span>元</p>
      <p v-else>您的手气不错，砍掉<span>{{cutprice}}</span>元</p>
      <i class="ic_close" @click="toSmallProgram"></i>
    </div>
  </transition>
</template>

<script>
  import { mapGetters,mapActions} from 'Vuex'
  export default {
    name: "startCut-dialog",
    data(){
      return{
        //startCut:false
      }
    },
    computed:{
      ...mapGetters('cutprice',['startCutDialog','cutprice','urlParams','activityParam'])
    },
    created(){

    },
    methods:{
      ...mapActions('cutprice',['setDialog']),
      toSmallProgram(){
        this.setDialog({startCutDialog:false});this.$parent.mask=false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .startCut{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 560px;
    margin-left: -280px;
    margin-top: -200px;
    background-color: #fff;
    border-radius: 10px;
    padding: 60px 0 100px 0;
    z-index: 11;
    img{
      display: block;
      width: 160px;
      height: 160px;
      margin: 0 auto;
    }
    p{
      text-align: center;
      margin-top: 52px;
      color: #333333;
      font-size: 28px;
      line-height: 48px;
      span{
        color: #ff6419;
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
