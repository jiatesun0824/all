<template>
  <div class="comfirm__container" v-if="comfirmInfo">
    <div class="comfirm__content">
      <div class="comfirm__header" v-text="comfirmInfo.title">12</div>
      <div class="comfirm__body" v-text="comfirmInfo.msg"></div>
      <div class="comfirm__footer">
        <span @click="cancel">取消</span>
        <span @click="success">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @comfirmInfo 弹窗comfirm
 *
 * @ title  标题
 * @ msg    内容
 * @ success  确定回调
 * @ cancel   取消回调
 * @ close    关闭弹窗
 */
export default {
  name: 'confirm',
  props: {
    comfirmInfo: {
      type: Object
    }
  },
  methods: {
    success() {
      if (this.comfirmInfo.success) return this.comfirmInfo.success(this)
      this.$emit('success')
    },
    cancel() {
      if (this.comfirmInfo.cancel) {
        return this.comfirmInfo.cancel()
      } else {
        this.$emit('cancel')
      }
      this.$destroy()
    },
    close() {
      this.$destroy()
    }
  },
  destroyed() {
    this.$el.parentNode.removeChild(this.$el)
  }
}
</script>

<style lang="scss">

  $containerBgColor: rgba(0, 0, 0, .4);
  $contentBgColor: #fff;
  $borderColor: rgba(4, 4, 4, 0.12);

  .center {
    text-align: center;
  }

  .comfirm {
    @at-root #{&}__container {
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: $containerBgColor;
      z-index: 10000;
    }

    @at-root #{&}__content {
      width: 540px;
      border-radius: 8px;
      background-color: $contentBgColor;

    }

    @at-root #{&}__header {
      margin-top: 10px;
      padding: 35px 0;
      font-size: 34px;
      @extend .center;
    }

    @at-root #{&}__body {
      margin-bottom: 58px;
      font-size: 26px;
      @extend .center;
    }

    @at-root #{&}__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      height: 88px;
      
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        border-top: 1px solid $borderColor; /*no*/
        transform: scaleY(0.5);
      }

      span {
        flex: 1;
        height: 100%;
        line-height: 88px;
        text-align: center;
        font-size: 34px;
        color: #ff6419;

        &:nth-of-type(1) {
          position: relative;
          color: #888;

          &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            border-right: 1px solid $borderColor; /*no*/
            transform: scaleX(0.5);
          }
        }
      }
    }
  }
</style>
