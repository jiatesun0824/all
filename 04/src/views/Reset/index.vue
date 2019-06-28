<template>
  <div class="login" @keydown="enter">
    <div class="goback" @click="goback"></div>
    <span class="reset-title">修改密码</span>
    <div class="login-wrapper">
      <div class="item">
        <div class="middle-wrapper">
          <input class="inp" :readonly="!isEdit" :class="{'no-edit': !isEdit}" id="phoneNum" type="text" placeholder="请输入手机号" v-model="phoneNumber" maxlength="11" oninput="if (this.value.length == 1) { this.value = this.value.replace(/[^1-9]/g, '') } else { this.value = this.value.replace(/\D/g, '').replace(/^0+/g, '') }" onafterpaste="if (this.value.length == 1) { this.value = this.value.replace(/[^1-9]/g, '') } else { this.value = this.value.replace(/^0+/g, '') }">
        </div>
      </div>
      <div class="item middleItem">
        <div class="middle-wrapper clearfix">
          <input class="inp" id="code" type="text" autocomplete="off" placeholder="请输入验证码" v-model="codeVal" oninput="value=this.value.replace(/\D+/g,'')" maxlength="6">
          <div class="code" @click="getCode">{{msg}}</div>
        </div>
      </div>
      <div class="item">
        <div class="middle-wrapper">
          <input class="inp" id="pwd" type="text" onfocus="this.type='password'" autocomplete="off" placeholder="请设置新密码" v-model="newPwd" maxlength="16">
        </div>
      </div>
      <div class="btn-wrapper">
        <a class="login-btn" :class="submitBtnGreyBg ? '' : 'gray-btn'" @click="toLogin">提交</a>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import "assets/js/jquery.min.js";
import "assets/js/md5.js";
import { mapState } from "Vuex";
import { bus } from "api/api.js";

let timer = ""; // 验证码定时器
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path === "/") {
        // 登录页面进入可以编辑手机号
        vm.isEdit = true;
      } else {
        vm.isEdit = false;
      }
    });
  },
  data() {
    return {
      canGetCode: true, // 是否可以发送手机号
      isEdit: false, // 手机号是否可以编辑
      infos: {},
      alertMsg: "",
      codeFlag: true, // 验证码按钮flag
      msg: "获取验证码", // 验证码信息
      count: 60,
      phoneNumber: "",
      newPwd: "",
      codeVal: "", // 验证码value
      submitBtnGreyBg: false // 提交按钮为灰色
    };
  },
  watch: {
    checkInputsNull(val) {
      if (val) {
        this.submitBtnGreyBg = true;
      } else {
        this.submitBtnGreyBg = false;
      }
    }
  },
  activated() {
    this.phoneNumber = localStorage.getItem("mobile");
    this.newPwd = "";
    this.codeVal = "";
    clearTimeout(timer);
    this.msg = "获取验证码";
    this.count = 60;
    this.codeFlag = true;
    this.canGetCode = true;
  },
  methods: {
    enter(e) {
      if (e.keyCode == 13) {
        this.toLogin();
      }
    },
    // 更新绑定账户
    setAccount(e) {
      this.$store.commit("setAccount", e.target.value);
    },
    // 更新绑定密码
    setPwd(e) {
      this.$store.commit("setPwd", e.target.value);
    },
    // 登录请求
    toLogin() {
      if (this.submitBtnGreyBg) {
        this.$store.state.personalHideHeader = true;
        let userName = document
          .getElementById("phoneNum")
          .value.replace(/(^\s*)|(\s*$)/g, "");
        if (
          !/^(0|86|17951)?(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(
            userName
          )
        ) {
          this.$store.state.popupMsg = "请输入正确的手机号";
          this.$store.commit("showPopup");
          return;
        }
        var code = document.getElementById("code").value;
        if (!/^\d{6}$/.test(code)) {
          this.$store.state.popupMsg = "验证码错误";
          this.$store.commit("showPopup");
          return;
        }
        const salt = "WeB";
        let val = document.getElementById("pwd").value;
        let regEx = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,16}$/;
        if (!regEx.test(val)) {
          this.$store.state.popupMsg = "请设置4-16位包含数字及字母密码组合";
          this.$store.commit("showPopup");
          return;
        }
        var md5pwd = $.md5(salt + val),
          pwd = $.md5(md5pwd);
        localStorage.setItem("userName", userName);
        localStorage.setItem("pwd", pwd);
        this.API.reset({
          // 保存新密码
          account: userName,
          password: pwd,
          msgId: "0",
          remark: this.codeVal
        }).then(response => {
          // 保存成功，则请求登录
          if (response) {
            let form = new FormData(); // 创建form对象
            form.append("account", userName); // 通过append向form对象添加数据
            form.append("password", pwd);
            form.append("msgId", 0);
            form.append("loginFlag", 1);
            this.API.getFranchiserCompanyList(form).then(res => {
              if (res) {
                if (res.datalist.length && res.datalist.length > 1) {
                  localStorage.setItem(
                    "companyList",
                    JSON.stringify(res.datalist)
                  );
                  this.$store.commit("showComComponents", false);
                  this.$router.push("/company");
                } else {
                  this.API.login(form).then(response => {
                    if (response) {
                      if (!response.flag) {
                        this.$store.commit("showComComponents", false);
                        this.$store.commit("popupMsg", response.message);
                        this.$store.commit("showPopup");
                        if (
                          response.message ===
                          "您尚未开通移动版功能，请联系客服开通!"
                        ) {
                          this.$store.state.isRenew = false;
                          localStorage.setItem("pauopenUserId", response.msgId);
                          this.$router.push("/payopen");
                          return;
                        }
                        if (
                          response.message === "未开通此平台权限,请联系客服." ||
                          response.message === "平台权限已到期,请续费开通!"
                        ) {
                          let userId = response.msgId; // 缓存用户id
                          localStorage.setItem("pauopenUserId", userId);
                          this.$store.state.isRenew = false;
                          this.$router.push("/payopen");
                          return;
                        }
                        return;
                      }
                      if (response.message === "移动版已到期，请续费开通！") {
                        this.$store.state.isRenew = true;
                        this.$router.push("/payopen");
                        return;
                      }
                      if (this.$store.state.errorCount > 3) {
                        this.$store.commit("showComComponents", false);
                        this.$store.commit(
                          "popupMsg",
                          "账号或密码错误超过3次，请修改密码！"
                        );
                        this.$store.commit("showPopup");
                        setTimeout(() => {
                          router.push("/reset");
                        }, 2500);
                        return;
                      }
                      // 如果登录成功则保存登录状态并设置有效期
                      localStorage.setItem("token", response.obj.token);
                      localStorage.setItem("userId", response.obj.id);
                      if (response.obj.passwordUpdateFlag === 1) {
                        // 字段为1为首次登陆，需要绑定手机号、修改密码
                        this.$store.state.footerShow = false;
                        this.$router.push("/setAccount");
                        return;
                      }
                      if (!sessionStorage.getItem("designHouseType")) {
                        sessionStorage.setItem("designHouseType", "3"); // 第一次登录初始化我的设计筛选条件
                      }
                      this.$store.state.timeOut = false;
                      this.$store.state.errorCount = 0; // 登录失败次数初始化为0
                      // 初始化省份城市
                      sessionStorage.setItem("provinceCode", 440000);
                      sessionStorage.setItem("cityCode", 440300);
                      localStorage.removeItem("companyList");
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
                      this.API.integralShow({
                        account: userName,
                        password: pwd
                      }).then(res => {
                        if (res) {
                          localStorage.setItem(
                            "balanceAmount",
                            response.obj.balanceIntegral
                          );
                          localStorage.setItem(
                            "consumAmount",
                            response.obj.consumAmount
                          );
                        }
                      });
                      this.$store.commit("showComComponents", true);
                      localStorage.setItem("isLogined", 1);
                      localStorage.setItem("mobile", response.obj.mobile);
                      this.$store.state.footerShow = true;
                      this.$router.push("/recom");
                      let companyForm = new FormData();
                      companyForm.append("account", userName); // 通过append向form对象添加数据
                      companyForm.append("password", pwd);
                      companyForm.append("msgId", 0);
                      this.API.getFranchiserCompanyList(companyForm).then(
                        res => {
                          if (res) {
                            if (
                              res.datalist.length &&
                              res.datalist.length > 1
                            ) {
                              localStorage.setItem(
                                "companyList",
                                JSON.stringify(res.datalist)
                              );
                            }
                          }
                        }
                      );
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
                        token: response.obj.token
                      }).then(response => {
                        if (response) {
                          this.$store.state.favoritesList = response.datalist;
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    },
    // 获取验证码
    getCode() {
      let that = this;
      let userName = document
        .getElementById("phoneNum")
        .value.replace(/(^\s*)|(\s*$)/g, "");
      let type =
        localStorage.getItem("isLogined") &&
        localStorage.getItem("isLogined") === 1
          ? "updateMobileByLogin"
          : "updateMobileByForget";
      if (
        !/^(0|86|17951)?(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(
          userName
        )
      ) {
        this.$store.state.popupMsg = "请输入正确的手机号";
        this.$store.commit("showPopup");
        return;
      }
      if (userName == "") {
        this.$store.state.popupMsg = "请输入手机号";
        this.$store.commit("showPopup");
        return;
      }
      if (that.codeFlag) {
        if (!that.canGetCode) {
          return;
        }
        that.canGetCode = false;
        if (this.codeVal !== "") {
          clearTimeout(timer);
          countDown();
        }
        clearTimeout(timer);
        this.API.getCode({
          msgId: "0",
          mobile: userName,
          type: type
        }).then(response => {
          if (response) {
            that.canGetCode = true;
            countDown();
          }
        });
      }
      function countDown() {
        if (that.count == 0) {
          clearTimeout(timer);
          that.msg = "获取验证码";
          that.count = 60;
          that.codeFlag = true;
        } else {
          that.codeFlag = false;
          that.count--;
          that.msg = that.count + "s";
          timer = setTimeout(() => {
            countDown();
          }, 1000);
        }
      }
    },
    backToLogin() {
      this.count = -1;
      this.$router.go(-1);
    },
    goback() {
      this.$router.go(-1);
      clearTimeout(timer);
      this.msg = "获取验证码";
      this.count = 60;
      this.codeFlag = true;
    }
  },
  computed: mapState({
    account: state => state.account,
    pwd: state => state.pwd,
    checkInputsNull() {
      if (this.phoneNumber != "" && this.codeVal != "" && this.newPwd != "") {
        return true;
      } else {
        return false;
      }
    },
    comComponentsShow: state => state.comComponentsShow,
    popupShow: state => state.popupShow,
    popupMsg: state => state.popupMsg
  })
};
</script>

<style lang="scss">
@import "styles/mixin.scss";
.login {
  position: absolute;
  z-index: 11;
  width: 100%;
  height: 100%;
  background: #fefefe;
}

.login .reset-title {
  display: block;
  width: auto;
  height: 80px;
  line-height: 80px;
  font-size: 36px;
  margin-bottom: 80px;
  text-align: center;
  border-bottom: 1px solid#e3e3e3;  /*no*/
}

.login .goback {
  width: 22px;
  height: 34px;
  background-size: 22px 34px;
  position: absolute;
  left: 38px;
  top: 24px;
  background-image: url("./images/goback_nor.png");
}

.login .login-wrapper .item .middle-wrapper {
  width: 600px;
  border-radius: 50px;
  margin: 20px auto;
}

.login .login-wrapper .item .middle-wrapper .inp {
  box-sizing: border-box;
  display: block;
  width: 600px;
  height: 88px;
  font-size: 28.000000000000004px;
  color: #828282;
  border-radius: 50px;
  padding-left: 57.99999999999999px;
  border: 1px solid #e0e0e0; /*no*/
}

.login .login-wrapper .item .middle-wrapper .no-edit {
  color: gray;
  background-color: #e0e0e0;
}

.login .login-wrapper .middleItem .middle-wrapper {
  box-sizing: border-box;
  border: 1px solid #e0e0e0; /*no*/
  width: 600px;
  border-radius: 50px;
  margin: 20px auto;
}

.login .login-wrapper .middleItem .middle-wrapper .inp {
  box-sizing: border-box;
  width: 310px;
  float: left;
  margin: 0;
  border: 0;
}

.login .login-wrapper .middleItem .middle-wrapper .code {
  float: left;
  font-size: 26px;
  text-align: center;
  height: 57.99999999999999px;
  width: 210px;
  line-height: 57.99999999999999px;
  border-left: 1px solid #e0e0e0;
  margin: 14.000000000000002px 0;
  padding: 0 30px;
  color: #808183;
}

.login .login-wrapper .btn-wrapper {
  width: 600px;
  height: 88px;
  margin: 0 auto;
  font-size: 0;
}

.login .login-wrapper .btn-wrapper .login-btn {
  box-sizing: border-box;
  display: block;
  width: 600px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 30px;
  border-radius: 50px;
  color: #fff;
  background: #ff6419;
  border: 1px solid #ff6419;
  -webkit-user-select: none;
  user-select: none;
}

.login .login-wrapper .btn-wrapper .login-btn.gray-btn {
  background: #e0e0e0;
  color: #fff;
  border: 1px solid #e0e0e0;
}
</style>

