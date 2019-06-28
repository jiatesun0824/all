<template>
  <div class="content">
    <!-- banner 开始 -->
    <div class="banner" :key="hasBanner">
      <!-- v-if="bannerList.length" -->
      <div v-if="!bannerList.length" class="bannerBox">
        <swiper class="swiper-wrapper" :options="swiperOption">
          <swiper-slide class="swiper-box">
            <div class="banner-box">
              <img v-lazy="require('assets/images/no_img.jpg')">
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-pagination" slot="pagination"></div>
      </div>

      <div v-else class="bannerBox">
        <swiper class="swiper-wrapper" :options="swiperOption" ref="bannerSwiper">
          <swiper-slide class="swiper-box" v-for="(item, index) in bannerList" :key="index">
            <div class="banner-box">
              <img :src="filterImg(item.picPath)" @click="goBannerDetail(item)">
            </div>
          </swiper-slide>

        </swiper>
        <div class="swiper-pagination" slot="pagination"></div>
      </div>

    </div>
    <!-- banner 结束 -->

    <!-- 跑马灯 供求开始 -->
    <!--<div class="marquee-row" v-if="tabIndex==1 && marqueeListData">-->
    <!--<div class="marquee-box">-->
    <!--<div class="marquee-icon">-->
    <!--<img src="../images/home_def_news.png">-->
    <!--</div>-->
    <!--<vue-marquee :duration="600" :interval="3000" ref="container">-->
    <!--<div class="marquee-list" v-for = "(item, index) in marqueeListData" :key = "index" @click.stop="$router.push(`/detail/${item.supplyDemandId}`)">-->
    <!--<div class="marquee-content relative">-->
    <!--<p class="marquee-tips">{{item.title ? item.title : 'null'}}</p>-->
    <!--<p class="marquee-company" v-text="changeReleaseTime(item.gmtModified)"></p>-->
    <!--<span class="deco"></span>-->
    <!--</div>-->
    <!--<div class="marquee-photo">-->
    <!--<img v-lazy="item.supplyDemandCoverPic ? filterImg(item.supplyDemandCoverPic.picPath) : ''">-->
    <!--</div>-->
    <!--</div>-->
    <!--</vue-marquee>-->
    <!--</div>-->
    <!--</div>-->

    <!--跑马灯 同城服务-->
    <div class="marquee-row">
      <div class="marquee-box">
        <div class="marquee-icon">
          <img src="../images/home_def_news.png">
        </div>
        <!--<vue-marquee :duration="600" :interval="3000" v-if="serviceListData.length>0">-->
        <div class="marqueeBox">
          <ul :class="{marquee_top:animate}">
            <li class="marquee-list" v-for="(item, index) in serviceListData" :key="index" @click.stop="tolist(item)">
              <div class="marquee-content relative">
                <div class="marquee-top">
                  <div class="decoz" v-if="item.type==1">商家入驻</div>
                  <div class="deco" v-if="item.type==2">供求信息</div>
                  <p class="marquee-company" v-text="changeReleaseTime(item.createDate, 'shop')"></p>
                </div>
                <p class="marquee-tips">{{item.shopName ? item.shopName : 'null'}}</p>
              </div>
              <div class="marquee-photo">
                <img :src="item.logoUrl ? filterImg(item.logoUrl) : ''">
              </div>
            </li>
          </ul>
        </div>
        <!--</vue-marquee>-->
      </div>
    </div>
    <!-- 跑马灯 结束 -->

    <!-- icon List 开始 -->
    <div class="serviceContent">
      <div class="service-tab">
        <em :class="{'roatex':tabIndex==1}"></em>
        <div class="tab-item" :class="{'active': item.active}" v-for="(item, index) in homeTypeTab" :key="index" @click="selTab(index)"><span>{{item.label}}</span></div>
      </div>
      <div class="service-content">
        <div class="service-box" v-for="(item, index) in supplyList" :key="index" :class="{'scroll-service-box': item.id === 2}">
          <h1 v-if="tabIndex==1">同城{{item.name}}</h1>
          <h1 v-if="tabIndex==0">{{item.name}}</h1>
          <scroll :pullup="pullup" :beforeScroll="beforeScroll" :scrollX="true" :listenScroll="listenScroll" :probeType="probeType"
            :data="item.supplyDemandCategoryVos">
            <div class="icon-list">
              <div class="item-icon" v-for="(vosItem, vosIndex) in item.supplyDemandCategoryVos" :key="vosIndex"
                @click.stop="toPage(item, vosItem)">
                <div class="icon-img-box text-center">
                  <!-- <img :src="vosItem.picPath ? vosItem.picPath : require(`../images/${supplyIconKey[index]}_icon_${vosIndex}.png`)" alt="item-icon"> -->
                  <img :src="require(`../images/home_icons_${vosItem.id}.png`)" alt="item-icon">
                </div>
                <p class="text-center">{{vosItem.name}}</p>
              </div>
            </div>
          </scroll>
        </div>
      </div>

    </div>
    <!-- icon List 结束 -->

  </div>
</template>

<script>
  import vueMarquee from "@/components/Marquee/index.vue";
  import mixins from "@/mixins/mixin";
  import {
    getAllSupplyDemandInfo,
    dynamicShopList
  } from "@/api/home";
  import {
    mapGetters
  } from "Vuex";
  import {
    debounce
  } from 'lodash';
  import {
    setInterval, clearInterval
  } from 'timers';

  export default {
    components: {
      vueMarquee
    },
    mixins: [mixins],
    props: {
      supplyList: {
        type: Array,
        default: []
      },
      tabIndex: {
        type: Number,
        default: 0
      },
      bannerList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        supInterval: {},
        animate: false,
        pullup: true,
        beforeScroll: true,
        marqueeListData: [],
        serviceListData: [],
        supplyIconKey: ["home_decro", "house_materia"],
        swiperOption: {
          autoplay: {
            delay: 4000,//4秒切换一次
          },
          //effect: "coverflow",
          grabCursor: true,
          //centeredSlides: true,
          //slidesPerView: "auto",
          initialSlide: 1, //默认页面
          //loop: false,
          //observer: true,
          //observeParents: true,
          pagination: {
            el: '.swiper-pagination'
          }
          // coverflowEffect: {
          //   rotate: 0,
          //   stretch: 35,
          //   depth: 100,
          //   modifier: 1,
          //   slideShadows: false
          // }
        }
      };
    },
    computed: {
      ...mapGetters("common", ["userInfo"]),
      ...mapGetters("home", ["homeTypeTab"]),
      bannerSwiper() {
        return this.$refs.bannerSwiper.swiper;
      },
      hasBanner() {
        // if (this.bannerList.length) {
        //   this.$nextTick(() => {
        //     this.bannerSwiper.slideTo(1, 0, false)
        //   })
        // }
      }
    },
    created() {
      //同城服务信息列表
      this.supplyDemandInfo();
      this.Interval = setInterval(this.showMarquee, 5000);
      this.supInterval=setInterval(()=> {
        this.supplyDemandInfo();
      },60000)
    },
    watch: {
      tabIndex(val) {
        this.supplyIconKey =
          val === 0 ?
          ["home_decro", "house_materia"] :
          ["home", "house", "human"];
      }
    },
    methods: {
       goBannerDetail(item) {
        if(item.skipPath!='') {
          window.location.href = item.skipPath;
        }
      },
      showMarquee: function () {
        this.animate = true;
        setTimeout(() => {
          this.serviceListData.push(this.serviceListData[0]);
          this.serviceListData.shift();
          this.animate = false;
        }, 800);

      },
      tolist(item) {
        item.type == 1 ? this.$router.push(`/tcdetail/${item.id}`) : this.$router.push(`/detail/${item.id}`);
      },
      supplyDemandInfo() {
        //供求信息列表
          dynamicShopList({
            pageSize: 3,
            start: 0,
            platformType: 3
          }).then(item => {
            this.serviceListData = item.data && item.data.list || [];
            this.serviceListData.map(res => {
              res.type = 1; //同城商家 类型
            });
            getAllSupplyDemandInfo({
              curPage: 1,
              pageSize: 3,
              isSortByGmtModified: "desc"
            }).then(res => {
              this.marqueeListData = res.obj || [];
              //console.log(this.marqueeListData)
              if (this.marqueeListData) {
                this.marqueeListData.map(item => {
                  item.type = 2; //供求信息 类型
                  item.createDate = item.gmtModified;
                  item.shopName = item.title;
                  item.id = item.supplyDemandId;
                  item.logoUrl = item.supplyDemandCoverPic && item.supplyDemandCoverPic.picPath;
                })
              }
              //this.serviceListData.push(...this.marqueeListData);
              //this.serviceListData=this.serviceListData.concat(this.marqueeListData);
              this.serviceListData = [...this.serviceListData, ...this.marqueeListData];
            });
          });
      },
      toPage: debounce(function (item, vosItem) {
        sessionStorage.setItem('shopName', ''); //清空
        switch (vosItem.name) {
          case '装修公司':
            sessionStorage.setItem('currentTab', '5');
            break;
          case '设计师':
            sessionStorage.setItem('currentTab', '3');
            break;
          case '施工单位':
            sessionStorage.setItem('currentTab', '6');
            break;
          default:
            sessionStorage.setItem('currentTab', '2');
        }
        if (item.name === '家居建材') {
          sessionStorage.setItem('styleTile', vosItem.name);
        }
        this.$router.push({
          // path: this.tabIndex ? '/serviceList' : '/supplyList',
          path: this.tabIndex ? '/supplyList' : '/serviceList',
          query: {
            categoryId: item.id,
            categorySmallId: vosItem.id
          }
        });
      }, 20),
      changeReleaseTime(time, type) {
        let diffTime = (new Date().getTime() - new Date(time).getTime()) / 1000;
        let agoTimeStr = '';

        if (diffTime < 60) {
          agoTimeStr = Math.round(diffTime) + '秒';
        } else if (diffTime / 60 < 60) {
          agoTimeStr = Math.round(diffTime / 60) + '分钟';
        } else if (diffTime / 3600 < 24) {
          agoTimeStr = Math.round(diffTime / 3600) + '小时';
        } else {
          agoTimeStr = '1天';
        }

        return type === 'shop' ? `${agoTimeStr}之前入驻` : `${agoTimeStr}之前`;
      },
      filterImg(img) {
        return this.userInfo.resourcesUrl + img;
      },
      selTab(index) {
        this.$set(this.homeTypeTab, index, this.homeTypeTab[index]);
        this.$emit('tabChange', index)
      }
    },
    destroyed() {
      clearInterval(this.Interval);
      clearInterval(this.supInterval);
    }
  };

</script>

<style lang="scss" scoped>
  @import "../styles/content.scss";

</style>
