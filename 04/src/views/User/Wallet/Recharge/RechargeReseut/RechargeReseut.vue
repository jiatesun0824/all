<template>
  <div class="rechargereseut">
      <div class="box">
          <div class="img">
              <img class="boximg" src="../../../images/banner_01.png" alt="">
          </div>
          <div class="reseut">充值成功</div>
          <div class="card">
              <div class="item">
                  <span class="tit">储蓄卡</span>
                  <span class="name">招商银行(1418)</span>
              </div>
               <div class="item">
                  <span class="tit">充值金额</span>
                  <span class="name">￥100.00</span>
              </div>
          </div>
      </div>
      <div class="but">
          <div class="overbut">完成</div>
      </div>
  </div>
</template>
<script>
export default {
    //充值详情（结果）
  data() {
      return {

      }
  },
  beforeCreate() {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
    .rechargereseut{
        .box{
            box-sizing: border-box;
            padding-top: 84px;
            background: #fff;
            margin-bottom: 84px;
            .img{
                text-align: center;
                .boximg{
                    width: 104px;
                    height: 104px;
                    border-radius: 50%;
                }
            }
            .reseut{
                font-size: 28px;
                font-family: PingFang-SC-Bold;
                color: #333;
                margin-top: 22px;
                text-align: center;
                margin-bottom: 83px;
            }
            .card{
                .item{
                    height: 80px;
                    padding: 0 30px;
                    .tit{
                         font-size: 28px;
                         font-family: PingFang-SC-Bold;
                         color: #999;
                         display: block;
                         float: left;
                         line-height: 80px;
                    }
                    .name{
                         font-size: 28px;
                         font-family: PingFang-SC-Bold;
                         color: #333;
                         display: block;
                         line-height: 80px;
                         float:right;
                    }
                }
            }

        }
        .but{
            text-align: center;
            margin-top: 40px;
            .overbut{
                display: inline-block;
                width:600px;
	              height: 80px;
	              background-color: #ff6419;
	              border-radius:40px;
                line-height: 80px;
                color: #fff;
                font-size: 0.36rem;
            }
        }
    }
</style>


