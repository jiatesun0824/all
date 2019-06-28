<template>
  <div class="WithdrawReseut">
      <div class="course">
          <div class="courseimg">
             
          </div>
          <div class="dec">
              <div class="item">
                  <div class="title tl">发起申请</div>
                  <div class="tit tl">2016/05/25</div>
              </div>
              <div class="item">
                  <div class="title">银行处理中</div>
                  <div class="tit"><span>预计</span>  <span>2016/05/25</span><br><span>08：00前到账</span></div>
              </div>
              <div class="item">
                  <div class="title tr">发起申请</div>
                  <div class="tit tr"></div>
              </div>
          </div>
      </div>
      <div class="card">
              <div class="item">
                  <span class="tit">提现金额</span>
                  <span class="name">￥ 1.00</span>
              </div>
               <div class="item">
                  <span class="tit">手续费</span>
                  <span class="name">￥ 0.10</span>
              </div>
              <div class="item">
                  <span class="tit">到账银行卡</span>
                  <span class="name">招商银行　9488</span>
              </div>
      </div>
  </div>
</template>
<script>
export default {
    // 提现结果（详情）
  data(){
      return{

      }
  },
  beforeCreate(){

  },
  methods:{

  }
}
</script>
<style lang="scss" scoped>
    .WithdrawReseut{
        box-sizing: border-box;
        .course{
            background: #fafafa;
            padding:30px;
            .courseimg{
                text-align: center;
                height: 100px;
                line-height: 100px;
            }
            .dec{
                display: flex;
                justify-content: space-around;
                .item{
                    width: 285px;
                    .title{
                        font-size: 28px;
                        font-family: PingFang-SC-Medium;
                        color: #333;
                        text-align: center;
                        margin-bottom: 19px;
                    }
                    .tit{
                        font-size:20px;
                        font-family: PingFang-SC-Medium;
                        color: #999;
                        text-align: center;
                    }
                    .tl{
                        text-align: left;
                    }
                    .tr{
                        text-align: right;
                    }
                }
            }
        }
        .card{
            background: #fff;
                .item{
                    height: 80px;
                    padding: 0 75px;
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
</style>

