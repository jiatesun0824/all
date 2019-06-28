<template>
  <div class="bank">
      <header>
			<i class="icon-left" @click="$router.go(-1)"></i>
			<div class="title">银行卡</div>
	  </header>
      <scroll class="wrapper"
            :probeType="probeType" 
            :listenScroll="listenScroll" 
            :pullup = "true"
            :pulldown = "true"
            :beforeScroll = "true"
            :scrollX = "true" 
            :data = "bankCard"
            :refreshScroll = "true"
            @pulldown="pulldown"
            @scrollToEnd="loadmore"
            ref="wrapperScroll">
            <div class="box">
                <div class="item" v-for="(item, index) in bankCard" :key="index" v-cloak>
                    <div class="asiteleft">
                        <div class="itemimgbox">
                             <img class="itemimg" src="../images/card_logo_nor.png" alt="">
                        </div>
                    </div>
                    <div class="asiteright">
                        <div class="title">
                            <span class="name">{{item.bankName}}</span> <img @click="deletebank(item)" class="delete" src="../images/card_icon_delete.png" alt="">
                        </div> 
                        <div class="tit">储蓄卡</div>
                    </div>
                    <div class="cardnum">
                            <span class="x">**** **** **** </span>
                            <span>{{item.bankNumber}}</span>
                    </div>
                </div>
                <div class="additem" @click="addbank" v-if="bankCard.length==0">
                    <div class="box">
                        <img class="add" src="../images/card_icon_add.png" alt="">  <span>添加银行卡</span>
                    </div>
                </div>
            </div>
      </scroll>

  </div>
</template>
<script>
import mixins from "@/mixins/mixin";
import { mapGetters, mapMutations, mapActions } from 'Vuex';
export default {
  mixins: [mixins],
    //银行卡列表
  data(){
      return{
          bankCard: []
      }
  },
  computed: {
    ...mapGetters('bank', ['haveBank'])
  },
  created(){
      this.getBanklist()
  },
  methods:{
      ...mapActions('bank', ['setHaveBank']),
      pulldown() {

      },
      loadmore() {

      },
    //   去添加银行卡
      addbank(){
        this.$router.push("/user/wallet/addbank")
      },
      deletebank(item) {
          this.$confirm({
              title: '提示',
              msg: '确定解除绑定该银行卡吗？'
            })
            .success(instance => {
              instance.close();
              this.API.unBind(item.id).then(res=> {
                console.log(res);
                this.getBanklist();
              })
            })
      },
      getBanklist() {
          this.API.getbanklist().then(res=> {
              if(res.status) {
                  this.setHaveBank(true);
                  if(res.obj.length>0) {
                      this.bankCard = res.obj;
                  }else {
                      this.bankCard = [];
                  }
              }else {
                  this.bankCard = [];
                  this.setHaveBank(false);
              }
          })
      }
  }
}
</script>
<style lang="scss" scoped>
    @import '../../../../styles/header.scss';
    @import './styles/bank.scss';
</style>

