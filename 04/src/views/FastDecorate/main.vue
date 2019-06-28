<template>
  <div class="decorate__container" @touchmove.prevent>
    <div class="decorate__header" ref="header">
      <div class="decorate__header--back" @click="$router.back()"></div>
      <div class="decorate__header--title">一键装修</div>
    </div>
    <div class="decorate__type" :class="{active: spacePannelShow}" ref="decorateType">
      <span @click="fromPage === 'typechange' && showSelectPannel()">
        <span class="decorate__type--text" v-text="get(find(currentSpaceList, {active: true}), 'name')"></span>
        <span class="decorate__type--icon" v-if="fromPage === 'typechange'"></span>
      </span>
    </div>
    <div class="type__pannel" :class="{fixedNavActive: fixedNav}" v-show="spacePannelShow" @click="spaceMenuShow && (spaceMenuShow = false)">
      <transition name="dropdown" @after-leave="closeSelectPannel">
        <div class="type__list" v-if="spaceMenuShow" @click.stop>
          <span class="type__item" :class="{active: item.active}" v-for="(item, index) in currentSpaceList" :key="index"
            v-text="item.name" @click="selectSpace(index)"></span>
        </div>
      </transition>
    </div>
    <div class="decorate__content">
      <div class="content__nav nav__fixed" v-show="fixedNav">
        <swiper class="content__nav--list" :options="navOptionConfig" ref="navFixed">
          <swiper-slide class="content__nav--item" :class="{active: item.active}" v-for="(item, index) in styleList"
            :key="index" v-text="item.name" @click.native="selectStyle(index)">
          </swiper-slide>
        </swiper>
        <span class="content__nav--filter" @click="showFilterContent">
          <svg style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024"
            version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z"></path>
          </svg>
        </span>
      </div>
      <scroll beforeScroll pullup listenScroll :probeType="3" :data="planList" @scrollToEnd="loadMore" @scroll="scrollPage"
        ref="decorateScroll">
        <div class="content__scroll">
          <div class="content__space">
            <swiper class="content__space--list" :options="spaceOptionConfig" ref="space">
              <swiper-slide class="content__space--item" v-for="(item, index) in newHouseList" :key="index">
                <div :class="{unactive: !item.active}" @click="selectNewHouse(index)">
                  <img v-lazy="userInfo.resourcesUrl+item.viewPlanSmallPath" :key="userInfo.resourcesUrl+item.viewPlanSmallPath">
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <div class="content__nav">
            <swiper class="content__nav--list" :options="navOptionConfig" ref="nav">
              <swiper-slide class="content__nav--item" :class="{active: item.active}" v-for="(item, index) in styleList"
                :key="index" v-text="item.name" @click.native="selectStyle(index)">
              </swiper-slide>
            </swiper>
            <span class="content__nav--filter" @click="showFilterContent">
              <svg style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024"
                version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z"></path>
              </svg>
            </span>
          </div>
          <div class="content__list">
            <swiper class="list__container" :options="listOptionConfig" ref="list">
              <swiper-slide class="list__item" v-for="(item, index) in styleList" :key="index">
                <div class="recom__item" v-if="isRecom && !get(currentStyle, 'value')">
                  <span class="recom__item--content">
                    <i class="recom__item--before">当前方案</i>
                    <span v-if="get(recomData, 'planTableType') == 1 && get(find(currentSpaceList, {active: true}), 'value') == 13 ? false : !isMatch">该方案不适合您选择的空间</span>
                  </span>
                  <plan-item @click.native="goCaseDetails(recomData)" showLabel :itemData="recomData" :index="0" @isPay="isPay"
                    :unActive="get(recomData, 'planTableType') == 1 && get(find(currentSpaceList, {active: true}), 'value') == 13 ? false : !get(recomData, 'active')"
                    @showDecoratePriceBox="showDecoratePriceBox"></plan-item>
                  <!-- @renderTypeListChild="getRenderTypeList" -->
                  <!-- @changeRender="changeRenderNow" -->
                  <!-- @changePlan="setPlan" -->
                </div>
                <div v-if="planList.length && findIndex(styleList, {active: true}) === index" v-load-more="!isAllData"
                  v-all-loaded="isAllData">
                  <div>
                    <span class="recom__item--content" v-if="isRecom && !get(currentStyle, 'value')">
                      <i class="recom__item--before">推荐方案</i>
                    </span>
                    <plan-item @getBindItem="getBindItem" @getUnBindItem="getUnBindItem" showLabel v-for="(plan, i) in planList" @click.native="goCaseDetails(plan)" :key="i"
                      :itemData="plan" :index="i" :unActive="!get(currentHouse, 'active')" @isPay="isPay"
                      @showDecoratePriceBox="showDecoratePriceBox"></plan-item>
                    <!-- @renderTypeListChild="getRenderTypeList" -->
                    <!-- @changeRender="changeRenderNow" -->
                    <!-- @changePlan="setPlan" 
                      @isPay="isPay" -->
                  </div>
                </div>
                <empty v-if="isRecom ? get(currentStyle, 'value') && planList && !planList.length && findIndex(styleList, {active: true}) === index :  planList && !planList.length && findIndex(styleList, {active: true}) === index"></empty>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </scroll>
      <!-- <transition name="fade">
        <div class="render-popup" v-if="renderPayFlag">
          <div class="render-wrapper" v-if="!renderHintFlag">
            <div class="render-header">选择效果图类型</div>
            <div class="render-kind">
              <div class="kind-item" v-for="(item,index) in renderTypeList" :key="index">
                <div class="kind-text">
                  <span class="type">{{item.type}}</span>
                  <span class="price" v-if="renderFlag[index]"><span v-show='!isPackYearsAndMonthShow'>{{item.price}}度币</span></span>
                  <span class="flag-wrapper" v-else>
                        <span class="render-flag" v-if="!isViewNow[index]">渲染中...</span>
                  <span class="render-flag completed" v-else @click="go720(index)">已完成></span>
                  </span>
                </div>
                <span class="select" :class="index == changeIndex ? 'select-active' : ''" @click="changeRenderType(index)" v-if="renderFlag[index]"></span>
              </div>
            </div>
            <div class="render-footer">
              <div class="render-cancel" @click="closeHint">取消</div>
              <div class="render-footer-line"></div>
              <div class="render-sure" @click.once="sureRender" v-if="isShowSureBtn" :class="{'unableAddRenderTak': !toAddRenderTask}">确认</div>
            </div>
            <loading v-if="loadingFlag"></loading>
          </div>
          <div class="render-state" v-else>
            <div class="hint-image">
              <img class="loading-img" src="./images/loading.gif">
            </div>
            <div class="hint-text">预计3分钟后渲染完成</div>
            <div class="state-footer">
              <div class="state-footer-both state-footer-left" @click="closeHint">确认</div>
              <div class="state-footer-both state-footer-right" @click="goMyTask">查看任务</div>
            </div>
          </div>
        </div>
      </transition> -->
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
    <transition name="dropdown">
      <div class="filter" :style="`height: ${filterContentHeight}px`" v-show="showFilterPannel">
        <div class="filter__content">
          <div class="filter__item" v-for="(item, index) in selectFilterList" :key="index">
            <p class="filter__item--title" v-text="item.title"></p>
            <div class="filter__item--list">
              <span class="filter__item--type" :class="{active: type.active}" v-for="(type, i) in item.typeData" v-text="type.name"
                :key="i" @click="changeCurrentFitment({index, i})"></span>
            </div>
          </div>
        </div>
        <div class="filter__submit">
          <span class="filter__submit--reset" @click="resetFitment">重置</span>
          <span class="filter__submit--sure" @click="showFilterPannel = false; queryPlanList()">确定</span>
        </div>
      </div>
    </transition>
    <div class="plan__payAlert1Bg"  v-if="payAlertShow">
      <div class="plan__payAlert1"  style="padding-bottom: 0.5333rem;">
        <div class="plan__payAlert1--close">
            <img class="plan__payAlert1--closeImg" @click.stop="closePayAlert" src="./images/icon_payAlert_close.png" alt="">
        </div>
        <div class="plan__payAlert1--price">{{planItemPrice.planPrice}}度币</div>
        <div class="plan__payAlert1--tit">
          此方案为付费方案 <br />
          需要支付版权费才可使用哦~
        </div>
        <div  class="plan__payAlert1--money">
          账户余额：{{accountBalance}}度币
        </div>
        <div class="plan__payAlert1--button" @click="payPlanPrice">
           立即支付
        </div>
        <!-- <div class="plan__payAlert1--lastbox">
            <img src="./images/me_pic_200.png">
        </div> -->
      </div>
    </div>

     <div class="plan__payAlert1Bg" v-if="payAlertSuccShow">
      <div class="plan__payAlert1">
         <div class="plan__payAlert1--close" style="margin-bottom:0;">
            <img class="plan__payAlert1--closeImg" @click.stop="closePayAlert" src="./images/icon_payAlert_close.png" alt="">
        </div>
        <div class="plan__payAlert1--sucessImgBox">
            <img src="./images/order_pic_drawing.gif" >
        </div>
        <div  class="plan__payAlert1--money" style="margin-top:10px;">
           支付成功，正在装修渲染中...
        </div>
         <div class="plan__payAlert1--after">
            为了保证渲染效果，预计要3分钟后完成
        </div>
        <div class="plan__payAlert1--btnBox">
          <span class="returnbtn" @click.stop="closePayAlert">
               返回 
          </span>
           <span class="checkbtn"  @click="$router.push('/replace')">
               查看任务
          </span>
        </div>
      </div>
    </div>

    <div class="plan__payAlert1Bg" v-if="payAlertFailShow">
      <div class="plan__payAlert1">
        <!-- <div class="plan__payAlert1--failImgBox">
            <img src="./images/me_pic_200.png" >
        </div> -->

         <div class="plan__payAlert1--tip">
           提示
        </div>
        <div  class="plan__payAlert1--money" style="margin-top:10px;">
           账户余额不足？去充值
        </div>
        <div class="plan__payAlert1--btnBox">
          <span class="returnbtn" @click.stop="closePayAlert">
              暂不考虑
          </span>
           <span class="checkbtn"  @click="$router.push('/paypage')">
              去充值
          </span>
        </div>
      </div>
    </div>
    <!-- <div class="plan__payAlert1Bg" v-if="payAlertShow">
      <div class="plan__payAlert1">
        <div class="plan__payAlert1--close">
          <img class="plan__payAlert1--closeImg" @click.stop="closePayAlert" src="./images/icon_payAlert_close.png" alt="">
        </div>
        <div class="plan__payAlert1--price">￥{{planItemPrice.planPrice}}</div>
        <div class="plan__payAlert1--tit">
          此方案为付费方案 <br />
          需要支付版权费才可使用哦~
        </div>
        <div class="payOpt">
          <div class="payOpt_item">
            <img class="payOpt_item_img" src="./images/alipay.png" alt="">
            <span class="payOpt_item_tit">支付宝支付</span>
            <img class="payOpt_item_sel" v-if="activeOption=='alipay'" src="./images/selected.png" alt="" @click="selAlipay">
            <img class="payOpt_item_sel" v-else src="./images/select.png" alt="" @click="selAlipay">
          </div>
          <div class="payOpt_item">
            <img class="payOpt_item_img" src="./images/wechatpay.png" alt="">
            <span class="payOpt_item_tit">微信支付</span>
            <img class="payOpt_item_sel" v-if="activeOption=='weixinpay'" src="./images/selected.png" alt="" @click="selWeixinpay">
            <img class="payOpt_item_sel" v-else src="./images/select.png" alt="" @click="selWeixinpay">
          </div>
        </div>
        <div class="plan__payAlert1--paybutbox">
          <span class="plan__payAlert1--paybut" @click="pay">立即支付</span>
        </div>
      </div>
    </div>
    <div class="plan__payAlert1Bg" v-if="payAlertSuccShow">
      <div class="plan__payAlert1">
        <div class="plan__payAlert1--close">
          <img class="plan__payAlert1--closeImg" @click.stop="closePayAlert" src="./images/icon_payAlert_close.png" alt="">
        </div>
        <div class="plan__payAlert1_main_imgBox">
          <img class="plan__payAlert1_main_img" src="./images/pay_icon_success.png" alt="">
        </div>
        <div class="plan__payAlert1_main_title">支付成功，赶紧去装修吧~</div>
        <div class="plan__payAlert1--paybutbox">
          <span class="plan__payAlert1--paybut" @click="paySucc">装进我家</span>
        </div>
      </div>
    </div> -->
    <!-- <div class="plan__payAlert1Bg" v-if="payAlertFailShow">
      <div class="plan__payAlert1">
        <div class="plan__payAlert1--close">
          <img class="plan__payAlert1--closeImg" @click.stop="closePayAlert" src="./images/icon_payAlert_close.png" alt="">
        </div>
        <div class="plan__payAlert1_main_imgBox">
          <img class="plan__payAlert1_main_img" src="./images/pay_icon_fail.png" alt="">
        </div>
        <div class="plan__payAlert1_main_title">支付失败，请重新支付！</div>
        <div class="plan__payAlert1--paybutbox">
          <span class="plan__payAlert1--paybut" @click="pay">重新支付</span>
        </div>
      </div>
    </div> -->
    <!-- 渲染成功后询问框 -->
    <div class="afterRender" v-show="showComfirm">
      <transition name="scale" @after-leave="showComfirm = false;">
        <div class="afterRender__content" v-if="showRenderSuccess">
          <div class="afterRender__body">
            <i class="afterRender__body--loading"></i>
            <span class="afterRender__body--msg">预计3分钟后渲染完成，<br />可在"我的-我的方案"中查看</span>
          </div>
          <div class="afterRender__footer">
            <span class="afterRender__footer--sure" @click="comfirmRender">确认</span>
            <span class="afterRender__footer--task" @click="$router.push('/replace')">查看方案</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { getUserBalance } from 'api/account';
import { isPayPlanStatus } from 'api/fastDecorate';
  import {
    mapGetters,
    mapActions,
    mapMutations
  } from 'Vuex'
  import PlanItem from 'components/PlanItem'
  import {
    findIndex,
    find,
    get,
    isEmpty,
    isArray
  } from 'lodash'
  import {
    setInterval,
    clearInterval
  } from 'timers';
  var checkInterval;
  export default {
    name: 'decorate',
    data() {
      let _this = this;

      return {
        accountBalance:'',//余额
        // 渲染成功后询问框
        showComfirm: false,
        showRenderSuccess: false,

        planItemPrice: {},
        planHouseId: '',
        payAlertShow: false,
        payAlertSuccShow: false,
        payAlertFailShow: false,
        activeOption: 'alipay',
        payTradeNo: '',

        currentSpaceIndex: 0, // 当前选择的户型,客餐厅或者卧室
        spaceLayoutData: {},
        // planData:null,
        // loadingFlag: false,
        // renderPayFlag: false,
        // renderHintFlag: false,
        // changeIndex: -1, // 选择的渲染类型的索引
        renderTypeList: [{
            type: '720°全景图',
            price: 50,
            renderingType: 4
          },
          {
            type: '多点全景',
            price: 70,
            renderingType: 8
          },
          {
            type: '漫游视频',
            price: 90,
            renderingType: 6
          }
        ],
        // isPackYearsAndMonthShow: false, // 是否包年包月
        // isViewNow: [], // 判断是否可以直接前往查看
        // renderFlag: [], // 每个渲染类型后面的勾选显示的东西判断
        // isShowSureBtn: false, // 是否显示确认按钮
        // toAddRenderTask: true, // 是否允许添加渲染任务
        isRecom: this.$route.query.planId !== undefined,
        recomData: '',
        spaceOptionConfig: {
          slidesPerView: 1,
          centeredSlides: true,
          preventLinksPropagation: false,
          on: {
            slideChangeTransitionStart: () => {
              let index = this.spaceSwiper.activeIndex;
              this.start = 0;
              this.changeCurrentHouse(index);
              this.queryPlanList();
            }
          }
        },
        navOptionConfig: {
          notNextTick: true,
          freeMode: false,
          spaceBetween: 10,
          slidesPerView: 5,
          on: {
            // slideChangeTransitionEnd: function() {
            //   let isFixedNav = this.el.parentNode.classList.contains('nav__fixed');
            //   if(isFixedNav) {
            //     _this.navSwiper.setTransition(0);
            //     _this.navSwiper.setTranslate(this.translate)
            //   }
            //   else {
            //     _this.navFixedSwiper.setTransition(0);
            //     _this.navFixedSwiper.setTranslate(this.translate)
            //   }
            // }
          }
        },
        fixedNav: false,
        listOptionConfig: {
          notNextTick: true,
          freeMode: false,
          preventLinksPropagation: false,
          on: {
            slideChangeTransitionStart: () => {
              let index = this.listSwiper.activeIndex;
              this.start = 0;
              this.changeCurrentStyle(index);
              this.navSwiper.slideTo(index, 100, false);
              this.resetFitment();
              this.queryPlanList();
            }
          }
        },
        fromPage: this.$route.query.fromPage,
        spacePannelShow: false,
        spaceMenuShow: false,
        start: 0,
        decoratePriceBox: false,
        decoratePriceList: [],
        filterContentHeight: 0,
        showFilterPannel: false
        // isMatch: false
      }
    },
    computed: {
      ...mapGetters('common', ['userInfo']),
      ...mapGetters('fastDecorate', [
        'currentSpaceList',
        'newHouseList',
        'currentHouse',
        'styleList',
        'currentStyle',
        'planList',
        'planCount',
        'isNewMatch',
        'selectFilterList'
      ]),
      isMatch() {
        if (!this.recomData.groupPrimaryId) {
          let applySpaceAreas = this.recomData.applySpaceAreas && this.recomData.applySpaceAreas.split(',');
          if (!applySpaceAreas) {
            this.recomData.active = false;
            return false
          };
         // applySpaceAreas.push("10")
          let isMatch =
            applySpaceAreas.includes(this.currentHouse.spaceAreas) &&
            !isEmpty(
              find(this.currentSpaceList, {
                value: this.recomData.spaceFunctionId
              })
            )
          this.recomData.active = isMatch;
          console.log(applySpaceAreas,11)
          console.log(this.currentHouse.spaceAreas,22)
          console.log(applySpaceAreas.includes(this.currentHouse.spaceAreas),33)
          return isMatch
        } else {
          this.queryIsMatchPlan(this.recomData.planRecommendedId);
          this.recomData.active = this.isNewMatch
          return this.isNewMatch
        }
      },
      spaceSwiper() {
        return this.$refs.space.swiper
      },
      navSwiper() {
        return this.$refs.nav.swiper
      },
      navFixedSwiper() {
        return this.$refs.navFixed.swiper
      },
      listSwiper() {
        return this.$refs.list.swiper
      },
      isAllData() {
        return isArray(this.planList) && (this.planList.length === this.planCount);
      },
      navTop() {
        return this.$refs.space.$el.offsetHeight;
      }
    },
    methods: {
      ...mapActions('caseDetail', ['setCaseDetail', 'setDisplayType']),
      ...mapActions('fastDecorate', [
        'initCrrentData',
        'querySpaceList',
        'queryCurrentSpaceList',
        'changeCurrentSpace',
        'queryNewHouseList',
        'queryNewSpaceDesignList',
        'spaceSetType',
        'changeCurrentHouse',
        'queryStyleList',
        'changeCurrentStyle',
        'queryPlanList',
        'queryIsMatchPlan',
        'setcurrentSpaceList',
        'setplanList',
        'getFitmentTypeList',
        'changeCurrentFitment',
        'resetFitment'
      ]),
      findIndex,
      find,
      get,
      goCaseDetails(item) {
        this.$router.push({
          path: '/caseDetails'
        })
        this.setCaseDetail(item);
        this.setDisplayType(0)
      },
      IsPayPlanStatus(){
        let formdata = new FormData();
        formdata.append('recommendedPlanId',this.recomData.planRecommendedId),
        formdata.append('planType',1)
         isPayPlanStatus(formdata).then(res=>{
           console.log(res)
            if(this.recomData.planRecommendedId==recomData.planRecommendedId){
             if(res.obj.flag){
              this.recomData.copyRightPermission=1;
              this.recomData.havePurchased=1;
             }
            }
         })
      },
      // 获取用户度币数
      getBindItem(Id){
          this.planList.map(item => {
              if (item.planRecommendedId == Id) {
                item.isFavorite = 1;
                return item;
              } else {
                return item;
              }
            })
      },
      getUnBindItem(fid){
         this.planList.map(item => {
              if (item.bid == fid) {
                item.isFavorite = 0;
                return item;
              } else {
                return item;
              }
            })
      },
    _getIntegral() {
      let userName =localStorage.getItem('rememberPhone');
      let pwd = localStorage.getItem('pwd');
      getUserBalance({
        account: userName,
        password: pwd
      }).then(res => {
        if (res.status) {
          let accountMoney = Math.floor(res.obj.balanceIntegral).toString();
          localStorage.setItem('balanceAmount',accountMoney);
          this.accountBalance = accountMoney;
        }
      });
    },
      payPlanPrice(){
        this.payAlertShow=false;
        let recomData = JSON.parse(sessionStorage.getItem('recomData'))
        let payParams={
          useType :0,//装进我家
          buyType:1,//版权方案
          planRecommendedId:recomData.planRecommendedId,//方案ID
          planType:recomData.planHouseType==null?1:0//方案类型:0.全屋,1.普通
        }
        this.API.payPlanPrice(payParams).then(res=>{
          console.log(res)
          if(res.obj.flag){
            this.planList.map(item=>{
              if(item.planRecommendedId==recomData.planRecommendedId){
                item.copyRightPermission=0;
                item.havePurchased=1;
              }else{
                return item;
              }
            })
            if(this.recomData.planRecommendedId==recomData.planRecommendedId){
              console.log(this.recomData.planRecommendedId,recomData.planRecommendedId)
              this.recomData.copyRightPermission=1;
              this.recomData.havePurchased=1;
            }
           this._getIntegral();
           this.payAlertSuccShow = true;
           let item =JSON.parse(sessionStorage.getItem('recomData'));
           item.copyRightPermission = 0;
           item.isFree = true;
           this.isPay(item);

          }else{
            this.payAlertFailShow = true;
          }
        })
       
      },
      pay() {
        if (this.activeOption === 'alipay') { // 支付宝支付
          try { // 支付宝app支付
            cordova;
            this.APPAliPay();
          } catch (e) { // 支付宝H5支付
            var _this = this;
            checkInterval = setInterval(function () {
              _this.checkDesignCopyRight();
            }, 5000)
            let url = window.location.href;
            let redirectUrl = url;
            this.API.locpayDesignPlanCopyRight({
              redirectUrl: redirectUrl,
              planRecommendedId: this.planItemPrice.planRecommendedId,
              payType: 0,
              payMethod: "aliH5Pay",
              userId: JSON.parse(localStorage.getItem('userInfo')).id,
              useType: 0
            }).then((res) => {
              if (res) {
                let form = res.obj.mwebUrl;
                document.write(form);
                this.payTradeNo = res.obj.payTradeNo;
              }
            });
          }
        } else if (this.activeOption === 'weixinpay') { // 微信支付
          try { // 微信app支付
            Wechat;
            this.APPWeiXinPay();
            // console.log(Wechat, '微信支付, app')
          } catch (e) { // 微信H5支付
            var _this = this;
            checkInterval = setInterval(function () {
              _this.checkDesignCopyRight();
            }, 5000)
            let url = window.location.href;
            let redirectUrl = url;
            this.API.locpayDesignPlanCopyRight({
              redirectUrl: redirectUrl,
              planRecommendedId: this.planItemPrice.planRecommendedId,
              payType: 1,
              payMethod: "wxH5Pay",
              userId: JSON.parse(localStorage.getItem('userInfo')).id,
              useType: 0
            }).then((res) => {
              if (res) {
                // this.code_url = res.obj.mwebUrl;
                // location.href = this.code_url;
                // this.payTradeNo = res.obj.payTradeNo;
              }
            });
          }
        }
      },
      APPWeiXinPay() { // 微信app支付
        let params;
        let _that = this;
        this.API.locpayDesignPlanCopyRight({
          planRecommendedId: this.planItemPrice.planRecommendedId,
          payType: 1,
          payMethod: "wxAppPay",
          userId: JSON.parse(localStorage.getItem('userInfo')).id,
          useType: 0
        }).then((res) => {
          if (res.obj !== null) {
            params = {
              partnerid: res.obj.partnerid, // merchant id
              prepayid: res.obj.prepayid, // prepay id
              noncestr: res.obj.noncestr, // nonce
              timestamp: res.obj.timestamp, // timestamp
              sign: res.obj.sign, // signed string
              appid: res.obj.appid,
              package: res.obj.package
            };
            Wechat.sendPaymentRequest(params, function () {
              _that.$toast('支付成功')
              // _that.$store.commit('popupMsg', '支付成功');
              // _that.$store.commit('showPopup');
              _that.payAlertSuccShow = true;
            }, function (reason) {
              _that.$toast('支付失败');
              // _that.$store.commit('popupMsg', '支付失败');
              // _that.$store.commit('showPopup');
              _that.payAlertFailShow = false;
            });
          }
        });
      },
      APPAliPay() { // 支付宝app支付
        let _that = this;
        this.API.locpayDesignPlanCopyRight({
          planRecommendedId: this.planItemPrice.planRecommendedId,
          payType: 0,
          payMethod: "aliAppPay",
          userId: JSON.parse(localStorage.getItem('userInfo')).id,
          useType: 0
        }).then((res) => {
          if (res.obj !== null) {
            cordova.plugins.alipay.payment(res.obj.form, function success(e) {
              _that.$toast('支付成功')
              // _that.$store.commit('popupMsg', '支付成功');
              // _that.$store.commit('showPopup');
              _that.payAlertSuccShow = true;
            }, function error(e) {
              _that.$toast('支付失败');
              // _that.$store.commit('popupMsg', '支付失败');
              // _that.$store.commit('showPopup');
              _that.payAlertFailShow = false;
            });
          }
        });
      },
      checkDesignCopyRight() {
        var from = new FormData();
        from.append('recommendedPlanId', this.planItemPrice.planRecommendedId);
        from.append('userId', JSON.parse(localStorage.getItem('userInfo')).id);
        this.API.loccheckDesignCopyRight(from).then(res => {
          if (res.success) {
            clearInterval(checkInterval);
            this.closePayAlert();
            this.payAlertSuccShow = true;
          } else {
            clearInterval(checkInterval);
            this.closePayAlert();
            this.payAlertFailShow = true;
          }
        })
      },
      paySucc() {
        this.$router.push({
          name: 'putInHouse',
          params: {
            id: this.planItemPrice.planRecommendedId,
            houseId: this.planHouseId,
            houseType: this.planItemPrice.planHouseType === 2 ? 2 : 1,
            groupPrimaryId: this.planItemPrice.groupPrimaryId
          }
        });
      },
      selAlipay() {
        this.activeOption = 'alipay';
      },
      selWeixinpay() {
        this.activeOption = 'weixinpay';
      },
      closePayAlert() {
        this.payAlertShow = false;
        this.payAlertSuccShow = false;
        this.payAlertFailShow = false;
      },
      comfirmRender() {
        this.showRenderSuccess = false;
      },
      async isPay(item, houseId) {
        if (item.copyRightPermission == 1&&item.havePurchased==0) {
          this.payAlertShow = true;
          this.planItemPrice = item;
          this.planHouseId = houseId;
        } else {
          // 全网去除度币
          // this.$router.push({
          //   name: 'putInHouse',
          //   params: {
          //     id: item.planRecommendedId,
          //     houseId: houseId,
          //     houseType: item.planHouseType === 2 ? 2 : 1,
          //     groupPrimaryId: item.groupPrimaryId
          // }});
          let res = await this.API.addRenderTasks({
            taskSource: 1,
            taskType: 0,
            operationSource: 1,
            payType: 1,
            userId: this.userInfo.id,
            designPlanSceneId: sessionStorage.getItem('cpId'),
            planRecommendedId: item.planRecommendedId,
            renderingType: 4,
            renderTaskType: 'panorama_render',
            templateId: this.currentHouse.templateId,
            groupPrimaryId: item.groupPrimaryId,
            planHouseType: item.planHouseType === 2 ? 2 : 1,
            houseId: houseId,
            houseCommonCode: this.currentHouse.houseCommonCode,
            houseName: this.currentHouse.houseName,
            livingName: this.currentHouse.livingName,
            totalFee: 0
          })
          if (res.success&&item.isFree==undefined) {
            [this.showComfirm, this.showRenderSuccess] = Array(2).fill(true);
          } else {
            if (res.message.includes('余额')) {
              this.$confirm({
                  title: '充值',
                  msg: '度币余额不足，去充值？'
                })
                .success(instance => {
                  instance.close();
                  this.$router.push('/paypage');
                })
            } else {
              //this.$toast(res.message);
            }
          }
        }
      },
      showDecoratePriceBox(item) {
        this.decoratePriceList = item
        this.decoratePriceBox = true
      },
      setPlan(data) {
        this.planData = data;
      },
      showSelectPannel() {
        if (!this.spacePannelShow) {
          [this.spacePannelShow, this.spaceMenuShow] = [true, true]
        } else {
          this.spaceMenuShow = false
        }
      },
      changeRenderNow() {
        this.renderPayFlag = true;
      },
      closeSelectPannel() {
        this.spacePannelShow = false
      },
      async selectSpace(index) {
        this.changeCurrentSpace(index);
        this.spaceMenuShow = false;
        this.start = 0;
        await this.queryNewHouseList({
          houseId: this.$route.params.id
        });
        await this.queryStyleList();
        this.changeCurrentStyle();
        this.navSwiper.slideTo(0, 100, false);
        this.navFixedSwiper.slideTo(0, 100, false);
        this.listSwiper.slideTo(0, 100, false);
        this.showFilterPannel = false;
        this.resetFitment();
        this.start = 0;
        await this.queryPlanList();
        this.$refs.decorateScroll.scrollTo(0, 0, 200);
        this.currentSpaceIndex = index;
      },
      selectNewHouse(index) {
        this.newHouseList[index].active = !this.newHouseList[index].active
        this.isRecom && this.isMatch && (this.recomData.active = !this.recomData.active)
      },
      selectStyle(index) {
        this.showFilterPannel = false;
        this.changeCurrentStyle(index);
        this.navSwiper.slideTo(index, 100, false);
        this.navFixedSwiper.slideTo(index, 100, false);
        this.listSwiper.slideTo(index, 100, false);
        this.start = 0;
        this.resetFitment();
        this.queryPlanList();
      },
      loadMore() {
        if (this.fromPage === 'mymodule') {
          this.start++;
          this.API.recom({
            areaValue: this.currentSpaceList[0].spaceAreas,
            brandName: "",
            creator: "",
            designRecommendedStyleId: "",
            displayType: "decorate",
            houseType: this.$route.query.spaceFunctionId,
            isMainList: "1",
            limit: 10,
            livingName: "",
            msgId: JSON.parse(localStorage.getItem('userInfo')).id,
            start: this.start,
            templateId: this.currentSpaceList[0].templateId
          }).then((res) => {
            this.setplanList({
              datalist: res.datalist,
              totalCount: res.totalCount,
              start: this.start
            })
          })
        } else {
          if (!this.isAllData) {
            this.start++;
            this.queryPlanList({
              start: this.start
            });
          }
        }
      },
      async showFilterContent() {
        if (this.showFilterPannel) return this.showFilterPannel = false;
        this.$refs.decorateScroll.scrollToElement(this.$refs.nav.$el);
        if (!this.filterContentHeight) {
          this.filterContentHeight = document.documentElement.clientHeight - ['header', 'decorateType', 'nav'].reduce(
            (before, next) => {
              return before + (this.$refs[next] instanceof HTMLElement ? this.$refs[next].offsetHeight : this.$refs[
                next].$el.offsetHeight);
            }, 0);
        }
        await this.getFitmentTypeList();
        this.showFilterPannel = true;
      },
      scrollPage(pos) {
        if (pos.y < 0 && Math.abs(pos.y) >= this.navTop) {
          if (!this.fixedNav) {
            let navTranslate = this.navSwiper.translate;
            this.$nextTick(() => {
              Array.from(Array(5)).forEach(() => {
                requestAnimationFrame(() => {
                  this.navFixedSwiper.setTranslate(navTranslate)
                });
              })
            });
          }
          this.fixedNav = true;
        } else {
          if (this.fixedNav) {
            let fixedTranslate = this.navFixedSwiper.translate;
            this.$nextTick(() => {
              Array.from(Array(5)).forEach(() => {
                requestAnimationFrame(() => {
                  this.navSwiper.setTranslate(fixedTranslate)
                });
              })
            })
          }
          this.fixedNav = false;
        }
      }
      // changeRenderType(index) {
      //   this.changeIndex = index;
      //   if (index === 0) {
      //     this.productType = 'panorama_render';
      //   } else if (index === 1) {
      //     this.productType = 'roam720';
      //   } else {
      //     this.productType = 'video';
      //   }
      // },
      // closeHint() {
      //   this.renderPayFlag = false;
      //   this.renderHintFlag = false;
      //   this.changeIndex = -1;
      // },
      // sureRender() {
      //   if(this.fromPage === 'space') {
      //      if (!this.toAddRenderTask) { return; }
      //       let totalFee;
      //       if (this.isPackYearsAndMonthShow) {
      //         totalFee = 0;
      //       } else {
      //         totalFee = this.renderTypeList[this.changeIndex].price * 10;
      //       }
      //       if (this.changeIndex == -1) {
      //         this.$store.commit('popupMsg', '您还没有选择渲染类型');
      //         this.$store.commit('showPopup');
      //         return;
      //       }
      //       this.toAddRenderTask = false;
      //       let operationSource = Number(sessionStorage.getItem('operationSource'));
      //       console.warn(this.currentHouse, this.productType, totalFee);
      //       return;
      //       this.API.addRenderTasks({
      //         taskSource: 1,
      //         taskType: 0,
      //         // orderNo: '20171218135129878040', // 订单号
      //         planRecommendedId: this.planData.planRecommendedId,
      //         templateId: this.currentHouse.templateId,
      //         // renderingType: this.renderingType,
      //         renderingType: this.renderTypeList[this.changeIndex].renderingType,
      //         renderTaskType: this.productType,
      //         userId: Number(JSON.parse(localStorage.getItem('userInfo')).id),
      //         // productType: this.productType,
      //         totalFee: totalFee,
      //         payType: 1,
      //         operationSource: operationSource,
      //         designPlanSceneId: sessionStorage.getItem('cpId'),
      //         planHouseType: this.planData.planHouseType ? 2 : 1
      //       })
      //       .then(response => {
      //         if (response) {
      //           if(!response.flag && !response.success){
      //             // this.$toast(response.message)
      //             this.closeHint();
      //             this.$confirm({
      //               title: '充值',
      //               msg: '度币余额不足，去充值？'
      //             })
      //             .success(instance => {
      //               instance.close();
      //               this.$router.push('/paypage');
      //             })
      //             // this.renderHintFlag = true;
      //             return;
      //           }
      //           if (response.obj === '') {
      //             this.$toast(response.message)
      //             this.$store.commit('popupMsg', '当前风格没有720°全景');
      //             this.$store.commit('showPopup');
      //             return;
      //           }
      //           this.changeIndex = -1;
      //           this.renderHintFlag = true;
      //         }else {
      //           this.$toast(response.message)
      //           this.closeHint();
      //         }
      //       })
      //       setTimeout(() => {
      //         this.toAddRenderTask = true;
      //       }, 1500)
      //   }else {
      //     var spaceFunctionId = '';
      //     if(this.fromPage === "mymodule") {
      //       spaceFunctionId = this.currentSpaceList[this.currentSpaceIndex].spaceFunctionId + '';
      //     }else {
      //       spaceFunctionId = this.currentSpaceList[this.currentSpaceIndex].value + '';
      //     }
      //     this.API.spaceLayout({
      //       houseId: this.$route.params.id,
      //       msgId: JSON.parse(localStorage.getItem('userInfo')).id,
      //       limit: 10,
      //       start: 0,
      //       token: localStorage.getItem('token'),
      //       spaceFunctionId: spaceFunctionId
      //     }).then((response) => {
      //         this.spaceLayoutData = response;
      //         if(response.success) {
      //         if (!this.toAddRenderTask) { return; }
      //         let totalFee;
      //         if (this.isPackYearsAndMonthShow) {
      //           totalFee = 0;
      //         } else {
      //           totalFee = this.renderTypeList[this.changeIndex].price * 10;
      //         }
      //         if (this.changeIndex == -1) {
      //           this.$store.commit('popupMsg', '您还没有选择渲染类型');
      //           this.$store.commit('showPopup');
      //           return;
      //         }
      //         this.toAddRenderTask = false;
      //         let operationSource = Number(sessionStorage.getItem('operationSource'));

      //         this.API.addRenderTasks({
      //           taskSource: 1,
      //           taskType: 0,
      //           // orderNo: '20171218135129878040', // 订单号
      //           planRecommendedId: this.planData.planRecommendedId,
      //           templateId: this.currentHouse.templateId,
      //           // renderingType: this.renderingType,
      //           renderingType: this.renderTypeList[this.changeIndex].renderingType,
      //           renderTaskType: this.productType,
      //           userId: Number(JSON.parse(localStorage.getItem('userInfo')).id),
      //           // productType: this.productType,
      //           totalFee: totalFee,
      //           payType: 1,
      //           operationSource: operationSource,
      //           designPlanSceneId: sessionStorage.getItem('cpId'),
      //           houseId: this.$route.params.id,
      //           houseCommonCode: this.spaceLayoutData.datalist[this.currentSpaceIndex].houseCommonCode,
      //           houseName: this.spaceLayoutData.datalist[this.currentSpaceIndex].houseName,
      //           livingName:this.spaceLayoutData.datalist[this.currentSpaceIndex].livingName,
      //           planHouseType: this.planData.planHouseType ? 2 : 1
      //         })
      //         .then(response => {
      //           if (response) {
      //             if(!response.flag && !response.success){
      //               // this.$toast(response.message)
      //               this.closeHint();
      //               this.$confirm({
      //                 title: '充值',
      //                 msg: '度币余额不足，去充值？'
      //               })
      //               .success(instance => {
      //                 instance.close();
      //                 this.$router.push('/paypage');
      //               })
      //               // this.renderHintFlag = true;
      //               return;
      //             }
      //             if (response.obj === '') {
      //               this.$toast(response.message)
      //               this.$store.commit('popupMsg', '当前风格没有720°全景');
      //               this.$store.commit('showPopup');
      //               return;
      //             }
      //             this.changeIndex = -1;
      //             this.renderHintFlag = true;
      //           }else {
      //             this.$toast(response.message)
      //             this.closeHint();
      //           }
      //         })
      //         setTimeout(() => {
      //           this.toAddRenderTask = true;
      //         }, 1500)
      //         // this.API.deductionOfPoints({
      //         //   userId: localStorage.getItem('userId'),
      //         //   totalFee: this.renderTypeList[this.changeIndex].price * 10,
      //         //   planId: sessionStorage.getItem('planId'),
      //         //   templateId: sessionStorage.getItem('templateId'),
      //         //   recommendedPlanId: sessionStorage.getItem('planRecommendedId'),
      //         //   renderingType: this.renderTypeList[this.changeIndex].renderingType,
      //         //   productType: this.productType
      //         // }).then((response) => {
      //         //   if (!response.success) {
      //         //     this.$store.commit('popupMsg', response.message);
      //         //     this.$store.commit('showPopup');
      //         //   }

      //         // });
      //           }
      //     })
      //   }
      // },
      // isPackYearsAndMonth() {
      //   this.API.isPackYearsAndMonth({
      //     platformCode: 'pc2b',
      //     msgId: 'mobile2b'
      //   })
      //   .then((res) => {
      //     if (res.status || res.success) {
      //       if (res.obj.state === '0') {
      //         this.isPackYearsAndMonthShow = false;
      //       } else if (res.obj.state === '1' || res.obj.state === '2' || res.obj.state === '3' || res.obj.state === '4') {
      //         this.isPackYearsAndMonthShow = true;
      //       } else {
      //         this.isPackYearsAndMonthShow = false;
      //       }
      //     } else {
      //       this.isPackYearsAndMonthShow = false;
      //     }
      //   });
      // },
      // goMyTask() { // 前往我的任务也没
      //   this.renderPayFlag = false;
      //   this.renderHintFlag = false;
      //   this.changeIndex = -1;
      //   this.$store.state.intergralHeader = false;
      //   this.$store.state.isRecom = false;
      //   this.$router.push('/replace');
      // },
      // getRenderTypeList(datalist) {
      //   if (datalist.length > 0) {
      //     for (var i = 0; i < this.renderTypeList.length; i++) {
      //       this.$set(this.renderFlag, i, true)
      //       this.$set(this.isViewNow, i, false)
      //       for (var k = 0; k < datalist.length; k++) {
      //         if (datalist[k].renderingType == this.renderTypeList[i].renderingType) {
      //           this.$set(this.renderFlag, i, false)
      //           if (datalist[k].taskType == 2) {
      //             this.$set(this.isViewNow, i, true)
      //           } else if (datalist[k].taskType == 3) {
      //             this.$set(this.renderFlag, i, true)
      //           }
      //         }
      //       }
      //     }
      //   } else {
      //     for (var j = 0; j < this.renderTypeList.length; j++) {
      //       this.$set(this.renderFlag, j, true)
      //     }
      //   }
      //   for (var a = 0; a < this.renderFlag.length; a++) {
      //     if (this.renderFlag[a]) {
      //       this.isShowSureBtn = true
      //       break
      //     }
      //   }
      // }
    },
    components: {
      PlanItem
    },
    // activated () {
    //     //this.recomData = (sessionStorage.getItem('recomData') && JSON.parse(sessionStorage.getItem('recomData'))) || '';
    // },
    activated () {
       this.IsPayPlanStatus();
    },
    async created() {
      this.initCrrentData();
      this.resetFitment();
      this._getIntegral();
      this.accountBalance = localStorage.getItem('balanceAmount');
      // this.isPackYearsAndMonth(); // 是否有包年包月
      sessionStorage.setItem('cpId', '');
     
      // 方案存储的数据
      this.recomData = (sessionStorage.getItem('recomData') && JSON.parse(sessionStorage.getItem('recomData'))) || '';

      var that = this;
      await this.querySpaceList();
      if (this.fromPage === 'typechange') {
        await this.queryCurrentSpaceList({
          houseId: this.$route.params.id,
          currentSpaceId: this.$route.query.planId && this.recomData.spaceFunctionId
        })
        await this.queryNewHouseList({
          houseId: this.$route.params.id
        })
      }
      if (this.fromPage === 'space') {
        this.spaceSetType(this.$route.query.spaceId)
        await this.queryNewSpaceDesignList({
          houseId: this.$route.params.id
        })
      }
      await this.queryStyleList()
      await this.queryPlanList()
      if (this.fromPage === 'mymodule') {
        // let data = {
        //         start:0,
        //         limit:10,
        //         houseId,
        //         msgId: get(rootGetters, 'common/userInfo.id')
        //     };
        // this.API.getSpaceNameInHouse().then(res=> {
        //   console.log()
        // })
        await this.queryNewHouseList({
          houseId: this.$route.params.id
        })
        this.API.spaceLayout({
          houseId: this.$route.params.id,
          msgId: JSON.parse(localStorage.getItem('userInfo')).id,
          limit: 10,
          start: 0,
          token: localStorage.getItem('token'),
          spaceFunctionId: this.$route.query.spaceFunctionId
        }).then((response) => {
          this.spaceLayoutData = response;
          response.datalist.map(item => {
            item.active = true;
            if (item.spaceFunctionId == 1) {
              item.name = '客厅';
            } else if (item.spaceFunctionId == 2) {
              item.name = '餐厅';
            } else if (item.spaceFunctionId == 3) {
              item.name = '客餐厅';
            } else if (item.spaceFunctionId == 4) {
              item.name = '卧室';
            } else if (item.spaceFunctionId == 5) {
              item.name = '厨房';
            } else if (item.spaceFunctionId == 6) {
              item.name = '卫生间';
            } else if (item.spaceFunctionId == 7) {
              item.name = '书房';
            } else if (item.spaceFunctionId == 8) {
              item.name = '衣帽间';
            } else if (item.spaceFunctionId == 9) {
              item.name = '其他';
            } else if (item.spaceFunctionId == 10) {
              item.name = '阳台';
            } else if (item.spaceFunctionId == 11) {
              item.name = '入户花园';
            } else if (item.spaceFunctionId == 12) {
              item.name = '天井';
            }
          })
          this.API.recom({
            areaValue: response.datalist[0].spaceAreas,
            brandName: "",
            creator: "",
            designRecommendedStyleId: "",
            displayType: "decorate",
            houseType: this.$route.query.spaceFunctionId,
            isMainList: "1",
            limit: 10,
            livingName: "",
            msgId: JSON.parse(localStorage.getItem('userInfo')).id,
            start: 0,
            templateId: response.datalist[0].templateId
          }).then((res) => {
            this.setplanList({
              datalist: res.datalist,
              totalCount: res.totalCount,
              start: this.start
            })
          })
          this.setcurrentSpaceList(response.datalist);
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      to.meta.keepNotAlive = false;
      next();
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepNotAlive = !(to.name === 'view720' || to.name === 'photoview' || to.name === 'putInHouse');
      let keepAliveComponent = this.$vnode.parent;
      if (keepAliveComponent && from.meta.keepNotAlive) {
        delete keepAliveComponent.componentInstance.cache[keepAliveComponent.componentInstance.keys[0]];
        keepAliveComponent.componentInstance.keys.pop();
      }
      next();
    }
  }

</script>

<style lang="scss" scoped>
  .decorate {
    @at-root #{&}__container {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .plan__payAlert1Bg {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.5);

        .plan__payAlert1 {
          position: absolute;
          width: 540px;
          //padding-bottom: 60px;
          background-color: #ffffff;
          border-radius: 10px;
          top: 50%;
          left: 50%;
          margin-top: -230px;
          margin-left: -270px;

          .plan__payAlert1--close {
            height: 60px;
            line-height: 60px;
            text-align: right;
            padding: 10px;
            margin-bottom: 30px;

            .plan__payAlert1--closeImg {
              width: 40px;
              height: 40px;
            }
          }
          .plan__payAlert1--money{
            color: #333333;
            font-size: 28px;
            line-height: 40px;
            text-align: center;
          }
          .plan__payAlert1--tip{
            color: #ff6419;
            font-size: 32px;
            text-align: center;
            margin-top: 40px;
          }
          .plan__payAlert1--after{
            font-size: 24px;
            color: #999999;
            text-align: center;
            line-height: 70px;
          }
          .plan__payAlert1--btnBox{
            margin-top: 40px;
            display: flex;
            border-top: 1px solid #f5f5f5;
            .returnbtn,.checkbtn{
              flex: 1;
              height: 88px;
              line-height: 88px;
              font-size: 28px;
              text-align: center;
            }
            .returnbtn{
              color: #999999;
              border-right: 1px solid #f5f5f5;
            }
            .checkbtn{
              color: #ff6419;
            }
          }
           .plan__payAlert1--sucessImgBox{
            height: 240px;
            >img{
              height: 100%;
              width: 240px;
              display: block;
              margin: 0 auto;
            }
          }
          .plan__payAlert1--failImgBox{
            height: 140px;
            >img{
              padding: 20px;
              height: 100%;
              width: 100%;
              box-sizing: border-box;
            }
          }
          .plan__payAlert1--button{
            width: 420px;
            height: 80px;
            line-height: 80px;
            background: #ff6419;
            color: white;
            font-size: 32px;
            text-align: center;
            margin: 0 auto;
            margin-top: 20px;
            border-radius: 40px;
          }
          .plan__payAlert1--lastbox{
            height: 140px;
            margin-top: 40px;
            background: #ffc24b;
            >img{
              height: 100%;
              width: 100%;
            }
          }
          .plan__payAlert1_main_imgBox {
            text-align: center;
            margin-bottom: 60px;

            .plan__payAlert1_main_img {
              width: 100px;
              height: 122px;
            }
          }

          .plan__payAlert1_main_title {
            font-size: 28px;
            color: #333;
            margin-bottom: 60px;
            text-align: center;
          }

          .plan__payAlert1--price {
            font-size: 60px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 0px;
            letter-spacing: 0px;
            color: #ff6419;
            text-align: center;
            margin-bottom: 60px;
          }

          .plan__payAlert1--tit {
            font-size: 28px;
            color: #999;
            text-align: center;
            margin-bottom: 40px;
            line-height: 60px;
          }

          .payOpt {
            padding: 0 60px;
            margin-bottom: 80px;

            .payOpt_item {
              height: 60px;
              margin: 20px 0;

              .payOpt_item_img {
                width: 60px;
                height: 60px;
                vertical-align: middle;
              }

              .payOpt_item_tit {
                display: inline-block;
                height: 60px;
                line-height: 60px;
                font-size: 28px;
                color: #333;
                vertical-align: middle;
              }

              .payOpt_item_sel {
                float: right;
                width: 40px;
                height: 40px;
                margin-top: 10px;
                margin-right: 20px;
              }
            }
          }

          .plan__payAlert1--paybutbox {
            text-align: center;

            .plan__payAlert1--paybut {
              width: 420px;
              height: 80px;
              background-color: #ff6419;
              border-radius: 40px;
              display: inline-block;
              font-size: 32px;
              color: #fff;
              line-height: 80px;
            }
          }
        }
      }
    }

    @at-root #{&}__header {
      flex: 0 0 auto;
      position: relative;
      height: 88px;
      line-height: 88px;
      text-align: center;
      font-size: 36px;
      background-color: #fff;
      z-index: 5;

      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        /*no*/
        background-color: #ddd;
        transform: scaleY(0.5);
      }

      @at-root #{&}--back {
        position: absolute;
        top: 50%;
        left: 20px;
        width: 45px;
        height: 45px;
        background-image: url('./images/nav_icon_back_black.png');
        background-position: 50%;
        background-size: cover;
        transform: translateY(-50%);
      }
    }

    @at-root #{&}__type {
      flex: 0 0 auto;
      position: relative;
      height: 75px;
      line-height: 75px;
      text-align: center;
      font-size: 28px;
      color: #474747;
      background-color: #fff;
      z-index: 5;

      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        /*no*/
        background-color: #ddd;
        transform: scaleY(0.5);
      }

      @at-root #{&}--icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-image: url('./images/down_nor.png');
        background-position: 50%;
        background-size: cover;
      }

      &.active {
        color: #ff6419;

        .decorate__type--icon {
          background-image: url('./images/down_pre.png');
        }
      }

      @at-root .type {
        @at-root #{&}__pannel {
          position: absolute;
          top: 163px;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(7, 17, 27, 0.5);
          z-index: 3;

          &.fixedNavActive {
            padding-top: 80px;
          }

        }

        @at-root #{&}__list {
          display: flex;
          flex-wrap: wrap;
          padding: 30px;
          background-color: #fff;

          &.dropdown-enter-active {
            transition: all 200ms ease;
          }

          &.dropdown-leave-active {
            transition: all 150ms ease;
          }

          &.dropdown-enter,
          &.dropdown-leave-active {
            transform: translate3d(0, -100%, 0);
          }
        }

        @at-root #{&}__item {
          width: 216px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          font-size: 28px;
          color: #333;
          background-color: #f5f5f5;
          border-radius: 5px;

          &:nth-of-type(n + 4) {
            margin-top: 20px;
          }

          &:not(:nth-of-type(3n + 3)) {
            margin-right: 20px;
          }

          &.active {
            color: #ff6419;
            background-color: #fff1eb;
          }
        }
      }
    }

    @at-root #{&}__content {
      flex: 1 1 auto;
      height: 100%;
      overflow: hidden;

      @at-root .content {
        @at-root #{&}__space {
          width: 100%;
          height: 310px;
          background-color: #eee;
          overflow: hidden;

          @at-root #{&}--item {
            height: 310px;
            padding: 24px 160px;
            box-sizing: border-box;
            overflow: hidden;

            div {
              height: 100%;
              border-radius: 25px;
              border: 4px solid #ff6419;
              box-sizing: border-box;
              overflow: hidden;

              &.unactive {
                border-color: #eee;
              }

              img {
                height: 100%;
              }
            }
          }
        }

        @at-root #{&}__nav {
          position: relative;
          padding: 0 60px 0 30px;
          height: 80px;
          line-height: 80px;
          text-align: center;

          &.nav__fixed {
            position: absolute;
            width: 100%;
            background-color: #fff;
            box-sizing: border-box;
            z-index: 15;
          }

          &:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            /*no*/
            background-color: #ddd;
            transform: scaleY(0.5);
          }

          @at-root #{&}--list {
            height: 100%;
            box-sizing: border-box;
          }

          @at-root #{&}--item {
            box-sizing: border-box;

            &.active {
              border-bottom: 3px solid #ff6419;
              /*no*/
            }
          }

          @at-root #{&}--filter {
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            font-size: 32px;
          }
        }

        @at-root #{&}__list {
          @at-root .list {
            @at-root #{&}__item {
              padding: 30px;
              box-sizing: border-box;
            }
          }

          @at-root .recom {
            @at-root #{&}__item {
              margin-bottom: 30px;
              color: #ff6419;

              @at-root #{&}--before {
                display: inline-block;
                padding: 10px 20px;
                margin: 0 24px 5px 0;
                color: #fff;
                background-color: #ff6419;
                border-radius: 0 50px 50px 0;
              }
            }
          }
        }
      }
    }
  }

  .render-popup {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.4);

    .render-wrapper {
      position: absolute;
      width: 540px;
      height: 460px;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      border-radius: 8px;
      background: #fff;
      font-size: 32px;

      .render-header {
        height: 88px;
        line-height: 88px;
        text-align: center;
        font-weight: bold;
        border: 1px solid #eee;
      }

      .render-kind {
        .kind-item {
          height: 88px;
          line-height: 88px;
          border: 1px solid #eee;
          overflow: hidden;

          .kind-text {
            margin-left: 84px;
            float: left;

            .type {
              display: block;
              width: 210px;
              float: left;
            }

            .price {
              float: left;
            }

            .flag-wrapper {
              float: left;
              display: block;
            }

            .completed {
              color: #ff6419;
            }
          }

          .select {
            display: block;
            width: 41px;
            height: 41px;
            float: right;
            margin: 23px 32px;
            border: 1px solid #999;
            /*no*/
            border-radius: 50%;
          }

          .select-active {
            background: url('./images/seclectA.png');
            border-color: #ff6419;
            background-size: cover;
            background-position: 50% 50%;
            background-origin: border-box;
          }
        }
      }

      .render-footer {
        display: flex;
        width: 100%;
        height: 88px;
        line-height: 88px;
        font-weight: bold;

        .render-cancel {
          flex: 1;
          text-align: center;
          border-right: 3px solid #eee;
        }

        .render-sure {
          flex: 1;
          text-align: center;
          color: #ff6419;
        }

        .unableAddRenderTak {
          color: #e0e0e0;
        }
      }
    }

    .render-state {
      width: 540px;
      font-size: 24px;
      height: 300px;
      background: #fff;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      border-radius: 8px;

      .hint-image {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 45px 0 30px;

        .loading-img {
          width: 75px;
          height: 75px;
        }
      }

      .hint-text {
        text-align: center;
      }

      .state-footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        height: 80px;
        line-height: 80px;
        border-top: 1px solid #eee;
        display: flex;

        .state-footer-both {
          flex: 1;
          font-size: 28px;
          text-align: center;
        }

        .state-footer-left {
          border-right: 1px solid #eee;
        }
      }
    }
  }

  .plan__decorate {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;

    .plan__decorate--box {
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

      .plan__decorate--title {
        margin-top: 38px;
        line-height: 53px;
        text-align: center;
        color: #333;
        font-size: 32px;
      }

      .plan__decorate--item {
        margin-top: 32px;

        .plan__decorate--main {
          color: #333;
          line-height: 48px;
          font-size: 28px;
        }

        .plan__decorate--secondary {
          color: #999;
          font-size: 24px;
          line-height: 28px;
        }
      }

      .plan__decorate--confirm {
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

  .filter {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 242px;
    left: 0;
    width: 100%;
    background-color: #fff;

    &.dropdown-enter-active {
      transition: all 200ms ease;
    }

    &.dropdown-leave-active {
      transition: all 150ms ease;
    }

    &.dropdown-enter,
    &.dropdown-leave-active {
      transform: translate3d(0, 100%, 0);
    }

    @at-root #{&}__content {
      flex: 1;
      height: 100%;
      padding: 30px;
    }

    @at-root #{&}__item {

      &:nth-of-type(2n) {
        margin-top: 60px;
      }

      @at-root #{&}--title {
        margin-bottom: 30px;
        font-size: 28px;
        font-weight: bold;
        color: #000;
      }

      @at-root #{&}--list {
        display: flex;
        flex-wrap: wrap;
      }

      @at-root #{&}--type {
        flex-basis: 32%;
        height: 80px;
        line-height: 80px;
        font-size: 28px;
        text-align: center;
        border-radius: 5px;
        background-color: #f5f5f5;

        &:nth-of-type(n+4) {
          margin-top: 20px;
        }

        &:not(:nth-of-type(3n)) {
          margin-right: 2%;
        }

        &.active {
          color: #ff6419;
          background-color: #fff1eb;
        }
      }
    }

    @at-root #{&}__submit {
      display: flex;
      align-items: stretch;
      flex-shrink: 0;
      flex-basis: 88px;
      width: 100%;
      height: 88px;
      line-height: 88px;
      text-align: center;
      font-family: PingFang-SC-Medium;
      font-size: 32px;

      @at-root #{&}--reset {
        flex-basis: 250px;
        border-top: 1px solid #f5f5f5;
      }

      @at-root #{&}--sure {
        flex: 1;
        color: #fff;
        background-color: #ff6419;
      }
    }
  }
  .afterRender {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);

      @at-root #{&}__content {
        width: 500px;
        border-radius: 8px;
        background-color: #fff;
        transform-origin: center bottom;

        &.scale-enter-active {
          transition: all 200ms ease
        }

        &.scale-leave-active {
          transition: all 150ms ease
        }

        &.scale-enter,
        &.scale-leave-active {
          transform: scale3d(0, .5, 0);
        }
      }

      @at-root #{&}__body {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;

        @at-root #{&}--loading {
          width: 100px;
          height: 100px;
          margin-bottom: 40px;
          background-image: url(./images/loading.gif);
          background-size: 100%;
        }
      }

      @at-root #{&}__footer {
        position: relative;
        display: flex;

        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          /*no*/
          transform: scaleY(0.5);
          background-color: rgba(4, 4, 4, 0.12);
          ;
        }

        @at-root #{&}--sure,
        #{&}--task {
          position: relative;
          flex-basis: 50%;
          height: 90px;
          line-height: 90px;
          text-align: center;
        }

        @at-root #{&}--task {
          color: #ff6419;

          &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            /*no*/
            height: 100%;
            transform: scaleX(0.5);
            background-color: rgba(4, 4, 4, 0.12);
            ;
          }
        }
      }
    }
</style>
