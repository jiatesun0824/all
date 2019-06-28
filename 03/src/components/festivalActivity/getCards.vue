<template>
  <transition name="slide-fade">
    <div class="dialog">
      <div class="getCards" v-show="dialog.getCards">
          <div class="title">恭喜您，获得一张拼图</div>
          <div class="tip">来源：{{originInfo}}</div>
          <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide class="swiper-slide" v-for="(item,index) in successCardsInfo" :key="index"><img :src="item.selectUrl" alt=""></swiper-slide>
          </swiper>
          <div class="btn" @click="toGet">立即领取</div>
      </div>
      <div class="mask" v-show="dialog.getCards"></div>
      </div>
  </transition>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import festivalActivity from "@/mixin/festivalActivity"
    export default {
        name: "getCards",
        mixins:[festivalActivity],
        components: {
          swiper,
          swiperSlide
        },
        computed: {
          swiper() {
            return this.$refs.mySwiper.swiper
          },

        },
        data(){
            return{
              getCards:false,
              swiperOption:{
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                coverflowEffect: {
                  rotate: 10,
                  stretch: 0,
                  depth: 50,
                  modifier: 1,
                  slideShadows : false,
                },
                on: {
                  slideChangeTransitionEnd: ()=>{
                    this.successCardsInfo.map((res,index)=>{
                      if(this.swiper.activeIndex==index){
                        this.setOriginInfo(this.originInfoChange(res));
                      }
                    })
                  }
                }
              }
             }
        },
        methods:{
          originInfoChange(res){
            if(res.businessType==0){
              return '绑定手机号'
            }else if( res.businessType==1){
              return '装修我家'
            }else if(res.businessType==2){
              return '产品替换'
            }else if(res.businessType==3){
              return '邀请好友'
            }
          },
          toGet(){
            this.setDialog({ getCards:false });
            this.setSuccessCards([]);
          }
        }
    }
</script>

<style scoped lang="scss">
  .getCards{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 10;
    width: 590px;
    height: 680px;
    background: no-repeat center url("/static/image/festivalActivity/spring_pop_bg.png");
    background-size: 100%;
    border-radius: 20px;
    padding: 60px 0;
    box-sizing: border-box;
    .title{
       text-align: center;
       color: #ffffff;
       font-size: 40px;
    }
    .tip{
      text-align: center;
      font-size: 24px;
      color: rgba(255,255,255,0.5);
      line-height: 56px;
    }
    .swiper-slide{
      background-position: center;
      background-size: cover;
      width: 360px;
      height: 360px;
    }
    img{
      display: block;
      width: 300px;
      height: 300px;
      margin: 40px auto;
    }
    .btn{
      width: 400px;
      height: 80px;
      background-image: linear-gradient(180deg,
        #ffbf7f 0%,
        #f59f49 100%),
      linear-gradient(
          #f5cdab,
          #f5cdab);
      background-blend-mode: normal,
      normal;
      box-shadow: 0px 15px 20px 0px
      rgba(153, 31, 45, 0.6);
      border-radius: 40px;
      margin: 0 auto;
      text-align: center;
      line-height: 80px;
      color: #c22f3d;
      font-size: 32px;
      margin-top: 30px;
      font-weight: bold;
      &:active{
        opacity: .6;
      }
    }
  }
</style>
