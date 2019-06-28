<template>
  <div id="app">
    <router-view v-if="refresh"></router-view>
    <div>

    </div>
    <div class="loading" v-show="loadingShow">加载中...</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  provide(){
    return {
      reload:this.reload
    }
  },
  data () {
    return {
      refresh:true
    }
  },
  computed: {
    ...mapGetters(['loadingShow'])
  },
  created () {
  },
  methods: {
     reload(){
        this.refresh=false;
        setTimeout(()=>{
          this.refresh=true;
        },300)
     }
  }
}
</script>

<style scoped lang='scss'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  .loading{
    width: 150px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
    font-size: 28px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 99;
    transform: translate(-50%)
  }
}
</style>
