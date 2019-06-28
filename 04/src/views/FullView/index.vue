<template>
  <div class="fullview">
    <div class="fullview-text">
      <span class="goback" @click="goback"></span>
      <span>{{fullViewTitle}}</span>
      <span class="collect-icon" :class="collectFlag ? 'active-collect' : ''" @click="singleCollect"></span>
    </div>
    <div class="view-wrapper">
      <iframe class="view" :src=fullViewUrl frameborder="0"></iframe>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState } from 'Vuex';

  export default {
    created() {},
    data() {
      return {
        collectFlag: false
      };
    },
    updated() {
      this.$store.commit('showComComponents', false);
    },
    methods: {
      goback() {
        if (this.$store.state.fromPath !== '') {
          this.$store.commit('showComComponents', true);
        } else {
          this.$store.commit('showComComponents', false);
        }
        this.$router.go(-1);
      },
      singleCollect() {
        this.API.singleCollect({
          userId: localStorage.getItem('userId'),
          designPlanId: this.$store.state.fullView.fullViewId
        }).then((response) => {
          if (response) {
            this.collectFlag = true;
          }
        });
      }
    },
    computed: mapState({
      fullViewTitle: state => state.fullView.fullViewTitle,
      fullViewUrl: state => state.fullView.fullViewUrl
    })
  };
</script>

<style lang="scss">
  @import "styles/mixin.scss";

.fullview-text {
  position: absolute;
  top: 0;
  width: 100%;
  height: 88px;
  background-color: #f8f8f8;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  color: #333;
}

.fullview-text .goback {
  width: 25px;
  height: 41px;
  position: absolute;
  left: 34px;
  top: 24px;
  background-size: 25px 41px;
  background-image: url("./images/back_nor.png");
}

.fullview-text .goback:hover {
  background-image: url("./images/back_pre.png");
}

.fullview-text .collect-icon {
  width: 42px;
  height: 40px;
  position: absolute;
  right: 28.000000000000004px;
  top: 22px;
  background-size: 42px 40px;
  background-image: url("./images/collect_nor.png");
}

.fullview-text .active-collect {
  background-image: url("./images/collect_pre.png");
}

.view-wrapper {
  position: absolute;
  top: 88px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}

.view-wrapper .view {
  width: 100%;
  height: 100%;
}
</style>
