<template>
  <div class="addbank">
    <header>
			<i class="icon-left" @click="$router.go(-1)"></i>
			<div class="title">添加银行卡</div>
	  </header>
    <div class="tit">请绑定企业或者本人账号</div>
    <div class="haveBank" v-if="haveBank">
      <span>持卡单位/人</span>
      <span class="bankPerName">{{bankdata.cardName}}</span>
    </div>
    <div class="inpu">
      <span class="inpu-tit">卡号</span>
      <input v-model="cardNum" placeholder-class="pinpu" placeholder="仅支持储蓄卡" type="number" name="" id="">
    </div>
    <div class="box">
        <span class="next" @click="next">下一步</span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'Vuex';
export default {
  // 添加银行卡
  data(){
      return{
        cardNum: '',
        bankdata: {}
      }
  },
  computed: {
    ...mapGetters('bank', ['haveBank'])
  },
  created(){
    if(this.haveBank) {
      this.API.checkisbind().then(res=> {
        this.bankdata = res.obj;
      })
    } 
  },
  methods:{
    // 去添加银行卡信息
    next(){
      if(this.cardNum!='') {
        if(this.luhnCheck(this.cardNum)) {
          this.$router.push({
            path: "/user/wallet/addbankinfo",
            query: {
              cardNum: this.cardNum
            }
          })
        }else {
          this.$toast('请输入正确的银行卡号');
        }
      }else {
        this.$toast('请输入银行卡号');
      }
    },
     //银行卡号码检测
     luhnCheck(bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9
        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
                else arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
            arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算luhn值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhn = 10 - k;

        if (lastNum == luhn) {
            return true;
        } else {
            return false;
        }
    }
  }
  
}
</script>
<style lang="scss" scoped>
    @import '../../../../../styles/header.scss';
    @import './styles/addBank.scss';
</style>


