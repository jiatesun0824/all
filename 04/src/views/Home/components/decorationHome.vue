
<template>
  <div class="homePage" v-if="!isIntermediary" style="overflow: scroll;">
    <div class="tab relative" ref="tabContent">
          <div class="homeContent">首页</div>
          <div class="msg-box" :class="{isTip: showTipDot}" @click="toMsgList">
            <img src="../images/home_icon_message.png"/>
            <expire-tip v-if="showTipLabel"></expire-tip>
            <span class="redDot" v-if="haveUnRead"></span>
            <span class="redDot" v-if="haveStystemUnRead"></span>
          </div>
        </div>
    <scroll :probeType="probeType"
            :listenScroll="listenScroll"
            :data="supplyList"
            pulldown
            @pulldown="userInfo.userType === 11 && pulldown()"
            ref="scroll">
      <div class="city">
        <!-- tab 结束 -->
        <decoration-item @refreshScroll="refreshScroll" :supplyList="supplyList" :tabIndex="findIndex(homeTypeTab, {active: true})" :bannerList="bannerList" @tabChange="selTab"></decoration-item>
        <!--<content-item :supplyList="supplyList" :tabIndex="findIndex(homeTypeTab, {active: true})" :bannerList="bannerList" @tabChange="selTab"></content-item>-->
      </div>
    </scroll>
    <!--公共的蒙层-->
    <div class="mask" v-show="mask"></div>
    <!--抢单机会弹窗-->
    <robNum></robNum>
    <!--抢单机会弹窗-->
    <robSuccess @closePay="closePay"></robSuccess>
  </div>
</template>

<script>
  import decorationItem from "../components/decorationItem.vue";
  import expireTip from "../components/expireTip.vue";
  import { mapActions, mapGetters } from "Vuex";
  import { getallsupplydemandcategory, getBannerList } from "@/api/home";
  import minix from "@/mixins/mixin";
  import { findIndex } from "lodash";
  import { setInterval, setTimeout } from 'timers';
  import robNum from '../components/robNum'
  import robSuccess from '../components/robSuccess'
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
      ...mapGetters("home", ["homeTypeTab","mask"]),
      ...mapGetters('socket', ['haveUnRead', 'haveStystemUnRead']),
    },
    methods: {
      ...mapActions("home", ["changeTypeTab"]),
      ...mapActions("release", ["setFrom"]),
       ...mapActions("home", ["diolog"]),
      findIndex,
      closePay() {
        this.diolog({
                  robSuccess: false,
                  mask: false
                });
      },
      refreshScroll(){
        setTimeout(()=>{
          this.$refs.scroll.refresh()
        },200)
      },
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
      decorationItem,
      expireTip,
      robNum,
      robSuccess
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
  @import "~views/Home/styles/decorationHome.scss";
</style>

