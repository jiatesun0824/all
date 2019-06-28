<template>
  <div class="loadmore__container">
    <div class="loadmore__content">
      <svg class="loadmore__icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M240.64 332.8c25.6 25.6 66.56 25.6 92.16 0s25.6-66.56 0-92.16L240.64 148.48c-25.6-25.6-66.56-25.6-92.16 0s-25.6 66.56 0 92.16l92.16 92.16z m0 0" fill="#FFE4CB"></path>
        <path d="M240.64 691.2l-92.16 92.16c-25.6 25.6-25.6 66.56 0 92.16s66.56 25.6 92.16 0l92.16-92.16c25.6-25.6 25.6-66.56 0-92.16s-66.56-25.6-92.16 0z m0 0" fill="#FF9E3F"></path>
        <path d="M256 512c0-35.84-30.72-61.44-61.44-61.44H61.44C30.72 445.44 0 476.16 0 512s30.72 61.44 61.44 61.44h128c35.84 0 66.56-25.6 66.56-61.44z m0 0" fill="#FFC38C"></path>
        <path d="M783.36 332.8l92.16-92.16c25.6-25.6 25.6-66.56 0-92.16s-66.56-25.6-92.16 0l-92.16 92.16c-25.6 25.6-25.6 66.56 0 92.16s66.56 25.6 92.16 0z m0 0" fill="rgba(255,255,255,0.6)"></path>
        <path d="M783.36 691.2c-25.6-25.6-66.56-25.6-92.16 0s-25.6 66.56 0 92.16l92.16 92.16c25.6 25.6 66.56 25.6 92.16 0s25.6-66.56 0-92.16l-92.16-92.16z m0 0" fill="#ff6419"></path>
        <path d="M957.44 445.44h-128c-35.84 0-61.44 30.72-61.44 66.56 0 35.84 30.72 61.44 61.44 61.44h128c35.84 0 61.44-30.72 61.44-61.44 5.12-35.84-25.6-66.56-61.44-66.56z m0 0" fill="#EF6D00"></path>
        <path d="M512 768c-35.84 0-61.44 30.72-61.44 61.44v128c0 35.84 30.72 61.44 61.44 61.44 35.84 0 61.44-30.72 61.44-61.44v-128c0-35.84-25.6-61.44-61.44-61.44z m0 0" fill="#FF8800"></path>
        <path d="M512 0c-35.84 0-66.56 30.72-66.56 66.56v128c0 30.72 30.72 61.44 66.56 61.44 35.84 0 61.44-30.72 61.44-61.44V66.56C573.44 30.72 547.84 0 512 0z m0 0" fill="#fff1e4"></path>
      </svg>
      <span class="loading__text">努力加载中...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loadmore'
}
</script>

<style lang="scss" scoped>
  @keyframes loading-rotate {
    100% {
      transform: rotate(1turn);
    }
  }

  .loadmore {
    @at-root #{&}__container {
      flex-basis: 100%;
    }
    
    @at-root #{&}__content {
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 24px;
      color: #777;
    }

    @at-root #{&}__icon {
      margin-top: -3px;
      font-size: 28px;
      animation: loading-rotate 0.9s linear infinite;
    }
  }
</style>
