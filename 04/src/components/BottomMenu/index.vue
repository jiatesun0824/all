<template>
  <div class="BottomMenu__container" v-if="isShow">
    <a class="BottomMenu__item" :class="{active: item.isActive}" v-for="(item, key) in menuList" :key="key" @click="switchTab(key)" v-if="userInfo.userType == 11 ? item.name !== '设计' : true">
      <img class="BottomMenu__item--icon" :src="require(`./images/${item.isActive ? item.activeIcon : item.icon}.png`)">
      <span class="BottomMenu__item--name" v-text="(isIntermediary==11&&key==1)?'看房':item.name"></span>
    </a>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'Vuex'

  export default {
    name: 'bottom-menu',
    props: {
      isShow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isIntermediary: JSON.parse(localStorage.getItem('userInfo')).userType
      }
    },
    computed: {
      ...mapGetters('common', ['userInfo']),
      ...mapGetters('bottomMenu', ['menuList'])
    },
    methods: {
      ...mapActions('bottomMenu', ['changeActiveTab']),
      // 切换tab并跳转路由
      switchTab(index) {
        this.changeActiveTab(index)
        // 跳转路由
        this.$router.push(this.menuList[index].url)
      }
    }
  }
</script>

<style lang="scss" scoped>

  $activeColor: #ff6419;

  .BottomMenu {

    @at-root #{&}__container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 98px;
      background-color: #fff;
      z-index: 10000;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        border-top: 1px solid #e0e0e0; /*no*/
        transform: scaleY(0.5);
      }
    }

    @at-root #{&}__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      font-size: 20px;

      &.active {

        @at-root #{&} .BottomMenu__item--icon {
          fill: $activeColor;
        }

        @at-root #{&} .BottomMenu__item--name {
          color: $activeColor;
        }

      }
    }

    @at-root #{&}__item--icon {
      width: 56px;
      height: 56px;
    }

    @at-root #{&}__item--name {
      margin-top: 8px;
      color: #333;
    }

  }
</style>
