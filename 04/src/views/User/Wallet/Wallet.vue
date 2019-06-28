<template>
  <div class="wallet">
    <header>
			<i class="icon-left" @click="$router.go(-1)"></i>
			<div class="title">钱包</div>
	  </header>
      <div class="head">
          <!-- <div class="losse">
                <span class="losse_tit">我的资产</span>
          </div> -->
          <div class="lossenum">￥{{commission.commisionTotal}}</div>
          <div class="lossinpu">累计收益</div>
      </div>
      <!-- <div class="but">
          <div class="butitem br" @click="reccharge">充值</div>
           <div class="butitem" @click="withdraw">提现</div>
      </div> -->
      <div class="main">
          <div class="item" @click="gocommission">
              <img class="item_icon" src="./images/wallet_icon_commission.png" alt="">
              <span class="item_tit">我的佣金</span>
              <img class="item_j" src="./images/wallet_icon_more.png" alt="">

          </div>
          <div class="item" @click="bank">
              <img class="item_icon" src="./images/wallet_icon_card.png" alt="">
              <span class="item_tit">银行卡</span>
              <img class="item_j" src="./images/wallet_icon_more.png" alt="">
              <span class="item_num">{{commission.myBankCardCount}}张</span>
          </div>
          <div class="item" @click="inex">
              <img class="item_icon" src="./images/wallet_icon_detail.png" alt="">
              <span class="item_tit">收支明细</span>
              <img class="item_j" src="./images/wallet_icon_more.png" alt="">
          </div>
      </div>

  </div>
</template>
<script>
export default {
    // 钱包
  data() {
      return {
        commission: {
          myCommisionTotal: 0,
          commisionTotal: 0,
          myBankCardCount: 0
        },
        bankCard:[]
      }
  },
  created() {
    this.API.mycommission().then(res=> {
      if(res.message =='success') {
        this.commission = res.obj;
      } 
    })
  },
  methods: {
    //   去佣金
      gocommission() {
        this.$router.push("/user/wallet/commission")
      },
    //   去充值
      reccharge() {
        this.$router.push("/user/wallet/recharge")
      },
    //  去提现
      withdraw() {
        this.$router.push("/user/wallet/withdraw")
      },
    //  去收支
      inex() {
        this.$router.push("/user/wallet/inex")
      },
    // 去银行卡
      bank() {
         this.$router.push("/user/wallet/bank")
      }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/header.scss';
@import './styles/wallet.scss';
</style>
