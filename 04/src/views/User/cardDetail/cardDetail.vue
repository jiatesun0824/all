<template>
  <div class="cardDetail">
    <header>
      <i class="icon-left" @click="$router.back()"></i>
      <div class="title">名片</div>
      <!--<div class="right" style="color:#333;font-size:0.42rem;" @click="$router.push('/editBusCard')">编辑名片</div>-->
    </header>
    <scroll class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true" :beforeScroll="true"
      :scrollX="true" :refreshScroll="true" ref="wrapperScroll">
      <div class="box">
        <div class="headbox">
          <div class="cardImg"><img src="../busCard/images/cardImg.png" alt=""></div>
          <div class="head" ref="shareImage">
            <div class="port">
             <img v-if="dataDetail.userHeadPicPath" :src="dataDetail.userHeadPicPath | filterImg" alt="">
             <img v-else src="./images/Head portrait@2x.png" alt="">
           </div>
           <div class="name" :style="dataDetail.userName?'color:#333':'color:#999'">
             <span class="name_val">{{dataDetail.userName?dataDetail.userName:'姓名'}}</span>
             <span class="post">{{dataDetail.companyPost?dataDetail.companyPost:'职位'}}</span>
           </div>
           <div class="phone" style="color:#666">
              <img class="x-icon" src="../busCard/images/iconCard_phone.png" alt=""><span class="item_value">{{dataDetail.phone?dataDetail.phone:'暂无电话'}}</span>
           </div>
           <div class="company" style="color:#666">
            <img class="x-icon" src="../busCard/images/iconCard_company.png" alt=""> <span class="item_value">{{dataDetail.companyName?dataDetail.companyName:'暂无公司'}}</span>
           </div>
           <div class="company" style="color:#666">
            <img class="x-icon" src="../busCard/images/iconCard_sig.png" alt=""> <span class="item_sig">{{dataDetail.signature?dataDetail.signature:'暂无签名'}}</span>
           </div>
          </div>
          <div class="user-info">
              <div class="user-info-item">
                 <div class="item-left">
                   <img src="./images/icon-call@2x.png" alt="">
                   <div class="phone">
                      <p>手机号</p>
                      <p>{{dataDetail.phone?dataDetail.phone:'暂无电话'}}</p>
                   </div>
                 </div>
                 <div class="item-right"><a :href="callPhone">一键拨号</a></div>
              </div>
              <div class="user-info-item">
                <div class="item-left">
                  <img src="./images/icon-weixin@2x.png" alt="">
                  <div class="phone">
                    <p>微信号</p>
                    <p>{{dataDetail.userWechat ? dataDetail.userWechat : '暂无微信'}}</p>
                  </div>
                </div>
                <div class="item-right"><button class="tag-read" :data-clipboard-text="dataDetail.userWechat" @click="copy">一键复制</button></div>
              </div>
              <div class="user-info-item">
                <div class="item-left">
                  <img src="./images/icon-email@2x.png" alt="">
                  <div class="phone">
                    <p>邮箱</p>
                    <p>{{dataDetail.email ? dataDetail.email : '暂无邮箱'}}</p>
                  </div>
                </div>
                <div class="item-right"><button class="tag-read" :data-clipboard-text="dataDetail.email" @click="copy">一键复制</button></div>
              </div>
              <div class="user-info-item">
                <div class="item-left">
                  <img src="./images/icon-address@2x.png" alt="">
                  <div class="phone">
                    <p>线下地址</p>
                    <p>{{dataDetail.address?dataDetail.address:'暂无地址'}}</p>
                  </div>
                </div>
                <div class="item-right" @click="toMap">一键导航</div>
              </div>
          </div>
          <!--<div class="butBox">-->
            <!--<div class="butitem" @click="showPoster">-->
              <!--转发名片-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <div class="resme">
          <div class="resme_title">
            个人介绍
          </div>
          <div class="resme_info">
            <!--<div v-if="dataDetail.resume" v-for="(item, index) in dataDetail.resume" :key="index">{{item}}</div>-->
            <div v-if="dataDetail.presentation" v-html="dataDetail.presentation"></div>
            <div v-else>完善个人信息，让别人更了解你</div>
          </div>
        </div>
        <!--<div class="resme">-->
          <!--<div class="resme_title">-->
            <!--照片展示-->
          <!--</div>-->
          <!--<div class="resme_info" v-if="resPicVoList.length==0">-->
            <!--添加照片让名片更丰富-->
          <!--</div>-->
          <!--<div v-else class="resme_img">-->
            <!--<img :src="item.picPath | filterImg" v-for="(item, index) in resPicVoList" :key="index" alt="">-->
            <!--<div class="imgShowBut" @click="isAllShowImg">{{imgShowBut}}</div>-->
          <!--</div>-->
        <!--</div>-->
        <div class="footer">已到底</div>
      </div>
    </scroll>
    <div class="footers">
      <div class="footer_but" @click="showPoster">
        分享名片
      </div>
    </div>
    <cardPoster :dataDetail='dataDetail' :posterShow="posterShow" @closeToast="closeToast" ref="poster"></cardPoster>
  </div>
</template>
<script>
  import mixins from "@/mixins/mixin";
  import Clipboard from 'clipboard';
  import {
    setTimeout
  } from 'timers';
  export default {
    mixins: [mixins],
    data() {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        posterShow: false,
        dataDetail: {},
        allShow: false,
        resPicVoList: [],
        imgShowBut: '',
        haveCard: false
      }
    },
    created() {
      this.getUserCard();
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.wrapperScroll.refresh();
        })
      }, 1000)
    },
    computed:{
      callPhone(){
        return 'tel:'+this.dataDetail.phone
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.wrapperScroll.refresh();
      })
    },
    methods: {
      copy () {
        let _this = this
        var clipboard = new Clipboard('.tag-read')
        clipboard.on('success', function () {
         _this.$toast('复制成功');
        })
        clipboard.on('error', function () {
          _this.$toast('复制失败');
        })
      },
      toMap(){
        window.location.href = `http://api.map.baidu.com/marker?location=40.047669,116.313082&title=位置&content=${this.dataDetail.address}&output=html&src=webapp.baidu.openAPIdemo`

      },
      showPoster() {
        if (this.haveCard) {
          this.posterShow = true;
          this.API.addUserCardTransmitRecord({
            userCardId:this.dataDetail.userCardId,
            transmitType:3
          })
        } else {
          this.$confirm({
              title: '提示',
              msg: '你的信息还未完善，快去完善吧！'
            })
            .success(instance => {
              instance.close();
              this.$router.push('/editBusCard');
            })
        }
      },
      isAllShowImg() {
        if (this.allShow) {
          this.allShow = false;
          this.imgShowBut = '展开全部';
          this.resPicVoList = this.dataDetail.resPicVoList.slice(0, 2);
          this.$nextTick(() => {
            this.$refs.wrapperScroll.refresh();
          })
        } else {
          this.resPicVoList = this.dataDetail.resPicVoList;
          this.allShow = true;
          this.imgShowBut = '收齐全部';
          setTimeout(()=>{
               this.$nextTick(() => {
                this.$refs.wrapperScroll.refresh();
              })
          },500)
        }
      },
      getUserCard() {
        this.API.getUserCard().then(res => {
          if (res.success && res.message == "用户已有电子名片") {
            this.haveCard = true;
            this.dataDetail = res.obj;
            this.dataDetail.companyName = JSON.parse(localStorage.getItem('userInfo')).companyName;
            this.$refs.poster.getWXQRCode(this.dataDetail.userCardId);
            if (this.dataDetail.resPicVoList.length > 2) {
              this.allShow = false;
              this.resPicVoList = this.dataDetail.resPicVoList.slice(0, 2);
              this.imgShowBut = '展开全部';
              this.$nextTick(() => {
                this.$refs.wrapperScroll.refresh();
              })
            } else {
              this.resPicVoList = this.dataDetail.resPicVoList;
              this.allShow = true;
              this.$nextTick(() => {
                this.$refs.wrapperScroll.refresh();
              })
            }
            // this.dataDetail.resume=this.dataDetail.resume.split('<--br>');
             this.dataDetail.resume=this.dataDetail.resume.split('<--rzd>');
            this.$nextTick(() => {
              this.$refs.wrapperScroll.refresh();
            })
          }
        })
      },
      closeToast() {
        this.posterShow = !this.posterShow;
      }
    }
  }

</script>
<style scoped lang="scss">
  @import '../../../styles/header.scss';
  @import "./styles/cardDetail.scss";
</style>
