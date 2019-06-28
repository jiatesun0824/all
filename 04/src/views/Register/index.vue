<template>
  <div class="register__container">
    <div class="register__content">
      <div class="register__back">
        <span class="register__back--icon" @click="$router.push('/login')"></span>
        注册
      </div>
      <!--<scroll-->
        <!--:scrollX="true"-->
        <!--:data="roleType">-->
        <!--<div class="box">-->
          <!--<div class="item-icon" v-for="(item, index) in roleType" :key="index" @click="selRole(index)">-->
            <!--<p class="text-center" :style="item.sel? 'color: #fff':'color: #ffb48f'">{{item.name}}</p>-->
            <!--<div class="icon-img-box">-->
                <!--<img :src="item.sel ? item.selimg : item.noselimg" alt="item-icon">-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</scroll>-->
      <div class="banner">
        <swiper class="swiper-wrapper" :options="swiperOption">
          <swiper-slide class="swiper-box" v-for="(item, index) in roleType" :key="index">
            <div class="img-box">
              <img :src="item.selimg">
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="register__form">
        <div class="register__form--item">
          <span class="form__item--icon">
            <span class="form__account--icon"></span>
          </span>
          <input class="form__item--uname" type="text" placeholder="手机号" autocomplete="off" v-model="phoneNumber" maxlength="11" @input="limitNum">
        </div>
        <div class="register__form--item">
          <input class="form__item--code" maxlength="6" type="text" placeholder="验证码" autocomplete="off" v-model="msgCode">
          <button class="form__item--get-code" :class="codeBtnStatus" @click="userGetCode" v-text="codeBtnStatus !== 'count-down' ? '获取验证码' : (countDownNum ? `${countDownNum}s` : '重新获取')"></button>
        </div>
        <div class="register__form--item">
          <span class="form__item--icon">
            <span class="form__password--icon"></span>
          </span>
          <input v-if="!isShowPassword" class="form__item--password" type="password" :placeholder="$route.name === 'register' ? '密码6-16位数字字母组合': '新密码'" autocomplete="off" maxlength="16" v-model="userPassword">
          <input v-else class="form__item--password" type="text" :placeholder="$route.name === 'register' ? '密码6-16位数字字母组合': '新密码'" autocomplete="off" maxlength="16" v-model="userPassword">
          <span class="form__item--icon" @click="isShowPassword = !isShowPassword">
            <span class="form__showpassword--icon" :class="{ show: isShowPassword }"></span>
          </span>
        </div>
        <!--<div class="register__form&#45;&#45;item" v-if="get(find(roleType, {sel: true}), 'type') === 11">-->
          <!--<span class="form__item&#45;&#45;icon">-->
            <!--<span class="form__source&#45;&#45;icon"></span>-->
          <!--</span>-->
          <!--<input class="form__item&#45;&#45;source" type="text" placeholder="请选择所属企业" autocomplete="off" v-model="sourceCompany" @click="selectSourceCompany" readonly>-->
          <!--<span class="form__item&#45;&#45;dir"></span>-->
        <!--</div>-->
        <!--<div class="register__form&#45;&#45;item" v-if="get(find(roleType, {sel: true}), 'type') === 11">-->
          <!--<span class="form__item&#45;&#45;icon">-->
            <!--<span class="form__invite&#45;&#45;icon"></span>-->
          <!--</span>-->
          <!--<input class="form__item&#45;&#45;invite" type="text" placeholder="请输入邀请码" autocomplete="off" v-model="inviteCode">-->
        <!--</div>-->
        <div class="Userprotocol" v-show="activeIndex == 0">
          <img class="UserprotocolBut" :src='sureuserprotocol?sureuserprotocolStyleTrue:sureuserprotocolStyleFalse' @click="sureUserprotocol()" alt="">
          <span class="UserprotocolTit">我已阅读并接受</span>
          <span class="UserprotocolTit" style="color: #ff6419;" @click="$router.push({path:'/Userprotocol',query:{title:'居间服务确认书'}})">《居间服务确认书》</span>
        </div>
        <div class="register__form--item">
          <button class="form__item--submit" :class="{ 'active': isRegister }" @click="userRegister" v-text="$route.name === 'register' ? '注册' : '确定'"></button>
        </div>
      </div>
    </div>
    <awesome-picker
      style="z-index: 1000002"
      ref="sourceCompanyPicker"
      colorConfirm="#ff6419"
      colorCancel="#333333"
      :data="sourceCompanyPickerList"
      @cancel="() => {}"
      @confirm="sureSelectCompany">
    </awesome-picker>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'Vuex'
import mixins from "@/mixins/mixin";
import { get, find } from 'lodash';
let activeIndex = 0;
export default {
  name: 'register',
  mixins: [mixins],
  data() {
    return {
      swiperOption: {
        thet: this,
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        initialSlide: 0, // 默认页面
        // loop: true,
        observer: true,
        observeParents: true,
        coverflowEffect: {
          rotate: 0,
          stretch: 35,
          depth: 100,
          modifier: 1,
          slideShadows: false
        },
        on: {
          transitionEnd() {
          }
        }
      },
      isGetCode: false, // 是否能获取验证码
      codeBtnStatus: '', // 获取验证码button样式
      countDownNum: 0, // 倒计时数字
      countIntervalTimer: '',
      phoneNumber: '', // 账号
      isShowPassword: false, // 是否显示密码
      isRegister: false, // 是否能注册，所有条件成立后，则变成true，即可注册
      sureuserprotocol: true,
      sureuserprotocolStyleTrue: require('../../../static/images/icon_select_sel.png'),
      sureuserprotocolStyleFalse: require('../../../static/images/icon_select_nor.png'),
      roleType: [
        {
          name: '房产中介（经纪人）',
          type: 11,
          sel: true,
          selimg: require('./images/changchanzhongjie2@2x.png')
          // noselimg: require('../../../static/images/registered_def_intermediary_nor.png')
        },
        {
          name: '工长',
          type: 13,
          sel: false,
          selimg: require('./images/gongzhang2@2x.png')
          // noselimg: require('../../../static/images/registered_def_foreman_nor.png')
        },
        {
          name: '装修公司',
          type: 6,
          sel: false,
          selimg: require('./images/zhuangxiugongsi2@2x.png')
          // noselimg: require('../../../static/images/registered_def_construction_nor.png')
        },
        {
          name: '设计师',
          type: 5,
          sel: false,
          selimg: require('./images/shejishi2@2x.png')
          // noselimg: require('../../../static/images/registered_def_decoration_nor.png')
        }
      ],
      sourceCompany: '',
      inviteCode: '',
      activeIndex: 0
    }
  },
  computed: {
    ...mapGetters('register', ['registerInfo', 'sourceCompanyList']),
    msgCode: {
      get() {
        return this.registerInfo.authCode
      },
      set(newValue) {
        this.registerInfo.authCode = newValue
        this.validateRegisterInfo()
      }
    },
    userPassword: {
      get() {
        return this.registerInfo.password
      },
      set(newValue) {
        this.registerInfo.password = newValue
        this.validateRegisterInfo()
      }
    },
    sourceCompanyPickerList() {
      return this.sourceCompanyList.map((item, index) => { return {index, value: item.name}});
    }
  },
  created() {
    this.registerInfo.userType = 11
    this.initSwiper();
  },
  methods: {
    ...mapActions('register', ['checkPhone', 'getCode', 'register', 'resetpw', 'setregisterInfo', 'queryCompanyList']),
    get,
    find,
    initSwiper() {
      let that = this
      this.swiperOption.on.transitionEnd = function() {
        that.activeIndex = this.activeIndex
      }
    },
    sureUserprotocol() {
      // console.log(this.sourceCompanyList.map((item, index) => { return {index, value: item.name}}));
      this.sureuserprotocol = !this.sureuserprotocol;
    },
    selRole(index) {
      this.roleType.map(item=> {
        item.sel = false;
      })
      this.roleType.splice(index, 1, {...this.roleType[index], sel: true});
      this.registerInfo.userType = this.roleType[index].type;
      this.setregisterInfo(this.registerInfo);
      this.validateRegisterInfo();
    },
    limitNum() {
      this.phoneNumber = this.phoneNumber.replace(/[^0-9]/gi, '');
      this.registerInfo.mobile = this.phoneNumber = this.phoneNumber.length > 11 ? this.phoneNumber.slice(0, 11) : this.phoneNumber;
      //
      if (this.phoneNumber.length === 11) {
        this.isGetCode = true
        this.codeBtnStatus = 'active'
        this.countDownNum = 0
        clearInterval(this.countIntervalTimer)
      }
      else {
        this.isGetCode = false
        this.codeBtnStatus = ''
      }
      this.validateRegisterInfo()
    },
    async userGetCode() {
      if(this.isGetCode && !this.countDownNum) {
        if(!/^(13|14|15|16|17|18|19)\d{9}$/.test(this.phoneNumber)){
           return this.$toast('请填写正确的手机号！');
        }
        let { success, message } = await this.checkPhone(this.phoneNumber) || { success: ''};
        if(this.$route.name === 'resetpw') {
          if(success){ return this.$toast(message)}
          if(!success) {
            this.getCode(this.phoneNumber)
            this.countDown()
            this.codeBtnStatus = 'count-down'
          }
        }
        else{
          if(success === false){ return this.$toast(message)}
          if(success) {
            this.getCode(this.phoneNumber)
            this.countDown()
            this.codeBtnStatus = 'count-down'
          }
        }
      }
    },
    countDown() {
      this.countDownNum = 59;
      this.countIntervalTimer = setInterval(() => {
        this.countDownNum--
        if(!this.countDownNum) clearInterval(this.countIntervalTimer)
      }, 1000)
    },
    validateRegisterInfo() {
      if (
      this.phoneNumber.length === 11 &&
      this.msgCode.length === 6 && this.userPassword
      ) {
        this.isRegister = true
      }
      else {
        this.isRegister = false
      }
    },
    async selectSourceCompany() {
      await this.queryCompanyList();
      this.$refs.sourceCompanyPicker.show();
    },
    sureSelectCompany([selectCompany]) {
      console.log(this.sourceCompanyPickerList);
      this.sourceCompany = selectCompany.value; //
    },
    userRegister() {
      this.selRole(this.activeIndex)
      this.sourceCompany = this.roleType[activeIndex].type;
      if(this.registerInfo.userType == 11) {
        if(!this.sureuserprotocol) {
          return this.$toast('请阅读并同意居间服务确认书！！');
        }

        if(!this.sourceCompany) return this.$toast('请选择公司来源！');
      }
      if(this.isRegister) {
        if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.userPassword)) {
          return this.$toast('密码格式不正确，请输入6-16位数字加字母！');
        }
        if(this.$route.name === 'register') {
          return this.register(this.registerInfo.userType == 11 ? {
            sourceCompany: get(find(this.sourceCompanyList, {name: this.sourceCompany}), 'value'),
            invitationCode: this.inviteCode
          } : {})
        }
        this.collectNum(2)
        this.resetpw()
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.registerInfo.mobile = this.phoneNumber = '';
    this.msgCode = '';
    this.userPassword = '';
    clearInterval(this.countIntervalTimer);
    this.$destroy();
    next()
  }
}
</script>

<style lang="scss" scoped>
  .register {
    @at-root #{&}__container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #f7f7f7;
      /*background-image: url(../../../static/images/registered_def_bg.png);*/
      /*background-size: 100% auto;*/
      /*background-repeat: no-repeat;*/
      .box {
        width: 180%;
        margin-left: 100px;
        overflow: hidden;
        .item-icon {
          height: 200px;
          min-width: 210px;
          float: left;
          padding: 30px 40px;
          position: relative;
          .text-center {
            text-align: center;
            font-size: 32px;
            color: #ffb48f;
            margin-bottom: 20px;
          }
          .icon-img-box {
            width: 210px;
            height: 140px;
            position: absolute;
            left: 50%;
            bottom: 40px;
            transform: translateX(-50%);
            margin: 0;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    @at-root #{&}__content {
      /*padding-top: 26px;*/
      .banner{
        margin-bottom: 16px;
        .swiper-wrapper{
          /*width: 625px;*/
          .swiper-box{
            .img-box{
              margin: 0 auto;
              width: 625px;
              position: relative;
            }
          }
        }
      }
    }

    @at-root #{&}__back {
      /*display: flex;*/
      align-items: center;
      height: 88px;
      /*padding-left: 30px;*/
      margin-bottom: 20px;
      line-height: 88px;
      text-align: center;
      color: #333333;
      font-size: 34px;
      position: relative;
      border-bottom: 1px solid #e5e5e5;
      @at-root #{&}--icon {
        position: absolute;
        top: 21px;
        left: 30px;
        display: block;
        width: 45px;
        height: 45px;
        background-image: url('./images/nav_icon_back_black.png');
        background-size: cover;
        background-position: 50% 50%;
      }
    }

    @at-root #{&}__form {
      width: 490px;
      padding: 20px 90px 70px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 1px 2px 30px -10px #aaa;
      .Userprotocol {
        margin-top: 20px;
        .UserprotocolTit {
          font-size: 24px;
          color: #999;
          vertical-align: middle;
        }
        .UserprotocolBut {
          display: inline-block;
          width: 24px;
          height: 24px;
          vertical-align: middle;
          margin-right: 20px;
        }
      }
      @at-root #{&}--item {
        display: flex;
        align-items: center;
        height: 90px;
        overflow: hidden;
        margin-top: 60px;
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
        #{&}--password,
        #{&}--code,
        #{&}--source,
        #{&}--invite {
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

        @at-root #{&}--get-code {
          flex-basis: 180px;
          height: 60px;
          background-color: #fff;
          border: none;
          font-size: 24px;
          color: #999;

          &.active {
            color: #ff6419;
            /*background-color: #ff6419;*/
          }

          &.count-down {
            color: #ff6419;
            /*background-color: #f5f5f5;*/
          }
        }

        @at-root #{&}--dir {
          width: 30px;
          height: 30px;
          background-image: url("./images/registered_icon_more.png");
          background-repeat: no-repeat;
          background-position: 50%;
          background-size: cover;
        }

        @at-root #{&}--submit {
          width: 320px;
          height: 88px;
          margin: 0 auto;
          font-size: 32px;
          color: #fff;
          border: none;
          border-radius: 44px;
          background-image: linear-gradient(#ff6419 0%, #ffa072 100%);
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
          background-image: url("./images/login_icon_eye_dis.png");
          &.show {
            background-image: url("./images/login_icon_eye_nor.png");
          }
        }
      }

      @at-root #{&}__source {
        @at-root #{&}--icon {
          background-image: url("./images/registered_icon_company.png");
        }
      }

      @at-root #{&}__invite {
        @at-root #{&}--icon {
          background-image: url("./images/registered_icon_code.png");
        }
      }
    }
  }
</style>
