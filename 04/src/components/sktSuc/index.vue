<template>
<div class="limitAlert">
    <div class="box">
            <div class="title" style="font-weight:bolder;">申请提交成功</div>
            <div class="tit">您的VIP权限申请已提交</div>
            <div class="tit">稍后会有客服与您联系</div>
    </div>
</div>
</template>
<script>
export default {
    name: 'skt',
}
</script>
<style lang="scss" scoped>
.limitAlert {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 21;
        .box {
            width: 500px;
            height: 300px;
            background-color: #ffffff;
            border-radius: 8px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -150px;
            margin-left: -250px;
            padding-top: 96px;
            text-align: center;
            .title {
                font-size: 30px;
                color: #333;
                margin-bottom: 50px;
                font-weight: bold;
            }
            .tit {
                font-size: 24px;
                color: #666;
                width:6rem;
                text-align: center;
                line-height: 36px;
                margin: 0 auto;
            }
        }
    }
</style>

