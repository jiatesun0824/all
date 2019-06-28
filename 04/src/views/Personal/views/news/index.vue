<template>
  <div class="replace">
    <div class="header-box">
      <div class="type-header">
        <span class="goback" @click="goBack"></span>
        <span>我的消息 <b class="clearNews" :class="loadfailFlag ? 'greyTxt' : ''" @click="showClearNewsList()">清空</b></span>
      </div>
    </div>
    <scroll class="replace-wrapper"
            :data="data"
            :beforeScroll="beforeScroll"
            :pullup="pullup"
            :pulldown="pulldown"
            @pullup="loadData"
            @pulldown="topLoadData">
      <div>
        <div class="loading-wrapper" v-if="topLoad">加载更多...</div>
        <div class="replace-item" v-for="(item,index) in data" :key="index">
          <div class="item-header clearfix">
            <div class="dot" :class="item.isRead === 0 ? 'successDot' : ''"></div>
            <div class="header-type">{{item.title}}</div>
            <div class="time">{{item.gmtModified}}</div>
          </div>
          <div class="failReason" v-if="failFlag[index]">失败原因：{{item.failingReason}}</div>
          <div class="product-introduce clearfix">
            <!--<img src="" v-lazy="resourcesUrl + item.smallPicPath" class="product-image">-->
            <div class="replace-text">
              <div class="clearfix">
                <div class="identifying" :class="item.templateId == -1 ? 'replace-to-decorate' : 'in-my-home'">{{item.content}}</div>
              </div>
              <!--<div class="render-introduce">
                <div class="failure-reasons" v-if="renderFail[index]">失败原因 : {{item.failingReason}}</div>
              </div>-->
            </div>
          </div>
          <!--隐藏删除功能-->
         <!-- <div class="delete-wrapper" @click="deleteSure(index)">
            <div class="delete-sign"></div>
          </div>-->
          <div class="clear"></div>
        </div>
        <div class="loading-wrapper">{{loadEnd}}</div>
      </div>
      <loading v-if="loadingFlag"></loading>
    </scroll>
    <loadfail v-if="loadfailFlag"></loadfail>
    <transition name="fade">
      <div class="popup-sure" v-if="surePopupFlag" @click.self="closeDeleteSure">
        <div class="sure-wrapper">
          <div class="sure-top">
            <div class="top-text">是否删除该消息</div>
          </div>
          <div class="sure-footer">
            <div class="cancel" @click="closeDeleteSure">取消</div>
            <div class="sure" @click="deteleMyTask">确认</div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="popup-sure" v-if="showClearPancel" @click.self="closeShowClearPancel">
        <div class="sure-wrapper">
          <div class="sure-top">
            <div class="top-text">是否清空所有的消息</div>
          </div>
          <div class="sure-footer">
            <div class="cancel" @click="cancelDeleteNews">取消</div>
            <div class="sure" @click="clearAllNews">确认</div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  data() {
    return {
      data: [],
      loadEnd: "",
      page: 0, // 分页数
      pullup: true,
      pulldown: true,
      noticeText: "",
      showClearPancel: false,
      state: [], // 渲染的状态列表
      renderFail: [], // 渲染失败的状态列表
      renderTypeText: [], // 渲染类型的文本字段
      loadfailFlag: false,
      failFlag: [], // 渲染失败时显示失败原因
      headerImage: [], // 左上角的图片类名数组
      footerFlag: [], // 底部立即查看、查看退款显示状态
      alreadyAppear: 0,
      topLoad: false,
      beforeScroll: true,
      deleteIndex: -1,
      surePopupFlag: false
    };
  },
  created() {
    this.$store.commit("showComComponents", false);
    //      this.loadData();
  },
  mounted() {
    this.loadData();
  },
  methods: {
    showClearNewsList() {
      if (this.data.length > 0) {
        this.showClearPancel = true;
      } else {
        this.showClearPancel = false;
      }
    },
    cancelDeleteNews() {
      this.showClearPancel = false;
    },
    clearAllNews() {
      if (this.showClearPancel) {
        this.showClearPancel = false;
        this.deleteAllNews();
      }
    },
    deleteAllNews() {
      this.API.removeAllNews({
        userId: localStorage.getItem("userId")
      }).then(res => {
        this.data = res.dataList; // 消息列表数据清空
        this.loadfailFlag = true;
        this.$store.state.loadfailTxt = "暂时没有记录呀~";
      });
    },
    deleteSure(index) {
      this.surePopupFlag = true;
      this.deleteIndex = index;
    },
    closeDeleteSure() {
      this.surePopupFlag = false;
    },
    deteleMyTask() {
      this.API.personalDeleteOneNews({
        id: this.data[this.deleteIndex].id
      }).then(response => {
        if (response) {
          this.data.splice(this.deleteIndex, 1);
          this.state.splice(this.deleteIndex, 1);
          this.renderFail.splice(this.deleteIndex, 1);
          this.renderTypeText.splice(this.deleteIndex, 1);
          this.headerImage.splice(this.deleteIndex, 1);
          this.footerFlag.splice(this.deleteIndex, 1);
          this.closeDeleteSure();
        }
      });
    },
    loadData() {
      if (this.loadEnd == "没有更多数据") {
        return;
      }
      let limit = 10,
        start = 0; // 分页初始位置
      let pageStart = start + limit * this.page; // 上拉加载分页起始位置
      this.alreadyAppear = pageStart;
      this.API.personalNewsList({
        userId: localStorage.getItem("userId"),
        start: pageStart,
        limit: limit,
        order: "gmtModified",
        orderNum: "desc"
      }).then(response => {
        if (response) {
          this.page++;
          let loadmore = response.datalist;
          if (response.totalCount == 0 || loadmore == null) {
            this.loadfailFlag = true;
            this.$store.state.loadfailTxt = "暂时没有记录呀~";
            return;
          } else if (response.totalCount <= 10 || loadmore.length == 0) {
            this.loadEnd = "没有更多数据";
          } else {
            this.loadEnd = "加载更多...";
          }
          this.data = this.data.concat(loadmore);
          if (this.data.length == 0) {
            this.$store.state.loadfailTxt = "您目前还未有任务消息";
            this.loadfailFlag = true;
          }
          for (let i = 0; i < this.data.length; i++) {
            //              if (this.data[i].isRead == 0) {
            //                this.$store.state.isNewsRead[i] = true;
            //              } else {
            //                this.$store.state.isNewsRead[i] = false;
            //              }
            if (this.data[i].status == 0) {
              this.failFlag[i] = true;
            } else {
              this.failFlag[i] = false;
            }
          }
        }
      });
    },
    topLoadData() {
      this.topLoad = true;
      this.$store.dispatch("cancelLoader");
      let start = 0; // 分页初始位置
      this.API.personalNewsList({
        userId: localStorage.getItem("userId"),
        start: start,
        limit: this.alreadyAppear + 10,
        order: "gmtModified",
        orderNum: "desc"
      }).then(response => {
        if (response) {
          this.$store.dispatch("setLoader");
          this.topLoad = false;
          this.loadingFlag = false;
          this.data = response.datalist;
          if (this.data.length == 0) {
            this.$store.state.loadfailTxt = "您目前还未有任务消息";
            this.loadfailFlag = true;
          }
          for (let i = 0; i < this.data.length; i++) {
            //              if (this.data[i].isRead == 0) {
            //                this.$store.state.isNewsRead[i] = true;
            //              } else {
            //                this.$store.state.isNewsRead[i] = false;
            //              }
            if (this.data[i].status == 0) {
              this.failFlag[i] = true;
            } else {
              this.failFlag[i] = false;
            }
          }
        }
      });
    },
    goBack() {
      this.$store.state.isNewsRead = false;
      this.$store.commit("showComComponents", true);
      this.$router.push("/personal");
      this.$store.state.intergralHeader = true;
    }
  },
  computed: mapState({
    resourcesUrl: state => state.resourcesUrl,
    newsList: state => state.newsList,
    isNewsRead: state => state.isNewsRead,
    showDot: state => state.showDot,
    loadingFlag: state => state.loadingFlag
  })
};
</script>

<style lang="scss" scoped>

body {
  position: absolute;
  width: 100%;
  height: 100%;
  font-family: PingFang-SC-Medium;
  -webkit-tap-highlight-color: transparent;
}

.clearfix:after {
  display: block;
  content: "";
  height: 0;
  line-height: 0;
  clear: both;
  visibility: hidden;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

@media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
  .border-1px::after {
    -webkit-transform: scaleY(0.7);
    transform: scaleY(0.7);
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .border-1px::after {
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}

.header-wrapper {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100 !important;
}

.nav-wrapper {
  position: absolute;
  top: 88px;
  width: 100%;
  display: flex;
}

.footer-wrapper {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
}

.loading-wrapper {
  width: 100%;
  height: 88px;
  text-align: center;
  padding-top: 50px;
  clear: both;
  font-size: 22px;
  color: #8e8e8e;
}

@media all and (min-width: 1024px) {
  .loading-wrapper {
    height: 44px;
    line-height: 44px;
    text-align: center;
    clear: both;
    font-size: 12px;
  }
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  background-color: none !important;
  background-image: none;
}

.replace {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #eeeeee;
}

.replace .popup-sure {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.6);
}

.replace .popup-sure .sure-wrapper {
  width: 541px;
  height: 280px;
  font-size: 30px;
  background: #fff;
  border-radius: 4px;
}

.replace .popup-sure .sure-wrapper .sure-top {
  height: 192px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.replace .popup-sure .sure-wrapper .sure-top .top-text {
  width: 270px;
  height: 65px;
  text-align: center;
  line-height: 40px;
}

.replace .popup-sure .sure-wrapper .sure-footer {
  display: flex;
  font-size: 34px;
  line-height: 88px;
}

.replace .popup-sure .sure-wrapper .sure-footer .cancel {
  flex: 1;
  text-align: center;
}

.replace .popup-sure .sure-wrapper .sure-footer .sure {
  flex: 1;
  text-align: center;
  color: #ff6419;
  border-left: 1px solid #eee;
}

.replace .header-box {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9999;
}

.replace .header-box .type-header {
  background: #fff;
  color: #333;
  font-size: 36px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  position: relative;
}

.replace .header-box .type-header:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  content: "";
}

.replace .header-box .type-header .clearNews {
  position: absolute;
  right: 30px;
  font-weight: normal;
  font-size: 28.000000000000004px;
  color: #333;
}

.replace .header-box .type-header .clearNews.greyTxt {
  color: #999;
}

.replace .header-box .type-header .goback {
  width: 25px;
  height: 41px;
  position: absolute;
  left: 34px;
  top: 24px;
  background-size: 25px 41px;
  background-image: url("../../images/back_nor.png");
}

.replace .header-box .type-header .goback:active {
  background-image: url("../../images/back_pre.png");
}

.replace .header-box .type-header .type-text {
  display: block;
  width: 256px;
  margin: 0 auto;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.replace .replace-wrapper {
  position: absolute;
  width: 100%;
  top: 88px;
  bottom: 98px;
  padding-top: 20px;
}

.replace .replace-wrapper .replace-item {
  width: 100%;
  min-height: 160px;
  background: #fff;
  margin-bottom: 20px;
  padding-bottom: 20px;
  position: relative;
}

.replace .replace-wrapper .replace-item .failReason {
  font-size: 24px;
  color: #999;
  line-height: 36px;
  padding: 0 30px;
}

.replace .replace-wrapper .replace-item .delete-wrapper {
  width: 44px;
  height: 44px;
  display: center;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 10px;
  right: 20px;
}

.replace .replace-wrapper .replace-item .delete-wrapper .delete-sign {
  width: 44px;
  height: 44px;
  background-size: 100% 100%;
  background-image: url("../../images/me_icon_delete@2x.png");
}

.replace .replace-wrapper .replace-item .item-header {
  height: 70px;
  padding-top: 15px;
}

.replace .replace-wrapper .replace-item .item-header .dot {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  float: left;
  margin: 30px 8px 0 10px;
}

.replace .replace-wrapper .replace-item .item-header .successDot {
  background: red;
}

.replace .replace-wrapper .replace-item .item-header .errorDot {
  background: #999999;
}

.replace .replace-wrapper .replace-item .item-header .header-type {
  float: left;
  font-size: 30px;
  margin: 20px 30px 0 0;
}

.replace .replace-wrapper .replace-item .item-header .time {
  font-size: 20px;
  float: right;
  margin: 21px 30px;
  color: #999;
}

.replace .replace-wrapper .replace-item .notice {
  width: 100%;
  height: 80px;
  line-height: 80px;
  font-size: 26px;
  padding-left: 30px;
  margin-top: 30px;
  border-top: 1px solid #eee;
}

.replace .replace-wrapper .replace-item .notice .hint-btn {
  position: relative;
  width: 160px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  margin: 10px 30px;
  float: left;
  border-radius: 8px;
  color: #333;
}

.replace .replace-wrapper .replace-item .notice .hint-btn .greater {
  width: 11px;
  height: 20px;
  background-size: 11px 20px;
  background-image: url("../../images/greater.png");
  float: right;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
}

.replace .replace-wrapper .replace-item .product-introduce .product-image {
  width: 229.99999999999997px;
  height: 170px;
  margin: 0 30px;
  float: absolute;
}

.replace .replace-wrapper .replace-item .product-introduce .replace-text {
  font-size: 24px;
  float: left;
  margin-left: 26px;
  margin-top: 10px;
}

.replace
  .replace-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .product-text {
  float: left;
  line-height: 36px;
  max-width: 438px;
  padding-left: 34px;
  white-space: nowrap;
  overflow: hidden;
  color: #999;
  text-overflow: ellipsis;
  position: relative;
}

.replace
  .replace-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .product-text:before {
  content: "";
  position: absolute;
  left: 8px;
  top: 10px;
  border-left: solid 1px #999;
  height: 20px;
}

.replace
  .replace-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .render-type {
  font-size: 20px;
  margin-top: 10px;
}

.replace
  .replace-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .identifying {
  line-height: 36px;
  text-align: absolute;
  font-size: 24px;
  float: left;
  margin-right: 18px;
}

.replace
  .replace-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .in-my-home {
  color: #999;
  position: relative;
}

.replace
  .replace-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .replace-to-decorate {
  color: #999;
}

.replace .replace-wrapper .replace-item .render-introduce {
  margin-top: 15px;
  font-size: 20px;
}

.replace .replace-wrapper .replace-item .render-introduce .failure-reasons {
  width: 640px;
  white-space: nowrap;
  padding-left: 10px;
  overflow: hidden;
  margin-top: -20px;
  text-overflow: ellipsis;
  color: #999999;
  height: 30px;
  line-height: 30px;
}
</style>
