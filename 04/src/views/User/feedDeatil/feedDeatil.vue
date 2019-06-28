<template>
  <div class="feedDeatil">
    <header>
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">反馈详情</div>
    </header>
    <scroll class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true" :beforeScroll="true"
      :scrollX="true" :refreshScroll="true" :data="dataDetail" ref="wrapperScroll">
      <div class="box">
        <div class="head">
          <div class="left">{{dataDetail.gmtCreate}}</div>
          <div class="right" :style="dataDetail.dealStatus!=0?'color:#88cc66':'color:#999'">{{dataDetail.dealStatus!=0?'已回复':'未回复'}}</div>
        </div>
        <div class="detail">
         {{dataDetail.feedbackContent}}
        </div>
        <div class="imgBox">
          <img :src="item.resPath | filterImg" @click="preView(index)" v-for="(item, index) in dataDetail.feedbackPicPath" :key="index" alt="">
        </div>
        <div class="backDetail" v-if="dataDetail.dealStatus!=0">
          <div class="backDetail_title">回复内容</div>
          <div class="backDetail_val">
           {{dataDetail.replyContent}}
          </div>
          <div class="date">{{dataDetail.gmtReply}}</div>
        </div>
        <div class="comment" v-if="dataDetail.dealStatus==1&&dataDetail.estimate!=0&&dataDetail.estimate!=1">
          <div class="comment_title">请问您对我们的回复结果满意吗？</div>
          <div class="comment_but">
            <div style="padding: 1px;">
              <div @click="eval(0)">满意</div>
            </div>
            <div style="padding: 1px;">
              <div @click="eval(1)">不满意</div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="swiperbox" v-if="preViewShow" @click.stop="preViewShow = false">
      <swiper class="swiper-wrapper" :options="swiperOption" ref="bannerSwiper">
        <swiper-slide class="swiper-box" v-for="(item, index) in dataDetail.feedbackPicPath" :key="index">
          <div class="banner-box">
            <img :src="item.resPath | filterImg">
          </div>
        </swiper-slide>
      </swiper>
    </div>
     <div class="toast" v-if="commentShow">
            <img src="./images/pop_icon_mile.png" alt="">
            <div>感谢您的反馈</div>
        </div>
  </div>
</template>
<script>
  import mixins from '@/mixins/mixin'
import { setTimeout } from 'timers';
  export default {
    mixins: [mixins],
    data() {
      return {
        dataDetail:{}, // 反馈详情
        preViewShow: false, // 图片预览
        HavecommentShow: true,// 回复点评显示
        commentShow: false, // 评价成功提示
        swiperOption: { // 预览显示
          initialSlide: 0, //默认页面
          pagination: {
            el: '.swiper-pagination'
          }
        }
      }
    },
    created() {
      // 获取详情
      this.API.feedbackDetail(this.$route.query.feedbackId).then(res=>{
        if(res.success) {
          this.dataDetail = res.obj;
        }
      })
    },
    methods: {
      // 评价
      eval(type) {
        let data = {
          "estimate": type,
          "id": this.$route.query.feedbackId
        }
        this.API.feedbackEstimate(data).then(res=> {
          if(res.success) {
            this.commentShow = true;
            setTimeout(()=> {
              this.commentShow = false;
              this.API.feedbackDetail(this.$route.query.feedbackId).then(res=>{
                if(res.success) {
                  this.dataDetail = res.obj;
                }
              })
            },2000)
          }
        })
      },
      // 预览
      preView(index) {
          this.preViewShow = true;
          this.swiperOption.initialSlide = index;
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/feedDeatil.scss';

</style>
