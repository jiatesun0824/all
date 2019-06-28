<template>
  <div class="cardPoster" v-if="posterShow">
    <div class="bgbut" @click="closeToast"></div>
    <div class="pos">
      <div class="main" ref="poster">
        <!-- <div class="cardImg"><img src="./images/cardImg_bg.png" alt=""></div> -->
        <div class="poster">
          <!-- <div class="head" ref="shareImage">
            <img class="headBg" src="./images/card-bg.png" alt="">
            <div class="head_main">
              <img class="port" v-if="dataDetail.userHeadPicPath" :src="dataDetail.userHeadPicPath | filterImg" alt="">
              <img class="port" v-else src="./images/Head portrait@2x.png" alt="">

              <div class="name">{{dataDetail.userName?dataDetail.userName:'姓名'}}</div>
              <div class="post">{{dataDetail.companyPost?dataDetail.companyPost:'职位'}}</div>
              <div class="info">
                <span>{{dataDetail.phone?dataDetail.phone:'暂无电话'}}</span>
                <div class="companyname"> {{dataDetail.companyName}}</div>
                <div class="item">
                  <img src="./images/icon-MPdianhu@2x.png" alt=""> <span>{{dataDetail.phone?dataDetail.phone:'暂无电话'}}</span>
                </div>
              </div>
            </div>
          </div> -->
          <div class="cardbox">
            <img class="card_bg" :src="dataDetail.posterPath?resourceURL+dataDetail.posterPath:require('./images/iconCard_surecardbg.png')" alt="">
            <div class="info">
              <div class="name">
                <span class="name_value">{{dataDetail.userName?dataDetail.userName:'姓名'}}</span> <span
                  class="post">{{dataDetail.companyPost?dataDetail.companyPost:'职位'}}</span></div>

              <div class="item">
                <img src="./images/iconCard_phone.png" alt=""> <span
                  class="item_value">{{dataDetail.phone?dataDetail.phone:'暂无电话'}}</span>
              </div>
              <div class="item">
                <img src="./images/iconCard_company.png" alt=""> <span
                  class="item_value">{{dataDetail.companyName?dataDetail.companyName:'暂无公司'}}</span>
              </div>
              <div class="item">
                <img src="./images/iconCard_sig.png" alt=""> <span
                  class="item_sig">{{dataDetail.signature?dataDetail.signature:'暂无签名'}}</span>
              </div>
              <div class="info_qrcode">
                <img :src="qrimg" alt="">
                <div class="qr_tit">长按识别二维码</div>
              </div>
            </div>
          </div>

          <!-- <div class="qrcode">
            <img :src="qrimg" alt="">
            <div>长按识别二维码，收下名片</div>
          </div> -->
        </div>
      </div>
      <div class="footer">
        <!-- <div class="footer_but" @click="createdPoster">转发好友</div>
        <div class="footer_but" @click="share">转发朋友圈</div> -->
        <div class="footer_but_item" @click="shareImg">确定分享</div>
      </div>
    </div>
    <div class="posterImg" v-if="posterImgShow" @click="posterImgShow = false">
      <img :src="posterImageUrl" alt="">
      <div class="tit">海报已生成，长按图片保存至本地</div>
    </div>
    <shareComponent shareWay='image' :shareShow.sync="shareShow" :isCard="isCard"></shareComponent>
  </div>
</template>
<script>
  import html2canvas from 'html2canvas';
  import shareComponent from "@/components/shareComponent/index";
  export default {
    name: 'cardPoster',
    props: {
      posterShow: false,
      dataDetail: {}
    },
    components: {
      shareComponent
    },
    data() {
      return {
        qrimg: '',
        posterImgShow: false,
        posterImageUrl: "",
        shareShow: false,
        isCard: true
      }
    },
    methods: {
      shareImg() {
        this.shareShow = true;
        this.$nextTick(() => {
          html2canvas(this.$refs.poster, {
            useCORS: true, //（图片跨域相关）
            allowTaint: false, //允许跨域（图片跨域相关）
            taintTest: true //是否在渲染前测试图片
          }).then(canvas => {
            sessionStorage.setItem('posterImageUrl', JSON.stringify(canvas.toDataURL("image/jpeg")));
            //sessionStorage.setItem('posterdesc', JSON.stringify('你好，我是' + this.dataDetail.companyName + '的' +this.dataDetail.companyPost + this.dataDetail.userName));
            // sessionStorage.setItem('cardId', this.dataDetail.userCardId);
          })
        })
      },
      getWXQRCode(userCardId) {
        this.API.getWXQRCode(userCardId).then(res => {
          this.qrimg = res.obj;
        })
      },
      share() {
        this.shareShow = true;
        this.keepUpShareImage();
      },
      keepUpShareImage() { // 保存生成的图片
        this.$nextTick(() => {
          html2canvas(this.$refs.shareImage, {
            useCORS: true, //（图片跨域相关）
            allowTaint: false, //允许跨域（图片跨域相关）
            taintTest: true //是否在渲染前测试图片
          }).then(canvas => {
            this.posterImageUrl = canvas.toDataURL("image/jpeg");
            sessionStorage.setItem('posterImageUrl', JSON.stringify(canvas.toDataURL("image/jpeg")));
            sessionStorage.setItem('posterdesc', JSON.stringify('你好，我是' + this.dataDetail.companyName + '的' +
              this.dataDetail.companyPost + this.dataDetail.userName));
            sessionStorage.setItem('cardId', this.dataDetail.userCardId);
          })
        })
      },
      createdPoster() {
        this.$nextTick(() => {
          html2canvas(this.$refs.poster, {
            useCORS: true, //（图片跨域相关）
            allowTaint: false, //允许跨域（图片跨域相关）
            taintTest: true //是否在渲染前测试图片
          }).then(canvas => {
            this.posterImageUrl = canvas.toDataURL("image/jpeg");
            this.posterImgShow = true;
          })
        })
      },
      closeToast() {
        this.$emit('closeToast');
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import './styles/cardPoster.scss'

</style>
