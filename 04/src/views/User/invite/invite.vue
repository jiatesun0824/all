<template>
  <div class="invite" :style="advShow?'padding-top:3.786667rem':'padding-top:2.613333rem'">
    <!--选择日期-->
    <div class="select-date" :class="showDate?'select-date-active':''">
      <awesome-picker
        style="z-index: 1000002"
        ref="picker0"
        :colorConfirm="picker0.colorConfirm"
        :colorCancel="picker0.colorCancel"
        :data="picker0.data"
        :anchor="picker0.anchor"
        @cancel="handlePickerCancel"
        @confirm="handlePicker0Confirm">
      </awesome-picker>
    </div>
    <!--<div class="shade"  v-show="showDate"></div>-->
    <!--选择日期-->
      <header>
        <i class="icon-left" @click="$router.back()"></i>
        <div class="title">详情</div>
     </header>
      <div class="tab">
          <div class="item" @click="suc">
              <span class="content br">成功邀请</span>
              <span class="border" v-if="portBoxwid=='2.773333rem'"></span>
          </div>
          <div class="item" @click="rank">
              <span class="content">排行榜</span>
              <span class="border" v-if="portBoxwid=='3.706667rem'"></span>
          </div>
      </div>
      <div class="adv" v-if="advShow">
          <div class="tit">
              温馨提示<span>{{advtit}}</span>
          </div>
          <img class="adv-icon" @click="closeAdv" src="../images/invite_icon_delete.png">
      </div>
    <div class="date" v-if="portBoxwid=='3.706667rem'">
      <span class="date-text" @click="isShowData">{{yearMonth}}</span>
      <span class="date-img"></span>
    </div>
    <scroll v-show="!listShow" class="wrapper" :listenScroll = "listenScroll"
        :probeType = "probeType"
        :pullup = "true"
        :beforeScroll = "true"
        :scrollX = "true"
        :refreshScroll = "true"
        :data = "silder"
        ref = "wrapperScroll">
      <div class="my" v-if="portBoxwid == '2.773333rem'">
          <div class="item" v-for="(item,index) in silder" :key="index">
              <div class="port-box" :style="{width:portBoxwid}">
                  <img v-if="index===0 && item.type==0" class="rank-img" src="../images/invite_icon_ranked1.png">
                  <img v-if="index===1 && item.type==0" class="rank-img" src="../images/invite_icon_ranked2.png">
                  <img v-if="index===2 && item.type==0" class="rank-img" src="../images/invite_icon_ranked3.png">
                  <div class="indextit" v-if="index>2 && item.type==0">{{index+1}}</div>
                  <div class="portcontent">
                      <img class="port-img" src="../images/banner_01.png">
                      <img class="portlabel" src="../images/invite_icon_label.png">
                      <span class="userTypeStr">{{item.userTypeStr}}</span>
                  </div>
              </div>
              <div class="info">
                  <div class="name">{{item.userName}}</div>
                  <div v-if="item.type==1" class="tit">{{item.registerTime}} 注册</div>
                  <div v-if="item.type==0" class="tit">
                      成功邀请 <span class="color-red">{{item.inviteCount}}</span>
                       <!--，返佣<span class="color-red">¥{{item.money}}</span>-->
                      </div>
              </div>
          </div>
      </div>
      <div class="my" v-else>
        <div class="item" v-for="(item,index) in silder" :key="index">
          <div class="port-box" :style="{width:portBoxwid}">
            <img v-if="index===0 && item.type==0" class="rank-img" src="../images/invite_icon_ranked1.png">
            <img v-if="index===1 && item.type==0" class="rank-img" src="../images/invite_icon_ranked2.png">
            <img v-if="index===2 && item.type==0" class="rank-img" src="../images/invite_icon_ranked3.png">
            <div class="indextit" v-if="index>2 && item.type==0">{{index+1}}</div>
            <div class="portcontent">
              <img class="port-img" :src="filterImg(item.userHeadPicPath)">
              <img class="portlabel" src="../images/invite_icon_label.png">
              <span class="userTypeStr">{{item.userTypeName}}</span>
            </div>
          </div>
          <div class="info">
            <div class="name">{{item.nickName}}</div>
            <div v-if="item.type==1" class="tit">{{item.registerTime}} 注册</div>
            <div v-if="item.type==0" class="tit">
              成功邀请 <span class="color-red">{{item.userInviteCount}}</span>
               ，返佣<span class="color-red">¥{{item.commisionCount}}</span>
            </div>
          </div>
        </div>
      </div>
    </scroll>
      <div class="but" @click="invite">立即邀请</div>
      <shareComponent :shareShow.sync="shareShow"></shareComponent>
      <div class="noList" v-show="listShow">
          <div class="imgbox">
              <img src="../images/list_icon_empty.png">
          </div>
          <div class="tit">
            您暂时还没有推荐业主成功注册！
          </div>
        </div>
  </div>
</template>
<script>
import mixins from "@/mixins/mixin";
import shareComponent from "@/components/shareComponent/index";
import { mapGetters } from "Vuex";
import { getInviteAdv, invitetoplist, userinvitelist, commissiontop } from "@/api/user";
export default {
  mixins: [mixins],
  data() {
    return {
      shareShow: false, //分享界面控制
      showDate: false,
      year: 0,
      month: 0,
      yearMonth: '',
      picker0: {
        colorConfirm: '#ff6419',
        colorCancel: '#333333',
        anchor: [],
        data: [[], []]
      },
      dateIndex: 0,
      dateList: [],
      dateItem: {},
      portBoxwid: "2.773333rem",
      advShow: true,
      advtit: "",
      silder: [],
      listShow: true,
      userPage: {
        curPage: 1,
        pageSize: 10
      },
      topPage: {
        curPage: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    ...mapGetters("common", ["platformCode"]),
    ...mapGetters("common", ["userInfo"]),
  },
  components: {
    shareComponent
  },
  created() {
    let date = new Date();
    let Year = [];
    let Month = [];
    for (let i = 2018; i <= date.getFullYear(); i++) {
      this.picker0.data[0].push(date.getFullYear() + '年');
      Year.push(date.getFullYear());
    };
    for (let i = 1; i <= 12; i++) {
      this.picker0.data[1].push(i + '月');
      Month.push(i);
    };
    this.picker0.anchor = [this.picker0.data[0].length - 1, date.getMonth()];
    this.year = Year[this.picker0.data[0].length - 1];
    this.month = Month[date.getMonth()];
    this.yearMonth = this.year + '年' + this.month + '月';
    this.topPage = {curPage: 1, pageSize: 10, year: this.year, month: this.month};
    getInviteAdv(this.platformCode).then(res => {
      console.log(res);
      this.advtit = res.datalist[0].bannerName;
    });
    userinvitelist(this.userPage).then(res => {
        if (res.status) {
          res.obj.map(item => {
            item.type = 1;
          });
          this.silder = res.obj;
          this.listShow = false;
        }else {
          this.listShow = true;
        }
    });
  },
  methods: {
    handlePicker0Confirm (v) {
      this.yearMonth = v[0].value + v[1].value;
      this.showDate = false;
      this.topPage = {curPage: 1, pageSize: 10, year: v[0].value.split('年')[0], month: v[1].value.split('月')[0]};
      this.rank();
      this.picker0.anchor = v;
    },
    handlePickerCancel() {
      this.showDate = false;
    },
    confirm() {
      this.showDate = false;
      this.rank();
    },
    isShowData() {
      this.$refs.picker0.show();
    },
    filterImg(img) {
      return this.userInfo.resourcesUrl + img;
    },
    invite() {
      this.shareShow = true;
    },
    close() {
      this.shareShow = false;
    },
    closeAdv() {
      this.advShow = false;
    },
    suc() {
      this.silder = [];
      this.portBoxwid = "2.773333rem";
      userinvitelist(this.userPage).then(res => {
        if (res.status) {
          res.obj.map(item => {
            item.type = 1;
          });
          console.log(1);
          if (res.obj) {
            this.silder = res.obj;
          }
          this.listShow = false;
        }else {
          this.listShow = true;
        }
      });
    },
    rank() {
      this.silder = [];
      this.portBoxwid = "3.706667rem";
      commissiontop(this.topPage).then(res => {
        if (res.status) {
          res.obj.map(item => {
            item.type = 0;
          });
          this.silder = res.obj;
          this.silder.sort((a, b) => {
            return b.commisionCount - a.commisionCount;
          });
          this.listShow = false;
        } else {
          this.listShow = true;
          this.silder = [];
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/header.scss";
</style>
<style lang="scss" scoped>
.invite {
  height: 100%;
  overflow: auto;
  background: #f5f5f5;
  position: relative;
  padding-bottom: 92px;
  box-sizing: border-box;
  .shade{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.5;
    z-index: 1000001;
  }
  .select-date{
    position: fixed;
    left: 0;
    top: 100%;
    width: 100%;
    height: 42%;
    transition: all 0.2s linear;
    background-color: #ffffff;
    z-index: 1000002;
    .data-header{
      height: 80px;
      padding: 0 30px;
      background-color: rgba(246, 246, 246, 0.9);
      box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: space-between;
      .cancel{
        font-size: 30px;
        color: #333333;
        line-height: 80px;
      }
      .confirm{
        font-size: 30px;
        color: #ff6419;
        line-height: 80px;
      }
    }
    .date-list{
      p{
        height: 80px;
        text-align: center;
        line-height: 80px;
        border-bottom: 1px solid #f5f5f5;
        font-size: 30px;
      }
      .p-active{
        background-color: #cdcdcd;
      }
    }
  }
  .select-date-active{
    top: 58%;
    transition: all 0.2s linear;
  }
  .date{
    height: 80px;
    background-color: #ffffff;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    justify-content: flex-end;
    .date-text{
      font-size: 30px;
      color: #333333;
      line-height: 80px;
    }
    .date-img{
      margin-left: 10px;
      margin-top: 36px;
      margin-right: 40px;
      width: 14px;
      height: 8px;
      background-size: 100% 100%;
      background-image: url("../../../assets/images/home_icon_more1.png");
    }
  }
  .color-red {
    color: red;
  }
  .br {
    border-right: solid 2px #e8e8e8;
  }
  .tab {
    position: fixed;
    left: 0;
    top: 88px;
    width: 100%;
    height: 88px;
    background: #fff;
    .item {
      width: 50%;
      float: left;
      text-align: center;
      padding-top: 29px;
      .content {
        width: 100%;
        height: 35px;
        line-height: 35px;
        text-align: center;
        display: block;
        font-size: 32px;
        font-family: PingFang-SC-Medium;
        box-sizing: border-box;
      }
      .border {
        width: 40px;
        height: 4px;
        display: inline-block;
        background: #ff6419;
      }
    }
  }
  .adv {
    position: fixed;
    left: 0;
    top: 175px;
    width: 100%;
    height: 96px;
    background-image: url("../images/invite_bg_ad.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .tit {
      line-height: 96px;
      padding-left: 32px;
      font-size: 30px;
      color: #fff;
      span {
        font-size: 28px;
        margin-left: 28px;
      }
    }
    .adv-icon {
      position: absolute;
      top: 33px;
      right: 15px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
  .my {
    background: #fff;
    padding-bottom: 88px;
    .item {
      height: 167px;
      overflow: hidden;
      border-bottom: solid 10px #f5f5f5;
      .port-box {
        height: 167px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-around;
        float: left;
        .rank-img {
          width: 60px;
          height: 53px;
        }
        .indextit {
          width: 60px;
          height: 53px;
          display: inline-block;
          font-size: 36px;
          color: #ff6419;
        }
        .portcontent {
          position: relative;
          .port-img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
          .portlabel {
            position: absolute;
            bottom: -5px;
            left: -20px;
            width: 140px;
            height: 40px;
          }
          .userTypeStr {
            font-size: 24px;
            color: #fff;
            position: absolute;
            bottom: 8px;
            left: 0;
            width: 100px;
            letter-spacing: 1px;
          }
        }
      }
      .info {
        float: left;
        padding-top: 45px;
        .name {
          font-size: 32px;
          font-family: PingFang-SC-Bold;
          color: #333;
          margin-bottom: 20px;
        }
        .tit {
          font-size: 28px;
          font-family: PingFang-SC-Bold;
          color: #333;
        }
      }
    }
  }
  .rank {
  }
  .but {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 88px;
    line-height: 88px;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    color: #fff;
    background: #ff6419;
    font-size: 32px;
    font-family: PingFang-SC-Bold;
    letter-spacing: 1px;
  }
  .noList {
    padding-top: 335px;
    .imgbox {
      text-align: center;
      img {
        width: 171px;
        height: 152px;
      }
    }
    .tit {
      margin-top: 49px;
      margin-bottom: 219px;
      text-align: center;
      font-size: 24px;
      line-height: 48px;
      color: #999;
    }
    .butbox {
      text-align: center;
      .butSp {
        width: 220px;
        height: 80px;
        background-color: #f5f5f5;
        border-radius: 40px;
        border: solid 2px #ff6419;
        font-size: 32px;
        color: #ff6419;
        display: inline-block;
        line-height: 80px;
      }
    }
  }
}
</style>
