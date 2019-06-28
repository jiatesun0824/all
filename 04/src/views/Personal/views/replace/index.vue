<template>
  <div class="replace">
    <div class="header-box">
      <div class="type-header">
        <span class="goback" @click="goBack"></span>
        <span>我的任务</span>
      </div>
    </div>
    <scroll class="replace-wrapper"
            :data="data"
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @pullup="loadData"
            :pulldown="pulldown"
            @pulldown="topLoadData">
      <div class="replace-contant-wrapper">
        <div class="loading-wrapper" v-if="topLoad">加载更多...</div>
        <div class="replace-item" v-for="(item,index) in data" :key="index">
          <div class="item-header clearfix">
            <!-- <div class="header-image" :class="headerImage[index]"></div> -->
            <div class="header-type">{{renderTypeText[index]}}</div>
            <div class="header-time">{{item.gmtCreate}}</div>
          </div>
          <div class="product-introduce clearfix"
            :style="index == leftDeleteIndex ? 'transform: translateX(-' + leftDistance + 'px)' : ''"
            @touchstart="slideStart($event)"
            >
            <img src="" v-lazy="resourcesUrl + item.smallPicPath" class="product-image" @click.self="goeffectPicture($event, index)">
            <div class="replace-text">
              <div class="clearfix">
                <div class="identifying" :class="item.templateId == -1 ? 'replace-to-decorate' : 'in-my-home'" style="padding-top: 0.04rem">{{item.templateId == -1 ? '替换装修' : '装进我家'}}</div>
                <div class="product-text" style="padding-top: 0.06rem">{{item.designName}}</div>
              </div>
              <div class="render-type">{{state[index]}}</div>
              <div class="render-introduce">
                <div class="failure-reasons" v-if="renderFail[index]">失败原因 : {{item.failReason}}</div>
              </div>
            </div>
            <div class="delete-wrapper" @click="deleteSure(index)">
              <div class="delete-sign"></div>
            </div>
            <div class="clear"></div>
            <div class="notice" v-if="renderFail[index]">
              <div class="hint-btn" @click="goRefund">查看退款
                <div class="greater"></div>
              </div>
            </div>
            <div class="delete-botton" @click="deteleMyTask($event,index)">删除</div>
          </div>
        </div>
        <div class="loading-wrapper">{{loadEnd}}</div>
      </div>
      <loadfail v-if="loadfailFlag"></loadfail>
      <loading v-if="loadingFlag"></loading>
    </scroll>
    <transition name="fade">
      <div class="popup-sure" v-if="surePopupFlag" @click.self="closeDeleteSure">
        <div class="sure-wrapper">
          <div class="sure-top">
            <div class="top-text">是否删除该任务</div>
          </div>
          <div class="sure-footer">
            <div class="cancel" @click="closeDeleteSure">取消</div>
            <div class="sure" @click="deteleMyTask">确认</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

const limit = 10;

export default {
  data() {
    return {
      data: [],
      pullup: true,
      pulldown: true,
      beforeScroll: true,
      page: 0, // 分页数
      loadEnd: "",
      topLoad: false,
      alreadyAppear: 0,
      noticeText: "",
      state: [], // 渲染的状态列表
      renderFail: [], // 渲染失败的状态列表
      renderTypeText: [], // 渲染类型的文本字段
      loadfailFlag: false,
      headerImage: [], // 左上角的图片类名数组
      footerFlag: [], // 底部立即查看、查看退款显示状态
      renderTypeList: [], // 接口渲染类型传的value的值
      remark: "",
      leftDeleteIndex: -1,
      leftDistance: 0,
      x: 0,
      y: 0,
      X: 0,
      Y: 0,
      swipeX: true,
      swipeY: true,
      surePopupFlag: false,
      deleteIndex: -1
    };
  },
  //    activated() {
  //      this.$store.state.intergralHeader = false;
  //      this.data = [];
  //      this.page = 0; // 分页数
  //      this.loadEnd = '';
  //      this.loadData();
  //    },
  created() {
    this.$store.state.intergralHeader = false;
    this.data = [];
    this.page = 0; // 分页数
    this.loadEnd = "";
    this.loadData();
  },
  mounted() {},
  methods: {
    deleteSure(index) {
      this.surePopupFlag = true;
      this.deleteIndex = index;
    },
    closeDeleteSure() {
      this.surePopupFlag = false;
    },
    slideStart(event) {
      this.x = event.changedTouches[0].pageX;
      this.y = event.changedTouches[0].pageY;
      this.swipeX = true;
      this.swipeY = true;
    },
    slideEnd(event, index) {
      if (this.state[index] != "装修中...") {
        this.X = event.changedTouches[0].pageX;
        this.Y = event.changedTouches[0].pageY;
        // 左右滑动
        if (
          this.swipeX &&
          Math.abs(this.X - this.x) - Math.abs(this.Y - this.y) > 0
        ) {
          // 阻止事件冒泡
          event.stopPropagation();
          if (this.X - this.x > 10) {
            // 右滑
            event.preventDefault();
            this.leftDeleteIndex = -1;
          }
          if (this.x - this.X > 10) {
            // 左滑
            event.preventDefault();
            this.leftDeleteIndex = index;
            if (screen.width > screen.height) {
              this.screenWidth = screen.height;
            } else {
              this.screenWidth = screen.width;
            }
            this.leftDistance = 1 * this.screenWidth / 7.5;
          }
          this.swipeY = false;
        }
        // 上下滑动
        if (
          this.swipeY &&
          Math.abs(this.X - this.x) - Math.abs(this.Y - this.y) < 0
        ) {
          this.swipeX = false;
        }
      }
    },
    deteleMyTask() {
      this.API.deteleMyTaskAndDesign({
        taskId: this.data[this.deleteIndex].taskId,
        id: this.data[this.deleteIndex].id
      }).then(response => {
        if (response) {
          this.data.splice(this.deleteIndex, 1);
          this.state.splice(this.deleteIndex, 1);
          this.renderTypeText.splice(this.deleteIndex, 1);
          this.headerImage.splice(this.deleteIndex, 1);
          this.footerFlag.splice(this.deleteIndex, 1);
          this.renderFail.splice(this.deleteIndex, 1);
          this.closeDeleteSure();
        }
      });
    },
    loadData() {
      if (this.loadEnd == "没有更多数据") {
        return;
      }
      let start = 0; // 分页初始位置
      let pageStart = start + limit * this.page; // 上拉加载分页起始位置
      this.alreadyAppear = pageStart;
      this.leftDeleteIndex = -1;
      this.API.getMyReplaceRecord({
        operationUserId: localStorage.getItem("userId"),
        start: pageStart,
        limit: limit
      }).then(response => {
        if (response) {
          this.page++;
          let loadmore = response.datalist;
          if (loadmore.length == 0) {
            this.loadfailFlag = true;
            this.$store.state.loadfailTxt = "您目前还未有渲染任务!";
            return;
          } else if (loadmore.length < 10 || loadmore.length == 0) {
            this.loadEnd = "没有更多数据";
          } else {
            this.loadEnd = "加载更多...";
          }
          this.data = this.data.concat(loadmore);
          if (10 * this.page - response.totalCount == 0) {
            this.loadEnd = "没有更多数据";
          }
          this.loadfailFlag = false;
          for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].isSuccess == 0) {
              this.state[i] = "装修中...";
              this.footerFlag[i] = false;
            } else if (this.data[i].isSuccess == 1) {
              this.state[i] = "装修中...";
              this.footerFlag[i] = false;
            } else {
              this.state[i] = "装修完成";
              this.footerFlag[i] = true;
              this.renderFail[i] = false;
              if (this.data[i].isSuccess == 3) {
                this.renderFail[i] = true;
                this.state[i] = "装修失败";
              }
            }
            if (this.data[i].renderTypesStr == 1) {
              this.renderTypeText[i] = "照片级";
            } else if (this.data[i].renderTypesStr == 2) {
              this.renderTypeText[i] = "720全景";
              this.headerImage[i] = "fullview";
              this.renderTypeList[i] = 4;
            } else if (this.data[i].renderTypesStr == 3) {
              this.renderTypeText[i] = "多点全景";
              this.headerImage[i] = "roam";
              this.renderTypeList[i] = 8;
            } else {
              this.renderTypeText[i] = "漫游视频";
              this.headerImage[i] = "video";
              this.renderTypeList[i] = 6;
            }
          }
        }
      });
    },
    topLoadData() {
      this.topLoad = true;
      this.$store.dispatch("cancelLoader");
      let start = 0; // 分页初始位置
      this.API.getMyReplaceRecord({
        operationUserId: localStorage.getItem("userId"),
        start: start,
        limit: this.alreadyAppear + 10
      }).then(response => {
        if (response) {
          this.$store.dispatch("setLoader");
          this.topLoad = false;
          this.data = response.datalist;
          for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].isSuccess == 0) {
              this.state[i] = "装修中...";
              this.footerFlag[i] = false;
            } else if (this.data[i].isSuccess == 1) {
              this.state[i] = "装修中...";
              this.footerFlag[i] = false;
            } else {
              this.state[i] = "装修完成";
              this.footerFlag[i] = true;
              this.renderFail[i] = false;
              if (this.data[i].isSuccess == 3) {
                this.renderFail[i] = true;
                this.state[i] = "装修失败";
              }
            }
            if (this.data[i].renderTypesStr == 1) {
              this.renderTypeText[i] = "照片级";
            } else if (this.data[i].renderTypesStr == 2) {
              this.renderTypeText[i] = "720全景";
              this.headerImage[i] = "fullview";
              this.renderTypeList[i] = 4;
            } else if (this.data[i].renderTypesStr == 3) {
              this.renderTypeText[i] = "多点全景";
              this.headerImage[i] = "roam";
              this.renderTypeList[i] = 8;
            } else {
              this.renderTypeText[i] = "漫游视频";
              this.headerImage[i] = "video";
              this.renderTypeList[i] = 6;
            }
          }
        }
      });
    },
    goBack() {
      this.$store.state.intergralHeader = true;
      this.$store.commit("showComComponents", true);
      this.$router.push("/personal");
    },
    goeffectPicture(event, index) {
      if (!event._constructed) {
        return;
      }
      console.log(this.data[index]);
      if (this.leftDeleteIndex == -1) {
        // this.$store.commit("audioAutoPlay");
        // this.$store.state.isMyTask = false;
        sessionStorage.setItem("operationSource", 0);
        sessionStorage.setItem("groupPlanId", this.data[index].businessId);
        sessionStorage.setItem("cpId", this.data[index].businessId);
        this.$store.state.fasttype = "renderScene";
        if (this.state[index] == "装修完成") {
          if (this.$route.path == "/view720") {
            return;
          }
          this.$store.state.goBackPath = this.$route.path;
          if (this.renderTypeText[index] == "720全景") {
            this.$store.state.detailsSeeType = "";
            this.remark = "720";
          } else if (this.renderTypeText[index] == "多点全景") {
            this.$store.state.detailsSeeType = "2";
            this.remark = "roam";
          } else if (this.renderTypeText[index] == "漫游视频") {
            this.$store.state.detailsSeeType = "2";
            this.remark = "video";
          }
          this.API.getPictureList({
            id: this.data[index].businessId,
            remark: this.remark
          }).then(response => {
            if (response) {
              if (!response.datalist.length) {
                return;
              }
              sessionStorage.setItem("planId", response.datalist[0].businessId);
              this.$store.state.smallTitle = this.data[index].planName;
              this.$store.state.view720LoadingFlag = true;
              if (this.remark == "video") {
                this.$store.state.showVideo = true;
                this.$router.push("/videoview");
                this.$store.state.videoView.videoViewSmall = response.datalist;
                localStorage.setItem(
                  "_videoPreviewImage_",
                  this.$store.state.videoView.videoViewSmall[0].picPath
                ); // 缓存视频预览图
              } else {
                this.$router.push("/view720");
                this.$store.state.view720.view720Small = response.datalist;
              }
            }
          });
        }
      } else {
        this.leftDeleteIndex = -1;
      }
    },
    goRefund() {
      this.$store.state.goBackPath = this.$route.path;
      this.$store.commit("showComComponents", false);
      this.$router.push("/personal/account");
    }
  },
  computed: mapState({
    resourcesUrl: state => state.resourcesUrl,
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
  z-index: 3;
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
}

.replace .replace-wrapper .replace-contant-wrapper {
  padding-top: 20px;
}

.replace .replace-wrapper .replace-contant-wrapper .replace-item {
  position: relative;
  width: 100%;
  background: #fff;
  margin-bottom: 32px;
}

.replace .replace-wrapper .replace-contant-wrapper .replace-item .item-header {
  height: 70px;
  border: 1px solid #eee;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .item-header
  .header-image {
  width: 46px;
  height: 46px;
  background-size: 46px 46px;
  margin: 10px 30px;
  float: left;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .item-header
  .fullview {
  background-image: url("../../images/fullview.png");
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .item-header
  .roam {
  background-image: url("../../images/roam.png");
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .item-header
  .video {
  background-image: url("../../images/video.png");
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .item-header
  .header-type {
  float: left;
  font-size: 26px;
  margin: 20px 30px;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .item-header
  .header-time {
  font-size: 20px;
  float: right;
  margin: 21px 30px;
  color: #999;
}

.replace .replace-wrapper .replace-contant-wrapper .replace-item .clear {
  clear: both;
}

.replace .replace-wrapper .replace-contant-wrapper .replace-item .notice {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 26px;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .notice
  .hint-btn {
  position: relative;
  padding: 5px 30px 10px 30px;
  color: #333;
  height: 80px;
  line-height: 60px;
  background: #fff;
  border-top: solid 1px #e3e3e3;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .notice
  .hint-btn
  .greater {
  width: 11px;
  height: 20px;
  background-size: 11px 20px;
  background-image: url("../../images/greater.png");
  float: right;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 32px;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce {
  transition: 0.3s;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce
  .product-image {
  width: 229.99999999999997px;
  height: 170px;
  margin: 30px 30px;
  float: left;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce
  .replace-text {
  font-size: 26px;
  float: left;
  margin-top: 30px;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .product-text {
  float: left;
  max-width: 438px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .render-type {
  font-size: 20px;
  margin-top: 10px;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .identifying {
  width: 110.00000000000001px;
  height: 35px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  float: left;
  margin-right: 8px;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .in-my-home {
  color: #fff;
  background-color: #ff6419;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce
  .replace-text
  .replace-to-decorate {
  color: #fff;
  background-color: #ff6419;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce
  .delete-wrapper {
  width: 44px;
  height: 44px;
  display: center;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 60px;
  right: 20px;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .product-introduce
  .delete-wrapper
  .delete-sign {
  width: 44px;
  height: 44px;
  background-size: 100% 100%;
  background-image: url("../../images/me_icon_delete@2x.png");
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .render-introduce {
  margin-top: 15px;
  font-size: 20px;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .render-introduce
  .failure-reasons {
  max-width: 385px;
  color: #999999;
  line-height: 30px;
}

.replace
  .replace-wrapper
  .replace-contant-wrapper
  .replace-item
  .delete-botton {
  position: absolute;
  top: 0;
  font-size: 30px;
  width: 100px;
  height: 100%;
  display: center;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #999;
  color: #fff;
  right: -100px;
}
</style>
