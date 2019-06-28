<template>
  <div class="popup" @click="clearComponent" :class="{hidden: !show}">
    <div ref="tipContent" class="popup__content" :style="'top:'+(top-38)+'px; left:'+left+'px;'" v-text="content" @click.stop></div>
  </div>
</template>

<script>
export default {
  name: 'popupTip',
  props: {
    content: String,
    top: Number,
    left: Number,
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clearComponent() {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
.popup {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;

  &.hidden {
    visibility: hidden
  }

  @at-root #{&}__content {
    position: absolute;
    max-width: 80%;
    padding: 20px 30px;
    color: #fff;
    background-color: rgba(0,0,0,0.6);
    border-radius: 2px; /*no*/
    box-sizing: border-box;

    &:after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -20px; /*no*/
      border: 10px solid transparent; /*no*/
      border-top-color: rgba(0,0,0,0.6);
      transform: translateX(-50%);
    }
  }
}
</style>

