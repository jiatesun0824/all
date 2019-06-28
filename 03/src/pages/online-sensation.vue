<template>
  <div class="online-sensation">
    <div class="stylist-img"></div>
    <div class="stylist-info">
      <div class="stylist-name">她是 — 刘柳</div>
      <i class="company-logo"></i>
      <div class="stylist-glory">
        她，八年踌躇满志蓄势待飞<br>
        她，曾任职<br>
        华东家装龙头企业设计师<br>
        全国前三的装饰设计上市企业精英<br>
        多次与国际设计大师一对一交流理念<br>
        设计大型项目工程超过100个
      </div>
      <div class="stylist-works" @click="goTo720First(122106)">
        <!-- 按钮 -->
        <button class="goTo720"></button>
        <span class="stylist-works-text">刘柳作品</span>
      </div>
      <div class="stylist-interests">
        热爱设计，&nbsp;坚守“工匠精神”，&nbsp;追求极致空间。&nbsp;感悟设计在生活及生命中的力量， 让设计更具神采飞扬。<br>
        <span class="interests-culture">如文化，如人情，如希冀。</span><br>
        运用设计元素制造相互矛盾、撞击，让作品生命化。今天，刘柳将她的设计理念带到了随选网。
      </div>
      <div class="stylist-works-two" @click="goTo720First(121374)">
        <!-- 按钮 -->
        <button class="goTo720"></button>
        <span class="stylist-works-text">刘柳作品</span>
      </div>
      <!-- 智能AR -->
      <div class="AR-design">
        <div class="AR-design-img">
          <img src="../../static/image/liuer_detail_title_01.png">
        </div>
        <div class="AR-design-text">
          如果只是看一张效果图，就决定进行装修，难免还是有点不负责任，未来难以预测，唯家是不可辜负的避湾。<br>
          <p class="design-text">如果，让你看到设计真正的生命呢？</p>
          用手机，把设计效果装进自己的家，720°全景细节体验一秒预见未来家，98%真实视觉效果体验地板的纹理、灯台的闪烁、墙砖上的光泽......<br>
          <p class="design-text">一键如临其境，未来定不辜负。</p>
        </div>
      </div>
    </div>
    <div class="stylist-case">
      <div class="case-video" @click.stop="playVideo">
        <video 
          :src="'https://show.ci.sanduspace.com' + '/pc-admin/sanduspace.mp4'" 
          poster="../../static/image/liuer_detail_video.png" 
          ref="video" 
          x5-playsinline="" 
          playsinline="" 
          webkit-playsinline=""
          :controls="controls" 
          loop="loop"></video>
        <img v-if="videoButtonShow" class="case-video-button" src="../../static/image/liuer_detail_play.png">
      </div>
      <div class="case-logo"></div>
      <div class="individual-case" v-for="(item,index) in recommendPlanList" :key="index">
        <div class="case-top" @click="goTo720First(item.planRecommendedId)">
          <img class="individual-img" :src="resourceURL + item.coverPath">
          <img class="go-to720" src="../../static/image/home_icon_3d.png" >
        </div>
        <!-- <button class="go-to-home" @click="goToHome(item.planRecommendedId)">装进我家</button> -->
      </div>
      <div class="stylist-spirit">
        设计师一定要有工匠精神，&nbsp;把信仰、气质融入设计。用一颗追求极致的工匠之心去回报客户的每一份信任，&nbsp;把一丝不苟、精益求精的执着融入设计的每一个环节。
        <p>必会清风，&nbsp;徐来花自开。</p>
      </div>
    </div>
    <div class="stylist-button" @click="goToMore">
      <button class="footer-btn">了解更多</button>
    </div>
  </div>
</template>

<script>
import { indexMixin } from "@/mixin";

export default {
  name: "online-sensation",
  loop: false,
  mixins: [indexMixin],
  data() {
    return {
      videoButtonShow: true,
      controls: false,
      recommendPlanList: []
    };
  },
  mounted() {
    this.getList();
    document.title = "刘柳个人专题";
  },
  methods: {
    playVideo() {
      this.videoButtonShow = false;
      this.controls = true;
      this.$refs.video.src = "https://show.ci.sanduspace.com/pc-admin/sanduspace.mp4";
      this.$refs.video.play();
    },
    pauseVideo() {
      this.controls = false;
      this.$refs.video.pause();
    },
    goTo720First(planId) {
      window.location.href = `${this.recommendCaseRouterUrl}platformCode=brand2c&operationSource=1&planId=${planId}&routerQueryType=seven&customReferer=https%3A%2F%2Fservicewechat.com%2Fwx0d37f598e1028825%2Fdevtools%2Fpage-frame.html&platformNewCode=miniProgram&formId=the%20formId%20is%20a%20mock%20one&isRender=0&shopId=135&isGoods=`;
    },
    getList() {
      this.API.getRecommendationplan({
        recommendationPlanSearchVo: {
          displayType: "decorate",
          platformCode: "selectDecoration",
          companyId: 3332,
          shopId: 135,
          enterType: "shop"
        },
        pageVo: { start: 0, pageSize: 3 }
      }).then(res => {
        if (res.success && res.datalist) {
          this.recommendPlanList = res.datalist;
        }
      });
    },
    goToMore() {
      return this.isMiniprogram
        ? wx.miniProgram.navigateTo({
            url: "/pages/decoration/companyDetail/companyDetail?id=" + 135
          })
        : null;
    }
  }
};
</script>

<style scoped lang='scss'>
@import '../css/online-sensation.scss';
</style>
