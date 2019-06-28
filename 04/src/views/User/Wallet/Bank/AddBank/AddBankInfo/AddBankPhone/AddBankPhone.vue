<template>
  <div class="addbankphone">
      <header>
			<i class="icon-left" @click="$router.go(-1)"></i>
			<div class="title">验证手机号</div>
	  </header>
      <div class="tit">
          绑定银行卡需要短信确认， 请按提示操作
      </div>
      <div class="box">
          <input v-model="authCode" class="inpu" placeholder="请输入验证码" type="number"> <div @click="getcode" class="getcode">{{codetit}}</div>
      </div>
      <div class="nextbox">
          <span class="next" @click="next">下一步</span>
      </div>
  </div>
</template>
<script>
import { getsms } from 'api/user';
import { mapGetters, mapMutations, mapActions } from 'Vuex';
export default {
    // 验证银行卡手机号
  data() {
      return {
        // 获取验证码按钮
        codetit:'获取验证码',
        i:60,

        authCode: ''
      }
  },
  methods: {
    next() {
      this.API.checkCode(this.authCode, this.$route.query.bankdata.preMobile).then(res=> {
        if(res.status) {
          this.API.bindbank(this.$route.query.bankdata).then(res=> {
            if(res.status) {
              this.$toast("绑定成功");
              this.$router.go(-3);
            }else {
              this.$toast(res.message);
            }
          })
        }else {
          this.$toast("验证码错误");
        }
      })
    },
    getcode() {
      if(this.i == 60 && this.codetit == '获取验证码') {
        var i=this.i;
        var that=this;
        var time = setInterval(function () {
          i--;
          that.codetit=i+'s';
          if (i< 1) {
            clearInterval(time)
            that.codetit="获取验证码";
            that.i=60;
          }
        }, 1000)
        var data = {
            phoneNumber: this.$route.query.bankdata.preMobile,
            functionType: 2
          };
          getsms(data).then(res => {
            if (res.status) {
              this.$toast("验证码发送成功");
            }
          });
      }
    }
  }
}
</script>
<style lang="scss" scoped>
     @import '../../../../../../../styles/header.scss';
    @import './styles/addBankPhone.scss';
</style>


