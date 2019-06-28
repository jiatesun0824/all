<template>
  <div class="examineImg">
    <span class="shut"></span>
    <img src="./images/nav_icon_back_white.png" class="shut" @click="back">
    <swiper :options="swiperOption" ref="imgOverview" style="height: 100%;">-->
      <swiper-slide v-for="(img, index) in galleryList" :key="index">
        <div class="swiper-zoom-container">
          <img v-if="galleryList.length" v-lazy="userInfo.resourcesUrl + img.picPath">
        </div>
      </swiper-slide>
    </swiper>
  </div>
  <!--<div class="photo__container">-->
    <!--<div class="photo__content">-->
      <!--<div class="photo__header">-->
        <!--<span class="photo__header&#45;&#45;icon" @click="$router.back()"></span>-->
      <!--</div>-->
      <!--<div class="photo__gallery">-->
        <!--&lt;!&ndash;<img v-if="galleryList.length" v-lazy="userInfo.resourcesUrl+(currentPic ? currentPic : get(galleryList, '0.picPath'))">&ndash;&gt;-->
        <!--<swiper :options="swiperOption" ref="imgOverview" style="height: 100%;">-->
          <!--<swiper-slide v-for="(img, index) in galleryList" :key="index">-->
            <!--<div class="swiper-zoom-container">-->
              <!--<img v-if="galleryList.length" v-lazy="userInfo.resourcesUrl + img.picPath">-->
            <!--</div>-->
          <!--</swiper-slide>-->
        <!--</swiper>-->
      <!--</div>-->
      <!--<div class="photo__thumb">-->
        <!--<button class="thumb__btn" @click="showThumbList = true">-->
          <!--<svg style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M362.7 64.2h-199c-55 0-99.5 44.6-99.5 99.5v199c0 55 44.6 99.5 99.5 99.5h199c55 0 99.5-44.6 99.5-99.5v-199c0-55-44.5-99.5-99.5-99.5z m497.6 0h-199c-55 0-99.5 44.6-99.5 99.5v199c0 55 44.6 99.5 99.5 99.5h199c55 0 99.5-44.6 99.5-99.5v-199c0-55-44.5-99.5-99.5-99.5z m0 497.6h-199c-55 0-99.5 44.6-99.5 99.5v199c0 55 44.6 99.5 99.5 99.5h199c55 0 99.5-44.6 99.5-99.5v-199c0-55-44.5-99.5-99.5-99.5z m-497.6 0h-199c-55 0-99.5 44.6-99.5 99.5v199c0 55 44.6 99.5 99.5 99.5h199c55 0 99.5-44.6 99.5-99.5v-199c0-55-44.5-99.5-99.5-99.5z"></path></svg>-->
        <!--</button>-->
        <!--<transition name="dropdown">-->
          <!--<div class="thumb__list" v-if="showThumbList">-->
            <!--<span class="list__pull&#45;&#45;icon" @click="showThumbList = false">-->
              <!--<svg style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M854.528 340.48c-17.407999999999998-17.408000000000005-45.567999999999984-17.40800000000001-62.464-1.7763568394002505e-14l-279.0400000000001 279.0399999999999-279.0399999999999-279.0400000000001c-17.407999999999998-17.408000000000005-45.567999999999984-17.40800000000001-62.464-1.7763568394002505e-14-17.408000000000005 17.407999999999998-17.40800000000001 45.567999999999984-1.7763568394002505e-14 62.464L481.7919999999999 713.216c17.407999999999998 17.408000000000005 45.567999999999984 17.40800000000001 62.464 1.7763568394002505e-14L854.528 402.94399999999996c8.704000000000002-8.703999999999999 12.800000000000011-19.967999999999993 12.800000000000013-31.231999999999996 0.5120000000000058-11.264-4.095999999999991-22.528-12.799999999999986-31.232z"></path></svg>-->
            <!--</span>-->
            <!--<div class="list__content">-->
              <!--<swiper :options="galleryListConfig">-->
                <!--<swiper-slide class="list__item" v-for="(item, index) in galleryList" :key="index">-->
                  <!--<img class="list__item&#45;&#45;img" :class="{active: item.active}" :src="userInfo.resourcesUrl+item.picPath" @click="switchPic(index)">-->
                  <!--<span class="list__item&#45;&#45;name" v-text="item.spaceType"></span>-->
                <!--</swiper-slide>-->
              <!--</swiper>-->
            <!--</div>-->
          <!--</div>-->
        <!--</transition>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
</template>

<script>
import { mapGetters, mapActions } from 'Vuex';
import { get, forEach } from 'lodash'

export default {
  name: 'photo-view',
  props: ['page', 'id'],
  data() {
    return {
      showThumbList: false,
      currentPic: '',
      imgList: [],
      galleryListConfig: {
        slidesPerView: 2.7,
        spaceBetween: 10
      },
      swiperOption: {
        width: window.innerWidth,
        zoom : true,
        initialSlide: 0
      }
    };
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    ...mapGetters('photoView', ['galleryList'])
  },
  methods: {
    ...mapActions('photoView', ['queryGalleryList']),
    get,
    back() {
      console.log(123);
      this.$router.back();
    },
    switchPic(index) {
      this.currentPic = this.get(this.galleryList, `${index}.picPath`);
      forEach(this.galleryList, (item, i) => { item.active = i === index; });
      this.imgList = [this.galleryList[index].picPath];
    }
  },
  created() {
    this.queryGalleryList({
      page: this.page,
      id: this.id
    });
  }
};
</script>

<style lang="scss" scoped>
  .examineImg{
    width: 100%;
    height: 100%;
    background-color: #000;
    .shut{
      position: fixed;
      top: 20px;
      left: 20px;
      width: 44px;
      height: 40px;
      z-index: 99999;
    }
  }
  .photo {
    @at-root #{&}__container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      overflow: hidden;
    }

    @at-root #{&}__content {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    @at-root #{&}__header {
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      height: 88px;
      padding-left: 30px;

      @at-root #{&}--icon {
        display: inline-block;
        width: 45px;
        height: 45px;
        background-image: url('./images/nav_icon_back_white.png');
        background-size: cover;
        background-position: 50% 50%;
      }
    }

    @at-root #{&}__thumb {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 240px;
      box-sizing: border-box;

      @at-root .thumb {

        @at-root #{&}__btn {
          display: flex;
          font-size: 45px;
          color: #fff;
          border: none;
          background-color: #000;
          margin: 0 auto;
          transform: translateY(150px);
        }

        @at-root #{&}__list {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          color: #fff;
          z-index: 10;
          background-color: #000;

          &.dropdown-enter-active{
            transition: all 200ms linear
          }
          &.dropdown-leave-active {
            transition: all 150ms linear
          }

          &.dropdown-enter, &.dropdown-leave-active {
            transform: translate3d(0, 100%, 0)
          }

          @at-root .list {

            @at-root #{&}__pull--icon {
              position: absolute;
              top: -40px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 50px;
              color: #ccc;
            }

            @at-root #{&}__content {
              padding: 30px;
              box-sizing: border-box;
            }

            @at-root #{&}__item {
              width: 240px;
              text-align: center;
              font-size: 20px;

              @at-root #{&}--img {
                margin-bottom: 20px;
                border-radius: 5px;
                box-sizing: border-box;
                border: 1px solid transparent; /*no*/

                &.active {
                  border-color: #fff;
                }
              }
            }

          }
        }

      }
    }
  }
</style>

