<template>
  <div class="house__container" @touchmove.prevent>
    <div class="house__header">
      <span>户型</span>
    </div>
    <div class="house__type" v-if="isIntermediary != 11">
      <span class="house__type--item" :class="{active: $route.name === 'area'}" @click="toArea">搜索小区</span>
      <span class="house__type--item" :class="{active: $route.name === 'space'}" @click="toSpace">搜索空间</span>
    </div>
    <div class="house__content">
      <router-view></router-view>
    </div>
    <limitAlert v-if="limitAlertShow" @skt="skt"></limitAlert>
    <skt v-if="sktShow"></skt>
  </div>
</template>

<script>
export default {
  name: 'house-type',
  data() {
    return {
      isIntermediary: JSON.parse(localStorage.getItem('userInfo')).userType,
      limitAlertShow:false,
       // VIP申请开通成功
      sktShow: false
    };
  },
  created() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(JSON.parse(sessionStorage.getItem('sktShow'))) {
      this.sktShow = true;
    }else if(userInfo.userType == 5 && userInfo.maturityFlag && userInfo.serviceType==1) {
      this.limitAlertShow = true;
    }
  },
  methods: {
    skt() {
      this.API.applyFormal().then(res=> {
        if(res.success) {
          this.sktShow = true;
          this.limitAlertShow = false;
          sessionStorage.setItem('sktShow', JSON.stringify(this.sktShow));
        }
      })
    },
    toArea() {
      if(this.$route.name !== 'area') {
        if(this.$route.query.planId) {
          this.$router.push({name: 'area', query: {planId: this.$route.query.planId}});
        }
        else {
          this.$router.push('/search/area');
        }
      }
    },
    toSpace() {
      if(this.$route.name !== 'arespacea') {
        if(this.$route.query.planId) {
          this.$router.push({name: 'space', query: {planId: this.$route.query.planId}});
        }
        else {
          this.$router.push('/search/space');
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .house {

    @at-root #{&}__container {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #f5f5f5;
    }

    @at-root #{&}__header {
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 88px;
      font-size: 36px;
      box-sizing: border-box;
      background-color: #fff;
      border-bottom: 1px solid #ddd;
    }

    @at-root #{&}__type {
      flex: 0 0 auto;
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      //border-top: 1px solid #ddd;/*no*/
      //border-bottom: 1px solid #ddd;/*no*/
      background-color: #fff;
      position: relative;
      &:after{
          content: '';
          display: block;
          width: 4px;
          height: 24px;
          background-color: #e8e8e8;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -1px;
        margin-top: -12px;
      }
      @at-root #{&}--item {
        height: 88px;
        line-height: 88px;
        font-size: 30px;
        box-sizing: border-box;
        flex: 1;
        text-align: center;
        &.active {
          color: #ff6419;
          //border-bottom: 2px solid #ff6419; /*no*/
        }
      }
    }

    @at-root #{&}__content {
      flex: 1;
      position: relative;
      // background-color: #fff;
    }
  }
</style>
