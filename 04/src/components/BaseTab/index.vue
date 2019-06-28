<template>
  <div class="basetab">
    <transition name="dropdown">
      <div class="basetabSpace-wrapper" v-show="swiperFlag">
        <div class="closeFavorites" @click="swiperHide"></div>
        <swiper :options="swiperOption" ref="swiper" class="basetabSpace">
          <swiper-slide class="basetabSpace-item" v-for="(item,index) in smallcontent" :key="item.id">
            <img class="pic" :class="smallShowIndex == index ? 'active' : ''" v-lazy="resourcesUrl + item.picPath" @click="changeLargeImg(index)">
            <span class="gmtCreate">{{item.spaceType}}</span>
          </swiper-slide>
        </swiper>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    mapState
  } from "Vuex";
  
  export default {
    name: 'basetab',
    props: ["smallcontent", "contanturl", "parentName"],
    data() {
      return {
        swiperOption: {
          notNextTick: true,
          freeMode: true,
          spaceBetween: 10,
          slidesPerView: 2.76,
          direction: "horizontal",
          initialSlide: this.$store.state.smallShowIndex
        },
        contant: this.$props.contanturl,
        screenWidth: 0,
        thumbId: 0
      };
    },
    activated() {
      this.$store.state.smallShowIndex = 0;
      this.$store.state.swiperFlag = false;
    },
    created() {
      this.recalc();
      window.addEventListener("resize", this.recalc, false);
    },
    methods: {
      recalc() {
        if (screen.width > screen.height) {
          this.screenWidth = screen.height;
        } else {
          this.screenWidth = screen.width;
        }
        this.swiperOption.spaceBetween = 0.2 * this.screenWidth / 7.5;
      },
      swiperCtrl() {
        this.$store.state.swiperFlag = !this.$store.state.swiperFlag;
      },
      changeLargeImg(index) {
        if (this.$store.state.smallShowIndex == index) {
          return;
        }
        this.$store.state.smallShowIndex = index;
        this.$store.state.view720LoadingFlag = true;
        setTimeout(
          function() {
            this.$store.state.view720LoadingFlag = false;
          }.bind(this),
          5000
        );
        if (this.$store.state.detailsSeeType == "") {
          this.thumbId = this.smallcontent[index].pid;
        } else {
          this.thumbId = this.smallcontent[index].id;
        }
        this.API.fullView({
          thumbId: this.thumbId,
          token: localStorage.getItem("token")
        }).then(response => {
          if (this.parentName == "720") {
            this.$store.state.view720.view720Content[0] = response.obj.url;
          } else if (this.parentName == "video") {
            this.$store.state.videoView.videoContent[0] = response.obj.url;
            this.$emit("changecontent", index);
            return;
          } else {
            this.$store.state.photoView.photoContent[0] = response.obj.url;
          }
          this.$emit("changecontent");
        });
      },
      swiperHide() {
        this.$store.state.swiperFlag = false;
      }
    },
    computed: mapState({
      resourcesUrl: state => state.resourcesUrl,
      smallShowIndex: state => state.smallShowIndex,
      swiperFlag: state => state.swiperFlag,
      smallTitle: state => state.smallTitle
    })
  };
</script>

<style lang="scss" scoped>
@import 'styles/mixin.scss';

.basetab .dot-wrapper {
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  bottom: 310px;
  right: 30px;
  z-index: 999;
}

.basetab .dot-wrapper .dot-top {
  width: 70px;
  height: 70px;
  background-image: url("./images/room_nor.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.basetab .basetabSpace-wrapper {
  box-sizing: content-box;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 276px;
  z-index: 999;
}

.basetab .basetabSpace-wrapper.dropdown-enter-active,
.basetab .basetabSpace-wrapper.dropdown-leave-active {
  transition: all 0.2s linear;
}

.basetab .basetabSpace-wrapper.dropdown-enter,
.basetab .basetabSpace-wrapper.dropdown-leave-active {
  bottom: -280px;
}

.basetab .basetabSpace-wrapper .closeFavorites {
  width: 36px;
  height: 15px;
  background-image: url("./images/pulldown_nor.png");
  background-size: 36px 15px;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.basetab .basetabSpace-wrapper .basetabSpace {
  margin: 60px 30px 0;
}

.basetab .basetabSpace-wrapper .basetabSpace .basetabSpace-item .pic {
  width: 100%;
  height: 130px;
  border: 1px solid transparent;
  border-radius: 6px;
  opacity: 0.8;
  margin-bottom: 19px;
}

.basetab .basetabSpace-wrapper .basetabSpace .basetabSpace-item .active {
  border: 2px solid #ffffff;
  opacity: 1;
}

.basetab .basetabSpace-wrapper .basetabSpace .basetabSpace-item .gmtCreate {
  display: block;
  font-size: 20px;
  color: #ffffff;
  text-align: center;
}
</style>
