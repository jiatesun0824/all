<template>
  <div>
    <scroll :pullup="pullup" :beforeScroll="beforeScroll" :scrollX="true" :listenScroll="listenScroll" :probeType="probeType">
      <div class="detail">
        <div class="tab text-center">
          <span>详情</span>
          <div class="icon-back" @click="toBack"></div>
        </div>
        <div class="banner relative">
          <swiper class="swiper-wrapper" :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide class="swiper-box" v-for="(item, index) in detailData.supplyDemandPicList" :key="index">
              <div class="banner-box">
                <img :src="filterImg(item.picPath)">
              </div>
            </swiper-slide>
          </swiper>
          <div class="nav swiper-pagination"></div>
        </div>
        <div class="content">
          <div class="title">
            {{detailData.title}}
          </div>
          <div class="tips relative borderBottom">
            <span><i class="icon icon-time"></i>{{ detailData.gmtModified && detailData.gmtModified.split(' ')[0] }}</span>
            <span><i class="icon icon-see"></i>{{detailData.viewNum}}</span>
            <div class="tag">
              <!-- <span>会员3年</span> -->
              <span>已认证</span>
            </div>
          </div>
          <div class="company">
            <img :src="detailData.userPicPath | logoFilter">
            <div class="name">
              {{detailData.contact}}
            </div>
          </div>
          <div class="classify relative">
            <div class="type">
              <p>服务类型</p>
              <p>{{detailData.supplyDemandSmallCategoryName}}</p>

            </div>
            <div class="sub">
              <p>商家地址</p>
              <p v-text="[detailData.cityAddress, detailData.districtAddress, detailData.streetAddress, detailData.address].join('')"></p>
            </div>
            <div class="addr-icon">
              <img src="./images/detail_icon_map.png" alt="">
            </div>
          </div>
        </div>
        <div class="content-tab borderBottom">

          <span :class="{'active': tabIndex == index}" v-for="(item, index) in ['服务详情']" :key="index" @click="switchTab(index)">{{item}}</span>
        </div>
        <div class="service-detail" v-show="tabIndex == 0 ">
          <p>{{detailData.description}}</p>
        </div>
        <!-- <div class="user-evaluate" v-show="tabIndex == 1">
                    <div class="evaluate-item relative borderBottom" v-for="(item, index) in evaluateListData" :key="index">
                        <div class="avater">
                            <img src=""  v-lazy="item.avatar" alt="">
                        </div>
                        <div class="box">
                            <div class="title">
                                {{item.title}}
                            </div>
                            <div class="label">
                                <span v-for="(litem, lindex) in item.label" :key="lindex">{{litem}}</span>
                            </div>
                            <div class="appraise">
                                {{item.appraise}}
                            </div>
                        </div>
                        <div class="time">
                            {{item.time}}
                        </div>
                    </div>
                </div> -->
      </div>
    </scroll>
    <div class="info-btn" @click="connect">立即沟通</div>
  </div>
</template>

<script>
  import "./styles/swiper.scss";
  import mixins from "@/mixins/mixin";
  import {
    getAllSupplyDemandInfo,
    addsupplydemandviewnum
  } from "@/api/home";
  import {
    mapActions,
    mapGetters
  } from "Vuex";
  import {
    debounce
  } from 'lodash';

  export default {
    mixins: [mixins],
    data() {
      return {
        detailData: "",
        supplyDemandId: this.$route.params.id,
        // bannerImageData: new Array(6),
        pullup: true,
        beforeScroll: true,
        evaluateListData: [],
        tabIndex: 0,
        swiperOption: {
          autoplay: false,
          centeredSlides: true,
          slidesPerView: "auto",
          pagination: {
            el: ".swiper-pagination"
          }
        }
      };
    },
    computed: {
      ...mapGetters("user", {
        MessageList: "MessageList",
        friendId: "friendId"
      }),
      ...mapGetters("common", ["userInfo"])
    },
    filters: {
      filter(value) {
        return this.userInfo.resourcesUrl + value;
      }
    },
    created() {
      getAllSupplyDemandInfo({
        supplyDemandId: this.supplyDemandId
      }).then(
        res => {
          if (res.status) {
            res.obj.map(item => {
              this.detailData = item;
            });
          }
        }
      );
      addsupplydemandviewnum({
        id: this.supplyDemandId
      })
    },
    methods: {
      ...mapActions("user", ["setFriendId"]),
      ...mapActions('socket', ['setFromWhere', 'setRelateObj']),
      toBack: debounce(function () {
        this.$router.back();
      }, 20),
      switchTab(index) {
        this.tabIndex = index;
      },
      connect() {
        const friendId = {
          friendId: this.detailData.userId,
          friendName: this.detailData.userName,
          type: 1
        };
        this.setFriendId(friendId);

        this.setFromWhere(2); // 设定此条消息是店铺1还是供求2
        let relatedObj = { // 创建会话上传位置信息
          relatedObjId: this.detailData.supplyDemandId, // 供求或店铺ID
          contactSessionId: this.detailData.sessionId // 会话对方的id
        }
        this.setRelateObj(relatedObj);
        this.$router.push("/user/chat");
      },
      filterImg(img) {
        return this.userInfo.resourcesUrl + img;
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import "./styles/index.scss";

</style>
