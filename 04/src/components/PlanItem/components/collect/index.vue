<template>
  <div class="collect__container" @touchmove.prevent>
    <div class="collect__content">
      <div class="collect__header">
        <span class="collect__header--text">收藏至：</span>
        <i class="collect__header--icon" @click="close">
          <svg style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="220 220 600 600" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M573.76 522.048l129.12-129.12a36.32 36.32 0 0 0 0.192-51.904 37.088 37.088 0 0 0-51.904 0.192l-129.12 129.12-129.12-129.12a36.32 36.32 0 0 0-51.904-0.192 37.088 37.088 0 0 0 0.192 51.904l129.12 129.12-129.12 129.12a36.32 36.32 0 0 0-0.192 51.904 37.088 37.088 0 0 0 51.904-0.192l129.12-129.12 129.12 129.12a36.32 36.32 0 0 0 51.904 0.192 37.088 37.088 0 0 0-0.192-51.904l-129.12-129.12z"></path></svg>
        </i>
      </div>
      <div class="collect__body">
        <div class="collect__item" @click="collect(item.bid, index)" v-for="(item, index) in collectList" :key="index">
          <span class="collect__item--text" v-text="item.name"></span>
          <i class="collect__item--icon" v-if="isActiveList[index]">
            <svg style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 150 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M735.828237 583.712275c9.826189-9.825786 15.01047-21.969361 15.553868-36.431747 0.547491-14.462387-4.093393-26.605961-13.915488-36.426631-9.826189-9.825786-21.834156-14.602579-36.020831-14.326287-14.190768 0.271176-26.199759 5.320169-36.024924 15.140839L434.555572 742.528374l-79.413861-78.590939c-9.822095-9.821693-21.830062-14.869662-36.020831-15.145955-14.190768-0.272199-26.199759 4.504594-36.020831 14.326287-9.826189 9.825786-14.874365 21.421892-15.146576 34.792411s4.500685 24.970718 14.326874 34.792411l113.795288 114.610294c9.826189 9.825786 22.649764 14.602579 38.479936 14.326287 15.826079-0.272199 28.653748-5.320169 38.475843-15.141862l-3.273691 3.273557L735.828237 583.712275z"></path></svg>
          </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'collect',
  props: {
    collectList: {
      type: Array
    }
  },
  data() {
    return {
      isActiveList: []
    }
  },
  methods: {
    collect(fid, index) {
      this.$set(this.isActiveList, index, true);
      this.$emit('success', fid);
    },
    close() {
      this.$destroy();
    }
  },
  destroyed() {
    this.$el.parentNode.removeChild(this.$el);
  }
}
</script>

<style lang="scss" scoped>
.collect {
  @at-root #{&}__container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10001;
  }

  @at-root #{&}__content {
    width: 480px;
    height: 420px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f7f7f8;
    border-radius: 6px;
  }

  @at-root #{&}__header {
    position: relative;
    height: 86px;
    line-height: 86px;
    font-size: 30px;
    color: #ff6419;
    text-indent: 30px;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 10px 10px 0 0;

    @at-root #{&}--icon {
      display: flex;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 36px;
      color: #bbb;
    }
  }

  @at-root #{&}__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    text-indent: 22px;
    font-size: 26px;
    background-color: #fff;
    box-sizing: border-box;
    border-left: 8px solid #ff6419;

    &:not(:nth-last-of-type(1)) {
      margin-bottom: 6px;
    }

    @at-root #{&}--icon {
      font-size: 52px;
      display: flex;
      color: #555;
    }
  }
}
</style>

