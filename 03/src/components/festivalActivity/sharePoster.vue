<template>
  <transition name="slide-fade">
    <div class="poster-share" v-show="dialog.sharePoster">
      <!-- 主要的box -->
      <div class="poster-share-box" v-show="!posterShareImgShow">
        <div class="share-box-first">
          <img src="/static/image/720_share_01(1).png" alt="">
        </div>
        <div class="share-box-second">
          <div class="box-second-title">生成海报分享朋友圈</div>
          <div class="box-second-message">
            <div class="second-message-cover">
              <img src="/static/image/festivalActivity/spring_share_bg.png" alt="">
            </div>
          </div>
          <div class="box-second-btn" @click="init">生成海报</div>
        </div>
        <div class="share-box-close" @click='setDialog({sharePoster:false});move()'><img src="/static/image/720_icon_close_share.png" alt=""></div>
      </div>
      <!--生成海报的图片-->
      <div class="imgBox" ref='shareImage'>
          <img src="/static/image/festivalActivity/spring_share_bg.png" alt="" class="share-img">
          <div class="code-img"><img :src="wxMiniProgramsImage" alt=""></div>
          <!--<div class="code-img"><img src="/static/image/head1.png" alt=""></div>-->
          <p>微信扫描或长按识别图中的小程序码</p>
      </div>
      <!--最终生成海报展示的图片-->
      <div class="poster-share-img" v-show="posterShareImgShow" @click.self="posterShareImgShow = false;move();">
        <div class="share-img-message" @click.stop>
          <img :src="posterImageUrl" alt="">
          <div class="img-message-hint"><img src="/static/image/720_share_press.png" alt=""></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import html2canvas from 'html2canvas'
  import festivalActivity from "@/mixin/festivalActivity"
  export default {
    name: "sharePoster",
    mixins:[festivalActivity],
    data() {
      return {
        posterImageUrl: '',
        posterShareImgShow: false,
        wxMiniProgramsImage: ''
      }
    },
    mounted() {

    },
    methods: {
      init() { // 初始化
        this.$route.query.isShare=1; //分享海报 需跳转的 好友助力
        let localUrl=location.href.replace('festivalActivity','inviteFriend');//替换当前的链接 跳转的 好友助力
        let item = Object.assign({ url: localUrl.slice(0, localUrl.indexOf('?') + 1) }, this.$route.query);
        //location 随选网跳home
        this.API.getQrminiProgramCode({ jsonData: JSON.stringify(item), location: "pages/home/home" ,appId:'wx42e6b214e6cdaed3'}).then(res => {
          this.wxMiniProgramsImage = res.obj;
          this.keepUpShareImage();
        })
      },
      keepUpShareImage() { // 保存生成的图片
        this.$nextTick(() => {
          html2canvas(this.$refs.shareImage, {
            useCORS: true, //（图片跨域相关）
            allowTaint: false, //允许跨域（图片跨域相关）
            taintTest: true //是否在渲染前测试图片
          }).then(canvas => {
            this.stop();
            this.posterShareImgShow = true
            this.posterImageUrl = canvas.toDataURL("image/jpeg")
          })
        })
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
    overflow: hidden;
    .poster-share-box{
      width: 620px;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%);
      .share-box-first{
        width: 100%;
        height: 225px;
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
        padding:0 30px;
        .box-second-title{
          margin: 30px 0 19px 0;
          font-size: 32px;
          color: #333333;
          font-weight: 900;
        }
        .box-second-message{
          width: 560px;
          height: 560px;
          border-radius: 6px;
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
        }
        .box-second-btn{
          width: 540px;
          height: 80px;
          background-color: #c22f3d;
          border-radius: 40px;
          color: #fff;
          font-size: 28px;
          margin-top: 30px;
          text-align: center;
          line-height: 80px;

        }
      }
      .share-box-close{
        width: 56px;
        height: 56px;
        margin: 45px auto 0 auto;
        img{
          width: 100%;
          height: 100%;
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
      background-color: rgba(0, 0, 0, 0.3);
      .share-img-message{
        width: 560px;
        height: 750px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 20px;
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
    .imgBox{
      width: 560px;
      border-radius: 20px;
      background-color: #fff;
      position: absolute;
      left: -100%;
      top: -100%;
      .share-img{
          height: 560px;
       }
      .code-img{
        width: 180px;
        height: 180px;
        margin: -90px auto 0 auto;
        background-color: #ffffff;
        box-shadow: 0px 20px 40px 0px
        rgba(194, 47, 61, 0.2);
        border-radius: 20px;
        position: relative;
        z-index: 2;
         img{
           display: block;
           width: 180px;
           height: 180px;
           border-radius: 20px;
           margin: 0 auto;
           box-shadow: 0px 20px 40px 0px
           rgba(194, 47, 61, 0.2);
         }
      }
      p{
        text-align: center;
        color: #999999;
        font-size: 22px;
        padding: 34px 0 74px 0;
      }
    }
  }
</style>
