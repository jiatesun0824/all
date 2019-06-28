<template>
  <div class="space">
    <scroll class="wrapper"
            ref="spaceEl"
            :data="data"
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            :refreshFlag="refreshFlag"
            @pullup="loadData"
    >
      <ul class="house-wrapper shape-wrapper">
        <div class="space-wrapper">
          <div class="space-item">
            <span class="hint">所在空间</span>
            <span class="colon">:</span>
            <span class="text" @click="openType($event)">{{sTxt}}</span>
          </div>
          <div class="spacetype clearfix" v-if="spaceTypeFlag">
            <div class="spacetype-item"
            v-for="(item,index) in areaWrapper"
            @click="typeSelected(index, $event)"
            :key="index">{{item.name}}</div>
          </div>
          <div class="space-line"></div>
          <div class="space-item">
            <span class="hint">所在面积</span>
            <span class="colon">:</span>
            <span class="text" @click="openArea($event)">{{aTxt}}</span>
          </div>
          <div class="spacetype clearfix" v-if="spaceAreaFlag">
            <div class="spacetype-item"
            v-for="(item,index) in areaWrapper[typeIndex].area"
            @click="areaSelected(index, $event)"
            :key="index">{{item}}</div>
          </div>
          <div class="space-line"></div>
          <div class="space-item">
            <span class="hint">形&emsp;&emsp;状</span>
            <span class="colon">:</span>
            <div class="img-wrapper" @click="openShape($event)">
              <span class="all-text" v-if="isText">全部</span>
              <img v-lazy="require('../../images/' + shapeInitPath + '.png')" v-else>
            </div>
          </div>
          <div class="spacetype clearfix" v-if="spaceShapeFlag">
            <div class="spacetype-item img-wrapper"
            v-for="(item,index) in shapeList"
            @click="shapeSelected(index, $event)"
            :key="index">
              <div class="image-box">
                <img v-lazy="require('../../images/' + item.valuekey + '.png')" v-if="index < shapeList.length - 1" :valuekey="item.valuekey">
                <span v-else>{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <li class="house-item" v-for="(item,index) in data" :id="item.id" :key="index">
          <img v-lazy="resourcesUrl + item.viewPlanSmallPath" @click="goDecorate(index)">
          <span class="text">{{item.spaceName + item.spaceCode}}</span>
          <div class="details" @click="showBigImage(index,$event)"></div>
        </li>
        <div class="loading-wrapper">{{loadEnd}}</div>
      </ul>
    </scroll>
    <!--<transition name="fade">-->
      <!--<div class="popup" v-if="bigImageShow">-->
        <!--<div class="size-image">-->
          <!--<v-touch class="image-wrapper">-->
            <!--<img class="img-show" :src="resourcesUrl + viewPlanPath" alt="" ref="shapeLargeImg">-->
          <!--</v-touch>-->
          <!--<div class="close" @click="closeBigImage"></div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</transition>-->
    <transition name="fade">
      <div class="popup" v-show="bigImageShow">
        <div class="show-image-box">
          <div class="pinch-zoom">
            <img class="big-img" :src="resourcesUrl + viewPlanPath" alt="" ref="shapeLargeImg">
          </div>
          <div class="close" @click="closeBigImage"></div>
        </div>
      </div>
    </transition>
    <div class="spaceLoading" v-if="loadingFlag">
      <div class="loading-wrap">
        <img class="loading-img" :src="require('assets/images/loading.gif')">
        <span class="loading-msg">{{loadingMsg}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

const limit = 10;

export default {
  data() {
    return {
      pinchzoom: null, // 控制图片放大缩小
      viewPlanPath: "",
      supplement: { name: "全部", value: "" },
      loadingMsg: "载入中...",
      loadingFlag: false,
      spaceTypeFlag: false, // 空间类型的选择框显示
      spaceAreaFlag: false, // 空间面积的选择框显示
      spaceShapeFlag: false, // 空间形状的选择框显示
      shapeInitPath: "",
      showFlag: false,
      typeIndex: 0,
      areaIndex: 0,
      sTxt: "客餐厅",
      aTxt: "0~19",
      areaWrapper: [
        {
          name: "客餐厅",
          area: [
            "0~19",
            "20~24",
            "25~29",
            "30~34",
            "35~39",
            "40~44",
            "45~51",
            "52~61",
            "62~71",
            "72~81",
            "82~91",
            "92~101",
            "102~111",
            "112以上"
          ]
        },
        {
          name: "卧室",
          area: [
            "0~7",
            "8~12",
            "13~17",
            "18~22",
            "23~27",
            "28~32",
            "33~37",
            "38~42",
            "43~47",
            "48平方以上"
          ]
        },
        {
          name: "厨房",
          area: ["0~6", "7~9", "10~12", "13~15", "16~18", "19以上"]
        },
        {
          name: "卫生间",
          area: ["0~3", "4~7", "8~10", "11~12", "13~15", "19以上"]
        },
        {
          name: "书房",
          area: ["0~7", "8~12", "13~17", "18~22", "23以上"]
        },
        {
          name: "衣帽间",
          area: [
            "0~7",
            "8~12",
            "13~17",
            "18~22",
            "23~27",
            "28~32",
            "33~37",
            "38~42",
            "43~46",
            "47平方以上"
          ]
        }
      ],
      data: [],
      pullup: true,
      beforeScroll: true,
      page: 0, // 分页数
      loadEnd: "",
      typeList: [], // 空间类型集合
      areaList: [], // 空间面积集合
      bigWidth: 0, // 大图的宽
      bigHeight: 0, // 大图的高
      imgLeft: 0, // 大图的横坐标
      imgTop: 0, // 大图多点纵坐标
      isText: true,
      refreshFlag: false
    };
  },
  created() {
    this.$store.state.headerTxt = "户型";
    this.API.space().then(response => {
      if (response) {
        this.typeList = response.datalist;
        this.API.typeArea({
          houseType: this.typeList[0].valuekey
        }).then(response => {
          if (response) {
            this.areaList = response.datalist;
            this.loadData();
          }
        });
      }
    });
    this.API.getShape().then(response => {
      if (response) {
        this.$store.state.shapeList = response.datalist;
        this.$store.state.shapeList.push(this.supplement);
        sessionStorage.setItem("spaceShape", "");
        this.shapeInitPath = this.$store.state.shapeList[1].valuekey;
      }
    });
  },
  activated() {
    this.$refs.spaceEl.scrollTo(0, 0);
  },
  mounted() {
    $("div.pinch-zoom").each(function() {
      this.pinchzoom = new RTP.PinchZoom($(this), {});
    });
  },
  methods: {
    openType(event) {
      if (!event._constructed) {
        return;
      }
      this.spaceTypeFlag = !this.spaceTypeFlag;
      this.refreshFlag = !this.refreshFlag; // 刷新betterScroll
    },
    openArea(event) {
      if (!event._constructed) {
        return;
      }
      this.spaceAreaFlag = !this.spaceAreaFlag;
      this.refreshFlag = !this.refreshFlag; // 刷新betterScroll
    },
    openShape(event) {
      console.log()
      if (!event._constructed) {
        return;
      }
      this.spaceShapeFlag = !this.spaceShapeFlag;
      this.refreshFlag = !this.refreshFlag; // 刷新betterScroll
    },
    typeSelected(index, event) {
      this.sTxt = this.areaWrapper[index].name;
      this.aTxt = this.areaWrapper[index].area[0];
      this.typeIndex = index;
      this.API.typeArea({
        houseType: this.typeList[index].valuekey
      }).then(response => {
        if (response) {
          this.areaList = response.datalist;
          this.loadingFlag = true;
          this.initScroll();
        }
      });
      this.openType(event);
    },
    areaSelected(index, event) {
      this.aTxt = this.areaWrapper[this.typeIndex].area[index];
      this.areaIndex = index;
      this.openArea(event);
      this.loadingFlag = true;
      this.initScroll();
    },
    shapeSelected(index, event) {
      if (index == this.$store.state.shapeList.length - 1) {
        this.isText = true;
      } else {
        this.isText = false;
      }
      this.shapeInitPath = this.$store.state.shapeList[index].valuekey;
      sessionStorage.setItem(
        "spaceShape",
        this.$store.state.shapeList[index].value
      );
      this.openShape(event);
      this.loadingFlag = true;
      this.initScroll();
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
        spaceShape = sessionStorage.getItem("spaceShape"),
        start = 0; // 分页初始位置
      let token = localStorage.getItem("token");
      let pageStart = start + limit * this.page; // 上拉加载分页起始位置
      this.API.spaceType({
        spaceFunctionId: this.typeList[this.typeIndex].value,
        areaValue: this.areaList[this.areaIndex].value,
        spaceShape: spaceShape,
        msgId: userId,
        limit: limit,
        start: pageStart,
        token: token
      }).then(response => {
        if (response) {
          this.page++;
          this.loadingFlag = false;
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
    goDecorate(index) {
      this.$store.state.searchPath = "space";
      sessionStorage.setItem("searchPath", "space");
      this.spaceId = this.data[index].id;
      sessionStorage.setItem("houseId", this.spaceId);
      sessionStorage.setItem("spaceAreas", this.data[index].spaceAreas);
      sessionStorage.setItem(
        "houseNameArr",
        this.typeList[this.typeIndex].value
      );
      sessionStorage.setItem("areaName", this.sTxt);
      this.$store.state.search.bigImageShow = false; // 关闭大图
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
          sessionStorage.setItem(
            "resultSpaces",
            JSON.stringify(this.$store.state.result.spaces)
          );
          sessionStorage.setItem("houseType", this.data[index].spaceFunctionId);
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
          this.$store.commit("showComComponents", false);
          this.$router.push("/fastDecorate");
        } else {
          this.$store.commit("popupMsg", "当前布局不存在");
          this.$store.commit("showPopup");
          return;
        }
      });
    },
    showBigImage(index, event) {
      //        this.bigWidth = document.body.clientHeight;
      //        this.bigHeight = document.body.clientWidth;
      //        this.imgLeft = -(this.bigWidth - screen.width) / 2;
      //        this.imgTop = (this.bigWidth - screen.width) / 2;
      if (!event._constructed) {
        return;
      }
      this.$store.state.footerShow = false;
      this.largeIndex = index;
      this.viewPlanPath = this.data[index].viewPlanPath;
      this.$store.commit("showBigImage");
    },
    closeBigImage() {
      this.$store.commit("showBigImage");
      this.$store.state.footerShow = true;
    }
  },
  computed: mapState({
    comComponentsShow: state => state.comComponentsShow,
    resourcesUrl: state => state.resourcesUrl,
    shapeList: state => state.shapeList,
    bigImageShow: state => state.search.bigImageShow
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

.popup .show-image-box {
  width: 100%;
}

.popup .show-image-box .pinch-zoom,
.popup .show-image-box .pinch-zoom img {
  width: 100%;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
  user-drag: none;
}

.wrapper {
  position: absolute;
  width: 100%;
  top: 98px;
  bottom: 98px;
  overflow: hidden;
}

.wrapper .house-wrapper {
  width: 100%;
  padding: 10px;
  background: #fff;
}

.wrapper .house-wrapper .space-wrapper .space-line {
  position: relative;
}

.wrapper .house-wrapper .space-wrapper .space-line:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #eeeeee;
  content: "";
}

.wrapper .house-wrapper .space-wrapper .space-item {
  display: flex;
  font-size: 30px;
  height: 88px;
  line-height: 88px;
  padding: 0 30px;
  color: #494949;
  background: #fff;
}

.wrapper .house-wrapper .space-wrapper .space-item .hint {
  color: #747474;
}

.wrapper .house-wrapper .space-wrapper .space-item .colon {
  margin: 0 10px;
}

.wrapper .house-wrapper .space-wrapper .space-item .text {
  color: #333333;
  flex: 1;
  margin-left: 70px;
}

.wrapper .house-wrapper .space-wrapper .space-item .img-wrapper {
  display: flex;
  flex: 1;
  float: left;
  text-align: center;
  align-items: center;
}

.wrapper .house-wrapper .space-wrapper .space-item .img-wrapper .all-text {
  margin-left: 70px;
  font-size: 26px;
}

.wrapper .house-wrapper .space-wrapper .space-item .img-wrapper img {
  display: block;
  width: 39px;
  margin-left: 70px;
}

.wrapper .house-wrapper .space-wrapper .spacetype {
  font-size: 26px;
  padding: 15px 60px;
  margin: 0 -10px;
  background: #f8f8fa;
}

.wrapper .house-wrapper .space-wrapper .spacetype .spacetype-item {
  width: 180px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-radius: 30px;
  float: left;
  margin: 15px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper .house-wrapper .space-wrapper .spacetype .img-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper .house-wrapper .space-wrapper .spacetype .img-wrapper .image-box img {
  display: block;
  width: 39px;
}

.wrapper .house-wrapper .house-item {
  float: left;
  width: 345px;
  margin: 10px;
  position: relative;
}

.wrapper .house-wrapper .house-item img {
  width: 345px;
  height: 248px;
  border: 1px solid #eeeeee;
}

.wrapper .house-wrapper .house-item .text {
  display: block;
  font-size: 24px;
  height: 40px;
  line-height: 40px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 5px 0 20px;
  padding-right: 50px;
}

.wrapper .house-wrapper .house-item .details {
  position: absolute;
  top: 0;
  right: 0;
  width: 48px;
  height: 48px;
  background-size: 48px;
  background-image: url("../../images/search_nor.png");
}

.selarea {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: #f8f8f8;
}

.selarea .selarea-wrapper {
  width: 100%;
  height: 100%;
}

.selarea .selarea-wrapper .area-header {
  width: 100%;
  text-align: 0;
  height: 86px;
  font-size: 36px;
  background: #fff;
  color: #494949;
  line-height: 86px;
  display: 70px;
  justify-content: center;
  align-items: center;
  position: relative;
}

.selarea .selarea-wrapper .area-header .goArea {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  height: 41px;
  background-size: 25px 41px;
  background-image: url("../../images/back_nor.png");
}

.selarea .selarea-wrapper .area-header .headTxt {
  margin: 0 auto;
  font-weight: 600;
}

.selarea .selarea-wrapper .area-wrapper {
  position: absolute;
  top: 112.00000000000001px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  background: #fff;
  font-size: 30px;
  overflow: hidden;
}

.selarea .selarea-wrapper .area-wrapper .content li {
  text-align: 112.00000000000001px;
  height: 80px;
  font-size: 30px;
  line-height: 80px;
  margin: 0 30px;
  border-bottom: 1px solid #eee;
}

.selarea .selarea-wrapper .area-wrapper .content .end-li {
  margin: 0;
  padding: 0 30px;
}

.search-btn {
  display: block;
  width: 600px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 36px;
  color: #fff;
  background-color: #ff6419;
  border-radius: 10px;
  margin: 42px auto;
  border-radius: 50px;
}

.spaceLoading {
  position: absolute;
  left: 0;
  top: 380px;
  width: 100%;
  bottom: 98px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: 70px;
  z-index: 999;
  background: #eee;
}

.spaceLoading .loading-wrap .loading-img {
  display: block;
  width: 50px;
  height: 50px;
  margin: 0 auto;
}

.spaceLoading .loading-wrap .loading-msg {
  padding: 20px;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 24px;
}
</style>
