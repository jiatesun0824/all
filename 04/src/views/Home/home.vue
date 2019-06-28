
<template>
  <div class="homePage" v-if="!isIntermediary" style="overflow: scroll;">
      <scroll :probeType="probeType"
              :listenScroll="listenScroll"
              :data="supplyList"
              pulldown
              @pulldown="userInfo.userType === 11 && pulldown()"
              ref="scroll">
        <div class="city">
          <!--<div class="bg">-->
            <!--<img src="./images/home_bg_banner.png">-->
          <!--</div>-->
          <!-- tab 开始 -->
          <div class="tab relative" ref="tabContent">
            <!--<div class="tab-item left" :class="{'active': item.active}"  v-for="(item, index) in homeTypeTab" :key="index" @click="selTab(index)" v-text="item.label"></div>-->
            <!-- 搜索模块 开始 -->
            <div class="area-search" ref="searchContent">
              <div class="local relative" @click="$router.push('/citySelector')">
                <span>{{this.$store.state.citySelector.item.areaName}}</span>
                <i></i>
                <!--<span class="short-line"></span>-->
              </div>
              <div class="search-input" @click.stop="routerToSearch">
                <i></i>
                <input type="text" placeholder="找装修房屋、建材、设计师" class="search-text" readonly>
              </div>
            </div>
            <!-- 搜索模块 结束 -->
            <div class="msg-box" :class="{isTip: showTipDot}" @click="toMsgList">
              <img src="./images/home_icon_message.png"/>
              <expire-tip v-if="showTipLabel"></expire-tip>
              <span class="redDot" v-if="haveUnRead"></span>
              <span class="redDot" v-if="haveStystemUnRead"></span>
            </div>
          </div>
          <!-- tab 结束 -->


          <content-item :supplyList="supplyList" :tabIndex="findIndex(homeTypeTab, {active: true})" :bannerList="bannerList" @tabChange="selTab"></content-item>
        </div>
        <!-- 发布icon 开始-->
        <div class="release-icon text-center" @click="goRelease()">发布<br />信息</div>
        <!-- 发布icon 结束-->
      </scroll>
  </div>
</template>

<script>
import router from "vue-router";
import contentItem from "./components/content.vue";
import expireTip from "./components/expireTip.vue";
import { mapActions, mapGetters } from "Vuex";
import { getallsupplydemandcategory, getBannerList } from "@/api/home";
import minix from "@/mixins/mixin";
import { findIndex } from "lodash";
import { setInterval, setTimeout } from 'timers';
export default {
  mixins: [minix],
  props: {
    isIntermediary: {
      type: Boolean,
      default: false
    },
    showTipLabel: {
      type: Boolean
    },
    showTipDot: {
      type: Boolean
    }
  },
  data() {
    return {
      supplyList: [],
      bannerList: [],
      firstInHomeFlag: false
    };
  },
  computed: {
    ...mapGetters("common", ["userInfo"]),
    ...mapGetters("home", ["homeTypeTab"]),
    ...mapGetters('socket', ['haveUnRead', 'haveStystemUnRead'])
  },
  methods: {
    ...mapActions("home", ["changeTypeTab"]),
    ...mapActions("release", ["setFrom"]),
    findIndex,
    routerToSearch() {
      let searchIndex;
      if(findIndex(this.homeTypeTab, { active: true }) == 0) {
        searchIndex = 1;
      }else {
        searchIndex = 0;
      }
      this.$router.push({
        path: "/unionSearch",
        query: {
          searchIndex: searchIndex
        }
      });
    },
    goRelease() {
      this.setFrom('home')
      this.$router.push('/chooseRelease');
    },
    selTab(index) {
      this.changeTypeTab(index);
      this.supplyList = [];
      this.dataReturn(index);
    },
    dataReturn(index) {
      // 同城为2，供求为1；同城indx 0 ,供求index 1
      let type, positionCode ;
      if(index == 0) {
        type = 2;
        positionCode ="union:service:index:top";
      } else {
        type = 1;
        positionCode ="union:service:supply:top";
      }
      getallsupplydemandcategory({ type: type}).then(res => {
        res.obj.map(item => {
          this.supplyList = item.supplyDemandCategoryVos;
          this.$nextTick(() => {
           this.$refs.scroll.refresh();
          });
        });
      });

      getBannerList({
        positionCode:positionCode
      }).then(res => {
        this.bannerList = res.datalist;
        this.$nextTick(() => {
         this.$refs.scroll.refresh();
        });
      });
    },
    toMsgList() {
      let expireTipInfo = localStorage.getItem('expireTipInfo');
      expireTipInfo && localStorage.setItem('expireTipInfo', JSON.stringify(Object.assign(JSON.parse(expireTipInfo), {showTipDot: false})));
      this.$router.push('/user/message');
    }
  },
  components: {
    contentItem,
    expireTip
  },
  created() {
    this.dataReturn(findIndex(this.homeTypeTab, { active: true }));
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 1000);
    })
  }
};
</script>

<style lang="scss" scoped>
@import "~views/Home/styles/index.scss";
</style>

