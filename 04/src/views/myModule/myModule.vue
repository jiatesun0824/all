<template>
  <div class="myModule">
      <header>
        <i class="icon-left" @click="$router.go(-1)"></i>
        <div class="title">我的户型</div>
      </header>
      <div class="tabbox">
          <div class="tablist" :class="{'active':item.active}" v-for="(item, index) in tabbox" :key="index" @click="toggle(item)">{{item.title}}</div>
      </div>
    <scroll class="scroller" :pulldown="true" @pulldown="pulldown" :pullup="true" @pullup="loadMore" :data="listData.datalist">
      <ul>
        <li v-for="(item,index) in listData.datalist" :key="index" v-if="!isShow">
          <div class="module-left">
            <img :src="item.pic | filter" alt="" @click="examineImg(item.pic)">
            <div class="module-info">
              <p>{{item.houseName}}</p>
              <p>{{item.houseSpe}} ｜ {{item.houseArea}}㎡</p>
              <p>{{item.livingName}}</p>
            </div>
          </div>
          <div class="module-right" @click="goDecorate(item)">去装修</div>
        </li>
        <div class="noMore" v-if="!isShow">没有更多的数据...</div>
        <div class="noPage" v-if="isShow">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACQCAYAAAB6S+swAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZCNjI2NDUzNTZGRTExRTdCRjRFOUVCODVEMTQ3RThBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZCNjI2NDU0NTZGRTExRTdCRjRFOUVCODVEMTQ3RThBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkI2MjY0NTE1NkZFMTFFN0JGNEU5RUI4NUQxNDdFOEEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkI2MjY0NTI1NkZFMTFFN0JGNEU5RUI4NUQxNDdFOEEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4UItyEAAAPvUlEQVR42uxd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" alt="">
          <p>暂无记录</p>
        </div>
      </ul>
    </scroll>
    <div class="examineImg" v-if="isShowImg" >
      <!--<div class="shut"></div>-->
      <img :src="sureuserprotocolStyleTrue" class="shut" alt="" @click="shut">
      <swiper :options="swiperOption" ref="imgOverview" style="height: 100%;">
        <swiper-slide v-for="(img, index) in imgPic" :key="index">
          <div class="swiper-zoom-container">
            <img :src="img | filter">
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script>
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
  name: 'myModule',
  // components: {
  //   swiper,
  //   swiperSlide
  // },
  data() {
    return {
      sureuserprotocolStyleTrue: require('../../../static/images/release_icon_delete.png'),
        imgPic: [],
        isShowImg: false,
        listData: '',
        curentType: 1, // 当前的类型
        isShow: false, // 是否有数据显示
        pageStr: 1, // 页数
        tabbox: [
          {title: '我的绘制', active: true, type: 1},
          {title: '使用记录', active: false, type: 2}
        ],
        swiperOption: {
          width: window.innerWidth,
          zoom : true,
          initialSlide: 0
        }
    };
  },
  filters: {
    filter(value) {
      return JSON.parse(localStorage.getItem('userInfo')).resourcesUrl + value;
    }
  },
  created() {
    this.pageStr = 1; // 页数重置
    this.$store.state.footerShow = false;
    if (sessionStorage.getItem('curentType') == 2) {
      this.useRecord(this.pageStr);
      this.tabbox[0].active = false;
      this.tabbox[1].active = true;
    } else {
      this.tabbox[0].active = true;
      this.tabbox[1].active = false;
      this.mydrawhouse(this.pageStr);
    }
  },
  methods: {
    shut() {
      this.isShowImg = false;
    },
    examineImg(e) {
      this.imgPic = [e];
      this.isShowImg = true;
    },
    pulldown() {
      if(this.curentType == 1) {
        this.mydrawhouse(this.pageStr);
      }else {
        this.useRecord(this.pageStr);
      }
    },
    mydrawhouse(pageStr) { // 我的绘制
      this.API.mydrawhouse({ pageStr: pageStr, limitStr: 10 }).then(res => {
         if (res.success) {
            this.pageStr == 1 ? this.listData = res : this.listData.datalist = this.listData.datalist.concat(res.datalist);
            this.listData.datalist.length == 0 ? this.isShow = true : this.isShow = false;
         }
      });
    },
    useRecord(pageStr) { // 使用记录
      this.API.houseRecord({ pageStr: pageStr, limitStr: 10 }).then(res => {
        if (res.success) {
          this.pageStr == 1 ? this.listData = res : this.listData.datalist = this.listData.datalist.concat(res.datalist);
          this.listData.datalist.length == 0 ? this.isShow = true : this.isShow = false;
        }
      });
    },
    toggle(item) {
       this.curentType = item.type;
       sessionStorage.setItem('curentType', item.type);
       this.tabbox.map(res => {
         res.active = false;
       });
       item.active = true;
       this.pageStr = 1; // 页数重置
       if (item.type == 1) {
         this.mydrawhouse(this.pageStr);
       } else {
         this.useRecord(this.pageStr);
       }
    },
    loadMore() {
       if (this.isShow) return;
       this.pageStr++;
       if (this.curentType == 1) {
        this.mydrawhouse(this.pageStr);
      } else {
        this.useRecord(this.pageStr);
      }
    },
    goDecorate(item) { // 一键装修item
      this.$store.state.searchPath = 'typechange';
      sessionStorage.setItem('houseId', item.houseId);
      let userId = JSON.parse(localStorage.getItem('userInfo')).id, // 用户id
        start = 0;  // 分页初始位置
      let token = localStorage.getItem('token');
      this.API.getSpaceNameInHouse({
        houseId: sessionStorage.getItem('houseId'),
        msgId: userId,
        limit: 10,
        start: start,
        token: token
      }).then((response) => {
        if (response) {
          if (response.datalist.length === 0) {
            this.$store.commit('popupMsg', '当前户型没有一键装修功能');
            this.$store.commit('showPopup');
          } else {
            sessionStorage.setItem('houseNameArr', response.datalist);
            this.$store.state.initLoad = true;
            this.$router.push({
              path: `/fastDecorate/${item.houseId}`,
              query: {
                fromPage: 'typechange',
                spaceFunctionId: item.spaceFunctionId
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../styles/header.scss';
  @import './styles/myModule.scss'
</style>
