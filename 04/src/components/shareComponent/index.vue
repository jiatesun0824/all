<template>
  <transition name="dropup">
    <div class="shareComponent" v-if="shareShow">
      <div class="share-content">
        <div class="title">分享</div>
        <ul>
          <li @click="session && share(2)">
            <img src="./images/recommend_icon_wechat.png">
            <div class="text">微信好友</div>
          </li>
          <li @click="timeline && share(1)">
            <img src="./images/recommend_icon_wechat_circle.png">
            <div class="text">微信朋友圈</div>
          </li>
        </ul>
        <div class="close-box" @click="$emit('update:shareShow', false)"> <i class="ic-close"></i></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { sharexzchat } from '@/api/common';
import { mapGetters } from 'Vuex';
import baseAPI from 'api/baseAPI';
import { behaviorTotal} from 'api/home';
export default {
  name: 'shareComponent',
  props: ['shareShow', 'isPlan', 'planInfo', 'isCard', 'shareWay', 'isQr', 'is720'],
  computed: mapGetters('common', ['userInfo']),
  data() {
    return {
      session: true,
      timeline: true
    };
  },
  methods: {
    checkWechat() {
      try {
        Wechat
        return Promise.resolve(true);
      }
      catch(e) {
        return Promise.reject(e);
      }
    },
    checkStoragePermission() {
      return new Promise((resolve, reject) => {
        let permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, status => {
          if(status.hasPermission) {
            resolve(true);
          } else{
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, () => resolve(true), e => reject(e))
          }
        }, null);
      });
    },
    async share(type) {
      sessionStorage.setItem('shareType',type);
      if (type === 1) {
        this.timeline = false;
      }
      else {
        this.session = false;
      }
      try {
        await this.checkWechat();
        await this.checkStoragePermission();
        let shareData = await sharexzchat({ shareType: type }); // type: 1.朋友圈，2.微友
        if (this.isPlan) {
          this.wechatShare(type, this.userInfo.resourcesUrl +(type==1?shareData.obj:this.planInfo.planCoverPath));
        } else if(this.isCard){
           this.wechatShare(type, JSON.parse(sessionStorage.getItem('posterImageUrl')));
        } else if(this.is720){
           this.wechatShare(type, JSON.parse(sessionStorage.getItem('720ImageUrl')));
        } else if(this.isQr){
          this.wechatShare(type, JSON.parse(sessionStorage.getItem('qrImgUrl')));
        }else {
          this.wechatShare(type, this.userInfo.resourcesUrl + shareData.obj);
        }
        setTimeout(() => {
          if (type === 1) {
            this.timeline = true;
          }
          else {
            this.session = true;
          }
        }, 1000);
      }
      catch(e) {
        console.error(e)
        this.$toast('分享失败！');
      }
    // 分享数据埋点统计
     try {
       behaviorTotal({type:sessionStorage.getItem('shareType'),wx:type == 2 ? true : false,pyq:type == 1 ? true : false}).then(res=>{});
     } catch (e) {

     }

    },
    wechatShare(type, qrcode) {
      let scene = type === 1 ? Wechat.Scene.TIMELINE : Wechat.Scene.SESSION;
      let planInfo;
      let shareDesc = '方案在手，装修不愁，立刻3秒换装！';
      if (this.isPlan) {
        planInfo = `/pages/home/home?userId=${this.userInfo.id}&time=${(new Date().getTime())}&platformCode=brand2c&operationSource=1&planId=${this.planInfo.planRecommendedId}&routerQueryType=seven&customReferer=https://servicewechat.com/wx0d37f598e1028825/devtools/page-frame.html&platformNewCode=miniProgram&type=720&shareType=${type}`;
        shareDesc = '我刚刚用随选网免费装修了一套房子，快来看看吧！'
      } else {
        planInfo = `/pages/home/home?userId=${this.userInfo.id}&time=${(new Date().getTime())}&shareType=${type}`;
         shareDesc = '方案在手，装修不愁，立刻3秒换装！'
      }
      Wechat.share(
        {
          message: {
            title: shareDesc,// "随选网",
            description: shareDesc,
            thumb: qrcode,
            media: this.shareWay === 'image' ? { type : 4, image: qrcode} : Object.assign({
              webpageUrl: baseAPI.domainURL + '/share?qrcode=' + qrcode,
              userName: 'gh_5815820699d4',
            }, type === 1 ? {type: Wechat.Type.WEBPAGE} : {
              type: Wechat.Type.MINIPROGRAM,
              path: planInfo
            })
          },
          scene: scene // share to SESSION  SESSION:  0, // 聊天界面 TIMELINE: 1, // 朋友圈
        },
        () => {
          this.$toast('分享成功！');
          this.$emit('update:shareShow', false);
        },
        e => {
          console.log('Failed: ' + e);
          this.$toast('分享失败！');
          this.$emit('update:shareShow', false);
        }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.shareComponent {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px 0 60px;
  background-color: #fff;
  z-index: 1000222;
  &.dropup-enter-active,
  &.dropup-leave-active {
    transition: all 200ms ease;
  }
  &.dropup-enter,
  &.dropup-leave-active {
    transform: translate3d(0, 100%, 0);
  }
  .share-content {
    .title {
      font-size: 34px;
      letter-spacing: 3px;
      color: #333333;
      text-align: center;
    }
    .close-box {
      position: absolute;
      width: 60px;
      height: 60px;
      right: 0;
      top: 0;
      .ic-close {
        position: absolute;
        display: inline-block;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        background: no-repeat center
          url("./images/recommend_icon_close.png");
        background-size: 100%;
        margin-left: -15px;
        margin-top: -15px;
      }
    }
    ul {
      display: flex;
      justify-content: space-around;
      padding: 40px 40px 0;
      li {
        img {
          display: block;
          width: 98px;
          margin: 0 auto;
        }
        .text {
          font-size: 24px;
          letter-spacing: 2px;
          color: #999999;
          text-align: center;
          line-height: 24px;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
