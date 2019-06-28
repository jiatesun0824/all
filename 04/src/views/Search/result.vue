<template>
<div class="list">
  <div class="main-tab">
    <!-- tab 开始 -->
    <div class="search-box relative">
      <div class="cancle" @click="$router.back()">
        <img src="./images/nav_icon_back_black.png">
      </div>
      <div class="search-content relative">
        <i class="search-icon"></i>
        <div id="search-form">
          <input class="search-text needsclick" v-model="searchText" type="search" @keyup.13="searchSubmit"/>
        </div>
        <!-- <form action="javascript:return true;">
        </form> -->
      </div>
      <span class="divider divider-horizontal divider-bottom"></span>
    </div>
    <!-- tab 结束 -->
    <!-- 下拉tab开始 -->
    <div class="nav-wraper">
      <div class="type-box">
        <div class="type-nav relative" v-for="(item, index) in tabBarData.tabList" :key="index" @click.stop = "openNav(index)">
          <div class="nav-box" :class="{'active': tabBarData.tabIndex == index && navData.navFlag}">
            <span class="nav-title">{{item}}</span>
            <span :class="index !== tabBarData.tabList.length - 1 ? 'arrow' : 'sort-arrow'"></span>
          </div>
          <span class="short-line"></span>
        </div>
      </div>
    </div>
    <!-- 下拉tab结束 -->

    <!-- 下拉框 star -->
    <div class="sel-box">
      <!-- 城市选择 开始 -->
      <transition name="dropdown">
        <drop-down-city-seletor @comfirm="comfirm" :refresh="tabBarData.tabIndex== 0 && navData.navFlag" v-show="tabBarData.tabIndex== 0 && navData.navFlag"/>
      </transition>
      <!-- 城市选择 结束 -->

      <!-- 所有分类 开始  -->
      <transition name="dropdown">
          <div class="sel-wrapper" v-show="tabBarData.tabIndex == 1 && navData.navFlag">
              <div class="sel-province-city sel-auto-height clearfix">
                  <scroll :listenScroll = "listenScroll"
                      :probeType = "probeType"
                      :pullup = "true"
                      :beforeScroll = "true"
                      :scrollX = "true" 
                      :refreshScroll = "true" 
                      :data="secCategoryData.allCategoryDataList"
                      class="sel-city left">
                      <div>
                          <div>
                              <div class="city-item text-center relative" v-for ="(item, index) in secCategoryData.allCategoryDataList" :key="index" @click="openCategory(item, index)" :class="{'active': secCategoryData.categoryIndex === index}">
                                  {{item.name}}
                              </div>
                          </div>
                      </div>
                  </scroll>
                  <scroll :listenScroll = "listenScroll"
                      :probeType = "probeType" :pullup = "true"
                      :beforeScroll = "true"
                      :scrollX = "true"
                      :refreshScroll = "true"
                      :data="secCategoryData.allCategorySmallDataList"
                      class="sel-area left">
                      <div>
                          <div class="area-box">
                              <div class="area-item text-center" :class="{'active': secCategoryData.smallCategoryIndex == (index - 1), 'scale-min': 
                              item.name.length > 5}"  v-for="(item, index) in secCategoryData.allCategorySmallDataList" :key="index" @click="selCategory(item, index)">
                                  {{item.name}}
                              </div>
                          </div>
                      </div>
                  </scroll>
              </div>
          </div>
      </transition>
      <!-- 所有分类 开始  -->

      <!-- 角色选择 开始 -->
      <transition name="dropdown">
          <div class="sel-wrapper" v-show="tabBarData.tabIndex == 2 && navData.navFlag">
              <div class="sel clearfix">
                  <div class="sel-item" v-for="(item, index) in publisherData.roleList" :class="{'current-sel': publisherData.roleIndex === index}" :key="index" @click="roleSecCategory(item, index)">{{item.name}}</div>
              </div>
          </div>
      </transition>
      <!-- 角色选择 结束 -->

      <!-- 排序开始 -->
      <transition name="dropdown">
          <div class="sel-sort-box text-center sel-wrapper" v-show="tabBarData.tabIndex == 3 && navData.navFlag">
              <div class="sort-item relative" :class="{'active' : sortIndex == index}" v-for="(item, index) in ['时间', '人气']" :key="index" @click="selSortTab(index)">{{item}}</div>
          </div>
      </transition>
      <!-- 排序结束 -->
    </div>
    <!-- 下拉框 end -->
  </div>
  <div class="main-content">
    <scroll class="wrapper" :listenScroll = "listenScroll"
      :probeType = "probeType"
      :pullup = "true"
      :beforeScroll = "true"
      :scrollX = "true" 
      :refreshScroll = "true"  
      :data="listData"
      ref = "wrapperScroll" v-if="listData">
      <div class="list-view relative">
        <!-- list-box star-->
        <div class="list-box">
          <supply-item v-for="(item, index) in listData" :item="item" :key="index"></supply-item>
        </div>
        <!-- list-box end-->
      </div>
    </scroll>

    <!-- 条件无数据 -->
    <div class="recommend" v-if="!listData && recommendData">
      <div class="empty-list">
        <img src="./images/list_icon_empty.png" />
        <p>此处没有更多消息</p>
      </div>
      <div class="recommend-content">
        <p class="recommend-head">为您推荐</p>
        <div class="recommend-list">
          <scroll beforeScroll pullup :data="recommendData" @scrollToEnd="loadMoreRecommend">
            <div class="list-content" v-load-more="!isAllRecommendData" v-all-loaded="isAllRecommendData">
              <div class="list-box">
                <supplyItem v-for = "(item, index) in recommendData" :item="item" :key="index"/>
              </div>
            </div>
          </scroll>
        </div>
      </div>
    </div>

    <!-- 所有数据为空 -->
    <div class="no-content text-center" v-if="!listData && !recommendData">
      <img src="./images/list_icon_empty.png" />
      <p>此处没有更多消息</p>
    </div>
  </div>

  <!-- 蒙层开始 -->
  <div class="mask" v-show="isShowMark" @click.self="handleSelBox(false)"></div>
  <!-- 蒙层结束 -->
</div>
</template>

<script>
import { mapActions, mapGetters } from "Vuex";
import mixins from "@/mixins/mixin";
import {
  getAllArea,
  getallsupplydemandcategory,
  getallsupplydemandRoles,
  getAllSupplyDemandInfo
} from "@/api/home";
import supplyItem from "components/supplyItem/index";
import dropDownCitySeletor from "components/DropDownCitySeletor/index";

export default {
  mixins: [mixins],
  data() {
    return {
      tabMainIndex: 0, //标识供应/需求index
      navData: {
        navFlag: false,
        cityNavFlag: false //标识[全国城市]下拉flag
      },
      cityIndex: -1, //标识下拉全国城市左tab
      selCityData: "", //全国城市右边数据
      selCountryData: [], //全国地区右边数据
      addressIndex: -1, //标识市区左tab
      tabBarData: {
        tabList: ["深圳", "类别", "发布者", "排序"], //tabBarData.tabList
        tabIndex: -1 //标识四个tab Index
      },
      isShowMark: false, //标识蒙层是否出现
      commitCountryData: [],
      provinceCode: "440000",
      cityCode: "440300",
      secCategoryData: {
        // 二级列表信息
        secCategoryList: [
          // 默认为不限
          {
            name: "不限",
            id: null
          }
        ],
        secCategoryIndex: 0,
        allCategoryDataList: [],
        allCategorySmallDataList: [],
        categoryIndex: 0,
        smallCategoryIndex: -1
      },
      listData: null,
      recommendData: [],
      recommendTotalCount: '',
      publisherData: {
        roleList: [],
        roleIndex: 0,
        roleText: undefined
      },
      sortIndex: 0,
      categorySmallId: this.$route.query.categorySmallId,
      categoryId: this.$route.query.categoryId,
      isSortByGmtModified: undefined,
      isSortByViewNum: undefined,
      allAreaData: [],
      localAreaData: [],
      hotSelCityData: [],
      usSelCityData: [],
      searchText: this.$route.query.keyName || '',
      keyName: this.$route.query.keyName,
      recommendStart: 0
    };
	},
	computed: {
		...mapGetters('search', ['selectArea']),
    ...mapGetters('citySelector', ['item']),
    isAllRecommendData() {
      return this.recommendData.length === this.recommendTotalCount
    }
	},
  methods: {
		...mapActions('search', ['setAreaCode']),
    searchSubmit() {
      this.keyName = this.searchText;
      this.dataReturnListData();
    },
    async dataReturnMain() {
      /**
       * 获取选择角色数据接口
       * type：1 供求
       */
      await new Promise(reslove => {
        getallsupplydemandRoles({ type: 1 }).then(res => {
          let arr = [
            {
              name: "不限",
              text: null
            }
          ];
          for (let key in res.obj) {
            arr.push({
              name: key,
              text: res.obj[key]
            });
          }
          this.publisherData.roleList = arr;
          this.publisherData.roleText = arr[0].text;
          reslove();
        });
      });
      /**
       * 获取列表数据接口
       * city 城市区号（默认深圳）
       * supplyDemandCategoryId 分类（带在链接上）如果没有，则不传
       * publisherType 角色 默认不限，不传
       * isSortByGmtModified 按时间升降序 默认不传
       * type 供应/需求
       */
      await new Promise(resolve => {
        // const sourceData = {
        //     city: this.cityCode,
        //     type: 1
        // }
        // if(this.categoryId || this.categorySmallId) {
        //     sourceData.supplyDemandCategoryId = `${this.categoryId},${this.categorySmallId}`
        // }
        // if(this.$route.query.keyName){
        //     sourceData.title = this.$route.query.keyName
        // }
        this.dataReturnListData();
        resolve();
      });
    },
    openNav(index) {
      this.navData.navFlag = !this.navData.navFlag;
      this.tabBarData.tabIndex = index;
      this.isShowMark = !this.isShowMark;
    },
    handleSelBox(isShow) {
      this.navData.navFlag = this.isShowMark = this.navData.cityNavFlag = isShow;
    },
    openCityWarpper() {
      this.navData.cityNavFlag = !this.navData.cityNavFlag;
      this.navData.navFlag = false;
    },
    comfirm(areaCode) {
			this.handleSelBox(false);
			this.setAreaCode(areaCode);
      this.dataReturnListData();
    },
    openCategory(item, index) {
      this.secCategoryData.categoryIndex = index;
      this.secCategoryData.smallCategoryIndex = -1;

      this.categoryId = item.id;
      this.secCategoryData.allCategorySmallDataList = [
        { name: "不限", id: undefined }
      ];
      this.secCategoryData.allCategorySmallDataList = this.secCategoryData.allCategorySmallDataList.concat(
        item.supplyDemandCategoryVos
      );
    },
    selCategory(item, index) {
      this.secCategoryData.smallCategoryIndex = index - 1;
      if (this.categoryId == undefined) {
        this.categoryId = 2;
      }
      console.log(this.categoryId);
      this.categorySmallId = item.id;
      this.$set(this.tabBarData.tabList, 1, item.name);
      this.navData.navFlag = false; //关闭下拉tab
      this.isShowMark = false; //关闭浮层
      this.dataReturnListData();
    },
    selSecCategory(item, index) {
      this.$set(this.tabBarData.tabList, 1, `${item.name}`);
      this.secCategoryData.secCategoryIndex = index;
      this.navData.navFlag = false;
      this.categorySmallId = item.id;
      this.isShowMark = !this.isShowMark;

      this.dataReturnListData();
    },
    roleSecCategory(item, index) {
      this.$set(this.tabBarData.tabList, 2, `${item.name}`);
      this.navData.navFlag = false;
      this.isShowMark = !this.isShowMark;

      this.publisherData.roleIndex = index;
      this.publisherData.roleText = item.text;

      this.dataReturnListData();
    },
    selSortTab(index) {
      this.sortIndex = index;
      this.navData.navFlag = false;
      this.isShowMark = !this.isShowMark;
      if (index === 0) {
        this.isSortByGmtModified = "desc";
        this.isSortByViewNum = undefined;
      }
      if (index === 1) {
        this.isSortByViewNum = "desc";
        this.isSortByGmtModified = undefined;
      }
      this.dataReturnListData();
    },
    dataReturnListData() {
      let sourceData = {
        isSortByGmtModified: this.isSortByGmtModified,
        isSortByViewNum: this.isSortByViewNum,
        type: this.tabMainIndex + 1
			};
			sourceData = this.selectArea ? Object.assign(sourceData, this.selectArea) : Object.assign(sourceData, {city: this.item.areaCode});
			
      if (this.publisherData.roleText) {
        sourceData.publisherType = this.publisherData.roleText;
      }
      if (this.keyName) {
        sourceData.title = this.keyName;
      }
      if (this.categoryId || this.categorySmallId) {
        if (this.categoryId) {
          sourceData.supplyDemandCategoryId = `${this.categoryId}`;
        }
        if (this.categorySmallId) {
          sourceData.supplyDemandCategoryId = `${
            sourceData.supplyDemandCategoryId
          },${this.categorySmallId}`;
        }
      }

      getAllSupplyDemandInfo(sourceData).then(res => {
        this.listData = res.obj;
        if(!res.obj){ this.recommendStart = 0; this.queryRecommendData() };
        setTimeout(() => {
          this.$refs.wrapperScroll && this.$refs.wrapperScroll.refresh();
        }, 20);
      });
    },
    loadMoreRecommend() {
      if (!this.isAllRecommendData) {
        this.recommendStart++;
        this.queryRecommendData();
      }
    },
    async queryRecommendData() {
      let sourceData = {
        isSortByGmtModified: this.isSortByGmtModified,
        isSortByViewNum: this.isSortByViewNum || 'desc',
        type: this.tabMainIndex + 1
			};

      sourceData = this.selectArea ? Object.assign(sourceData, this.selectArea) : Object.assign(sourceData, {city: this.item.areaCode});
			
      if (this.publisherData.roleText) {
        sourceData.publisherType = this.publisherData.roleText;
      }
      
      sourceData.curPage = this.recommendStart + 1;
      sourceData.pageSize = 10;

      let { totalCount, obj} = await getAllSupplyDemandInfo(sourceData);
      
      this.recommendData = this.recommendStart ? [...this.recommendData, ...obj] : obj;

      this.recommendTotalCount = totalCount || 0;
    }
	},
	components: {
    supplyItem,
		dropDownCitySeletor
	},
  created() {
    /**
     * 获取选择分类数据
     * type：1 供求列表，这里始终为 1
     * categoryId 所选一级分类id
     */
    const sourceCategoryData = { type: 1 };
    // if(this.$route.query.categoryId){
    //     sourceCategoryData.categoryId = this.$route.query.categoryId;
    // }
    getallsupplydemandcategory(sourceCategoryData).then(res => {
      res.obj.map(item => {
        this.secCategoryData.allCategoryDataList = item.supplyDemandCategoryVos;
        this.secCategoryData.allCategorySmallDataList = [
          { name: "不限", id: undefined }
        ];
        this.secCategoryData.allCategorySmallDataList = this.secCategoryData.allCategorySmallDataList.concat(
          item.supplyDemandCategoryVos.filter(item => item.id === 2)[0]
            .supplyDemandCategoryVos
        );

        if (this.categoryId) {
          this.secCategoryData.allCategoryDataList
            .find(item => item.id == this.categoryId)
            .supplyDemandCategoryVos.map((item, index) => {
              item.id == this.categorySmallId
                ? (this.secCategoryData.smallCategoryIndex = index)
                : "";
            });
        }
      });
      this.$set(this.tabBarData.tabList, 1, "类别");
      this.tabBarData.tabList.splice(0, 1, this.$store.state.citySelector.item.areaName);
    })
    this.dataReturnMain(); //两个请求需要同步
  },
  beforeRouteLeave(to, from, next) {
    this.setAreaCode('');
    next();
  },
  watch: {
    selCountryData(val) {
      this.commitCountryData = val.filter(item => typeof item === "string");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~views/Search/styles/searchResult.scss";
</style>
