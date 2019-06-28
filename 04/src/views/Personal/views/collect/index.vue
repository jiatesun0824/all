<template>
  <div class="collect">
    <transition name="fade">
      <cancelcollect v-if="subHintPopup"></cancelcollect>
    </transition>
    <div class="collect-popup-wrapper" v-if="collectListShow">
      <ul class="favorites-container">
        <div class="dot-top" :class="triangle ? 'dot-top-active' : ''"></div>
        <li class="favorites-item"
          :class="favoritesIndex == -2 ? 'favorites-content-active' : ''"
          @touchstart="favoritesSelColor(-2)"
          @click="favoritesSel(-2)"
        >全部</li>
        <li class="favorites-item"
            v-for="(item,index) in favoritesList"
            v-bind:key="item"
            :style="favoritesList.length -1 == 0 ? 'border: 0; border-radius: 0.1rem' : index == favoritesList.length -1 ? 'border: 0; border-radius: 0 0 0.1rem 0.1rem' : index == 0 ? 'border-radius: 0.1rem 0.1rem 0 0' : ''"
            :class="favoritesIndex == index ? 'favorites-content-active' : ''"
            @touchstart="favoritesSelColor(index)"
            @click="favoritesSel(index)"
        >{{index == 0 ? item.name + '收藏夹' : item.name}}</li>
      </ul>
      <div class="collect-mask" @click="shadeGoBack"></div>
    </div>
    <div class="collect-wrapper">
      <div class="header-box">
        <div class="type-header">
          <span class="goback" @click="goBack"></span>
          <span>收藏</span>
           <a class="collectList" @click="shadeGoBack"></a>
        </div>
      </div>
      <div class="nav-wrapper">
        <v-nav :type="0" :index="3"></v-nav>
        <v-nav :type="1" :index="4"></v-nav>
      </div>
      <div class="nav-list-wrapper">
        <swiper :options="navListOption" ref="navListSwiper" class="nav-list" v-if="collectNavFlag">
          <swiper-slide class="nav-list-item" v-for="(item,index) in spaceList" :index="index" :key="index" :class="spaceActiveIndex===index ? 'active-slide' : ''">
            <span class="nav-list-item-name" @click="selNav(index)">{{item.name}}</span>
          </swiper-slide>
        </swiper>
        <swiper :options="navListOption" ref="navListSwiper" class="nav-list" v-else>
          <swiper-slide class="nav-list-item" v-for="(item,index) in collectStyleList" :index="index" :key="index" :class="styleActiveIndex===index ? 'active-slide' : ''">
            <span class="nav-list-item-name" @click="selNav(index)">{{item.name}}</span>
          </swiper-slide>
        </swiper>
      </div>
      <div class="line"></div>
      <div class="content">
        <swiper :options="contentOption" ref="contentSwiper" class="content-list" v-if="collectNavFlag">
          <swiper-slide class="content-list-item" v-for="(item,index) in spaceList" :key="index">
            <scroll class="wrapper"
                    :data="data"
                    :pullup="pullup"
                    :beforeScroll="beforeScroll"
                    @pullup="loadData"
                    v-if="spaceActiveIndex == index"
            >
              <ul class="list-wrapper">
                <li class="collect-list" v-for="(item,index) in data" :index="index" :key="index">
                  <img class="pic" src="" v-lazy="resourcesUrl + item.coverPath">
                  <span class="collect-icon" @click="subDesingPlanCollect(index)"></span>
                  <div class="info-wrapper">
                    <span class="address">{{item.planName}}</span>
                    <span class="date">{{item.releaseTime}}</span>
                  </div>
                  <div class="btn-wrapper clearfix">
                    <div class="view-btn photo-btn" @click="selPhoto(index, $event)" :class="viewIndex===index ? 'activeView' : ''"></div>
                    <div class="view-btn fullview-btn" @click="sel720(index, $event)" :class="viewIndex===index ? 'activeView' : ''"></div>
                    <!-- <div class="view-btn nosee roam-btn" @click="selRoam(index, $event)" :class="viewIndex===index ? 'activeView' : ''"></div>
                    <div class="view-btn nosee video-btn" @click="selVideo(index, $event)" :class="viewIndex===index ? 'activeView' : ''"></div> -->
                  </div>
                </li>
                <div class="loading-wrapper">{{loadEnd}}</div>
              </ul>
            </scroll>
            <loadfail v-if="loadfailFlag"></loadfail>
            <loading v-if="loadingFlag"></loading>
          </swiper-slide>
        </swiper>
        <swiper :options="contentOption" ref="contentSwiper" class="content-list" v-else>
          <swiper-slide class="content-list-item" v-for="(item,index) in collectStyleList" :key="index">
            <scroll class="wrapper"
                    :data="data"
                    :pullup="pullup"
                    :beforeScroll="beforeScroll"
                    @pullup="loadData"
                    v-if="styleActiveIndex == index"
            >
              <ul class="list-wrapper">
                <li class="collect-list" v-for="(item,index) in data" :index="index" :key="index">
                  <img class="pic" src="" v-lazy="resourcesUrl + item.coverPath">
                  <span class="collect-icon" @click="subDesingPlanCollect(index)"></span>
                  <div class="info-wrapper">
                    <span class="address">{{item.planName}}</span>
                    <span class="date">{{item.releaseTime}}</span>
                  </div>
                  <div class="btn-wrapper clearfix">
                    <div class="view-btn photo-btn" @click="selPhoto(index, $event)" :class="viewIndex===index ? 'activeView' : ''"></div>
                    <div class="view-btn fullview-btn" @click="sel720(index, $event)" :class="viewIndex===index ? 'activeView' : ''"></div>
                    <!-- <div class="view-btn nosee roam-btn" @click="selRoam(index, $event)" :class="viewIndex===index ? 'activeView' : ''"></div>
                    <div class="view-btn nosee video-btn" @click="selVideo(index, $event)" :class="viewIndex===index ? 'activeView' : ''"></div> -->
                  </div>
                </li>
                <div class="loading-wrapper">{{loadEnd}}</div>
              </ul>
            </scroll>
            <loadfail v-if="loadfailFlag"></loadfail>
            <loading v-if="loadingFlag"></loading>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import nav from './components/nav';
  import { mapState } from 'Vuex';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import {bus} from 'api/api.js';

  const limit = 10;

  export default {
    data() {
      return {
        navListOption: {
          notNextTick: true,
          freeMode: false,
          spaceBetween: 10,
          slidesPerView: 4
        },
        contentOption: {
          notNextTick: true,
          freeMode: false,
          threshold: 30,
          preventLinksPropagation: false, // 拖动Swiper时阻止click事件
          onSlideChangeStart: (contentSwiper) => { // 页面内容滑动逻辑
            if (this.collectNavFlag) {
              this.spaceActiveIndex = contentSwiper.activeIndex;
              sessionStorage.setItem('name', this.$store.state.spaceList[contentSwiper.activeIndex].name); // 风格nav列表传空间名字参数
              sessionStorage.setItem('collectHouseType', this.$store.state.spaceList[contentSwiper.activeIndex].value); // 设置选择的空间类型作为传参使用
              this.getStyleList();
              this.navListSwiper.slideTo(this.spaceActiveIndex, 100, false);
              this.styleActiveIndex = 0;
              this.$store.dispatch('setLoader');
            } else {
              this.styleActiveIndex = contentSwiper.activeIndex;
              if (contentSwiper.activeIndex === 0) {
                sessionStorage.setItem('designRecommendedStyleId', '');
              } else {
                sessionStorage.setItem('designRecommendedStyleId', this.$store.state.collectStyleList[contentSwiper.activeIndex].id);
              }
              this.navListSwiper.slideTo(this.styleActiveIndex, 100, false);
              this.$store.dispatch('setLoader');
            }
            this.initScroll();
          }
        },
        spaceActiveIndex: 0,
        styleActiveIndex: 0,
        data: [],
        pullup: true,
        beforeScroll: true,
        page: 0, // 分页数
        loadEnd: '',
        planList: '', // 方案列表
        loadfailFlag: false,
        supplement: [{name: '全部', value: ''}], // 补全全部选项按钮
        viewIndex: -1, // 720下标
        favoritesList: [], // 收藏夹列表
        triangle: false, // 三角形变色标志
        favoritesIndex: -1, // 触发收藏夹索引
        initload: true,
        timer: null,
        delBidList: []
      };
    },
    watch: {
      collectNavFlag(val) { // 切换选项卡(空间、风格), 内容slide页码跳转到对应位置
        if (!val) {
          this.navListSwiper.slideTo(0, 0, false);
          this.contentSwiper.slideTo(0, 0, false);
        } else {
          this.navListSwiper.slideTo(0, 0, false);
          this.contentSwiper.slideTo(this.spaceActiveIndex, 0, false);
        }
      }
    },
//    activated() {
//      this.initScroll();
//    },
    created() {
      this.API.getFavoritesList({ // 获取收藏夹列表
        msgId: localStorage.getItem('userId'),
        token: localStorage.getItem('token')
      }).then((response) => {
        if (response) {
          this.favoritesList = response.datalist;
        }
      });
      if (this.$store.state.happenCollect) {
        this.$store.state.happenCollect = false;
      }
      sessionStorage.setItem('name', '客餐厅');
      this.getStyleList();
      sessionStorage.setItem('collectHouseType', '3');
//      this.loadData();
      this.initScroll();
    },
    mounted() {},
    methods: {
      goBack() {
        this.$store.state.intergralHeader = true;
        this.$store.commit('showComComponents', true);
        this.$router.push('/personal');
      },
      selNav(index) {
        if (this.collectNavFlag) {
          this.spaceActiveIndex = index;
          sessionStorage.setItem('name', this.$store.state.spaceList[index].name);
          sessionStorage.setItem('collectHouseType', this.$store.state.spaceList[index].value);
          sessionStorage.setItem('designRecommendedStyleId', '');
          this.styleActiveIndex = 0;
        } else {
          this.styleActiveIndex = index;
          if (index === 0) {
            sessionStorage.setItem('designRecommendedStyleId', '');
          } else {
            sessionStorage.setItem('designRecommendedStyleId', this.$store.state.collectStyleList[index].id);
          }
        }
        this.contentSwiper.slideTo(index, 500, false);
        this.$store.state.loadingFlag = true;
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.initScroll();
        }, 500);
      },
      getStyleList() { // 获取风格列表
        this.API.style({ // 根据空间类型得到风格列表
          houseName: sessionStorage.getItem('name')
        }).then((response) => {
          if (response) {
            let result = response.datalist;
            this.$store.state.collectStyleList = this.supplement.concat(result);
          }
        });
      },
      // 初始化上拉加载
      initScroll() {
        this.data = [];
        this.page = 0;
        this.loadEnd = '';
        this.loadData();
      },
      // 全景图片点击事件
      sel720(index, event) {
        if (this.$route.path == '/view720') {
          return;
        }
        this.$store.state.goBackPath = this.$route.path;
        sessionStorage.setItem('operationSource', 1);
        sessionStorage.setItem('msgId', 'recommended');
        sessionStorage.setItem('bid', this.data[index].bid);
        // this.$store.commit('audioAutoPlay');
        if (!event._constructed) {
          return;
        }
        // this.viewIndex = index;
        sessionStorage.setItem('groupPlanId', this.data[index].planRecommendedId);
        this.$store.state.view720.view720Id = this.data[index].planRecommendedId;
        sessionStorage.setItem('planId', this.data[index].planId);
        this.API.recomGetPictureList({
          planRecommendedId: this.data[index].planRecommendedId,
          remark: '720'
        }).then((response) => {
          if (response) {
            if (response.totalCount === 0) {
              this.$store.commit('popupMsg', '当前设计图没有720°全景');
              this.$store.commit('showPopup');
              return;
            }
            sessionStorage.setItem('planRecommendedId', this.data[index].planRecommendedId);
            this.$store.state.renderSign = false;
            this.$store.state.collectSignFlag = true;
            this.$store.state.view720.view720Small = response.datalist;
            this.$store.state.smallTitle = this.data[index].planName;
            this.$store.state.view720LoadingFlag = true;
            this.$store.state.fasttype = 'recommended';
            this.$router.push('/view720');
          }
        });
      },
      // 图片集点击事件
      selPhoto(index, event) {
        if (!event._constructed) {
          return;
        }
        this.$store.state.photoView.photoViewId = this.data[index].planRecommendedId;
        sessionStorage.setItem('bid', this.data[index].bid);
        this.$store.state.collectSignFlag = true; // 添加收藏标识
        this.API.recomGetPictureList({
          planRecommendedId: this.$store.state.photoView.photoViewId,
          remark: 'photo'
        }).then((response) => {
          if (response) {
            if (response.totalCount == 0) {
              this.$store.commit('popupMsg', '当前设计没有图片');
              this.$store.commit('showPopup');
            } else {
              sessionStorage.setItem('planRecommendedId', this.data[index].planRecommendedId);
              this.$store.state.photoView.photoViewSmall = response.datalist;
              this.$store.state.photoView.photoViewTitle = this.data[index].planName;
              this.$router.push('/photoview');
            }
          }
        });
      },
      selRoam(index, event) {
        if (!event._constructed) {
          return;
        }
        this.$store.state.view720.view720Id = this.data[index].planId;
        sessionStorage.setItem('bid', this.data[index].bid);
        this.API.recomGetPictureList({
          planRecommendedId: this.$store.state.view720.view720Id,
          remark: 'roam'
        }).then((response) => {
          if (response) {
            if (response.totalCount == 0) {
              this.$store.commit('popupMsg', '当前设计没有720多点全景');
              this.$store.commit('showPopup');
            } else {
              this.$store.state.view720.view720Small = response.datalist;
              this.$store.state.view720.view720Title = this.data[index].name;
              this.$router.push('/view720');
            }
          }
        });
      },
      selVideo(index, event) {
        if (!event._constructed) {
          return;
        }
        this.$store.state.videoView.videoViewId = this.data[index].planId;
        this.API.recomGetPictureList({
          planRecommendedId: this.$store.state.videoView.videoViewId,
          remark: 'video'
        }).then((response) => {
          if (response) {
            if (response.totalCount == 0) {
              this.$store.commit('popupMsg', '当前设计没有漫游视频');
              this.$store.commit('showPopup');
            } else {
              this.$store.state.fullView.fullViewSmall = response.datalist;
              this.$store.state.fullView.fullViewTitle = this.data[index].name;
              this.$router.push('/videoview');
            }
          }
        });
      },
      loadData() {
        if (this.loadEnd == '没有更多数据') {
          this.initload = true;
          return;
        }
        let userId = localStorage.getItem('userId'), // 用户id
          token = localStorage.getItem('token'),
          start = 0;
        let pageStart = start + limit * this.page,
          collectHouseType = sessionStorage.getItem('collectHouseType') || '3', // 样板房类型，默认3为客餐厅
          designRecommendedStyleId = sessionStorage.getItem('designRecommendedStyleId'); // 风格筛选条件
        this.API.collect({
          msgId: userId,
          houseType: collectHouseType,
          livingName: '',
          areaValue: '',
          designRecommendedStyleId: designRecommendedStyleId,
          limit: limit,
          start: pageStart,
          favoriteBid: sessionStorage.getItem('fid') || '',
          token: token
        }).then((response) => {
//          this.getStyleList();
          this.page++;
          let loadmore = response.datalist;
          if (loadmore.length == 0) {
            this.loadfailFlag = true;
            this.initload = true;
            this.$store.state.loadfailTxt = '您目前还未收藏有设计方案!';
            return;
          } else if (loadmore.length < 10 || loadmore.length == 0) {
            this.loadEnd = '没有更多数据';
          } else {
            this.loadEnd = '加载更多...';
          }
          this.data = this.data.concat(loadmore);
          if (this.data.length - response.totalCount == 0) {
            this.loadEnd = '没有更多数据';
          }
          this.initload = true;
          this.loadfailFlag = false;
        });
      },
      favoritesSelColor(index) { // 收藏夹点击变色
        this.favoritesIndex = index;
        if (index == -2) {
          this.triangle = true;
        }
      },
      favoritesSel(index) { // 选择收藏夹
        this.$store.state.collect.collectListShow = false;
        this.triangle = false;
        this.favoritesIndex = -1;
        if (index == -2) {
          sessionStorage.setItem('fid', '');
        } else {
          sessionStorage.setItem('fid', this.favoritesList[index].bid); // 设置收藏夹bid用作筛选所有收藏列表接口参数使用
        }
        this.initScroll();
      },
      subDesingPlanCollect(index) { // 取消收藏
        let bid = this.data[index].bid;
        let token = localStorage.getItem('token');
        this.API.subDesingPlanCollect({
          msgId: localStorage.getItem('userId'),
          token: token,
          fid: bid
        }).then((response) => {
          if (response.success) {
            this.initScroll();
            this.$store.state.hintMsg = false;
            // this.$store.state.subHintPopup = true;
            this.$store.state.happenCancelCollect = true;
            this.$store.commit('delPlan', bid);
//            this.delBidList.push(bid);
            bus.$emit('updateCollectedStatus', bid);
//            localStorage.setItem('delPlanBidList', this.delBidList); // 缓存删除的方案id
          }
        });
      },
      shadeGoBack() {
        this.$store.state.collect.collectListShow = !this.$store.state.collect.collectListShow;
      }
    },
    components: {
      'v-nav': nav,
      swiper,
      swiperSlide
    },
    computed: mapState({
      serverUrl: state => state.serverUrl,
      resourcesUrl: state => state.resourcesUrl,
      comComponentsShow: state => state.comComponentsShow,
      view720Title: state => state.view720.view720Title,
      view720Url: state => state.view720.view720Url,
      loadfailTxt: state => state.view720.loadfailTxt,
      loadingFlag: state => state.loadingFlag,
      spaceList: state => state.spaceList,
      collectNavFlag: state => state.collect.collectNavFlag,
      collectStyleList: state => state.collectStyleList,
      collectListShow: state => state.collect.collectListShow,
      subHintPopup: state => state.subHintPopup,
      navListSwiper() {
        return this.$refs.navListSwiper.swiper;
      },
      contentSwiper() {
        return this.$refs.contentSwiper.swiper;
      }
    })
  };
</script>

<style lang="scss" scoped>
  @import "styles/mixin.scss";

  .collect-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #eeeeee;
  overflow: hidden;
  z-index: 3;
}

.collect-wrapper .header-box {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 3;
}

.collect-wrapper .header-box .type-header {
  background: #fff;
  color: #333;
  font-size: 36px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  position: relative;
}

.collect-wrapper .header-box .type-header:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  content: '';
}

.collect-wrapper .header-box .type-header .goback {
  width: 25px;
  height: 41px;
  position: absolute;
  left: 34px;
  top: 24px;
  background-size: 25px 41px;
  background-image: url("../../images/back_nor.png");
}

.collect-wrapper .header-box .type-header .goback:active {
  background-image: url("../../images/back_pre.png");
}

.collect-wrapper .header-box .type-header .type-text {
  display: block;
  width: 256px;
  margin: 0 auto;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collect-wrapper .nosee {
  visibility: hidden;
}

.collect-wrapper .nav-list-wrapper {
  position: absolute;
  top: 162px;
  width: 100%;
  height: 80px;
  background-color: #fff;
}

.collect-wrapper .nav-list-wrapper .nav-list {
  margin: 0 30px;
}

.collect-wrapper .nav-list-wrapper .nav-list .nav-list-item {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  height: 80px;
  line-height: 80px;
}

.collect-wrapper .nav-list-wrapper .nav-list .nav-list-item .nav-list-item-name {
  display: block;
  text-align: center;
  font-size: 26px;
  color: #747474;
}

.collect-wrapper .nav-list-wrapper .nav-list .active-slide {
  border-bottom: 4px solid #ff6419;
}

.collect-wrapper .nav-list-wrapper .nav-list .active-slide .nav-list-item-name {
  color: #ff6419;
}

.collect-wrapper .line {
  position: absolute;
  top: 242px;
  width: 100%;
  height: 25px;
  background-color: #eeeeee;
}

.collect-wrapper .content {
  position: absolute;
  top: 267px;
  bottom: 98px;
  width: 100%;
  overflow: hidden;
}

.collect-wrapper .content .content-list {
  width: 100%;
  height: 100%;
}

.collect-wrapper .content .content-list .content-list-item {
  background-color: #eeeeee;
}

.collect-wrapper .content .content-list .content-list-item .wrapper {
  height: 100%;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper {
  width: 100%;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list {
  position: relative;
  padding: 30px 30px 0;
  background-color: #fff;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .pic {
  display: block;
  width: 100%;
  height: 403px;
  border-radius: 10px;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .collect-icon {
  position: absolute;
  right: 50px;
  top: 40px;
  width: 42px;
  height: 40px;
  background-image: url("../../images/collect_pre.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .info-wrapper {
  position: relative;
  width: 100%;
  text-align: absolute;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .info-wrapper .address {
  display: block;
  padding: 26px 0 12px;
  line-height: 30px;
  font-size: 30px;
  color: #494949;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .info-wrapper .date {
  display: block;
  height: 20px;
  line-height: 20px;
  margin: auto;
  font-size: 22px;
  color: #747474;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .btn-wrapper {
  width: 420px;
  position: relative;
  bottom: 150px;
  margin: -30px auto;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .btn-wrapper .view-btn {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  float: left;
  background-size: 60px 60px;
  margin-right: 60px;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .btn-wrapper .photo-btn {
  background-image: url("../../images/photo.png");
  margin-left: 120px;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .btn-wrapper .fullview-btn {
  background-image: url("../../images/fullview.png");
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .btn-wrapper .roam-btn {
  background-image: url("../../images/roam.png");
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .btn-wrapper .video-btn {
  background-image: url("../../images/video.png");
  margin: 0;
}

.collect-wrapper .content .content-list .content-list-item .wrapper .list-wrapper .collect-list .btn-wrapper .activeView {
  background-color: #e69317;
}

.collectList {
  position: absolute;
  display: block;
  top: 30px;
  right: 30px;
  z-index: 2;
  width: 40px;
  height: 28.000000000000004px;
  background-size: 40px 28.000000000000004px;
  background-repeat: no-repeat;
  background-image: url("../../images/list_nor.png");
}

.collect-popup-wrapper .favorites-container {
  position: absolute;
  top: 100px;
  right: 5px;
  z-index: 1000;
  font-size: 26px;
  width: 200px;
  text-align: center;
  background: #e7e7e7;
  border-radius: 10px;
}

.collect-popup-wrapper .favorites-container .favorites-item {
  height: 80px;
  line-height: 80px;
  border-bottom: 1px solid #ddd;
}

.collect-popup-wrapper .favorites-container .favorites-content-active {
  background: #d2d2d2;
}

.collect-popup-wrapper .favorites-container .dot-top {
  font-size: 0;
  line-height: 0;
  border-width: 30px;
  border-color: #e7e7e7;
  border-top-width: 0;
  border-style: dashed;
  border-bottom-style: solid;
  border-left-color: transparent;
  border-right-color: transparent;
  position: absolute;
  right: 15px;
  top: -30px;
}

.collect-popup-wrapper .favorites-container .dot-top-active {
  border-color: #d2d2d2;
  border-left-color: transparent;
  border-right-color: transparent;
}

.collect-popup-wrapper .collect-mask {
  position: absolute;
  top: 88px;
  bottom: 0;
  width: 100%;
  background: #000;
  opacity: 0.2;
  z-index: 999;
}
</style>
