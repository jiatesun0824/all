<template>
  <div class="cityselect__container" v-if="cityListData" v-show="show" @click.stop="showContent = false">
    <transition name="upward" @after-leave="$emit('update:show', false)">
      <div class="cityselect__content" v-if="showContent" @click.stop>
        <div class="cityselect__header">
            <p class="cityselect__title" @touchstart.stop.prevent v-text="title"></p>
            <div class="cityselect__nav">  <!-- v-show="ready" -->
              <a href="javascript:;" class="cityselect__nav--item"
                v-for="(index, key) in columnNum"
                v-show="!!nav['txt' + index]"
                @click.stop="navEvent(index)"
                :class="{active: index == navIndex}"
                v-text="nav['txt' + index]"
                :key="key"
              ></a>
            </div>
        </div>
        <ul class="cityselect__body" :class="activeClasses">
          <li class="cityselect__item" v-for="(num, i) in columnNum" :key="i">
            <scroll beforeScroll :data="columnsObj['columnItems' + num] || []" :ref="'itemBox' + i">  <!-- :bounce="false" -->
            <template v-if="columnsObj['columnItems' + num] && columnsObj['columnItems' + num].length > 0">
              <div class="cityselect__box">
                <a href="javascript:;" class="cityselect__box--item"
                  v-for="(item, key) in columnsObj['columnItems' + num]"
                  :class="currentClass(item.areaCode, item.areaName, num)"
                  @click.stop="itemEvent(num, item.areaName, item.areaCode, item.baseAreaVos)"
                  :key="key">
                  <span v-text="item.areaName"></span>
                </a>
              </div>
            </template>
            <template v-else>
              <div class="cityselect__box" @touchstart.stop.prevent></div>
            </template>
            <!-- <div class="cityselect__box">
              <a href="javascript:;" class="cityselect__box--item" :class="{active: index === 3}" v-for="(item, index) in 20" :key="index">
                <span v-text="item+'中文'"></span>
              </a>
            </div> -->
            </scroll>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { debounce } from 'lodash';

export default {
  name: 'cityselect',
  props: {
    provance: String,
    city: String,
    area: String,
    street: String,
    title: {
      type: String,
      default: '所在地区'
    },
    chooseTitle: {
      type: String,
      default: '请选择'
    },
    items: {
      type: Array,
      required: true
    },
    columns: {
      validator(val) {
        return /^\d*$/.test(val);
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      navIndex: 1,
      columnNum: 1,
      nav: {
        txt1: this.chooseTitle,
        txt2: '',
        txt3: '',
        txt4: ''
      },
      columnsObj: {},
      active: {},
      activeClasses: '',
      itemHeight: 40,
      showContent: false
    }
  },
  computed: {
    cityListData() {
      if (this.items.length) { this.init(); return true; }
    }
  },
  methods: {
    init() {
      if (!(this.items && this.items[0]) || !this.isArray(this.items)) return;

      if (this.columns && ~~this.columns > 1) {
          this.columnNum = ~~this.columns;
      } else {
          this.getColumsNum(this.items[0]);
      }

      this.columnsObj.columnItems1 = this.items;

      this.provance && this.$nextTick(() => {
          this.setDefalutValue(this.items, 'provance', 1);
      });
    },
    navEvent(index) {
        if (this.columnNum > 2) {
            if (index >= this.columnNum - 1) {
                this.forwardView(true, index);
            } else {
                this.backoffView(true, index);
            }
        }
        this.navIndex = index;
    },
    itemEvent: debounce(function(index, name, value, children) {
      this.active['itemValue' + index] = value;
      this.active['itemName' + index] = name;
      this.nav['txt' + index] = name;
      this.columnsObj['columnItems' + (index + 1)] = children;

      if (index > 1 && children && children.length > 0 && this.columnNum > 2) {
          this.forwardView(true, index);
      }

      this.clearNavTxt(index);

      if (index === this.columnNum || children.length <= 0) {
        if (index !== this.columnNum) {
          for (let i = this.columnNum; i >= 0; i--) {
            if (i > index) {
              this.active['itemValue' + i] = '';
              this.active['itemName' + i] = '';
              this.nav['txt' + i] = '';
            }
          }
        }
        this.navIndex = index;
        this.returnValue();
      } else {
        this.navIndex = index + 1;
        this.nav['txt' + (index + 1)] = this.chooseTitle;
      }
    }, 20),
    currentClass(v, n, index) {
        return (v && v == this.active['itemValue' + index]) || (n && n === this.active['itemName' + index]) ? 'active' : '';
    },
    clearNavTxt(index) {
        for (let i = 0; i < this.columnNum; i++) {
            if (i > index) {
                this.nav['txt' + (i + 1)] = '';
            }
        }
    },
    getColumsNum(arr) {
        if (this.isArray(arr.baseAreaVos)) {
            this.columnNum++;
            this.getColumsNum(arr.baseAreaVos[0]);
        }
    },
    isArray(arr) {
        return arr && arr.constructor === Array && arr.length > 0;
    },
    setDefalutValue(items, currentValue, index) {
      items.every((item, key) => {
        if (item.areaCode == this[currentValue] || item.areaName === this[currentValue]) {
          const childrenItems = this.columnsObj['columnItems' + (index + 1)] = item.baseAreaVos;
          const itemBox = this.$refs['itemBox' + index][0];

          itemBox.scrollTop = key * this.itemHeight - itemBox.offsetHeight / 3;

          this.active['itemValue' + index] = item.areaCode;
          this.active['itemName' + index] = item.areaName;

          this.nav['txt' + index] = item.areaName;
          this.navIndex = index;

          ++index;

          index >= this.columnNum && this.columnNum > 2 && this.forwardView(false);

          this.isArray(childrenItems) && this.setDefalutValue(childrenItems, ['', 'provance', 'city', 'area'][index], index);

          return false;
        }
        return true;
      });
    },
    returnValue() {
      this.$emit('result', this.active);
      this.showContent = false;
    },
    backoffView(animate, index) {
        this.activeClasses = (animate ? 'cityselect__move--animate' : '') + (index === 1 ? ' cityselect__prev2' : ' cityselect__prev');
    },
    forwardView(animate, index) {
        console.warn(this.navIndex, index)
        this.activeClasses = (animate ? 'cityselect__move--animate' : '') + (index === 2 ? ' cityselect__next' : ' cityselect__next2');
    }
  },
  watch: {
    show(curVal) {
      curVal && (this.showContent = curVal);
    }
  }
}
</script>

<style lang="scss" scoped>
.cityselect {

  @mixin bottom-border($color) {
    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px; /*no*/
      background-color: $color;
      transform: scaleY(0.5);
    }
  }

  @at-root #{&}__container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  @at-root #{&}__content {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 75%;
    background-color: #fff;
    // transform: translate(0, 100%);
    transition: transform .2s;
    z-index: 1100;
    
    &.upward-enter-active{
      transition: all 200ms ease
    }
    &.upward-leave-active {
      transition: all 150ms ease
    }

    &.upward-enter, &.upward-leave-active {
      transform: translate3d(0, 100%, 0)
    }
  }

  @at-root #{&}__header {
    flex: 0 0 auto;
    position: relative;
    width: 100%;

    @include bottom-border(#bdbdbd);

  }

  @at-root #{&}__title {
    position: relative;
    width: 100%;
    height: 90px;
    line-height: 90px;
    font-size: 30px;
    text-align: center;
    color: #666;

    @include bottom-border(#b2b2b2);

  }

  @at-root #{&}__nav {
    display: flex;
    width: 100%;
    padding-left: 20px;
    overflow: hidden;
    box-sizing: border-box;

    @at-root #{&}--item {
      font-size: 26px;
      color: #222;
      display: block;
      height: 80px;
      line-height: 92px;
      padding: 0 16px;
      position: relative;
      margin-right: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 40%;

      &.active {
        color: #ff6419 !important;
        &:after {
          content: '';
          width: 100%;
          height: 4px;
          background-color: #ff6419;
          position: absolute;
          bottom: 2px;
          left: 0;
          z-index: 2;
        }
      }
    }
  }

  @at-root #{&}__body {
    flex: 1;
    display: flex;
    width: 100%;
    box-sizing: border-box;
  }

  @at-root #{&}__item {
    display: block;
    height: inherit;
    width: 50%; /* for old android */
    flex: 0 0 50%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #FFF;
    &:nth-child(2n) {
      background-color: #F5F5F5;
    }
  }

  @at-root #{&}__box {
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;

    @at-root #{&}--item {
      display: flex;
      align-items: center;
      position: relative;
      height: 40px; /*no*/
      line-height: 40px; /*no*/
      width: 100%;
      font-size: 26px;
      color: #333;
      overflow: hidden;

      span {
        display: block;
        height: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      &.active {
        color: #ff6419 !important;
        &:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 30px;
          height: 100%;
          background-image: url("./images/right.svg");
          background-repeat: no-repeat;
          background-position: 50%;
        }
      }

      &:before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px; /*no*/
        background-color: #ececec;
        transform: scaleY(0.5);
      }
    }
  }

  @at-root #{&}__move {
    @at-root #{&}--animate {
      transition: transform .3s;
    }
  }

  @at-root #{&}__prev {
    transform: translate(-50%, 0);
  }

  @at-root #{&}__prev2 {
    transform: translate(0, 0);
  }

  @at-root #{&}__next {
    transform: translate(-50%, 0);
  }

  @at-root #{&}__next2 {
    transform: translate(-100%, 0);
  }
}
</style>
