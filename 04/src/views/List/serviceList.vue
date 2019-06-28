<template>
  <div class="serviceList">
    <!--tab-->
    <div class="back" @click="$router.push('/')"><i></i></div>
    <tab class="header-tab" :line-width="0" active-color='#ff6419' v-model="index">
      <!--<i class="icon-left back" @click="$router.push('/')"></i>-->
      <tab-item class="vux-center" active-class="active" :selected="item.active" v-for="(item, index) in list2"
        @on-item-click="clickTab(item, index)" @click="demo2 = item" :key="index">
        {{item.title}}
      </tab-item>
    </tab>

    <!--搜索框-->
    <div class="search-content">
      <div class="search-box">
        <div class="position" @click="showCitySelectPannel = true">
          <div class="location">{{this.$store.state.citySelector.item.areaName}}</div>
          <i class="ic-down"></i>
        </div>
        <div class="search-input">
          <i class="ic-search"></i>
          <div class="search-text" @click="search">请输入关键字</div>
        </div>
      </div>
    </div>

    <!-- 区域选择弹出 -->
    <div class="area__pannel" v-show="showCitySelectPannel" @click="showCitySelectPannel = false">
      <div class="area__content" @click.stop>
        <!-- 城市区级以下选择 开始 -->
        <drop-down-city-seletor @comfirm="comfirm" v-show="showCitySelectPannel"></drop-down-city-seletor>
      </div>
    </div>

    <!--大牌-->
    <div class="brand-box" v-if="shopListData.length && listData.length">
      <div class="title" v-text="bannerTitleText"></div>
      <div class="list-box">
        <div ref="bannerScroll">
          <ul ref="bannerWrapper">
            <li v-for="(item,key) in shopListData" :key="key" v-if="item.picPath" @click.stop="selItemBr(item)">
              <img v-lazy="userInfo.resourcesUrl + item.picPath" :key="userInfo.resourcesUrl + item.picPath" :style="currentTab==3?'border-radius:50%':''">
              <span class="shopName" :style="currentTab==3?'text-align:center':''">{{item.shopName}}</span>
            </li>
          </ul>
        </div>
        <!-- <div class="emptyPage" v-else style="margin-top: 0">
          <img src="./images/list_icon_empty.png">
          <p>暂无数据</p>
        </div> -->
      </div>
    </div>
    <swiper v-model="index" height="100%" :show-dots="false">
      <swiper-item v-for="(item, index) in list2" :key="index" @touchmove.stop>
        <div class="tab-swiper vux-center" v-if="item.active">
          <div class="scroolbox" @touchstart="changeTabStart" @touchmove="changeTabMove">
            <scroll class="wrapper" ref='scroller' :probeType="probeType" :listenScroll="listenScroll" :refreshScroll="true"
              :data="listData" pullup @scrollToEnd="loadMore" @touchmove.stop>
              <div>
                <div class="dropdown-bg" v-show="styleChoose" @click="styleChoose=false"></div>
                <div class="dropdown-bg" v-show="styleShow"></div>
                <div class="content">
                  <div class="content-box">
                    <div :class="styleActive?'style-header active':'style-header'" v-if="listData.length">
                      <div class="style-header-title" @click="toggle">
                        <div :class="styleActive?'title active':'title'">{{styleTitle}}</div>
                      </div>
                      <i class="ic-sort" :style="reverseBool?'transform: rotate(180deg);':''" @click.stop="reverse"></i>
                    </div>
                    <!--类型弹出窗-->
                    <!--<div class="style-mark" v-show="item.active"></div>-->
                    <!--二级分类风格弹窗  （只有家居建材有二级弹窗）-->
                    <div class="style-box" v-if="currentTab==2">
                      <transition name="dropdown">
                        <div class="style-component" v-show="styleShow" transiton="dropdown">
                          <div class="style-left">
                            <ul>
                              <li :class="{'active':item.active}" v-for="(item,key) in houseStyleData" :key="key"
                                @click="tabStyleList(item,key)">{{item.name}}</li>
                            </ul>
                          </div>
                          <div class="style-right">
                            <ul>
                              <li v-for="(item,key) in houseStyleTwoData" :key="key" @click="confirmChoose(item)">{{item.name}}</li>
                            </ul>
                          </div>
                        </div>
                      </transition>
                    </div>
                    <!--一级分类风格弹窗-->
                    <div class="style-box" v-else>
                      <transition name="dropdown">
                        <div class="style-module" v-show="styleShow" transiton="dropdown">
                          <!--一级弹窗-->
                          <ul>
                            <li @click="selStyle(item,index)" :class="item.active?'active' : ''" v-for="(item,index) in styleList"
                              :key="index">{{ item.name }}</li>
                          </ul>
                        </div>
                      </transition>
                    </div>

                    <!--人气弹窗-->
                    <!--<div class="dropdown-bg" v-show="styleChoose" @click="styleChoose=false"></div>-->
                    <div class="style-box">
                      <transition name="dropdown">
                        <div class="style-choose" v-show="styleChoose">
                          <div class="style-list" @click="styleMethod(item)" :class="{'active':item.active}" v-for="(item, index) in choseList"
                            :key="index">{{item.title}}</div>
                        </div>
                      </transition>
                    </div>
                    <!-- 弹框蒙层 -->

                    <div class="style-box" :class="{'marginBottom':index>=1}" v-for="(item,index) in listData" :key="index"
                      @click.stop="selItem(item)">
                      <div class="style-content">
                        <div class="style-info">
                          <div class="info-box">
                            <img :src="item.logoUrl | logoFilter">
                            <div class="info-detail">
                              <p class="ellipsis" v-text="item.shopName"></p>
                              <!-- @click.stop="ellipsisChange('titleEllipsis', index)" -->
                              <!--<p v-if="item.businessType==5||item.businessType==3">保证金：{{item.deposit}}万元</p>-->
                              <!-- <p class="styleClass" v-if="item.categoryNames&&(item.businessType==5||item.businessType==3)" :class="{'ellipsis':isEllipsis}" @click.stop="isEllipsis=!isEllipsis">擅长风格：{{item.categoryNames}}</p> -->
                              <p class="typeClass ellipsis" v-text="`${/(3|5)/.test(currentTab) ? '擅长风格' : '产品类型'}：${item.categoryNames || '暂无'}`"></p>
                              <!-- @click.stop="ellipsisChange('typeEllipsis', index)" -->
                            </div>
                          </div>
                          <div class="style-brand" v-if="item.memberYear>0">
                            <div class="brand-level">会员{{item.memberYear}}年</div>
                            <div class="brand-level">认证{{item.authGrade}}级</div>
                          </div>
                        </div>
                        <div class="style-img">
                          <img :src="item1.picPath | urlFilter" v-for="(item1,index1) in item.lstResPic" :key="index1">
                        </div>
                        <div class="style-address borderTop">
                          <div class="address">
                            <i class="ic-address"></i>
                            <div class="text ellipsis" v-text="`${item.cityName} ${item.areaName} ${item.streerName} ${item.shopAddress}`"></div>
                            <!-- @click.stop="ellipsisChange('addressEllipsis', index)" -->
                          </div>
                          <div class="comment">
                            <!--<div class="comment-good">-->
                            <!--<i class="ic-comment-good"></i>-->
                            <!--<p>{{item.praiseRatePercent}}</p>-->
                            <!--</div>-->
                            <div class="comment-look">
                              <i class="ic-comment-look"></i>
                              <p>{{item.visitCount}}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--加载更多-->
                    <!-- <loadMore v-if="!isAllData"></loadMore> -->
                    <div class="noData" v-if="isAllData && isNoData && listData.length != 0">没有更多数据</div>
                    <!--空页面-->
                    <div class="emptyPage" v-show="isEmpty">
                      <img src="./images/list_icon_empty.png">
                      <p>暂无数据</p>
                    </div>
                  </div>
                </div>
              </div>
            </scroll>
          </div>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import minix from "@/mixins/mixin";
  import {
    tcfwList,
    getDesignStyleList,
    shopPopularityList,
    houseStyle
  } from "@/api/service";
  import {
    Tab,
    TabItem,
    Sticky,
    Divider,
    XButton,
    Swiper,
    SwiperItem
  } from "vux";
  import {
    pick,
    values,
    get,
    isEqual,
    isArray,
    find,
    isEmpty,
    debounce
  } from "lodash";
  import {
    mapGetters
  } from "Vuex";
  import BScroll from "better-scroll";
  import loadMore from "components/LoadMore/main";
  import dropDownCitySeletor from "components/DropDownCitySeletor/index";

  export default {
    name: 'serviceList',
    mixins: [minix],
    data() {
      return {
        // 装修公司  = 5   设计师 = 3  家具建材 = 2 施工单位 = 6
        list2: [{
            title: "装修公司",
            bannerTitle: "人气大牌",
            active: true,
            type: 5
          },
          {
            title: "设计公司",
            bannerTitle: "大牌设计师",
            active: false,
            type: 4
          },
          {
            title: "设计师",
            bannerTitle: "大牌设计师",
            active: false,
            type: 3
          },
          {
            title: "家居建材",
            bannerTitle: "热门品牌",
            active: false,
            type: 2
          },
          {
            title: "施工单位",
            bannerTitle: "好评单位推荐",
            active: false,
            type: 6
          }
        ],
        choseList: [{
            title: "时间",
            active: true
          },
          {
            title: "人气",
            active: false
          }
        ],
        isNoData: false,
        isEmpty: false,
        isEllipsis: true,
        totalNum: "",
        searchTitle: this.$route.query.vosName,
        styleTitle: "风格",
        demo1: "装修公司",
        currentTab: sessionStorage.getItem("currentTab"), //当前切换的type
        index: 0,
        shopListData: [], //人气大牌
        styleShow: false,
        listData: [],
        // 风格按钮样式控制
        styleActive: false,
        // 风格列表数据
        styleList: [],
        houseStyleData: [],
        houseStyleTwoData: [],
        // 列表数据倒叙icon样式控制
        reverseBool: false,
        styleChoose: false,
        isClickTab: false,
        isEmptyBrand: false,
        curentPage: 1,
        changeTabStartX: '',
        changeTabStartY: '',
        showCitySelectPannel: false,
        cityCode: '',
        areaCode: '',
        streetCode: ''
      };
    },
    components: {
      Tab,
      TabItem,
      Sticky,
      Divider,
      XButton,
      Swiper,
      SwiperItem,
      loadMore,
      dropDownCitySeletor
    },
    watch: {
      // 用户滑动风格列表监听
      index(value) {
        if (this.isClickTab) {
          this.curentPage = 1;
          this.styleShow = false;
          this.styleActive = false;
          this.isEmpty = false;
          this.listData = [];
          this.shopListData = [];
          this.list2.forEach((item, index) => (item.active = value === index));
          sessionStorage.setItem('shopName', '');
          this.showCitySelectPannel = false;
          switch (value) {
            case 0:
              this.currentTab = 5;
              this.styleType("goodStyle");
              this.styleTitle = "风格";
              break;
            case 1:
              this.currentTab = 4;
              this.styleType("goodStyle");
              this.styleTitle = "风格";
              break;
            case 2:
              this.currentTab = 3;
              this.styleType("goodStyle");
              this.styleTitle = "风格";
              break;
            case 3:
              this.currentTab = 2;
              this.houseStyle();
              this.styleTitle = "家居类别";
              break;
            case 4:
              this.currentTab = 6;
              this.styleType("constructionType");
              this.styleTitle = "施工类别";
              break;
          }
          this.shopList(this.list2[value].type);
          this.listMethod('', 1, this.list2[value].type);
          sessionStorage.setItem("currentTab", this.currentTab);
        }
      }
    },
    computed: {
      ...mapGetters("common", ["userInfo"]),
      bannerTitleText() {
        return get(find(this.list2, {
          active: true
        }), "bannerTitle");
      },
      isAllData() {
        if (this.totalNum) {
          return this.totalNum && this.curentPage === this.totalNum;
        } else {
          return true;
        }
      }
    },
    created() {
      //currentTab  当前的类型
      sessionStorage.setItem('type', '1');
      sessionStorage.removeItem('detailsNav');
      this.listMethod(
        '',
        '1',
        sessionStorage.getItem('currentTab'),
        ''
      ); //列表数据
      this.tabActive(sessionStorage.getItem('currentTab')); //改变tab状态
      this.shopList(sessionStorage.getItem('currentTab')); //人气大牌

      if (
        sessionStorage.getItem('currentTab') == 5 ||
        sessionStorage.getItem('currentTab') == 3 ||
        sessionStorage.getItem('currentTab') == 4
      ) {
        //风格列表
        this.styleType('goodStyle');
        this.styleTitle = "风格";
      } else if (sessionStorage.getItem('currentTab') == 2) {
        this.houseStyle();
        this.styleTitle = sessionStorage.getItem('styleTile');
      } else if (sessionStorage.getItem('currentTab') == 6) {
        this.styleType('constructionType');
        this.styleTitle = '施工类别';
      }
    },
    methods: {
      // 加载初始数据
      listMethod(
        categoryIds,
        pageNo,
        type,
        shopName,
        provinceCode,
        cityCode,
        areaCode,
        streetCode,
        orderBy
      ) {
        let data = {
          provinceCode: provinceCode,
          cityCode: this.cityCode ? this.cityCode : this.$store.state.citySelector.item.areaCode,
          areaCode: this.areaCode,
          streetCode: this.streetCode,
          categoryIds: categoryIds,
          pageNo: pageNo,
          pageSize: 10,
          start: 0,
          orderBy: orderBy,
          companyId: "",
          shopName: shopName, //店铺名
          businessType: type,
          platformType: "3",
          sortType: "1"
        };
        //this.listData=[];
        tcfwList(data).then(res => {
          this.isClickTab = true;
          this.isEmpty = false;
          if (res.data) {
            this.totalNum = res.data.total;
            pageNo == 1 ?
              (this.listData = res.data.list) :
              (this.listData = this.listData.concat(res.data.list));
            pageNo == res.data.total ?
              (this.isNoData = true) :
              (this.isNoData = false);
            this.listData.map(item => {
              item.active = false;
            });
          } else {
            if (pageNo == 1) {
              this.isEmpty = true;
              this.isNoData = false;
              this.listData = [];
            } else {
              this.isEmpty = false;
              this.isNoData = true;
            }
          }

          if (!isEmpty(this.shopListData) && !isEmpty(this.listData)) {
            this.$nextTick(() => {
              this.$refs.bannerWrapper.style.width =
                this.$refs.bannerWrapper.scrollWidth + "px";
              this.$nextTick(() => {
                new BScroll(this.$refs.bannerScroll, {
                  startX: 0,
                  click: true,
                  scrollX: true,
                  scrollY: false,
                  eventPassthrough: "vertical"
                });
              });
            });
          }

        });
      },
      loadMore() {
        if (!this.isAllData) {
          this.curentPage++;
          this.listMethod(
            "",
            this.curentPage,
            sessionStorage.getItem("currentTab"),
            sessionStorage.getItem("shopName")
          ); //列表数据
        }
      },
      styleMethod(item) {
        //人气筛选
        this.choseList.map(res => {
          res.active = false;
        });
        item.active = true;
        if (item.title == "时间") {
          this.listMethod("", "1", sessionStorage.getItem("currentTab"));
        } else {
          this.listMethod(
            "",
            "1",
            sessionStorage.getItem("currentTab"),
            "",
            "",
            "",
            "",
            "",
            "hottest"
          );
        }
        this.styleChoose = false;
      },
      search() {
        this.areaCode && sessionStorage.setItem('serviceAreaCode', this.areaCode);
        this.streetCode && sessionStorage.setItem('serviceStreetCode', this.streetCode);

        this.$router.push({
          path: "unionSearch",
          query: {
            searchIndex: 1,
            searchType: this.currentTab
          }
        });
      },
      tabActive(type) {
        //改变tab切换样式显示
        this.list2.map(res => {
          res.active = false;
        });
        if (type == "5") {
          this.list2[0].active = true;
        } else if (type == "4") {
          this.list2[1].active = true;
        } else if (type == "3") {
          this.list2[2].active = true;
        } else if (type == "2") {
          this.list2[3].active = true;
        } else if (type == "6") {
          this.list2[4].active = true;
        }
      },
      styleType(type) {
        //装修公司 设计师 施工单位 的风格列表
        getDesignStyleList({
          type: type
        }).then(res => {
          this.styleList = res.data;
          this.styleList.map(item => {
            item.active = false;
          });
          this.styleList.unshift({
            name: "全部",
            active: true
          });
        });
      },
      houseStyle() {
        // 家居建材的风格列表
        houseStyle().then(res => {
          this.houseStyleData = res.data;
          this.houseStyleData.map((item, index) => {
            item.active = false;
            if (index == 0) {
              this.houseStyleTwoData = item.childs;
              item.active = true;
            }
          });
        });
      },
      clickTab(item) {
        //tab切换  列表及风格
        this.currentTab = item.type;
        console.log(this.currentTab);
      },
      shopList(businessType) {
        //人气大牌接口
        shopPopularityList({
          businessType: businessType,
          platformType: '3'
        }).then(res => {
          //this.shopListData = get(res.data, 'list') || [] ;
          this.shopListData = get(res, "data.list") || [];
        });
      },
      // 列表数据倒叙
      reverse: debounce(function () {
        this.styleChoose = !this.styleChoose;
        this.styleShow = false;
        //this.listData = this.listData.reverse();
        this.reverseBool = !this.reverseBool;
      }, 20),
      // 选择一个店铺进入店铺详情
      selItem(item) {
        sessionStorage.setItem('currentTab', this.currentTab);
        sessionStorage.setItem("shopName", "");
        this.$router.push(`/tcdetail/${item.id}`);
      }, // 从大牌选择一个店铺进入店铺详情
      selItemBr(item) {
        sessionStorage.setItem('currentTab', this.currentTab);
        sessionStorage.setItem("shopName", "");
        this.$router.push(`/tcdetail/${item.shopId}`);
      },
      // 选择风格
      selStyle(dto, index) {
        this.styleList.map(item => {
          item.active = false;
        });
        this.styleList[index].active = true;
        //数据筛选
        this.styleShow = false;
        this.styleActive = false; //关闭弹窗
        this.listData = ""; //清空
        this.styleTitle = dto.name; //改变标题
        this.listMethod(dto.value, "1", sessionStorage.getItem("currentTab")); //重新渲染数据
      },
      // 风格弹框样式与弹框显示隐藏
      toggle() {
        this.styleActive = !this.styleActive;
        this.styleChoose = false;
        if (this.styleActive) {
          this.styleShow = true;
        } else {
          this.styleShow = false;
        }
      },
      tabList(item) {
        this.serviceBox.map(res => {
          res.active = false;
        });
        item.active = true;
        this.listMethod("", "1", item.type);
      },
      tabStyleList(item, dto) {
        //切换风格
        this.houseStyleData.map(res => {
          res.active = false;
        });
        item.active = true;
        this.$set(this.houseStyleData, dto, this.houseStyleData[dto]);
        //改变二级分类的数据
        this.houseStyleData.map((child, index) => {
          if (dto == index) {
            this.houseStyleTwoData = child.childs;
          }
        });
      },
      confirmChoose(item) {
        //确定筛选
        this.styleShow = false;
        this.styleActive = false;
        this.listData = "";
        this.styleTitle = item.name;
        this.listMethod(item.id, "1", sessionStorage.getItem("currentTab"));
      },
      ellipsisChange(type, index) {
        this.$set(this.listData, index, {
          ...this.listData[index],
          [type]: !this.listData[index][type]
        });
      },
      changeTabStart(e) {
        this.changeTabStartX = e.changedTouches[0].clientX;
        this.changeTabStartY = e.changedTouches[0].clientY;
      },
      changeTabMove(e) {
        if (Math.abs(e.changedTouches[0].clientX - this.changeTabStartX) < 220 && Math.abs(e.changedTouches[0].clientY -
            this.changeTabStartY) < 20 || Math.abs(e.changedTouches[0].clientX - this.changeTabStartX) < 200 && Math.abs(
            e.changedTouches[0].clientY - this.changeTabStartY) > 350) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      comfirm(selectCode) {
        this.showCitySelectPannel = false;
        this.cityCode = selectCode.city;
        this.areaCode = selectCode.district;
        this.streetCode = selectCode.street;
        this.listMethod('', 1, this.currentTab, '', '', selectCode.city, selectCode.district, selectCode.street);
      }
    }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "~views/List/styles/serviceList.scss";

</style>
