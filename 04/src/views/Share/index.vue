<template>
  <div class="share__container" v-if="showShare || isSharePage" :key="shareContent">
    <transition :name="isSharePage ? '': 'dropdown'" @after-leave="$emit('update:showShare', false)">
      <div class="share__content" v-if="showShareContent">
        <i class="icon-back" v-if="!isSharePage" @click="$emit('update:showShare', false); showShareContent = false"></i>
        <div class="content" @touchstart="!isSharePage && slideStart($event)" @touchmove="!isSharePage && slide($event)">
          <div class="imgclass"><img :src="url ? (isSharePage ? url : userInfo.resourcesUrl + url) : require('./images/code.png')"></div>
          <div class="btn" v-if="!isSharePage" @click="showShareButton = true">立即推荐</div>
        </div>
      </div>
    </transition>
    <div class="mask" v-show="showShareButton" @click.stop="showShareButton = false"></div>
    <share-component :shareShow.sync="showShareButton"></share-component>
  </div>
</template>

<script>
import shareComponent from '@/components/shareComponent/index';
import { sharexzchat } from 'api/home';
import { pick } from 'lodash';
import { mapGetters } from 'Vuex';

export default {
  name: 'share',
  props: ['showShare'],
  data() {
    return {
      isSharePage: false,
      showShareContent: false,
      showShareButton: false,
      startPos: '',
      url: ''
    };
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    shareContent() {
      if(this.showShare) {
        setTimeout(() => {
          this.showShareContent = true
        })
      }
    }
  },
  methods: {
    slideStart(e) {
      this.startPos = pick(e.changedTouches[0], ['clientX', 'clientY'])
    },
    slide(e) {
      let distance = this.startPos.clientY - e.changedTouches[0].clientY;
      distance > 50 && (this.showShareContent = false);
    }
  },
  components: {
    shareComponent
  },
  created() {
    this.$nextTick(() => {
      if(this.isSharePage) {
        return this.url = this.$route.query.qrcode;
      }
      sharexzchat().then(res => {
        this.url = res.obj;
      });
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      to.name === 'share' && ([vm.isSharePage, vm.showShareContent] = Array(2).fill(true));
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.share {
  @at-root #{&}__container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 10001;
    user-select: none;
  }

  @at-root #{&}__content {
    width: 100%;
    height: 100%;
    overflow: hidden;

    &.dropdown-enter-active{
      transition: all 300ms ease
    }
    &.dropdown-leave-active {
      transition: all 200ms ease
    }

    &.dropdown-enter, &.dropdown-leave-active {
      transform: translate3d(0, -100%, 0)
    }
  }
}
.icon-back {
  display: block;
  width: 88px;
  height: 88px;
  position: absolute;
  top: 0;
  left: 0;
  background: no-repeat center url("./images/nav_icon_back_white.png");
  background-size: 45%;
  z-index: 10;
}
.content {
  height: 100%;
  //height: 100%;
  background: no-repeat center url("./images/bg_img_detail_03.png");
  background-size: 100% 100%;
  position: relative;
  .imgclass{
     width: 300px;
     height: 300px;
     //background-color: #0BB20C;
      position: absolute;
      top: 66%;
      left: 50%;
      transform: translate(-50%, -50%);
  }
  img {
    display: block;
    width: 228px;
    height: 228px;
    margin: 0 auto;
    position: relative;
    top: 38px;
    /*<!--position: absolute;-->*/
    /*<!--top: 50%;-->*/
    /*<!--left: 50%;-->*/
    /*<!--margin-top: -90px;-->*/
    /*<!--margin-left: -114px;-->*/
  }
  .btn {
    width: 388px;
    height: 88px;
    background-image: linear-gradient(-90deg, #ff6419 0%, #ffa072 100%), linear-gradient(#ffffff, #ffffff);
    background-blend-mode: normal, normal;
    box-shadow: 0px 10px 16px 3px rgba(255, 106, 34, 0.4);
    border-radius: 44px;
    position: absolute;
    left: 50%;
    margin-left: -194px;
    bottom: 421px;
    line-height: 88px;
    text-align: center;
    font-size: 32px;
    color: #fff;
    /*&:active{*/
    /*opacity: .8;*/
    /*}*/
  }
}
.slideDown {
  animation-name: slideDown;
  animation-duration: 0.5s;
  animation-timing-function: ease;
  visibility: visible !important;
}

@keyframes slideDown {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0%);
  }
}

</style>
