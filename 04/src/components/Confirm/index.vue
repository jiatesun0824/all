<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <div class="content-box">
            <p class="title">提示</p>
            <p class="text" v-text="text.replace(/\n/g, '<br/>')">{{text}}</p>
          </div>
          <div class="operate-box">
            <div @click="cancel" class="operate-btn">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn right">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'confirm',
  props: {
    popupshow: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    confirmBtnText: {
      type: String,
      default: "确定"
    },
    cancelBtnText: {
      type: String,
      default: "取消"
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  watch: {
    showFlag(newVal) {
      if (this.showFlag) {
        document.body.style.overflow = "hidden";
      } else if (!this.popupshow) {
        document.body.style.overflow = "";
      }
    }
  },
  methods: {
    close() {
      this.showFlag = false;
    },
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    confirm() {
      this.hide();
      this.$emit("confirm");
    }
  }
};
</script>

<style scoped lang="scss">
.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.44);
  border-radius: 10px;
}

.confirm.confirm-fade-enter-active {
  animation: confirm-fadein 0.3s;
}

.confirm .confirm-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 540px;
  background: #fff;
  border-radius: 1px;
  z-index: 999;
}

.confirm .confirm-wrapper .confirm-content {
  min-height: 266px;
}

.confirm .confirm-wrapper .confirm-content .content-box {
  padding-bottom: 20px;
  min-height: 178px;
  border-bottom: 1px solid #f1f1f1;
}

.confirm .confirm-wrapper .confirm-content .content-box .title {
  display: block;
  padding-top: 48px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 36px;
  color: #ff6419;
}

.confirm .confirm-wrapper .confirm-content .content-box .text {
  display: block;
  margin: 0 auto;
  max-width: 400px;
  line-height: 28.000000000000004px;
  text-align: center;
  font-size: 28.000000000000004px;
  color: #000;
}

.confirm .confirm-wrapper .confirm-content .operate-box {
  margin: 0 auto;
  width: 100%;
  height: 88px;
  font-size: 0;
}

.confirm .confirm-wrapper .confirm-content .operate-box .operate-btn {
  display: inline-block;
  width: 50%;
  height: 88px;
  text-align: center;
  line-height: 88px;
  color: #999;
  font-size: 32px;
  background: #fff;
}

.confirm .confirm-wrapper .confirm-content .operate-box .operate-btn.right {
  color: #ff6419;
  border-left: 1px solid #f1f1f1;
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
