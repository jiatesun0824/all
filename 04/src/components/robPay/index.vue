<template>
  <div class="robPay" v-if="robShow">
    <div class="main">
      <img class="bgimg" src="./images/frame@2x.png" alt="">
      <div class="box">
        <div class="tit"></div>
        <div class="title">您离业主只差一步支付！</div>
        <div class="time">剩余：{{time | timeFilterFen}}</div>
        <div class="pay">
          <span @click.stop="payNow">立即支付</span>
        </div>
        <div class="closeImg">
          <img src="./images/cancel@2x.png" @click.stop="closePay" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import mixins from '@/mixins/mixin';
  export default {
    mixins: [mixins],
    name: 'robpay',
    props: {
      robShow: {
        type: Boolean,
        default: false
      },
      time: ''
    },
    methods: {
      payNow() {
        this.$emit('payNow');
      },
      closePay() {
        this.$emit('closePay');
      }
    }
  }

</script>
<style lang="scss" scoped>
  .robPay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.3);

    .main {
      width: 560px;
      height: 537px;
      border-radius: 20px;
      position: absolute;
      top: 50%;
      margin-top: -268.5px;
      left: 50%;
      margin-left: -280px;
      text-align: center;
      color: #333;
    .bgimg {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
    .box {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 2;
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
        margin-top: 15px;

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
  }

</style>
