<template>
  <transition name="fade">
    <div class="popup-container">
      <div class="popup-wrapper">
        <div class="popup-content">
          <span class="text">{{popupMsg || '未知错误'}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  name: 'toast',
  props: {},
  data() {
    return {
      timer: null
    };
  },
  created() {
    if (!this.timer) {
      this.timer = setTimeout(
        function() {
          this.closePopup();
        }.bind(this),
        2000
      );
    }
  },
  methods: {
    closePopup() {
      if (this.$store.state.toastShow) {
        this.$store.commit("showPopup");
        this.$store.dispatch("hideLoading");
      }
    }
  },
  computed: mapState({
    popupMsg: state => state.popupMsg
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
  max-width: 550px;
  z-index: 9999;
}

.popup-container .popup-wrapper .popup-content {
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.6);
}

.popup-container .popup-wrapper .popup-content .text {
  display: block;
  padding: 16px 50px 20px;
  line-height: 36px;
  font-size: 24px;
  color: #fbfbfb;
}
</style>
