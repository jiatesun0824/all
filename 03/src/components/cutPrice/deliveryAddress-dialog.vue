<template>
  <transition name="slide-fade">
    <div class="deliveryAddress" v-show="deliveryAddressDialog">
      <div class="title">填写收货信息</div>
      <div class="deliveryAddress-input">
         <input type="text" placeholder="请输入收货人姓名" class="deliveryName" v-model="deliveryName" maxlength="10">
         <input type="number" oninput="if(value.length>11) value=value.slice(0,11)" placeholder="请输入手机号码" class="deliveryPhone" v-model="phoneNumber">
         <div class="code">
            <input type="number" placeholder="输入验证码" class="inputCode" v-model="inputCode">
            <div class="getCode" @click="getCode">{{code | filter}}</div>
         </div>
        <textarea rows="4" class="detailAddress" placeholder="详细地址（街道、小区、乡镇、村）" v-model="detailAddress"></textarea>
      </div>
      <div class="submit" @click="submitWay">提交信息</div>
      <i class="ic_close" @click="setDialog({deliveryAddressDialog:false});$parent.mask=false"></i>
    </div>
  </transition>
</template>

<script>
  import { mapGetters,mapActions } from 'Vuex'
  export default {
    name: "deliveryAddress",
    data(){
      return{
        deliveryAddress:false,
        deliveryName:'',
        phoneNumber:'',
        detailAddress:'',
        inputCode:'',
        timeout:'',
        code:'获取验证码',
        time:''
      }
    },
    computed:{
      ...mapGetters('cutprice',['activityParam','deliveryAddressDialog'])
    },
    created(){

    },
    filters:{
      filter(value){
         if(value!='获取验证码'){
           return value+'秒'
         }else {
           return value
         }
      }
    },
    methods:{
      ...mapActions('cutprice',['setDialog','setActivityParam']),
      getCode(){
         if(this.deliveryName==''||this.deliveryName==null){
            this.$parent.toast=true;
            this.$parent.msg='请输入收货人姓名';
            this.move();
         }else if(this.phoneNumber==''||this.phoneNumber==null){
           this.$parent.toast=true;
           this.$parent.msg='请输入手机号码';
           this.move();
         }else if(!/^(13[0-9]|14[56789]|15[0-3,5-9]|16[6]|17[021345678]|18[0-9]|19[89])\d{8}$/.test(this.phoneNumber)){
           this.$parent.toast=true;
           this.$parent.msg='请输入正确的手机号码';
           this.move();
         }else{
           this.API.getSms({phoneNumber:this.phoneNumber,msgId:'123'}).then(res=>{
              if(res.success){
                this.$parent.toast=true;
                this.$parent.msg='发送成功';
                this.move();
                this.timeInt();//60s 倒计时
              }else {
                this.$parent.toast=true;
                this.$parent.msg='发送失败';
                this.move();
              }
           })
         }

      },
      move(){
        clearTimeout(this.timeout);
          this.timeout=setTimeout(()=>{
          this.$parent.toast=false;
          this.$parent.msg='';
        },2500)
      },
      timeInt(){
          this.code=60;
          clearInterval(this.time);
          this.time=setInterval(()=>{
            if(this.code>=1){
              this.code=this.code-1;
            }else {
              clearInterval(this.time);
              this.code='获取验证码';
            }
          },1000)
      },
      submitWay(){
        if(this.deliveryName==''||this.deliveryName==null){
          this.$parent.toast=true;
          this.$parent.msg='请输入收货人姓名';
          this.move();
        }else if(this.phoneNumber==''||this.phoneNumber==null){
          this.$parent.toast=true;
          this.$parent.msg='请输入手机号码';
          this.move();
        }else if(!/^(13[0-9]|14[56789]|15[0-3,5-9]|16[6]|17[021345678]|18[0-9]|19[89])\d{8}$/.test(this.phoneNumber)){
          this.$parent.toast=true;
          this.$parent.msg='请输入正确的手机号码';
          this.move();
        }else if(this.inputCode==''||this.inputCode==null){
          this.$parent.toast=true;
          this.$parent.msg='请输入验证码';
          this.move();
        }else if(this.detailAddress==''||this.detailAddress==null){
          this.$parent.toast=true;
          this.$parent.msg='请输入详细地址';
          this.move();
        }else {
           this.API.addAwardRecord({regId:this.activityParam.registrationId,receiver:this.deliveryName,mobile:this.phoneNumber,validationCode:this.inputCode,address:this.detailAddress}).then(res=>{
              if(res.success){
                this.$parent.mask=false;
                this.setDialog({deliveryAddressDialog:false});
                this.setActivityParam(Object.assign(this.activityParam,{statusCode:'AWARDED'}));
                setTimeout(()=>{
                  this.$parent.mask=true;
                  this.setDialog({submitDialog:true});
                },500)
              }else {
                this.$parent.toast=true;
                this.$parent.msg=res.message;
                this.move();
              }
           })
        }
      }
    },
    destroyed(){
      clearTimeout(this.timeout);
      clearInterval(this.time);
    }
  }
</script>

<style scoped lang="scss">
  .deliveryAddress{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 620px;
    margin-left: -310px;
    margin-top: -359px;
    background-color: #fff;
    border-radius: 10px;
    /*background: no-repeat center url("/static/image/cutPrice/pop_bg.png");*/
    /*background-size: 100%;*/
    z-index: 11;
    .title{
      height: 100px;
      line-height: 100px;
      font-size: 36px;
      color: #333333;
      text-align: center;
      border-bottom: 1px solid #F5F5F5;
    }
    input::-webkit-input-placeholder{
      color:#999;
    }
    .deliveryAddress-input{
       padding: 0 40px;
      input{
         height: 80px;
        width: 100%;
         line-height: 80px;
         font-size: 28px;
        color: #333;
        margin-top: 20px;
        border-bottom: 1px solid #F5F5F5;
      }
      .code{
        display: flex;
         .inputCode{
             width: 320px;
         }
        .getCode{
          color: #ff6419;
          font-size: 28px;
          line-height: 100px;
          text-align: center;
          &:before{
            content: '| ';
            display: inline-block;
            margin-right: 40px;
            color: #e8e8e8;
          }
          &:active{
            opacity: .6;
          }
        }
      }
      .detailAddress{
         width: 100%;
         margin-top: 40px;
        border-bottom: 1px solid #F5F5F5;
        font-size: 28px;
        &::-webkit-input-placeholder{
          color:#999;
        }
      }
    }
    .submit{
      width: 540px;
      height: 80px;
      background-image: linear-gradient(0deg,
        #fea700 0%,
        #fff671 100%),
      linear-gradient(
          #29cccc,
          #29cccc);
      background-blend-mode: normal,
      normal;
      border-radius: 40px;
      text-align: center;
      line-height: 80px;
      margin: 40px auto;
      font-size: 36px;
      color: #8d2121;
      &:active{
        opacity: .6;
      }
    }
    .ic_close{
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      width: 80px;
      height: 80px;
      background: no-repeat center url("/static/image/cutPrice/pop_nav_icon_close.png");
      background-size: 35%;
      &:active{
        opacity: .6;
      }
    }
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
