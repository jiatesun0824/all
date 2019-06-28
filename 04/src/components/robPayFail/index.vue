<template>
    <div class="payFail" v-show="robPayFailShow">
      <div class="payFail_box">
        <div class="close_icon">
            <img src="./images/icon-delete@2x.png" alt="" @click="closePayFail">
        </div>
       <img src="./images/cancel@2x.png" class="failImg" alt="">
       <div class="tit">
           您的度币不足，充值失败！
       </div>
       <div class="goBut" @click="goBut">
          去充值
       </div>
      </div>
    </div>
</template>
<script>
export default {
    name: 'robpayfail',
    props: {
        robPayFailShow: ''
    },
    methods: {
        closePayFail() {
            this.$emit('closePayFail');
        },
        goBut() {
            this.$router.push('/paypage');
        }
    }
}
</script>
<style lang="scss" scoped>
    .payFail {
        width: 100%;
        height: 100%;
        background: rgba($color: #000000, $alpha: 0.3);
        position: absolute;
        top: 0;
        left: 0;
        .payFail_box {
            width: 560px;
            height: 400px;
            background-color: #ffffff;
            border-radius: 20px;
            position: absolute;
            top: 50%;
            margin-top: -200px;
            left: 50%;
            margin-left: -280px;
            .close_icon {
                text-align: right;
                margin-bottom: 30px;
                padding: 15px;
                img {
                    width: 30px;
                    height: 30px;
                }
            }
            .failImg {
                width: 87px;
	            height: 87px;
                display: block;
                margin: 0 auto;
            }
            .tit {
                font-size: 24px;
                color: #999;
                text-align: center;
                margin-bottom: 56px;
                margin-top: 32px;
            }
            .goBut {
                width: 448px;
                height: 72px;
                background-color: #ff6419;
                border-radius: 36px;
                line-height: 72px;
                text-align: center;
                color: #fff;
                font-size: 28px;
                margin: 0 auto;
            }
        }
    }
</style>


