<template>
  <div class="login__container">
    <div class="login__content">
      <div class="login__form">
        <div class="login__form--item">
          <span class="form__item--icon">
            <span class="form__account--icon"></span>
          </span>
          <input class="form__item--uname" type="text" placeholder="手机号/账户名" autocomplete="off"  v-model="account" @input="limitNum">
        </div>
        <div class="login__form--item">
          <span class="form__item--icon">
            <span class="form__password--icon"></span>
          </span>
          <input v-if="!isShowPassword" type="password" class="form__item--password" autocomplete="off" placeholder="******" maxlength="16" v-model="password">
          <input v-else class="form__item--password" type="text" placeholder="******" autocomplete="off" maxlength="16" v-model="password">
          <span class="form__item--icon" @click="isShowPassword = !isShowPassword">
            <span class="form__showpassword--icon" :class="{ show: isShowPassword }"></span>
          </span>
        </div>
        <div class="login__form--forget">
          <span @click="changePwd">忘记密码？</span>
        </div>
        <div class="login__form--item">
          <button class="form__item--submit" :class="{ 'active': isLogin }" @click.self="login">登录</button>
        </div>
      </div>
      <!--<div class="login__guide">-->
        <!--还没有一个账户？-->
        <!--<a class="login__guide&#45;&#45;to-register" @click="$router.push('/register')">去注册</a>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'Vuex'
import { setTimeout } from 'timers';
import minix from "@/mixins/mixin";
export default {
  name: 'login',
  mixins:[minix],
  data() {
    return {
      isShowPassword: false,
      // account: '',
      loginOk: true,
    }
  },
  computed: {
    ...mapGetters('login', {
      loginAccount: 'account',
      loginPassword: 'password'
    }),
    account: {
      get() {
        return this.loginAccount;
      },
      set(newValue) {
        this.getAccount(newValue)
      }
    },
    password: {
      get() {
        return this.loginPassword;
      },
      set(newValue) {
        this.getPassword(newValue)
      }
    },
    isLogin() {
      return !!this.account && !!this.password;
    }
  },
  created() {
    // 页面首次打开刷新一下，去除每次返回进入登录页面的BUG开始
    localStorage.setItem('hehe', 1)
    // 页面首次打开刷新一下，去除每次返回进入登录页面的BUG结束
  },
  mounted(){
    let self=this;
      window.onpopstate = function () { //监听浏览器事件
          self.$router.push('/login');
      }
  },
  methods: {
    ...mapActions('login', {
      getAccount: 'getAccount',
      getPassword: 'getPassword',
      userLogin: 'login',
    }),
    changePwd() {
      this.$router.push({
                 path:'/changepwd',
                 query: {
                     phone: 1
                 }
             })
    },
    limitNum() {
      // this.account = this.account.replace(/[^\d]/gi, '');
      // this.account = this.account.length > 11 ? this.account.slice(0, 11) : this.account;
      // this.getAccount(this.account);
      // this.validate();
    },
    async login() {
      if(this.isLogin && this.loginOk) {
        // if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,16}$/.test(this.password)) {
        //   return this.$toast('请输入4位以上字母数字组合密码！');
        // }
        this.loginOk = false;
        setTimeout(()=> {
          this.loginOk = true;
        },500)
        let status = await this.userLogin();
        console.log(status)
        if(status) {
         this.collectNum(3);
        }

        status && this.$router.push('/');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    @at-root #{&}__container {
      height: 101%;
      background-image: url(./images/login_bg_logo.png);
      background-size: 100% auto;
      background-repeat: no-repeat;
    }

    @at-root #{&}__content {
      padding-top: 391px;
      height: 100%;
      box-sizing: border-box
    }

    @at-root #{&}__form {
      width: 490px;
      padding: 20px 90px 70px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 1px 2px 30px -10px #aaa;

      @at-root #{&}--item {
        display: flex;
        align-items: center;
        height: 90px;
        overflow: hidden;
        margin-top: 45px;
        &:not(:nth-last-of-type(1)) {
          border-bottom: 1px solid #ccc; /*no*/
        }
      }

      @at-root #{&}--forget {
        font-size: 28px;
        color: #333;
        padding: 30px 0 20px;
        text-align: right;
      }
    }

    @at-root .form {
      @at-root #{&}__item {

        @at-root #{&}--uname,
        #{&}--password {
          flex: 1 1 auto;
          width: 100%;
          height: 100%;
          font-size: 30px;
          border: none;
          box-sizing: border-box;
        }

        @at-root #{&}--icon {
          font-size: 0;
          &:not(:nth-of-type(2)) {
            margin-right: 30px;
          }

          span {
            display: inline-block;
            width: 50px;
            height: 50px;
            background-position: 50% 50%;
            background-size: cover;
          }
        }

        @at-root #{&}--submit {
          width: 320px;
          height: 88px;
          margin: 0 auto;
          text-align: center;
          font-size: 32px;
          color: #fff;
          border: none;
          border-radius: 44px;
          background-image: linear-gradient(-90deg, #ff6419 0%, #ffa072 100%);
          background-blend-mode: normal;
          letter-spacing: 15px;
          filter: saturate(5%);

          &.active {
            filter: saturate(100%);
          }
        }
      }

      @at-root #{&}__account {
        @at-root #{&}--icon {
          background-image: url("./images/login_icon_account.png");
        }
      }

      @at-root #{&}__password {
        @at-root #{&}--icon {
          background-image: url("./images/login_icon_password.png");
        }
      }

      @at-root #{&}__showpassword {
        @at-root #{&}--icon {
          background-image: url("./images/login_icon_eye_nor.png");
          &.show {
            background-image: url("./images/login_icon_eye_dis.png");
          }
        }
      }
    }

    @at-root #{&}__guide {
      margin-top: 120px;
      text-align: center;
      font-size: 28px;
      color: #333;

      @at-root #{&}--to-register {
        display: inline-block;
        width: 120px;
	      height: 40px;
        line-height: 40px;
        margin-left: 10px;
        color: #ff6419;
	      border: solid 2px #e8e8e8;
        border-radius: 20px;
      }
    }
  }
</style>
