<template>
  <div>
    <div class="header-box">
      <div class="type-header">
        <span class="goback" @click="goSearch"></span>
        <span class="type-text">{{shapeTxt}}</span>
      </div>
    </div>
    <div class="nav-wrapper">
      <div class="nav-text" :class="activeFlag ? 'nav-textActive' : ''" @touchstart="showNav" v-if="shapeFlag">{{shapeTitle}}</div>
      <img class="shapeState" :src="resourcesUrl + shapeUrl" alt="" @touchstart="showNav" v-else>
      <div class="nav-sign" :class="activeFlag ? 'nav-signActive' : ''" @touchstart="showNav"></div>
    </div>
    <transition name="dropdown">
      <div class="sel-wrapper" v-if="activeFlag">
        <div class="nav-header"></div>
        <div class="img-sel clearfix">
          <div class="img-wrapper" v-for="(item, index) in shapeList" @click="selShape(index)" :key="index">
            <img v-lazy="resourcesUrl + item.picPath">
          </div>
          <span class="shape-text img-wrapper" @click.self="selShape(-1)">全部</span>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="nav-shade" v-if="activeFlag"></div>
    </transition>
    <scroll class="wrapper house-show"
            :data="data"
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @pullup="loadData">
      <ul class="house-wrapper shape-wrapper">
        <li class="house-item" v-for="(item,index) in data" :id="item.id" :key="index">
          <img v-lazy="resourcesUrl + item.viewPlanSmallPath" @click="goDecorate(index)">
          <span class="text">{{item.spaceName + item.spaceCode}}</span>
          <div class="details" @click="showBigImage(index,$event)" :class="largeIndex == index ? 'activeDetails' : ''"></div>
        </li>
        <div class="loading-wrapper">{{loadEnd}}</div>
      </ul>
    </scroll>
    <loading v-if="loadingFlag"></loading>
    <transition name="fade">
      <div class="popup" v-if="bigImageShow">
        <div class="size-image">
          <v-touch
            @pinchout="Pinchout"
            @pinchin="Pinchin"
            class="image-wrapper">
            <img class="img-show" :src="resourcesUrl + viewPlanPath" alt="" ref="shapeLargeImg"
            :style="'transform:scale(' + scale + ', ' + scale + ') rotate(90deg);left: ' + imgLeft + 'px;top: ' + imgTop + 'px;width:' + bigWidth + 'px;height:' + bigHeight + 'px'"
            @touchstart="slideStart($event)"
            @touchmove="slideFlag ? slideMove($event) : ''"
            @touchend="slideEnd"
            >
          </v-touch>
          <div class="close" @click="close"></div>
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
      activeFlag: false,
      shapeFlag: true,
      shapeUrl: "",
      shapeTitle: "形状",
      aShape: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"], // 形状对应的参数数组
      supplement: [{ name: "全部", value: "" }], // 补全全部选项按钮
      viewPlanPath: "",
      data: [],
      pullup: true,
      beforeScroll: true,
      page: 0, // 分页数
      loadEnd: "",
      spaceId: 0,
      planName: [],
      largeIndex: -1,
      scale: 1,
      imgWidth: 0,
      imgHeight: 0,
      imgLeft: 0,
      imgTop: 0,
      slideFlag: false,
      tempX: 0,
      tempY: 0,
      endX: 0,
      endY: 0,
      currentLeft: 0,
      currentTop: 0,
      distanceX: 0,
      distanceY: 0,
      lastClickTime: 0, // 第二次点击的时间
      bigWidth: 0,
      bigHeight: 0
    };
  },
  activated() {
    if (this.$store.state.shapeTitleFlag) {
      this.shapeTitle = "形状";
      this.shapeFlag = true;
    }
    if (this.$store.state.initLoad) {
      this.initScroll();
      this.$store.state.initLoad = false;
    }
    this.largeIndex = -1;
  },
  methods: {
    showNav() {
      this.activeFlag = !this.activeFlag;
    },
    selShape(index) {
      this.shapeFlag = false;
      this.activeFlag = !this.activeFlag;
      if (index < 0) {
        this.shapeFlag = true;
        this.shapeTitle = "全部";
        sessionStorage.setItem("spaceShape", "");
      } else {
        this.shapeUrl = this.$store.state.shapeList[index].picPath;
        sessionStorage.setItem(
          "spaceShape",
          this.$store.state.shapeList[index].value
        );
      }
      this.initScroll();
    },
    clickTime() {
      var nowTime = new Date().getTime();
      if (nowTime - this.lastClickTime < 200) {
        this.lastClickTime = 0;
        this.doubleTap();
      } else {
        this.lastClickTime = nowTime;
      }
    },
    doubleTap() {
      this.imgLeft = -(this.bigWidth - screen.width) / 2;
      this.imgTop = (this.bigWidth - screen.width) / 2;
      this.scale = 1;
      this.slideFlag = false;
    },
    slideStart(e) {
      if (e.touches.length == 1) {
        // 一根手指的时候触发双击监听
        this.clickTime();
      }
      this.currentLeft = this.imgLeft;
      this.currentTop = this.imgTop;
      this.tempX = e.changedTouches[0].pageX;
      this.tempY = e.changedTouches[0].pageY;
      this.imgWidth =
        (this.$refs.typeLargeImg.getBoundingClientRect().width -
          this.$refs.typeLargeImg.width) /
        2;
      this.imgHeight =
        (this.$refs.typeLargeImg.getBoundingClientRect().height -
          this.$refs.typeLargeImg.height) /
        2;
    },
    slideMove(e) {
      if (e.touches.length == 2) {
        // 两个手指的时候阻止拖动
        return;
      }
      this.endX = e.changedTouches[0].pageX;
      this.endY = e.changedTouches[0].pageY;
      this.distanceX = this.endX - this.tempX;
      this.distanceY = this.endY - this.tempY;
      this.imgLeft = this.currentLeft + this.distanceX;
      this.imgTop = this.currentTop + this.distanceY;
      if (this.imgLeft > this.imgWidth) {
        if (this.distanceX > 0) {
          this.imgLeft = this.imgWidth;
        }
      } else if (
        this.imgLeft < -(this.imgWidth + (this.bigWidth - screen.width))
      ) {
        if (this.distanceX < 0) {
          this.imgLeft = -(this.imgWidth + (this.bigWidth - screen.width));
        }
      }
      if (this.imgTop > this.imgHeight) {
        if (this.distanceY > 0) {
          this.imgTop = this.imgHeight;
        }
      } else if (
        this.imgTop < -(this.imgHeight - (this.bigWidth - screen.width))
      ) {
        if (this.distanceY < 0) {
          this.imgTop = -(this.imgHeight - (this.bigWidth - screen.width));
        }
      }
    },
    slideEnd() {
      this.imgWidth =
        (this.$refs.typeLargeImg.getBoundingClientRect().width -
          this.$refs.typeLargeImg.width) /
        2;
      this.imgHeight =
        (this.$refs.typeLargeImg.getBoundingClientRect().height -
          this.$refs.typeLargeImg.height) /
        2;
      if (this.scale <= 1) {
        this.imgLeft = -(this.bigWidth - screen.width) / 2;
        this.imgTop = (this.bigWidth - screen.width) / 2;
        this.scale = 1;
        this.slideFlag = false;
      }
      if (this.imgLeft <= -(this.imgWidth + (this.bigWidth - screen.width))) {
        // 向左拉到底缩小放开
        this.imgLeft = -(this.imgWidth + (this.bigWidth - screen.width));
      } else if (this.imgLeft >= this.imgWidth) {
        this.imgLeft = this.imgWidth;
      }
      if (this.imgTop <= -(this.imgHeight - (this.bigWidth - screen.width))) {
        this.imgTop = -(this.imgHeight - (this.bigWidth - screen.width));
      } else if (this.imgTop >= this.imgHeight) {
        this.imgTop = this.imgHeight;
      }
    },
    Pinchout() {
      if (this.scale == 2.9999999999999973) {
        return;
      } else {
        this.scale += 0.05;
      }
      this.slideFlag = true;
    },
    Pinchin() {
      if (this.slideFlag) {
        if (this.scale == 0.39999999999999963) {
          return;
        } else {
          this.scale -= 0.05;
        }
      }
    },
    initScroll() {
      this.data = [];
      this.page = 0;
      this.loadEnd = "";
      this.loadData();
    },
    loadData() {
      if (this.loadEnd == "暂无数据" || this.loadEnd == "没有更多数据") {
        return;
      }
      let userId = localStorage.getItem("userId"), // 用户id
        spaceShape = sessionStorage.getItem("spaceShape") || "",
        start = 0; // 分页初始位置
      let token = localStorage.getItem("token");
      let pageStart = start + limit * this.page; // 上拉加载分页起始位置
      this.API.spaceType({
        spaceFunctionId: this.$store.state.search.spaceFunctionId,
        areaValue: this.$store.state.search.areaValue,
        spaceShape: spaceShape,
        msgId: userId,
        limit: limit,
        start: pageStart,
        token: token
      }).then(response => {
        if (response) {
          this.page++;
          let loadmore = response.datalist;
          if (response.totalCount == 0) {
            this.loadEnd = "暂无数据";
          } else if (response.totalCount <= 10 || loadmore.length == 0) {
            this.loadEnd = "没有更多数据";
          } else {
            this.loadEnd = "加载更多...";
          }
          this.data = this.data.concat(loadmore);
        }
      });
    },
    goSearch() {
      this.$router.push("/search/space");
      sessionStorage.setItem("spaceShape", "");
      this.$store.commit("showComComponents", true);
      setTimeout(
        function() {
          this.activeFlag = false;
        }.bind(this),
        600
      );
    },
    showBigImage(i, event) {
      this.bigWidth = document.body.clientHeight;
      this.bigHeight = document.body.clientWidth;
      this.imgLeft = -(this.bigWidth - screen.width) / 2;
      this.imgTop = (this.bigWidth - screen.width) / 2;
      if (!event._constructed) {
        return;
      }
      this.largeIndex = i;
      this.viewPlanPath = this.data[i].viewPlanPath;
      this.$store.commit("showBigImage");
    },
    close() {
      this.$store.commit("showBigImage");
      this.scale = 1;
      this.imgLeft = 0;
      this.imgTop = 0;
      this.slideFlag = false;
    },
    goDecorate(i) {
      this.spaceId = this.data[i].id;
      sessionStorage.setItem("houseId", this.spaceId);
      sessionStorage.setItem("spaceAreas", this.data[i].spaceAreas);
      let userId = localStorage.getItem("userId");
      let token = localStorage.getItem("token");
      // 空间列表请求数据
      this.API.newSpaceDesign({
        spaceCommonIdText: this.spaceId,
        msgId: userId,
        token: token
      }).then(response => {
        if (response.datalist.length !== 0) {
          this.$store.state.result.spaces = response.datalist;
          sessionStorage.setItem("houseType", this.data[i].spaceFunctionId);
          sessionStorage.setItem(
            "templateId",
            this.$store.state.result.spaces[0].id
          );
          sessionStorage.setItem(
            "areaValue",
            this.$store.state.result.spaces[0].spaceAreas
          ); // 样板房面积
          this.$store.state.decorateFalg = true;
          this.$store.state.initLoad = true;
          this.$router.push("/fastDecorate");
        } else {
          this.$store.commit("popupMsg", "当前布局不存在");
          this.$store.commit("showPopup");
          return;
        }
      });
    }
  },
  computed: mapState({
    serverUrl: state => state.serverUrl,
    resourcesUrl: state => state.resourcesUrl,
    bigImageShow: state => state.search.bigImageShow,
    shapeTxt: state => state.search.shapeTxt,
    loadingFlag: state => state.loadingFlag,
    shapeList: state => state.shapeList
  })
};
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";

.popup {
  display: flex;
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

.popup.fade-enter-active,
.popup.fade-leave-active {
  transition: all 0.2s;
}

.popup.fade-enter,
.popup.fade-leave-active {
  opacity: 0;
  background: rgba(7, 17, 27, 0);
}

.shape-wrapper {
  top: 162px;
}

.house-show {
  top: 162px;
}

.nav-wrapper {
  width: 100%;
  height: 74px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  z-index: 3;
}

.nav-wrapper .nav-text {
  font-size: 30px;
  color: #747474;
}

.nav-wrapper .nav-textActive {
  color: #ff6419;
}

.nav-wrapper .nav-sign {
  width: 22px;
  height: 14.000000000000002px;
  background-image: url("./images/down_nor.png");
  background-size: 100% 100%;
  margin-left: 10px;
}

.nav-wrapper .nav-signActive {
  background-image: url("./images/up_pre.png");
  transform: rotate(180deg);
}

.nav-wrapper .shapeState {
  width: 60px;
  height: 60px;
}

.sel-wrapper {
  position: absolute;
  top: 162px;
  width: 100%;
  z-index: 2;
  overflow: auto;
}

.sel-wrapper.dropdown-enter-active,
.sel-wrapper.dropdown-leave-active {
  transition: all 0.3s linear;
}

.sel-wrapper.dropdown-enter,
.sel-wrapper.dropdown-leave-active {
  top: -350px;
}

.sel-wrapper .sel {
  margin: 15px 35px;
  font-size: 0;
}

.sel-wrapper .sel .sel-item {
  display: block;
  float: left;
  margin: 11px 25px;
  width: 176px;
  height: 64px;
  line-height: 64px;
  text-align: center;
  font-size: 24px;
  color: #333;
  background-color: #fff;
  box-shadow: 0 2px 2px #aaa;
}

.sel-wrapper .sel .sel-item.current-sel {
  color: #fff;
  background-color: #ff6419;
}

.sel-wrapper .sel .sel-item:active {
  color: #fff;
  background-color: #ff6419;
}

.sel-wrapper .nav-header {
  height: 24px;
  background: #f6f6f6;
}

.sel-wrapper .img-sel {
  background-color: #fff;
}

.sel-wrapper .img-sel .img-wrapper {
  width: 180px;
  height: 60px;
  float: left;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f6f6;
  margin: 30px 35px;
}

.sel-wrapper .img-sel .img-wrapper img {
  display: block;
  width: 60px;
  height: 60px;
}

.sel-wrapper .img-sel .shape-text {
  display: inline-block;
  line-height: 60px;
  text-align: center;
  font-size: 28.000000000000004px;
}

.nav-shade {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}
</style>
