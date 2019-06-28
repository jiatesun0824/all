<template>
  <div class="edit-nick">
    <div v-if="$route.params.type == '昵称'">
      <header>
        <i class="icon-left" @click="$router.back()"></i>
        <div class="title">编辑昵称</div>
        <div class="right" :style="haveChange?'':'color:#999'" @click="save">保存</div>
	    </header>
      <div class="line"></div>
      <div class="box">
          <input type="text" minlength="4" maxlength="16" name="" :disabled="nickDisable" v-model="nickValue" class="inpu"> <img class="icon" @click="clear" src="../../images/porfile_icon_delete.png" alt="">
      </div>
      <div class="tit">（4～16个字符，一个汉字为2个字符）</div>
    </div>
    <div v-if="$route.params.type == '邀请码'">
      <header>
        <i class="icon-left" @click="$router.back()"></i>
        <div class="title">邀请码</div>
        <div class="right" :style="haveChange?'':'color:#999'" @click="saves">保存</div>
      </header>
      <div class="line"></div>
      <div class="box">
        <input type="number" maxlength="6" oninput="if(value.length>6)value=value.slice(0,6)" :disabled="nickDisable" v-model="usedInvitationCode" class="inpu"> <img class="icon" @click="clear" src="../../images/porfile_icon_delete.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import { editUserInfo2b } from "@/api/user";

export default {
  data() {
    return {
      usedInvitationCode: '',
      nickValue: "",
      haveChange: false,
      nickDisable: false,
      data: {
        nickName: undefined,
        sex: "",
        age: "",
        mobile: "",
        password: "",
        areaId: "",
        usedInvitationCode: undefined // 邀请码
      }
    };
  },
  watch: {
    usedInvitationCode(value) {
      if (value != '') {
        this.haveChange = true;
      }
    },
    nickValue(value) {
      if (value != "") {
        this.haveChange = true;
        var l = this.nickValue.length;
        var blen = 0;
        for (var i = 0; i < l; i++) {
          if ((this.nickValue.charCodeAt(i) & 0xff00) != 0) {
            blen++;
          }
          blen++;
        }
        if (blen >= 16) {
          //this.nickDisable = true
        } else {
          //this.nickDisable = false;
        }
      }
    }
  },
  methods: {
    clear() {
      this.usedInvitationCode = '';
      this.nickValue = "";
      this.haveChange = false;
      this.nickDisable = false;
    },
    saves() {
      if (this.usedInvitationCode.length > 0) {
        this.data.usedInvitationCode = this.usedInvitationCode;
        editUserInfo2b(this.data).then(res => {
          if (res.success) {
            this.$toast("修改成功");
            setTimeout(() => {
              this.$router.back();
            }, 2000);
          }
        });
      }
    },
    save() {
      var that = this;
      if (this.haveChange) {
        var l = this.nickValue.length;
        var blen = 0;
        for (var i = 0; i < l; i++) {
          if ((this.nickValue.charCodeAt(i) & 0xff00) != 0) {
            blen++;
          }
          blen++;
        }
        if (this.nickValue != "" && blen >= 4 && blen <= 16) {
          this.data.nickName = this.nickValue;
          editUserInfo2b(this.data).then(res => {
            if (res.success) {
              this.$toast("修改成功");
              setTimeout(() => {
                this.$router.back();
              }, 2000);
            }
          });
        } else {
          this.$toast("请输入正确的昵称");
        }
      } else {
        this.$toast("请先填写信息");
      }
    }
  },
  activated() {
		this.nickValue = ''
	}
};
</script>
<style lang="scss" scoped>
@import "../../../../styles/header.scss";
</style>
<style lang="scss" scoped>
.edit-nick {
  height: 100%;
  background: #f5f5f5;
  box-sizing: border-box;
  padding-top: 88px;
  overflow: hidden;
  .icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .line {
    height: 20px;
  }
  .box {
    display: flex;
    align-items: center;
    padding: 0 30px;
    background: #fff;
    .inpu {
      width: 660px;
      height: 88px;
      outline: none;
      border: 0;
      font-size: 32px;
      font-family: PingFang-SC-Regular;
      color: #333;
    }
  }
  .tit {
    margin-top: 34px;
    padding: 0 30px;
    font-size: 24px;
    font-family: PingFang-SC-Regular;
    color: #999;
  }
}
</style>


