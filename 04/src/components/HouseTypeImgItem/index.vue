<template>
  <div class="imgitem__container" @click="toFastDecorate">
    <i class="imgitem__icon" @click.stop="showBigImg"></i>
    <img class="imgitem__img" v-lazy="userInfo.resourcesUrl+imgUrl" :key="userInfo.resourcesUrl+imgUrl">
    <p class="imgitem__title">
      <span class="imgitem__title--main" v-text="mainTitle"></span>
      <span v-if="!isSpace" class="imgitem__title--sub" v-text="`${itemData.totalArea}m²`"></span>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'Vuex';
import imgBox from './components/imgbox';
import { get, merge } from 'lodash'

export default {
  name: 'house-type-item',
  props: {
    itemData: {
      type: Object,
      required: true
    },
    isSpace: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    imgUrl() {
      return get(this.itemData, 'viewPlanSmallPath') || get(this.itemData, 'thumbnailPath')
    },
    mainTitle() {
      return this.isSpace ? `${get(this.itemData, 'spaceName')} ${get(this.itemData, 'spaceCode')}` : get(this.itemData, 'houseCommonCode')
    }
  },
  methods: {
    toFastDecorate(item) {
      let queryData = this.$route.name === 'space' ? {
        fromPage: this.$route.name,
        spaceId: this.itemData.spaceFunctionId
      } : { fromPage: this.$route.name }
      this.$route.query.planId !== undefined && (queryData = merge(queryData, {planId: this.$route.query.planId}));
      this.$router.push({
        name: 'fastDecorate',
        params: { id: this.itemData.id },
        query: queryData
      })
    },
    showBigImg() {
      let picPath = this.userInfo.resourcesUrl + (get(this.itemData, 'largeThumbnailPath') || get(this.itemData, 'viewPlanPath'))
      imgBox(picPath);
    }
  }
}
</script>

<style lang="scss" scoped>
.imgitem {
  @at-root #{&}__container {
    flex-basis: 50%;
    position: relative;
    margin-bottom: 15px;
    font-size: 0;
    box-sizing: border-box;

    &:nth-of-type(2n+1) {
      padding-right: 12px;
      .imgitem__icon {
        right: 10px;
      }
    }

    &:nth-of-type(2n+2) {
      padding-left: 12px;
      .imgitem__icon {
        right: 0;
      }
    }
  }

  @at-root #{&}__icon {
    position: absolute;
    top: 0;
    width: 45px;
    height: 45px;
    background-image: url("./images/search_nor.png");
    background-size: cover;
  }

  @at-root #{&}__img {
    height: 250px;
    object-fit: cover;
  }

  @at-root #{&}__title {
    font-size: 24px;
    color: #333;
    padding: 20px 0;

    @at-root #{&}--main {
      display: block;
      width: 320px;
      white-space:nowrap;
      text-overflow:ellipsis;
      -o-text-overflow:ellipsis;
      overflow:hidden;
    }

    @at-root #{&}--sub {
      display: block;
      margin-top: 25px;
    }
  }

  @at-root #{&}__box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
