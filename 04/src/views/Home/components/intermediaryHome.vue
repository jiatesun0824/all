<template>
    <div class="intermediary-home">
      <share-component :shareShow.sync="showShareButton" :isPlan="isPlan" :planInfo="planInfo"></share-component>
      <!--赚佣金-->
      <div class="make-brokerage" :style="{top: -pageHieght + 'px'}" ref="makeBrokerage">
        <scroll ref="brokerageBox"
          pullup
          :probeType="probeType"
          :listenScroll="listenScroll">
          <div class="make-brokerage-box">
            <div class="make-brokerage-content">
              <i class="icon-back" @click="pullIcon($event, 'packUp')"></i>
              <img :src="userInfo.resourcesUrl + url">
              <div class="btn" @click="toShare">立即推荐</div>
            </div>
          </div>
        </scroll>
      </div>
      <!--赚佣金-->
      <!--选择日期-->
      <div class="select-date" :class="showDate?'select-date-active':''">
        <awesome-picker
          style="z-index: 1000002"
          ref="picker0"
          :colorConfirm="picker0.colorConfirm"
          :colorCancel="picker0.colorCancel"
          :data="picker0.data"
          :anchor="picker0.anchor"
          @cancel="handlePickerCancel"
          @confirm="handlePicker0Confirm">
        </awesome-picker>
      </div>
      <!--<div class="shade"  v-show="showDate"></div>-->
      <!--选择日期-->
      <!--顶部搜索，消息-->
      <div class="header">
        <div class="push-down"
             style="marginTop: 0px;"
             ref="pushDownIcon"
             @touchstart="pullIcon($event, 'hstart')"
             @touchmove="pullIcon($event, 'hmove')"
             @touchend="pullIcon($event, 'hend')">
          <div class="push-down-img" ref="pushDownImg"></div>
          <img src="../images/push_down.gif">
        </div>
        <div class="search-text">首  页</div>
        <div :class="{'msg-box-index': isShowMsgBox, isTip: showTipDot}" class="msg-box" @click="toMsgList">
          <span v-show="messageHint"></span>
          <img src="../images/home_icon_message.png">
          <expire-tip v-if="showTipLabel"></expire-tip>
          <span class="redDot" v-if="haveUnRead"></span>
          <span class="redDot" v-if="haveStystemUnRead"></span>
        </div>
      </div>
      <!--顶部搜索，消息-->
      <!--:data="shareList"-->
      <scroll class="scroll"
        ref="scrollList"
        pullup
        :data="shareList"
        @scrollToEnd="pullup"
        :listenScroll="listenScroll">
        <div class="scroll-box">
          <!-- banner 开始 -->
          <div class="banner" :key="hasBanner">  <!-- v-if="bannerList.length" -->
            <div v-if="!bannerList.length" class="bannerBox">
              <swiper class="swiper-wrapper" :options="swiperOption">
                <swiper-slide class="swiper-box">
                  <div class="banner-box">
                    <img v-lazy="require('assets/images/no_img.jpg')">
                  </div>
                </swiper-slide>
              </swiper>
              <div class="swiper-pagination"  slot="pagination"></div>
            </div>
            <div v-else class="bannerBox">
              <swiper class="swiper-wrapper" :options="swiperOption" ref="bannerSwiper">
                <!-- <swiper-slide class="swiper-box" v-for="(item, index) in bannerList" :key="index" @click.native="$router.push('/activePage')">
                  <div class="banner-box">
                    <img :src="filterImg(item.picPath)">
                  </div>
                </swiper-slide> -->
                <swiper-slide class="swiper-box" v-for="(item, index) in bannerList" :key="index">
                  <div class="banner-box">
                    <img :src="filterImg(item.picPath)"  @click="goBannerDetail(item)">
                  </div>
                </swiper-slide>
              </swiper>
              <div class="swiper-pagination"  slot="pagination"></div>
            </div>

          </div>
          <!-- banner 结束 -->
          <!--收益列表-->
          <div class="earnings-list">
            <div class="my-earnings">
              <p @click="$router.push('/user/invite')">我的邀请<br/>{{userMessage.inviteIdCount?userMessage.inviteIdCount:0}}人</p>
              <span></span>
              <p>累计收益<br/>¥ {{userMessage.commisionCount? userMessage.commisionCount: 0}}</p>
              <button @click.self="pullIcon($event ,'pull')">立即邀请</button>
            </div>
            <div class="new-message">
              <div class="message">
                <p class="left"><span></span><i></i></p>
                <div class="right">
                  <div class="right-box" ref="rightBox" >
                    <div class="right-item"
                         v-for="(item, index) in messageList" :key="index">
                      <span class="nick-name">{{item.nickName}}</span>
                      <span class="price" v-if="item.sign == 'commision'">佣金入账¥{{item.record}} {{item.createTime.split(' ')[0]}}</span>
                      <span class="price" v-if="item.sign == 'invite'">邀请{{item.record}}人　{{item.createTime.split(' ')[0]}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="ranking-list">
              <h1><span></span>月收入排行榜</h1>
              <div class="date">
                <div @click="isShowData" class="confirm-date">
                  <span class="date-text">{{yearMonth}}</span>
                  <span class="date-img"></span>
                </div>
              </div>
              <div class="brokerage" v-for="(item, index) in brokerageList" :key="index" v-if="index < showIndex" @click="goBrokerage(item)">
                <div class="name">
                  <span :class="index < 3 ? `ranking${index+1}`: 'ranking'">{{index + 1}}</span>
                  <div>
                    <img class="head" :src="filterImg(item.userHeadPicPath)">
                  </div>
                  <div class="name-txt">
                    <p>
                      {{getEightCode(item.nickName)}}
                      <strong v-if="item.sourceCompanyName" class="source-company" v-text="item.sourceCompanyName"></strong>
                    </p>
                    <span>成功邀请{{item.userInviteCount}}人签约</span>
                  </div>
                </div>
                <div :class="index < 3 ?'price' : 'price-active'">¥<span>{{item.commisionCount}}</span></div>
              </div>
              <div v-if="brokerageList.length == 0" class="hint">暂无数据</div>
              <div class="more-box">
                <p class="more" v-if="brokerageList.length > 3" @click="loadMore">{{moreTxt}}<span :class="moreTxt == '点击收起' ? 'active' : ''"></span></p>
              </div>
              </div>
          </div>
          <!--收益列表-->
          <!--分享赚更多-->
          <div class="share-list">
            <h1><span></span>分享赚更多</h1>
            <div class="share-item" v-for="(item, index) in shareList" :key="index">
              <div class="go720" @click="go720(item)"></div>
              <img v-if="item.planCoverPath" :src="filterImg(item.planCoverPath)">
              <img v-else v-lazy="require('assets/images/no_img.jpg')">
              <div class="share-item-info">
                <div class="info">
                  <p class="name">{{item.planName}}</p>
                  <p class="message">{{item.planStyleName}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.spaceAreas}}㎡&nbsp;&nbsp;&nbsp;&nbsp;总价￥{{(item.decorationQuotation*item.spaceAreas).toFixed(0)}}</p>
                  <p class="price">预计收益：¥{{item.planPrepPrice}}</p>
                </div>
                <span class="btn" @click="shareToBuy(item)">分享赚</span>
              </div>
            </div>
          </div>
          <!--分享赚更多-->
        </div>
      </scroll>
  </div>
</template>

<script>
  import shareComponent from '@/components/shareComponent';
  import planItem from 'components/PlanItem';
  import expireTip from './expireTip';
  import share from "../../Share/index";
  import { usercommissioninfo, newestcommissioninfo, commissiontop, getBannerList,behaviorTotal, sharexzchat, getshareplanlist} from 'api/home';
  import { mapGetters, mapMutations, mapActions } from "Vuex";
  import minix from "@/mixins/mixin";
  import { findIndex, debounce } from "lodash";
  import { pick, values, get, isEqual, isArray } from 'lodash';
import { setInterval } from 'timers';
  export default {
    name: "intermediaryHome",
    mixins: [minix],
    props: {
      showTipLabel: {
        type: Boolean
      },
      showTipDot: {
        type: Boolean
      }
    },
    data() {
      return {
        showDate: false,
        year: 0,
        month: 0,
        yearMonth: '',
        picker0: {
          colorConfirm: '#ff6419',
          colorCancel: '#333333',
          anchor: [],
          data: [[], []]
        },
        dateIndex: 0,
        isShowMsgBox: false,
        showShareButton: false,
        showShare: true,
        messageHint: false, // 消息提示
        moreTxt: '查看更多',
        supplyList: [],
        keywordSeek: '',
        bannerList: [],
        swiperOption: {
          autoplay: {
            delay: 4000,//4秒切换一次
          },
          //effect: "coverflow",
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: "auto",
          initialSlide: 1, // 默认页面
          // loop: true,
          observer: true,
          observeParents: true,
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
        },
        userMessage: {}, // 当前用户信息
        messageList: [], // 滚动消息列表
        marginTop: 0,
        height: 0,
        brokerageList: [], // 佣金排行榜列表
        showIndex: 3,
        shareList: [],
        pageY: 0,
        pageHieght: 0,
        time: true,
        url: '',
        pageSize: 10,
        curPage: 1,
        isPlan: false,
        planInfo: {},
        Interval: {}
      };
    },
    computed: {
      ...mapGetters("common", ["userInfo"]),
      ...mapGetters("home", ["homeTypeTab"]),
      ...mapGetters("home", ["first"]),
      ...mapGetters('socket', ['haveUnRead', 'haveStystemUnRead']),
      ...mapGetters('recom', [
      'navgateList',
    ]),
      bannerSwiper() {
        return this.$refs.bannerSwiper.swiper;
      },
      hasBanner() {
        // if (this.bannerList.length) {
        //   this.$nextTick(() => {
        //     this.bannerSwiper.slideTo(1, 0, false);
        //   });
        // }
      }
    },
    methods: {
      ...mapActions('caseDetail', ['setCaseDetail', 'setDisplayType']),
      ...mapMutations('home', ["GET_TEST_FIRST"]),
      get,
      isEqual,
      goBannerDetail(item) {
        if(item.skipPath!='') {
          window.location.href = item.skipPath;
        }
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
      handlePicker0Confirm (v) {
        this.yearMonth = v[0].value + v[1].value;
        this.showDate = false;
        this.picker0.anchor = v;
          commissiontop({
            curPage: 1,
            pageSize: 10,
            year: v[0].value.split('年')[0],
            month: v[1].value.split('月')[0]
          }).then(res => {
            if (res.obj) {
              this.brokerageList = res.obj;
              this.brokerageList.sort((a, b) => {
                return b.commisionCount - a.commisionCount;
              });
            } else {
              this.brokerageList = [];
            }
          });
      },
      // go佣金明细
      goBrokerage(item) {
        this.$router.push({
          path:`/brokerage/${item.userId}`,
          query:{
            item: item
          }
        });
      },
      shareToBuy(item){
        this.showShareButton = true;this.isPlan = true;this.planInfo=item;
        //统计分享点击次数
        sessionStorage.setItem('shareType','index_plan_share');
        try {
          behaviorTotal({type:'index_plan_share',wx:false,pyq:false}).then(res=>{});
        } catch (e) {

        }
      },
      handlePickerCancel() {
        this.showDate = false;
      },
      toShare(){
        this.showShareButton = true;this.isPlan = false;
        sessionStorage.setItem('shareType','index_recommend');
        behaviorTotal({type:"index_recommend",wx:false,pyq:false}).then(res=>{});
      },
      isShowData() {
        this.$refs.picker0.show();
        this.showDate = true;
      },
      toMsgList() {
        let expireTipInfo = localStorage.getItem('expireTipInfo');
        expireTipInfo && localStorage.setItem('expireTipInfo', JSON.stringify(Object.assign(JSON.parse(expireTipInfo), {showTipDot: false})));
        this.$router.push('/user/message');
      },
      // 图片url拼接
      filterImg(img) {
        return this.userInfo.resourcesUrl + img;
      },
      // 点击进入720
      go720: debounce(function(item) {
        console.log(item)
        if (this.$route.path == '/view720') return;
        this.$store.state.goBackPath = this.$route.path;
        sessionStorage.setItem('operationSource', 1);
        sessionStorage.setItem('routerQueryType', 'seven');
        sessionStorage.setItem('msgId', 'recommended');
        // this.$store.commit('audioAutoPlay');
        this.$store.state.isCollectIndex = this.index;
        this.$store.state.view720.view720Id = item.planRecommendedId;
        sessionStorage.setItem('view720Id', item.planRecommendedId);
        sessionStorage.setItem('planId', item.planId);
        sessionStorage.setItem('groupPlanId', item.planRecommendedId);
        sessionStorage.setItem('groupType', 0); // 设置组合替换类型
        sessionStorage.setItem('bid', item.bid);
        sessionStorage.setItem('isTask', 0)
        this.$store.state.detailsSeeType = '';
        this.API.recomGetPictureList({
          planRecommendedId: item.planRecommendedId,
          remark: '720'
        }).then((response) => {
          if (response) {
            if (response.totalCount === 0) {
              this.$store.commit('popupMsg', '当前设计图没有720°全景');
              this.$store.commit('showPopup');
              return;
            }
            sessionStorage.setItem('planRecommendedId', item.planRecommendedId);
            this.$store.state.renderSign = false;
            this.$store.commit('showComComponents', false);
            // this.$store.state.view720.view720Small = response.datalist;
            this.$store.state.view720.view720Small = response.datalist[0].picPath;
            console.log(response.datalist)
            this.$store.state.smallTitle = item.planName;
            this.$store.state.fromPath = 'recom';
            this.$store.state.view720LoadingFlag = true;
            this.$store.state.recomSelIndex = this.index;
            this.$store.state.fasttype = 'recommended';
            this.$router.push('/view720');
          }
        });

      }, 20),
      // 展示有奖邀请
      pull() {
        this.isShowMsgBox = false;
        this.$refs.pushDownImg.style.marginTop = '0';
        this.$refs.brokerageBox.scrollTo(0, 0, 500);
        this.$refs.pushDownIcon.style.transition = 'linear all 0.2s';
        this.$refs.makeBrokerage.style.transition = 'linear all 0.2s';
        this.$refs.pushDownIcon.style.marginTop = this.pageHieght + 'px';
        this.$refs.makeBrokerage.style.top = 0 + 'px';
      },
      // 收起有奖邀请
      packUp() {
        this.isShowMsgBox = true;
        this.$refs.pushDownImg.style.marginTop = '-3.5rem';
        this.$refs.pushDownIcon.style.transition = 'linear all 0.2s';
        this.$refs.makeBrokerage.style.transition = 'linear all 0.2s';
        this.$refs.pushDownIcon.style.marginTop = '0';
        this.$refs.makeBrokerage.style.top = -this.pageHieght + 'px';
      },
      // 下拉赚佣金图标,type事件类型
      pullIcon(e, type) {
        this.$refs.pushDownIcon.style.transition = '';
        if (type == 'hstart') {
          this.isShowMsgBox = false;
          this.pageY = e.touches[0].pageY;
          this.$refs.makeBrokerage.style.transition = '';
          this.$refs.pushDownIcon.style.transition = '';
        }
        if (type == 'hmove') {
          let y = e.touches[0].pageY - this.pageY;
          this.$refs.pushDownIcon.style.marginTop = y + 'px';
          this.$refs.makeBrokerage.style.top = -this.pageHieght + y + 'px';
        }
        if (type == 'hend') {
          if (parseFloat(this.$refs.pushDownIcon.style.marginTop) < '200') {
            this.packUp();
          } else {
            this.pull();
          }
        }
        if (type == 'packUp') {
          this.showShareButton = false;
          this.packUp();
        }
        if (type == 'pull') {
          this.pull();
        }
      },
      pullup() {
        this.curPage++;
        getshareplanlist({curPage: this.curPage, pageSize: this.pageSize}).then(res => {
          if (res.obj) {
            res.obj.map(item=> {
              item.spaceAreas=(item.spaceAreas/1).toFixed(2);
            });
            this.shareList = this.shareList.concat(res.obj);
          }
        });
      },
      // 排行榜查看更多
      loadMore: debounce(function() {
          if (this.moreTxt == '查看更多') {
            this.moreTxt = '点击收起';
            this.showIndex = 10;
            setTimeout(() => {
              this.$refs.scrollList.refresh();
            }, 20);
          } else {
            setTimeout(() => {
              this.moreTxt = '查看更多';
              this.showIndex = 3;
              setTimeout(() => {
                this.$refs.scrollList.refresh();
              }, 20);
            }, 200);
          }
      }),
      // 页面加载请求数据
      getMessage() {
        usercommissioninfo().then((res) => {
          if (res.obj) {
            this.userMessage = res.obj;
          }
        });
        newestcommissioninfo({curPage: 1, pageSize: 6}).then(res => {
          if (res.obj) {
            let obj = res.obj[0];
            this.messageList = res.obj;
            this.messageList.push(obj);
          }
        });
        commissiontop({
          curPage: 1,
          pageSize: 10,
          year: this.year,
          month: this.month
        }).then(res => {
          if (res.obj) {
            this.brokerageList = res.obj;
            this.brokerageList.sort((a, b) => {
              return b.commisionCount - a.commisionCount;
            });
          }
        });
        getBannerList({positionCode: 'union:agency:home:top'}).then(res => {
          if (res.datalist) {
            this.bannerList = res.datalist;
          }
        });
        sharexzchat().then(res => {
          if (res.obj) {
            this.url = res.obj;
          }
        });
        getshareplanlist({curPage: this.curPage, pageSize: this.pageSize}).then(res => {
          if (res.obj) {
            res.obj.map(item=> {
              item.spaceAreas=(item.spaceAreas/1).toFixed(2);
            });
            this.shareList = res.obj;
          }
        });
      },
      // 最新消息滚动
      messageRoll() {
        if (!this.time) {
          return;
        }
        setTimeout(() => {
          if (this.marginTop.toFixed(1) == (-0.8 * (this.messageList.length - 1)).toFixed(1)) {
            this.marginTop = 0;
            this.$refs.rightBox.style.transition = '';
            this.$refs.rightBox.style.marginTop = this.marginTop + 'rem';
          } else {
            this.$refs.rightBox.style.transition = 'linear all 0.2s';
            this.marginTop = this.marginTop - 0.8;
            this.$refs.rightBox.style.marginTop = this.marginTop + 'rem';
          }
            this.messageRoll();
        }, 5000);
      },
      getEightCode(str) {
        var tempStr= str;
        if(tempStr.replace(/[^\x00-\xff]/g,"**").length > 8){
          var i=0;
          for(var z=0; z < 8; z++){
            if(tempStr.charCodeAt(z)>255){
              i=i+2;
            }else{
              i=i+1;
            }
            if(i>=8){
              tempStr=tempStr.slice(0,(z + 1));
              break;
              break;
            }
          }
          return tempStr;
        }else{
          return str;
        }
      }
    },
    components: {
      share,
      shareComponent,
      expireTip,
      planItem
    },
    created() {
      let date = new Date();
      let Year = [];
      let Month = [];
      for (let i = 2018; i <= date.getFullYear(); i++) {
        this.picker0.data[0].push(i + '年');
        Year.push(i);
      };
      for (let i = 1; i <= 12; i++) {
        this.picker0.data[1].push(i + '月');
        Month.push(i);
      };
      this.picker0.anchor = [this.picker0.data[0].length - 1, date.getMonth()-1];
      this.year = Year[this.picker0.data[0].length - 1];
      this.month = Month[date.getMonth()] - 1;
      this.yearMonth = this.year + '年' + this.month + '月';
      this.getMessage();

      this.Interval=setInterval(()=> {
        newestcommissioninfo({curPage: 1, pageSize: 6}).then(res => {
          if (res.obj) {
            let obj = res.obj[0];
            this.messageList = res.obj;
            this.messageList.push(obj);
          }
      });
      }, 30000)
    },
    destroyed() {
      clearInterval(this.Interval);
    },
    mounted() {
      this.time = true;
      this.pageHieght = `${document.documentElement.clientHeight}`;
      this.messageRoll();
      this.showIndex = 3;
      setTimeout(() => {
        if (this.first) {
          this.$refs.pushDownImg.style.transition = 'linear all 0.2s';
          this.$refs.pushDownImg.style.marginTop = '0';
          setTimeout(() => {
            this.$refs.pushDownImg.style.transition = 'linear all 0.2s';
            this.$refs.pushDownImg.style.marginTop = '-3.5rem';
            this.isShowMsgBox = true;
          }, 1500);
        }
        this.GET_TEST_FIRST(false);
      }, 50);
      setTimeout(() => {
        this.$refs.scrollList.refresh();
        // this.$refs.brokerageBox.scrollTo(0, -160, 0);
      }, 500);
    }
  };
</script>

<style lang="scss" scoped>
  @import "~views/Home/styles/intermediaryHome.scss";
</style>
