<template>
  <div class="crosswise" @touchstart.self="swiperHide">
    <transition name="dropdown">
      <div class="crosswise-wrapper" v-show="swiperFlag">
    	  <swiper :options="swiperOption" ref="swiper" class="crosswise-swiper">
    	    <swiper-slide class="crosswise-item" v-for="(item,index) in smallcontent" :key="item.id">
    	      <img class="pic" :class="smallShowIndex == index ? 'active' : ''" v-lazy="item.id != -1 ? resourcesUrl + item.picPath : ''" @click="changeLargeImg(index)" v-show="item.id != -1">
    	      <span class="gmtCreate" v-show="item.id != -1">{{item.spaceType}}</span>
    	    </swiper-slide>
    	  </swiper>
    	</div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  name: 'crosswise',
  props: ["smallcontent", "contanturl", "parentName"],
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        freeMode: true,
        direction: "vertical",
        initialSlide: this.$store.state.smallShowIndex
      },
      contant: this.$props.contanturl
    };
  },
  methods: {
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
        2000
      );
      this.API.fullView({
        thumbId: this.smallcontent[index].pid,
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
@import "styles/mixin.scss";
.crosswise .dot-wrapper {
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  bottom: 310px;
  right: 30px;
  z-index: 2;
}

.crosswise .dot-wrapper .dot-top {
  width: 70px;
  height: 70px;
  background-image: url("./images/room_nor.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.crosswise .crosswise-wrapper {
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 0;
  width: 300px;
  height: 100%;
  right: 0;
  z-index: 999;
}

.crosswise .crosswise-wrapper.dropdown-enter-active,
.crosswise .crosswise-wrapper.dropdown-leave-active {
  transition: all 0.2s linear;
}

.crosswise .crosswise-wrapper.dropdown-enter,
.crosswise .crosswise-wrapper.dropdown-leave-active {
  right: -280px;
}

.crosswise .crosswise-wrapper .crosswise-swiper {
  position: absolute;
  bottom: 0px;
  z-index: 2;
  width: 100%;
  height: 100%;
  word-break: keep-all;
  white-space: nowrap;
}

.crosswise .crosswise-wrapper .crosswise-swiper .swiper-wrapper {
  height: auto;
}

.crosswise
  .crosswise-wrapper
  .crosswise-swiper
  .swiper-wrapper
  .crosswise-item {
  width: 229.99999999999997px;
  height: 170px !important;
  margin: 15px auto 0;
}

.crosswise
  .crosswise-wrapper
  .crosswise-swiper
  .swiper-wrapper
  .crosswise-item
  .pic {
  width: 100%;
  height: 130px;
  border: 1px solid transparent;
  border-radius: 6px;
  opacity: 0.8;
}

.crosswise
  .crosswise-wrapper
  .crosswise-swiper
  .swiper-wrapper
  .crosswise-item
  .active {
  border: 2px solid #ffffff;
  opacity: 1;
}

.crosswise
  .crosswise-wrapper
  .crosswise-swiper
  .swiper-wrapper
  .crosswise-item
  .gmtCreate {
  display: block;
  font-size: 20px;
  margin-top: 6px;
  color: #ffffff;
  text-align: center;
}
</style>
