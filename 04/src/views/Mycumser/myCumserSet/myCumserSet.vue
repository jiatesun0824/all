<template>
  <div class="set">
    <header>
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">设置</div>
    </header>
    <div class="main">
      <div class="tit">
        选择自动派单方式
      </div>
      <div class="sel_item">
        <span>客户指定派单</span>
        <div :class="cumbool?'sel_true':'sel_false'" @click="changeCumBool">
          <span class="qiu" :class="cumbool?'qiu_active':'qiu_false'"></span>
        </div>

      </div>
      <div class="sel_item">
        <span>平台指定派单</span>
        <div :class="platbool?'sel_true':'sel_false'" @click="changePlatBool">
          <span class="qiu" :class="platbool?'qiu_active':'qiu_false'"></span>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        cumbool: true, // 客户指定派单
        platbool: true // 平台指定派单
      }
    },
    created() {
      this.API.getDispatch().then(res=> {
         this.cumbool = res.obj.isReceiveInteriorDispatch==1?true: false;
         this.platbool = res.obj.isReceivePlatformDispatch==1?true: false;
      })
    },
    methods: {
      changePlatBool() {
        if (this.platbool) {
          this.$confirm({
              title: '提示',
              msg: '关闭后，您的企业将不再接收来自平台指定的派单， 是否确定关闭？ '
            })
            .success(instance => {
              instance.close();
              this.platbool = !this.platbool;
              let Mark = {
                isReceiveInteriorDispatch: this.cumbool?1:0 ,
                isReceivePlatformDispatch: 0
              }
              this.setBool(Mark);
            })
        } else {
          this.platbool = !this.platbool;
          let Mark = {
                isReceiveInteriorDispatch: this.cumbool?1:0 ,
                isReceivePlatformDispatch: 1
              }
          this.setBool(Mark);
        }
      },
      changeCumBool() {
        if (this.cumbool) {
          this.$confirm({
              title: '提示',
              msg: '关闭后，您的企业将不再接收来自客户指定的派单， 是否确定关闭？ '
            })
            .success(instance => {
              instance.close();
              this.cumbool = !this.cumbool;
              let Mark = {
                isReceiveInteriorDispatch: 0,
                isReceivePlatformDispatch: this.platbool?1:0 
              }
              this.setBool(Mark);
            })
        } else {
          let Mark = {
                isReceiveInteriorDispatch: 1,
                isReceivePlatformDispatch: this.platbool?1:0 
              }
          this.setBool(Mark);
          this.cumbool = !this.cumbool;
        }
      },
      setBool(Mark) {
        this.API.setDispatch(Mark)
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/set.scss';

</style>
