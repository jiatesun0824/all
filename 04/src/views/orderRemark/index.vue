
<!--订单备注编辑页面-->
<template>
  <div class="orderRemark">
    <div class="header">
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">编辑</div>
      <span class="commitBtn" @click="UpdataRemarkEdit">确定</span>
    </div>
    <scroll :probeType="probeType"
            ref="scroll"
            :listenScroll="listenScroll">
      <div class="orderRemark-content">
          <textarea v-model="textRemark" maxlength="50" class="area" placeholder="请添加您对业主的备注" rows="12" @input="TextNum"></textarea>
          <span class="textNum">{{nowNum}}/50个字</span>
      </div>
    </scroll>
  </div>
</template>

<script>
  import minix from "@/mixins/mixin";
  import { behaviorTotal } from 'api/home';
  export default {
    mixins: [minix],
    name: "orderRemark",
    components:{

    },
    data(){
      return{
        nowNum:0,
        textRemark:''
      }
    },
    mounted(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.$refs.scroll.refresh()
        },200)
      })
      if(sessionStorage.getItem('remarkText')=='null'){
            this.textRemark = '';
        }else{
            this.textRemark = sessionStorage.getItem('remarkText');
        }
    },
    methods:{
       TextNum(){
           this.nowNum = this.textRemark.length;
       },
       UpdataRemarkEdit(){
           this.API.updateRemark({
               orderId:262,
               orderStatus:3,
               remark:this.textRemark
           }).then(res=>{
               console.log(res)
               this.$router.push('/refundDetail')
           })
       }
    },
  }
</script>

<style lang="scss" scoped>
  .orderRemark {
    height: 100%;
    overflow: hidden;
    .header{
      position: relative;
      .icon-left{
        position: absolute;
        left: 0;
        top: 0;
      }
      .title{
        height: 88px;
        line-height: 88px;
        text-align: center;
        font-size: 34px;
        color: #333333;
      }
      .commitBtn{
          font-size: 28px;
          color: #ff6419;
          position: absolute;
          right: 0;
          top: 0;
          height: 88px;
          text-align: center;
          width: 88px;
          line-height: 88px;
          display:block;
      }
    }
    .orderRemark-content{
        .area{
            position: relative;
            background: #f7f7f7;
            width: 90%;
            display: block;
            margin: 20px auto;
            color: #333333;
            text-indent: 30px;
            padding: 30px 20px 0 20px;
            font-size: 28px;
            box-sizing: border-box;
        }
        .textNum{
            position: absolute;
            bottom: 30px;
            right: 58px;
            font-size: 24px;
            color: #999999;
        }
    }
  }
</style>
