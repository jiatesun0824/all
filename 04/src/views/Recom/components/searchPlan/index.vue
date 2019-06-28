<template>
  <div class="search__container" v-show="showSearchBar" @click="showSearchAnimate = true">
    <transition name="dropdown" @after-leave="closeSearchPannel">
      <div class="search__content" v-if="showSearch" @click.stop>
        <div class="search__bar">
          <input type="text" class="search__input" v-model="keyword" placeholder="请输入方案名称" @keyup.enter="searchPlanKw">
          <span class="search__icon" @click="searchPlanKw">
            <svg style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M947.1 888L749.9 693.3c24.2-28.6 43.7-60.4 58.4-95 19.4-45.9 29.2-94.6 29.2-144.7s-9.8-98.8-29.2-144.7c-18.7-44.3-45.5-84-79.6-118.1-34.1-34.1-73.9-60.9-118.1-79.6-46-19.4-94.6-29.3-144.8-29.3-50.1 0-98.8 9.8-144.7 29.2-44.3 18.7-84 45.5-118.1 79.6-34.1 34.1-60.9 73.9-79.6 118.1-19.4 45.9-29.2 94.6-29.2 144.7s9.8 98.8 29.2 144.7c18.7 44.3 45.5 84 79.6 118.1 34.1 34.1 73.9 60.9 118.1 79.6 45.9 19.4 94.6 29.2 144.7 29.2 50.1 0 98.8-9.8 144.7-29.2 35.3-14.9 67.8-35.1 96.8-59.9l197.4 195 42.4-43zM465.8 760.2c-169.3 0-306.5-137.2-306.5-306.5s137.2-306.5 306.5-306.5 306.5 137.2 306.5 306.5-137.2 306.5-306.5 306.5z"></path></svg>
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'search-plan',
  props: {
    showSearchBar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSearchAnimate: this.showSearchBar,
      keyword: ''
    }
  },
  computed: {
    showSearch: {
      get() {
        return this.showSearchAnimate ? !this.showSearchAnimate : this.showSearchBar;
      },
      set(newValue) {
        this.showSearchAnimate = newValue;
      }
    }
  },
  methods: {
    closeSearchPannel() {
      this.showSearchAnimate = false;
      this.$emit('hideSearch');
    },
    searchPlanKw() {
      this.showSearch = true;
      this.$emit('searchKw', this.keyword);
      this.keyword = '';
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {

    @at-root #{&}__container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .4);
      z-index: 30;
    }
    @at-root #{&}__content {
      height: 88px;
      padding: 10px 30px;
      background-color: #fff;
      box-sizing: border-box;

      &.dropdown-enter-active{
        transition: all 200ms ease
      }
      &.dropdown-leave-active {
        transition: all 150ms ease
      }

      &.dropdown-enter, &.dropdown-leave-active {
        transform: translate3d(0, -100%, 0)
      }
    }

    @at-root #{&}__bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      background-color: #f7f7f8;
    }

    @at-root #{&}__input {
      flex: 1;
      height: 100%;
      font-size: 26px;
      text-indent: 15px;

      &:focus + span {
        color: #6d6d6d;
      }
    }

    @at-root #{&}__icon {
      margin-right: 20px;
      color: #b9b9b9;
    }
  }
</style>

