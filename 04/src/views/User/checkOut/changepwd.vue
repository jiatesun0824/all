<template>
    <div class="changepwd">
        <header>
            <i class="icon-left" @click="$router.go(-1)"></i>
            <div class="title">修改密码</div>
        </header>
        <div class="main">
            <div class="item bgeo" v-if="queryPhone!=''">
               {{loginPhone}}
            </div>
            <div class="item" v-if="queryPhone===''">
                <input v-model="loginPhone" style="width: 100%;" maxlength="10"  class="codeinpu" type="number" placeholder="请输入手机号">
            </div>
            <div class="item">
                <input v-model="code" maxlength="10"  class="codeinpu" type="number" placeholder="请输入验证码"> <span @click="getCode" class="codebut">{{codetit}}</span>   <span class="spbg"></span>
            </div>
            <div class="item">
                <input v-model="pwd" class="codeinpu" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"  minlength="8" maxlength="16" type="password" placeholder="请设置新密码">
            </div>
            <div @click="submit" class="but" :style="isSubmit ? 'background:#ff6419;' : 'background: #e0e0e0;'">
                提交
            </div>
        </div>
    </div>
</template>
<script>
import { getsms, updatePwdBak } from "@/api/user";
import { resetpw } from "@/api/register";
import { mapActions } from 'Vuex';
import md5 from "utils/md5";
const pwdtest = /^[0-9a-zA-Z]{6,16}$/;
export default {
  data() {
    return {
      loginPhone: "",
      codetit: "获取验证码",
      i: 60,
      code: "",
      pwd: "",
      queryPhone: '',
    };
  },
  created() {
    if(this.$route.query.phone/1 != 1) {
      this.queryPhone = this.$route.query.phone;
      this.loginPhone = this.$route.query.phone;
    }
  },
  computed: {
    isSubmit() {
      return this.code && pwdtest.test(this.pwd);
    }
  },
  methods: {
    ...mapActions('login', ['getPassword']),
    getCode() {
      var i = this.i;
      if (this.codetit == "获取验证码") {
        var that = this;
        var time = setInterval(function() {
          i--;
          that.codetit = i + "s";
          if (i < 1) {
            clearInterval(time);
            that.codetit = "获取验证码";
            that.i = 60;
          }
        }, 1000);
        var data = {
          phoneNumber: this.loginPhone,
          functionType: 1
        };
        getsms(data).then(res => {
          if (res.success) {
            this.$toast("验证码发送成功");
          }
        });
      }
    },
    submit() {
      if (this.isSubmit) {
        if (pwdtest.test(this.pwd)) {
          var btnform = new FormData();
          btnform.append('mobile', this.loginPhone);
          btnform.append("authCode", this.code);
          btnform.append("newPassword", md5(md5("WeB" + this.pwd)));
          var data = {
              mobile: this.loginPhone,
              authCode: this.code,
              newPassword: md5(md5("WeB" + this.pwd))
            }
            resetpw(data).then(async res =>{
              if (res.success) {
                this.getPassword(this.pwd);
                localStorage.setItem('pwd', md5(md5("WeB" + this.pwd)));
                localStorage.setItem('rememberPassword', window.btoa(this.pwd));
                await this.$toast("修改成功");
                this.$router.go(-1);
              } else {
                this.$toast(res.message);
              }
            })
          // if(this.queryPhone === "") {
          //   var data = {
          //     mobile: this.loginPhone,
          //     authCode: this.code,
          //     newPassword: md5(md5("WeB" + this.pwd))
          //   }
          //   resetpw(data).then(res =>{
          //     if (res.success) {
          //       this.$toast("修改成功");
          //       this.$router.go(-1);
          //       localStorage.setItem('pwd', md5(md5("WeB" + this.pwd)));
          //     } else {
          //       this.$toast(res.message);
          //     }
          //   })
          // }else {
          //    this.API.modify2BUserMobileAndPassword(btnform).then(res => {
          //     if (res.success) {
          //       this.$toast("修改成功");
          //       this.$router.go(-1);
          //       localStorage.setItem('pwd', md5(md5("WeB" + this.pwd)));
          //     } else {
          //       this.$toast(res.message);
          //     }
          //   });
          // }
        } else {
          this.$toast("密码格式不正确，请输入6-16位数字加字母");
        }
      }
    }
  }
};
</script>
<style lang="sass" scoped>
   @import '../../../styles/header.scss'
   @import 'changepwd.scss'
</style> 