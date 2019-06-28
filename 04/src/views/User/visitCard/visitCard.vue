<template>
  <div class="visitCard">
    <header>
      <i class="icon-left" @click="$router.back()"></i>
      <div class="title">名片访问</div>
    </header>
    <scroll v-if="listShow" class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true"
      :beforeScroll="true" :scrollX="true" :refreshScroll="true" :data="datalist" @scrollToEnd="loadmore" ref="wrapperScroll">
      <div class="box">
        <div class="item" v-for="(item, index) in datalist" :key="index">
          <img :src="item.accessUserHeadPicPath | filterImg" alt="">
          <div class="info">
            <div class="name">{{item.accessUserName}}</div>
            <div class="tit">{{item.gmtModified}}查看了您的名片</div>
          </div>

        </div>
        <div v-if="footerShow" style="color:#666;font-size:0.373333rem;height:0.8rem;line-height:0.8rem;text-align:center;">已到底</div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </scroll>
    <div class="empty" v-else>
      <div class="tit">暂无访问，多多分享名片吧</div>
      <div class="empty_but" @click="$router.back()">返回名片页</div>
    </div>
  </div>
</template>
<script>
  import mixins from "@/mixins/mixin";
  export default {
    mixins: [mixins],
    data() {
      return {
        listShow: false,
        datalist: [],
        mark: {
          userAccessId: 0,
          currPage: 1
        },
        footerShow: false
      }
    },
    created() {
      this.mark.userAccessId = this.$route.query.userAccessId;
      this.getaccessrecord();
    },
    mounted() {
      if (this.listShow) {
        this.$nextTick(() => {
          this.$refs.wrapperScroll.refresh();
        })
      }
    },
    methods: {
      loadmore() {
        this.mark.currPage++;
        this.API.getaccessrecord(this.mark).then(res => {
          if (res.success && res.datalist.length > 0) {
            this.datalist = this.datalist.concat(res.datalist);
            this.$nextTick(() => {
              this.$refs.wrapperScroll.refresh();
            })
          } else {
            this.footerShow = true;
          }
        })
      },
      getaccessrecord() {
        this.mark.currPage = 1;
        this.footerShow = false;
        this.API.getaccessrecord(this.mark).then(res => {
          if (res.success &&  res.datalist.length>0) {
            this.listShow = true;
            this.datalist = res.datalist;
            this.$nextTick(() => {
              this.$refs.wrapperScroll.refresh();
            })
          } else {
            this.listShow = false;
          }
        })
      },
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/visitCard.scss';

</style>
