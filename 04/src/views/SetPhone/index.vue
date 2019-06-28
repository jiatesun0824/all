<template>
  <div class="set-phone">
    <!--遮罩层-->
    <div class="shade" v-show="hintShow"></div>
    <!--遮罩层-->
    <!--提示框-->
    <div class="hint" v-show="hintShow">
      <p>提示</p>
      <div class="hint-txt">该手机号已绑定其他账号，再次绑定将会合并账号信息，是否确认修改？</div>
      <div class="hint-btn">
        <span @click="hintShow = false">取消</span>
        <span class="confirm" @click="yesSubmit">确定</span>
      </div>
    </div>
    <!--提示框-->
    <div class="header"><span class="back" @click="back"></span>修改手机号</div>
    <div class="content">
      <div class="amend-type" v-show="amendType">
        <div class="type-header">选择修改类型</div>
        <div class="enterprise">
          <p class="enterprise-item" v-for="(item, index) in enterprise" :key="index">
            {{item}}
            <span @click="select(index)" :class="selectImg == index ? 'span-active' : 'span'"></span>
          </p>
        </div>
      </div>
      <div class="phone">
        <input type="text" v-model="phoneTxt" maxlength="11" placeholder="请输入新手机号" @keyup="openBtn">
      </div>
      <div class="security-code">
        <input type="text" v-model="securityCode" placeholder="请输入验证码" @keyup="openBtn">
        <button @click="setCode" :disabled="disabled">{{btnTxt}}</button>
      </div>
      <button :class="btnColor ? 'btn-active' : 'btn'" @click="submit" :disabled="btnDisabled">提交</button>
      <p class="txt">修改成功后，下次登录用新手机号登录</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "set-phone",
  data() {
    return {
      phoneTxt: "",
      securityCode: "",
      btnTxt: "获取验证码",
      enterprise: ["仅修改当前企业", "修改关联的所有企业"],
      selectImg: 0,
      btnColor: false,
      disabled: false,
      btnDisabled: true,
      page: 0, // 企业类型,单企业为0，多企业为2
      amendType: false, // 企业类型显示隐藏
      hintShow: false, // 提示框显示隐藏
      interval: false
    };
  },
  activated() {
    this.$store.state.footerShow = false;
    this.API.amendType().then(res => {
      if (res.obj === 1) {
        this.amendType = true;
      } else {
        this.amendType = false;
      }
    });
  },
  methods: {
    // 返回
    back() {
      this.$store.state.footerShow = true;
      this.phoneTxt = "";
      this.securityCode = "";
      this.selectImg = 0;
      this.$router.go(-1);
    },
    // 选择企业类型，单企业为1，多企业为0
    select(index) {
      this.selectImg = index;
      if (index == 0) {
        this.page = 0;
      } else {
        this.page = 2;
      }
    },
    // 获取验证码
    setCode() {
      let r = new RegExp("^1[3456789]\\d{9}$");
      if (this.phoneTxt.length == 0) {
        this.$store.commit("popupMsg", "请输入手机号");
        this.$store.commit("showPopup");
        return;
      }
      if (r.test(this.phoneTxt)) {
        this.API.sendbindPhoneMsg({
           phoneNumber: this.phoneTxt,
            functionType: 2
        }).then(res => {
          this.$store.commit("popupMsg", res.message);
          this.$store.commit("showPopup");
          let i = 60;
          let t = setInterval(() => {
            i--;
            this.btnTxt = i + "s";
            this.disabled = true;
            if (i === 0 || this.interval) {
              this.btnTxt = "获取验证码";
              this.disabled = false;
              this.interval = false;
              console.log(this.interval);
              clearInterval(t);
            }
          }, 1000);
        });
      } else {
        this.$store.commit("popupMsg", "手机号格式不正确");
        this.$store.commit("showPopup");
      }
    },
    // 启用按钮
    openBtn() {
      let t = new RegExp("^1[3456789]\\d{9}$");
      if (t.test(this.phoneTxt)) {
        this.btnColor = true;
        this.btnDisabled = false;
      } else {
        this.btnColor = false;
        this.btnDisabled = true;
      }
    },
    // 确定提交
    yesSubmit() {
      this.setSubmit(0);
    },
    // 提交
    submit() {
      this.setSubmit(1);
    },
    setSubmit(i) {
      console.log(this.page);
      if (!this.securityCode.replace(/\s+/g, "")) {
        this.$store.commit("popupMsg", "请输入验证码");
        this.$store.commit("showPopup");
        return;
      }
      if (this.phoneTxt == localStorage.getItem("mobile")) {
        this.$store.commit("popupMsg", "您当前绑定的就是这个手机号");
        this.$store.commit("showPopup");
        return;
      }
      let form = new FormData();
      form.append("mobile", this.phoneTxt);
      form.append("phoneCode", this.securityCode);
      form.append("comfirmFlag", i);
      form.append("enterpriseFlag", this.page);
      this.API.btnDisabled(form).then(res => {
        if (res.obj === 1) {
          this.hintShow = true;
        } else {
          this.hintShow = false;
          if (res.flag && res.success) {
            this.$store.commit("popupMsg", res.message);
            this.$store.commit("showPopup");
            localStorage.setItem("mobile", this.phoneTxt);
            localStorage.setItem("userName", this.phoneTxt);
            localStorage.setItem("isLogin", "yes");
            this.btnDisabled = true;
            this.btnColor = false;
            this.securityCode = "";
            this.phoneTxt = "";
            this.interval = true;
            this.API.amendType().then(res => {
              if (res.obj === 1) {
                this.amendType = true;
              } else {
                this.amendType = false;
              }
            });
            // if (i === 1) {
            //   console.log(localStorage.getItem('pwd'));
            //   let companyForm = new FormData();
            //   companyForm.append('account', this.phoneTxt); // 通过append向form对象添加数据
            //   companyForm.append('password', localStorage.getItem('pwd'));
            //   companyForm.append('msgId', 0);
            //   companyForm.append('loginFlag', 1);
            //   this.API.getFranchiserCompanyList(companyForm).then((res) => {
            //     if (res) {
            //       if (res.datalist.length && res.datalist.length > 1) {
            //         localStorage.setItem('companyList', JSON.stringify(res.datalist));
            //       } else {
            //         localStorage.setItem('companyList', '');
            //       }
            //     }
            //   });
            // }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";
.set-phone {
  width: 100%;
  height: 100%;
}

.set-phone .shade {
  position: fixed;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}

.set-phone .hint {
  width: 540px;
  height: 373px;
  border-radius: 10px;
  background-color: #fff;
  position: fixed;
  z-index: 11;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.set-phone .hint p {
  width: 100%;
  height: 88px;
  margin-bottom: 24px;
  line-height: 88px;
  text-align: center;
  font-size: 36px;
  color: #ff6419;
}

.set-phone .hint .hint-txt {
  width: 100%;
  height: 173px;
  font-size: 28.000000000000004px;
  padding: 0 60px;
  line-height: 48px;
  letter-spacing: 0px;
  color: #333;
}

.set-phone .hint .hint-btn {
  width: 100%;
  height: 88px;
  font-size: 32px;
  display: flex;
  justify-content: space-between;
}

.set-phone .hint .hint-btn span {
  width: 50%;
  height: 100%;
  text-align: center;
  line-height: 88px;
}

.set-phone .hint .hint-btn .confirm {
  color: #ff6419;
}

.set-phone .header {
  position: relative;
  font-size: 36px;
  line-height: 88px;
  text-align: center;
  width: 100%;
  height: 88px;
  border: 1px solid #eee; /*no*/
}

.set-phone .header .back {
  position: absolute;
  top: 23px;
  left: 30px;
  width: 25px;
  height: 41px;
  display: block;
  background-image: url("./images/back_nor.png");
  background-size: cover;
}

.set-phone .content {
  width: 100%;
  margin-top: 80px;
  padding: 0 75px;
}

.set-phone .content .amend-type {
  width: 100%;
  margin-bottom: 60px;
}

.set-phone .content .amend-type .type-header {
  width: 100%;
  font-size: 24px;
  color: #999;
}

.set-phone .content .amend-type .enterprise {
  width: 100%;
  margin-top: 30px;
  font-size: 28.000000000000004px;
  border-radius: 20px;
  color: #333333;
  background-color: #f5f5f5;
  padding: 0 60px;
}

.set-phone .content .amend-type .enterprise .enterprise-item {
  width: 100%;
  height: 100px;
  line-height: 100px;
  display: flex;
  justify-content: space-between;
}

.set-phone .content .amend-type .enterprise .enterprise-item .span {
  width: 36px;
  height: 36px;
  margin-top: 32px;
  background-image: url("./images/edit_icon_unselect.png");
  background-size: cover;
}

.set-phone .content .amend-type .enterprise .enterprise-item .span-active {
  width: 36px;
  height: 36px;
  margin-top: 32px;
  background-image: url("./images/edit_icon_select.png");
  background-size: cover;
}

.set-phone .content .phone {
  width: 100%;
  height: 88px;
  border:  1px solid#e0e0e0; /*no*/
  border-radius: 44px;
  display: flex;
  justify-content: space-between;
}

.set-phone .content .phone input {
  width: 80%;
  margin-left: 10%;
  font-size: 28.000000000000004px;
  color: #999;
}

.set-phone .content .security-code {
  width: 100%;
  height: 88px;
  margin-top: 20px;
  overflow: hidden;
  border: 1px solid#e0e0e0; /*no*/
  border-radius: 44px;
  display: flex;
  justify-content: space-between;
}

.set-phone .content .security-code input {
  width: 50%;
  margin-left: 10%;
  font-size: 28.000000000000004px;
  color: #999;
}

.set-phone .content .security-code button {
  width: 30%;
  margin-right: 5%;
  border: none;
  background-color: #fff;
  font-size: 28.000000000000004px;
  color: #999;
}

.set-phone .content .btn {
  display: block;
  margin-top: 100px;
  width: 100%;
  height: 88px;
  border: none;
  color: #ffffff;
  font-size: 34px;
  border-radius: 44px;
  background-color: #ffdccc;
}

.set-phone .content .btn-active {
  display: block;
  margin-top: 100px;
  width: 100%;
  height: 88px;
  border: none;
  color: #ffffff;
  font-size: 34px;
  border-radius: 44px;
  background-color: #ff6419;
}

.set-phone .content .txt {
  width: 100%;
  margin-top: 30px;
  text-align: center;
  font-size: 24px;
  color: #999;
}
</style>
