<template>
  <div class="first-login">
    <div class="back-icon" @click="goBack"></div>
    <div class="first-login-wrapper">
      <div class="title-box">
        <span class="title-f">绑定账户信息后，您可获得</span><br/><span class="title-s">三个月免费渲染套餐</span>
      </div>
      <div class="module-box">
        <div class="module-title">绑定手机号</div>
        <div class="module-inp">
          <input type="text" class="inp" id="phoneNumber" @keyup="allowSubmit" placeholder="请输入手机号" autocomplete="off" maxlength="11" v-model="phoneNumber"
                 oninput="if (this.value.length == 1) { this.value = this.value.replace(/[^1-9]/g, '') } else { this.value = this.value.replace(/\D/g, '').replace(/^0+/g, '') }"
                 onafterpaste="if (this.value.length == 1) { this.value = this.value.replace(/[^1-9]/g, '') } else { this.value = this.value.replace(/^0+/g, '') }"
          >
        </div>
        <div class="module-inp module-inp-code">
          <input type="text" class="inp code-inp" placeholder="请输入验证码"
                 oninput="value=this.value.replace(/\D+/g,'')" maxlength="6"
                 v-model="codeVal"
                 @keyup="allowSubmit"
          >
          <div class="code" @click="getCode">{{msg}}</div>
        </div>
      </div>

      <div class="module-box">
        <div class="module-title">首次登陆请修改密码</div>
        <div class="module-inp">
          <input type="password" class="inp" placeholder="请输入4-16位数字及字母密码组合" @keyup="allowSubmit" autocomplete="off" maxlength="16" v-model="firstNewPwd">
        </div>
        <div class="module-inp">
          <input type="password" class="inp" id="resetPwd" placeholder="再次确认密码" @keyup="allowSubmit" autocomplete="off" maxlength="16" v-model="secondNewPwd">
        </div>
      </div>

      <div class="submit-btn" @click="submit(1)" :class="{'allow-submit': allowToSubmit}">提交</div>

      <confirm ref="tip" text="该手机号已绑定其他账号，再次绑定将会合并账号信息，是否确认绑定？"
               cancelBtnText="取消"
               confirmBtnText="确定"
               @confirm="submit(0)">
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";
import { bus } from "api/api.js";

var timer = ""; // 验证码定时器

export default {
  data() {
    return {
      allowToSubmit: false, // 允许提交
      phoneNumber: "", // 手机号
      msg: "获取验证码", // 验证码信息
      firstNewPwd: "",
      secondNewPwd: "",
      count: 60,
      codeVal: "", // 验证码value
      canGetCode: true, // 是否可以发送手机号
      codeFlag: true // 验证码按钮flag
    };
  },
  activated() {
    this.resetVal();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 初始化
    resetVal() {
      this.phoneNumber = "";
      this.msg = "获取验证码";
      this.firstNewPwd = "";
      this.secondNewPwd = "";
      this.count = 60;
      this.codeVal = "";
      this.codeFlag = true;
      this.canGetCode = true;
      clearTimeout(timer);
    },
    // 密码加密
    encrypt() {
      const salt = "WeB";
      let pwd = document.getElementById("resetPwd").value,
        md5pwd = $.md5(salt + pwd),
        result = $.md5(md5pwd);
      return result;
    },
    allowSubmit() {
      this.phoneNumber === "" ||
      this.codeVal === "" ||
      this.firstNewPwd === "" ||
      this.secondNewPwd === ""
        ? (this.allowToSubmit = false)
        : (this.allowToSubmit = true);
    },
    /**
     * @param type
     * 0 不需要校验、 1 需要校验
     */
    submit(type) {
      let regEx = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,16}$/;
      if (!this.allowToSubmit) {
        return;
      }
      if (!regEx.test(this.firstNewPwd) || !regEx.test(this.secondNewPwd)) {
        this.$store.state.popupMsg = "请设置4-16位包含数字及字母密码组合";
        this.$store.commit("showPopup");
        return;
      }
      if (this.firstNewPwd !== this.secondNewPwd) {
        this.$store.state.popupMsg = "您设置的密码不一致";
        this.$store.commit("showPopup");
        return;
      }
      let form = new FormData();
      form.append("mobile", this.phoneNumber);
      form.append("phoneCode", this.codeVal);
      form.append("password", this.encrypt());
      if (type === 1) {
        // 校验手机号是否已被绑定过
        form.append("comfirmFlag", 1);
      } else {
        if (form.get("comfirmFlag")) {
          form.delete("comfirmFlag");
        }
      }
      this.API.updatePwd(form).then(res => {
        if (res) {
          if (!res.flag && res.obj === 1) {
            this.$refs.tip.show();
            return;
          }
          this.$store.state.popupMsg = res.message;
          this.$store.commit("showPopup");
          setTimeout(() => {
            this.toLogin();
          }, 2000);
        }
      });
    },
    // 登录请求
    toLogin() {
      this.$store.state.personalHideHeader = true;
      let userName = this.phoneNumber;
      let pwd = this.encrypt();
      localStorage.setItem("userName", userName);
      localStorage.setItem("pwd", pwd);
      let form = new FormData(); // 创建form对象
      form.append("account", userName); // 通过append向form对象添加数据
      form.append("password", pwd);
      form.append("msgId", 0);
      form.append("loginFlag", 1);
      this.API.getFranchiserCompanyList(form).then(res => {
        if (res) {
          if (res.datalist.length && res.datalist.length > 1) {
            localStorage.setItem("companyList", JSON.stringify(res.datalist));
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
                    response.message === "您尚未开通移动版功能，请联系客服开通!"
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
                this.$store.state.footerShow = true;
                localStorage.setItem("isLogined", 1);
                localStorage.setItem("mobile", response.obj.mobile);
                this.$router.push("/recom");
                let companyForm = new FormData();
                companyForm.append("account", userName); // 通过append向form对象添加数据
                companyForm.append("password", pwd);
                companyForm.append("msgId", 0);
                this.API.getFranchiserCompanyList(companyForm).then(res => {
                  if (res) {
                    if (res.datalist.length && res.datalist.length > 1) {
                      localStorage.setItem(
                        "companyList",
                        JSON.stringify(res.datalist)
                      );
                    }
                  }
                });
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
    },
    // 获取验证码
    getCode() {
      let that = this;
      let userName = document
        .getElementById("phoneNumber")
        .value.replace(/(^\s*)|(\s*$)/g, "");
      if (
        !/^(0|86|17951)?(13[0-9]|15[012356789]|19[0-9]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(
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
        this.API.sendbindPhoneMsg({
          phoneNumber: this.userName,
            functionType: 2
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
          that.msg = that.count + "S后重发";
          timer = setTimeout(() => {
            countDown();
          }, 1000);
        }
      }
    }
  },
  computed: mapState({
    footerShow: state => state.footerShow
  })
};
</script>

<style scoped lang="scss">
@import "styles/mixin.scss";

.first-login {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.first-login .back-icon {
  position: absolute;
  left: 30px;
  top: 30px;
  width: 48px;
  height: 48px;
  background-size: 48px 48px;
  background-image: url("./images/back_nor.png");
}

.first-login .first-login-wrapper .title-box {
  margin: 126px 0 100px;
  text-align: center;
  font-size: 0;
}

.first-login .first-login-wrapper .title-box .title-f {
  display: inline-block;
  padding-bottom: 30px;
  font-family: PingFang-SC-Bold;
  font-size: 36px;
  color: #333;
}

.first-login .first-login-wrapper .title-box .title-s {
  display: inline-block;
  font-size: 48px;
  color: #ff6419;
}

.first-login .first-login-wrapper .module-box {
  margin: 0 auto 60px;
  width: 600px;
}

.first-login .first-login-wrapper .module-box .module-title {
  font-size: 24px;
  color: #999;
}

.first-login .first-login-wrapper .module-box .module-inp {
  box-sizing: border-box;
  margin: 20px 0;
  width: 600px;
  height: 88px;
  border: 1px solid #e0e0e0;/*no*/
  border-radius: 44px;
}

.first-login .first-login-wrapper .module-box .module-inp .inp {
  box-sizing: border-box;
  display: block;
  width: 600px;
  height: 88px;
  text-indent: 60px;
}

.first-login .first-login-wrapper .module-box .module-inp-code {
  display: flex;
}

.first-login .first-login-wrapper .module-box .module-inp-code .code-inp {
  width: 380px;
}

.first-login .first-login-wrapper .module-box .module-inp-code .code {
  flex: 1;
  margin: 30px 0;
  text-align: center;
  line-height: 28.000000000000004px;
  height: 28.000000000000004px;
  font-size: 28.000000000000004px;
  color: #999;
  border-left: 1px solid #e0e0e0;
}

.first-login .first-login-wrapper .submit-btn {
  margin: 120px auto 0;
  width: 600px;
  height: 88px;
  background-color: #ffdccc;
  border-radius: 40px;
  color: #fff;
  font-size: 34px;
  text-align: center;
  line-height: 88px;
}

.first-login .first-login-wrapper .submit-btn.allow-submit {
  background-color: #ff6419;
}
</style>
