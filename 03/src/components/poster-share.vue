<template>
  <div class="poster-share">
    <!-- 主要的box -->
    <div class="poster-share-box">
      <div class="share-box-first">
        <img src="/static/image/720_share_01.png" alt="">
      </div>
      <div class="share-box-second">
        <div class="box-second-title"><img src="/static/image/720_share_02_title(1).png" alt=""></div>
        <div class="box-second-message" ref='shareImage'>
          <div class="second-message-cover">
            <img :src="baseUrl.resourceURL+detailData.shareImg" alt="">
          </div>
          <!--<div class="second-message-text clearfix">-->
            <!--<div class="message-text-content fl">{{realCopywriter}}</div>-->
            <!--<div class="message-text-write fr" v-show="writeCopywriterBtnShow" @click="posterShareExitShow = true, copywriter = realCopywriter"></div>-->
          <!--</div>-->
          <div class="logo-image-img"><img :src="wxMiniProgramsImage" alt=""></div>
          <!--<div class="second-message-logo clearfix">-->
            <!--<div class="message-logo-content fl"></div>-->
            <!--<div class="message-logo-image fr">-->
              <!--<div class="logo-image-img"><img :src="wxMiniProgramsImage" alt=""></div>-->
              <!--&lt;!&ndash; <div class="logo-image-hint" v-show="!writeCopywriterBtnShow"></div> &ndash;&gt;-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <div class="box-second-btn" @click="keepUpShareImage">保存图片后分享到朋友圈</div>
      </div>
      <div class="share-box-close" @click='close'><img src="/static/image/720_icon_close_share.png" alt=""></div>
    </div>
    <!-- 编辑title的弹窗 -->
    <div class='poster-share-exit' v-show="posterShareExitShow">
      <div class="share-exit-box">
        <div class="exit-box-title">编辑分享文案(30字内)</div>
        <div class="exit-box-textarea">
          <textarea maxlength="30" name="" id="" cols="30" rows="10" v-model="copywriter"></textarea>
        </div>
        <div class="exit-box-btn">
          <div class="box-btn-left" @click="operationCopywriter('left')">取消</div>
          <div class="box-btn-right" @click="operationCopywriter('right')">确定</div>
        </div>
      </div>
    </div>
    <div class="poster-share-img" v-show="posterShareImgShow" @click="posterShareImgShow = false">
      <div class="share-img-message">
        <img :src="posterImageUrl" @click.stop alt="">
        <div class="img-message-hint"><img src="/static/image/720_share_press.png" alt=""></div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { mapState,mapGetters } from 'vuex'

  export default {
    // props: {
    //   registrationId: {
    //     type: String,
    //     default() {
    //       return ''
    //     }
    //   }
    // },
    props: ['registrationId'],
    data() {
      return {
        copywriter: '我在随选网设计了一套漂亮的方案，分享给你~', // 分享文案
        realCopywriter: '我在随选网设计了一套漂亮的方案，分享给你~',
        posterShareExitShow: false, // 修改分享文案弹窗
        writeCopywriterBtnShow: true, // 是否显示编辑文案按钮
        posterImageUrl: '',
        posterShareImgShow: false,
        wxMiniProgramsImage: ''
      }
    },
    mounted() {
      this.init() // 初始化
    },
    computed: {
    ...mapState(['resourceUrl']),
    ...mapGetters('cutprice',['detailData','urlParams']),
    },
    watch: {
     registrationId(newVal) {
       if (newVal) {
        let item = Object.assign({ url: location.href.slice(0, location.href.indexOf('?') + 1) }, this.$route.query);
        item.token ? delete item.token : null;
        item.isRender ? delete item.isRender : null;
        item.isUser = 2
        item.regId = this.registrationId;
        item.shareType='cutPrice';
        console.log(item.regId, this.registrationId, 'watch')
        //location 有2中方式 企业小程序的跳index  随选网跳home
        this.API.getQrminiProgramCode({ jsonData: JSON.stringify(item), location: this.urlParams.appId=="wx42e6b214e6cdaed3" ? `pages/home/home` : `pages/index/index`,appId:this.urlParams.appId}).then(res => {
          this.wxMiniProgramsImage = res.obj
        })
       }
     },
    },
    methods: {
      init() { // 初始化
        let item = Object.assign({ url: location.href.slice(0, location.href.indexOf('?') + 1) }, this.$route.query);
        item.token ? delete item.token : null;
        item.isRender ? delete item.isRender : null;
        item.isUser = 2
        if (this.registrationId) {
          item.regId = this.registrationId
        }
         console.log(item.regId, this.registrationId,  'init')
        //location 有2中方式 企业小程序的跳index  随选网跳home
        this.API.getQrminiProgramCode({ jsonData: JSON.stringify(item), location: this.urlParams.appId=="wx42e6b214e6cdaed3" ? `pages/home/home` : `pages/index/index`,appId:this.urlParams.appId}).then(res => {
          this.wxMiniProgramsImage = res.obj
        })
      },
      close() { // 关闭
        this.$emit('close')
      },
      operationCopywriter(type) { // 操作分享文案
        this.posterShareExitShow = false
        type === 'right' ? this.realCopywriter = this.copywriter : null
      },
      keepUpShareImage() { // 保存生成的图片
        this.writeCopywriterBtnShow = false
        this.$nextTick(() => {
          html2canvas(this.$refs.shareImage, {
              useCORS: true, //（图片跨域相关）
              allowTaint: false, //允许跨域（图片跨域相关）
              taintTest: true //是否在渲染前测试图片
          }).then(canvas => {
            this.writeCopywriterBtnShow = true
            this.posterShareImgShow = true
            this.posterImageUrl = canvas.toDataURL("image/jpeg")
          })
        })
      },
      disposeBecomeString(item) { // 处理成字符串
        let str = ''
        for (let key in item) { str += `${key}=${item[key]}&` }
        return str
      }
    }
  }
</script>

<style lang="scss" scoped>
  .poster-share{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 11;
    .poster-share-box{
      width: 620px;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%);
      .share-box-first{
        width: 100%;
        height: 239px;
        margin-bottom: 20px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .share-box-second{
        width: 100%;
        height: 780px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        //padding: 0 40px;
        padding:0 30px;
        .box-second-title{
          width: 160px;
          height: 40px;
          margin: 30px 0 19px 0;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .box-second-message{
          width: 560px;
          height: 560px;
          border-radius: 6px;
          // overflow: hidden;
          /*box-shadow: 0 0 20px #ccc;*/
          position: relative;
          .second-message-cover{
            width: 100%;
            height: 560px;
            position: relative;
            z-index: 10;
            img{
              display: block;
              width: 560px;
              height: 560px;
            }
          }
          .logo-image-img{
            position: absolute;
            bottom: 48px;
            left: 50%;
            margin-left: -48px;
            z-index: 11;
            img{
              display: block;
              width: 96px;
              height: 96px;
              margin: 0 auto;
            }
          }
          .second-message-text {
            padding: 23px 20px 0  31px;
            color: #333333;
            font-size: 28px;
            line-height: 45px;
            .message-text-content{
              width: 420px;
              word-wrap:break-word;
            }
            .message-text-write{
              width: 48px;
              height: 48px;
              background-image: url('/static/image/720_share_edit.png');
              background-size: 100% 100%;
            }
          }
          .second-message-logo{
            padding: 0 30px;
            position: absolute;
            bottom: 0;
            .message-logo-image{
              .logo-image-img{
                margin: 0 auto;
                width: 96px;
                height: 96px;
                position: absolute;

                img{
                  width: 96px;
                  height: 96px;
                }
              }
              .logo-image-hint{
                margin: 0 auto;
                background-image: url('/static/image/code-hilt.png');
                background-size: 100% 100%;
                width: 111px;
                height: 16px;
              }
            }
          }
        }
        .box-second-btn{
          width: 540px;
          height: 80px;
          color: #fff;
          font-size: 28px;
          margin-top: 30px;
          background-color: #29cccc;
          border-radius: 40px;
          text-align: center;
          line-height: 80px;

        }
      }
      .share-box-close{
        width: 56px;
        height: 56px;
        margin: 30px auto 0 auto;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .poster-share-exit{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 2;
      .share-exit-box{
        width: 560px;
        height: 403px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 10px;
        .exit-box-title{
          padding-top: 21px;
          text-align: center;
          line-height: 114px;
          color: #333;
          font-size: 36px;
        }
        .exit-box-textarea{
          width: 100%;
          padding: 0 60px 4px;
          color: #333;
          textarea{
            width: 400px;
            height: 100px;
            border: #ccc solid 1px;
            padding: 30px;
          }
        }
        .exit-box-btn{
          display: flex;
          text-align: center;
          font-size: 32px;
          line-height: 88px;
          border-top: #ccc solid 1px;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          .box-btn-left{
            flex: 1;
            color: #999;
            border-right: #ccc solid 1px;
          }
          .box-btn-right{
            flex: 1;
            color: #ff6419;
          }
        }
      }
    }
    .poster-share-img{
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.9);
      .share-img-message{
        width: 100%;
        height: 750px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        img{
          width: 100%;
          height: 100%;
        }
        .img-message-hint{
          width: 580px;
          height: 33px;
          margin: 40px auto 0;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .share-img-hint{
        width: 580px;
        height: 33px;
        margin: 40px auto 0;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
