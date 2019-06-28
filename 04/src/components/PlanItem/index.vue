<template>
<div class="plan__item">
  <i class="plan__collection" :class="{active: itemData.isFavorite != 0}" v-if="showCollect && itemData.planTableType !== 2" @click.stop="collectPlan"></i>
  <div class="plan__img">
    <span class="plan__signicon" :class="showLabel && (itemData.groupPrimaryId && 'choiceness' || itemData.planTableType === 2 && 'fullroom')"></span>
    <img v-lazy="userInfo.resourcesUrl+itemData.coverPath" :key="userInfo.resourcesUrl+itemData.coverPath">
    <div class="plan__tool">
      <span class="plan__tool--left">
          <!-- <i class="plan__tool--img" v-if="itemData.planHouseType !== 2" @click.stop="$router.push({name: 'photoview', params: {page: 'plan', id: itemData.planRecommendedId}})"></i> -->
          <i class="plan__tool--vr" @click.stop="sel720"></i>
        </span>
      <span class="plan__tool--right" :class="{unactive: unActive}" v-if="showEnterDecorate" @click.stop="!unActive && toMyHome(itemData)">
          装进我家
          <i class="plan__tool--icon"></i>
      </span>
    </div>
  </div>
  <div class="plan__desc clearfix" v-if="showDesc">
    <p class="plan__desc--main">
      <span class="plan__desc--name" v-text="itemData.planName || itemData.designPlanName"></span>
      <!-- <span class="plan__desc--time" v-text="itemData.releaseTime || itemData.gmtCreate"></span> -->
      <img class="plan__desc--port" :src="itemData.designerHeadPic?userInfo.resourcesUrl + itemData.designerHeadPic:require('./images/goods_pic_no.png')" alt="">
    </p>
    <div class="clearfix" style="margin-bottom: 10px;">
      <p class="plan__desc--sub fl">
        <span>{{itemData.styleName }}{{itemData.planTableType === 2 || itemData.groupPrimaryId ? '' : '|' + itemData.spaceAreas + '㎡'}}</span>
        <span v-if="itemData.planDecoratePriceList">{{itemData.planDecoratePriceList.length > 0?'| ' + itemData.planDecoratePriceList[0].decorateTypeName + '￥' + itemData.planDecoratePriceList[0].decoratePrice + '元/m²': ''}}</span>
      </p>  <!--  -->
      <p class="plan__desc--logo fl"
      @click.stop="decoratePriceBox(itemData.planDecoratePriceList)" v-if="itemData.planDecoratePriceList&&itemData.planDecoratePriceList.length>0"></p>
    </div>
    <div class="copyRightPrice" v-if="itemData.copyRightPermission==1&&itemData.havePurchased==0">
      <span>{{itemData.planPrice}}度币</span>  <span class="copyRightPrice_tit">版权费</span>
    </div>
    <div class="copyRightPrice" v-if="itemData.copyRightPermission==1&&itemData.havePurchased==1" style="color:#999">
      <span style="text-decoration:line-through;">{{itemData.planPrice}}度币</span>  <span class="copyRightPrice_tit" style="color:#999;background:#fafafa;">已购买</span>
    </div>
    <!-- <div class='case-pagediv' :style="(itemData.copyRightPermission==1&&itemData.havePurchased==0)||(itemData.copyRightPermission==0&&itemData.havePurchased==1)?'':'border-top: solid 1px #ededed'">
      <div class='case-pagediv-box '>
        <div class='pagediv-box-left fl'>
          浏览量 {{itemData.useCount || 0}}
        </div>
        <div class='pagediv-box-right fr' v-if="itemData.planHouseType != 2">
          <div class='collet fl '  @click.stop='collectPlans'>
              <img :src='itemData.isFavorite!=1?require("./images/page_icon_collect_nor@2x.png"):require("./images/page_icon_collect_sct@2x.png")'>
            <span>{{itemData.collectNum || 0}}</span>
          </div>
          <div class='thumbs-up fl '  @click.stop='likePlan'>
              <img :src='itemData.isLike != 1?require("./images/page_icon_like_nor@2x.png"):require("./images/page_icon_like_sct@2x.png")'>
            <span>{{itemData.likeNum || 0}}</span>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from "Vuex";
import { isEmpty, debounce } from "lodash";
import collectService from "./components/collect/index";

export default {
  name: "plan-item",
  props: {
    shopId: {
      type: String,
      default: ''
    },
    showEnterDecorate: {
      type: Boolean,
      default: true
    },
    showCollect: {
      type: Boolean,
      default: true
    },
    showDesc: {
      type: Boolean,
      default: true
    },
    itemData: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    unActive: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters("common", ["userInfo"]),
    ...mapGetters("recom", ["favoritesList", "favoritesId"])
  },
  methods: {
    decoratePriceBox(item) {
      if (item) {
        item.forEach(value => {
          switch (value.decorateTypeName) {
            case "半包":
              value.text = "辅材+人工费+管理费";
              break;
            case "清水":
              value.text = "人工费+管理费";
              break;
            case "全包":
              value.text = "主材+辅材+人工费+管理费";
              break;
            case "包软装":
              value.text = "主材+辅材+人工费+管理费+部分软装";
              break;
          }
        });
        this.$emit("showDecoratePriceBox", item);
      }
    },
    ...mapActions("recom", [
      "getFavoritesList",
      "bindPlanItem",
      "unBindPlanItem"
    ]),
    likePlan:debounce(function() {
        let data= {
          designPlanType: this.itemData.planTableType!=2? 1 : 2,
          designId: this.itemData.planRecommendedId,
          status: this.itemData.isLike==0? 1: 0
        }
        this.API.setLikeOrDislike(data).then(res=> {
          this.itemData.likeNum = res.obj;
          this.itemData.isLike = data.status;
        })
      },20),
    collectPlans:debounce(function() {
        let data= {
          designPlanType: this.itemData.planTableType!=2? 1 : 2,
          recommendId: this.itemData.planRecommendedId,
          status: this.itemData.isFavorite==0? 1: 0,
        }
        this.API.setFavoriteOrUnfavorite(data).then(res=> {
          this.itemData.collectNum = res.obj;
          this.itemData.isFavorite = data.status;
        })
      },20),
    collectPlan: debounce(async function(e) {
      console.log(this.itemData.planTableType)
      if (this.itemData.bid == 0) {
        isEmpty(this.favoritesList) && await this.getFavoritesList();
        console.log()
        // return collectService(this.favoritesList).success(async (fid, vm) => {
          await this.bindPlanItem({
            planId: this.itemData.planRecommendedId,
            fid: this.favoritesList[0].bid,
            planTableType:this.itemData.planTableType
            // fid
          });
           this.$emit('getBindItem', this.itemData.planRecommendedId)
          this.itemData.bid = this.favoritesId;
          // vm.close();
          this.$toast("收藏成功!", 1000);
          return;
        // });
      }
      await this.unBindPlanItem({ fid: this.itemData.bid });
      this.itemData.bid = this.favoritesId;
      this.$emit('getUnBindItem', this.itemData.bid)
    }, 20),
    
    toMyHome: debounce(function(item) {
       sessionStorage.setItem("recomData", JSON.stringify(this.itemData));
      if (this.$route.name === "recom" || this.$route.name === "tcdetail" || this.$route.name === "userCollect") {
        sessionStorage.setItem("recomData", JSON.stringify(this.itemData));
        return this.$router.push({
          name: "area",
          query: {
            planId: this.itemData.planRecommendedId
          }
        });
      }

      if (!this.unActive) {
        // 样板房有选中，则允许调用720全景接口
        // this.$router.push({
        //   name: 'putInHouse',
        //   params: {
        //     id: this.itemData.planRecommendedId,
        //     houseId: this.$route.params.id,
        //     houseType: this.itemData.planHouseType === 2 ? 2 : 1
        //   }});
        this.$emit("isPay", item, this.$route.params.id);
        // this.$emit("changePlan", item);
        // this.isShowSureBtn = false;
        // sessionStorage.setItem("operationSource", 1);
        // this.$store.state.goBackPath = this.$route.path;
        // let houseTypeName = item.houseTypeName;
        // this.$store.state.fullView.fullViewTitle = houseTypeName;
        // this.planRecommendedId = item.planRecommendedId;
        // sessionStorage.setItem("planRecommendedId", item.planRecommendedId);
        // sessionStorage.setItem("planId", item.planId);
        // this.$emit("changeRender");

        // this.API.whetherRender({
        //   // 判断是否要显示渲染按钮
        //   userId: JSON.parse(localStorage.getItem("userInfo")).id,
        //   recommendedPlanId: item.planRecommendedId,
        //   templateId: item.templateId
        // }).then(response => {
        //   if (response) {
        //     this.RenderStateList = response.datalist;
        //     this.$emit("renderTypeListChild", response.datalist);
        //   }
        // });
      }
    }, 20),
    sel720: debounce(function() {
      if (this.$route.path == "/view720") return;
      this.$store.state.goBackPath = this.$route.path;
      sessionStorage.setItem("operationSource", 1);
      sessionStorage.setItem("routerQueryType", "seven");
      sessionStorage.setItem("msgId", "recommended");
      // this.$store.commit("audioAutoPlay");
      this.$store.state.isCollectIndex = this.index;
      this.$store.state.view720.view720Id = this.itemData.planRecommendedId;
      sessionStorage.setItem("view720Id", this.itemData.planRecommendedId);
      sessionStorage.setItem("planId", this.itemData.planId);
      sessionStorage.setItem("groupPlanId", this.itemData.planRecommendedId);
      sessionStorage.setItem("groupType", 0); // 设置组合替换类型
      sessionStorage.setItem("bid", this.itemData.bid);
      sessionStorage.setItem("shopId", this.shopId || '');
      sessionStorage.setItem('isTask', 0)
      this.$store.state.detailsSeeType = "";

      sessionStorage.setItem(
        "planRecommendedId",
        this.itemData.planRecommendedId
      );
      this.$store.state.renderSign = false;
      this.$store.commit("showComComponents", false);
      this.$store.state.view720.view720Small = this.itemData.coverPath;// response.datalist;
      this.$store.state.smallTitle = this.itemData.planName;
      this.$store.state.fromPath = "recom";
      this.$store.state.view720LoadingFlag = true;
      this.$store.state.recomSelIndex = this.index;
      this.$store.state.fasttype = "recommended";
      this.$router.push({name: 'view720', params: { uuid: this.itemData.fullHousePlanUUID }});

      /* this.API.recomGetPictureList({
        planRecommendedId: this.itemData.planRecommendedId,
        remark: "720"
      }).then(response => {
        if (response) {
          if (response.totalCount === 0) {
            this.$store.commit("popupMsg", "当前设计图没有720°全景");
            this.$store.commit("showPopup");
            return;
          }
          sessionStorage.setItem(
            "planRecommendedId",
            this.itemData.planRecommendedId
          );
          this.$store.state.renderSign = false;
          this.$store.commit("showComComponents", false);
          this.$store.state.view720.view720Small = response.datalist;
          this.$store.state.smallTitle = this.itemData.planName;
          this.$store.state.fromPath = "recom";
          this.$store.state.view720LoadingFlag = true;
          this.$store.state.recomSelIndex = this.index;
          this.$store.state.fasttype = "recommended";
          this.$router.push("/view720");
        }
      }); */
    }, 20)
  }
};
</script>
<style lang="scss" scoped>
.plan {
  @at-root #{&}__item {
    position: relative;
    background-color: #fff;
    box-shadow: 0px 6px 33px 4px
    rgba(0, 0, 0, 0.04);
    border-radius: 10px;
    &:not(:nth-last-of-type(1)) {
      margin-bottom: 30px;
    }
    .copyRightPrice {
      font-size: 40px;
      color: #ff6419;
      padding: 24px 0;
      border-top: solid 1px #f5f5f5;
      .copyRightPrice_tit {
        display: inline-block;
        width: 80px;
        height: 32px;
        font-size: 22px;
        color: #ff6419;
        background: #ffeee5;
        line-height: 32px;
        vertical-align: middle;
        text-align: center;
      }
    }
    /* 方案模块修改 */
    .case-pagediv {
      background-color: #fff;
    }
    .case-pagediv .case-pagediv-box{
      line-height: 89px;
    }
    .case-pagediv .pagediv-box-left {
      color: #999;
      font-size: 24px;
    }
    .case-pagediv .pagediv-box-right{
      margin-top: 20px;
    }
    .pagediv-box-right .collet {
      margin-right:26px;
    }
    .pagediv-box-right .thumbs-up{
      vertical-align:middle;
    }
    .pagediv-box-right img{
      width:47px;
      height: 47px;
      float: left;
    }
    .pagediv-box-right span {
      color:#999999;
      font-size: 24px;
      line-height: 47px;
      float:left;
    }
  }
  @at-root #{&}__collection {
    position: absolute;
    top: 8px;
    right: 14px;
    width: 60px;
    height: 60px;
    background-image: url("./images/collect_nor.png");
    background-position: 50%;
    background-size: 80%;
    background-repeat: no-repeat;
    z-index: 2;
    &.active {
      background-image: url("./images/collect_pre.png");
    }
  }

  @at-root #{&}__signicon {
    position: absolute;
    top: 0;
    left: 20px;
    width: 40px;
    height: 68px;
    background-size: 100%;

    &.choiceness {
      background-image: url("./images/home_msg_group.png");
    }

    &.fullroom {
      background-image: url("./images/home_msg_whole.png");
    }
  }

  @at-root #{&}__img {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }

  @at-root #{&}__tool {
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 0;
    bottom: 30px;
    width: 100%;

    @at-root #{&}--left {
      display: flex;
      justify-content: space-between;
      width: 180px;
      margin-left: 40px;
    }

    @at-root #{&}--img,
      #{&}--vr {
      width: 60px;
      height: 60px;
      background-position: 50%;
      background-size: cover;
    }

    @at-root #{&}--img {
      background-image: url("./images/photo.png");
    }

    @at-root #{&}--vr {
      background-image: url("./images/fullview.png");
    }

    @at-root #{&}--right {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 40px;
      height: 60px;
      background-image: linear-gradient(-90deg, #ff6419, #ffa072);
      background-blend-mode: normal;
      border-radius: 30px 0 0 30px;
      color: #fff;
      text-align: center;

      &.unactive {
        filter: saturate(5%);
      }
    }

    @at-root #{&}--icon {
      display: inline-block;
      width: 12px;
      height: 24px;
      margin-left: 25px;
      background-image: url("./images/right_arrow.png");
      background-size: cover;
    }
  }

  @at-root #{&}__desc {
    padding: 0 30px;
    padding-bottom: 15px;
    @at-root #{&}--main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0 10px;
    }

    @at-root #{&}--name {
      font-size: 30px;
      color: #494949;
    }

    @at-root #{&}--port {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    @at-root #{&}--time,
      #{&}--sub {
      font-size: 22px;
      color: #747474;
    }
    @at-root #{&}--logo {
      width: 56px;
      height: 56px;
      background-size: 100% 100%;
      background-image: url("./images/home_icon_more_02.png");
      margin-top: -18px;
    }
  }
}
</style>
