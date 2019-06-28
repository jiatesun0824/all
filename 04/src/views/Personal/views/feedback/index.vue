<template>
  <div class="feedback">
    <div class="header-box">
      <div class="type-header">
        <span class="goback" @click="goBack"></span>
        <span>反馈问题</span>
        <span class="submitFeedBack">提交</span>
      </div>
    </div>
    <div>
      <textarea placeholder="请输入您想要反馈的内容" class="feedbackContent"></textarea>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  methods: {
    goBack() {
      this.$router.replace("/personal/set");
      this.$store.state.intergralHeader = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";
.feedbackContent {
  display: block;
  margin-top: 100px;
  width: 100%;
  height: 400px;
  background: #fff;
  padding: 20px;
}

.feedback {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #eeeeee;
  overflow: hidden;
  z-index: 66667;
}

.header-box {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 3;
}

.header-box .type-header {
  background: #fff;
  color: #333;
  font-size: 36px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  position: relative;
}

.header-box .type-header:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #ddd;
  content: "";
}

.header-box .type-header .goback {
  width: 25px;
  height: 41px;
  position: absolute;
  left: 34px;
  top: 24px;
  background-size: 25px 41px;
  background-image: url("../../images/back_nor.png");
}

.header-box .type-header .submitFeedBack {
  position: absolute;
  right: 32px;
  top: 0px;
  font-size: 32px;
  color: #494949;
}
</style>
