<template>
    <div class="limitAlert">
        <div class="box">
            <div class="title">使用此功能需要开启VIP权限</div>
            <div class="skt" @click="skt">申请开通</div>
            <a :href="'tel:'+phone" class="call">拨打电话</a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'limitAlert',
    data() {
        return {
            phone: JSON.parse(localStorage.getItem('userInfo')).mobile
        }
    },
    methods: {
        skt() {
            this.$emit('skt');
        },
    }
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
            width: 540px;
            height: 400px;
            background-color: #ffffff;
            border-radius: 8px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -200px;
            margin-left: -270px;
            padding-top: 96px;
            text-align: center;
            .title {
                font-size: 30px;
                color: #333;
                margin-bottom: 64px;
                font-weight: bold;
            }
            .skt {
                width: 396px;
                height: 72px;
                background-color: #ff6419;
                border-radius: 36px;
                text-align: center;
                line-height: 72px;
                margin: 0 auto;
                font-size: 26px;
                color: #fff;
            }
            .call {
                width: 396px;
                height: 72px;
                background-color: #f2f2f2;
                border-radius: 36px;
                text-align: center;
                line-height: 72px;
                margin: 0 auto;
                margin-top: 24px;
                display: block;
                font-size: 26px;
                color: #ff6419;
            }
        }
    }
</style>
