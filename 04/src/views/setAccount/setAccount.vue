<template>
    <div class="setAccount">
        <header>
            <i class="icon-left" @click="goBack"></i>
            <div class="title">设置账号</div>
        </header>
        <div class="line" v-if="userType/1 === 3 && isMultipleFranchiserAccount"></div>
        <div class="constType" v-if="userType/1 === 3 && isMultipleFranchiserAccount">
            <div class="type_title">选择修改类型：</div>
            <div class="type_item" @click="selConstType(1)">
                <img class="item_selicon" :src="constType===1? require('../../../static/images/list_icon_check_sel.png'): require('../../../static/images/list_icon_check_nor.png')" alt="">
                <span>仅修改当前企业</span>
            </div>
            <div class="type_item" @click="selConstType(2)">
                <img class="item_selicon" :src="constType===2? require('../../../static/images/list_icon_check_sel.png'): require('../../../static/images/list_icon_check_nor.png')" alt="">
                <span>修改关联的所有企业</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="box">
            <input v-model="phone" class="inpu" maxlength="11" type="text" placeholder="请输入手机号">
            <img class="icon" @click="clear" :src='require("../../../static/images/porfile_icon_delete.png")'>
        </div>
        <div class="line"></div>
        <div class="box">
            <input v-model="code" maxlength="10" class="inpu" type="number" placeholder="请输入验证码" :key="isClearTime">
            <div class="get-code" v-if="!isGetCode" :style="{color:'#fff',background:'#e8e8e8'}">获取验证码</div>
            <div class="get-code"  v-if="isGetCode" @click="getCode" :style="{color:codeColor,background:codeBg}">{{codetit}}</div>
        </div>
        <div class="line"></div>
        <!-- <div class="box">
            <input v-model="pwd" class="inpu" maxlength="11" type="password" placeholder="请输入6-16个字符密码">
        </div> -->
        <div class="Userprotocol" >
          <img class="UserprotocolBut" :src='sureuserprotocol?sureuserprotocolStyleTrue:sureuserprotocolStyleFalse' @click="sureUserprotocol()" alt="">
          <span class="UserprotocolTit">我已阅读并接受</span>
          <span class="UserprotocolTit" style="color: #ff6419;" @click="$router.push({path:'/BuiAment',query:{title:'设置账号'}})">《三度服务使用协议》</span>
        </div>
        <div class="butbox">
            <span v-if="!isPwd" class="butfalse">确定</span>
            <span v-if="isPwd" class="buttrue" @click="submit(0)">确定</span>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import { editPhone, getsms, updatePwdBak } from 'api/user';
import { checkPhone } from 'api/login';
import { mapGetters, mapMutations, mapActions } from 'Vuex';
import md5 from 'utils/md5';
import { bus } from "api/api.js";
const pwdtest = /^[0-9a-zA-Z]{6,16}$/;
export default {
  data() {
    return {
      codeColor: "#fff",
      codeBg: "#ff662e",
      codetit: "获取验证码",
      i: 60,
      phone: '',
      code: '',
      timer: '',
      pwd: '',
      constType: 1, // 修改类型，1当前企业，2所有关联企业
      userType: '',
      isMultipleFranchiserAccount: false, // 判断经销商是不是多企业经销商


      sureuserprotocol: true,
      sureuserprotocolStyleTrue: require('../../../static/images/icon_select_sel.png'),
      sureuserprotocolStyleFalse: require('../../../static/images/icon_select_nor.png'),
    };
  },
  created() {
    this.pwd=this.password;
    // 08.02不出现修改关联所有企业还是关联当前企业
    // this.userType = JSON.parse(localStorage.getItem('userInfo')).userType;
    // if(this.userType === 3) {
    //   this.API.amendType().then(res=> {
    //     if(res.obj === 1) {
    //       this.isMultipleFranchiserAccount = true;
    //     }
    //   })
    // }
  },
  computed: {
     ...mapGetters('login', ['password']),
    ...mapGetters('common', ['userInfo']),
    isGetCode() {
      return this.phone.length === 11;
    },
    isSubmit() {
      return this.phone.length === 11 && this.code && pwdtest.test(this.pwd);
    },
    isClearTime() {
      if(!this.isGetCode) {
        [this.codetit, this.codeColor, this.codeBg] = ['获取验证码', '#fff', '#ff662e'];
        return clearInterval(this.timer);
      }
    },
    isPwd() {
        if(this.phone.length === 11 && this.code) {
           return  true;
        }else {
           return false;
        }
    }
  },
  methods: {
    ...mapMutations('common', ['SET_TOKEN', 'SET_USER_INFO']),
    ...mapActions('home', ['setMarkedMessage']),
        sureUserprotocol() {
      // console.log(this.sourceCompanyList.map((item, index) => { return {index, value: item.name}}));
      this.sureuserprotocol = !this.sureuserprotocol;
    },
    goBack() {
      this.SET_TOKEN(null);
      this.$router.go(-1);
    },
    selConstType(type) {
        this.constType = type;
    },
    clear() {
      this.phone = '';
      this.confirmStyle = false;
    },
    showPhoneToast() {
      this.$toast("请输入手机号");
    },
    // 密码加密
    encrypt() {
      const salt = "WeB";
      let pwd = this.pwd,
        md5pwd = md5(salt + pwd),
        result = md5(md5pwd);
      return result;
    },
    /**
     * @param type
     * 0 不需要校验、 1 需要校验
     */
    submit(type) {
      let regEx = pwdtest;
      if(!this.sureuserprotocol) {
        this.$toast('请先阅读并同意《三度服务使用协议》！！');
        return;
      }
      // if (!regEx.test(this.pwd)) {
      //   this.$store.state.popupMsg = "请设置6-16位包含数字及字母密码组合";
      //   this.$store.commit("showPopup");
      //   return;
      // }
      let form = new FormData();
      form.append("mobile", this.phone);
      form.append("phoneCode", this.code);
      form.append("password", this.encrypt());
      if (type === 1) {
        // 校验手机号是否已被绑定过
        form.append("comfirmFlag", 1);
      } else {
        if (form.get("comfirmFlag")) {
          form.delete("comfirmFlag");
        }
      }
      if(this.userType == 3 ||this.userType === 14) {
        form.append('enterpriseFlag', this.constType);
      }
      // 设置手机号及密码
      updatePwdBak(form).then(res=> {
        if (res) {
          if (res.exceptionCode === 10010212) {
            this.$confirm({
              title: '提示',
              msg: '该手机号已绑定其他账号，再次绑定将会合并账号信息，是否确认绑定？'
            })
            .success(instance => { 
              instance.close();
              this.submit(1);
            })
            return;
          }
          if (res.exceptionCode === 10010210) {
            this.$toast(res.message);
            return;
          }
          if(res.success) {
            this.$store.state.popupMsg = res.message;
            this.$store.commit("showPopup");
            setTimeout(() => {
              this.toLogin();
            }, 1000);
          }else {
            this.$toast(res.message);
          }
        }
      });
      // this.API.updatePwd(form).then(res => {
      //   if (res) {
      //     if (!res.flag && res.obj === 1) {
      //       this.$confirm({
      //         title: '提示',
      //         msg: '该手机号已绑定其他账号，再次绑定将会合并账号信息，是否确认绑定？'
      //       })
      //       .success(instance => {
      //         instance.close();
      //         this.submit(0);
      //       })
      //       return;
      //     }
      //     this.$store.state.popupMsg = res.message;
      //     this.$store.commit("showPopup");
      //     setTimeout(() => {
      //       this.toLogin();
      //     }, 2000);
      //   }
      // });
    },
    // 登录请求
    toLogin() {
      this.$store.state.personalHideHeader = true;
      let userName = this.phone;
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
                    this.$router.push("/cumstomer");
                    return;
                  }
                  if (
                    response.message === "未开通此平台权限,请联系客服." ||
                    response.message === "平台权限已到期,请续费开通!"
                  ) {
                    let userId = response.msgId; // 缓存用户id
                    localStorage.setItem("pauopenUserId", userId);
                    this.$store.state.isRenew = false;
                    this.$router.push("/cumstomer");
                    return;
                  }
                  return;
                }
                if (response.message === "移动版已到期，请续费开通！") {
                  this.$store.state.isRenew = true;
                  this.$router.push("/cumstomer");
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
                    router.push({
                      path:'/changepwd',
                      query: {
                          phone: userName
                      }
                    });
                  }, 2500);
                  return;
                }
                // 如果登录成功则保存登录状态并设置有效期
                localStorage.setItem("token", response.obj.token);
                this.SET_TOKEN(response.obj.token);
                this.SET_USER_INFO(response.obj);
                localStorage.setItem('rememberPhone', userName);
                localStorage.setItem('rememberPassword', window.btoa(this.pwd));
                // this.$store.dispatch('')
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
                // this.$toast('恭喜，设置成功！');
                localStorage.setItem('firstLogin', 1)
                this.$router.push({
                  path:'/',
                  query: {
                    ShowUpPwd: 1
                  }
                });
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
    async getCode() {
      var i = this.i;
      if (
        this.codetit == "获取验证码" &&
        /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
          this.phone
        )
      ) {
        //let { success, message } = await checkPhone(this.phone);
        if(true) {
          var that = this;
          this.timer = setInterval(function() {
            i--;
            that.codetit = i + "s";
            that.codeBg = "#e8e8e8";
            that.codeColor = "#ff662e";
            if (i < 1) {
              clearInterval(that.timer);
              that.codetit = "获取验证码";
              that.codeBg = "#ff662e";
              that.codeColor = "#fff";
              that.i = 60;
            }
          }, 1000);
          var data = {
            phoneNumber: this.phone,
            functionType: 2
          };
          getsms(data).then(res => {
            if (res.success) {
              this.$toast("验证码发送成功");
            }else {
               this.$toast(res.message);
            }
          });
        }
        else {
          this.$toast(message);
        }
      }
      else {
        this.$toast("请输入正确的手机号");
      }
    }
  },
  activated() {
        this.phone = this.code = '';
        this.confirmStyle = false;
    }
}
</script>
<style lang="sass" scoped>
   @import '../../styles/header.scss'
   @import './style/setAccount.scss'
</style> 

