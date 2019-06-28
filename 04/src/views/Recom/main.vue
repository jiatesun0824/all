<template>
  <div class="recom__container" @touchmove.prevent>
    <div class="recom__header">
      <search-plan :showSearchBar="showSearchBar" @hideSearch="showSearchBar = false" @searchKw="searchKw"></search-plan>
      <i class="recom__header--icon" @click="showSearchBar = true">
        <svg style="width: 1.2em; height: 1.2em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M975.994 873.946L776.519 686.834c115.098-158.103 97.1-380.864-49.207-518.099-158.48-148.643-407.429-140.682-556.059 17.783C22.61 344.974 30.571 593.92 189.037 742.576c146.304 137.241 369.76 140.966 520.185 16.005l199.475 187.112c19.813 18.585 50.94 17.59 69.524-2.224 18.586-19.812 17.59-50.94-2.223-69.524l-0.004 0.001z m-741.547-179.8c-131.715-123.54-138.334-330.493-14.783-462.218 123.56-131.715 330.515-138.333 462.214-14.782 131.73 123.566 138.349 330.513 14.783 462.218-123.536 131.725-330.49 138.344-462.214 14.782z m21.869-23.313"></path><path d="M320.376 323.494c-9.86-9.859-25.834-9.859-35.694 0-34.514 34.514-53.502 80.372-53.502 129.183 0 48.79 18.987 94.676 53.502 129.14a25.16 25.16 0 0 0 17.847 7.39 25.16 25.16 0 0 0 17.848-7.39c9.866-9.868 9.866-25.865 0-35.701-24.947-24.947-38.707-58.135-38.707-93.44 0-35.327 13.754-68.506 38.707-93.482 9.865-9.868 9.865-25.842-0.001-35.7z"></path></svg>
      </i>
      <!-- 修改导航 -->
      <div class="recom__header--title" v-if="isIntermediary == 11">
        <div class="header-title-keyPlans">装修效果</div>
      </div>
      <div class="recom__header--title" v-else>
        <div class="header-title-keyPlan" @click="swichPlanType(0)" :class="{'header-title-active': navigateIndex == 0}">一键方案</div>
        <div class="header-title-span"> </div>
        <div class="header-title-sample" @click="swichPlanType(1)" :class="{'header-title-active': navigateIndex == 1}">样板方案</div>
      </div>
    </div>
    <div class="recom__nav" v-if="planList">
      <div class="nav__content">
        <swiper :options="navOption" ref="nav">
          <swiper-slide class="nav__item--name"
          :class="{'active': item.active}"
          v-for="(item, index) in spaceList"
          :key="index" v-text="item.name"
          @click.native="swichSpace(index)"
          ></swiper-slide>
        </swiper>
        <div class="nav__filtrate-logo" @click='filterSelectType'></div>
      </div>
      <transition name="dropdown">
        <div class="nav__menu" v-show='showNavContent'>
          <!-- <transition name="dropdown" @after-leave="detailContentLeaved(isSwitchTab)">
            <div class="menu__content" v-if="showNavContent">
              <span class="menu__item" :class="{active: item.active}" v-for="(item, index) in detailItemList" :key="index" v-text="item.name" @click.stop="selectItem(index)"></span>
            </div>
          </transition> -->
          <scroll beforeScroll ref="typeScroll">
            <div>
              <!-- 风格面积 -->
              <div class='fitment-type' v-show='currSelectType>0'>
                <div class="menu__title">风格</div>
                <div class="menu__content">
                  <span class="menu__item"
                  @click='swichFitmentActive(0, index)'
                  :class="{'active': filtrateListActiveList[0] == index}" v-for="(item, index) in styleList" :key="index" v-text="item.name"></span>
                </div>
                <div class="menu__title" v-if="isIntermediary != 11">面积</div>
                <div class="menu__content" v-if="isIntermediary != 11">
                  <span class="menu__item"
                  @click='swichFitmentActive(1, index)'
                  :class="{'active': filtrateListActiveList[1] == index}" v-for="(item, index) in areaList" :key="index" v-text="item.name"></span>
                </div>
              </div>
            <!-- 装修报价 -->
              <div class="fitment-price" v-if="isIntermediary != 11">
                <div class="menu__title">装修方式</div>
                <div class="menu__content">
                  <span class="menu__item"
                  @click='swichFitmentActive(2, index)'
                  :class="{'active': filtrateListActiveList[2] == index}" v-for="(item, index) in fitmentTypeList" :key="index" v-text="item.name"></span>
                </div>
                <div class="menu__title">装修价格</div>
                <div class="menu__content">
                  <span class="menu__item"
                  @click='swichFitmentActive(3, index)'
                  :class="{'active': filtrateListActiveList[3] == index}" v-for="(item, index) in fitmentTypeList[filtrateListActiveList[2]].sonList" :key="index" v-text="item.name"></span>
                </div>
              </div>
            </div>
          </scroll>
          <div class="menu__operation">
            <div class="menu__reset" @click='operationFourActive("reset")'>重置</div>
            <div class="menu__confirm" @click='operationFourActive("confirm")'>确定</div>
          </div>
        </div>
      </transition>
    </div>
    <div class="recom__list">
      <scroll :data="planList" beforeScroll pullup v-if="planList.length" @scrollToEnd="loadMore" ref="planScroll">
        <div class="list__scroll" v-load-more="!isAllData" v-all-loaded="isAllData">
          <div class="list__content">
            <div class="banner" v-if="isIntermediary == 11">
              <swiper class="swiper-wrapper" :options="swiperOption">
                <swiper-slide class="swiper-box" v-for="(item, index) in bannerList" :key="index">
                  <img :src="filterImg(item.picPath)" alt="">
                </swiper-slide>
              </swiper>
            </div>
            <plan-item showLabel v-for="(item, index) in planList"
            @showDecoratePriceBox="showDecoratePriceBox"
            :key="index" :index="index" :itemData="item"  :showEnterDecorate="isEqual(get(navgateList, '0.value'), 'decorate')" :ref="`recomItem${index}`" @click.native="goCaseDetails(item)"></plan-item>
          </div>
        </div>
      </scroll>
      <empty v-if="planList && !planList.length"></empty>
    </div>
    <div class="plan__decorate" v-show='decoratePriceBox' @click.stop>
      <div class="plan__decorate--box">
        <div class="plan__decorate--title">
          装修报价
        </div>
        <div class="plan__decorate--list">
          <div class="plan__decorate--item" v-for='(item, index) in decoratePriceList' :key='index'>
            <div class="plan__decorate--main clearfix">
              <div class="fl">{{item.decorateTypeName}}</div>
              <div class="fr">￥{{item.decoratePrice}}/m²</div>
            </div>
            <div class="plan__decorate--secondary">{{item.text}}</div>
          </div>
        </div>
        <div class="plan__decorate--confirm" @click='decoratePriceBox=false'>我知道了</div>
      </div>
    </div>
    <limitAlert v-if="limitAlertShow" @skt="skt"></limitAlert>
    <skt v-if="sktShow"></skt>
  </div>
</template>

<script>
import searchPlan from './components/searchPlan';
import planItem from 'components/PlanItem';
import { mapGetters, mapActions } from 'Vuex';
import { pick, values, get, isEqual, isArray } from 'lodash';
import { getBannerList } from 'api/home';

export default {
  name: 'recom',
  data() {
    return {
      // 试用套餐过期弹框
      limitAlertShow: false,

      swiperOption: {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        initialSlide: 0, // 默认页面
        // loop: true,
        observer: true,
        observeParents: true,
        coverflowEffect: {
          rotate: 0,
          stretch: 35,
          depth: 100,
          modifier: 0,
          slideShadows: false
        }
      },
      bannerList: [],
      isIntermediary: JSON.parse(localStorage.getItem('userInfo')).userType,
      showSearchBar: false,
      searchKeyword: '',
      currSelectType: 0,
      showNavDetail: false,
      showNavContent: false,
      isSwitchTab: false,
      detailItemList: [],
      start: 0,
      navOption: {
        slidesPerView: 5,
        spaceBetween: 10,
        observer: true,
        observeParents: true
      },
      navigateIndex: 0,
      filtrateListActiveList: [0, 0, 0, 0],
      decoratePriceBox: false,
      decoratePriceList: [],

      // VIP申请开通成功
      sktShow: false
    }
  },
  computed: {
    ...mapGetters("common", ["userInfo"]),
    ...mapGetters('recom', [
      'planTypeList',
      'spaceList',
      'styleList',
      'areaList',
      'navgateList',
      'planList',
      'planCount',
      'fitmentTypeList'
    ]),
    isAllData() {
      return isArray(this.planList) && (this.planList.length === this.planCount);
    }
  },
  methods: {
    ...mapActions('recom', [
      'queryPlanTypeList',
      'querySpaceList',
      'queryStyleList',
      'queryAreaList',
      'queryPlanList',
      'changeNavgateActive',
      'changeNavgateItemActive',
      'getFitmentTypeList',
      'changeFourActive',
      'changeRecomType'
    ]),
    ...mapActions('caseDetail', ['setCaseDetail', 'setDisplayType']),
    get,
    isEqual,
    filterImg(img) {
      return this.userInfo.resourcesUrl + img;
    },
    goCaseDetails(item) {
      this.$router.push({
        path: '/caseDetails'
      })
      this.setCaseDetail(item);
    },
    showDecoratePriceBox(item) {
      this.decoratePriceList = item
      this.decoratePriceBox = true
    },
    async operationFourActive(type) {
      if (type === 'reset') {
        this.filtrateListActiveList = [0, 0, 0, 0]
      } else {
        this.filtrateListActiveList.forEach((value, index) => { this.changeFourActive({parentIndex: index, index: value}) }) ;
        this.showNavContent = false;
        this.start = 0;
        await this.queryPlanList();
        this.$refs.planScroll && this.$refs.planScroll.scrollTo(0, 0, 100);
      }
    },
    filterSelectType() {
      this.showNavContent = !this.showNavContent;
      this.showNavContent && this.$nextTick(() => { this.$refs.typeScroll.refresh() });
    },
    swichFitmentActive(parentIndex, index) {
      let count = null;
      this.filtrateListActiveList[parentIndex] == index?count = 0: count = index
      this.$set(this.filtrateListActiveList, parentIndex, count);
      parentIndex === 2 && this.$nextTick(() => { this.$refs.typeScroll.refresh() });
    },
    async swichPlanType(index) {
      // console.log(index,7777)
      this.navigateIndex = index
      this.changeNavgateItemActive({parentIndex: 0, itemIndex: index});
      this.filtrateListActiveList = [0, 0, 0, 0];
      this.filtrateListActiveList.forEach((value, index) => { this.changeFourActive({parentIndex: index, index: value}) });
      this.changeRecomType(index);
      await this.queryPlanList();
      this.$refs.planScroll && this.$refs.planScroll.scrollTo(0, 0, 100);
      this.setDisplayType(index)
    },
    async swichSpace(index) {
      this.currSelectType = index
      this.changeNavgateItemActive({parentIndex: 1, itemIndex: index});
      this.filtrateListActiveList = [0, 0, 0, 0];
      this.filtrateListActiveList.forEach((value, index) => { this.changeFourActive({parentIndex: index, index: value}) }) ;
      this.showNavContent = false;
      this.start = 0;
      await Promise.all([this.queryStyleList(), this.queryAreaList()])
      .then(res => { this.queryPlanList({ start: this.start }); });
      this.$refs.planScroll && this.$refs.planScroll.scrollTo(0, 0, 100);
      // this.changeNavgateActive({index: this.currSelectType, active: false});
    },
    selectType(index) {
      if(this.currSelectType === index && this.showNavDetail && this.showNavContent) {
        this.changeNavgateActive({index: index, active: false});
        this.showNavContent = false;
        return;
      }

      this.detailItemList = values(pick(this, ['planTypeList', 'spaceList', 'styleList', 'areaList']))[index];

      if(this.currSelectType !== index && this.showNavContent) {
        this.currSelectType = index;
        [this.isSwitchTab, this.showNavContent] = [true, false];
        this.changeNavgateActive({index: index, active: true})
        return;
      }

      this.currSelectType = index;
      [this.showNavDetail, this.showNavContent] = Array(2).fill(true);
      this.changeNavgateActive({index: index, active: true});
    },
    detailContentLeaved(isChange) {
      this.showNavContent = isChange;
      if(!isChange) this.showNavDetail = false;
      this.isSwitchTab = false;
    },
    closeSelectPannel() {
      this.showNavContent = false;
      this.changeNavgateActive({index: this.currSelectType, active: false})
    },
    async selectItem(index) {
      this.changeNavgateItemActive({parentIndex: this.currSelectType, itemIndex: index});
      this.changeNavgateActive({index: this.currSelectType, active: false});
      this.showNavContent = false;
      this.start = 0;
      if(this.currSelectType === 1) {
        await Promise.all([this.queryStyleList(), this.queryAreaList()])
        .then(res => { this.queryPlanList(); });
      }
      else {
        await this.queryPlanList();
      }
      this.$refs.planScroll && this.$refs.planScroll.scrollTo(0, 0, 100);
    },
    searchKw(keyword) {
      this.searchKeyword = keyword;
      this.start = 0;
      this.queryPlanList({planName: this.searchKeyword})
    },
    loadMore() {
      if(!this.isAllData) {
        this.start++;
        this.queryPlanList({start: this.start, planName: this.searchKeyword})
      }
    },
    skt() {
      this.API.applyFormal().then(res=> {
        if(res.success) {
          this.sktShow = true;
          this.limitAlertShow = false;
          sessionStorage.setItem('sktShow', JSON.stringify(this.sktShow));
        }
      })
    },
  },
  components: {
    searchPlan,
    planItem
  },
  created() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(JSON.parse(sessionStorage.getItem('sktShow'))) {
      this.sktShow = true;
    }else if(userInfo.userType == 5 && userInfo.maturityFlag && userInfo.serviceType==1) {
      this.limitAlertShow = true;
    }
    getBannerList({positionCode: 'mobile2B:plan:top:banner', basePlatformId: 1}).then(res => {
      if (res.datalist) {
        this.bannerList = res.datalist;
      }
    });
    this.queryPlanTypeList()
    this.querySpaceList()
    this.getFitmentTypeList() // 获取装修报价
  },
  beforeRouteEnter(to, from, next) {
    to.meta.keepNotAlive = false;
    next();
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepNotAlive = !(to.name === 'view720' || to.name === 'photoview');
    let keepAliveComponent = this.$parent.$vnode.parent;
    if(keepAliveComponent && from.meta.keepNotAlive) {
      if(keepAliveComponent.componentInstance.keys){
        delete keepAliveComponent.componentInstance.cache[keepAliveComponent.componentInstance.keys[0]];
      }
      keepAliveComponent.componentInstance.keys = [];
    }
    next();
  }
}
</script>

<style lang="scss" scoped>
  .fl {
    float: left;
  }
  .fr{
    float: right;
  }
  .clearfix:after {
      content: '';
      height: 0;
      line-height: 0;
      clear: both;
      visibility: hidden;
      display: block;
  }
  .clearfix {
      zoom: 1;
  }
  .banner{
    margin-bottom: 20px;
    .swiper-wrapper{
      .swiper-box{
        box-sizing: border-box;
        height: 200px;
        width: 690px;
        img{
          display: block;
          height: 200px;
          width: 690px;
        }
      }
    }
  }
  .plan__decorate{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index:100;
    .plan__decorate--box{
      width: 540px;
      height: 680px;
      border-radius: 10px;
      background-color: #ffffff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 0 60px;
      box-sizing: border-box;
      .plan__decorate--title{
        margin-top: 38px;
        line-height: 53px;
        text-align: center;
        color: #333;
        font-size: 32px;
      }
      .plan__decorate--item{
        margin-top: 32px;
        .plan__decorate--main{
          color: #333;
          line-height: 48px;
          font-size: 28px;
        }
        .plan__decorate--secondary{
          color: #999;
          font-size: 24px;
          line-height: 28px;
        }
      }
      .plan__decorate--confirm{
        margin-top: 50px;
        width: 420px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        color: #fff;
        background-color: #ff6419;
        font-size: 32px;
        border-radius: 40px;
      }
    }
  }
.recom {

  @at-root #{&}__container {
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  @at-root #{&}__header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    position: relative;
    height: 88px;
    font-size: 36px;
    //border-bottom: 1px solid #e8e8e8; /*no*/
    box-sizing: border-box;
    background-color: #fff;
    z-index: 20;

    @at-root #{&}--icon {
      position: absolute;
      left: 26px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
  }

  @at-root #{&}__nav {

    @at-root .nav {

      @at-root #{&}__content {
        display: flex;
        justify-content: space-between;
        position: relative;
        background-color: #fff;
        z-index: 15;
      }

      @at-root #{&}__item {
        flex-basis: 25%;
        height: 88px;
        line-height: 88px;
        text-align: center;
        font-size: 28px;
        @at-root #{&}--icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          background-size: 100%;
          background-image: url("./images/arrow.png");
        }

        &.active {
          color: #ff6419;

          .nav__item--icon {
            background-image: url("./images/arrow_active.png");
          }
        }
      }

      @at-root #{&}__menu {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-top: 176px;
        box-sizing: border-box;
        background-color: white;
        z-index: 10;
        // overflow-y: auto;
        padding-bottom: 176px;

        &.dropdown-enter-active{
          transition: all 200ms ease
        }
        &.dropdown-leave-active {
          transition: all 150ms ease
        }

        &.dropdown-enter, &.dropdown-leave-active {
          transform: translate3d(0, 100%, 0)
        }

        @at-root .menu {
          @at-root #{&}__title{
            line-height: 88px;
            padding-left: 30px;
            color: #000;
            font-size: 28px;
          }
          @at-root #{&}__operation {
            line-height: 88px;
            height: 88px;
            width: 100%;
            display: flex;
            text-align: center;
            font-size: 32px;
            position: fixed;
            bottom: 88px;
            left: 0;
            .menu__reset{
              flex: 1;
              color: #333;
              box-sizing: border-box;
              border-top: #e8e8e8 1px solid;
              background-color: #fff;
            }
            .menu__confirm{
              flex: 2;
              color: #fffefe;
              background-color: #ff6419;
            }
          }
          @at-root #{&}__content {
            display: flex;
            flex-wrap: wrap;
            padding: 30px;
            background-color: #fff;
          }

          @at-root #{&}__item {
            flex-basis: 32%;
            height: 80px;
            line-height: 80px;
            text-align: center;
            font-size: 28px;
            color: #333333;
            background-color: #f5f5f5;
            border-radius: 5px;

            &:nth-of-type(n+4) {
              margin-top: 20px;
            }

            &:not(:nth-of-type(3n+3)) {
              margin-right: 2%;
            }

            &.active {
              color: #ff6419;
              background-color: #fff1eb;
            }
          }
        }
      }
    }
  }

  @at-root #{&}__list {
    flex: 1;
    height: 100%;
    overflow: hidden;
    padding: 20px 30px 98px;
    background-color: #f5f5f5;
    @at-root .list {

      @at-root #{&}__scroll {
        padding-bottom: 30px;
      }
    }
  }
}

.recom__header--title{
  display: flex;
  width: 367PX;
  height: 100%;
  line-height: 88px;
  font-size: 36px;
  .header-title-keyPlan{
    flex: 10;
    text-align: right;
  }
  .header-title-keyPlans{
    flex: 10;
    text-align: center;
  }
  .header-title-span{
    flex: 2;
    text-align: center;
    color:#e8e8e8;
    font-size:24px;
    font-weight: bold;
  }
  .header-title-sample{
    flex: 10;
    text-align: left;
  }
  .header-title-active{
    color: #ff6419;
  }
}
.nav__content{
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88px;
    padding: 0 80px 0 30px;
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
  .swiper-container{
    padding-right: 100px;
  }
  .nav__item--name{
    flex-basis: 120px;
    line-height: 88px;
    text-align: center;
    font-size: 32px;
    color: #333;
    position: relative;
    box-sizing: border-box;
    &.active{
      color: #ff6419;
      &:after{
        content: '';
        display: block;
        width: 20px;
        height: 6px;
        background: #ff6419;
        position: absolute;
        bottom: 0;
        left: 50%;
        margin-left: -10px;
      }
      /*color: #ff6419;*/
      /*border-bottom: #ff6419 4px solid;*/
    }
  }
  .nav__filtrate-logo{
    background-size: 100% 100%;
    width: 30px;
    height: 33px;
    position: absolute;
    top: 28px;
    right: 25px;
    background-image: url('./images/@2x筛选.png');
  }
}
</style>
