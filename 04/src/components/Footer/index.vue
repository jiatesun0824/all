<template>
  <div class="footer" v-if="footerShow">
    <div class="item-wrapper" v-if="aTxt.length" v-for="(item,index) in aTxt" @click="selected(index)" :key="index">
      <router-link class="item"
        :to="aRouter[index]"
        :class="(isRecom && index == 1) || (presentPath == '/typechange' && !isRecom && index == 2) || (presentPath == '/fastDecorate' && !isRecom && index == 2) || (presentPath == '/fastDecorate' && isRecom && index == 1) ? 'active' : ''">
        <div class="dot" v-show="personalHideHeader" v-if="aTxt[index] == '个人中心' && showDot"></div>
        <span class="tab-icon" :class="classMap[index]"></span>
        <span class="text">{{item.name}}</span>
      </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from "Vuex";
import { bus } from "api/api.js";

export default {
  name: 'v-footer',
  data() {
    return {
      //        aTxt: ['我的设计', '方案', '户型', '个人中心'],
      aTxt: [],
      aRouter: ["/design", "/recom", "/search", "/personal"],
      classMap: ["mydesign", "scheme", "search", "personal"]
    };
  },
  created() {
    this._getMenuTree();
    bus.$on("footerTabShow", data => {
      let menu = JSON.parse(data);
      this.aTxt = menu.subMenuList;
    });
  },
  methods: {
    _getMenuTree() {
      if (
        localStorage.getItem("isLogined") &&
        localStorage.getItem("isLogined") === "1"
      ) {
        // 已登录取缓存中的菜单
        if (localStorage.getItem("menu")) {
          let storageMenu = JSON.parse(localStorage.getItem("menu"));
          this.aTxt = storageMenu.subMenuList;
        }
      }
    },
    selected(i) {
      this.$store.commit("changeTxt", this.aTxt[i].name);
      // sessionStorage.setItem('name', '');
      // sessionStorage.setItem('houseType', '');
      sessionStorage.setItem("designRecommendedStyleId", "");
      if (i == 0) {
        bus.$emit("myDesignDataReload");
      }
      if (i == 0 || i == 3) {
        this.$store.state.isPersonal = true;
        // this.$store.state.personalHideHeader = true;
      } else {
        this.$store.state.personalHideHeader = false;
        this.$store.state.isPersonal = false;
      }
      if (i == 1) {
        // 控制头部显示搜索按钮
        this.$store.state.searchBtnFlag = true;
      } else {
        this.$store.state.searchBtnFlag = this.$store.state.isRecom = false;
      }
      if (i == 2) {
        this.$store.state.comeFromPlan = false;
      }
      if (i == 3) {
        // 控制头部显示退出登录按钮
        this.$store.state.personalFlag = true;
        this.$store.state.intergralHeader = true;
        this.$store.state.personalHideHeader = false;
      } else {
        this.$store.state.personalFlag = false;
        this.$store.state.personalHideHeader = true;
      }
      this.$store.state.isMyTask = true;
    }
  },
  computed: mapState({
    showDot: state => state.showDot,
    isRecom: state => state.isRecom,
    intergralHeader: state => state.intergralHeader,
    personalHideHeader: state => state.personalHideHeader,
    presentPath: state => state.presentPath,
    footerShow: state => state.footerShow
  })
};
</script>

<style lang="scss">
@import "styles/mixin.scss";
.footer {
  display: flex;
  height: 98px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}

.footer .item-wrapper {
  flex: 1;
}

.footer .item-wrapper .item {
  display: block;
  text-align: center;
  height: 100%;
  font-size: 20px;
}

.footer .item-wrapper .item .dot {
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: red;
  position: absolute;
  right: 56.00000000000001px;
  top: 8px;
}

.footer .item-wrapper .item .tab-icon {
  display: inline-block;
  margin: 8px 0;
  width: 44px;
  height: 44px;
  text-align: center;
  background-size: 44px 44px;
  background-repeat: no-repeat;
}

.footer .item-wrapper .item .tab-icon.mydesign {
  background-image: url("./images/mydesign_nor.png");
}

.footer .item-wrapper .item .tab-icon.scheme {
  background-image: url("./images/scheme_nor.png");
}

.footer .item-wrapper .item .tab-icon.search {
  background-image: url("./images/search_nor.png");
}

.footer .item-wrapper .item .tab-icon.personal {
  background-image: url("./images/personal_nor.png");
}

.footer .item-wrapper .item .text {
  display: block;
  line-height: 20px;
  font-size: 20px;
  color: #333;
}

.footer .item-wrapper .item.active .tab-icon.mydesign {
  background-image: url("./images/mydesign_pre.png");
}

.footer .item-wrapper .item.active .tab-icon.scheme {
  background-image: url("./images/scheme_pre.png");
}

.footer .item-wrapper .item.active .tab-icon.search {
  background-image: url("./images/search_pre.png");
}

.footer .item-wrapper .item.active .tab-icon.personal {
  background-image: url("./images/personal_pre.png");
}

.footer .item-wrapper .item.active .text {
  color: #ff6419;
}

.footer .item-wrapper .item .recom-item .text {
  color: #333;
}
</style>
