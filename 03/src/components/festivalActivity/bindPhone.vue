<template>
  <transition name="slide-fade">
    <div class="dialog">
      <div class="bindPhone" v-show="dialog.bindPhone">
          <div class="title">绑定手机号</div>
          <div class="tip">绑定成功后，拼图自动到账</div>
          <div class="submitform">
              <input type="number" placeholder="请输入充值手机号" class="phone" v-model="phone" oninput="if(value.length>11) value=value.slice(0,11)">
              <div class="codeBox">
                <input type="number" placeholder="请输入验证码" class="code" v-model="code" oninput="if(value.length>6) value=value.slice(0,6)">
                <div class="getCode" @click="getCode" :class="{'active':active}">{{codeMsg}}</div>
              </div>
              <div class="btn" :class="{'btnActive':confirmBtn}" @click="confirm">确认绑定</div>
          </div>
          <i class="ic_arrow_close" @click="setDialog({ bindPhone:false })"></i>
      </div>
      <div class="mask"  v-show="dialog.bindPhone"></div>
    </div>
  </transition>
</template>

<script>
    import festivalActivity from "@/mixin/festivalActivity"
    import { validatePhone } from "@/utils/validate"
    export default {
        name: "bindPhone",
        mixins:[festivalActivity],
        data(){
          return{
            code:'',
            phone:'',
            active:false,
            codeMsg:'获取验证码'
          }
        },
      watch:{
        phone(val){
          val ? this.active=true :  this.active=false;
        }
      },
      computed:{
        confirmBtn(){
           if(this.phone&&this.code){
             return true
           }else{
             return false
           }
        }
      },
        methods:{
          getCode(){
             if(this.active){
               if(validatePhone(this.phone)){
                 this.codeMsg=='获取验证码' ? this.getCodeWay() : '';
               }else{
                 this.$toast('请输入正确的手机号');
               }
             }
          },
          getCodeWay(){ //获取验证码
             this.API.getSms({phoneNumber:this.phone}).then(res=>{
                  if(res.success){
                     this.$toast('获取验证码成功!');
                     this.timer(60); //倒计时

                  }else{
                    this.$toast(res.message)
                  }
             })
          },
          timer(times){
            let ts=setInterval(()=>{
               if(times<=0){
                 clearInterval(ts);
                 this.codeMsg='获取验证码';
               }else{
                 times=times-1;
                 this.codeMsg=times+'s后获取';
               }
             },1000)
          },
          confirm(){ //绑定手机号
            if(this.confirmBtn){
              this.API.bindingMobile({activityId:this.urlParams.activityId,phone:this.phone,code:this.code}).then(res=>{
                  if(res.success){
                     this.setDialog({ bindPhone:false});
                    setTimeout(()=>{
                      this.setDialog({ getCards:true});
                    },500);
                    this.setSuccessCards(this.imgList.filter(item=>item.name==res.obj));//成功获得的卡片
                  }else{
                    this.$toast(res.message)
                  }
              })
            }
          }
        }
    }
</script>

<style scoped lang="scss">
  .bindPhone{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 10;
    width: 580px;
    background-color: #ffffff;
    border-radius: 20px;
    padding: 40px 45px;
    box-sizing: border-box;
    .title{
      font-size: 32px;
      color: #333333;
      text-align: center;
    }
    .tip{
      color: #999999;
      font-size: 24px;
      line-height: 48px;
      text-align: center;
    }
    .submitform{
      margin-top: 60px;
       .phone{
         width: 100%;
         height: 88px;
         background-color: #f5f5f5;
         border-radius: 6px;
         text-indent: 32px;
         color: #333;
         font-size: 28px;
         &::placeholder{
           color: #999999;
         }
       }
      .codeBox{
        margin-top: 24px;
        display: flex;
        height: 88px;
        background-color: #f5f5f5;
        border-radius: 6px;
        .code{
          width: 280px;
          background-color: #f5f5f5;
          text-indent: 32px;
          &::placeholder{
            color: #999999;
          }
        }
        .getCode{
          flex: 1;
          line-height: 88px;
          text-align: center;
          color: #999999;
          font-size: 28px;
          box-sizing: border-box;
          &:before{
            content: '';
            display: inline-block;
            background-color: #e0e0e0;
            width: 2px;
            height: 32px;
            vertical-align: middle;
            position: relative;
            left: -32px;
          }
        }
        .active{
            color: #c22f3d;
        }
      }
      .btn{
        width: 100%;
        height: 88px;
        background-color: #c22f3d;
        border-radius: 6px;
        line-height: 88px;
        text-align: center;
        font-size: 32px;
        color: rgba(255,255,255,0.2);
        margin-top: 30px;
        font-weight: bold;
      }
      .btnActive{
         color: #fff;
      }
    }
    .ic_arrow_close{
      position: absolute;
      display: block;
      width: 80px;
      height: 80px;
      background: no-repeat center url("/static/image/festivalActivity/spring_icon_close_02.png");
      background-size: 70%;
      right: 0;
      top: 0;
      &:active{
        opacity: .6;
      }
    }
  }
</style>
