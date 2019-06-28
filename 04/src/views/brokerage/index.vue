<template>
  <div class="box">
    <div class="header">
      <span class="back" @click="$router.go(-1)"></span>
      佣金明细
    </div>
    <scroll class="scroll"
            ref="scrollList"
            pullup
            :data="list"
            @scrollToEnd="pullup"
            :listenScroll="listenScroll">
      <div class="scroll-box">
        <div class="brokerage">
          <img class="head-portrait" :src="item.userHeadPicPath?filterImg(item.userHeadPicPath):require('./images/headpic.png')">
          <div class="name-box">
            {{item.nickName?item.nickName: '无'}}
            <div class="company">{{item.sourceCompanyName?item.sourceCompanyName: '无'}}</div>
          </div>
          <div class="data-box">
            <div class="number">邀请（人数）<span>{{item.userInviteCount?item.userInviteCount:0}}</span></div>
            <div class="number">返佣<span>¥ {{item.commisionCount?item.commisionCount:'0'}}</span></div>
          </div>
        </div>
        <div class="list-box">
          <div class="list-title">最近成交</div>
          <div class="list">
            <div class="item" v-for="(item, index) in list" :key="index">
              <div class="message">
                <img src="./images/headpic.png" class="message-img">
                <div class="txt">
                  <div class="name">{{item.tradePartner}}
                    <!-- <span>{{item.tradePartner}}</span> -->
                  </div>
                  <div class="date">{{item.tradeDate}}</div>
                </div>
              </div>
              <div class="price-box">
                <div class="price">¥ {{item.tradePrice}}</div>
                <div class="txt">成交金额(元)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import { getCommissionNote } from 'api/home';
  import { mapGetters } from "Vuex";
    export default {
      data() {
        return {
          list: [],
          obj: {},
          listenScroll: true,
          item: {}
        };
      },
      created() {
        console.log(this.$route.query.item)
        this.item = this.$route.query.item;
        getCommissionNote({
          userId: this.$route.params.id
        }).then(res => {
          if (res.obj) {
            this.obj = res.obj;
            this.list = res.obj.orderManages?res.obj.orderManages:[];
            this.list.map((item, index)=> {
              item.tradeDate = item.tradeDate.substr(0, 10); 
            })
            console.log(this.list)
          }
        });
      },
      computed: {
        ...mapGetters("common", ["userInfo"]),
      },
      methods: {
        pullup() {},
        // 图片url拼接
        filterImg(img) {
          return this.userInfo.resourcesUrl + img;
        }
      }
    };
</script>

<style scoped lang="scss">
  @import "styles/mixin.scss";
  .box{
    height: 100%;
  }
  .header{
    height: 88px;
    background-color: #ffffff;
    border-bottom: 1px solid #f8f8f8;
    color: #333333;
    font-size: 34px;
    line-height: 88px;
    text-align: center;
    .back{
      position: absolute;
      top: 22px;
      left: 30px;
      width: 44px;
      height: 44px;
      background-image: url("./images/nav_icon_back_black.png");
      background-size: 100% 100%;
    }
  }
  .brokerage{
    height: 390px;
    background-color: #ffffff;
    overflow: hidden;
    .head-portrait{
      display: block;
      width: 160px;
      height: 160px;
      margin: 48px auto 56px;
      border-radius: 50%;
    }
    .name-box{
      height: 32px;
      display: flex;
      justify-content: center;
      font-size: 34px;
      color: #333333;
      line-height: 32px;
      margin-bottom: 24px;
      .company{
        height: 30px;
        line-height: 0.45rem;
        background-color: #ffeecb;
        border-radius: 15px;
        font-size: 20px;
        color: #ff6419;
        padding: 0 10px;
        margin-top: 1px;
        margin-left: 14px;
      }
    }
    .data-box{
      height: 28px;
      display: flex;
      justify-content: center;
      font-size: 24px;
      color: #333333;
      line-height: 28px;
      .number{
        margin: 0 24px;
        span{
          color: #ff6419;
          font-size: 28px;
          font-weight: bold;
          line-height: 28px;
          margin-left: 3px;
        }
      }
    }
  }
  .list-box{
    overflow: hidden;
    .list-title{
      height: 62px;
      background-color: #f5f5f5;
      color: #999999;
      font-size: 24px;
      line-height: 62px;
      padding-left: 30px;
    }
    .list{
      background-color: #fff;
      padding-bottom: 100px;
      .item{
        height: 80px;
        padding: 30px;
        display: flex;
        justify-content: space-between;
      }
      .message{
        height: 80px;
        display: flex;
        justify-content: left;
        .message-img{
          height: 80px;
          width: 80px;
          margin-right: 30px;
        }
        .txt{
          .name{
            height: 30px;
            line-height: 30px;
            font-size: 28px;
            color: #333333;
            margin-top: 8px;
            span{
              font-size: 16px;
              padding: 3px 10px;
              background-color: #ffeecb;
              color: #ff6419;
              border-radius: 15px;
              margin-top: -5px;
              margin-left: 5px;
            }
          }
          .date{
            font-size: 24px;
            color: #333333;
            margin-top: 16px;
          }
        }
      }
      .price-box{
        height: 80px;
        .price{
          font-size: 32px;
          font-weight: bold;
          color: #ff6419;
          margin-top: 8px;
          text-align: right;
        }
        .txt{
          font-size: 24px;
          color: #999999;
          margin-top: 16px;
          text-align: right;
        }
      }
    }
  }

</style>
