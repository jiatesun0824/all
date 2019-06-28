<template>
  <div style="height: 100%">
    <intermediary-home :showTipLabel="showTipLabel" :showTipDot="showTipDot" v-if="isIntermediary == 11"></intermediary-home>
    <decorationHome :showTipLabel="showTipLabel" :showTipDot="showTipDot" v-else-if="isIntermediary==5"></decorationHome>
    <home :showTipLabel="showTipLabel" :showTipDot="showTipDot" v-else></home>
    <div class="updatePwd" v-if="showUpPwd">
      <div class="box">
        <div class="title">提示</div>
        <div class="tit">为了您的账户安全,</div>
        <div class="tit">请立即修改登录密码 </div>
        <div class="butbox">
          <div @click="closeUpdatePwd">取消</div>
          <div @click="goPwd()">去修改</div>
        </div>
      </div>
    </div>
  </div>
  <!--</swiper>-->
</template>

<script>
  import home from './home.vue';
  import intermediaryHome from './components/intermediaryHome';
  import decorationHome from './components/decorationHome';
  import minix from "@/mixins/mixin";

  import {
    mapGetters,
    mapActions
  } from 'Vuex';
  import store from 'store';
  import {
    setTimeout
  } from 'timers';

  export default {
    mixins: [minix],
    components: {
      home,
      intermediaryHome,
      decorationHome
    },
    props: ['isShowBottomMenu'],
    data() {
      return {
        isIntermediary: JSON.parse(localStorage.getItem('userInfo')).companyType,
        showTipLabel: false,
        showTipDot: false,
        showUpPwd: false,

        socketBool: false
      };
    },
    computed: {
      ...mapGetters('common', ['userInfo', 'token']),
      mySwiper() {
        return this.$refs.swiperContainer.swiper
      }
    },
    // sockets: {
    //   connect() {
    //     console.log('socket connected')
    //   },
    //   error(e) {
    //     console.log(e);
    //   },
    //   im_push_msg_event(value) { // 未读系统消息
    //     console.log(value);
    //     switch (value.msgCode) {
    //       case "PUSH_CARD_ACCESS_OPERATION_LOG_MSG":
    //         this.setCardOptNum(JSON.parse(value.msgContent).unReadMsgCount);
    //         break;
    //       case "PUSH_CARD_ACCESS_MSG":
    //         this.setCardComeNUm(JSON.parse(value.msgContent).unReadMsgCount);
    //         console.log('swq');
    //         break;
    //       default:
    //         this.sethaveStystemUnRead(true);
    //         break;
    //     }
    //   },
    //   // 未读消息
    //   im_unread_msg_event(value) {
    //     console.log(value);
    //     if (value == `{'hasUnreadMsg':1}`) {
    //       this.setUnRead(true);
    //     } else {
    //       this.setUnRead(false);
    //     }
    //   },
    //   //  实时接收消息
    //   im_chat_msg_event(value) {
    //     console.log(value, 'swq');
    //     // let data = {
    //     //   item: value,
    //     //   isPullup: false
    //     // };
    //     // data.item.showTime = false;
    //     // this.setChatMessage(data);
    //   }
    // },
    // mounted() {
    //   if (this.token) {
    //     let _this = this;
    //     let imFun = function () {
    //       _this.imWebSocket().then(() => {
    //         console.log('进入触发1')
    //         _this.conectFun().then(() => {
    //           var locMessage = {
    //             appId: 1,
    //             userSessionId: JSON.parse(localStorage.getItem('userInfo')).sessionId,
    //             loc: 3
    //           }
    //           _this.$socket.emit('im_loc_msg_event', locMessage); // 上报位置事件
    //         })
    //       })
    //     }
    //     imFun();
    //   } else {
    //     console.log('-------------没有触发1---------------');
    //   }

    // },
    methods: {
      ...mapActions('socket', ['setUnRead', 'setChatMessage', 'sethaveStystemUnRead', 'setCardComeNUm', 'setCardOptNum']),
      async conectFun() {
        await this.$socket.emit('connect', function() {
          console.log('链接成功')
        }); //触发connect事件
      },
      async imWebSocket() {
        // await Vue.use(VueSocketio, socketio(
        //   `${process.env.BUILD_SOCKET}?userSessionId=${(JSON.parse(localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).sessionId : '')}&appId=1`
        // ));
        await console.log('开始监听');
      },
      back() {
        this.mySwiper.slideTo(1, 800, false);
        this.$router.push('/');
      },
      closeUpdatePwd() {
        this.showUpPwd = false;
      },
      goPwd() {
        this.$router.push({
          path: '/changepwd',
          query: {
            phone: JSON.parse(localStorage.getItem('userInfo')).loginPhone
          }
        });
        this.closeUpdatePwd();
      },
      updateNewMsg() {
        // 更新我的消息状态 （是否有新消息）
        this.API.personalNewsIsRead({
          userId: JSON.parse(localStorage.getItem('userInfo')).id
        }).then(res => {
          if (res) {
            if (res.obj != 0) {
              this.sethaveStystemUnRead(true)
            } else {
              this.sethaveStystemUnRead(false)
            }
          }
        });
      },
    },
    created() {
      // 页面首次打开刷新一下，去除每次返回进入登录页面的BUG开始 , 界面所有$router.go(-1)均返回首页
      if (localStorage.getItem('hehe') / 1 == 1) {
        localStorage.setItem('hehe', 0);
        // setTimeout(()=>{
        //   location.reload();
        // },1000);
      }
      // 页面首次打开刷新一下，去除每次返回进入登录页面的BUG结束
      // 获取存储权限，用于微信分享
      this.checkStoragePermission();
      // 查询渲染消息
      if (localStorage.getItem('token') && localStorage.getItem('token') != '') {
        this.updateNewMsg();
      }
      // 上报socket位置
      // var locMessage = {
      //   appId: 1,
      //   userSessionId: JSON.parse(localStorage.getItem('userInfo')).sessionId,
      //   loc: 3
      // }
      // this.$socket.emit('im_loc_msg_event', locMessage); // 上报位置事件


      // 赠送提示
      if (localStorage.getItem('firstLogin') / 1 == 1) {
        // 登录流程优化
        if (JSON.parse(localStorage.getItem('userInfo')).promptUpdatePassword == 1 || this.$route.query.ShowUpPwd / 1 ==
          1) {
          console.log('show' + 'rzd-----------------')
          this.showUpPwd = true;
          let userInfo = JSON.parse(localStorage.getItem('userInfo'));
          userInfo.promptUpdatePassword = 0;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }


        let from = new FormData();
        from.append('userId', JSON.parse(localStorage.getItem('userInfo')).id)
        this.API.getMarkedMessage(from).then(res => {
          localStorage.setItem('MarkedMessage', res.message)

          setTimeout(() => {
            this.showTipLabel = true;
            this.showTipDot = true;
          }, 1000);
          setTimeout(() => {
            this.showTipLabel = false;
            this.showTipDot = false;
            localStorage.setItem('firstLogin', 0)
          }, 2000);
        })
      }
      // 用户账号到期提醒和套餐到期提醒
      if (!JSON.parse(localStorage.getItem('hehe'))) {
        let expireTipInfo = localStorage.getItem('expireTipInfo');
        if (this.userInfo.oldServiceFlag) {
          if (this.userInfo.leftTime && this.userInfo.leftTime <= 5) {
            showExpireTip.call(this);
          }
        } else {
          if (this.userInfo.tipsFlag) {
            showExpireTip.call(this);
          }
        }

        function showExpireTip() {
          if (!expireTipInfo) {
            this.showTipLabel = true;
            setTimeout(() => {
              this.showTipLabel = false;
              this.showTipDot = true;
            }, 3000);
            localStorage.setItem('expireTipInfo', JSON.stringify({
              account: this.userInfo.loginPhone,
              showTipDot: true
            }))
          } else {
            expireTipInfo = JSON.parse(expireTipInfo);
            if (this.userInfo.loginPhone === expireTipInfo.account) {
              if (new Date().toLocaleDateString() !== this.userInfo.loginDay) {
                if (new Date(new Date(new Date().toLocaleDateString()) - new Date(this.userInfo.loginDay)).getDate() -
                  (this.userInfo.remainingDays + 1) < 0) {
                  this.showTipLabel = true;
                  setTimeout(() => {
                    this.showTipLabel = false;
                    this.showTipDot = true;
                  }, 3000);
                  localStorage.setItem('expireTipInfo', JSON.stringify({
                    showTipDot: true
                  }));
                }
              } else {
                this.showTipDot = expireTipInfo.showTipDot;
              }
            } else {
              this.showTipLabel = true;
              setTimeout(() => {
                this.showTipLabel = false;
                this.showTipDot = true;
              }, 3000);
              localStorage.setItem('expireTipInfo', JSON.stringify({
                account: this.userInfo.loginPhone,
                showTipDot: true
              }))
            }
          }
        }
      }

    },
    beforeRouteEnter(to, from, next) {
      to.meta.keepNotAlive = store.state.common.userInfo.userType !== 11;
      next();
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepNotAlive = to.name !== 'view720';
      let keepAliveComponent = this.$parent.$vnode.parent;
      if (keepAliveComponent && to.name !== 'view720') {
        delete keepAliveComponent.componentInstance.cache[keepAliveComponent.componentInstance.keys[0]];
        keepAliveComponent.componentInstance.keys = [];
      }
      next();
    }
  };

</script>

<style lang="scss" scoped>
  .swiper-type {
    height: 100%;
  }

  .updatePwd {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 9999;

    .box {
      width: 540px;
      height: 321px;
      background-image: linear-gradient(#ffffff,
        #ffffff),
        linear-gradient(#e6e6e6,
        #e6e6e6);
      background-blend-mode: normal,
        normal;
      border-radius: 26px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -160px;
      margin-left: -270px;
      padding-top: 43px;
      box-sizing: border-box;

      .title {
        text-align: center;
        font-size: 34px;
        color: #333;
        margin-bottom: 34px;
      }

      .tit {
        font-size: 28px;
        color: #333;
        text-align: center;
        line-height: 46px;
      }

      .butbox {
        width: 100%;
        height: 88px;
        display: flex;
        justify-content: space-around;
        margin-top: 40px;
        border-top: solid 1px #e8e8e8;

        div {
          width: 50%;
          text-align: center;
          height: 88px;
          line-height: 88px;
          font-size: 34px;
          color: #666;
        }

        div:last-of-type {
          color: #ff6419;
        }
      }
    }
  }

</style>
