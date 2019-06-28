<template>
  <div class="robSuccess" v-show="robSuccess">
    <div class="main">
      <div class="tit"></div>
      <div class="title">您离业主只差一步支付！</div>
      <div class="pay">
        <span @click="$router.push('/timerob');diolog({robSuccess:false,mask:false})">前往支付</span>
      </div>
    </div>
   <div class="closeImg">
        <img src="../images/cancel@2x.png" @click.stop="closePay" alt="">
      </div>
  </div>
</template>

<script>
  import { mapGetters,mapActions} from 'Vuex'
    export default {
        name: "robSuccess",
        data(){
          return{

          }
        },
      computed:{
        ...mapGetters("home", ["robSuccess","mask"]),
      },
      methods:{
        ...mapActions("home", ["diolog"]),
        closePay() {
          this.$emit('closePay')
        }
      }
    }
</script>

<style lang="scss" scoped>
  .robSuccess {
    width: 560px;
    height: 537px;
    border-radius: 20px;
    position: fixed;
    top: 50%;
    margin-top: -268.5px;
    left: 50%;
    margin-left: -280px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url('../images/frame@2x.png');
    text-align: center;
    color: #333;
    z-index: 11;
    .closeImg {
            position: absolute;
            left: 0;
            bottom: -1.5rem;
            width: 100%;
            text-align: center;
            img {
                width: 0.7rem;
                height: 0.7rem;
            }
        }
  .main {
  .closeImg {
    position: absolute;
    left: 0;
    bottom: -1.5rem;
    width: 100%;
    text-align: center;
  img {
    width: 0.7rem;
    height: 0.7rem;
  }
  }
  .tit {
    margin-top: 4rem;
    font-size: 24px;
  }
  .title {
    margin-top: 16px;
    font-size: 28px;
  }
  .time {
    color: #ff6419;
    font-size: 24px;
    margin-top: 47px;
  }
  .pay {
    margin-top: 64px;
  span {
    display: inline-block;
    width: 448px;
    height: 72px;
    background-color: #ff6419;
    border-radius: 36px;
    line-height: 72px;
    text-align: center;
    color: #fff;
    font-size: 28px;
  }
  }
  }
  }
</style>
