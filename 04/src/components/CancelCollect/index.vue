<template>
	<div class="subPopup" @click.self="subHintHide">
		<div class="popup-wrapper">
			<div class="popup-header">
				<span class="title">提示</span>
			</div>
			<div class="content">
				<span class="text">{{popupMsg}}</span>
			</div>
			<div class="btn-wrapper">
				<!-- <a href="javascript:;" class="popup-btn" @click.stop="cancelSubHint" style="border-right: 0.01rem solid #f2f2f2">取消</a> -->
				<a href="javascript:;" class="popup-btn" @click.stop="subHintHide">确定</a>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'cancelcollect',
    props: ['parentflag'],
    data() {
      return {
        popupMsg: ''
      };
    },
    created() {
      if (this.$store.state.hintMsg) {
        this.popupMsg = '收藏成功';
      } else {
        this.popupMsg = '您已取消收藏';
      }
    },
    methods: {
      subHintHide() {
        this.$store.state.subHintPopup = false;
      }
    }
  };
</script>

<style lang="scss">
  @import "styles/mixin.scss";
	
.subPopup {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  opacity: 1;
  overflow: auto;
  background: rgba(7, 17, 27, 0.7);
}

.subPopup.fade-enter-active,
.subPopup.fade-leave-active {
  transition: all 0.5s;
}

.subPopup.fade-enter,
.subPopup.fade-leave-active {
  opacity: 0;
  background: rgba(7, 17, 27, 0);
}

.subPopup .popup-wrapper {
  background-color: #fff;
  border-radius: 5px;
  z-index: 101;
}

.subPopup .popup-wrapper .popup-header {
  height: 60px;
  position: relative;
}

.subPopup .popup-wrapper .popup-header:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #eaa641;
  content: '';
}

.subPopup .popup-wrapper .popup-header .title {
  display: block;
  text-align: center;
  line-height: 60px;
  font-size: 30px;
  color: #eaa641;
}

.subPopup .popup-wrapper .content {
  position: relative;
}

.subPopup .popup-wrapper .content:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #f2f2f2;
  content: '';
}

.subPopup .popup-wrapper .content .text {
  display: block;
  padding: 16px 60px 20px 60px;
  line-height: 36px;
  font-size: 24px;
  color: #333;
}

.subPopup .popup-wrapper .btn-wrapper {
  display: flex;
}

.subPopup .popup-wrapper .btn-wrapper .popup-btn {
  flex: 1;
  display: block;
  line-height: 60px;
  text-align: center;
  font-size: 24px;
  color: gray;
}

.subPopup .popup-wrapper .btn-wrapper .popup-btn:active {
  color: #fff;
  background-color: #eaa641;
}
</style>
