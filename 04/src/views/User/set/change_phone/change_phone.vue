<template>
    <div class="change-phone">
         <header>
			<i class="icon-left" @click="$router.back()"></i>
			<div class="title">修改手机号</div>
	    </header>
        <div class="line" v-if="(userType/1 === 3 && isMultipleFranchiserAccount) || (userType/1 === 14 && isMultipleFranchiserAccount)"></div>
        <div class="constType" v-if="(userType/1 === 3 && isMultipleFranchiserAccount) || (userType/1 === 14 && isMultipleFranchiserAccount)">
            <div class="type_title">选择修改类型：</div>
           <div class="type_item" @click="selConstType(1)">
                <img class="item_selicon" :src="constType===1? require('../../../../../static/images/list_icon_check_sel.png'): require('../../../../../static/images/list_icon_check_nor.png')" alt="">
                <span>仅修改当前企业</span>
            </div>
            <div class="type_item" @click="selConstType(2)">
                <img class="item_selicon" :src="constType===2? require('../../../../../static/images/list_icon_check_sel.png'): require('../../../../../static/images/list_icon_check_nor.png')" alt="">
                <span>修改关联的所有企业</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="box">
            <input v-model="phone" class="inpu" maxlength="11" type="text" placeholder="请输入手机号">
            <img class="icon" @click="clear" src="../../images/porfile_icon_delete.png">
        </div>
        <div class="line"></div>
        <div class="box">
            <input v-model="code" maxlength="10" class="inpu" type="number" placeholder="请输入验证码" :key="isClearTime">
            <div class="get-code" v-if="!isGetCode" :style="{color:'#fff',background:'#e8e8e8'}">获取验证码</div>
            <div class="get-code"  v-if="isGetCode" @click="getCode" :style="{color:codeColor,background:codeBg}">{{codetit}}</div>
        </div>
        <div class="butbox">
            <span class="butsp" :style="isSubmit ? 'background: #ff6419;' : ''" @click="save(0)">确定</span>
        </div>
    </div> 
</template>
<script>
import { editPhone, getsms } from 'api/user';
import { checkPhone } from 'api/login';
import { mapActions, mapGetters, mapMutations } from 'Vuex'
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
      userType: 11,
      constType: 1, // 默认1，当前企业；2，为所有企业
      isMultipleFranchiserAccount: false
    };
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    isGetCode() {
      return this.phone.length === 11;
    },
    isSubmit() {
      return this.phone.length === 11 && this.code;
    },
    isClearTime() {
      if(!this.isGetCode) {
        [this.codetit, this.codeColor, this.codeBg] = ['获取验证码', '#fff', '#ff662e'];
        return clearInterval(this.timer);
      }
    }
  },
  created() {
    this.userType = JSON.parse(localStorage.getItem('userInfo')).userType;
    if(this.userType === 3|| this.userType === 14) {
      this.API.amendType().then(res=> {
        if(res.obj === 1) {
          this.isMultipleFranchiserAccount = true;
        }
      })
    }
  },
  methods: {
     ...mapMutations('common', ['SET_USER_INFO']),
     ...mapActions('login', ['getAccount']),
    selConstType(type) {
        this.constType = type;
    },
    clear() {
      this.phone = '';
    },
    showPhoneToast() {
      this.$toast("请输入手机号");
    },
    save(type) {
      var that = this;
      if (this.isSubmit) {
        if (
         /^[1][3-9][0-9]{9}$/.test(this.phone)
        ) {
          var btnform = new FormData();
          btnform.append('mobile', this.phone);
          btnform.append("phoneCode", this.code);
          if (type === 1) {
            // 校验手机号是否已被绑定过
            btnform.append("comfirmFlag", 1);
          } else {
            if (btnform.get("comfirmFlag")) {
              btnform.delete("comfirmFlag");
            }
          }
          if(this.userType == 3||this.userType === 14) {
            btnform.append('enterpriseFlag', this.constType);
          }
          this.API.btnDisabled(btnform).then(res=> {
            if (res) {
              localStorage.setItem('rememberPhone', this.phone);
              if (res.exceptionCode === 10010212) {
                this.$confirm({
                  title: '提示',
                  msg: '该手机号已绑定其他账号，再次绑定将会合并账号信息，是否确认绑定？'
                })
                .success(instance => {
                  instance.close();
                  var btnformhe = new FormData();
                  btnformhe.append('mobile', this.phone);
                  btnformhe.append("phoneCode", this.code);
                  btnformhe.append("comfirmFlag", 1);
                  if(this.userType == 3||this.userType === 14) {
                    btnformhe.append('enterpriseFlag', this.constType);
                  }
                  this.API.btnDisabled(btnformhe).then(res=> {
                    if((res.success)&&((!res.exceptionCode)||(res.exceptionCode==''))) {
                      this.getAccount(this.phone)
                      localStorage.setItem('rememberPhone', this.phone);
                      this.$router.push('/login');
                    }else {
                       this.$toast(res.message);
                    }
                  })
                })
                return;
              }
              this.$store.state.popupMsg = res.message;
              this.$store.commit("showPopup");
              this.$toast(res.message);
              if((res.success)&&((!res.exceptionCode)||(res.exceptionCode==''))) {
                var userInfo  = JSON.parse(localStorage.getItem('userInfo'));
                userInfo.loginPhone = this.phone;
                userInfo.mobile = this.phone;
                this.getAccount(this.phone)
                localStorage.setItem('rememberPhone', this.phone);
                this.SET_USER_INFO(userInfo);
                setTimeout(() => {
                  this.$router.go(-1);
                }, 2000);
              }else {
                 this.$toast(res.message);
              }
            }
          });
        } else {
          this.$toast("请输入正确的手机号");
        }
      }
    },
    async getCode() {
      var i = this.i;
      if (
        this.codetit == "获取验证码" &&
        /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(
          this.phone
        )
      ) {
         // let { success, message } = await checkPhone(this.phone);
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
            if (res.status) {
              this.$toast("验证码发送成功");
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
	}
};
</script>
<style lang="scss" scoped>
@import "~@/styles/header.scss";
</style>
<style lang="scss" scoped>
.change-phone {
  height: 100%;
  background: #f5f5f5;
  box-sizing: border-box;
  padding-top: 88px;
  overflow: hidden;
  .line {
    height: 20px;
  }
  .butbox {
        text-align: center;
        margin-top: 144px;
        .butsp {
            display: inline-block;
            width: 600px;
            height: 88px;
            line-height: 88px;
            background-image: linear-gradient(-90deg, #999999 0%, #c9c9c9 100%), linear-gradient( #ff6419, #ff6419);
            background-blend-mode: normal, normal;
            border-radius: 44px;
            font-size: 36px;
            color: #fff;
            letter-spacing: 10px;
        }
  }
  .constType {
        padding: 0 30px;
        background: #fff;
        .type_title {
            height: 88px;
            line-height: 88px;
            font-size: 30px;
            color: #333;
        }
        .type_item {
            height: 88px;
            line-height: 88px;
            font-size: 30px;
            color: #333;
            .item_selicon {
                width: 30px;
                height: 30px;
                vertical-align: middle;
            }
            span {
                vertical-align: middle;
            }
        }
    }
  .box {
    position: relative;
    padding: 0 30px;
    background: #fff;
    .inpu {
      width: 650px;
      height: 88px;
      font-size: 32px;
      font-family: PingFang-SC-Regular;
      color: #333;
      border: 0;
      outline: none;
    }
    .icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    .get-code {
      position: absolute;
      right: 0;
      top: 0;
      width: 240px;
      height: 88px;
      line-height: 88px;
      font-size: 32px;
      font-family: PingFang-SC-Regular;
      z-index: 1;
      text-align: center;
    }
  }
}
</style>
