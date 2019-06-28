<template>
  <div class="favorites">
    <transition name="fade">
      <div class="favorites-wrapper" v-show="favoritesFlag" @click.self="closeFavorites">
        <div class="popup-wrapper">
          <div class="popup-header">
            <span class="title">收藏至 :</span>
            <span class="cancel" @click="closeFavorites">
              <img class="cancelImg" src="./images/close_nor.png" alt="">
            </span>
          </div>
          <div class="favorites-content">
            <ul class="content-wrapper">
              <li class="favorites-item" v-for="(item,index) in favoritesList"
                @touchend="addDesingPlanCollect(index, $event)"
                @touchstart="selItem(index)"
                :class="selIndex == index ? 'active' : ''"
                :key="index"
                >
                <span class="favorites-item-name">{{index == 0 ? item.name + '收藏夹' : item.name}}</span>
                <img src="./images/sel_nor.png" alt="" class="tick" v-if="tickIndex == index ? true : false">
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";

export default {
  name: 'favorites',
  props: ["parentname"],
  data() {
    return {
      selIndex: -1, // 收藏夹选中的索引
      tickIndex: -1, // 收藏夹勾选的索引
      collectIndex: -1 // 要收藏的推荐方案索引
    };
  },
  methods: {
    selItem(index) {
      // 选择要收藏到哪个收藏夹
      this.selIndex = index;
      this.tickIndex = -1;
    },
    addDesingPlanCollect(index, event) {
      // 添加收藏
      this.tickIndex = index;
      let token = localStorage.getItem("token");
      this.API.addDesingPlanCollect({
        msgId: localStorage.getItem("userId"),
        planRecommendedId: sessionStorage.getItem("planRecommendedId"),
        token: token,
        fid: this.$store.state.favoritesList[index].bid
      }).then(response => {
        if (response) {
          this.API.getDesignPlanHasBeCollected({
            // 获取该方案的收藏状态
            userId: localStorage.getItem("userId"),
            recommendId: sessionStorage.getItem("planRecommendedId")
          }).then(response => {
            if (response) {
              if (this.$store.state.isFirst) {
                this.$store.state.recomItem.bid = response.obj;
              } else {
                this.$emit("changebid", response.obj);
              }
            }
          });
          this.$store.state.happenCollect = true; // 用来做切换到收藏页面的时候是否刷新列表的判断
          this.$store.state.hintMsg = true;
          // this.$store.state.subHintPopup = true;
          this.$store.state.collectSignFlag = true;
        }
        this.selIndex = -1; // 收藏夹选中的索引
        this.tickIndex = -1; // 收藏夹勾选的索引
        this.$store.state.favoritesFlag = false;
        this.$store.state.firstClass = "first-icon collect-icon collected-icon";
        this.$store.state.happenCancelCollect = true;
      });
    },
    closeFavorites() {
      // 关闭收藏夹
      this.$store.state.favoritesFlag = false;
    }
  },
  computed: mapState({
    favoritesFlag: state => state.favoritesFlag,
    favoritesList: state => state.favoritesList
  })
};
</script>

<style lang="scss">
@import "styles/mixin.scss";

.favorites-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
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

.favorites-wrapper.fade-enter-active,
.favorites-wrapper.fade-leave-active {
  transition: all 0.5s;
}

.favorites-wrapper.fade-enter,
.favorites-wrapper.fade-leave-active {
  opacity: 0;
  background: rgba(7, 17, 27, 0);
}

.favorites-wrapper .popup-wrapper {
  background-color: #f7f7f8;
  border-radius: 6px;
  z-index: 101;
  width: 478px;
  max-height: 446px;
}

.favorites-wrapper .popup-wrapper .popup-header {
  margin: 14.000000000000002px 14.000000000000002px;
  height: 86px;
  background: #fff;
  border-radius: 10px 10px 0 0;
}

.favorites-wrapper .popup-wrapper .popup-header .title {
  display: block;
  text-align: center;
  line-height: 86px;
  font-size: 30px;
  color: #ff6419;
  float: left;
  margin-left: 30px;
}

.favorites-wrapper .popup-wrapper .popup-header .cancel {
  display: block;
  width: 30px;
  height: 30px;
  float: right;
  margin: 10px;
  background: #fff;
  border-radius: 50%;
  position: relative;
}

.favorites-wrapper .popup-wrapper .popup-header .cancel .cancelImg {
  width: 18px;
  height: 18px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.favorites-wrapper .popup-wrapper .favorites-content {
  width: 478px;
  min-height: 300px;
}

.favorites-wrapper .popup-wrapper .favorites-content .content-wrapper {
  color: #333333;
  background: #fbfbfb;
  overflow: auto;
}

.favorites-wrapper
  .popup-wrapper
  .favorites-content
  .content-wrapper
  .favorites-item {
  position: relative;
  margin: 2.5px 14.000000000000002px;
  font-size: 26px;
  height: 68px;
  line-height: 68px;
  background-color: #fff;
}

.favorites-wrapper
  .popup-wrapper
  .favorites-content
  .content-wrapper
  .favorites-item
  .favorites-item-name {
  display: inline-block;
  padding-left: 30px;
}

.favorites-wrapper
  .popup-wrapper
  .favorites-content
  .content-wrapper
  .favorites-item
  .tick {
  display: block;
  width: 22px;
  height: 17px;
  position: absolute;
  right: 30px;
  top: 20px;
}

.favorites-wrapper .popup-wrapper .favorites-content .content-wrapper .active {
  background: #d2d2d2;
}
</style>
