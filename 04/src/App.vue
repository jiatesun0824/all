<template>
  <div id="app" @touchmove.prevent :style="$route.path=='/BuiAment' || $route.path=='/cumstomer' || $route.path=='/myModule'|| $route.path=='/user/wallet/inex' || $route.path == '/user/wallet/commission'">
    <!-- <div class="header-wrapper" v-show="comComponentsShow">
      <v-header></v-header>
    </div> -->
    <!-- <transition name="fade">
      <keep-alive>
        <router-view></router-view>
      </keep-alive> -->
    <keep-alive>
      <router-view v-if="!$route.meta.keepNotAlive&&isRefresh" class="child-view"></router-view>
    </keep-alive>
    <router-view v-if="$route.meta.keepNotAlive&&isRefresh"  class="child-view"></router-view>
    <!-- </transition> -->
    <!-- <div class="footer-wrapper" v-show="!is720">
      <v-footer></v-footer>
    </div> -->
    <!-- <toast v-if="toastShow"></toast>
    <popup v-if="popupShow"></popup>
    <div id="rotaTip" ref="rotaTip">
      <img class="roate-img" src="./tip.png">
    </div> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    mapState,
    mapActions,
    mapGetters
  } from "Vuex";
  import {
    setInterval,
    clearInterval,
setTimeout
  } from 'timers';
  import {
    usercommissioninfo
  } from 'api/home';
  export default {
    name: "app",
    // 刷新当前路由
    provide(){
      return {
          reFresh:this.reFreshCurpage
      }
    },
    data() {
      return {
        orientation: 0,
        isAudio: true,
        is720: true,
        newMsgTimer: 0,
        newMsgInterval: {},
        isRefresh: true
      };
    },
    computed:{ ...mapState({
      comComponentsShow: state => state.comComponentsShow,
      popupShow: state => state.popupShow,
      toastShow: state => state.toastShow,
      comeFromPlan: state => state.comeFromPlan,
      showDot: state => state.showDot
    }),
      ...mapGetters('common', ['userInfo', 'token']),
    },
    watch: {
      token(newVal) {
        if (newVal) {}
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      im_push_msg_event(val) { // 未读系统消息
        console.log(val)
        if (val) {
          this.sethaveStystemUnRead(true)
        } else {
          this.sethaveStystemUnRead(false)
      }
     }
    },
    methods: {
      ...mapActions('socket', ['setUnRead', 'setChatMessage', 'sethaveStystemUnRead', 'setCardComeNUm', 'setCardOptNum']),
      reFreshCurpage() {
        this.isRefresh  = false;
        setTimeout(()=>{
          this.isRefresh = true
        },200)
      },
      getPushMsgEvent(value) {
        switch(value.msgCode) {
          case "PUSH_CARD_ACCESS_OPERATION_LOG_MSG" : 
            this.setCardOptNum(JSON.parse(value.msgContent).unReadMsgCount);
          break;
          case "PUSH_CARD_ACCESS_MSG" : 
            this.setCardComeNUm(JSON.parse(value.msgContent).unReadMsgCount);console.log('swq');
          break;
          default: this.sethaveStystemUnRead(true);break;
        }
      },
      updateNewMsg() {
        // 更新我的消息状态 （是否有新消息）
        this.API.personalNewsIsRead({
          userId: localStorage.getItem("userId")
        }).then(res => {
          console.log(res)
          if (res) {
            if (res.obj != 0) {
              this.$store.state.showDot = true;
            } else {
              this.$store.state.showDot = false;
            }
          }
        });
      },
      orientationchange() {
        let that = this,
          resizeEvt =
          "orientationchange" in window ? "orientationchange" : "resize",
          orientation = typeof window.orientation === "undefined" ? 0 : 1, // 判断浏览器是否支持orientation感应
          closeSwiper = function () {
            if (orientation === 0) {
              if (window.innerHeight < window.innerWidth) {
                let path = that.$route.path;
                if (
                  path === "/view720" ||
                  path === "/videoview" ||
                  path === "/photoview"
                ) {
                  return;
                }
                that.$refs.rotaTip.style.display = "block";
              } else {
                that.$refs.rotaTip.style.display = "none";
              }
            } else {
              setTimeout(() => {
                if (window.orientation == "-90" || window.orientation == "90") {
                  let path = that.$route.path;
                  if (
                    path === "/view720" ||
                    path === "/videoview" ||
                    path === "/photoview"
                  ) {
                    return;
                  }
                  that.$refs.rotaTip.style.display = "block";
                } else {
                  that.$refs.rotaTip.style.display = "none";
                }
              }, 20);
            }
          };
        window.addEventListener(resizeEvt, closeSwiper, false);
      },
      fixAudio() {
        if (this.isAudio) {
          this.isAudio = false;
          this.$store.state.audioObj.newaudio = new Audio();
          this.$store.state.audioObj.newaudio.src = require('../static/audio/backgroundMusic.mp3');
          this.$store.state.audioObj.newaudio.loop = "loop";
        }
      },
      getScreenType() {
        let size = window
          .getComputedStyle(document.body, ":after")
          .getPropertyValue("content");
        if (size.indexOf("smallscreen") != -1) {
          this.$store.state.isPad = true;
          this.$refs.rotaTip.style.display = "none";
        } else {
          this.$store.state.isPad = false;
        }
      },
      handleRouterPath() {
        let path = this.$route.path;
        if (
          path == "/personal" ||
          (path == "/search/area" && !this.comeFromPlan)
        ) {
          this.$store.commit("showComComponents", true);
        }
        if (path == "/") {
          this.$store.commit("showComComponents", false);
        }
      },
      monitorScreen() {
        let that = this;
        let resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
          toLandscape = function () {
            if (that.$route.path == "/fastDecorate") {
              if (typeof window.orientation !== "undefined") {
                if (window.orientation == "-90" || window.orientation == "90") {
                  that.$router.push("/landscape");
                }
              } else if (window.innerHeight < window.innerWidth) {
                that.$router.push("/landscape");
              }
            } else if (that.$route.path == "/landscape") {
              if (typeof window.orientation !== "undefined") {
                if (window.orientation == "0" || window.orientation == "180") {
                  that.$router.push("/fastDecorate");
                }
              } else if (window.innerHeight > window.innerWidth) {
                that.$router.push("/fastDecorate");
              }
            }
          };
        window.addEventListener(resizeEvt, toLandscape, false);
      }
    },
    created() {
      // this.API.platformFilter(); // 平台过滤
      this.fixAudio();
      this.orientationchange();
      // var checkToken=setInterval(()=> {
      //   usercommissioninfo().then((res)=> {
      //     if(!res.status){
      //       this.clearToken();
      //       this.$router.push('/login');
      //       this.$toast("当前账号在其他设备上登录，请重新登录！");
      //       clearInterval(checkToken);
      //       return;
      //     }
      //   })
      // }, 5000);
    },
    mounted() {
      this.handleRouterPath();
      if (this.$store.state.isPad) {
        this.monitorScreen();
      }
    },
    updated() {
      this.$store.state.presentPath = this.$route.path;
      this.handleRouterPath();
      if (this.$store.state.audioObj.newaudio) {
        if (this.$route.path != "/view720") {
          if (this.$store.state.audioObj.newaudio.paused) {
            setTimeout(
              function () {
                this.$store.state.audioObj.newaudio.pause();
              }.bind(this),
              2000
            );
          } else {
            this.$store.state.audioObj.newaudio.pause();
          }
        }
      }
      if (this.$route.path == "/design") {
        sessionStorage.setItem("replaceList", "");
        sessionStorage.setItem("addList", "");
      }
      if (
        this.$route.path == "/" ||
        this.$route.path == "/company" ||
        this.$route.path == "/paypage" ||
        this.$route.path == "/reset" ||
        this.$route.path == "/payopen" ||
        this.$route.path == "/view720" ||
        this.$route.path == "/photoview" ||
        this.$route.path == "/videoview" ||
        this.$route.path == "/fastDecorate"
      ) {
        this.is720 = true;
      } else {
        this.is720 = false;
      }
    }
  }}

</script>

<style lang="scss">
  @import 'normalize';
  @import 'styles/reset.css';
  @import 'styles/index.scss';

  #app {
    position: relative;
    height: 100%;
  }

  ::-webkit-scrollbar {
    width: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ddd;
  }

  #rotaTip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    display: none;
    z-index: 1000;
    text-align: center;
    /*@media all and (orientation: landscape)*/
    /*#rotaTip*/
    /*display: block*/
  }

  #rotaTip .roate-img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

</style>
