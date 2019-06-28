<template>
  <div class="caseDeatil">
        <header>
            <i class="icon-left" @click="$router.go(-1)"></i>
            <div class="title">方案详情</div>
        </header>
        <scroll class="wrapper" 
        :probeType = "probeType"
        :pullup = "true"
        :beforeScroll = "true"
        :scrollX = "false"
        :refreshScroll = "true"
        :data = "caseDetails"
        ref = "wrapperScroll">
          <div class="box">
            <img class="mian_img" :src="resourcePath+caseDetails.coverPath" alt="">
            <div class="info">
              <div class="info_item">
                <span class="info_name">{{planDetail.designPlanName}}</span>
                <span v-if="planDetail.groupPrimaryId" class="info_type">精选</span>
                <span v-if="planDetail.planHouseType==2" class="info_type">全屋</span>
                <!-- <span class="info_look">浏览　{{planDetail.useCount}}</span> -->
              </div>
              <div class="info_item">
                <div class='info_tit'>{{planDetail.spaceStyleName}}  | <span v-if="planDetail.planHouseType!=2">{{planDetail.spaceArea}}㎡ |</span> 
                <span v-if="planDetail.planDecoratePriceList.length>0">
                  {{planDetail.planDecoratePriceList[0].decorateTypeName + '￥' + planDetail.planDecoratePriceList[0].decoratePrice + '元/m²'}}</span>
                 </div>
                <div class='info_more' v-if='planDetail.planDecoratePriceList.length>0'>
                  <img src='./images/home_icon_more_02.png' @click="decoratePriceBox = true">
                </div>
              </div>
              <div class="info_logo">
                <div class="logobox">
                  <img :src="planDetail.designerHeadPic?resourcePath + planDetail.designerHeadPic:require('./images/goods_pic_no.png')" alt="">
                </div>
                <div class="logo_info">
                  <div class="logo_info_name">{{planDetail.designerName || '暂无'}}</div>
                  <div class="logo_info_type">设计师</div>
                </div>
                <div class="goShopBox" v-if="planDetail.shopId">
                  <div @click="$router.push(`/tcdetail/${planDetail.shopId}`)">进入店铺</div>
                </div>
              </div>
            </div>
            <div class="mian">
              <div class="item" v-if="caseDetails.planHouseType!=2">
                <div class="title">照片级效果</div>
                <div class="imgbox" @click.stop="$router.push({name: 'photoview', params: {page: 'plan', id: caseDetails.planRecommendedId}})">
                  <img class="item_img" :src="resourcePath+planDetail.designPlanCoverPath" alt="">
                  <img class="item_icon" src="./images/6.png" alt="">
                </div>
              </div>
              <div class="item">
                <div class="title">720漫游效果</div>
                <div class="imgbox" @click="sel720">
                  <img class="item_img" :src="resourcePath+planDetail.designPlanCoverPath" alt="">
                  <img class="item_icon" src="./images/3.png" alt="">
                </div>
              </div>
              <div class="desc" v-if="planDetail.desc" v-html="planDetail.desc"></div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </scroll>
        <div class="footerBut" v-if="displayType==0">
          <!-- <div class="f_item" @click="collectPlan">
            <img class="f_item_img" :src="planDetail.isFavorite==1?require('./images/page_icon_collect_sct@2x.png'):require('./images/page_icon_collect_nor@2x.png')" alt="">
            <span class="f_item_tit">收藏</span>
            <span class="f_item_num">　{{planDetail.collectNum || 0}}</span>
          </div>
          <div class="f_item" @click="likePlan">
            <img class="f_item_img" :src="planDetail.isLike==1?require('./images/page_icon_like_sct@2x.png'):require('./images/page_icon_like_nor@2x.png')" alt="">
            <span class="f_item_tit">点赞</span>
            <span class="f_item_num">　{{planDetail.likeNum || 0}}</span>
          </div> -->
          <div class="f_but" @click="toMyHome">装进我家</div>
        </div>
        
      <div class="plan__decorate" v-show='decoratePriceBox' @click.stop>
      <div class="plan__decorate--box">
        <div class="plan__decorate--title">
          装修报价
        </div>
        <div class="plan__decorate--list">
          <div class="plan__decorate--item" v-for='(item, index) in planDetail.planDecoratePriceList' :key='index'>
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
  </div>
</template>
<script>
import mixins from "@/mixins/mixin";
import { mapGetters, mapActions } from 'Vuex';
import { isEmpty, debounce } from "lodash";
export default {
   mixins: [mixins],
    data() {
        return {
            planDetail: {},
            resourcePath: JSON.parse(localStorage.getItem('userInfo')).resourcesUrl,
            decoratePriceBox: false,
            caseListheight: '',
            caseListOverflow: 'none',
            isWholeHouse: 1, // 2表示全屋,
        }
    },
    computed: {
      ...mapGetters('caseDetail', ['caseDetails', 'displayType'])
    },
    activated() {
       this.getCaseDetails();
    },
    methods: {
      likePlan:debounce(function() {
        let data= {
          designPlanType: this.caseDetails.planHouseType!=2? 1 : 2,
          designId: this.planDetail.designPlanRecommendId,
          status: this.planDetail.isLike==0? 1: 0
        }
        this.API.setLikeOrDislike(data).then(res=> {
          this.planDetail.likeNum = res.obj;
          this.planDetail.isLike = data.status;
        })
      },20),
      collectPlan:debounce(function() {
        let data= {
          designPlanType: this.caseDetails.planHouseType!=2? 1 : 2,
          recommendId: this.planDetail.designPlanRecommendId,
          status: this.planDetail.isFavorite==0? 1: 0
        }
        this.API.setFavoriteOrUnfavorite(data).then(res=> {
          this.planDetail.collectNum = res.obj;
          this.planDetail.isFavorite = data.status;
        })
      },20),
       getCaseDetails() {
         this.API.planDetail(this.caseDetails.planRecommendedId, (this.caseDetails.planHouseType/1-1 == 1)? 1 : 0).then(res=> {
           this.planDetail =  res.obj[0];
         })
       },
      toMyHome: debounce(function() {
          sessionStorage.setItem("recomData", JSON.stringify(this.caseDetails));
          this.$router.push({
            name: "area",
            query: {
              planId: this.caseDetails.planRecommendedId
            }
          });
      }, 20),
      sel720: debounce(function() {
      if (this.$route.path == "/view720") return;
      this.$store.state.goBackPath = this.$route.path;
      sessionStorage.setItem("operationSource", 1);
      sessionStorage.setItem("routerQueryType", "seven");
      sessionStorage.setItem("msgId", "recommended");
      // this.$store.commit("audioAutoPlay");
      this.$store.state.isCollectIndex = this.index;
      this.$store.state.view720.view720Id = this.caseDetails.planRecommendedId;
      sessionStorage.setItem("view720Id", this.caseDetails.planRecommendedId);
      sessionStorage.setItem("planId", this.caseDetails.planId);
      sessionStorage.setItem("groupPlanId", this.caseDetails.planRecommendedId);
      sessionStorage.setItem("groupType", 0); // 设置组合替换类型
      sessionStorage.setItem("bid", this.caseDetails.bid);
      this.$store.state.detailsSeeType = "";

      sessionStorage.setItem(
        "planRecommendedId",
        this.caseDetails.planRecommendedId
      );
      this.$store.state.renderSign = false;
      this.$store.commit("showComComponents", false);
      this.$store.state.view720.view720Small = this.caseDetails.coverPath;// response.datalist;
      this.$store.state.smallTitle = this.caseDetails.planName;
      this.$store.state.fromPath = "recom";
      this.$store.state.view720LoadingFlag = true;
      this.$store.state.recomSelIndex = this.index;
      this.$store.state.fasttype = "recommended";
      this.$router.push({name: 'view720', params: { uuid: this.caseDetails.fullHousePlanUUID }});
    }, 20)
    }
}
</script>
<style lang="sass" scoped>
   @import '../../styles/header.scss'
   @import './styles/caseDetails.scss'
</style>

