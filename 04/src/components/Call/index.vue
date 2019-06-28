<template>
  <div class="callBox" v-show="callShow">
    <div class="main">
     <img class="callIcon" src="./images/phone-02@2x.png" alt="">
     <div class="box">
         <div class="tit">拨打业主电话</div>
         <div class="phone">{{phone}}</div>
         <div class="butBox">
             <div class="cancle" @click="closeCall">取消</div>
             <a class="call" @click="callPhone" :href="'tel:'+phone">呼叫</a>
         </div>
     </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'call',
    props: {
      callShow: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        default: ''
      }
    },
    methods: {
        closeCall() {
            this.$emit('closeCall')
        },
        callPhone() {
            this.$emit('callPhone')
        }
    }
  }

</script>
<style lang="scss" scoped>
    .callBox {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba($color: #000000, $alpha: 0.3);
        .main {
            width: 560px;
            height: 352px;
            position: absolute;
            left: 50%;
            margin-left: -280px;
            top: 50%;
            margin-top: -176px;
            .callIcon {
                display: block;
                width: 120px;
                height: 120px;
                position: absolute;
                top: 0;
                left: 50%;
                margin-left: -60px;
                z-index: 1;
            }
            .box {
                position: absolute;
                top: 60px;
                left: 0;
                width: 100%;
                height: 2.9rem;
                background-color: #ffffff;
                border-radius: 20px;
                padding-top: 88px;
                .tit {
                    font-size: 28px;
                    color: #999;
                    text-align: center;
                } 
                .phone {
                    font-size: 28px;
                    color: #333;
                    text-align: center;
                    margin-top: 15px;
                    margin-bottom: 29px;
                }
                .butBox {
                    display: flex;
                    justify-content: space-around;
                    div, a {
                        width: 50%;
                        height: 110px;
                        line-height: 110px;
                        text-align: center;
                        font-size: 32px;
                        color: #999;
                    }
                    .call {
                        color: #ff6419;
                    }
                }
            }
        }
    }
</style>
