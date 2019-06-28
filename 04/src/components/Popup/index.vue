<template>
  <transition name="fade">
    <div class="popup-container">
      <div class="popup-wrapper">
        <div class="popup-content">
          <div class="hint">提示</div>
          <span class="text">{{toastMsg || '未知错误'}}</span>
          <span class="sureButton" @click="closePopup">确认</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  name: 'popup',
  props: {},
  data() {
    return {
      timer: null
    };
  },
  methods: {
    closePopup() {
      this.$store.state.popupShow = false;
      this.$store.commit("showComComponents", false);
      this.$router.push("/");
    }
  },
  computed: mapState({
    toastMsg: state => state.toastMsg
  })
};
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";

.popup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.6);
}

.popup-container.fade-enter-active,
.popup-container.fade-leave-active {
  transition: all 0.5s;
}

.popup-container.fade-enter,
.popup-container.fade-leave-active {
  opacity: 0;
}

.popup-container .popup-wrapper {
  width: 540px;
  text-align: center;
  z-index: 9999;
  background-color: #fff;
  border-radius: 10px;
}

.popup-container .popup-wrapper .popup-content .hint {
  font-size: 36px;
  font-weight: bold;
  color: #ff6419;
  margin: 48px 0 20px;
}

.popup-container .popup-wrapper .popup-content .text {
  display: block;
  padding: 0 50px 50px;
  line-height: 36px;
  font-size: 30px;
}

.popup-container .popup-wrapper .popup-content .sureButton {
  display: block;
  font-size: 32px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 6px;
  color: #333;
}
</style>
