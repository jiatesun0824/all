<template>
  <div class="areadetail__container">
    <div class="areadetail__header">
      <span class="areadetail__header--back" @click="$router.back()"></span>
      <div class="areadetail__header--title" v-text="title"></div>
    </div>
    <div class="areadetail__content">
      <div class="areadetail__scroll">
        <scroll beforeScroll pullup :data="areaDetailList" @scrollToEnd="loadMore">
          <div v-load-more="!isAllData" v-all-loaded="isAllData">
            <div class="areadetail__list">
              <img-item v-for="(item, index) in areaDetailList" :itemData="item" :isSpace="false" :key="index"></img-item>
            </div>
          </div>
        </scroll>
        <empty v-if="areaDetailList && !areaDetailList.length"></empty>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'Vuex';
import ImgItem  from 'components/HouseTypeImgItem';
import { isArray } from 'lodash'

export default {
  name: 'area-detail',
  props: ['title', 'id'],
  data() {
    return {
      start: 0
    }
  },
  computed: {
    ...mapGetters('areaDetail', ['areaDetailList', 'areaDetailCount']),
    isAllData() {
      return isArray(this.areaDetailList) && (this.areaDetailList.length === this.areaDetailCount);
    }
  },
  methods: {
    ...mapActions('areaDetail', ['queryAreaDetailList']),
    loadMore() {
      if(!this.isAllData) {
        this.start++;
        this.queryAreaDetailList({ livingId: this.id, start: this.start });
      }
    }
  },
  components: {
    ImgItem
  },
  created() {
    this.queryAreaDetailList({livingId: this.id});
  }
}
</script>

<style lang="scss" scoped>
.areadetail {
  @at-root #{&}__container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #eee;
  }

  @at-root #{&}__header {
    flex: 0 0 auto;
    position: relative;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 36px;
    margin-bottom: 20px;
    background-color: #fff;
    border-bottom: 1px solid #ddd; /*no*/

    @at-root #{&}--back {
      position: absolute;
      top: 50%;
      left: 20px;
      width: 45px;
      height: 45px;
      background-image: url("./images/nav_icon_back_black.png");
      background-position: 50%;
      background-size: cover;
      transform: translateY(-50%);
    }
  }

  @at-root #{&}__content {
    flex: 1 1 auto;
    position: relative;
    background-color: #fff;
  }

  @at-root #{&}__scroll {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  @at-root #{&}__list {
    display: flex;
    flex-wrap: wrap;
    padding: 0.2rem;
  }
}
</style>
