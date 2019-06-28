<template>
  <div class="landscape">
    <div class="landscape-wrapper">
      <div class="header">
        <span class="goback" @click="goBack"></span>
        <span class="ipad-title">一键装修</span>
      </div>
      <div class="content">
        <div class="left-wrap">
          <div class="tip-wrapper">
            <div v-if="!tipFlag" class="tip">
              <span class="tip-item active-tip">{{tipName}}</span>
            </div>
            <div v-else="tipFlag" class="tip">
              <span class="tip-item" 
                v-for="(item,index) in decorateTipArr"
                :class="curTip === index ? 'active-tip' : ''" 
                @click="selTip(index)"
                :key="index"
              >{{item}}</span>
            </div>
          </div>
          <div class="layout-wrap">
            <div class="layout-wrapper" ref="tipWrapper">
              <ul class="layout">
                <template v-if="tipFlag">
                  <li class="layout-item" 
                    v-for="(item,index) in spaces"
                    :class="curLayout === index ? 'active-layout' : ''" 
                    :spaceId="item.spaceId"
                    :key="index"
                  >
                    <img class="layout-pic" :src="resourcesUrl + item.viewPlanPath" @click="selLayout(index)">
                  </li>
                </template>
                <template v-else="!tipFlag">
                  <li class="layout-item" 
                    v-for="(item,index) in spaces"
                    :class="curLayout === index ? 'active-layout' : ''" 
                    :spaceId="item.spaceId"
                    :key="index"
                  >
                    <img class="layout-pic" :src="resourcesUrl + item.picPath" @click="selLayout(index)">
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
        <div class="right-wrap">
          <div class="top-wrap clearfix">
            <div class="hint-item">
              <span class="text">选择喜欢的样板房，将右边的方案应用到该样板房</span>
            </div>
            <div class="space-item">
              <span class="nav-text">风格</span>
              <span class="nav-arrow" @click="selSpace" ref="navArrow"></span>
            </div>
          </div>
          <scroll class="wrapper mid-wrap"
                  :data="data"
                  :pullup="pullup"
                  @pullup="loadData">
            <ul class="mid">
              <li class="item" v-for="(item,index) in data" :houseTypeName="item.houseTypeName" :key="index">
                <img class="pic" :src="resourcesUrl + item.coverPath" :onerror="errorPic" @click="showLargePic(index)">
                <div class="info-wrap">
                  <span class="address">{{item.styleName}}</span>
                  <span class="btn" @click="createView(index)">装进我家</span>
                </div>
              </li>
              <div class="loading-wrapper" v-if="!loadfailFlag">{{loadEnd}}</div>
            </ul>
            <loadfail v-if="loadfailFlag"></loadfail>
            <transition name="dropdown">
              <div class="space-nav-wrapper" v-if="isShow">
                <div class="space-nav">
                  <span class="nav-item" 
                    v-for="(item,index) in decorateStyleList"
                    @click="selNav(index)" 
                    :class="curIndex === index ? 'active-nav' : ''"
                    :key="index"
                  >{{item.name}}</span>
                </div>
              </div>
            </transition>
          </scroll>
          <loading v-if="loadingFlag"></loading>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="large-pic-wrapper" v-if="isShowLargePic">
        <div class="large-pic-item">
          <img class="large-pic" :src="resourcesUrl + largePicSrc">
          <span class="large-pic-btn" @click="createViewFromBigPic">装进我家</span>
          <span class="close" @click="close"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";
import BScroll from "better-scroll";

const limit = 10;

export default {
  data() {
    return {
      errorPic: 'this.src="' + require("./images/no_img.jpg") + '"', // 错误图片
      tipFlag: false, // 左边nav
      curTip: 0,
      tipScroll: "", // tip滚动条
      tipArr: "",
      curLayout: 0,
      isCreate: true,
      isShow: false, // 右边nav
      tipName: "",
      curIndex: 0,
      supplement: [{ name: "不限", value: "" }], // 补全全部选项按钮
      count: 1,
      data: [],
      pullup: true,
      page: 0, // 分页数
      loadEnd: "",
      loadfailFlag: false,
      isShowLargePic: false, // 是否显示大图
      largePicSrc: "", // 大图路径
      viewIndex: "", // 全景index
      templateId: this.$store.state.result.spaces[0].spaceId, // 风格id
      renderingType: 4 // 渲染图类型参数 (暂定类型4)
    };
  },
  created() {},
  activated() {
    let arr = sessionStorage.getItem("houseNameArr");
    arr = arr.split(",");
    this.tipArr = arr;
    let userId = localStorage.getItem("userId"), // 用户id
      start = 0; // 分页初始位置
    let pageStart = start + limit * this.page; // 上拉加载分页起始位置
    let token = localStorage.getItem("token");
    if (this.$store.state.searchPath == "space") {
      this.tipFlag = false;
      this.tipName = sessionStorage.getItem("name");
    } else {
      this.tipFlag = true;
    }
    this.API.style({
      // 根据空间类型得到风格列表
      houseName: this.$store.state.decorateTipArr[0]
    }).then(response => {
      if (response) {
        let result = response.datalist;
        this.$store.state.decorateStyleList = this.supplement.concat(result);
      }
    });
    this.API.spaceLayout({
      houseId: sessionStorage.getItem("houseId"),
      msgId: userId,
      limit: limit,
      start: pageStart,
      token: token,
      spaceFunctionId: this.tipArr[0]
    }).then(response => {});
    this.loadData();
  },
  methods: {
    goBack() {
      if (this.$store.state.searchPath == "space") {
        this.$router.push("/shapechange");
      } else {
        this.$router.push("/typechange");
      }
    },
    _initScroll() {
      this.tipScroll = new BScroll(this.$refs.tipWrapper, {
        click: true
      });
    },
    initScroll() {
      this.data = [];
      this.page = 0;
      this.loadEnd = "";
      this.loadData();
    },
    loadData() {
      if (this.loadEnd == "没有更多数据") {
        return;
      }
      let userId = localStorage.getItem("userId"); // 用户id
      let token = localStorage.getItem("token"),
        start = 0; // 分页初始位置
      let pageStart = start + limit * this.page; // 上拉加载分页起始位置
      this.API.recom({
        houseType: sessionStorage.getItem("houseType") || "",
        brandName: "",
        creator: "",
        livingName: "",
        areaValue: "",
        designRecommendedStyleId: sessionStorage.getItem("styleId") || "",
        isMainList: "1",
        msgId: userId,
        token: token,
        limit: limit,
        start: pageStart
      }).then(response => {
        if (response) {
          this.page++;
          let loadmore = response.datalist;
          if (response.totalCount == 0) {
            this.loadfailFlag = true;
            this.$store.state.loadfailTxt = "抱歉!还未有可供推荐的设计方案!";
            return;
          } else if (response.totalCount <= 10 || loadmore.length == 0) {
            this.loadEnd = "没有更多数据";
          } else {
            this.loadEnd = "加载更多...";
          }
          this.data = this.data.concat(loadmore);
          this.loadfailFlag = false;
        }
      });
    },
    // 选择tip
    selTip(index) {
      this.curTip = index;
      this.curLayout = 0;
      // 获取布局列表
      let userId = localStorage.getItem("userId"), // 用户id
        start = 0; // 分页初始位置
      //        let pageStart = start + limit * this.page;
      let token = localStorage.getItem("token");
      let spaceFunctionId = this.tipArr[index];
      console.log("houseType: " + this.tipArr[index] + index);
      sessionStorage.setItem("houseType", this.tipArr[index]);
      sessionStorage.setItem("styleId", "");
      this.API.spaceLayout({
        houseId: sessionStorage.getItem("houseId"),
        msgId: userId,
        limit: limit,
        start: start,
        token: token,
        spaceFunctionId: (spaceFunctionId || this.tipArr[0]) + ""
      }).then(response => {
        if (response) {
          this.$store.state.result.spaces = response.datalist;
          this.templateId = this.$store.state.result.spaces[0].spaceId;
        }
      });

      // 获取风格nav列表
      this.API.style({
        // 根据空间类型得到风格列表
        houseName: this.$store.state.decorateTipArr[index]
      }).then(response => {
        if (response) {
          let result = response.datalist;
          this.$store.state.decorateStyleList = this.supplement.concat(result);
        }
      });
      this.$store.state.decorateFalg = true; // 让风格下拉列表选中刷新
      this.$store.state.decorateStyleShow = true; // 让风格下拉列表收起来
      this.initScroll();
    },
    // 选择布局
    selLayout(index) {
      if (this.curLayout === index) {
        this.isCreate = false;
        this.curLayout = -1;
      } else {
        this.isCreate = true;
        this.curLayout = index;
        this.templateId = this.$store.state.result.spaces[index].spaceId;
      }
    },
    // 风格箭头
    selSpace() {
      this.count++;
      let roate = 180 * this.count;
      this.$refs.navArrow.style.transform = "rotate(" + roate + "deg)";
      if (this.count % 2 == 0) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    // 选择风格
    selNav(index) {
      this.curIndex = index;
      this.isShow = false;
      this.count = 1;
      this.$refs.navArrow.style.transform = "rotate(180deg)";
      if (index == 0) {
        sessionStorage.setItem("styleId", "");
      } else {
        sessionStorage.setItem(
          "styleId",
          this.$store.state.decorateStyleList[index].id
        );
      }
      this.initScroll();
    },
    showLargePic(index) {
      this.isShowLargePic = true;
      this.largePicSrc = this.data[index].coverPath;
      this.viewIndex = index;
    },
    close() {
      this.isShowLargePic = false;
    },
    // 一键装修
    createView(index) {
      if (this.isCreate) {
        let el = document.getElementsByClassName("item"),
          houseTypeName = el[index].getAttribute("houseTypeName");
        this.$store.state.fullView.fullViewTitle = houseTypeName;
        this.sourcePlanId = this.data[index].planRecommendedId;
        this.API.getResRenderPicWeb({
          sourcePlanId: this.sourcePlanId,
          templateId: this.templateId,
          renderingType: this.renderingType
        }).then(response => {
          if (response) {
            if (response.obj === "") {
              this.$store.commit("popupMsg", "当前风格没有720°全景");
              this.$store.commit("showPopup");
              return;
            }
            this.$store.dispatch("returnView", response.obj);
            this.$store.state.fullView.fullViewId = this.sourcePlanId;
            this.$store.state.fromPath = "";
            this.$router.push("/fullView");
          }
        });
      } else {
        this.$store.commit("popupMsg", "请先选择布局！");
        this.$store.commit("showPopup");
      }
    },
    // 一键装修（大图）
    createViewFromBigPic() {
      if (this.isCreate) {
        let el = document.getElementsByClassName("item"),
          houseTypeName = el[this.viewIndex].getAttribute("houseTypeName");
        this.$store.state.fullView.fullViewTitle = houseTypeName;
        this.sourcePlanId = this.data[this.viewIndex].planRecommendedId;
        this.API.getResRenderPicWeb({
          sourcePlanId: 85989,
          templateId: 7662,
          renderingType: this.renderingType
        }).then(response => {
          if (response) {
            if (response.obj === "") {
              this.$store.commit("popupMsg", "当前风格没有720°全景");
              this.$store.commit("showPopup");
              return;
            }
            this.$store.dispatch("returnView", response.obj);
            this.$store.state.fullView.fullViewId = this.sourcePlanId;
            this.$store.state.fromPath = "";
            this.$router.push("/fullView");
          }
        });
      } else {
        this.$store.commit("popupMsg", "请先选择布局！");
        this.$store.commit("showPopup");
      }
    }
  },
  computed: mapState({
    resourcesUrl: state => state.resourcesUrl,
    loadfailTxt: state => state.loadfailTxt,
    loadingFlag: state => state.loadingFlag,
    decorateStyleList: state => state.decorateStyleList,
    decorateTipArr: state => state.decorateTipArr,
    spaces: state => state.result.spaces
  })
};
</script>

<style lang="scss">
@import "styles/mixin.scss";

@media all and (min-width: 768px) {
  .landscape-wrapper {
    display: none;
  }
}

@media all and (min-width: 1024px) {
  .landscape-wrapper {
    display: block;
    width: 100%;
  }

  .landscape-wrapper .header {
    line-height: 44px;
    text-align: center;
    height: 44px;
    background: #f8f8f8;
    position: relative;
  }

  .landscape-wrapper .header:after {
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #ddd;
    content: "";
  }

  .landscape-wrapper .header .goback {
    width: 12.5px;
    height: 20.5px;
    position: absolute;
    left: 17px;
    top: 12px;
    background-size: 12.5px 20.5px;
    background-image: url("./images/back_nor.png");
  }

  .landscape-wrapper .header .goback:active {
    background-image: url("./images/back_pre.png");
  }

  .landscape-wrapper .header .ipad-title {
    display: block;
    width: 256px;
    margin: 0 auto;
    font-size: 16px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .landscape-wrapper .content {
    display: flex;
    position: absolute;
    top: 44px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  .landscape-wrapper .content .left-wrap {
    position: relative;
    flex: 0 0 301px;
    margin-top: 26px;
    width: 301px;
    border-right: 1px solid #d5d5d5;
  }

  .landscape-wrapper .content .left-wrap .tip-wrapper {
    margin: 0 32px 10px 30px;
    width: 264px;
  }

  .landscape-wrapper .content .left-wrap .tip-wrapper .tip {
    font-size: 0;
  }

  .landscape-wrapper .content .left-wrap .tip-wrapper .tip .tip-item {
    display: inline-block;
    box-sizing: border-box;
    margin: 5px;
    width: 70px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #333;
    font-size: 12px;
    border: 1px solid #d5d5d5;
    border-radius: 2px;
  }

  .landscape-wrapper .content .left-wrap .tip-wrapper .tip .active-tip {
    color: #fff;
    background-color: #eaa641;
  }

  .landscape-wrapper .content .left-wrap .layout-wrap {
    position: relative;
    margin: 0 37px 25px 35px;
    width: 230px;
    height: 100%;
    overflow: hidden;
  }

  .landscape-wrapper .content .left-wrap .layout-wrap .layout-wrapper {
    position: absolute;
    top: 0;
    bottom: 30px;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  .landscape-wrapper
    .content
    .left-wrap
    .layout-wrap
    .layout-wrapper
    .layout
    .layout-item {
    box-sizing: border-box;
    margin-top: 15px;
    width: 230px;
    height: 170px;
    border: 1px solid #eaeaea;
  }

  .landscape-wrapper
    .content
    .left-wrap
    .layout-wrap
    .layout-wrapper
    .layout
    .layout-item
    .layout-pic {
    width: 100%;
    height: 100%;
  }

  .landscape-wrapper
    .content
    .left-wrap
    .layout-wrap
    .layout-wrapper
    .layout
    .active-layout {
    border: 3px solid #eaa431;
  }

  .landscape-wrapper .content .right-wrap {
    position: relative;
    flex: 1;
    top: 0;
    margin-top: 37px;
  }

  .landscape-wrapper .content .right-wrap .top-wrap {
    margin: 0 22px;
    height: 36px;
  }

  .landscape-wrapper .content .right-wrap .top-wrap .hint-item {
    float: left;
    height: 36px;
  }

  .landscape-wrapper .content .right-wrap .top-wrap .hint-item .text {
    display: block;
    font-size: 16px;
    color: #333;
  }

  .landscape-wrapper .content .right-wrap .top-wrap .space-item {
    float: left;
    height: 36px;
  }

  .landscape-wrapper .content .right-wrap .top-wrap .space-item .nav-text {
    display: block;
    float: left;
    vertical-align: 1;
    font-size: 16px;
    color: #999;
  }

  .landscape-wrapper .content .right-wrap .top-wrap .space-item .nav-arrow {
    display: block;
    float: left;
    margin-top: -10px;
    width: 36px;
    height: 36px;
    background-image: url("./images/arrow.png");
    background-size: 36px 36px;
    transform: rotate(180deg);
  }

  .landscape-wrapper .content .right-wrap .mid-wrap {
    position: absolute;
    top: 36px;
    left: 18.5px;
    right: 18.5px;
    bottom: 30px;
    overflow: hidden;
  }

  .landscape-wrapper .content .right-wrap .mid-wrap .mid {
    font-size: 0;
  }

  .landscape-wrapper .content .right-wrap .mid-wrap .mid .item {
    display: inline-block;
    margin: 18.5px;
    width: 300px;
    height: 259px;
    background-color: #fcfcfc;
  }

  .landscape-wrapper .content .right-wrap .mid-wrap .mid .item .pic {
    display: block;
    width: 100%;
    height: 168px;
  }

  .landscape-wrapper .content .right-wrap .mid-wrap .mid .item .info-wrap {
    position: relative;
    width: 100%;
    height: 91px;
  }

  .landscape-wrapper
    .content
    .right-wrap
    .mid-wrap
    .mid
    .item
    .info-wrap
    .address {
    display: block;
    padding-top: 10px;
    margin-left: 10px;
    line-height: 15px;
    font-size: 15px;
    color: #333;
  }

  .landscape-wrapper .content .right-wrap .mid-wrap .mid .item .info-wrap .btn {
    display: block;
    position: absolute;
    right: 12px;
    top: 25px;
    width: 75px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    font-family: PingFang-SC-Bold;
    font-size: 12px;
    color: #fff;
    background-color: #eaa641;
  }

  .landscape-wrapper .content .right-wrap .mid-wrap .space-nav-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #fcfcfc;
  }

  .landscape-wrapper
    .content
    .right-wrap
    .mid-wrap
    .space-nav-wrapper.dropdown-enter-active,
  .landscape-wrapper
    .content
    .right-wrap
    .mid-wrap
    .space-nav-wrapper.dropdown-leave-active {
    transition: all 0.2s linear;
  }

  .landscape-wrapper
    .content
    .right-wrap
    .mid-wrap
    .space-nav-wrapper.dropdown-enter,
  .landscape-wrapper
    .content
    .right-wrap
    .mid-wrap
    .space-nav-wrapper.dropdown-leave-active {
    top: -100px;
  }

  .landscape-wrapper
    .content
    .right-wrap
    .mid-wrap
    .space-nav-wrapper
    .space-nav {
    margin: 8px 7px;
    font-size: 0;
  }

  .landscape-wrapper
    .content
    .right-wrap
    .mid-wrap
    .space-nav-wrapper
    .space-nav
    .nav-item {
    display: inline-block;
    overflow: hidden;
    margin: 4px 4px;
    width: 70px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color: #333;
    background-color: #fff;
    border: 1px solid #d5d5d5;
    border-radius: 2px;
  }

  .landscape-wrapper
    .content
    .right-wrap
    .mid-wrap
    .space-nav-wrapper
    .space-nav
    .active-nav {
    color: #fff;
    background-color: #eaa641;
  }

  .large-pic-wrapper {
    display: relative;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    opacity: 1;
    overflow: auto;
    background: rgba(7, 17, 27, 0.7);
  }

  .large-pic-wrapper.fade-enter-active,
  .large-pic-wrapper.fade-leave-active {
    transition: all 0.5s;
  }

  .large-pic-wrapper.fade-enter,
  .large-pic-wrapper.fade-leave-active {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }

  .large-pic-wrapper .large-pic-item {
    position: relative;
    width: 850px;
    height: 643px;
    border-radius: 5px;
    background-color: #fff;
  }

  .large-pic-wrapper .large-pic-item .large-pic {
    display: block;
    width: 790px;
    height: 502px;
    margin: 45px 30px 28px 30px;
  }

  .large-pic-wrapper .large-pic-item .close {
    position: absolute;
    top: 14px;
    right: 14px;
    display: block;
    width: 18px;
    height: 18px;
    background-image: url("./images/close.png");
    background-size: 18px 18px;
  }

  .large-pic-wrapper .large-pic-item .large-pic-btn {
    display: block;
    margin: 0 auto;
    text-align: center;
    line-height: 40px;
    width: 125px;
    height: 40px;
    font-size: 16px;
    color: #fff;
    border-radius: 2px;
    background-color: #eaa641;
  }
}
</style>
