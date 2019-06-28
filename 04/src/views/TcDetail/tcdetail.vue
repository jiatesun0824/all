<template>
  <div class="contentMain">
    <scroll ref="scroller" :data="planRecommendedData" :probeType="3" listenScroll :refreshScroll="true" pullup
      @scrollToEnd="loadMore" @scroll="scroll">
      <div class="detail">
        <div class="tab text-center">
          <span>详情</span>
          <div class="icon-back" @click="goBack"></div>
        </div>
        <div class="banner relative" v-if="tcDetail">
          <div v-if="tcDetail.coverResList">
            <swiper class="swiper-wrapper" :options="swiperOption" ref="mySwiper">
              <!-- slides -->
              <swiper-slide class="swiper-box" v-for="(item,index) in tcDetail.coverResList" :key="index">
                <div class="banner-box">
                  <img v-lazy="item ? (userInfo.resourcesUrl + item) : bigPicDefault">
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <img :src="bigPicDefault" v-show="showImg">
          <!---->
          <div class="nav swiper-pagination"></div>
        </div>
        <div class="content">
          <div class="title" v-text="tcDetail.shopName"></div>
          <div class="tips relative borderBottom">
            <span><i class="icon icon-see"></i>{{tcDetail.visitCount}}</span>
            <div class="tag">
              <span v-if="tcDetail.memberYear>0" v-text="`会员${tcDetail.memberYear}年`"></span>
              <span v-if="tcDetail.authGrade>0" v-text="`认证${tcDetail.authGrade}级`"></span>
            </div>
          </div>
          <!-- <div class="company">
              <img :src="tcDetail.logoUrl">
              <div class="name">
                  现代简约
              </div>
          </div> -->
          <div class="classify relative">
            <div class="type">
              <p v-if="tcDetail.categoryNames&&/(3|4|5)/.test(tcDetail.businessType)">擅长风格</p>
              <p v-if="tcDetail.categoryNames&&(tcDetail.businessType==2)">产品类型</p>
              <p v-if="tcDetail.categoryNames&&(tcDetail.businessType==6)">施工类别</p>
              <p v-if="tcDetail.categoryNames">{{tcDetail.categoryNames || '无'}}</p>
            </div>
            <div class="sub">
              <p>所在地址</p>
              <p v-text="`${tcDetail.cityName} ${tcDetail.areaName} ${tcDetail.streerName} ${tcDetail.shopAddress}`"></p>
            </div>
            <div class="addr-icon">
              <img src="./images/detail_icon_map.png">
            </div>
          </div>
        </div>
        <div class="sign-team" v-show="tcDetail.businessType==5 && tcDetail.designerCount>0">
          <div class="head">
            设计团队　({{tcDetail.designerCount}})
          </div>
          <div class="sliderBox">
            <div class="slider" :style="{width:slideWidth}">
              <div class="slider-item" v-for="(item, index) in singTeam" :key="index">
                <div class="port">
                  <img :src="item.picPath | logoFilter">
                </div>
                <div class="name">{{item.designerName}}</div>
                <div class="job">{{item.shopName}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-tab borderBottom" @touchstart="pullIcon($event, 'hstart')" @touchmove="pullIcon($event, 'hmove')"
          @touchend="pullIcon($event, 'hend')" ref="contentTab">
          <ul ref="detailsNav" style="width:450px;margin-left: 0">
            <li v-for="(item,index) in listBox" :key="index" @click="toggle(item)">
              <span v-if="item.type==1" :class="{'active':item.active}" v-text="`${item.title}(${planNum?planNum:0})`"></span>
              <span v-else-if="item.type==2" :class="{'active':item.active}" v-text="`${item.title}(${demoPlanNum?demoPlanNum:0})`"></span>
              <span v-else-if="item.type==3" :class="{'active':item.active}" v-text="item.title"></span>
              <span v-else-if="item.type==4" :class="{'active':item.active}" v-text="item.title"></span>
              <span v-else-if="item.type==5" :class="{'active':item.active}" v-text="item.title"></span>
              <!--<span v-else-if="item.type==6" :class="{'active':item.active}" v-text="item.title"></span>-->
            </li>
          </ul>
        </div>
        <div :class="(curentIndex == 3||curentIndex == 4) ?'content-silder-active':'content-silder'" v-load-more="!isAllData && !isEmpty && curentIndex != 5"
          v-all-loaded="isAllData && curentIndex != 5">
          <ul v-if="curentIndex==1 || curentIndex==2">
            <plan-item :shopId="id" @click.native="goCaseDetails(item)" v-for="(item, index) in planRecommendedData.datalist"
              :key="index" showLabel :showDesc="true" :index="index" :itemData="item" :showEnterDecorate="showEnterDecorate"
              :showCollect="false"></plan-item>
          </ul>
          <div v-if="tcDetail.shopIntroduced&&curentIndex==5" v-html="tcDetail.shopIntroduced"></div>
          <!--案例-->
          <div v-if="curentIndex == 3" class="case-list">
            <div class="case-item" v-for="(item, index) in caseList" @click="goDatails(item, '案例')" :key="index">
              <img v-if="item.picPath" :src="filterImg(item.picPath)">
              <img v-else v-lazy="require('../../assets/images/no_img.jpg')">
              <div class="case-footer">
                <h1>{{item.caseTitle}}</h1>
                <!--<div>-->
                <!--<span class="enshrine"></span>123-->
                <!--<span class="praise"></span>456-->
                <!--</div>-->
              </div>
            </div>
          </div>
          <!--案例-->
          <!--博文列表-->
          <div v-if="curentIndex == 4" class="blog-article-list">
            <div class="blog-article-item" @click="goDatails(item, '博文')" :class="index == blogArticleList.length-1 ? 'blog-article-item-tall' : ''"
              v-for="(item, index) in blogArticleList" :key="index">
              <div class="item-text">
                <h1>{{item.articleTitle}}</h1>
                <!--<p>{{item.content}}</p>-->
                <div class="item-footer">
                  <div><span class="item-date"></span>{{item.releaseTimeStr}}</div>
                  <div><span class="item-quantity"></span>{{(item.browseCount || item.browseCount !=
                    null)?item.browseCount:0}}</div>
                </div>
              </div>
              <img v-if="item.picPath" :src="filterImg(item.picPath)" class="item-img">
              <img v-else v-lazy="require('../../assets/images/no_img.jpg')" class="item-img">
            </div>
          </div>
          <!--博文列表-->
          <!--关于TA-->
          <!--<div class="as-regards" v-if="curentIndex == 6">-->
          <!--&lt;!&ndash;<h1>擅长风格</h1>&ndash;&gt;-->
          <!--&lt;!&ndash;<p>现代简约、现代奢华、北欧风情、法式宫廷、简欧、美式田园、东南亚、简欧、美式田园、东南亚</p>&ndash;&gt;-->
          <!--<div v-html="tcDetail.shopIntroduced"></div>-->
          <!--</div>-->
          <!--关于TA-->
          <div class="emptyPage" v-show="isEmpty">
            <img src="./images/list_icon_empty.png">
            <div class="noData">暂无数据</div>
          </div>
        </div>
      </div>
      <div class="borderBottom header-tab" v-show="tabShow">
        <div class="tab-title">详情</div>
        <i class="icon-left" @click="$router.go(-1)"></i>
        <ul ref="detailsHeaderNav" style="width:450px;margin-left: 0" @touchstart="pullIcon($event, 'hstart')"
          @touchmove="pullIcon($event, 'hmove')" @touchend="pullIcon($event, 'hend')">
          <li v-for="(item,index) in listBox" :key="index" @click.stop="toggle(item)"><span :class="{'active':item.active}">{{item.title}}{{item.type==1
              ? '('+planNum+')' : item.type==2 ? '('+demoPlanNum+')' : ''}}</span></li>
        </ul>
      </div>
    </scroll>
    <div class="info-btn" @click="connect">立即沟通</div>
  </div>
</template>

<script>
  import './styles/swiper.scss'
  import mixins from '@/mixins/mixin'
  import planItem from 'components/PlanItem';
  import baseAPI from 'api/baseAPI';
  import {
    mapActions,
    mapGetters
  } from 'Vuex'
  import {
    serviceDetail,
    updateVisitCount
  } from 'api/service'
  import {
    planRecommendedList,
    designerList,
    recommendedPlanCount,
    blogArticlelist,
    caseList
  } from 'api/tcdetail'
  import {
    pick,
    values,
    get,
    isEqual,
    isArray,
    debounce
  } from 'lodash';
import { setTimeout } from 'timers';

  export default {
    components: {
      planItem
    },
    mixins: [mixins],
    data() {
      return {
        blogArticleList: [],
        caseList: [],
        showEnterDecorate: true,
        // 详情接口返回值
        tcDetail: {
          cityName: '',
          areaName: '',
          streerName: '',
          shopAddress: ''
        },
        planRecommendedData: '',
        id: '',
        isEmpty: false,
        tabShow: false,
        showImg: false,
        moreText1: true,
        moreText2: true,
        curentIndex: 1, // 当前的active
        curentPage: 0, // 当前的页数
        singTeam: [],
        // slideWidth:"",
        listBox: [{
            title: '一键方案',
            active: true,
            type: 1
          },
          {
            title: '样板方案',
            active: false,
            type: 2
          },
          {
            title: '案例',
            active: false,
            type: 3
          },
          {
            title: '博文',
            active: false,
            type: 4
          },
          {
            title: '关于TA',
            active: false,
            type: 5
          }
          // {
          //   title: '关于TA',
          //   active: false,
          //   type: 6
          // }
        ],
        page: 1,
        pageX: 0,
        margin: 0,
        planNum: '', //一键方案的数量
        demoPlanNum: '', //样板方案的数量
        designNum: '', //设计师方案的数量
        swiperOption: {
          autoplay: false,
          centeredSlides: true,
          slidesPerView: 'auto',
          pagination: {
            el: '.swiper-pagination'
          }
        },
        bigPicDefault: baseAPI.serviceURL + '/default/list_def_detail.png'
      }
    },
    computed: {
      ...mapGetters('common', ['userInfo']),
      ...mapGetters("user", {
        MessageList: "MessageList",
        friendId: "friendId",
      }),
      isAllData() {
        if (!this.isEmpty) {
          return isArray(this.planRecommendedData.datalist) && (this.planRecommendedData.datalist.length === this.planRecommendedData
            .totalCount);
        }
      },
      slideWidth() {
        if (this.singTeam) {
          return 2.13 * this.singTeam.length + 'rem'
        }
      },
      contentTabTop() {
        return this.$refs.contentTab.offsetTop;
      }
    },
    // 描点定位
    beforeRouteEnter(to, from, next) {
      to.meta.keepNotAlive = false;
      next();
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepNotAlive = !(to.name === 'view720' || to.name === 'photoview');
      let keepAliveComponent = this.$parent.$vnode.parent;
      if (keepAliveComponent && from.meta.keepNotAlive) {
        delete keepAliveComponent.componentInstance.cache[keepAliveComponent.componentInstance.keys[0]];
        keepAliveComponent.componentInstance.keys = [];
      }
      next();
    },
    created() {},
    activated() {
      if (sessionStorage.getItem('currentTab') == 2) {
        this.listBox[4] = {
          title: '门店信息',
          active: false,
          type: 5
        };
      }
      if (sessionStorage.getItem('type')) {
        this.curentIndex = sessionStorage.getItem('type');
      }
      this.listBox.map((res) => {
        res.active = false;
      });
      if (sessionStorage.getItem('type')) {
        this.listBox[sessionStorage.getItem('type') - 1].active = true;
      }
      this.id = this.$route.params.id;
      serviceDetail({
        shopId: this.id,
        platformValue: 3
      }).then((res) => {
        this.tcDetail = res.data;
        res.data.coverResList ? this.showImg = false : this.showImg = true;
        setTimeout(() => {
          this.$refs.scroller.refresh();
        }, 200);
        if (sessionStorage.getItem('type')) {
          this.toggle(this.listBox[sessionStorage.getItem('type') - 1]);
          this.listBox.map(item => {
            item.active = false;
          })
          this.listBox[sessionStorage.getItem('type') - 1].active = true;
        }
        // this.planMethod('decorate',0);
        if (this.tcDetail.businessType == 5) {
          designerList({
            companyId: res.data.companyId,
            platformValue: 3
          }).then(item => {
            this.singTeam = item.data;
          })
        }
        //方案数量的获取
        // if (sessionStorage.getItem('type') / 1 != 5) {
        //   this.planNumber('decorate');
        //   this.planNumber('public');
        //   this.planNumber('supportBoth');
        // }
        this.planNumber('decorate');
        this.planNumber('prototype');
        //this.planNumber('supportBoth');
      });
      //浏览次数
      updateVisitCount({
        id: this.id
      });
    },
    mounted() {
      if (sessionStorage.getItem('detailsNav')) {
        this.$refs.detailsNav.style.transition = 'linear all 0.1s';
        this.$refs.detailsHeaderNav.style.transition = 'linear all 0.1s';
        this.$refs.detailsNav.style.marginLeft = sessionStorage.getItem('detailsNav');
        this.$refs.detailsHeaderNav.style.marginLeft = sessionStorage.getItem('detailsNav');
      }
    },
    methods: {
      ...mapActions('user', ['setFriendId']),
      ...mapActions('caseDetail', ['setCaseDetail', 'setDisplayType']),
      ...mapActions('socket', ['setFromWhere', 'setRelateObj']),
      goCaseDetails(item) {
        this.$router.push({
          path: '/caseDetails'
        })
        this.setCaseDetail(item);
      },
      goBack: debounce(function () {
        this.$router.back();
      }, 20),
      filterImg(img) {
        return this.userInfo.resourcesUrl + img;
      },
      // 查看详情页面
      goDatails(item, type) {
        if (type == '博文') {
          this.$router.push(`/details/${item.articleId}`);
        }
        if (type == '案例') {
          this.$router.push(`/details/${item.caseId}`);
        }
      },
      // 导航滚动
      pullIcon(e, type) {
        if (type == 'hstart') {
          this.pageX = e.touches[0].pageX;
          this.margin = parseFloat(this.$refs.detailsNav.style.marginLeft);
          this.$refs.detailsNav.style.transition = '';
          this.$refs.detailsHeaderNav.style.transition = '';
        }
        if (type == 'hmove') {
          let x = this.margin + (e.touches[0].pageX - this.pageX);
          this.$refs.detailsNav.style.marginLeft = x + 'px';
          this.$refs.detailsHeaderNav.style.marginLeft = x + 'px';
        }
        if (type == 'hend') {
          let x = parseFloat(this.$refs.detailsNav.style.width);
          let width = Number(`${document.documentElement.clientWidth}`);
          let widthLeft = width - x;
          if (parseFloat(this.$refs.detailsNav.style.marginLeft) > 0) {
            this.$refs.detailsNav.style.marginLeft = '0px';
            this.$refs.detailsNav.style.transition = 'linear all 0.1s';
            this.$refs.detailsHeaderNav.style.marginLeft = '0px';
            this.$refs.detailsHeaderNav.style.transition = 'linear all 0.1s';
          } else if (parseFloat(this.$refs.detailsNav.style.marginLeft) < widthLeft) {
            this.$refs.detailsNav.style.marginLeft = widthLeft + 'px';
            this.$refs.detailsNav.style.transition = 'linear all 0.1s';
            this.$refs.detailsHeaderNav.style.marginLeft = widthLeft + 'px';
            this.$refs.detailsHeaderNav.style.transition = 'linear all 0.1s';
          }
        }
        sessionStorage.setItem('detailsNav', this.$refs.detailsNav.style.marginLeft);
      },
      planNumber(displayType) {
        //方案数量接口
        recommendedPlanCount({
          recommendationPlanSearchVo:{
            displayType: displayType,
            shopId: this.id
          }
          //companyId: this.tcDetail.companyId,
          //designerId: this.tcDetail.userId,
        }).then(res => {
          if (res.success) {
            // displayType=='decorate' ? this.planNum=res.obj : displayType=='public' ? this.demoPlanNum=res.obj : this.designNum=res.obj
            if (displayType == 'decorate') {
              this.planNum = res.totalCount;
              this.toggle(this.listBox[0])
            } else if (displayType == 'prototype') {
              this.demoPlanNum = res.totalCount;
              this.toggle(this.listBox[1])
            } else {
              this.designNum = res.obj
            }
          } else {
            // this.listBox.map(item=> {
            //   item.active = false;
            // })
            // this.listBox[0].active = true;
            //this.isEmpty = true;
          }
        })
      },
      toggle: debounce(function (item) {
        this.page = 1;
        this.curentIndex = item.type;
        this.curentPage = 0;
        sessionStorage.setItem('type', this.curentIndex);
        this.listBox.map((res) => {
          res.active = false;
        });
        item.active = true;
        switch (item.type) {
          case 1:
            this.planMethod('decorate', 0);
            this.showEnterDecorate = true;
            this.setDisplayType(0)
            break;
          case 2:
            this.planMethod('prototype', 0);
            this.setDisplayType(1)
            this.showEnterDecorate = false;
            break;
          case 3:
            this.isEmpty = false;
            this.caseList = [];
            this.getCaseList(this.page);
            break;
          case 4:
            this.isEmpty = false;
            this.blogArticleList = [];
            this.blogArticlelist(this.page);
            break;
          case 5:
            if (this.tcDetail.shopIntroduced) {
              this.isEmpty = false;
            } else {
              this.isEmpty = true;
            }
            setTimeout(() => {
              this.$refs.scroller.refresh();
            }, 200);
            break;
            // case 6:
            //   this.isEmpty = false;
            //   setTimeout(() => {
            //     this.$refs.scroller.refresh();
            //   }, 200);
            //   break;
        }
        this.$refs.scroller.refresh();
      }, 20),
      changeText(type) {
        if (type == 0) {
          this.moreText1 = !this.moreText1;
        } else {
          this.moreText2 = !this.moreText2;
        }

      },
      loadMore() {
        if (this.curentIndex != 5) {
          this.page++;
          if (!this.isEmpty) {
            this.curentPage = this.curentPage + 10;
            if (this.curentIndex == 1) {
              this.planMethod('decorate', this.curentPage);
            } else if (this.curentIndex == 2) {
              this.planMethod('prototype', this.curentPage);
            } else if (this.curentIndex == 4) {
              this.caseList(this.page);
            } else if (this.curentIndex == 5) {
              this.blogArticlelist(this.page);
            }
          }
        }
      },
      // 案例列表
      getCaseList(page) {
        caseList({
          pageNo: page,
          pageSize: 10,
          shopId: this.id
        }).then(res => {
          if (res.data) {
            this.caseList = this.caseList.concat(res.data);
            setTimeout(() => {
              this.$refs.scroller.refresh();
            }, 200);
            // if (res.data.length < 10) {
            //   this.isEmpty = true;
            // }
          } else {
            this.isEmpty = true;
          }
        });
      },
      // 博文列表
      blogArticlelist(curentPage) {
        blogArticlelist({
          shopId: this.id,
          limit: 10,
          start: curentPage,
          page: curentPage
        }).then(res => {
          if (res.datalist && res.message == 'ok') {
            this.blogArticleList = this.blogArticleList.concat(res.datalist);
            setTimeout(() => {
              this.$refs.scroller.refresh();
            }, 200);
            // if (res.totalCount <= curentPage * 10) {
            //   this.isEmpty = true;
            // }
          } else {
            this.isEmpty = true;
          }
        });
      },
      planMethod(type, start) {
        planRecommendedList({
          recommendationPlanSearchVo:{
            displayType: type,
            shopId:this.id
            // companyId: this.tcDetail.companyId,
            // designerId: this.tcDetail.userId,
          },
          pageVo:{
            pageSize: 10,
            start: start,
          }
          // msgId: this.id,
          //shopId: this.id
        }).then((res) => {
          start == 0 ? this.planRecommendedData = res : this.planRecommendedData.datalist = this.planRecommendedData.datalist.concat(res.datalist);
          if (res.totalCount == 0) {
            start == 0 ? this.isEmpty = true : this.isEmpty = false;
          } else {
            this.isEmpty = false
          }
          setTimeout(() => {
            this.$refs.scroller.refresh();
          }, 200)
        })
      },
      scroll(pos) {
        this.tabShow = Math.abs(pos.y) >= this.contentTabTop;
        requestAnimationFrame(() => {
          this.tabShow = Math.abs(pos.y) >= this.contentTabTop
        });
      },
      connect() {
        if (this.tcDetail.userId && this.tcDetail.shopName) {
          var friendId = {
            "friendId": this.tcDetail.userId,
            "friendName": this.tcDetail.shopName,
            "type": 2
          };
          this.setFriendId(friendId);
          this.setFromWhere(1); // 设定此条消息是店铺1还是供求2
          let relatedObj = { // 创建会话上传位置信息
            relatedObjId: this.tcDetail.id, // 供求或店铺ID
            contactSessionId: this.tcDetail.sessionId // 会话对方的id
          }
          this.setRelateObj(relatedObj);
          this.$router.push('/user/chat');
        }
      },
      filterImg(img) {
        return this.userInfo.resourcesUrl + img;
      }
    },
  }

</script>

<style lang="scss" scoped>
  @import '~views/TcDetail/styles/tcdetail.scss';

</style>
