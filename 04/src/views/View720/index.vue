<template>
  <div class="new-view720" id="new-view720">
    <div class="goback-box" @click="goBack">
      <div class="goback"></div>
    </div>
    <iframe class="view" ref="iframe" :src="view720Url" scrolling="no" frameborder="0" marginheight="0" marginwidth="0"
      allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" id="ifr"></iframe>
    <!--分享选择窗口开始-->
    <div class="share-type" v-show="shareModuleShow">
      <div class="colose_shareType" @click="shareModuleShow = false" v-if="!shareShow"></div>
      <div class="share_box">
        <div class="nav">
          <div class="nav-item" :class="item.active?'nav-item_active':''" v-for="(item, index) in shareType"
            :key="index" @click="selType(index)">
            {{item.name}}
            <span class="active_line" v-if="item.active"></span>
          </div>
        </div>
        <div class="nav-tit" v-for="(item, index) in shareType" :key="index" v-show="item.active">
          {{item.tit}}
        </div>
        <div class="share_main" ref="poster">
          <img class="plan_img" :src="$store.state.resourcesUrl+$store.state.view720.view720Small" alt="">
          <div class="title">
            <div class="title_Text" v-if="titleDisable">{{qrMark.shareTitle}}</div>
            <input class="title_Text" v-if="!titleDisable" v-focus="!titleDisable" name="" maxlength="15"
              v-model="qrMark.shareTitle" />
            <img v-if="titleDisable&&!iconShow" src="./images/720_share_edit.png"
              @click="titleDisable = false" alt="">
            <img v-if="!titleDisable&&!iconShow" src="./images/720_share_edit_over.png" @click="titleDisable = true"
              alt="">
          </div>
          <div class="qrcode_box">
            <div class="qr_tit">可以考虑这样装扮自己的家</div>
            <img :src="'data:image/png;base64,'+qrimg" alt="">
            <span class="qrcode_tit">长按识别二维码</span>
          </div>
        </div>
        <div class="share_but" @click="shareImg">确定分享</div>
      </div>
    </div>
    <!--分享选择窗口结束-->
    <!--分享窗口开始-->
    <div class="share-popup" v-show="shareShow">
      <div class="popup-text">分享到</div>
      <div class="share-wrapper clearfix">
        <div class="share-item fl" @click.stop="session && share('SESSION', 'img')">
          <div class="share-icon" :style="'backgroundImage: url(' + shareModule[0].icon + ')'"></div>
          <span class="share-text">{{shareModule[0].name}}</span>
        </div>
        <div class="share-item fl" @click.stop="timeline && share('TIMELINE', 'img')">
          <div class="share-icon" :style="'backgroundImage: url(' + shareModule[1].icon + ')'"></div>
          <span class="share-text">{{shareModule[1].name}}</span>
        </div>
      </div>
      <div class="cancel-btn" @click="shareShow = false;iconShow = false">取消</div>
    </div>
    <!--分享窗口结束-->
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'Vuex'
  import baseAPI from 'api/baseAPI';
  import store from 'store';
  import {
    behaviorTotal
  } from 'api/home';
  import html2canvas from 'html2canvas';
  export default {
    data() {
      return {
        view720Url: '', // iframe720地址
        shareModuleShow: false, // 分享弹框
        shareModule: [{ // 分享模块
          name: '微信好友',
          icon: require('./images/wechat.png')
        }, {
          name: '微信朋友圈',
          icon: require('./images/pyq.png')
        }],
        session: true,
        timeline: true,
        payPlan: '',
        payType: '',
        // 二维码应显示数量	
        qrCount: 2,
        qrMark: {
          shareDesc: '可以这样设计自己的房子',
          sceneType: sessionStorage.getItem('routerQueryType') == 'seven' ? 1 : 2,
          renderId: sessionStorage.getItem('view720Id'),
          planSourceType: 2,
          shareTitle: '我设计了一套漂亮的方案，分享给你~',
          qrCodeType: 1,
        },
        shareShow: false,
        iconShow: false,
        qrimg: "",
        shareQrImgUrl: '',
        titleDisable: true,
        shareType: [{
            name: '网页版',
            tit: '网页版：在浏览器中打开',
            active: true,
            qrCodeType: 1
          },
          {
            name: '小程序版',
            tit: '小程序版：在自己的小程序中打开',
            active: false,
            qrCodeType: 3
          },
          {
            name: '高级版',
            tit: '高级版：在随选网中打开',
            active: false,
            qrCodeType: 2
          }
        ],
      };
    },
    computed: mapGetters('common', ['userInfo']),
    created() {
      this.init()
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus()
        }
      }
    },
    methods: {
      shareImg() {
          this.titleDisable = true;
          this.iconShow = true;
          this.shareShow = true;
          this.$loading();
          this.$nextTick(() => {
            html2canvas(this.$refs.poster, {
              useCORS: true, //（图片跨域相关）
              allowTaint: false, //允许跨域（图片跨域相关）
              taintTest: true //是否在渲染前测试图片
            }).then(canvas => {
              this.shareQrImgUrl = canvas.toDataURL("image/jpeg");
              this.$loading.close();
            })
          })
      },
      // 获取分享的二维码
      getQRcode() {
        let data = {
          sceneType: sessionStorage.getItem('routerQueryType') == 'seven' ? 1 : 2,
          planSourceType: sessionStorage.getItem('operationSource') / 1 == 1 ? 3 : 2,
          planId: sessionStorage.getItem('view720Id')
        }
        this.API.getRenderId(data).then(res => {
          this.qrMark.renderId = res.obj;
          this.API.getWxacodeun(this.qrMark).then(res => {
            if (res.success) {
              this.qrimg = res.obj.imgBase64;
            }
          })
        })
      },
      selType(index) {
        this.shareType.map(item => {
          item.active = false
        });
        this.$set(this.shareType[index], 'active', true);
        this.qrMark.qrCodeType = this.shareType[index].qrCodeType;
        this.getQRcode();
        this.qrMark.shareTitle = '我设计了一套漂亮的方案，分享给你~';
        this.titleDisable = true;
        this.shareQrImgUrl = '';
      },
      init() {
        this.qrMark.planSourceType = sessionStorage.getItem('operationSource') / 1 == 1 ? 3 : 2;
        this.API.getQRCodeTypeCount().then(res => {
          this.qrCount = res.obj;
          if (this.qrCount == 2) {
            this.shareType.splice(1, 1);
          }
        })
        this.getQRcode();

        let $self = this;
        window.onmessage = (e) => { // iframe 跨域交互处理
          e = e || event;
          switch (true) {
            case $self.filterSwitchData('pay', e.data):
              $self.routerToView('pay');
              break;
            case $self.filterSwitchData('share', e.data):
              $self.openShareModule();
              break;
            case $self.filterSwitchData('tasks', e.data):
              $self.routerToView('tasks');
              break;
            case $self.filterSwitchData('shop', e.data):
              $self.routerToView('tcdetail');
              break;
            default:
              if (e.data.indexOf('plan') > -1) {
                [this.payPlan, this.payType] = e.data.match(/plan=(.+)&type=(.+)/).slice(1);
              }
              console.log(this.payPlan, this.payType);
              this.pay();
              // paySuccess, payFail  支付状态
              // e.source.postMessage('paySuccess', e.origin);
              // console.log(e.data);
          };
        };
        sessionStorage.setItem('APP', location.origin);
        this.getView720Url();
        this.shareModuleShow = false;
      },
      filterSwitchData(type, data) {
        if (data.slice(0, data.indexOf('/')) === 'shop') {
          return true
        } else {
          return type === data
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      getView720Url() {
        let isShowReplace = 1
        if (localStorage.getItem('userInfo')) {
          JSON.parse(localStorage.getItem('userInfo')).userType === 11 ? isShowReplace = 2 : isShowReplace = 1
        }
        let sevenObj = {
          token: JSON.parse(localStorage.getItem('token')),
          platformCode: 'mobile2b',
          operationSource: sessionStorage.getItem('operationSource'),
          planId: sessionStorage.getItem('view720Id'),
          routerQueryType: sessionStorage.getItem('routerQueryType'),
          customReferer: location.origin,
          platformNewCode: 'mobile2b',
          APP: sessionStorage.getItem('APP'),
          isShowReplace: isShowReplace, // 1标识显示产品替换0标识不显示
          shopId: sessionStorage.getItem('shopId') || '',
          isTask: sessionStorage.getItem('isTask') || 0
        };
        this.view720Url = this.getShareViewUrl(sevenObj);
      },
      routerToView(type) {
        switch (type) {
          case 'pay':
            sessionStorage.setItem('returnPayUrl', `/view720`);
            sessionStorage.setItem('paypageBack', `/account`);
            this.$router.push(`/paypage`);
            break;
          case 'share':
            this.$router.push(`/paypage`);
            break;
          case 'tasks':
            this.$router.push('/replace');
            break;
        };
      },
      openShareModule() { // app: 打开分享模块 web: 跳转分享链接
        this.shareModuleShow = true;
        this.iconShow = false;
        this.titleDisable = true;
        this.shareQrImgUrl = '';
        try {
          Wechat;
          console.log('app分享功能');
          this.shareModuleShow = true;
          this.iconShow = false;
          this.titleDisable = true;
          this.shareQrImgUrl = '';
        } catch (e) { // web端的分享功能
          console.log('web分享功能');
          let sevenObj = {
            token: JSON.parse(localStorage.getItem('token')),
            platformCode: 'mobile2b',
            operationSource: sessionStorage.getItem('operationSource'),
            planId: sessionStorage.getItem('view720Id'),
            routerQueryType: sessionStorage.getItem('routerQueryType'),
            customReferer: location.origin,
            platformNewCode: 'mobile2b',
            isShowReplace: 0, // 1标识显示产品替换0标识不显示
            shopId: sessionStorage.getItem('shopId') || '',
            isTask: sessionStorage.getItem('isTask') || 0
          };
          window.open(this.getShareViewUrl(sevenObj));
        }

        //统计分享
        try {
          behaviorTotal({
            type: "plan720_share",
            wx: false,
            pyq: false
          }).then(res => {});
        } catch (e) {

        }
      },
      getShareViewUrl(sevenObj, isShare) { // 处理URL
        let view720Url = this.view720BaseUrl;
        for (let key in sevenObj) {
          view720Url += key + '=' + sevenObj[key] + '&';
        };

        return this.$route.params.uuid ?
          `${baseAPI.viewWholeHouseBaseUrl}uuid=${this.$route.params.uuid}${!isShare ? '&APP='+sessionStorage.getItem('APP') : ''}` :
          view720Url;
      },
      checkWechat() {
        try {
          Wechat
          return Promise.resolve(true);
        } catch (e) {
          return Promise.reject(e);
        }
      },
      checkStoragePermission() {
        return new Promise((resolve, reject) => {
          let permissions = cordova.plugins.permissions;
          permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, status => {
            if (status.hasPermission) {
              resolve(true);
            } else {
              permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, () => resolve(true), e =>
                reject(e))
            }
          }, null);
        });
      },
      wechatShare(type, qrcode) {
        let scene = type == 1 ? Wechat.Scene.SESSION : Wechat.Scene.TIMELINE;
        let shareDesc = '方案在手，装修不愁，立刻3秒换装！';
        Wechat.share({
            message: {
              title: shareDesc, // "随选网",
              description: shareDesc,
              thumb: qrcode,
              media: {
                type: 4,
                image: qrcode
              }
            },
            scene: scene // share to SESSION  SESSION:  0, // 聊天界面 TIMELINE: 1, // 朋友圈
          },
          () => {
            this.qrMark.shareTitle = '我设计了一套漂亮的方案，分享给你~';
            this.shareModuleShow = false;
            this.shareShow = false;
            this.$toast('分享成功！');
          },
          e => {
            this.qrMark.shareTitle = '我设计了一套漂亮的方案，分享给你~';
            this.shareModuleShow = false;
            this.shareShow = false;
            console.log('Failed: ' + e);
            this.$toast('分享失败！');
          }
        );
      },
      async share(shareType, type) { // type: SESSION微信好友 TIMELINE 朋友圈
        //统计分享
        try {
          behaviorTotal({
            type: "plan720_share",
            wx: shareType == 'SESSION' ? true : false,
            pyq: shareType == 'SESSION' ? false : true
          }).then(res => {});
        } catch (e) {

        }
        if (type == 'img') {
          if(this.shareQrImgUrl!='') {
          try {
            await this.checkWechat();
            await this.checkStoragePermission();
            this.wechatShare(shareType == 'SESSION' ? 1 : 2, this.shareQrImgUrl);
          } catch (e) {
            console.error(e)
            this.$toast('分享失败！');
          }
          }else {
            this.$toast('海报生成中....')
          }
        } else {
          let pic = this.$store.state.resourcesUrl + this.$store.state.view720.view720Small;
          console.log(pic)
          let sevenObj = {
            token: JSON.parse(localStorage.getItem('token')),
            platformCode: 'mobile2b',
            operationSource: sessionStorage.getItem('operationSource'),
            planId: sessionStorage.getItem('view720Id'),
            routerQueryType: sessionStorage.getItem('routerQueryType'),
            customReferer: location.origin,
            platformNewCode: 'mobile2b',
            isShowReplace: 0, // 1标识显示产品替换0标识不显示
            shopId: sessionStorage.getItem('shopId') || '',
            isTask: sessionStorage.getItem('isTask') || 0
          };
          let type = Wechat.Type.WEBPAGE;
          let scene, shareUrl = this.getShareViewUrl(sevenObj, true);
          let _that = this;
          if (shareType === 'SESSION') {
            scene = Wechat.Scene.SESSION;
            this.session = false;
          } else {
            scene = Wechat.Scene.TIMELINE;
            this.timeline = false;
          }
          let planInfo =
            `/pages/home/home?userId=${this.userInfo.id}&time=${(new Date().getTime())}&token=${JSON.parse(localStorage.token)}&platformCode=mobil2b&operationSource=${sessionStorage.getItem('operationSource')}&planId=${sessionStorage.getItem('view720Id')}&routerQueryType=${sessionStorage.getItem('routerQueryType')}&customReferer=https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html&platformNewCode=miniProgram&type=720&shareType=0`
          // console.log(sessionStorage.getItem('bid'))
          //console.log(planInfo)
          console.log(planInfo, 'planInfo')
          console.log(shareUrl, 'shareUrl')
          Wechat.share({
            message: {
              title: '我刚刚用随选网免费装修了一套房子，快来看看吧！', // '随选网',
              description: '随选网',
              thumb: pic,
              mediaTagName: 'TEST-TAG-001',
              messageAction: '<action>dotalist</action>',
              media: Object.assign({
                webpageUrl: shareUrl,
              }, shareType !== 'SESSION' ? {
                type: Wechat.Type.WEBPAGE
              } : {
                type: Wechat.Type.MINIPROGRAM,
                path: planInfo
              })
            },
            scene: scene // share to SESSION  SESSION:  0, // 聊天界面 TIMELINE: 1, // 朋友圈
          }, function () {
            _that.$toast('分享成功！');
          }, function (reason) {
            console.log(reason + 'reason')
            _that.$toast('分享失败！');
          });
          setTimeout(() => {
            if (shareType === 'SESSION') {
              this.session = true;
            } else {
              this.timeline = true;
            }
          }, 1000)
        }
      },
      cancelToShare() { // app 关闭分享模块
        this.shareModuleShow = false;
      },
      pay() {
        console.log(this.payPlan, this.payType);
        if (this.payType == 0) { // 支付宝支付
          try { // 支付宝app支付
            cordova;
            this.APPAliPay();
          } catch (e) { // 支付宝H5支付
            var _this = this;
            this.checkInterval = setInterval(function () {
              _this.checkDesignCopyRight();
            }, 5000)
            let url = window.location.href;
            let redirectUrl = url;
            this.API.locpayDesignPlanCopyRight({
              redirectUrl: redirectUrl,
              planRecommendedId: this.payPlan,
              payType: 0,
              payMethod: "aliH5Pay",
              userId: JSON.parse(localStorage.getItem('userInfo')).id,
              useType: 0
            }).then((res) => {
              if (res) {
                let form = res.obj.mwebUrl;
                document.write(form);
                // this.payTradeNo = res.obj.payTradeNo;
              }
            });
          }
        } else if (this.payType == 1) { // 微信支付
          try { // 微信app支付
            Wechat;
            this.APPWeiXinPay();
            // console.log(Wechat, '微信支付, app')
          } catch (e) { // 微信H5支付
            var _this = this;
            this.checkInterval = setInterval(function () {
              _this.checkDesignCopyRight();
            }, 5000)
            let url = window.location.href;
            let redirectUrl = url;
            this.API.locpayDesignPlanCopyRight({
              redirectUrl: redirectUrl,
              planRecommendedId: this.payPlan,
              payType: 1,
              payMethod: "wxH5Pay",
              userId: JSON.parse(localStorage.getItem('userInfo')).id,
              useType: 0
            }).then((res) => {
              if (res) {
                // this.code_url = res.obj.mwebUrl;
                // location.href = this.code_url;
                // this.payTradeNo = res.obj.payTradeNo;
              }
            });
          }
        }
      },
      APPWeiXinPay() { // 微信app支付
        let params;
        let _that = this;
        this.API.locpayDesignPlanCopyRight({
          planRecommendedId: this.payPlan,
          payType: 1,
          payMethod: "wxAppPay",
          userId: JSON.parse(localStorage.getItem('userInfo')).id,
          useType: 0
        }).then((res) => {
          if (res.obj !== null) {
            params = {
              partnerid: res.obj.partnerid, // merchant id
              prepayid: res.obj.prepayid, // prepay id
              noncestr: res.obj.noncestr, // nonce
              timestamp: res.obj.timestamp, // timestamp
              sign: res.obj.sign, // signed string
              appid: res.obj.appid,
              package: res.obj.package
            };
            Wechat.sendPaymentRequest(params, function () {
              _that.$refs.iframe.contentWindow.postMessage('paySuccess', _that.view720BaseUrl);
              // _that.$toast('支付成功')
              // _that.$store.commit('popupMsg', '支付成功');
              // _that.$store.commit('showPopup');
              // _that.payAlertSuccShow = true;
            }, function (reason) {
              _that.$refs.iframe.contentWindow.postMessage('payFail', _that.view720BaseUrl);
              // _that.$toast('支付失败');
              // _that.$store.commit('popupMsg', '支付失败');
              // _that.$store.commit('showPopup');
              // _that.payAlertFailShow = false;
            });
          }
        });
      },
      APPAliPay() { // 支付宝app支付
        let _that = this;
        this.API.locpayDesignPlanCopyRight({
          planRecommendedId: this.payPlan,
          payType: 0,
          payMethod: "aliAppPay",
          userId: JSON.parse(localStorage.getItem('userInfo')).id,
          useType: 0
        }).then((res) => {
          if (res.obj !== null) {
            cordova.plugins.alipay.payment(res.obj.form, function success(e) {
              _that.$refs.iframe.contentWindow.postMessage('paySuccess', _that.view720BaseUrl);
              // _that.$toast('支付成功')
              // _that.$store.commit('popupMsg', '支付成功');
              // _that.$store.commit('showPopup');
              // _that.payAlertSuccShow = true;
            }, function error(e) {
              _that.$refs.iframe.contentWindow.postMessage('payFail', _that.view720BaseUrl);
              // _that.$toast('支付失败');
              // _that.$store.commit('popupMsg', '支付失败');
              // _that.$store.commit('showPopup');
              // _that.payAlertFailShow = false;
            });
          }
        });
      },
      checkDesignCopyRight() {
        var from = new FormData();
        from.append('recommendedPlanId', this.payPlan);
        from.append('userId', JSON.parse(localStorage.getItem('userInfo')).id);
        this.API.loccheckDesignCopyRight(from).then(res => {
          clearInterval(this.checkInterval);
          if (res.success) {
            // this.closePayAlert();
            // this.payAlertSuccShow = true;
          } else {
            // this.closePayAlert();
            // this.payAlertFailShow = true;
          }
        })
      }
    }
  };

</script>
<style lang="scss" scoped>
  .new-view720 {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    z-index: 1;

    .view {
      width: 100%;
      height: 100%;
    }

    .goback {
      width: 0.83rem;
      height: 0.83rem;
      background-size: 0.83rem 0.83rem;
      background-image: url('./images/goback_nor.png');
      position: absolute;
      left: 0.3rem;
      top: 0.3rem;
      z-index: 997;
    }

    .share-type {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.4);

      .colose_shareType {
        width: 100%;
        height: 8rem;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }

      .share_box {
        position: absolute;
        z-index: 999;
        bottom: 0;
        width: 100%;
        height: 12.2rem;
        background-color: #fff;
        z-index: 2;

        .nav {
          height: 0.8rem;
          display: flex;
          justify-content: space-around;
          border-bottom: solid 2px #e8e8e8;

          .nav-item {
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.32rem;
            color: #333;
            position: relative;
                font-weight: bold;
            .active_line {
              width: 100%;
              height: 2px;
              background-color: #ff6419;
              position: absolute;
              left: 0;
              bottom: -2px;
            }
          }

          .nav-item_active {
            color: #ff6419;
          }
        }

        .nav-tit {
          height: 80px;
          line-height: 80px;
          padding-left: 47px;
          font-size: 28px;
          color: #333;
        }

        .share_main {
          width: 652px;
          height: 8.5rem;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0px 10px 20px 0px rgba(153, 153, 153, 0.2);
          border-radius: 6px;

          .plan_img {
            width: 652px;
            height: 367px;
          }

          .title {
            padding: 30px 43px 0 43px;
            display: flex;

            .title_Text {
              width: 503px;
              overflow: hidden;
              font-family: PingFang-SC-Bold;
              font-size: 28px;
                  font-weight: bold;
              line-height: 0.5rem;
              letter-spacing: 0px;
              color: #333333;
              display: inline-block;
              vertical-align: top;
            }

            img {
              width: 60px;
              height: 60px;
              display: inline-block;
              vertical-align: top;
            }
          }

          .qrcode_box {
            padding: 0 43px;
            height: 1.28rem;
            line-height: 1.28rem;
            position: relative;

            .qrcode_tit {
              position: absolute;
              right: 0.15rem;
              top: 1.15rem;
              color: #999;
            }

            .qr_tit {
              float: left;
              font-size: 26px;
              color: #333;
            }

            img {
              width: 109px;
              height: 107px;
              float: right;
            }
          }
        }

        .share_but {
          width: 652px;
          height: 80px;
          background-image: linear-gradient(169deg,
            #ff6419 0%,
            #fa5c10 100%),
            linear-gradient(#ff6419,
            #ff6419);
          background-blend-mode: normal,
            normal;
          border-radius: 6px;
          margin: 0 auto;
          margin-top: 32px;
          text-align: center;
          line-height: 80px;
          color: #fff;
          font-size: 30px;
        }
      }
    }

    .share-popup {
      position: absolute;
      z-index: 999;
      bottom: 0;
      width: 100%;
      height: 4.28rem;
      background-color: #fff;

      .popup-text {
        margin-top: 0.62rem;
        margin-bottom: 0.4rem;
        text-align: center;
        font-size: 0.28rem;
        color: #333;
      }

      .share-wrapper {
        .share-item {
          width: 50%;
          text-align: center;

          .share-icon {
            margin: 0 auto;
            width: 0.98rem;
            height: 0.98rem;
            background-size: 100%;
          }

          .share-text {
            display: block;
            margin-top: 0.25rem;
            text-align: center;
            font-size: 0.24rem;
            color: #333;
          }
        }
      }

      .cancel-btn {
        margin-top: 0.6rem;
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: center;
        font-size: 0.32rem;
        color: #333;
        border-top: 0.01rem solid #f1f1f1;
      }
    }
  }

  body {
    position: absolute;
    width: 100%;
    height: 100%;
    font-family: PingFang-SC-Medium;
    -webkit-tap-highlight-color: transparent;
  }

  .clearfix:after {
    display: block;
    content: "";
    height: 0;
    line-height: 0;
    clear: both;
    visibility: hidden;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  @media (-webkit-min-device-pixel-ratio: 1.5),
  (min-device-pixel-ratio: 1.5) {
    .border-1px::after {
      -webkit-transform: scaleY(0.7);
      transform: scaleY(0.7);
    }
  }

  @media (-webkit-min-device-pixel-ratio: 2),
  (min-device-pixel-ratio: 2) {
    .border-1px::after {
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }

  .header-wrapper {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100 !important;
  }

  .nav-wrapper {
    position: absolute;
    top: 88px;
    width: 100%;
    display: flex;
  }

  .footer-wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 999;
  }

  .loading-wrapper {
    width: 100%;
    height: 88px;
    text-align: center;
    padding-top: 50px;
    clear: both;
    font-size: 22px;
    color: #8e8e8e;
  }

  @media all and (min-width: 1024px) {
    .loading-wrapper {
      height: 44px;
      line-height: 44px;
      text-align: center;
      clear: both;
      font-size: 12px;
    }
  }

  input:-webkit-autofill,
  select:-webkit-autofill,
  textarea:-webkit-autofill {
    background-color: none !important;
    background-image: none;
  }

  .pinch-zoom,
  .pinch-zoom img {
    width: 100%;
    -webkit-user-drag: none;
    -moz-user-drag: none;
    -ms-user-drag: none;
    user-drag: none;
  }

  .view720 {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .goback-box {
    width: 120px;
    height: 120px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 997;
  }

  .view720 .goback {
    width: 83px;
    height: 83px;
    background-size: 83px 83px;
    background-image: url("./images/goback_nor.png");
    position: absolute;
    left: 0px;
    top: 0px;
  }

  .view720 .cut-rule {
    position: absolute;
    width: 100%;
    height: 20px;
    bottom: 90px;
    background: #ddd;
    z-index: 999;
  }

  .view720 .particulars-header {
    position: absolute;
    width: 100%;
    height: 88px;
    background-color: #fff;
    line-height: 88px;
    text-align: center;
    font-size: 32px;
    color: #333;
    z-index: 999;
  }

  .view720 .particulars-header .go720 {
    width: 25px;
    height: 41px;
    position: absolute;
    left: 38px;
    top: 24px;
    background-size: 25px 41px;
    background-image: url("./images/back_nor.png");
    z-index: 1000;
  }

  .view720 .particulars-header .headline-text {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }

  .view720 .particulars-header .decorate-listing {
    font-size: 28px;
    color: #ff6419;
    position: absolute;
    right: 40px;
    z-index: 3;
  }

  .view720 .particulars-header .red-quantity-mark {
    width: 30px;
    height: 30px;
    font-size: 20px;
    background: red;
    color: #fff;
    border-radius: 15px;
    position: absolute;
    top: 13px;
    right: 25px;
    line-height: 30px;
    z-index: 999;
  }

  .view720 .particulars-header .compile-text {
    font-size: 28px;
    position: absolute;
    top: 0;
    right: 30px;
    bottom: 0;
    color: #ff6419;
    z-index: 1000;
  }

  .view720 .particulars-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 150px;
    background: #636363;
    z-index: 1000;
    font-size: 26px;
    color: #e6e6e6;
  }

  .view720 .particulars-footer .hint-content span {
    display: block;
    padding: 20px 75px 0 20px;
    line-height: 40px;
  }

  .view720 .particulars-footer .hint-content span .sign-image {
    width: 26px;
    height: 28px;
    margin-right: 20px;
  }

  .view720 .particulars-footer .close {
    width: 55px;
    height: 55px;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background-size: 55px 55px;
    background-image: url("./images/smallclose_nor.png");
  }

  .view720 .particulars-box {
    position: absolute;
    width: 100%;
    top: 88px;
    bottom: 0;
    background-color: #eeeeee;
    overflow: hidden;
    z-index: 999;
  }

  .view720 .particulars-box .particulars {
    position: absolute;
    width: 100%;
    font-family: PingFang-SC-Bold;
    font-size: 32px;
    font-weight: bold;
    color: #494949;
  }

  .view720 .particulars-box .particulars .particulars-title {
    display: block;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #ff6419;
  }

  .view720 .particulars-box .particulars .particulars-total {
    background-color: white;
    position: relative;
    margin-top: 20px;
    padding: 0 30px;
    height: 90px;
    line-height: 90px;
  }

  .view720 .particulars-box .particulars .particulars-total .sign-image {
    width: 26px;
    height: 28px;
    margin: auto 26px;
  }

  .view720 .particulars-box .particulars .particulars-wrapper {
    background-color: white;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item {
    padding: 0 30px;
    line-height: 90px;
    border-top: 1px solid #e3e3e3;
    /*no*/
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item span {
    position: relative;
    display: block;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item span .sign-image {
    width: 26px;
    height: 28px;
    margin: auto 26px;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name {
    position: relative;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .electric .type-wrapper .particulars-name {
    position: relative;
    height: 229px;
    background-color: #fff;
    margin: 6px 0;
    color: #999;
    font-size: 30px;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .electric .type-wrapper .particulars-name .replaced-texture-label {
    position: absolute;
    right: 5px;
    top: 50px;
    transform: rotate(30deg);
    width: 150px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    border-radius: 2px;
    color: #999;
    font-weight: normal;
    font-size: 24px;
    border: 1px solid #eee;
    /*no*/
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .electric .type-wrapper .particulars-name .particulars-smallimage {
    position: absolute;
    width: 300px;
    height: 200px;
    display: block;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .electric .type-wrapper .particulars-name .particulars-smalltext {
    position: absolute;
    left: 330px;
    top: 56px;
    bottom: 56px;
    font-weight: normal;
    display: flex;
    flex-flow: column;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .electric .type-wrapper .particulars-name .particulars-smalltext .smalltext-item {
    flex: 1;
    font-size: 24px;
    display: block;
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .no-electric {
    font-weight: normal;
    border-top: 1px solid #e3e3e3;
    /*no*/
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .no-electric .no-electric-name {
    padding-left: 36px;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .no-electric .type-wrapper .particulars-name {
    font-size: 30px;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .no-electric .type-wrapper .particulars-name .no-electric-item {
    position: relative;
    height: 230px;
    font-size: 50px;
    background-color: #fff;
    margin: 6px 0;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .no-electric .type-wrapper .particulars-name .no-electric-item .replaced-texture-label {
    position: absolute;
    right: 5px;
    top: 50px;
    transform: rotate(30deg);
    width: 150px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    border-radius: 2px;
    color: #999;
    font-weight: normal;
    font-size: 24px;
    border: 1px solid #eee;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .no-electric .type-wrapper .particulars-name .no-electric-item .particulars-smallimage {
    position: absolute;
    width: 300px;
    height: 200px;
    display: block;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .no-electric .type-wrapper .particulars-name .no-electric-item .particulars-smalltext {
    position: absolute;
    left: 330px;
    top: 56px;
    color: #999;
    bottom: 56px;
    font-weight: normal;
    display: column;
    flex-flow: column;
  }

  .view720 .particulars-box .particulars .particulars-wrapper .particulars-item .particulars-type .type-name .no-electric .type-wrapper .particulars-name .no-electric-item .particulars-smalltext .smalltext-item {
    flex: 1;
    font-size: 24px;
    display: block;
    width: 300px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .view720 .particulars-box .particulars .list-sign {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .view720 .particulars-box .particulars .open-sign {
    width: 22px;
    height: 14px;
    background-size: 22px 14px;
    background-image: url("./images/list-open.png");
  }

  .view720 .particulars-box .particulars .close-sign {
    width: 22px;
    height: 14px;
    background-size: 22px 14px;
    background-image: url("./images/list-close.png");
  }

  .view720 .single-box {
    position: absolute;
    width: 100%;
    top: 88px;
    bottom: 0;
    background: #fff;
    overflow: hidden;
  }

  .view720 .single-box .single {
    position: absolute;
    width: 100%;
    z-index: 999;
  }

  .view720 .single-box .single.padding-bot {
    padding-bottom: 110px;
  }

  .view720 .single-particulars {
    padding-bottom: 60px;
  }

  .view720 .single-particulars .close {
    width: 75px;
    height: 75px;
    position: absolute;
    top: 20px;
    right: 20px;
    background-size: 75px 75px;
    background-image: url("./images/close_nor.png");
  }

  .view720 .single-particulars .image-wrapper {
    position: absolute;
    top: 0;
    width: 750px;
    height: 750px;
    overflow: hidden;
  }

  .view720 .single-particulars .image-wrapper .single-particulars-image {
    display: block;
    width: 750px;
    height: 750px;
  }

  .view720 .single-particulars .trade-name {
    width: 100%;
    height: 132px;
    line-height: 35px;
    padding: 30px;
    background: #fff;
    font-size: 30px;
  }

  .view720 .single-particulars .single-particulars-wrapper {
    margin-top: 20px;
    background: #fff;
  }

  .view720 .single-particulars .single-particulars-wrapper .header-text {
    height: 80px;
    line-height: 80px;
    padding-left: 30px;
    font-size: 30px;
    border-bottom: 1px solid #eee;
    /*no*/
    color: #333333;
  }

  .view720 .single-particulars .single-particulars-wrapper .single-particulars-text {
    padding: 10px 30px 30px;
  }

  .view720 .single-particulars .single-particulars-wrapper .single-particulars-text li {
    font-size: 26px;
    color: #666666;
    margin-top: 20px;
  }

  .view720 .single-particulars .single-particulars-wrapper .single-particulars-text li span {
    font-weight: normal;
    margin-left: 80px;
  }

  .view720 .single-particulars .single-particulars-wrapper .single-particulars-text li .describe {
    margin: 0;
    display: block;
    float: left;
  }

  .view720 .single-particulars .single-particulars-wrapper .single-particulars-text li .describe-content {
    margin-left: 80px;
    width: 550px;
    display: block;
    float: left;
  }

  .view720 .material-details {
    margin-top: 20px;
    background: #fff;
  }

  .view720 .material-details .header-text {
    height: 80px;
    line-height: 80px;
    padding-left: 30px;
    font-size: 30px;
    border-bottom: 1px solid #eee;
    /*no*/
    color: #333333;
  }

  .view720 .material-details .materials-list {
    height: 120px;
    margin: 0 30px;
    padding: 29px 0;
    border-bottom: 1px solid #eee;
    /*no*/
    box-sizing: border-box;
  }

  .view720 .material-details .materials-list .materials-item {
    width: 100%;
    height: 100%;
    background: #ddd;
    display: flex;
    align-items: center;
    float: left;
    border: 1px solid transparent;
    /*no*/
  }

  .view720 .material-details .materials-list .materials-item .img {
    margin: 10px;
    display: block;
    width: 38px;
    height: 38px;
    float: left;
  }

  .view720 .material-details .materials-list .materials-item .materials-text {
    font-size: 26px;
    float: left;
  }

  .view720 .material-details .materials-list .active {
    border: 1px solid #ff6419;
    /*no*/
    color: #ff6419;
  }

  .view720 .material-details .materials-content {
    display: flex;
    align-items: center;
  }

  .view720 .material-details .materials-content .img {
    display: block;
    width: 220px;
    height: 220px;
    margin: 30px;
    float: left;
  }

  .view720 .material-details .materials-content .materials-content-text {
    float: left;
    font-size: 26px;
  }

  .view720 .material-details .materials-content .materials-content-text .brand {
    margin-bottom: 20px;
  }

  .view720 .productReplace {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 90px;
    font-size: 32px;
    line-height: 90px;
    background: #fff;
    z-index: 999;
  }

  .view720 .productReplace .productReplace-btn-item {
    flex: 1;
    border-right: 1px solid #ccc;
    /*no*/
  }

  .view720 .productReplace .productReplace-btn-item.disable {
    color: #ccc;
  }

  .view720 .productReplace .productReplace-btn-item .product-btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .view720 .productReplace .productReplace-btn-item .product-btn-wrapper .btn-sign {
    width: 42px;
    height: 42px;
    background-size: 42px 42px;
    float: left;
    margin-right: 40px;
  }

  .view720 .productReplace .productReplace-btn-item .product-btn-wrapper .added-sign {
    background-image: url("./images/not_added.png");
  }

  .view720 .productReplace .productReplace-btn-item .product-btn-wrapper .added-sign.active {
    background-image: url("./images/round_check_fill.png");
  }

  .view720 .productReplace .productReplace-btn-item .product-btn-wrapper .texture-sign {
    background-image: url("./images/texture.png");
  }

  .view720 .productReplace .productReplace-btn-item .product-btn-wrapper .product-sign {
    background-image: url("./images/product.png");
  }

  .view720 .productReplace .productReplace-btn-item .product-btn-wrapper .remove-sign {
    background-image: url("./images/remove.png");
  }

  .view720 .productReplace .productReplace-btn-item .product-btn-wrapper .btn-text {
    float: left;
  }

  .view720 .remove-confirmation-shade {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }

  .view720 .remove-confirmation-shade .remove-confirmation-contant {
    width: 540px;
    // height: 280px;
    background: #fff;
    border-radius: 4px;
  }

  .view720 .remove-confirmation-shade .remove-confirmation-contant .remove-confirmation-text {
    font-size: 30px;
    height: 192px;
    line-height: 40px;
    padding-top: 55px;
    position: relative;
  }

  .view720 .remove-confirmation-shade .remove-confirmation-contant .remove-confirmation-text:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #ddd;
    /*no*/
  }

  .view720 .remove-confirmation-shade .remove-confirmation-contant .remove-confirmation-text .text-item {
    text-align: center;
  }

  .view720 .remove-confirmation-shade .remove-confirmation-contant .remove-confirmation-btn {
    display: flex;
    height: 88px;
    line-height: 88px;
    font-size: 34px;
  }

  .view720 .remove-confirmation-shade .remove-confirmation-contant .remove-confirmation-btn .btn-item {
    flex: 1;
    text-align: center;
  }

  .view720 .productReplace-single-box {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #eee;
    z-index: 999;
  }

  .view720 .productReplace-single-box .pinch-zoom,
  .view720 .productReplace-single-box .pinch-zoom img {
    width: 100%;
    height: 100%;
    -webkit-user-drag: none;
    -moz-user-drag: none;
    -ms-user-drag: none;
    user-drag: none;
  }

  .view720 .productReplace-single-box .sameType-wrapper {
    position: absolute;
    top: 88px;
    bottom: 110px;
    overflow: hidden;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper {
    padding-bottom: 60px;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item {
    margin-top: 20px;
    font-size: 29px;
    background: #fff;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-name {
    padding: 43px 0 36px 30px;
    border-bottom: 1px solid #eee;
    /*no*/
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-name span {
    color: #999999;
    margin: 0 10px;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-top {
    display: 34px;
    align-items: center;
    padding: 30px 0;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-top .open-details {
    width: 44px;
    height: 44px;
    background-size: 44px 44px;
    background-image: url("./images/list_icon_down.png");
    float: left;
    margin-left: 35px;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-top .active-details {
    background-image: url("./images/list_icon_up.png");
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-top .sameType-smallWrapper {
    width: 640px;
    float: left;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-top .sameType-smallWrapper .sameType-smallItem {
    margin: 0 30px;
    width: 100px;
    height: 100px;
    float: left;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-top .sameType-smallWrapper .selType {
    width: 33px;
    height: 33px;
    position: absolute;
    bottom: 0;
    right: -1px;
    background-size: 33px 33px;
    background-image: url("./images/selType.png");
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .line {
    width: 100%;
    border-top: 1px solid #eee;
    /*no*/
    margin-left: 30px;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-item-details {
    display: 34px;
    align-items: center;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-item-details .img {
    display: block;
    width: 220px;
    height: 220px;
    margin: 30px;
    float: left;
    background: blue;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-item-details .materials-content-text {
    float: left;
    font-size: 26px;
  }

  .view720 .productReplace-single-box .sameType-wrapper .productReplace-single-wrapper .sameType-item .sameType-item-details .materials-content-text .brand {
    margin-bottom: 20px;
  }

  .view720 .sameTypeProduct-box {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper {
    width: 100%;
    position: absolute;
    top: 88px;
    bottom: 0;
    background: #eee;
    z-index: 999;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper {
    position: absolute;
    top: 0;
    bottom: 90px;
    /*height:11.55rem*/
    width: 100%;
    overflow: hidden;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .single-particulars-image {
    display: block;
    width: 750px;
    height: 567px;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item {
    margin-bottom: 20px;
    font-size: 29px;
    background: #fff;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-name {
    padding: 43px 0 36px 30px;
    border-bottom: 1px solid #eee;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-name span {
    color: #999999;
    margin: 0 10px;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-top {
    display: 34px;
    align-items: center;
    padding: 30px 0;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-top .open-details {
    width: 44px;
    height: 44px;
    background-size: 44px 44px;
    background-image: url("./images/list_icon_down.png");
    float: left;
    margin-left: 35px;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-top .active-details {
    background-image: url("./images/list_icon_up.png");
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-top .sameType-smallWrapper {
    width: 640px;
    float: left;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-top .sameType-smallWrapper .sameType-smallItem {
    margin: 0 30px;
    width: 100px;
    height: 100px;
    float: left;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-top .sameType-smallWrapper .selType {
    width: 33px;
    height: 33px;
    position: absolute;
    bottom: 0;
    right: -1px;
    background-size: 33px 33px;
    background-image: url("./images/selType.png");
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .line {
    width: 100%;
    border-top: 1px solid #eee;
    margin-left: 30px;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-item-details {
    display: 34px;
    align-items: center;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-item-details .img {
    display: block;
    width: 220.00000000000003px;
    height: 220.00000000000003px;
    margin: 30px;
    float: left;
    background: blue;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-item-details .materials-content-text {
    float: left;
    font-size: 26px;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameType-wrapper .sameType-item .sameType-item-details .materials-content-text .brand {
    margin-bottom: 20px;
  }

  .view720 .sameTypeProduct-box .sameTypeProduct-wrapper .sameTypeProduct-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 90px;
    line-height: 90px;
    text-align: center;
    font-size: 36px;
    background: #fff;
    color: #ff6419;
    border-top: 1px solid #e3e3e3;
    /*no*/
  }

  .view720 .productReplace-box {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f6f6f6;
    z-index: 999;
  }

  .view720 .productReplace-box .single-group-nav-wrapper {
    position: absolute;
    top: 88px;
    z-index: 999;
    width: 100%;
    height: 80px;
    line-height: 80px;
    background: #fff;
    display: flex;
    border-top: solid 1px #e3e3e3;
  }

  .view720 .productReplace-box .single-group-nav-wrapper .single-group-nav {
    text-align: center;
    font-size: 30px;
    flex: 1;
  }

  .view720 .productReplace-box .single-group-nav-wrapper .single-group-nav .changeActive {
    display: inline-block;
    height: 79px;
    border-bottom: 2px solid #ff6419;
    /*no*/
    color: #ff6419;
  }

  .view720 .productReplace-box .fillElement {
    position: absolute;
    width: 100%;
    height: 20px;
    top: 168px;
    background: #eee;
    z-index: 999;
  }

  .view720 .productReplace-box .like-product-list {
    width: 100%;
    height: 80px;
    line-height: 80px;
    font-size: 30px;
    position: absolute;
    top: 188px;
    background: #fff;
    z-index: 999;
  }

  .view720 .productReplace-box .like-product-list .like-product-wrapper {
    margin-left: 32px;
    width: 600px;
    height: 80px;
    float: left;
  }

  .view720 .productReplace-box .like-product-list .like-product-wrapper .basetabSpace {
    width: 100%;
    height: 100%;
  }

  .view720 .productReplace-box .like-product-list .like-product-wrapper .basetabSpace .basetabSpace-item {
    width: auto !important;
    text-align: center;
    height: 78px;
  }

  .view720 .productReplace-box .like-product-list .like-product-wrapper .basetabSpace .basetabSpace-item span {
    display: inline-block;
    margin: 0 10px;
  }

  .view720 .productReplace-box .like-product-list .like-product-wrapper .basetabSpace .basetabSpace-item .like-product-text {
    display: inline-block;
  }

  .view720 .productReplace-box .like-product-list .like-product-wrapper .basetabSpace .basetabSpace-item .active {
    color: #ff6419;
    border-bottom: 4px solid #ff6419;
    /*no*/
    height: 80px;
  }

  .view720 .productReplace-box .like-product-list .vector-intelligent-wrapper {
    width: 115px;
    height: 80px;
    float: left;
    opacity: 0.8;
  }

  .view720 .productReplace-box .like-product-list .vector-intelligent {
    width: 35px;
    height: 37px;
    position: absolute;
    right: 40px;
    top: 24px;
    background-size: 35px 37px;
    background-image: url("./images/vector_intelligent.png");
  }

  .view720 .productReplace-box .productReplace-wrapper {
    position: absolute;
    top: 268px;
    bottom: 0;
    width: 100%;
    padding: 10px;
    background-color: ": ";
  }

  .view720 .productReplace-box .productReplace-wrapper .productReplace-item {
    width: 346px;
    height: 365px;
    margin: 9px;
    float: left;
  }

  .view720 .productReplace-box .productReplace-wrapper .productReplace-item .item-image {
    display: block;
    width: 346px;
    height: 246px;
  }

  .view720 .productReplace-box .productReplace-wrapper .productReplace-item .item-footer {
    height: 118px;
    background: #fff;
  }

  .view720 .productReplace-box .productReplace-wrapper .productReplace-item .item-footer .item-text {
    width: 336px;
    font-size: 30px;
    padding: 24px 0 0 24px;
    line-height: 35px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .view720 .productReplace-box .productReplace-wrapper .productReplace-item .item-footer .select {
    display: block;
    width: 41px;
    height: 41px;
    float: right;
    margin: 0 15px 18px 0;
    background-size: 41px 41px;
    background-image: url("./images/not_added.png");
    background-repeat: no-repeat;
  }

  .view720 .productReplace-box .productReplace-wrapper .productReplace-item .item-footer .select-active {
    background-size: 41px 41px;
    background-image: url("./images/round_check_fill.png");
    background-repeat: no-repeat;
    border: 0;
  }

  .view720 .productReplace-box .productReplace-wrapper-group {
    top: 168px;
  }

  .view720 .productReplace-box .product-filtrate {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }

  .view720 .productReplace-box .productReplace-left {
    position: absolute;
    right: 0;
    width: 650px;
    height: 100%;
    background: #eeeeee;
    z-index: 1000;
  }

  .view720 .productReplace-box .productReplace-left.dropdown-enter-active,
  .view720 .productReplace-box .productReplace-left.dropdown-leave-active {
    transition: all 0.1s linear;
  }

  .view720 .productReplace-box .productReplace-left.dropdown-enter,
  .view720 .productReplace-box .productReplace-left.dropdown-leave-active {
    right: -650px;
  }

  .view720 .productReplace-box .productReplace-left .filtrate-header {
    height: 86px;
    line-height: 86px;
    background: #fff;
    font-size: 30px;
    display: 30px;
    align-items: center;
  }

  .view720 .productReplace-box .productReplace-left .filtrate-header .go-filtrate {
    width: 25px;
    height: 41px;
    position: absolute;
    left: 30px;
    background-image: url("./images/back_nor.png");
    background-size: 100% 100%;
  }

  .view720 .productReplace-box .productReplace-left .filtrate-header .title {
    margin: 0 auto;
  }

  .view720 .productReplace-box .productReplace-left .filtrate-header .filtrate {
    color: #ff6419;
    margin-left: 30px;
    float: left;
  }

  .view720 .productReplace-box .productReplace-left .filtrate-header .cancel {
    position: absolute;
    right: 30px;
    color: #ff6419;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper {
    position: absolute;
    width: 100%;
    top: 88px;
    bottom: 100px;
    overflow: hidden;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper {
    padding-top: 20px;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item {
    background: #fff;
    font-size: 30px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .productReplace-left-item-header {
    border-bottom: 1px solid #eee;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .productReplace-left-item-header .productReplace-left-item-header-text {
    margin: 20px 30px;
    float: left;
    color: #ff6419;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .productReplace-left-item-header .sel-target {
    float: right;
    margin: 20px 30px;
    color: #999;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .productReplace-left-item-header .active {
    color: #ff6419;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .productReplace-left-item-header .showHideMsgSign {
    position: absolute;
    right: 30px;
    width: 22px;
    height: 14px;
    background-size: 22px 14px;
    background-image: url("./images/list-open.png");
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .productReplace-left-item-header .showHideMsgSign-top {
    transform: rotate(180deg);
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .type-wrapper {
    padding: 0 10px;
    max-height: 5000px;
    overflow: hidden;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .type-wrapper .type-item {
    float: left;
    width: 170px;
    height: 54px;
    text-align: center;
    line-height: 54px;
    margin: 20px;
    border: 1px solid #eee;
    /*no*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .type-wrapper .active {
    border: 1px solid #ff6419;
    /*no*/
    color: #ff6419;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .type-wrapper .noborder {
    border: 0;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .extraActive {
    max-height: 5000px;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .productReplace-left-item .typeLimitHeight {
    height: 100%;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-wrapper .slide-wrapper .haveAll {
    height: 355px;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-all-wrapper {
    position: absolute;
    width: 100%;
    top: 108px;
    bottom: 0;
    overflow: hidden;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-all-wrapper .slide-all-wrapper {
    background: #fff;
    padding-top: 20px;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-all-wrapper .slide-all-wrapper .type-all-wrapper {
    padding: 0 10px;
    /*max-height: 50rem
              overflow: hidden*/
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-all-wrapper .slide-all-wrapper .type-all-wrapper .type-item {
    float: left;
    width: 170px;
    height: 54px;
    text-align: center;
    line-height: 54px;
    margin: 20px;
    border: 1px solid #eee;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 26px;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-all-wrapper .slide-all-wrapper .type-all-wrapper .allActive {
    border: 1px solid #ff6419;
    /*no*/
    color: #ff6419;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-footer {
    position: fixed;
    bottom: 0;
    font-size: 36px;
    width: 650px;
    height: 100px;
    line-height: 100px;
    color: #fff;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-footer .productReplace-left-reset {
    float: left;
    width: 50%;
    text-align: center;
    background: #999;
  }

  .view720 .productReplace-box .productReplace-left .productReplace-left-footer .productReplace-left-accomplish {
    float: left;
    width: 50%;
    text-align: center;
    background: #ff6419;
  }

  .view720 .productReplace-box .filtrateActive {
    background-color: rgba(0, 0, 0, 0.6);
  }

  .view720 .productReplace-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80px;
    font-size: 36px;
    color: #fff;
    background: #ff6419;
    z-index: 999;
  }

  .view720 .productReplace-footer .add-wrapper {
    width: 300px;
    height: 100%;
    text-align: center;
    line-height: 80px;
    margin: 0 auto;
    position: relative;
  }

  .view720 .productReplace-footer .add-wrapper .add-list {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    width: 47px;
    height: 41px;
    background-size: 47px 41px;
    background-image: url("./images/add_list.png");
  }

  .view720 .productReplace-footer .add-wrapper .add-listText {
    display: block;
    width: 236px;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  .view720 .productReplace-footer .add-wrapper .delete {
    display: block;
    width: 216px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*width: 0.75rem*/
  }

  .view720 .productReplace-footer-gray {
    background: #c8c7cd;
  }

  .view720 .replaceList-box {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f6f6f6;
    z-index: 999;
  }

  .view720 .replaceList-box .replaceList-wrapper {
    position: absolute;
    width: 100%;
    top: 88px;
    bottom: 100px;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item {
    position: relative;
    height: 214px;
    margin: 20px 0;
    font-size: 32px;
    background: #fff;
    transition: 0.3s;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .select {
    display: block;
    width: 41px;
    height: 41px;
    float: left;
    margin: 100px 0 0 30px;
    border: 1px solid #999;
    /*no*/
    border-radius: 20.5px;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .select-active {
    background-size: 41px 41px;
    background-image: url("./images/round_check_fill.png");
    border: 0;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .replaceList-item-image {
    width: 240px;
    height: 175px;
    margin: 20px;
    float: left;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .replaceList-item-text {
    width: 450px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    margin: 60px 0 0 13px;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .replaceList-item-type {
    display: 30px;
    align-items: center;
    font-size: 28px;
    margin-top: 25px;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .replaceList-item-type .replaceList-item-type-text {
    padding-top: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .replaceList-item-type .replaceType {
    padding-top: 3px;
    color: #ff6419;
    float: left;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .replaceList-item-type .selTypeSmallImage {
    width: 60px;
    height: 60px;
    float: left;
    margin-left: 20px;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .delete-wrapper {
    width: 44px;
    height: 44px;
    display: 30px;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .delete-wrapper .delete-sign {
    width: 26px;
    height: 32px;
    background-size: 100% 100%;
    background-image: url("./images/me_icon_delete@2x.png");
  }

  .view720 .replaceList-box .replaceList-wrapper .replaceList-item .delete-botton {
    position: absolute;
    width: 100px;
    height: 214px;
    line-height: 214px;
    text-align: center;
    background: #999;
    color: #fff;
    right: -100px;
  }

  .view720 .replaceList-box .popup-sure {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .view720 .replaceList-box .popup-sure .sure-wrapper {
    width: 541px;
    height: 280px;
    font-size: 30px;
    background: #fff;
    border-radius: 4px;
  }

  .view720 .replaceList-box .popup-sure .sure-wrapper .sure-top {
    height: 192px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #eee;
    /*no*/
  }

  .view720 .replaceList-box .popup-sure .sure-wrapper .sure-top .top-text {
    width: 270px;
    height: 65px;
    text-align: center;
    line-height: 40px;
  }

  .view720 .replaceList-box .popup-sure .sure-wrapper .sure-footer {
    display: flex;
    font-size: 34px;
    line-height: 88px;
  }

  .view720 .replaceList-box .popup-sure .sure-wrapper .sure-footer .cancel {
    flex: 1;
    text-align: center;
  }

  .view720 .replaceList-box .popup-sure .sure-wrapper .sure-footer .sure {
    flex: 1;
    text-align: center;
    color: #ff6419;
    border-left: 1px solid #eee;
    /*no*/
  }

  .view720 .replaceList-box .render-popup {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .view720 .replaceList-box .render-popup .render-wrapper {
    position: absolute;
    width: 540px;
    height: 440px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    border-radius: 8px;
    background: #fff;
    font-size: 32px;
    overflow: hidden;
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-header {
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    /*no*/
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-kind .kind-item {
    height: 88px;
    line-height: 88px;
    border-bottom: 1px solid #eee;
    /*no*/
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-kind .kind-item .kind-text {
    width: 322px;
    margin-left: 84px;
    float: left;
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-kind .kind-item .kind-text .price {
    float: right;
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-kind .kind-item .select {
    display: block;
    width: 41px;
    height: 41px;
    float: left;
    margin: 23px 32px;
    border: 1px solid #999;
    /*no*/
    border-radius: 20.5px;
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-kind .kind-item .select-active {
    background-size: 41px 41px;
    background-image: url("./images/round_check_fill.png");
    border: 0;
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-footer {
    display: flex;
    width: 100%;
    height: 88px;
    line-height: 88px;
    font-weight: bold;
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-footer .render-cancel {
    flex: 1;
    text-align: center;
    border-right: 1px solid #eee;
    /*no*/
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-footer .render-sure {
    flex: 1;
    text-align: center;
    color: #ff6419;
  }

  .view720 .replaceList-box .render-popup .render-wrapper .render-footer .unableAddRenderTak {
    color: #e0e0e0;
  }

  .view720 .replaceList-box .render-popup .render-state {
    width: 540px;
    font-size: 24px;
    height: 300px;
    background: #fff;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    border-radius: 8px;
  }

  .view720 .replaceList-box .render-popup .render-state .hint-image {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 45px 0 30px;
  }

  .view720 .replaceList-box .render-popup .render-state .hint-image .loading-img {
    width: 75px;
    height: 75px;
  }

  .view720 .replaceList-box .render-popup .render-state .hint-text {
    text-align: center;
  }

  .view720 .replaceList-box .render-popup .render-state .state-footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 80px;
    line-height: 80px;
    border-top: 1px solid #eee;
    display: flex;
  }

  .view720 .replaceList-box .render-popup .render-state .state-footer .state-footer-both {
    flex: 1;
    font-size: 28.000000000000004px;
    text-align: center;
  }

  .view720 .replaceList-box .render-popup .render-state .state-footer .state-footer-left {
    border-right: 1px solid #eee;
  }

  .view720 .view-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    z-index: 1;
  }

  .view720 .view-wrapper .view {
    width: 100%;
    height: 100%;
  }

  .view720 .view720Loading-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 998;
    background: #000;
  }

  .view720 .view720Loading-wrapper .loading-box {
    width: 236px;
    height: 300px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }

  .view720 .view720Loading-wrapper .loading-box .loading-logoimg {
    display: block;
    width: 236px;
    height: 229px;
  }

  .view720 .view720Loading-wrapper .loading-box .loading-text {
    font-size: 30px;
    color: #a3a4a6;
    text-align: center;
    margin-top: 30px;
  }

  .view720 .renderBefore {
    position: absolute;
    width: 100%;
    bottom: 89px;
    height: 50px;
    z-index: 1;
  }

  .view720 .renderBefore .render-botton {
    width: 200px;
    height: 60px;
    line-height: 50px;
    font-size: 24px;
    color: #fff;
    margin: 0 auto;
    text-align: center;
    border: 3px solid #fff;
    /*no*/
    border-radius: 35px;
    background: rgba(0, 0, 0, 0.4);
  }

  .view720 .render-shade {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 2;
  }

  .view720 .render-shade .renderhint-wrapper {
    width: 540px;
    height: 280px;
    background: #fff;
    border-radius: 10px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }

  .view720 .render-shade .renderhint-wrapper .hint-title {
    font-weight: bold;
    font-size: 34px;
    color: #ff6419;
    text-align: center;
    margin: 65px 0 26px;
  }

  .view720 .render-shade .renderhint-wrapper .hint-price {
    font-size: 26px;
    color: #000;
    text-align: center;
    margin-bottom: 42px;
  }

  .view720 .render-shade .renderhint-wrapper .judge-wrapper {
    display: 1px solid #eee;
    height: 88px;
    line-height: 88px;
    border-top: 1px solid #e0e0e0;
    /*no*/
  }

  .view720 .render-shade .renderhint-wrapper .judge-wrapper .judge-item {
    flex: 1;
    font-size: 34px;
    text-align: center;
  }

  .view720 .render-shade .renderhint-wrapper .judge-wrapper .judge-affirm {
    border-left: 1px solid #e0e0e0;
    color: #ff6419;
    font-weight: bold;
  }

  .view720 .render-shade .rendering-wrapper .rendering-img {
    display: block;
    width: 74px;
    height: 74px;
    margin: 38px auto 22px;
  }

  .view720 .render-shade .rendering-wrapper .rendering-text {
    font-size: 26px;
    text-align: center;
    margin-bottom: 32px;
  }

  .view720 .render-shade .rendering-wrapper .rendering-footer {
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 34px;
    font-weight: bold;
    color: #ff6419;
    border-top: 1px solid #e0e0e0;
  }

  .view720 .render-shade .rendering-wrapper .warmPrompt-wrapper {
    margin-top: 50px;
    height: 140px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    display: 1px solid #e0e0e0;
    /*no*/
    justify-content: center;
    align-items: center;
  }

  .view720 .render-shade .rendering-wrapper .warmPrompt-wrapper .warmPrompt-text .warmPrompt-item {
    display: block;
    font-size: 26px;
    color: #a3a3a3;
    margin: 20px;
    text-align: center;
  }

  .view720 .render-shade .render-footer {
    position: absolute;
    bottom: 30px;
    width: 100%;
    font-size: 24px;
    color: #fff;
    text-align: center;
  }

  .view720 .fullSpace-wrapper .shade {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 280px;
    background-color: #000;
    opacity: 0.6;
    z-index: 1;
  }

  .view720 .fullSpace-wrapper .fullSpace {
    position: absolute;
    bottom: 0;
    z-index: 2;
    width: 100%;
    margin: 36px 0 38px;
    word-break: keep-all;
    white-space: nowrap;
  }

  .view720 .fullSpace-wrapper .fullSpace .fullSpace-item {
    border-radius: 6px;
    border: 1px solid transparent;
    /*no*/
    margin: 0 15px;
  }

  .view720 .fullSpace-wrapper .fullSpace .fullSpace-item .pic {
    width: 100%;
    height: 140px;
    opacity: 0.8;
    border-radius: 6px;
  }

  .view720 .fullSpace-wrapper .fullSpace .fullSpace-item .active {
    border: 1px solid #ffffff;
    opacity: 1;
  }

  .view720 .fullSpace-wrapper .fullSpace .fullSpace-item .gmtCreate {
    display: block;
    font-size: 20px;
    margin-top: 30px;
    color: #ffffff;
    text-align: center;
  }

  .pulldown-wrapper .sign-wrapper {
    width: 670px;
    text-align: center;
    height: 82px;
    position: absolute;
    /*bottom: 0.3rem*/
    bottom: 70px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  .pulldown-wrapper .design-sign {
    text-align: center;
  }

  .pulldown-wrapper .pull-sign {
    display: inline-block;
    width: 81px;
    height: 82px;
    background-size: 81px 82px;
    margin-left: 27px;
  }

  .pulldown-wrapper .room-sign {
    background-image: url("./images/room_nor.png");
  }

  .pulldown-wrapper .details-sign {
    background-image: url("./images/details_nor.png");
  }

  .pulldown-wrapper .collect-sign {
    background-image: url("./images/collect_nor.png");
  }

  .pulldown-wrapper .collected-sign {
    background-image: url("./images/collect_pre.png");
  }

  .pulldown-wrapper .share-sign {
    background-image: url("./images/share_nor.png");
  }

  .share-popup {
    position: absolute;
    z-index: 999;
    bottom: 0;
    width: 100%;
    height: 428px;
    background-color: #fff;
  }

  .share-popup .popup-text {
    margin-top: 62px;
    margin-bottom: 40px;
    text-align: center;
    font-size: 28px;
    color: #333;
  }

  .share-popup .share-wrapper .share-item {
    width: 50%;
    text-align: center;
  }

  .share-popup .share-wrapper .share-item .share-icon {
    margin: 0 auto;
    width: 98px;
    height: 98px;
    background-size: 100%;
  }

  .share-popup .share-wrapper .share-item .share-text {
    display: block;
    margin-top: 25px;
    text-align: center;
    font-size: 24px;
    color: #333;
  }

  .share-popup .cancel-btn {
    margin-top: 60px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 32px;
    color: #333;
    border-top: 1px solid #f1f1f1;
    /*no*/
  }

  @media all and (orientation: landscape) {
    .sandu_logo {
      width: 232px;
      height: 65px;
      background-size: 232px 65px;
      background-image: url("./images/sandu_logo.png");
      position: absolute;
      left: 44px;
      bottom: 42px;
      z-index: 997;
    }

    .pullleft-wrapper {
      width: 81px;
      position: absolute;
      top: 50%;
      left: 30px;
      transform: translateY(-50%);
      z-index: 1;
    }

    .pullleft-wrapper .left-sign {
      width: 81px;
      height: 82px;
      background-size: 81px 82px;
      margin-bottom: 30px;
    }

    .pullleft-wrapper .VR-sign {
      background-image: url("./images/VR_nor.png");
    }

    .pullleft-wrapper .gyroscope-sign {
      background-image: url("./images/gyroscope_nor.png");
      margin-bottom: 0;
    }

    .pullleft-wrapper .music-sign {
      background-image: url("./images/music_nor.png");
      z-index: 2;
    }

    .pullleft-wrapper .music-open {
      background-image: url("./images/music_pre.png");
    }

    .share-QRcode {
      position: absolute;
      width: 330px;
      height: 330px;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      z-index: 1;
    }
  }

  @media all and (orientation: portrait) {
    .sandu_logo {
      width: 232px;
      height: 65px;
      background-size: 232px 65px;
      background-image: url("./images/sandu_logo.png");
      position: absolute;
      left: 44px;
      bottom: 130px;
      z-index: 997;
    }

    .pullleft-wrapper {
      width: 81px;
      position: absolute;
      top: 150px;
      left: 30px;
      z-index: 1;
    }

    .pullleft-wrapper .left-sign {
      width: 81px;
      height: 82px;
      background-size: 81px 82px;
      margin-bottom: 30px;
    }

    .pullleft-wrapper .VR-sign {
      background-image: url("./images/VR_nor.png");
    }

    .pullleft-wrapper .gyroscope-sign {
      background-image: url("./images/gyroscope_nor.png");
      margin-bottom: 0;
    }

    .pullleft-wrapper .music-sign {
      background-image: url("./images/music_nor.png");
      z-index: 2;
    }

    .pullleft-wrapper .music-open {
      background-image: url("./images/music_pre.png");
    }

    .share-QRcode {
      position: absolute;
      width: 330px;
      height: 330px;
      top: 330px;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      z-index: 1;
    }
  }

</style>
