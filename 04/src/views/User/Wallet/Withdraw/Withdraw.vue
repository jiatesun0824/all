<template>
  <div class="withdraw">
    <div class="card">
      <span class="card_tit">储蓄卡</span> <span class="name">中国银行(4178)</span>
    </div>
    <div class="box">
      <div class="moneynum">提现金额</div>
      <div class="inpu">
        <span class="inpu_tit">￥</span>
        <input class="input" type="number">
        <div class="balance">
          <span class="baltit">零钱余额 ￥</span>
          <span class="bal">9.25</span>
        </div>
      </div>
    </div>
    <div class="allwith">
      <img class="allicon" src="../../images/banner_01.png" alt="">　<span>全部提现</span>
    </div>
    <div class="next">
      <div class="but" @click="nextbut">下一步</div>
    </div>
  </div>
</template>
<script>
export default {
  //零钱提现
  data() {
    return {

    }
  },
  beforeCreate() {

  },
  methods: {
    nextbut() {
      this.$router.push('/user/wallet/withdrawreseut')
    }
  }
}

</script>
<style lang="scss" scoped>
.withdraw {
  height: 100%;
  background: #eee;
  .card {
    background: #fafafa;
    height: 100px;
    padding: 0 78px;
    display: flex;
    align-items: center;
    .card_tit {
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: #333;
    }
    .name {

      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: #ff662e;
      margin-left: 76px;
    }
  }
  .box {
    background: #fff;
    padding: 0 78px;
    .moneynum {
      height: 100px;
      line-height: 100px;
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: #333;
    }
    .inpu {
      height: 120px;
      line-height: 120px;
      font-size: 32px;
      font-family: PingFang-SC-Medium;
      color: #333;
      .input{
        border:none;
        outline: none;
      }
      .balance {
        float: right;
        .baltit,
        .bal {
          font-size: 20px;
          font-family: PingFang-SC-Medium;
          color: #999;
        }
      }
    }
  }
  .allwith {
    height: 100px;
    line-height: 100px;
    font-size: 20px;
    font-family: PingFang-SC-Medium;
    color: #999;
    padding: 0 78px;
    background: #fafafa;
    .allicon {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin-right: 16px;
    }
    span {
      vertical-align: middle;
    }
  }
  .next {
    margin-top: 40px;
    text-align: center;
    .but {
      width: 600px;
      height: 80px;
      background-color: #ff6419;
      border-radius: 40px;
      display: inline-block;
      line-height: 80px;
      font-size: 36px;
      font-family: PingFang-SC-Medium;
      color: #fff;
    }
  }
}

</style>
