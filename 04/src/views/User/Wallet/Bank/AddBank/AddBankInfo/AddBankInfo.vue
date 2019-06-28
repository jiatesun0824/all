<template>
  <div class="addbankinfo">
      <header>
			<i class="icon-left" @click="$router.go(-1)"></i>
			<div class="title">填写信息</div>
	  </header>
      <div class="head" @click="$router.push('/user/wallet/selbankcard')">
          <span class="tit">银行卡</span>
          <span class="tit99" :style="selbank.bankName!=''?'color:#333':'color:#999'">{{selbank.bankName!=''?selbank.bankName:"请选择所属银行"}}</span>
          <img  class="item_j" src="../../../images/wallet_icon_more.png" alt="">
      </div>
      <div class="head_tit">
          请填写相关信息，后续只能添加该持卡人的银行卡
      </div>
      <div class="lsit" v-if="!haveBank">
          <div class="item">
              <span class="tit">姓名</span>
              <input v-model="bankdata.cardName" class="content inpu" type="text" placeholder="请输入姓名">
          </div>
          <div class="item">
              <span class="tit">证件类型</span>
              <span class="content">身份证</span>
          </div>
          <div class="item">
              <span class="tit">证件号</span>
              <input v-model="bankdata.cardNumber" class="content inpu" type="text" placeholder="请输入证件号">
          </div>
      </div>
      <div class="lsit">
          <div class="item">
              <span class="tit">支行名称</span>
              <input v-model="bankdata.bankNameInfo" class="content inpu" type="text" placeholder="请输入支行名称">
          </div>
          <div class="item bbnone">
              <span class="tit">手机号</span>
              <input v-model="bankdata.preMobile" class="content inpu" type="text" placeholder="请输入银行预留手机号">
          </div>
      </div>
       <div class="head_tit" @click="agree" style="background:none;line-hight:1.17333rem;">
           <img class="secicon" :src="agreeBool?agreeImgsel:agreeImgnor" alt="">同意
           <span style="color:#ff6419;" @click="$royter.push({path:'/Userprotocol',query:{title:'用户协议'}})">《用户协议》</span>
      </div>
      <div class="box">
          <span class="next" @click="next">下一步</span>
      </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'Vuex';
const phoneTest = /^[1][3-9][0-9]{9}$/;
const cardNumber = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
const isChinese =  /^[\u4e00-\u9fa5]+$/;
export default {
    
    // 录入银行卡持有人信息
  data() {
      return {
          agreeBool: false,
          agreeImgsel: require('../../../images/icon_select_sel.png'),
          agreeImgnor:  require('../../../images/icon_select_nor.png'),
          bankdata: {
              cardName: '',
              cardNumber: '',
              bankNameInfo: '',
              preMobile: '',
              bankNumber: this.$route.query.cardNum
          }
      }
  },
  computed: {
    ...mapGetters('bank', ['selbank', 'haveBank'])
  },
  created() {
      this.API.banklist().then(res=> {
            this.setBankList(res.obj);
      })
  },
  methods: {
      ...mapActions('bank',['setBankList']),
      agree() {
          this.agreeBool = !this.agreeBool;
      },
      next() {
        if(this.agreeBool) {
            let allsel = true;
                if (!this.haveBank) {
                    if(cardNumber.test(this.bankdata.cardNumber)) {
                        if (phoneTest.test(this.bankdata.preMobile)) {
                            if(isChinese.test(this.bankdata.bankNameInfo)) {
                                if(isChinese.test(this.bankdata.cardName)) {
                                    // for( let i in this.bankdata) {
                                    //     if(this.bankdata[i] == '') {
                                    //         allsel  = false;
                                    //     }
                                    // }
                                    allsel = true;
                                }else {
                                     allsel  = false;
                                    this.$toast('请输入中文姓名！')
                                }
                                
                            }else {
                                 allsel  = false;
                                this.$toast('请输入支行中文名称！')
                            }
                            
                        }else {
                             allsel  = false;
                            this.$toast('请输入正确的手机号!')
                        }
                    }else {
                         allsel  = false;
                        this.$toast('请输入正确的身份证号码!')
                    }
                }else {
                   if(isChinese.test(this.bankdata.bankNameInfo)) {
                       if(!phoneTest.test(this.bankdata.preMobile)) {
                            allsel  = false;
                            this.$toast('请输入正确的手机号!')
                       }
                   }else {
                        allsel  = false;
                        this.$toast('请输入支行中文名称！')
                   }
                }
            if(allsel) {
                this.bankdata.bankName = this.selbank.bankName;
                this.$router.push({
                    path: "/user/wallet/addbankphone",
                    query: {
                       bankdata: this.bankdata 
                    }
                    })
            }
        }else {
            this.$toast('请阅读并同意用户协议');
        }
      }
  }
}
</script>
<style lang="scss" scoped>
    @import '../../../../../../styles/header.scss';
    @import './styles/addBankInfo.scss';
</style>


