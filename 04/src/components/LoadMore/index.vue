<template>
  <div class="loadmore">
    <span class="text">{{designLoad}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  name: 'loadmore',
  props: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
  computed: mapState({
    designLoad: state => state.myDesign.designLoad
  })
};
</script>

<style lang="scss">
.loadmore {
  height: 88px;
  text-align: center;
  line-height: 88px;
  clear: both;
}

.loadmore .text {
  display: block;
  text-align: center;
  line-height: 88px;
  font-size: 16px;
}
</style>
