<template>
  <div class="expire">
    <div class="expire__content">
      <span v-if="rmday" v-text="`${userInfo.oldServiceFlag ? '账户' : userInfo.serviceType ? '试用' : '使用'}还剩${remainingDays}天`"></span>
      <span v-else-if="MarkedMessage!=''">{{MarkedMessage}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'Vuex';
export default {
  name: 'expire',
  data() {
    return {
      firstLogin: localStorage.getItem('firstLogin')/1,
      MarkedMessage: '',
      rmday: ''
    }
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    remainingDays() {
      let distanceDay = new Date(new Date(new Date().toLocaleDateString()) - new Date(this.userInfo.loginDay)).getDate();
      this.userInfo.oldServiceFlag ? this.rmday= Math.abs(distanceDay - (this.userInfo.leftTime + 1)) : this.rmday= Math.abs(distanceDay - (this.userInfo.remainingDays + 1));
      return this.userInfo.oldServiceFlag ? Math.abs(distanceDay - (this.userInfo.leftTime + 1)) : Math.abs(distanceDay - (this.userInfo.remainingDays + 1));
    }
  },
  created() {
    // 首次登录套餐赠送提示
    if(this.firstLogin/1 == 1) {
      this.MarkedMessage = localStorage.getItem('MarkedMessage');
    }
    if(this.rmday)  {
      if(this.MarkedMessage!='') {
        setTimeout(()=> {this.rmday=-1},2000)
      }
    }
  }
}
</script>

<style lang="scss">

.expire {
  position: absolute;
  top: 13px;
  right: 60px;

  @at-root #{&}__content {
    padding: 8px;
    font-size: 22px;
    color: #ff004e;
    word-break: keep-all;
    background-color: #fff;
    border-radius: 8px 8px 0 8px;
    box-shadow: 0px 6px 6px 0px rgba(255, 100, 25, 0.55);

    &:after {
      content: '';
      position: absolute;
      right: 0;
      bottom: -6px;
      border: 6px solid transparent;
      border-top-color: #fff;
      border-right-color: #fff;
    }
  }
}

</style>
