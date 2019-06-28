<template>
  <div class="invitation">
    <div class="invitation__header">
      <i class="invitation__header--back" @click="$router.back()"></i>
      <span class="invitation__header--title">我的邀请</span>
    </div>
    <div class="invitation__body">
      <div class="invitation__nav">
        <span class="invitation__nav--item" :class="{active: item.active}" v-for="(item, index) in inviteNav" v-text="item.name" :key="index" @click="changeTab(index)"></span>
      </div>
      <div class="invitation__list">
        <swiper class="invitation__content" :options="listOption" ref="invitationList">
          <swiper-slide class="invitation__content-item" v-for="(item, index) in inviteNav" :key="index">
            <scroll beforeScroll pullup :data="inviteList" v-if="inviteList.length && findIndex(inviteNav, {active: true}) === index" @scrollToEnd="loadMore">
              <div v-load-more="!isAllData" v-all-loaded="isAllData" :aa="isAllData">
                <div class="invitation__userList">
                  <div class="invitation__user" v-for="(user, i) in inviteList" :key="i">
                    <div class="invitation__user--header">
                      <img class="invitation__user--img" :src="userInfo.resourcesUrl+user.userPicPath">
                    </div>
                    <div class="invitation__user--registerInfo">
                      <span class="invitation__user--name" v-text="user.userName"></span>
                      <span class="invitation__user--time" v-text="user.signTime+'注册'"></span>
                    </div>
                    <div class="invitation__user--status">
                      <span v-text="user.statusName"></span>
                    </div>
                  </div>
                </div>
              </div>
            </scroll>
            <div class="invitation__empty" v-else>
              <div class="invitation__empty--banner" v-if="showBanner">
                <p>
                  <span class="invitation__empty--strongTip">温馨提示</span>
                  推荐业主注册，三年内达成装修即返佣3%
                </p>
                <i class="invitation__empty--closeBanner" @click="showBanner = false"></i>
              </div>
              <div class="invitation__empty--tip">
                <img class="invitation__empty--img" src="../images/list_icon_empty.png">
                <span class="invitation__empty--text">您暂时还没有推荐业主成功注册！</span>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="invitation__footer" @click="toInvite">
      <span class="invitation__footer--action">立即邀请</span>
    </div>
    <shareComponent :shareShow.sync="shareShow"></shareComponent>
  </div>
</template>

<script>
import { get, find, findIndex } from 'lodash';
import { getInviteList } from 'api/user';
import { mapGetters } from 'Vuex';
import shareComponent from "@/components/shareComponent/index";
import { behaviorTotal } from 'api/home';
export default {
  name: 'invitation',
  data() {
    return {
      inviteNav: [
        {
          name: '全部',
          status: '',
          active: true
        },
        {
          name: '进行中',
          status: 0,
          active: false
        },
        {
          name: '已签约',
          status: 1,
          active: false
        },
        {
          name: '无意向',
          status: 2,
          active: false
        }
      ],
      listOption: {
        notNextTick: true,
        freeMode: false,
        preventLinksPropagation: false,
        on: {
          slideChangeTransitionStart: () => {
            let index = this.invitationListSwiper.activeIndex;
            this.inviteNav.forEach((item, i) => item.active = index === i);
            this.queryInviteList();
          }
        }
      },
      shareShow: false,
      showBanner: true,
      inviteList: [],
      inviteTotal: '',
      start: 1
    }
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    invitationListSwiper() {
      return this.$refs.invitationList.swiper;
    },
    isAllData() {
      return this.inviteTotal !== '' && this.inviteList.length == this.inviteTotal;
    }
  },
  methods: {
    findIndex,
    changeTab(index) {
      this.inviteNav.forEach((item, i) => item.active = index === i);
      this.invitationListSwiper.slideTo(index, 100, false);
      this.queryInviteList();
    },
    async queryInviteList() {
      let { status, obj, totalCount } = await getInviteList({
        status: get(find(this.inviteNav, {active: true}), 'status'),
        curPage: this.start,
        pageSize: 10
      });
      this.inviteList = this.start === 1 ? obj || [] : [...this.inviteList, ...obj];
      this.inviteTotal = totalCount;
    },
    loadMore() {
      if (this.isAllData) return;
      this.start++;
      this.queryInviteList();
    },
    toInvite(){
      this.shareShow = true;
      //console.log(JSON.parse(localStorage.getItem('userInfo')).userType);
      try {
        if(JSON.parse(localStorage.getItem('userInfo')).userType==11){
          sessionStorage.setItem('shareType','index_mine_invite');
          behaviorTotal({type:'index_mine_invite',wx:false,pyq:false}).then(res=>{});
        }
      } catch (e) {

      }
    }
  },
  components: {
    shareComponent
  },
  created() {
    this.queryInviteList();
  }
}
</script>

<style lang="scss">
.invitation {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  @at-root #{&}__header {
    flex-shrink: 0;
    position: relative;
    height: 88px;
    line-height: 88px;
    font-size: 34px;
    text-align: center;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px; /*no*/
      background-color: #ddd;
      transform: scaleY(0.5);
    }

    @at-root #{&}--back {
      position: absolute;
      top: 0;
      left: 0;
      width: 88px;
      height: 88px;
      background-image: url("../images/nav_icon_back_black.png");
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 50%;
    }
  }

  @at-root #{&}__body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: #f5f5f5;
  }

  @at-root #{&}__nav {
    display: flex;
    flex-shrink: 0;
    height: 88px;
    line-height: 88px;
    font-size: 32px;
    background-color: #fff;

    @at-root #{&}--item {
      flex-basis: 25%;
      text-align: center;

      &.active {
        position: relative;

        &:after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 15px;
          width: 25px;
          height: 6px;
          transform: translateX(-50%);
          background-color: #ff6419;
          border-radius: 3px;
        }
      }
    }
  }

  @at-root #{&}__list {
    display: flex;
    flex-grow: 1;
  }

  @at-root #{&}__content {
    flex-grow: 1;
    padding-top: 20px;
  }

  @at-root #{&}__userList {
    padding: 0 30px;
    background-color: #fff;
  }

  @at-root #{&}__user {
    display: flex;
    align-items: center;
    position: relative;
    padding: 30px 0;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px; /*no*/
      transform: scaleY(0.5);
      background-color: #e8e8e8;
    }

    @at-root #{&}--header {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      margin-right: 30px;
      border-radius: 50%;
      overflow: hidden;
    }

    @at-root #{&}--img {
      height: 100%;
    }

    @at-root #{&}--registerInfo {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    @at-root #{&}--name {
      font-size: 30px;
      color: #333;
      margin-bottom: 15px;
    }

    @at-root #{&}--time {
      font-size: 24px;
      color: #999;
    }

    @at-root #{&}--status {
      flex-shrink: 0;
      font-size: 30px;
      color: #ff6419;
    }
  }

  @at-root #{&}__footer {
    flex-shrink: 0;
    height: 88px;
    line-height: 88px;
    font-size: 34px;
    text-align: center;
    color: #fff;
    background-image: linear-gradient(-90deg, #ff6419 0%, #ffa072 100%), linear-gradient(#ffffff, #ffffff);
	  background-blend-mode: normal, normal;
  }

  @at-root #{&}__empty {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    @at-root #{&}--banner {
      flex-shrink: 0;
      position: relative;
      height: 96px;
      line-height: 96px;
      padding-left: 30px;
      font-size: 28px;
      color: #fff;
      background-image: url("../images/invite_bg_tips.png");
      background-size: cover;
    }

    @at-root #{&}--strongTip {
      font-size: 30px;
      font-weight: bold;
    }

    @at-root #{&}--closeBanner {
      position: absolute;
      top: 50%;
      right: 20px;
      width: 30px;
      height: 30px;
      background-image: url("../images/invite_icon_delete.png");
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: cover;
      transform: translateY(-50%);
    }

    @at-root #{&}--tip {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
    }

    @at-root #{&}--img {
      width: 200px;
      height: 160px;
      margin-bottom: 60px;
    }

    @at-root #{&}--text {
      font-size: 28px;
      color: #999;
    }
  }
}
</style>
