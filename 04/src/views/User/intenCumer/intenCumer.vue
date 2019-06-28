<template>
  <div class="intenCumer" :style="listShow?'background: #f7f7f7;':'background: #fff;'">
    <header :style="listShow?'':'box-shadow: 0px 0.08rem 0.16rem 0px rgba(153, 153, 153, 0.08);border:0;'">
      <i class="icon-left" @click="$router.back()"></i>
      <div class="title">意向客户</div>
    </header>
    <div class="head_tab" v-if="listShow">
      <div class="tab_but" v-for="(item, index) in tab" :key="index">
        <div :style="item.active?'color:#ff6419;':'color:#333;'" @click="selType(item.type, index)">{{item.tit}}</div>
        <span v-if="item.active"></span>
      </div>
    </div>
    <scroll v-if="listShow" class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true"
      :beforeScroll="true" :scrollX="true" :refreshScroll="true" :data="datalist" @scrollToEnd="loadmore" ref="wrapperScroll">
      <div class="box">
        <div class="item" v-for="(item, index) in datalist" :key="index">
          <img :src="item.accessUserHeadPicPath | filterImg" alt="">
          <div class="info">
            <div class="name">
              <span class="name_val">{{item.accessUserName}}</span>
              <span class="date">{{item.gmtModified}}</span>
            </div>
            <div class="tit" v-if="item.operationType==1">获取了你的 <span class="corlorzt">微信</span> ，请留意微信好友申请。</div>
            <div class="tit" v-if="item.operationType==2">获取了你的 <span class="corlorzt">电话号</span> ，请留意手机来电</div>
            <div class="tit" v-if="item.operationType==3">获取了你的 <span class="corlorzt">邮箱</span> ，请留意邮箱邮件</div>
            <div class="tit" v-if="item.operationType==4">获取了你的 <span class="corlorzt">地址</span> ，请留意线下到访</div>
            <div class="tit" v-if="item.operationType==5"><span class="corlorzt">请你联系他</span>，他的手机号是<a class="corlorzt"
                :href="'tel:'+item.contactPhone">{{item.contactPhone}}</a>，
              请尽快联系他。</div>
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
      <div class="tit">暂无意向客户</div>
      <div class="tit">编辑好名片，才能吸引更多意向客户哟</div>
      <div class="empty_but" @click.stop="$router.push('/editBusCard')">去编辑名片</div>
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
        purposeType: 0,
        mark: {
          userAccessId: 0,
          currPage: 1,
          purposeType: 0
        },
        footerShow: false,
        tab: [{
            active: true,
            tit: '全部',
            type: 0
          },
          {
            active: false,
            tit: '强意向',
            type: 2
          }, {
            active: false,
            tit: '一般意向',
            type: 1
          }
        ]
      }
    },
    mounted() {
      if (this.listShow) {
        this.$nextTick(() => {
          this.$refs.wrapperScroll.refresh();
        })
      }
    },
    created() {
      this.mark.userAccessId = this.$route.query.userAccessId;
      this.getaccessoperation();
    },
    methods: {
      selType(type, i) {
        this.tab.map((item, index) => {
          item.active = false;
          if (index == i) {
            item.active = true;
          }
        })
        this.mark.currPage = 1;
        this.footerShow = false;
        this.mark.purposeType = type;
        this.purposeType = type;
        this.API.getaccessoperation(this.mark).then(res => {
          if (res.success && res.datalist.length > 0) {
            this.listShow = true;
            this.datalist = res.datalist;
            this.$nextTick(() => {
              this.$refs.wrapperScroll.refresh();
            })
          } else {
            this.datalist = [];
            this.$toast('暂无相关数据');
          }
        })
      },
      loadmore() {
        this.mark.currPage++;
        this.mark.purposeType = this.purposeType;
        console.log(this.mark)
        this.API.getaccessoperation(this.mark).then(res => {
          if (res.success && res.datalist.length>0) {
            this.datalist = this.datalist.concat(res.datalist);
            this.$nextTick(() => {
              this.$refs.wrapperScroll.refresh();
            })
          } else {
            this.footerShow = true;
          }
        })
      },
      getaccessoperation() {
        this.mark.currPage = 1;
        this.footerShow = false;
        this.API.getaccessoperation(this.mark).then(res => {
          if (res.success && res.datalist.length>0) {
            this.listShow = true;
            this.datalist = res.datalist;
            this.$nextTick(() => {
              this.$refs.wrapperScroll.refresh();
            })
          } else {
            this.listShow = false;
          }
        })
      }
    }

  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/intenCumer.scss';

</style>
