<template>
  <div v-show="visible" class="dialog-tips dialog-center">
    <div class="msg">{{message}}</div>
  </div>
</template>

<script>
    export default {
        name: "toast",
        data(){
          return{
            visible: false,
            message: ""
          }
        }
    }
</script>

<style scoped lang="scss">
  .dialog-tips{
    position: fixed;
    z-index: 100;
    min-width: 160px;
    padding: 26px 30px;
    white-space: nowrap;
    background-color: rgba(0,0,0,0.8);
    box-shadow: 0 8px 15px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    .dialog-tips-icon{
      width: 54px;
      height: 54px;
      display: inline-block;
      margin-bottom: 13px;
    }
    .msg{
      color: #fff;
      font-size: 28px;
      line-height: 28px;
    }
  }
  .dialog-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }

</style>
