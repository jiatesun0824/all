<template>
  <div class="empty" >
    <div class="loadfail-wrapper">
      <div class="loadfail-box">
        <div class="loadfail-middle">
          <img class="loadfail-image" src="./images/space_img.png" alt="">
        </div>
        <span class="loadfail-text">{{loadfailTxt}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  name: 'loadfail',
  computed: mapState({
    loadfailTxt: state => state.loadfailTxt
  })
};
</script>

<style lang="scss">
.empty {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  font-size: 0;
  background: #eee;
  z-index: 11;
}

.empty .loadfail-wrapper {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #eee;
}

.empty .loadfail-wrapper .loadfail-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.empty .loadfail-wrapper .loadfail-box .loadfail-middle .loadfail-image {
  width: 173px;
  height: 144px;
}

.empty .loadfail-wrapper .loadfail-box .loadfail-text {
  display: block;
  margin-top: 40px;
  text-align: center;
  font-size: 24px;
  color: #b2b2b2;
}

@media all and (min-width: 1024px) {
  .empty {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    background: #eeeeee;
  }

  .empty .loadfail-wrapper .loadfail-middle {
    justify-content: center;
    display: flex;
  }

  .empty .loadfail-wrapper .loadfail-middle .loadfail-image {
    width: 85.5px;
    height: 72px;
  }

  .empty .loadfail-wrapper .loadfail-text {
    display: block;
    margin-top: 20px;
    font-size: 12px;
    color: #b2b2b2;
  }
}
</style>
