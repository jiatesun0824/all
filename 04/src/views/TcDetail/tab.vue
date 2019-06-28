<template>
    <div class="tab">
        <!-- <div class="header">
            <i class="icon-left" @click="back"></i>
            <div class="title">详情</div>
        </div> -->
        <div class="content-tab borderBottom">
                <span :class="yi?'active':''" @click="selFotterNav(0)">一键方案(20)</span>
                <span :class="ya?'active':''" @click="selFotterNav(1)">样板方案(20)</span>
                <span :class="fo?'active':''" @click="selFotterNav(2)">服务详情</span>
                <span :class="yo?'active':''" @click="selFotterNav(3)">用户评价</span>
        </div>
        <div class="box">
                    <div class="silder" v-for="(item, index) in silder" :key="index">
                            <img class="itemImg" src="./images/banner_01.png" alt="">
                    </div>
        </div>
    </div>
</template>
<script>
import minix from '@/mixins/mixin'
import { mapGetters, mapActions } from 'Vuex'
export default {
    mixins:[minix],
    data() {
        return {
            // 顶部点击
            tabIndex: 0,
            yi: true,
            ya: false,
            fo: false,
            yo: false,

            // 类型
            silder: [
                {
                    id:''
                },
                {
                    id:''
                }
                ,
                {
                    id:''
                }
                ,
                {
                    id:''
                },
                {
                    id:''
                }
            ]
        }
    },
    methods: {
        back() {
            this.$emit('back')
        },
        selFotterNav(index){
            this.tabIndex = index;
            switch (index) {
                case 0:this.yi = true;this.ya = false;this.fo = false;this.yo = false;break;
                case 1:this.yi = false;this.ya = true;this.fo = false;this.yo = false;break;
                case 2:this.yi = false;this.ya = false;this.fo = true;this.yo = false;break;
                case 3:this.yi = false;this.ya = false;this.fo = false;this.yo = true;break;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    @import './styles/tab.scss';
</style>

