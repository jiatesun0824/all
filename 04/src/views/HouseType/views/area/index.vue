<template>
  <div class="area">
    <scroll class="wrapper"
            ref="areaEl"
            :data="data"
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @pullup="loadData">
      <div class="area-outer-sphere">
        <div class="area-wrapper">
          <div class="area-item">
            <span class="hint">所在地区</span>
            <span class="colon">:</span>
            <span class="text">
              <span class="province" @click="openProvince">{{provinceName}}</span><span>丨</span><span class="city" @click="openCity">{{cityName}}</span>
            </span>
          </div>
          <div class="area-line"></div>
          <div class="area-item">
            <span class="hint">所在小区</span>
            <span class="colon">:</span>
            <input type="text" class="inputText" v-model="livingName" maxlength="30" ref="inputText">
          </div>
        </div>
        <a href="javascript:;" class="search-btn" @click="search" @touchend="hideKeyboard">搜索</a>
        <div class="set-house-item clearfix">
          <span class="tip">没有找到户型?<i class="set-house" @click="toSetHouse">上传户型</i></span>
        </div>
        <div class="result-wrapper" v-show="resultFlag">
          <div class="result-header">共搜索到{{totalCount}}个小区</div>
          <div class="result-box">
            <ul class="result-content">
              <li class="result-part"
                v-for="(item,index) in data"
                @click="goHouseType(index,$event)"
                :class="resultIndex == index ? 'activeChange' : ''"
                :key="index">
                <span class="left-text">{{item.livingName}}</span>
                <span class="right-text">{{item.houseCount}}个户型</span>
                <div class="bottom-line"></div>
              </li>
              <div class="loading-wrapper">{{loadEnd}}</div>
            </ul>
            <loading v-if="loadingFlag"></loading>
          </div>
        </div>
      </div>
    </scroll>
    <transition name="fade">
      <selarea v-if="selareaFlag"></selarea>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";
import { bus } from "api/api.js";

const limit = 10;

export default {
  data() {
    return {
      resultScroll: "",
      resultFlag: false,
      livingName: "",
      searchResult: [],
      totalCount: 0,
      data: [],
      pullup: true,
      beforeScroll: true,
      page: 0, // 分页数
      loadEnd: "",
      selIndex: -1,
      resultIndex: -1,
      initload: true
    };
  },
  created() {
    this.$store.state.headerTxt = "户型";
    bus.$on("hideSearchResult", () => {
      this.livingName = "";
      this.resultFlag = false;
    });
  },
  activated() {
    this.$refs.areaEl.scrollTo(0, 0);
  },
  methods: {
    hideKeyboard() {
      this.$refs.inputText.blur();
    },
    toSetHouse() {
      this.$router.push("/sethouse");
      this.$store.state.comComponentsShow = false;
      this.$store.state.contentFlag = false;
    },
    activePop(i) {
      // 省市区选择高亮
      this.selIndex = i;
    },
    initScroll() {
      this.data = [];
      this.page = 0;
      this.loadEnd = "";
      this.loadData();
    },
    openProvince() {
      this.$store.commit("showComComponents", false);
      // this.$store.state.comeFromPlan = false;
      this.$store.state.contentFlag = true;
      this.$store.state.selareaFlag = true;
    },
    openCity() {
      this.$store.commit("showComComponents", false);
      // this.$store.state.comeFromPlan = false;
      this.$store.state.contentFlag = false;
      this.$store.state.selareaFlag = true;
    },
    search() {
      if (this.livingName == "") {
        this.$store.state.popupMsg = "请输入小区名!";
        this.$store.commit("showPopup");
        return;
      }
      if (this.initload) {
        this.initScroll();
        this.initload = false;
      }
      this.$store.state.loadingFlag = true;
      this.resultFlag = true;
      this.resultIndex = -1;
      this.$store.state.searchPath = "area";
    },
    goHouseType(i, event) {
      this.resultIndex = i;
      if (!event._constructed) {
        return;
      }
      this.$store.state.search.houseTxt = this.data[i].livingName;
      sessionStorage.setItem(
        "searchHouseTxt",
        this.$store.state.search.houseTxt
      );
      sessionStorage.setItem("livingId", this.data[i].livingId); // 保存在本地让户型页面加载更多时调用
      this.$store.state.comComponentsShow = false;
      this.$store.state.search.bigImageShow = false;
      this.$store.state.initLoad = true; // 是否重新加载
      this.$router.push("/typechange");
    },
    loadData() {
      if (this.loadEnd == "暂无数据" || this.loadEnd == "没有更多数据") {
        this.initload = true;
        return;
      }
      let userId = localStorage.getItem("userId"), // 用户id
        start = 0; // 分页初始位置
      let pageStart = start + limit * this.page; // 上拉加载分页起始位置
      let token = localStorage.getItem("token");
      this.API.houseType({
        provinceCode: sessionStorage.getItem("provinceCode"),
        cityCode: sessionStorage.getItem("cityCode"),
        livingName: this.livingName,
        msgId: userId,
        limit: limit,
        start: pageStart,
        token: token
      }).then(response => {
        if (response) {
          this.totalCount = response.totalCount;
          this.page++;
          let loadmore = response.datalist;
          if (loadmore.length == 0) {
            this.loadfailFlag = true;
            this.initload = true;
            return;
          } else if (loadmore.length < 10 || loadmore.length == 0) {
            this.loadEnd = "没有更多数据";
          } else {
            this.loadEnd = "加载更多...";
          }
          this.data = this.data.concat(loadmore);
          if (this.data.length - response.totalCount == 0) {
            this.loadEnd = "没有更多数据";
          }
          this.initload = true;
        }
      });
    }
  },
  computed: mapState({
    comComponentsShow: state => state.comComponentsShow,
    comeFromPlan: state => state.comeFromPlan,
    loadingFlag: state => state.loadingFlag,
    selareaFlag: state => state.selareaFlag,
    provinceName: state => state.provinceName,
    cityName: state => state.cityName
  })
};
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";

.area .wrapper {
  position: absolute;
  width: 100%;
  top: 98px;
  bottom: 98px;
  overflow: hidden;
}

.area .wrapper .area-outer-sphere .result-wrapper .result-header {
  font-size: 24px;
  color: #8e8e8e;
  padding: 0 0 30px 30px;
}

.area .wrapper .area-outer-sphere .result-wrapper .result-box {
  min-height: 650px;
  position: relative;
}

.area .wrapper .area-outer-sphere .result-wrapper .result-box .result-content {
  background: #fff;
}

.area
  .wrapper
  .area-outer-sphere
  .result-wrapper
  .result-box
  .result-content
  .result-part {
  padding-left: 30px;
  height: 90px;
  color: #494949;
  font-size: 30px;
  line-height: 90px;
}

.area
  .wrapper
  .area-outer-sphere
  .result-wrapper
  .result-box
  .result-content
  .result-part
  .left-text {
  display: block;
  width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  float: left;
}

.area
  .wrapper
  .area-outer-sphere
  .result-wrapper
  .result-box
  .result-content
  .result-part
  .right-text {
  font-size: 24px;
  float: right;
  font-weight: normal;
  color: #8e8e8e;
  margin-right: 30px;
  display: block;
  float: right;
}

.area
  .wrapper
  .area-outer-sphere
  .result-wrapper
  .result-box
  .result-content
  .result-part
  .bottom-line {
  position: relative;
}

.area
  .wrapper
  .area-outer-sphere
  .result-wrapper
  .result-box
  .result-content
  .result-part
  .bottom-line:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #eeeeee;
  content: "";
}

.area .search-btn {
  display: block;
  width: 690px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 36px;
  color: #fff;
  background-color: #ff6419;
  margin: 42px auto;
  border-radius: 50px;
}

.area .set-house-item {
  margin-top: 40px;
  margin-right: 30px;
}

.area .set-house-item .tip {
  display: block;
  font-size: 24px;
  color: #999;
  float: right;
}

.area .set-house-item .set-house {
  display: inline-block;
  padding: 10px;
  font-size: 24px;
  color: #ff6419;
}

.area .area-wrapper .area-line {
  margin-left: 30px;
  position: relative;
}

.area .area-wrapper .area-line:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #eeeeee; /*no*/
  content: "";
}

.area .area-wrapper .area-item {
  display: flex;
  font-size: 30px;
  height: 88px;
  line-height: 88px;
  padding: 0 30px;
  color: #494949;
  background: #fff;
}

.area .area-wrapper .area-item .hint {
  color: #747474;
}

.area .area-wrapper .area-item .colon {
  margin: 0 10px;
}

.area .area-wrapper .area-item .text {
  color: #333333;
  font-size: 30px;
}

.area .area-wrapper .area-item .text .province {
  margin: 0 50px;
}

.area .area-wrapper .area-item .text .city {
  margin-left: 50px;
}

.area .area-wrapper .area-item .inputText {
  font-size: 30px;
  margin-left: 50px;
}

.area .activeChange {
  background: #f6f6f6;
}
</style>
