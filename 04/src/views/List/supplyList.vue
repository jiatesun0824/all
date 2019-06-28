<template>
<div class="list">

    <div class="main-tab">
        <!-- tab 开始 -->
        <div class="list-tab relative">
            <div class="tab-box text-center borderBottom">
                <span :class="{'active': tabMainIndex === index}" v-for="(item, index) in ['供应','需求']" :key="index" @click="selTab(index)">{{item}}</span>
            </div>
            <div class="tab-icon tab-search" @click="$router.push('/unionSearch')"></div>
            <div class="tab-icon tab-back" @click="goBack"></div>
        </div>
        <!-- tab 结束 -->
        <!-- 下拉tab开始 -->
        <div class="nav-wraper">
            <div class="type-box">
                <div class="type-nav relative" v-for="(item, index) in tabBarData.tabList" :key="index" @click.stop="openNav(index)">
                    <div class="nav-box" :class="{'active': tabBarData.tabIndex == index && navData.navFlag}">
                        <span class="nav-title">{{item}}</span>
                        <span :class="index !== tabBarData.tabList.length - 1 ? 'arrow' : 'sort-arrow'"></span>
                    </div>
                    <span class="short-line"></span>
                </div>
            </div>
        </div>
        <!-- 下拉tab结束 -->
    </div>
    <!-- 蒙层开始 -->
    <div class="mask" v-show="isShowMark" @click.self="handleSelBox(false)"></div>
    <!-- 蒙层结束 -->

    <!-- 列表数据 -->
    <scroll class="wrapper" :listenScroll = "listenScroll"
      :probeType = "probeType"
      :pullup = "true"
      :beforeScroll = "true"
      :scrollX = "true"
      :refreshScroll = "true"
      :data = "listData"
      ref = "wrapperScroll"
      @scrollToEnd="loadMore" v-if="listData && listData.length">
      <div class="list-view relative" v-load-more="!isAllData" v-all-loaded="isAllData">
        <!-- list-box star-->
        <div class="list-box">
            <supplyItem v-for = "(item, index) in listData" :item="item" :key="index"/>
        </div>
        <!-- list-box end-->
      </div>
    </scroll>

    <!-- 条件无数据 -->
    <div class="recommend" v-if="!listData.length && recommendData.length">
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

    <!-- 所有都无数据 -->
    <div class="no-content text-center" v-if="!listData.length && !recommendData.length">
        <img src="./images/list_icon_empty.png" />
        <p>此处没有更多消息</p>
    </div>
    <!-- 下拉框 star -->
    <div class="sel-box">
        <!-- 城市区级以下选择 开始 -->
        <transition name="dropdown">
            <dropDownCitySeletor @comfirm="comfirm" :refresh="tabBarData.tabIndex== 0 && navData.navFlag" v-show="tabBarData.tabIndex== 0 && navData.navFlag "/>
        </transition>
        <!-- 城市区级以下选择 开始 -->

        <!-- 二级分类 开始 -->
        <transition name="dropdown">
            <div class="sel-wrapper" v-show="tabBarData.tabIndex == 1 && navData.navFlag">
                <div class="sel clearfix">
                    <div class="sel-item" :class="{'current-sel': secCategoryData.secCategoryIndex === index}" v-for="(item, index) in secCategoryData.secCategoryList" :key="index" @click.self="selSecCategory(item, index)">{{item.name}}</div>
                </div>
            </div>
        </transition>
        <!-- 二级分类 结束 -->

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
                <div class="sort-item relative" :class="{'active' : sortIndex == index, 'borderBottom': index == 0}" v-for="(item, index) in ['时间', '人气']" :key="index" @click="selSortTab(index)">{{item}}</div>
            </div>
        </transition>
        <!-- 排序结束 -->
    </div>
    <!-- 下拉框 end -->
    <div class="release-icon text-center" @click="goRelease()" v-if="userType==6">发布<br />信息</div>
</div>


</template>


<script>
import { mapActions, mapGetters } from "Vuex";
import mixins from "@/mixins/mixin";
import {
  getallsupplydemandcategory,
  getallsupplydemandRoles,
  getAllSupplyDemandInfo
} from "@/api/home";
import loadMore from "components/LoadMore/main";
import { isArray, isEmpty } from "lodash";
import supplyItem from "components/supplyItem/index";
import dropDownCitySeletor from "components/DropDownCitySeletor/index";

export default {
  mixins: [mixins],
  data() {
    return {
      userType:JSON.parse(localStorage.getItem('userInfo')).userType,
      tabMainIndex: 0, //标识供应/需求index
      navData: {
        navFlag: false,
        cityNavFlag: false //标识[全国城市]下拉flag
      },
      tabBarData: {
        tabList: ["全国", "装修设计", "不限", "排序"], //tabBarData.tabList
        tabIndex: -1 //标识四个tab Index
      },
      isShowMark: false, //标识蒙层是否出现
      commitCountryData: [],
      storeAreaItem:
        this.$store.state.citySelector && this.$store.state.citySelector.item,
      secCategoryData: {
        // 二级列表信息
        secCategoryList: [
          // 默认为不限
          {
            name: "不限",
            id: null
          }
        ],
        secCategoryIndex: 0
      },
      listData: [],
      listTotalCount: '',
      recommendData: [],
      recommendTotalCount: '',
      isAllEmptyData: false,
      publisherData: {
        roleList: [],
        roleIndex: 0,
        roleText: undefined
      },
      sortIndex: 0,
      categorySmallId: this.$route.query.categorySmallId,
      categoryId: this.$route.query.categoryId
        ? this.$route.query.categoryId
        : 2,
      isSortByGmtModified: undefined,
      isSortByViewNum: undefined,
      start: 0,
      recommendStart: 0
    };
  },
  computed: {
    isAllData() {
      return (
        isArray(this.listData) && this.listData.length === this.listTotalCount
      );
    },
    isAllRecommendData() {
      return isArray(this.recommendData) && this.recommendData.length === this.recommendTotalCount
    }
  },
  methods: {
    ...mapActions("home", ["changeTypeTab"]),
    ...mapActions("release", ["setFrom"]),
    pulldown() {
      console.log(1);
    },
    loadMore() {
      if (!this.isAllData) {
        this.start++;
        this.dataReturnListData();
      }
    },
    loadMoreRecommend() {
      if (!this.isAllRecommendData) {
        this.recommendStart++;
        this.queryRecommendData();
      }
    },
    async dataReturnMain() {
      /**
       * 获取选择角色数据接口
       * type：1 供求
       */
      await new Promise(resolve => {
        this.dataReturnAllSupplyDemandRoles();
        resolve();
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
        const sourceData = {
          city: this.storeAreaItem.areaCode,
          type: 1
        };
        if (this.categoryId || this.categorySmallId) {
          sourceData.supplyDemandCategoryId = `${this.categoryId},${
            this.categorySmallId
          }`;
        }
        if (this.$route.query.keyName) {
          sourceData.title = this.$route.query.keyName;
        }
        this.dataReturnListData(sourceData);
        resolve();
      });
    },
    openNav(index) {
      this.navData.navFlag = !this.navData.navFlag;
      if (this.$route.query.isSearch === 1 && index === 1) {
        this.tabBarData.tabIndex = 5;
      } else {
        this.tabBarData.tabIndex = index;
      }
      this.isShowMark = !this.isShowMark;
    },
    handleSelBox(isShow) {
      this.navData.navFlag = this.isShowMark = this.navData.cityNavFlag = isShow;
    },
    goRelease() {
      this.setFrom('supplyList')
      this.$router.push('/chooseRelease');
    },
    goBack() {
      if(this.$route.name=='supplyList'){
        this.$router.push('/home')
      }else {
        this.$router.back(-1);
      }

    },
    comfirm(areaCode) {
      // this.storeAreaItem.areaCode = areaCode;
      this.start = 0;
      this.handleSelBox(false);
      this.dataReturnListData(areaCode);
    },
    selTab(index) {
      this.start = 0;
      this.tabMainIndex = index;
      this.dataReturnAllSupplyDemandRoles({ type: index + 1 });
      this.dataReturnListData();
    },
    selCategory(item) {
      this.categorySmallId = item.id;

      this.$set(this.tabBarData.tabList, 1, item.name);
      this.navData.navFlag = false; //关闭下拉tab
      this.isShowMark = false; //关闭浮层
      this.dataReturnListData();
    },
    selSecCategory(item, index) {
      this.start = 0;
      // this.myScrollToEnd = true;
      this.$set(this.tabBarData.tabList, 1, `${item.name}`);
      this.secCategoryData.secCategoryIndex = index;
      this.navData.navFlag = false;
      this.categorySmallId = item.id;
      this.isShowMark = !this.isShowMark;

      this.dataReturnListData();
    },
    roleSecCategory(item, index) {
      this.start = 0;
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
    dataReturnAllSupplyDemandRoles(data = { type: 1 }) {
      getallsupplydemandRoles(data).then(res => {
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
      });
    },
    dataReturnListData(selectCode) {
      let sourceData = {
        isSortByGmtModified: this.isSortByGmtModified,
        isSortByViewNum: this.isSortByViewNum,
        type: this.tabMainIndex + 1
			};

      sourceData = selectCode ? Object.assign(sourceData, selectCode) : Object.assign(sourceData, {city: this.storeAreaItem.areaCode});

      if (this.publisherData.roleText) {
        sourceData.publisherType = this.publisherData.roleText;
      }
      if (this.$route.query.keyName) {
        sourceData.title = this.$route.query.keyName;
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
      sourceData.curPage = this.start + 1;
      sourceData.pageSize = 10;
      if(this.storeAreaItem.areaName=='全国') {
        sourceData = {
          curPage: this.start + 1,
          pageSize: 10
        }
      }
      getAllSupplyDemandInfo(sourceData).then(res => {
        if (res.obj && res.obj.length > 0 && !this.isAllData) {
          this.listData = this.start
            ? [...this.listData, ...res.obj]
            : [...res.obj];
          setTimeout(() => {
            this.$refs.wrapperScroll.refresh();
          }, 20);
        } else {
          this.listData = res.obj || [];
          this.recommendStart = 0;
          this.queryRecommendData(selectCode);
        }
        this.listTotalCount = res.totalCount;
      });
    },
    async queryRecommendData(selectCode) {
      let sourceData = {
        isSortByGmtModified: this.isSortByGmtModified,
        isSortByViewNum: this.isSortByViewNum || 'desc',
        type: this.tabMainIndex + 1
			};

      sourceData = selectCode ? Object.assign(sourceData, selectCode) : Object.assign(sourceData, {city: this.storeAreaItem.areaCode});

      if (this.publisherData.roleText) {
        sourceData.publisherType = this.publisherData.roleText;
      }
      if (this.$route.query.keyName) {
        sourceData.title = this.$route.query.keyName;
      }
      sourceData.curPage = this.recommendStart + 1;
      sourceData.pageSize = 10;

      let { totalCount, obj} = await getAllSupplyDemandInfo(sourceData);

      this.recommendData = (this.recommendStart ? [...this.recommendData, ...obj] : obj) || [];

      this.recommendTotalCount = totalCount || 0;
    }
  },
  async created() {
    this.$set(this.tabBarData.tabList, 0, this.storeAreaItem.areaName);
    /**
     * 获取选择分类数据
     * type：1 供求列表，这里始终为 1
     * categoryId 所选一级分类id
     */
    const sourceCategoryData = {
      type: 1
    };
    if (this.$route.query.categoryId) {
      sourceCategoryData.categoryId = this.$route.query.categoryId;
    }
    getallsupplydemandcategory(sourceCategoryData).then(res => {
      this.secCategoryData.secCategoryList = this.secCategoryData.secCategoryList.concat(
        res.obj
      );

      this.secCategoryData.secCategoryList.map((item, index) => {
        if (item.id == this.categorySmallId) {
          this.secCategoryData.secCategoryIndex = index;
          this.$set(this.tabBarData.tabList, 1, item.name);
        }
      });
    }),
      this.dataReturnMain(); //两个请求需要同步
  },
  components: {
    loadMore,
    supplyItem,
    dropDownCitySeletor
  }
};
</script>

<style lang="scss" scoped>
@import "~views/List/styles/supplyList.scss";
</style>
