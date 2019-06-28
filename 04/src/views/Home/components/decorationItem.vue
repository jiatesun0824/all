<template>
  <div class="content">
    <!-- banner 开始 -->
    <div class="item-section" :key="hasBanner">
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
              <img :src="filterImg(item.picPath)"  @click="goBannerDetail(item)">
            </div>
          </swiper-slide>

        </swiper>
        <div class="swiper-pagination" slot="pagination"></div>
      </div>

    </div>
    <!-- banner 结束 -->

    <!--跑马灯 同城服务-->
    <div class="item-section" style="padding-bottom: 20px">
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
    </div>

    <!-- 跑马灯 结束 -->
    <!--抢单模块-->
    <div class="robOrder">
      <div class="tcSession">
        <div class="tcItem" @click="$router.push('/supplyList?categoryId=2&categorySmallId=5')"><i class="ic_need"></i>供求信息</div>
        <div class="tcItem" @click="goCity"><i class="ic_shop"></i>同城商家</div>
      </div>
      <div class="order-section">
        <div class="title">客户订单</div>
        <ul>
          <li @click="$router.push('/mycumser')">
            <p>{{decorationData.myClientCount}}</p>
            <p>我的客户</p>
          </li>
          <li @click="$router.push('/robOrder')">
            <p>{{decorationData.myOrderCount}}</p>
            <p>平台派单</p>
          </li>
          <li @click="$router.push('/timerob')">
            <p>{{decorationData.mySeckillCount}}</p>
            <p>限时快抢</p>
          </li>
        </ul>
      </div>
      <div class="robDecoration">
        <div class="title">
          <div class="title-bg"></div>
        </div>
        <ul v-if="decorationData">
          <li v-for="(item,index) in decorationData.decorateSeckillList" :key="index" v-if="index<currentKey">
            <div class="rob-header">
              <div class="amount">{{item.budgetInfo}}</div>
              <div class="address">{{item.positionInfo}}</div>
            </div>
            <div class="rob-bottom">
              <p>{{item.decorateStyleInfo}} · {{item.houseAcreageInfo}} </p>
              <p>{{item.decorateHouseTypeInfo}} · {{item.decorateTypeInfo}} </p>
              <p class="pay"><span>度币：{{item.priceInfo}}</span><em>{{item.userName}}</em></p>
            </div>
            <!-- <i class="ic_rob" @click="robOrder(item)" v-if="item.orderStatus==0"></i> -->
            <div class="dc_rob" v-if="item.orderStatus==0" @click="robOrder(item)">立即抢单</div>
            <i class="ic_no_rob" v-else></i>
          </li>
          <div class="look-section" v-if="decorationData.decorateSeckillList.length>0">
            <div class="lookmore" @click="lookmore"><span :class="{'active':currentKey==8}">{{lookmoreText}}</span></div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import vueMarquee from "@/components/Marquee/index.vue";
  import mixins from "@/mixins/mixin";
  import {
    getAllSupplyDemandInfo,
    dynamicShopList,
    getHomePageInfo,
    seckill
  } from "@/api/home";
  import {
    mapGetters,
    mapActions
  } from "Vuex";
  import {
    debounce
  } from 'lodash';
  import {
    setInterval,
    clearInterval
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
        currentKey: 3,
        lookmoreText: '查看更多',
        decorationData: '',
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
          //loop:true,
          //initialSlide: 1, //默认页面
          pagination: {
            el: '.swiper-pagination'
          }
        }
      };
    },
    computed: {
      ...mapGetters("common", ["userInfo"]),
      ...mapGetters("home", ["homeTypeTab", "robNum", "mask"]),
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
      this.supInterval = setInterval(() => {
        this.supplyDemandInfo();
      }, 60000)
      getHomePageInfo().then((res) => {
        if (res.success) {
          this.decorationData = res.obj;
        } else {
          this.$toast(res.message)
        }
      })
    },
    watch: {
      tabIndex(val) {
        this.supplyIconKey =
          val === 0 ? ["home_decro", "house_materia"] : ["home", "house", "human"];
      }
    },
    methods: {
      ...mapActions("home", ["diolog"]),
      goBannerDetail(item) {
        if(item.skipPath!='') {
          window.location.href = item.skipPath;
        }
      },
      goCity() {
        this.$router.push('/serviceList');
        sessionStorage.setItem('shopName', '');
        sessionStorage.setItem('currentTab', '5');
      },
      lookmore() {
        this.lookmoreText == '查看更多' ? this.lookmoreText = '立即收起' : this.lookmoreText = '查看更多';
        this.currentKey == 3 ? this.currentKey = 8 : this.currentKey = 3;
        this.$emit('refreshScroll')
      },
      robOrder(item) {
        seckill({
          id: item.id
        }).then((res) => {
          if (res.success) {
            switch (res.obj.status) {
              case 1:
                this.diolog({
                  robSuccess: true,
                  mask: true
                });
                break; //抢单成功
              case 2:
                this.$toast(res.obj.message);
                break; //抢单失败
              case 3:
                this.diolog({
                  robNum: true,
                  mask: true
                });
                break; //今天次数已用完
            }
          } else {
            this.$toast(res.message);
          }
        });

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
  @import "../styles/decorationItem.scss";

</style>
