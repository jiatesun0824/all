<template>
  <div class="nav-box">
    <div class="nav" v-if="index == 0 || index == 7"  @click="selNav(index)">
      <span class="text" :class="designActiveIndex===index?'active':''">{{navType[type]}}</span>
      <!-- <span class="down-icon" @click.self="selNav(index)"></span> -->
    </div>
    <div class="nav" v-if="index == 1 || index == 2" @click="selNav(index)">
      <span class="text" :class="recomActiveIndex===index?'active':''">{{navType[type]}}</span>
      <!-- <span class="down-icon" @click.self="selNav(index)"></span> -->
    </div>
    <div class="nav" v-if="index == 3 || index == 4" @click="selNav(index)">
      <span class="text" :class="collectActiveIndex===index?'active':''">{{navType[type]}}</span>
      <!-- <span class="down-icon" @click.self="selNav(index)"></span> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  props: ["index", "type"],
  data() {
    return {
      supplement: [{ name: "全部", value: "" }], // 补全全部选项按钮
      navType: ["空间", "风格", "形状", "请选择喜欢的风格", ""],
      curSelIndex: 0 // 下拉框下标
    };
  },
  created() {},
  methods: {
    // 显示下拉框
    selNav(index) {
      if (this.index === 0 || this.index === 7) {
        this.$store.commit("selDesignNav", index);
        if (this.index === 0) {
          this.$store.state.design.designNavFlag = true;
        } else {
          this.$store.state.design.designNavFlag = false;
        }
      } else if (this.index === 1 || this.index === 2) {
        this.$store.commit("selRecomnNav", index);
        if (this.index === 1) {
          this.$store.state.recom.recomNavFlag = true;
        } else {
          this.$store.state.recom.recomNavFlag = false;
        }
      } else if (this.index === 3 || this.index === 4) {
        this.$store.commit("selCollectNav", index);
        if (this.index === 3) {
          this.$store.state.collect.collectNavFlag = true;
        } else {
          this.$store.state.collect.collectNavFlag = false;
        }
      }
    }
  },
  computed: mapState({
    designActiveIndex: state => state.design.activeIndex, // 我的设计页面nav索引
    recomActiveIndex: state => state.recom.activeIndex, // 推荐页面nav索引
    collectActiveIndex: state => state.collect.activeIndex // 推荐页面nav索引
  })
};
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";

.nav-box {
  width: 100%;

  .nav {
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 74px;
    text-align: center;
    background-color: #fff;
    z-index: 2;
    border-bottom: 1px solid #ddd; /*no*/

    .text {
      display: inline-block;
      margin-right: 10px;
      height: 75px;
      line-height: 70px;
      font-size: 30px;
      color: #494949;

      &.active {
        border-bottom: 4px solid #ff6419;
        color: #ff6419;
      }
    }

    .down-icon {
      background-image: url("../../images/down_pre.png");
    }

    .shapeState {
      width: 60px;
      height: 60px;
    }

    .down-icon {
      display: inline-block;
      padding: 8px 10px;
      width: 22px;
      height: 14px;
      background-size: 22px 14px;
      background-repeat: no-repeat;
      background-position: center center;
      background-image: url("../../images/down_nor.png");
    }
  }
}
</style>
