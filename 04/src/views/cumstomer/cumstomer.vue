<template>
    <div class="cumstomer">
        <header>
            <i class="icon-left" @click="goBack"></i>
            <div class="title">联系客服</div>
        </header>
        <img class="headerImg" src="../../../static/images/cum_header_bg_01.png" alt="">
        <div class="title">
            <span class="titleicon">■</span><span class="titletext">客服热线</span>
        </div>
        <div class="tit">
            0755-23895307
        </div>
        <div class="title">
            <span class="titleicon">■</span><span class="titletext">服务时间</span>
        </div>
        <div class="tit" style="line-height: 0.8rem;">
            周一至周五：9:00-20:30<br />
            　　周六日：9:00-17:00
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'Vuex';
export default {
    data() {
        return {
            fromPage: ''
        };
    },
    methods: {
        ...mapMutations('common', ['SET_TOKEN', 'SET_USER_INFO']),
        goBack() {
            this.fromPage !== 'message' && this.SET_TOKEN(null);
            this.$router.go(-1);
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => { vm.fromPage = from.name; })
    }
};
</script>
<style lang="sass" scoped>
   @import '../../styles/header.scss'
   @import './styles/cumstomer.scss'
</style>
