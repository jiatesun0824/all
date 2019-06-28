<template>
  <div class="toast__container">
    <div class="toast__content">
      <span v-if="msg" v-text="msg"></span>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>
/**
 * @augments
 *  
 *  @msg  提示消息
 *  @time toast消失时间
 *  
 *  组件可以传msg 亦可以直接slot
 */
export default {
  name: 'toast',
  props: {
    msg: {
      type: String
    },
    time: {
      type: Number,
      default: 2000
    }
  },
  mounted() {
    setTimeout(() => {
      setTimeout(() => {
        this.$destroy()
      }, this.time)
    })
  },
  destroyed() {
    this.$el.parentNode.removeChild(this.$el)
  }
}
</script>

<style lang="scss">
  .toast {
    @at-root #{&}__container {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10001;
    }

    @at-root #{&}__content {
      max-width: 80%;
      padding: 30px 60px;
      font-size: 26px;
      color: #fff;
      background-color: rgba(0, 0, 0, .6);
      border-radius: 15px;
      box-sizing: border-box;
    }
  }
</style>
