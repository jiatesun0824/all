<template>
  <div class="busCard">
    <header>
      <i class="icon-left" @click="$router.push('/user')"></i>
      <div class="title">我的名片</div>
    </header>
    <scroll class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true" :beforeScroll="true"
      :scrollX="true" :refreshScroll="true" ref="wrapperScroll">
    <div class="box">
       <div class="box-header">
         <div class="cardImg"><img src="./images/cardImg.png" alt=""></div>
         <div class="info" @click="$router.push('/cardDetail')" ref="shareImage">
           <i class="ic_edit" @click.stop="$router.push('/editBusCard')"></i>
           <div class="port">
             <img v-if="dataDetail.userHeadPicPath" :src="dataDetail.userHeadPicPath | filterImg" alt="">
             <img v-else src="./images/Head portrait@2x.png" alt="">
           </div>
           <div class="name" :style="dataDetail.userName?'color:#333':'color:#999'">
             <span class="name_val">{{dataDetail.userName?dataDetail.userName:'姓名'}}</span>
             <span class="post">{{dataDetail.companyPost?dataDetail.companyPost:'职位'}}</span>
             <!--<span class="edit_but">-->
             <!--<img src="./images/icon-bianji@2x.png" alt="">-->
             <!--<span @click.stop="$router.push('/editBusCard')">编辑</span>-->
             <!--</span>-->
           </div>
           <!-- <div class="job" :style="dataDetail.companyPost?'color:#333':'color:#999'">
             {{dataDetail.companyPost?dataDetail.companyPost:'职位'}}
           </div> -->
           <div class="phone" style="color:#666">
              <img class="x-icon" src="./images/iconCard_phone.png" alt=""><span class="item_value">{{dataDetail.phone?dataDetail.phone:'暂无电话'}}</span>
           </div>
           <div class="company" style="color:#666">
            <img class="x-icon" src="./images/iconCard_company.png" alt=""> <span class="item_value">{{dataDetail.companyName?dataDetail.companyName:'暂无公司'}}</span>
           </div>
           <div class="company" style="color:#666">
            <img class="x-icon" src="./images/iconCard_sig.png" alt=""> <span class="item_sig">{{dataDetail.signature?dataDetail.signature:'暂无签名'}}</span>
           </div>
           <!--<div class="box">-->
           <!--<div class="box_item">-->
           <!--<img src="./images/icon-MPdianhu@2x.png" alt=""> <span :style="dataDetail.phone?'color:#666':'color:#999'">-->
           <!--{{dataDetail.phone?dataDetail.phone:'暂无电话'}}</span>-->
           <!--</div>-->
           <!--<div class="box_item">-->
           <!--<img src="./images/icon- MPyouxiang@2x.png" alt=""> <span :style="dataDetail.email?'color:#666':'color:#999'">-->
           <!--{{dataDetail.email?dataDetail.email:'暂无邮箱'}}</span>-->
           <!--</div>-->
           <!--<div class="box_item">-->
           <!--<img src="./images/icon-MPdizhi@2x.png" alt=""> <span :style="dataDetail.address?'color:#666':'color:#999'">{{dataDetail.address?dataDetail.address:'暂无地址'}}</span>-->
           <!--</div>-->
           <!--</div>-->
         </div>
         <div class="footer">
           <div class="footer_but" @click="showPoster">
             分享名片
           </div>
         </div>
       </div>
      <div class="tab">
        <div class="tab_item" @click.stop="gointenCumer">
          <div class="itemimg_box">
            <img src="./images/icon-yixiangkehu @2x.png" alt="">
            <div class="num_tit" v-if="cardOptNum>0">{{cardOptNum>99?'99+':cardOptNum}}</div>
          </div>
          <div>意向客户</div>
        </div>
        <div class="tab_item" @click.stop="govisitCard">
          <div class="itemimg_box">
            <img src="./images/icon-mingkefangwen@2x.png" alt="">
            <div class="num_tit" v-if="cardComeNUm>0">{{cardComeNUm>99?'99+':cardComeNUm}}</div>
          </div>
          <div>名片访客</div>
        </div>
      </div>
      <div class="data_title">访问数据</div>
      <div class="data_box">
        <div class="data_item" v-if="haveCard">
          <div class="fl data_item_tit">今日访问总次数</div>
          <div class="fr data_item_val">{{AccessCount.todayAccessCount}}</div>
        </div>
        <div class="data_item" v-if="haveCard">
          <div class="fl data_item_tit">今日访问总人数</div>
          <div class="fr data_item_val">{{AccessCount.todayAccessUserCount}}</div>
        </div>
        <div class="data_item" v-if="haveCard">
          <div class="fl data_item_tit">累计访问总次数</div>
          <div class="fr data_item_val">{{AccessCount.accessCount}}</div>
        </div>
        <div class="data_item" v-if="haveCard">
          <div class="fl data_item_tit">累计访问总人数</div>
          <div class="fr data_item_val">{{AccessCount.accessUserCount}}</div>
        </div>
        <div class="empyt" v-if="!haveCard">暂无访问数据，赶紧去完善信息并分享吧</div>

        <div style="height:200px"></div>
      </div>
    </div>
    </scroll>
    <!--<div class="footer">-->
        <!--<div class="footer_but" @click="showPoster">-->
          <!--转发名片-->
        <!--</div>-->
      <!--</div>-->
    <cardPoster :dataDetail='dataDetail' :posterShow="posterShow" @closeToast="closeToast" ref="poster"></cardPoster>
  </div>
</template>
<script>
  import mixins from "@/mixins/mixin";
  import html2canvas from 'html2canvas'
  import {
    mapActions,
    mapGetters
  } from 'Vuex';
  export default {
     mixins: [mixins],
    data() {
      return {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        haveCard: false,
        dataDetail: {},
        posterShow: false,
        AccessCount: {},
        posterImageUrl: '',
        isCard: true,
        posterImgShow: false,
        shareBgShow: false
      }
    },
    computed: {
      ...mapGetters('socket', ['cardOptNum', 'cardComeNUm'])
    },
    created() {
      this.getUserCard();
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.wrapperScroll.refresh();
      })
    },
    methods: {
      showPoster(){
        if(this.haveCard) {
          this.posterShow= true;
          this.API.addUserCardTransmitRecord({
            userCardId:this.dataDetail.userCardId,
            transmitType:3
          })
        }else {
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
      govisitCard(){
        if(this.haveCard) {
          this.$router.push({path:'/visitCard',query:{userAccessId:this.dataDetail.userCardId}});
        }else {
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
      gointenCumer(){
        if(this.haveCard) {
          this.$router.push({path:'/intenCumer',query:{userAccessId:this.dataDetail.userCardId}});
        }else {
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
      closeToast() {
        this.posterShow = !this.posterShow;
      },
      getUserCard() {
        this.API.getUserCard().then(res => {
          if (res.success && res.message == "用户已有电子名片") {
            this.haveCard = true;
            this.dataDetail = res.obj;
            this.dataDetail.companyName = JSON.parse(localStorage.getItem('userInfo')).companyName;
            this.$refs.poster.getWXQRCode(this.dataDetail.userCardId)
            this.API.getAccessCount(this.dataDetail.userCardId).then(res => {
              if (res.success) {
                this.AccessCount = res.obj;
              }
            })
          }
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/busCard.scss';

</style>
