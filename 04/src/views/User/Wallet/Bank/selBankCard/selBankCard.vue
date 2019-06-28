<template>
    <div class="selBankCard">
      <header>
			<i class="icon-left" @click="$router.go(-1)"></i>
			<div class="title">选择银行卡</div>
	  </header>
    <!-- <scroll class="wrapper engbox"
            :probeType="probeType" 
            :pullup = "true"
            :pulldown = "true"
            :beforeScroll = "true"
            :scrollX = "true" 
            :data = "englist"
            :refreshScroll = "true"
            ref="engwrapperScroll" >
            <div class="box">
                <div class="eng_item" :style="item.sel?'color:#ff6419':''" v-for="(item, index) in englist" :key="index" @click="selBank(item, index)">
                    {{item.fn}}
                </div>
            </div>
      </scroll> -->
      <div class="engbox">
           <div class="eng_item" :style="item.sel?'color:#ff6419':''" v-for="(item, index) in englist" :key="index" @click="scrbank(item, index)">
                    {{item.fn}}
           </div>
      </div>
      <div class="bscroll" ref="bscroll">
            <div class="box">
                <div class="slider" :id="index" v-for="(item, index) in bankList" :key="index" v-cloak ref="slider">
                    <div class="item_title">{{index}}</div>
                    <div class="slider_item" v-for="(citem, cindex) in item" :key="cindex" @click="selectbank(citem)">
                        <div class="bankName">{{citem.bankName}}</div>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
      </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import { mapGetters, mapMutations, mapActions } from 'Vuex';
export default {
    data() {
        return {
            englist: [
                {
                    fn: 'A',
                    sel: true
                },
                {
                    fn: 'B',
                    sel: false
                },
                {
                    fn: 'C',
                    sel: false
                },
                {
                    fn: 'D',
                    sel: false
                },
                {
                    fn: 'F',
                    sel: false
                },
                {
                    fn: 'G',
                    sel: false
                },
                {
                    fn: 'H',
                    sel: false
                },
                {
                    fn: 'J',
                    sel: false
                },
                {
                    fn: 'K',
                    sel: false
                },
                {
                    fn: 'L',
                    sel: false
                },
                {
                    fn: 'N',
                    sel: false
                },
                {
                    fn: 'P',
                    sel: false
                },
                {
                    fn: 'Q',
                    sel: false
                },
                {
                    fn: 'T',
                    sel: false
                },
                {
                    fn: 'W',
                    sel: false
                },
                {
                    fn: 'X',
                    sel: false
                },
                {
                    fn: 'Y',
                    sel: false
                },
                {
                    fn: 'Z',
                    sel: false
                }
            ]
    }
},
 computed: {
    ...mapGetters('bank', ['selbank', 'bankList'])
  },
created() {
},
mounted(){
    this.$nextTick(() => {
        let bscrollDom = this.$refs.bscroll;
        this.aBScroll = new BScroll(bscrollDom,{})
    })   
},
methods: {
    ...mapActions('bank',['selBank']),
    scrbank(item) {
        this.englist.map(i=> {
            i.sel = false;
        })
        item.sel  = true;
        this.aBScroll.scrollToElement(document.getElementById(`${item.fn}`),300);
    },
    selectbank(item) {
        this.selBank(item);
        this.$router.go(-1);
    }
}
}
</script>
<style lang="scss" scoped>
    @import '../../../../../styles/header.scss';
    @import './styles/selBankCard.scss';
</style>


