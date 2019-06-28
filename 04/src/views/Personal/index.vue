<template>
  <div class="personal">
    <div class="personal-wrapper">
      <div class="personal-account" v-if="intergralHeader">
        <div class="company-box" v-show="showCompanyBtn" @click="toCompanySelectPage">
          <div class="company-icon"></div>
          <span class="company-text">企业切换</span>
        </div>

        <div class="headImg"><p class="img"></p></div>
        <div class="account">
          {{personalAccount}}
          <i class="meal-label" v-if="mealLabel == '1' || mealLabel == '2' || mealLabel == '3' || mealLabel == '4'" v-text="mealLabelContent"></i>
        </div>
        <div class="text"><span>{{integral}}</span> <b>积分</b><i class="arrowImg"  @click="toAccount"></i></div>
      </div>
      <div class="wrapper">
        <div class="extra item" @click.stop="toMyModule(item)" v-for="(item,index) in centerList" :key="index">
          <div class="text">{{item.name}}</div>
          <div class="sign"></div>
          <div class="dot" v-show="showDot && index === 2"></div>
        </div>
        <div style="height: 0.2rem"></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState } from 'Vuex';

  export default {
    data() {
      return {
        showCompanyBtn: false, // 显示企业筛选按钮
        centerList: [],
        page: 0,
        personalAccount: 0,
        integral: null,
        messageTimer: null,
        mealLabel: '0' // 套餐标签 默认0没有权限 1：送3个月免费渲染权限 2：包月 3:包年  4: 包月
      };
    },
    created() {},
    activated() {
      let menu = JSON.parse(localStorage.getItem('menu'));
      this.centerList = menu.subMenuList[3].subMenuList;
      if (this.$route.path == '/personal') {
        this.$store.state.intergralHeader = true;
      }
      this.getIntegral();
      this.personalAccount = localStorage.getItem('mobile');
      let limit = 10,
        start = 0;  // 分页初始位置
      let pageStart = start + limit * this.page; // 上拉加载分页起始位置
      this.alreadyAppear = pageStart;
      if (localStorage.getItem('companyList')) {
        this.showCompanyBtn = true;
      } else {
        this.showCompanyBtn = false;
      }
      console.log(this.showCompanyBtn, localStorage.getItem('companyList'));
    },
    methods: {
      toCompanySelectPage() {
        if (localStorage.getItem('isLogin') === 'yes') {
          this.$store.commit('popupMsg', '账号信息已更新，请重新登录');
          this.$store.commit('showPopup');
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
          return;
        }
        this.$store.commit('showComComponents', false);
        this.$router.push('/company');
      },
      toMyModule(item) {
        this.$store.state.intergralHeader = false;
        this.$store.commit('showComComponents', false);
        let code = item.name;
        if (code === '我的任务') {
          this.$router.push('/personal/replace');
          this.$store.state.loadingFlag = true;
        } else if (code === '我的收藏') {
          this.$router.push('/personal/collect');
        } else if (code === '我的消息') {
          this.$router.push('/personal/news');
          this.$store.state.showDot = false;
        } else if (code === '设置') {
          this.$router.push('/personal/set');
        }
      },
      getIntegral() { // 实时获取积分
        this.$store.dispatch('cancelLoader');
        this.API.integralShow({
          account: localStorage.getItem('userName'),
          password: localStorage.getItem('pwd')
        }).then((res) => {
          if (res) {
            this.$store.dispatch('setLoader');
            this.integral = Math.floor(res.obj.balanceIntegral);
            this.mealLabel = res.obj.state;
            localStorage.setItem('balanceAmount', res.obj.balanceIntegral);
            localStorage.setItem('consumAmount', res.obj.consumAmount);
          }
        });
      },
      toAccount() {
        this.$store.state.intergralHeader = false;
        this.$store.commit('showComComponents', false);
        this.$router.push('/personal/account');
      }
    },
    computed: mapState({
      mealLabelContent() {
        let state = this.mealLabel;
        let label;
        switch (state) {
          case '1' : label = '免费'; break;
          case '2' : label = '包月'; break;
          case '3' : label = '包年'; break;
          case '4' : label = '包月'; break;
          default : label = ''; break;
        }
        return label;
      },
      showDot: state => state.showDot,
      intergralHeader: state => state.intergralHeader
    })
  };
</script>

<style lang="scss" scoped>
@import "~styles/mixin.scss";
.header {
  display: none;
}

.personal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
}

.personal-wrapper {
  position: absolute;
  top: 88px;
  bottom: 0;
  width: 100%;
  background: #eeeeee;
  font-size: 30px;
  color: #494949;
}

.personal-wrapper .personal-account {
  width: 100%;
  height: 468px;
  margin-bottom: 24px;
  margin-top: -88px;
  position: relative;
  z-index: 999;
  background-image: url("./images/me_user_bg@2x.png");
  background-position: center center;
  background-size: 100% 100%;
  padding: 0 30px;
}

.personal-wrapper .personal-account .headImg {
  text-align: center;
  margin-bottom: 18px;
}

.personal-wrapper .personal-account .headImg .img {
  display: inline-block;
  margin-top: 94px;
  height: 148px;
  width: 148px;
  background-image: url("./images/me_icon_user_148@2x.png");
  background-position: center center;
  background-size: 100% 100%;
  width: 148px;
}

.personal-wrapper .personal-account .text {
  text-align: center;
  padding-top: 20px;
}

.personal-wrapper .personal-account .text span {
  font-size: 40px;
  color: #ff6419;
}

.personal-wrapper .personal-account .text b {
  color: #999;
  font-size: 28.000000000000004px;
  font-weight: normal;
  vertical-align: 5px;
}

.personal-wrapper .personal-account .text .arrowImg {
  display: inline-block;
  margin-left: 10px;
  width: 28.000000000000004px;
  height: 28.000000000000004px;
  background-image: url("./images/me_score_icon_more@2x.png");
  background-position: center center;
  background-size: 100% 100%;
}

.personal-wrapper .personal-account .account {
  text-align: center;
  font-size: 32px;
  color: #333;
}

.personal-wrapper .personal-account .account .meal-label {
  display: inline-block;
  width: 60px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  background-color: #ff6419;
  border-radius: 14.000000000000002px;
}

.personal-wrapper .personal-account .company-box {
  position: absolute;
  right: 24px;
  top: 30px;
}

.personal-wrapper .personal-account .company-box .company-icon {
  margin: 0 auto;
  width: 48px;
  height: 48px;
  background-image: url("./images/me_icon_company.png");
  background-size: 48px 48px;
}

.personal-wrapper .personal-account .company-box .company-text {
  font-size: 20px;
  color: #333;
}

.personal-wrapper .wrapper .item {
  position: relative;
  background: #fff;
  height: 88px;
  line-height: 88px;
  padding: 0 30px;
}

.personal-wrapper .wrapper .item:nth-child(6) {
  margin-top: 20px;
}

.personal-wrapper .wrapper .extra {
  border-bottom: 1px solid #eeeeee;
}

.personal-wrapper .wrapper .extra .text {
  float: left;
}

.personal-wrapper .wrapper .extra .dot {
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: red;
  float: left;
  margin: 35px 30px;
}

.personal-wrapper .wrapper .extra .integral {
  float: left;
  margin-right: 30px;
  color: #ff6419;
}

.personal-wrapper .wrapper .extra .sign {
  position: absolute;
  top: 33px;
  right: 30px;
  width: 14.000000000000002px;
  height: 22px;
  background-size: 14.000000000000002px 22px;
  background-image: url("./images/right_nor.png");
  transform: rotate(180deg);
}
</style>
