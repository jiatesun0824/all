<template>
    <div class="recharge">
        <div class="card">
          <span class="card_tit">储蓄卡</span> <span class="name">中国银行(4178)</span>
        </div>
        <div class="box">
            <div class="recharge">充值金额</div>
            <div class="inpu">
                <span class="inpu_tit">￥</span> <input class="input" type="number">
            </div>
        </div>
        <div class="next">
            <div class="but" @click="nextbut">下一步</div>
        </div> 
    </div>
</template>
<script>
export default {
    //充值
  data(){
      return{

      }
  },
  beforeCreate(){

  },
  methods:{
      nextbut(){
        this.$router.push('/user/wallet/rechargereseut')
      }
  }
}
</script>
<style lang="scss" scoped>
    .recharge{
        height: 100%;
        background: #eee;
        .card{
            background: #fafafa;
            height: 100px;
            padding: 0 78px;
            display: flex;
            align-items: center;
            .card_tit{
                font-size: 28px;
                font-family: PingFang-SC-Medium;
                color: #333;
            }
            .name{
                font-size: 28px;
                font-family: PingFang-SC-Medium;
                color: #ff662e;
                margin-left: 76px;
            }
        }
        .box{
            background: #fff;
            padding: 0 78px;
            .recharge{
                height: 100px;
                line-height: 100px;
                font-size: 28px;
                font-family: PingFang-SC-Medium;
                color: #333;
                background: #fff;
            }
            .inpu{
                height: 120px;
                line-height: 120px;
                font-size: 32px;
                font-family: PingFang-SC-Medium;
                color: #333;
                .input{
                    display: inline-block;
                    height: 100px;
                    line-height: 100px;
                    width: 500px;
                    border:none;
                    outline: none;
                }
            }
        }
        .next{
            margin-top: 40px;
            text-align: center;
            .but{
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

