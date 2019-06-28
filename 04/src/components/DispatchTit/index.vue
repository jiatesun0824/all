<template>
    <div class="dispath" v-show="dispathShow">
       这里可以设置自动派单哟　　<span @click="closeDispath">✕</span>
    </div>
</template>
<script>
export default {
    name: 'dispatchtit',
    props:{
        dispathShow: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        closeDispath() {
            this.$emit('closeDispath');
        }
    }
}
</script>
<style lang="scss" scoped>
    .dispath {
    width: 4.946667rem;
    height: 0.746667rem;
    background-image: -webkit-linear-gradient(right, #5677e5 0%, #7f9bf9 100%), -webkit-linear-gradient(#88adf5, #88adf5);
    background-image: linear-gradient(-90deg, #5677e5 0%, #7f9bf9 100%), linear-gradient(#88adf5, #88adf5);
    background-blend-mode: normal, normal;
    border-radius: 0.373333rem 0 0.373333rem 0.373333rem;
    line-height: 0.746667rem;
    color: #fff;
    font-size: 0.266667rem;
    position: absolute;
    top: 0.85rem;
    z-index: 100;
    right: 0.653333rem;
    padding-left: 0.3rem;
    box-sizing: border-box;
    }
</style>

