<template>
    <div class="company">
      <div class="company-header">
        <div class="arrow" @click="goback"></div>
        <span class="company-title">选择您要进入的企业</span>
      </div>
      <scroll
        class="company-wrappper"
        :data="data"
        :beforeScroll="beforeScroll"
        ref="companyEl"
      >
        <div class="company-box">
          <div class="company-item" 
            v-for="(item, index) in data" 
            :class="{'active': curIndex === index}" 
            @click="selectCompany(item, index)"
            :key="index"
          >
            <img class="company-logo" v-lazy="resourcesUrl + item.logoPath">
            <div class="company-name">{{item.name}}</div>
          </div>
        </div>
      </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapState } from 'Vuex';
import { bus } from "api/api.js";
import { setTimeout } from 'timers';
import { debounce } from 'lodash';
export default {
  data() {
    return {
      beforeScroll: true,
      data: [],
      curIndex: -1 // 当前品牌
    };
  },
  activated() {
    if (localStorage.getItem("companyList")) {
      this.data = JSON.parse(localStorage.getItem("companyList"));
    }
  },
  methods: {
    ...mapMutations('common', ['SET_TOKEN', 'SET_USER_INFO']),
    selectCompany: debounce(function(item, index) {
      let loginCompanyId = item.id;
      let userName = localStorage.getItem("userName");
      let pwd = localStorage.getItem("pwd");
      let form = new FormData(); // 创建form对象
      form.append("account", userName); // 通过append向form对象添加数据
      form.append("password", pwd);
      form.append("loginCompanyId", loginCompanyId);
      this.API.login(form).then(response => {
        if (response.flag) {
          // 获取菜单数据
          if (!response.obj.menuTree) {
            this.$store.commit("showComComponents", false);
            this.$store.commit("popupMsg", "请先配置用户菜单！");
            this.$store.commit("showPopup");
            return;
          }
          let menu = JSON.stringify(response.obj.menuTree);
          bus.$emit("footerTabShow", menu);
          localStorage.setItem("menu", menu);
          // 如果登录成功则保存登录状态并设置有效期
          localStorage.setItem("token", response.obj.token);
          localStorage.setItem("userId", response.obj.id);
          //            if (!localStorage.getItem('isLogined') || localStorage.getItem('isLogined') === '0') {
          //              localStorage.setItem('token', response.obj.token);
          //              localStorage.setItem('userId', response.obj.id);
          //            }
          if (response.obj.passwordUpdateFlag === 1) {
            // 字段为1为首次登陆，需要绑定手机号、修改密码
            //                      this.$refs.resetConfirm.show();
            this.$store.state.footerShow = false;
            this.$router.push("/setAccount");
            return;
          }
          this.API.integralShow({
            account: userName,
            password: pwd
          }).then(res => {
            if (res) {
              localStorage.setItem(
                "balanceAmount",
                response.obj.balanceIntegral
              );
              localStorage.setItem("consumAmount", response.obj.consumAmount);
            }
          });
          if(response.success) {
            this.$store.commit("showComComponents", true);
            localStorage.setItem("isLogined", 1);
            localStorage.setItem("mobile", response.obj.mobile);
            this.curIndex = index;
            this.$store.state.recom.planName = "";
            this.$store.state.footerShow = true;
            localStorage.setItem('token', JSON.stringify(response.obj.token));
            localStorage.setItem('userInfo', JSON.stringify(response.obj));
            this.SET_TOKEN(response.obj.token);
            this.SET_USER_INFO(response.obj);
            var that = this;
            setTimeout(function() {
              that.$router.push("/");
            },200)
          }
          this.API.space().then(response => {
            // 获取空间的列表（客餐厅、卧室...）
            if (response) {
              this.$store.state.spaceList = response.datalist;
              sessionStorage.setItem(
                "selType",
                this.$store.state.spaceList[0].name
              );
              sessionStorage.setItem(
                "name",
                this.$store.state.spaceList[0].name
              ); // 推荐页面参数
              sessionStorage.setItem(
                "houseType",
                this.$store.state.spaceList[0].value
              ); // 设置选择的空间类型作为传参使用(推荐页面)
              this.$store.state.loginToDesign = true;
              this.$store.state.loginToRecom = true;
              sessionStorage.setItem("replaceList", "");
            }
          });
          this.API.getFavoritesList({
            // 获取默认收藏夹
            msgId: localStorage.getItem("userId"),
            token: localStorage.getItem("token")
          }).then(response => {
            if (response) {
              this.$store.state.favoritesList = response.datalist;
            }
          });
        }
      });
    }, 20),
    goback() {
      this.SET_TOKEN(null);
      this.$router.go(-2);
    }
  },
  computed: mapState({
    resourcesUrl: state => state.resourcesUrl
  })
};
</script>

<style scoped lang="scss">
@import "styles/mixin.scss";

.company {
  width: 100%;
  height: 100%;
  background-color: #eee;
}

.company .company-header {
  position: relative;
  height: 88px;
  text-align: center;
  font-size: 0;
  background-color: #fff;
  z-index: 99;
}

.company .company-header .arrow {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 48px;
  height: 48px;
  background-image: url("./images/arrow_nor.png");
  background-size: 48px 48px;
}

.company .company-header .company-title {
  display: inline-block;
  line-height: 88px;
  font-size: 36px;
  color: #333;
}

.company .company-wrappper {
  position: absolute;
  top: 88px;
  bottom: 0;
}

.company .company-wrappper .company-box {
  padding-bottom: 30px;
  overflow: hidden;
}

.company .company-wrappper .company-box .company-item {
  margin: 30px 60px;
  width: 630px;
  height: 260px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 10px;
  overflow: hidden;
}

.company .company-wrappper .company-box .company-item.active {
  border: 1px solid #ff6419;
}

.company .company-wrappper .company-box .company-item .company-logo {
  display: block;
  margin: 52px auto 30px;
  width: 200px;
  height: 100px;
}

.company .company-wrappper .company-box .company-item .company-name {
  text-align: center;
  font-size: 28.000000000000004px;
  color: #333;
}
</style>
