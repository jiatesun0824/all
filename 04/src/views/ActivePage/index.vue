import scroll from "../../assets/js/scroll";
<template>
   <div class="activePage">
         <i class="icon-left" @click="$router.go(-1)"></i>
        <scroll :probeType="probeType"
                ref="scroll"
                :listenScroll="listenScroll">
            <div class="activePage-content">
              <img :src="require('./images/commission_img1.png')" alt="">
              <div class="activePage-plan">
                  <img :src="require('./images/commission_img2.png')" alt="">
                  <input type="button" value="我要分享" @click="toShare('index_banner_share')" class="share-btn">
              </div>
              <div class="activePage-rule">
                  <img :src="require('./images/commission_img3.png')" alt="">
                  <input type="button" value="去分享赚佣金" class="share-btn" @click="toShare('index_banner_share_to')">
              </div>
            </div>
        </scroll>
        <share-component :shareShow.sync="showShareButton" :isPlan="isPlan"></share-component>
   </div>
</template>

<script>
    import minix from "@/mixins/mixin";
    import shareComponent from '@/components/shareComponent';
    import { behaviorTotal } from 'api/home';
    export default {
        mixins: [minix],
        name: "ActivePage",
        components:{
          shareComponent
        },
        data(){
          return{
            showShareButton:false,
            isPlan: false
          }
        },
        mounted(){
          this.$nextTick(()=>{
              setTimeout(()=>{
                this.$refs.scroll.refresh()
              },200)
          })
        },
        methods:{
            toShare(type){
              this.showShareButton = true;this.isPlan = false;
              sessionStorage.setItem('shareType',type);
              try {
                behaviorTotal({type:type,wx:false,pyq:false}).then(res=>{}); //统计
              } catch (e) {

              }
            }
        }
    }
</script>

<style lang="scss" scoped>
  .activePage{
    height: 100%;
    .icon-left{
       position: absolute;
       left: 0;
       top: 0;
       z-index: 11;
    }
    .activePage-content{
      font-size: 0;
      input{
        position: absolute;
        left: 50%;
        width: 420px;
        height: 88px;
        margin-left: -210px;
        display: block;
        border: 0;
        background: #FF6400;
        border-radius: 50px;
        color: #fff;
        font-size: 38px;
        &:active{
          opacity: .6;
        }
      }
      .activePage-plan{
        position: relative;
        .share-btn{
          bottom: 80px;
          box-shadow: -10px 10px 10px #FF9A04;
        }
      }
      .activePage-rule{
        position: relative;
        .share-btn{
          bottom: 220px;
          box-shadow: -10px 10px 10px #FEE6DA;
        }
      }
    }
  }
</style>
