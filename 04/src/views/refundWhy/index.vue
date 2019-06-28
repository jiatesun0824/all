
<!--退款原因页面-->
<template>
  <div class="refundWhy">
    <div class="header">
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">申请退款</div>
    </div>
    <scroll :probeType="probeType"
            ref="scroll"
            :listenScroll="listenScroll">
      <div class="refundWhy-content">
         <div class="refundbox">
            <h1 class="refundtitle">您为什么退款？</h1>
            <div class="checkbox" v-for="(item,index) in checkList" :key="index" @click="checkAct(index,item.text)">
                <p class="checktext">{{item.text}}</p>
                <span :class="{'check':true,'active':index==current}"></span>
            </div>
            <div class="other" v-show="isOther">
                <div class="otherbox">  
                    <!-- <h2 class="othertext">其他原因</h2> -->
                    <textarea class="otherarea" maxlength="50" placeholder="请输入原因" @input="otherChange" v-model="otherTextarea"></textarea>
                    <span class="limitext">{{num}}/50个字</span>
                </div>
            </div>
         </div>
         <button @click="Test" :class="{'commitBtn':true,'commitActive':!isCommit}" :disabled="isCommit">
             提交
         </button>
      </div>
    </scroll>
  </div>
</template>

<script>
  import minix from "@/mixins/mixin";
  import { behaviorTotal } from 'api/home';
  export default {
    mixins: [minix],
    name: "refundWhy",
    components:{

    },
    data(){
      return{
        isOther:false,
        otherTextarea:'',
        current:1000,
        isCommit:true,
        commitText:'',
        num:0,
        checkList:[
            {
                'text':'业主无房',
            },
            {
                'text':'业主不装修',
            },
            {
                'text':'业主直接挂断/无人接听，重复拨打无反应',
            },
            {
                'text':'其他原因'
            }
        ]
      }
    },
    mounted(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.$refs.scroll.refresh()
        },200)
      })
      console.log(this.$route.query.orderId)
    },
    methods:{
        otherChange(){
            this.num = this.otherTextarea.length;
           if(this.otherTextarea==''){
                  this.isCommit = true;
             }else{
                 this.isCommit = false;
             }
        },
     checkAct(index,text){
         if(text=='其他原因'){
             this.isOther =true;
             this.current = index;
             this.commitText = text;
             this.isCommit = true;
         }else{
             this.otherTextarea ='';
             this.isOther = false;
             this.current = index;
             this.isCommit = false;
             this.commitText = text;
         }
     },
     Test(){
        // console.log( this.commitText);
        this.API.applicationRefund({
            orderId:this.$route.query.orderId,
            refundReason:this.commitText=='其他原因'?this.otherTextarea:this.commitText
        }).then(res=>{
            if(res.message=='提交退款申请成功') {
                this.$toast(res.message);
                this.$router.go(-1);
            }
        })
     }
    }
  }
</script>

<style lang="scss" scoped>
  .refundWhy {
    height: 100%;
    overflow: hidden;
    background: #f7f7f7;
    .header{
      background-color: #ffffff;
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
    }
    .refundWhy-content{
        .refundbox{
            margin: 30px;
            background: white;
            padding-bottom: 40px;
            .refundtitle{
                height: 110px;
                line-height: 110px;
                text-align: center;
                font-size: 32px;
                color: #333333;
            }
            .checkbox{
                height: 110px;
                margin:0 40px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #f3f3f3;
                .checktext{
                    font-size: 28px;
                    color: #333333;
                    flex: 1;
                }
                .check{
                     width: 28px;
                     height: 28px;
                     border-radius: 50%;
                     border: 1px solid #999999;
                     flex-basis: 28px;
                     position: relative;
                }
                .active{
                    background: #ff6419;
                    border-bottom: 1px solid #ff6419;
                }
                .active::after{
                   position: absolute;
                   content: '';
                   background: white;
                   border-radius: 50%;
                   left: 50%;
                   top: 50%;
                   transform: translate(-50%, -50%);
                   width: 14px;
                   height: 14px;
                   display: inline-block;
                }
            }
            .other{
                margin-top: 20px;
                .otherbox{
                    margin:0 40px;
                    position: relative;
                    .othertext{
                        font-size: 28px;
                        color: #333333;
                        height: 100px;
                        line-height: 100px;
                    }
                    .otherarea{
                        background: #fbfbfb;
                        height: 200px;
                        width: 100%;
                        font-size: 28px;
                        color: #333333;
                        text-indent: 24px;
                        line-height: 30px;
                        padding: 20px 20px 0 20px;
                        box-sizing: border-box;
                    }
                    .limitext{
                        color:#999999;
                        font-size: 24px;
                        position:absolute;
                        right: 17px;
                        bottom: 15px;
                        display: inline-block;
                    }
                }
            }
        }
        .commitBtn{
            width: 690px;
            height: 72px;
            background: #ffd6c2;
            color: white;
            text-align: center;
            line-height: 72px;
            border-radius: 36px;
            margin: 40px auto;
            font-size: 28px;
            border: none;
            display: block;
        }
        .commitActive{
             background: #ff6419;
        }
    }
  }
</style>
