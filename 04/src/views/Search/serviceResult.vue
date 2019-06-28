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
          <!-- <form action="javascript:return true;" id="search-form">
          </form> -->
        </div>
        <span class="divider divider-horizontal divider-bottom"></span>
      </div>
      <!-- tab 结束 -->
      <!-- 下拉tab开始 -->
      <div class="nav-wraper">
        <div class="type-box">
          <div class="type-nav relative" v-for="(item, index) in tabBarData.tabList" :key="index" @click.stop="openNav(index)">
            <div class="nav-box" :class="{'active': tabBarData.tabIndex == index && navData.navFlag}">
              <span class="nav-title">{{item}}</span>
              <span :class="index == 0 ? 'arrow' : ''"></span>
              <!--<span class="sort-arrow"></span>-->
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
    <scroll class="wrapper" :listenScroll = "listenScroll"
            :probeType = "probeType"
            :pullup = "true"
            :beforeScroll = "true"
            :scrollX = "true"
            :refreshScroll = "true"
            :data = "listData"
            ref = "wrapperScroll">

      <div class="list-view relative">
        <div class="style-box" :class="{'marginBottom':index>=1}" v-for="(item,index) in listData" :key="index" @click.stop="selItem(item)">

          <div class="style-content borderTop">
            <div class="style-info">
              <div class="info-box">
                <img :src="item.logoUrl | logoFilter" alt="">
                <div class="info-detail">
                  <p>{{item.shopName}}</p>
                  <!--<p v-if="item.businessType==5||item.businessType==3">保证金：{{item.deposit}}万元</p>-->
                  <p v-if="item.categoryNames&&(item.businessType==5||item.businessType==3)">擅长风格：{{item.categoryNames}}</p>
                  <p v-if="item.categoryNames&&(item.businessType==2||item.businessType==6)">产品类型：{{item.categoryNames}}</p>
                </div>
              </div>
              <div class="style-brand" v-if="item.memberYear>0">
                <div class="brand-level">会员{{item.memberYear}}年</div>
                <div class="brand-level">认证{{item.authGrade}}级</div>
              </div>
            </div>
            <div class="style-img">
              <img :src="item1.picPath | urlFilter" alt="" v-for="(item1,index1) in item.lstResPic" :key="index1">
            </div>
            <div class="style-address borderTop">
              <div class="address">
                <i class="ic-address"></i>
                <div class="text">{{item.cityName}}{{item.areaName}}{{item.shopAddress}}</div>
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
      <div class="no-content text-center" v-if="listData.length==0">
          <img src="./images/list_icon_empty.png"/>
          <p>此处没有更多消息</p>
      </div>
        <!-- list-box end-->
      </div>
      <!-- 下拉框 star -->
      <div class="sel-box">
        <!-- 城市选择 开始 -->
        <transition name="dropdown">
          <drop-down-city-seletor @comfirm="comfirm" :refresh="tabBarData.tabIndex== 0 && navData.navFlag" v-show="tabBarData.tabIndex== 0 && navData.navFlag"></drop-down-city-seletor>
        </transition>
        <!-- 城市选择 结束 -->

        <!-- 所有分类 开始  -->
        <!--<transition name="dropdown">-->
          <!--<div class="sel-wrapper" v-show="tabBarData.tabIndex == 1 && navData.navFlag">-->
            <!--<div class="sel-province-city add-class clearfix">-->
              <!--<scroll :listenScroll = "listenScroll"-->
                      <!--:probeType = "probeType"-->
                      <!--:pullup = "true"-->
                      <!--:beforeScroll = "true"-->
                      <!--:scrollX = "true"-->
                      <!--:refreshScroll = "true"-->
                      <!--:data="secCategoryData.allCategoryDataList"-->
                      <!--class="sel-city left">-->
                <!--<div>-->
                  <!--<div>-->
                    <!--<div class="city-item text-center relative" v-for ="(item, index) in secCategoryData.allCategoryDataList" :key="index" @click="openCategory(item, index)" :class="{'active': secCategoryData.categoryIndex === index}">-->
                      <!--{{item.name}}-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</scroll>-->
              <!--<scroll :listenScroll = "listenScroll"-->
                      <!--:probeType = "probeType" :pullup = "true"-->
                      <!--:beforeScroll = "true"-->
                      <!--:scrollX = "true"-->
                      <!--:refreshScroll = "true"-->
                      <!--:data="secCategoryData.allCategorySmallDataList"-->
                      <!--class="sel-area left">-->
                <!--<div>-->
                  <!--<div class="area-box">-->
                    <!--<div class="area-item text-center" :class="{'active': secCategoryData.smallCategoryIndex == (index - 1), 'scale-min':-->
                                    <!--item.name.length > 5}"  v-for="(item, index) in secCategoryData.allCategorySmallDataList" :key="index" @click="selCategory(item, index)">-->
                      <!--{{item.name}}-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</scroll>-->
            <!--</div>-->
          <!--</div>-->
        <!--</transition>-->
        <!-- 所有分类 开始  -->

        <!-- 角色选择 开始 -->
        <!--<transition name="dropdown">-->
          <!--<div class="sel-wrapper" v-show="tabBarData.tabIndex == 2 && navData.navFlag">-->
            <!--<div class="sel clearfix">-->
              <!--<div class="sel-item" v-for="(item, index) in styleDataSmallList" :class="{'current-sel': publisherData.roleIndex === index}" :key="index" @click="selStyleCategory(item, index)">{{item.name}}</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</transition>-->
        <!--<transition name="dropdown">-->
          <!--<div class="sel-wrapper" v-show="tabBarData.tabIndex == 2 && navData.navFlag">-->
            <!--<div class="sel-province-city addStyleClass clearfix">-->
              <!--<scroll :listenScroll = "listenScroll"-->
                      <!--:probeType = "probeType"-->
                      <!--:pullup = "true"-->
                      <!--:beforeScroll = "true"-->
                      <!--:scrollX = "true"-->
                      <!--:refreshScroll = "true"-->
                      <!--:data="styleDataList"-->
                      <!--class="sel-city left">-->
                <!--<div>-->
                  <!--<div>-->
                    <!--<div class="city-item text-center relative" v-for="(item, index) in styleDataList" :key="index" @click="openStyleCategory(item, index)" :class="{'active': item.active}">-->
                      <!--{{item.title}}-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</scroll>-->
              <!--<scroll :listenScroll = "listenScroll"-->
                      <!--:probeType = "probeType" :pullup = "true"-->
                      <!--:beforeScroll = "true"-->
                      <!--:scrollX = "true"-->
                      <!--:refreshScroll = "true"-->
                      <!--:data="styleDataSmallList"-->
                      <!--class="sel-area left">-->
                <!--<div>-->
                  <!--<div class="area-box">-->
                    <!--<div class="area-item text-center" v-for="(item, index) in styleDataSmallList" :key="index" @click="selStyleCategory(item, index)">-->
                      <!--{{item.name}}-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</scroll>-->
            <!--</div>-->
          <!--</div>-->
        <!--</transition>-->
        <!-- 角色选择 结束 -->

        <!-- 排序开始 -->
        <!--<transition name="dropdown">-->
          <!--<div class="sel-sort-box text-center sel-wrapper" v-show="tabBarData.tabIndex == 3 && navData.navFlag">-->
            <!--<div class="sort-item relative" :class="{'active' : sortIndex == index}" v-for="(item, index) in ['时间', '人气']" :key="index" @click="selSortTab(index)">{{item}}</div>-->
          <!--</div>-->
        <!--</transition>-->
        <!-- 排序结束 -->


      </div>
      <!-- 下拉框 end -->
    </scroll>
  </div>


</template>


<script>
  import { mapActions, mapGetters } from 'Vuex'
  import mixins from '@/mixins/mixin'
  import { getAllArea, getallsupplydemandcategory, getallsupplydemandRoles, getAllSupplyDemandInfo } from '@/api/home'
  import { tcfwList, getDesignStyleList,houseStyle } from '@/api/service'
  import dropDownCitySeletor from "components/DropDownCitySeletor/index";
  import { get } from 'lodash';

  export default{
    mixins: [mixins],
    data() {
      return {
        tabMainIndex: 0, //标识供应/需求index
        navData: {
          navFlag: false,
          cityNavFlag: false, //标识[全国城市]下拉flag
        },
        cityIndex: -1, //标识下拉全国城市左tab
        selCityData: '', //全国城市右边数据
        selCountryData: [], //全国地区右边数据
        addressIndex: -1, //标识市区左tab
        tabBarData: {
          tabList: ['深圳', '人气','时间'], //tabBarData.tabList
          tabIndex: -1 //标识四个tab Index
        },
        isShowMark: false, //标识蒙层是否出现
        commitCountryData: [],
        provinceCode: '440000',
        cityCode: '440300',
        areaCode: '',
        streetCode: '',
        secCategoryData: { // 二级列表信息
          secCategoryList: [ // 默认为不限
            {
              name: '不限',
              id: null
            }
          ],
          secCategoryIndex: 0,
          allCategoryDataList:[],
          allCategorySmallDataList: [],
          categoryIndex: 0,
          smallCategoryIndex: -1
        },
        listData: [],
        publisherData: {
          roleList: [],
          roleIndex: 0,
          roleText: undefined,
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
        businessType: '',
        keyName: this.$route.query.keyName,
        orderBy: ''
      }
    },
    computed: {
      ...mapGetters('citySelector', ['item'])
    },
    methods: {
      selItem(item) {
        sessionStorage.setItem('shopName','');
        this.$router.push(`/tcdetail/${item.id}`);
      },
      searchSubmit(){
        this.keyName = this.searchText;
        this.dataReturnListData(sessionStorage.getItem('currentTab'));
      },
      openNav(index){
        if(index==0){
          this.navData.navFlag = !this.navData.navFlag;
          this.tabBarData.tabIndex = index;
          this.isShowMark = !this.isShowMark;
        }else if(index==1){
          this.orderBy='hottest';
          this.dataReturnListData(sessionStorage.getItem('currentTab'));
        }else {
          this.orderBy='';
          this.dataReturnListData(sessionStorage.getItem('currentTab'));
        }
      },
      handleSelBox(isShow){
        this.navData.navFlag = this.isShowMark = this.navData.cityNavFlag = isShow;
      },
      comfirm(selectCode){
        this.handleSelBox(false);
        this.cityCode = selectCode.city;
        this.areaCode = selectCode.district;
        this.streetCode = selectCode.street;
        this.dataReturnListData(sessionStorage.getItem('currentTab'))
      },

      // openCategory(item, index){
      //   item.id==16 ? this.businessType=2 : this.businessType='';
      //   this.secCategoryData.categoryIndex = index;
      //   this.secCategoryData.smallCategoryIndex = -1;

      //   this.categoryId = item.id;
      //   this.secCategoryData.allCategorySmallDataList = [{name: '不限', id: undefined}];
      //   this.secCategoryData.allCategorySmallDataList = this.secCategoryData.allCategorySmallDataList.concat(item.supplyDemandCategoryVos);
      // },
      // selCategory(item, index){
      //   this.secCategoryData.smallCategoryIndex = index - 1;
      //   if(this.categoryId == undefined){
      //     this.categoryId = 2;
      //   }
      //   console.log(this.categoryId);
      //   this.categorySmallId = item.id;
      //   this.$set(this.tabBarData.tabList, 1, item.name=='不限'&&this.businessType==2  ? '家具建材': item.name);
      //   this.navData.navFlag = false; //关闭下拉tab
      //   this.isShowMark = false; //关闭浮层
      //   if(item.id==17){ //装修公司
      //     this.businessType=5;
      //     this.dataReturnListData(this.businessType,item.value);
      //   }else if(item.id==18){
      //     this.businessType=3;
      //     this.dataReturnListData(this.businessType,item.value);
      //   }else if(item.id==19){
      //     this.businessType=6;
      //     this.dataReturnListData(this.businessType,item.value);
      //   }else if(item.id==20||item.id==21||item.id==22){
      //     this.businessType=2;
      //     this.dataReturnListData(this.businessType);
      //   }else if(item.id==undefined){
      //     this.businessType==2 ? this.businessType : this.businessType='';
      //     this.dataReturnListData(this.businessType,item.value);
      //   }

      // },
      dataReturnListData(businessType){
        console.log(this.cityCode, this.areaCode, this.streetCode)
        this.listData=[];
        let sourceData = {
          // provinceCode:'',
          cityCode: this.cityCode,
          areaCode: this.areaCode,
          streetCode: this.streetCode,
          // categoryIds:categoryIds,
          pageNo:1,
          pageSize:10,
          start:0,
          orderBy:this.orderBy,
          companyId:'',
          shopName:this.searchText, //店铺名
          businessType:businessType,
          platformType:'3',
          sortType :1
        }
        tcfwList(sourceData).then(res => {
          this.listData = get(res, 'data.list') || [];
          setTimeout(()=> {
            this.$refs.wrapperScroll && this.$refs.wrapperScroll.refresh();
          }, 20)
        })
      },
      formatTime(time){
        const sourceTime = new Date(time);
        return `${sourceTime.getFullYear()}-${sourceTime.getMonth()+1}-${sourceTime.getDate()}`
      }
    },
    components: {
      dropDownCitySeletor
    },
    created() {
      this.cityCode = this.item.areaCode;
      this.areaCode = sessionStorage.getItem('serviceAreaCode');
      this.streetCode = sessionStorage.getItem('serviceStreetCode');
      this.dataReturnListData(sessionStorage.getItem('currentTab'));
      this.tabBarData.tabList.splice(0, 1, this.$store.state.citySelector.item.areaName);
    },
    watch: {
      selCountryData(val){
        this.commitCountryData = val.filter(item => typeof item === "string")
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~views/Search/styles/searchService.scss';
</style>
