<template>
  <div class="videoview" :class="{'pad-top40': !isLandscape}">
    <div class="goback" @click="goback" v-show="!isLandscape"></div>
    <div class="video-wrapper" :class="{'pad-top30': !isLandscape}">
      <div class="playvideo">
        <div class="zy_media">
          <video @click.self="controlvideo" id="video" :src="contantUrl[0]" data-config="{pauseOtherPlayers: false}" :poster="resourcesUrl + preview">
            您的浏览器不支持HTML5视频
          </video>
        </div>
      </div>
      <img :src="resourcesUrl + preview" alt="" class="preview-image" v-show="controlSign" @click="cancelControl">
    </div>
    <!-- <video class="content" :poster="resourcesUrl + preview" @click.self="controlvideo" id="video" :src="contantUrl[0]" data-config="{pauseOtherPlayers: false}">
      您的浏览器不支持HTML5视频
    </video> -->
    <div id="code" class="share-QRcode" v-show="QRcodeFlag">
      <!-- <div class="QRcodeLogo-wrapper">
        <img class="QRcodeLogo" src="./logo@2x.png" alt="">
      </div> -->
    </div>
    <div class="pulldown-wrapper">
      <transition name="fade" v-if="showWhoFlag">
        <div class="sign-wrapper" v-if="!swiperFlag">
          <div class="room-sign" @click="swiperShow"></div>
          <div class="share-sign" @click="openQRcode" v-if="concealShare"></div>
        </div>
      </transition>
      <transition name="fade" v-else>
        <div class="sign-wrapper">
          <div class="room-sign" @click="swiperChange"></div>
          <div class="share-sign" @click="openQRcode"></div>
        </div>
      </transition>
    </div>
    <basetab @changecontent="changeContent" :smallcontent="smallContent" :parentName="name" v-if="showWhoFlag"></basetab>
    <crosswise @changecontent="changeContent" :smallcontent="smallContent" :parentName="name" v-else></crosswise>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState } from 'Vuex';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import 'assets/js/pako.min.js';
  import 'assets/js/jquery.min.js';
  import 'assets/js/jquery.qrcode.min.js';

  export default {
    data() {
      return {
        name: 'video',
        collectFlag: false, // ????Ƭ???̬
        contantUrl: [],
        showWhoFlag: true,
        smallContent: [], // ??ͼ?б?
        preview: '',
        controlSign: true,
        QRcodeFlag: false, // ??ά?????״̬
        codeWidth: 0,
        screenWidth: 0,
        concealShare: false,
        isLandscape: false // 是否是横向显示
      };
    },
//    watch: {
//      smallContent() {
//        this.preview = this.smallContent[0].picPath;
//        this.controlSign = true;
//        console.log(this.$store.state.resourcesUrl + this.preview);
//      }
//    },
    updated() { // 更新每次进入视频播放组件的预览图片
      if (this.preview !== localStorage.getItem('_videoPreviewImage_')) {
        this.preview = localStorage.getItem('_videoPreviewImage_');
        this.controlSign = true;
      }
    },
    activated() {
      this.dotShow();
      this.smallShowIndex = 0;
      this.$store.commit('showComComponents', false);
      this.smallContent = this.$store.state.videoView.videoViewSmall;
      this.preview = this.smallContent[0].picPath;
      if (this.$store.state.fasttype == 'oneKey') {
        this.$set(this.contantUrl, 0, sessionStorage.getItem('url'));
        this.$store.state.QRcodeText = sessionStorage.getItem('url');
      } else {
        this.API.fullView({
          thumbId: this.smallContent[0].id,
          token: localStorage.getItem('token')
        }).then((response) => {
          if (response) {
            this.$set(this.contantUrl, 0, response.obj.url);
            setTimeout(function() {
              zymedia('video');
              this.controlSign = true;
            }, 500);
            this.$store.state.QRcodeText = response.obj.url;
            if (!this.$store.state.loadingFlag) {
              this.dotShow();
            }
          }
        });
      }
    },
    created() {
      this.videoScreenOrientationListener();
    },
    methods: {
      controlvideo() {
        let oVideo = document.getElementById('video');
        if (oVideo.paused) {
          oVideo.play();
        } else {
          oVideo.pause();
        }
      },
      cancelControl() {
        this.controlSign = false;
        this.controlvideo();
      },
      qrcode() {
        if (screen.width > screen.height) {
          this.screenWidth = screen.height;
        } else {
          this.screenWidth = screen.width;
        }
        this.codeWidth = 3.3 * this.screenWidth / 7.5;
        $('#code').qrcode({
          render: 'canvas',
          text: this.$store.state.QRcodeText,
          width: this.codeWidth,
          height: this.codeWidth,
          correctLevel: 2
        });
      },
      openQRcode() {
        if ($('#code').html() == '') {
          this.qrcode();
        } else {
          $('#code').html('');
        }
        this.QRcodeFlag = !this.QRcodeFlag;
      },
      videoScreenOrientationListener() { // 根据设备横竖屏判断720底部swiper是显示在底部还是显示在右边
        let that = this;
        let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
          orientation = typeof (window.orientation) === 'undefined' ? 0 : 1,
          videoListener = function() {
            if (orientation === 0) {
              if (window.innerHeight < window.innerWidth) {
                that.showWhoFlag = false;
                that.gobackFlag = false;
                that.isLandscape = true; // 横向
              } else {
                that.showWhoFlag = true;
                that.isLandscape = false; // 竖向
              }
            } else {
              setTimeout(() => {
                if (window.orientation == '-90' || window.orientation == '90') {
                  that.showWhoFlag = false;
                  that.isLandscape = true; // 横向
                } else {
                  that.showWhoFlag = true;
                  that.isLandscape = false; // 竖向
                }
              }, 20);
            }
          };
        if (!document.addEventListener) return;
        window.addEventListener(resizeEvt, videoListener, false);
        document.addEventListener('DOMContentLoaded', videoListener, false);
      },
      changeContent(index) {
        this.preview = this.smallContent[index].picPath;
        localStorage.setItem('_videoPreviewImage_', this.preview); // 缓存视频预览图
        this.$set(this.contantUrl, 0, this.$store.state.videoView.videoContent[0]);
      },
      dotShow() {
        this.$store.state.dotFlag = true;
      },
      goback() {
        this.preview = '';
        this.$store.state.showVideo = false;
        this.$store.state.dotFlag = false;
        this.$router.push(this.$store.state.goBackPath);
        if (this.QRcodeFlag) {
          this.openQRcode();
        }
      },
      singleCollect() {
        this.API.singleCollect({
          userId: localStorage.getItem('userId'),
          designPlanId: this.$store.state.videoView.videoViewId
        }).then((response) => {
          if (response) {
            this.collectFlag = true;
          }
        });
      },
      swiperShow() {
        this.$store.state.swiperFlag = true;
      },
      swiperChange() {
        this.$store.state.swiperFlag = !this.$store.state.swiperFlag;
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    computed: mapState({
      resourcesUrl: state => state.resourcesUrl,
      videoViewTitle: state => state.videoView.videoViewTitle,
      videoViewSmall: state => state.videoView.videoViewSmall,
      swiperFlag: state => state.swiperFlag,
      loadingFlag: state => state.loadingFlag,
      showVideo: state => state.showVideo
    })
  };
</script>

<style lang="scss" scoped>
  @import "styles/mixin.scss";

#modelView {
  background-color: #DDDDDD;
  z-index: 0;
  opacity: 0.7;
  height: 100%;
  width: 100%;
  position: relative;
}

.playvideo {
  z-index: 9999;
  position: relative;
}

.zy_media {
  z-index: 999999999;
}

.video-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}

.video-wrapper.pad-top30 {
  top: 30%;
  height: 420px;
}

.video-wrapper .preview-image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 1000000000;
}

.content {
  width: 100%;
}

.videoview {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

.videoview.pad-top40 {
  padding-top: 40%;
}

.videoview .goback {
  width: 83px;
  height: 83px;
  background-size: 83px 83px;
  background-image: url("./images/back_nor.png");
  position: absolute;
  left: 30px;
  top: 30px;
  z-index: 3;
}

@media all and (orientation: landscape) {
  .videoview .share-QRcode {
    position: absolute;
    width: 330px;
    height: 330px;
    top: 0;
    right: 0;
    bottom: 130px;
    left: 0;
    margin: auto;
    z-index: 999;
  }
}

@media all and (orientation: portrait) {
  .videoview .share-QRcode {
    position: absolute;
    width: 330px;
    height: 330px;
    right: 0;
    bottom: 130px;
    left: 0;
    margin: auto;
    z-index: 999;
  }
}

.videoview .view-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  background: #000;
  /*@media all and (orientation : portrait)
        .video-wrapper
          width: 100%
          position: absolute
          top: 40%
          transform: translateY(-50%)
          z-index: 2
          .videoContent
            width: 100%
          .loadingScope
            position: absolute
            top: 0
            width: 100%
            bottom: 0*/
}

@media all and (orientation: landscape) {
  .videoview .view-wrapper .video-wrapper {
    width: 100%;
    height: 100%;
  }

  .videoview .view-wrapper .video-wrapper .videoContent {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
  }

  .videoview .view-wrapper .video-wrapper .loadingScope {
    position: absolute;
    top: 0;
    width: 100%;
    bottom: 0;
  }
}

.videoview .play-btn {
  width: 117px;
  height: 117px;
  background-size: 117px 117px;
  background-image: url("./images/play-video.png");
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 2;
}

.videoview .sign-wrapper {
  height: 82px;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.videoview .sign-wrapper .room-sign {
  float: left;
  width: 81px;
  height: 82px;
  background-size: 81px 82px;
  background-image: url("./images/room_nor.png");
}

.videoview .sign-wrapper .share-sign {
  float: left;
  width: 81px;
  height: 82px;
  background-size: 81px 82px;
  background-image: url("./images/share_nor.png");
  margin-left: 74px;
}
</style>
