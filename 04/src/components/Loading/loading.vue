<template>
  <div class="loading__container">
    <span class="loading__icon">
      <svg style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M240.64 332.8c25.6 25.6 66.56 25.6 92.16 0s25.6-66.56 0-92.16L240.64 148.48c-25.6-25.6-66.56-25.6-92.16 0s-25.6 66.56 0 92.16l92.16 92.16z m0 0" fill="#FFE4CB"></path>
        <path d="M240.64 691.2l-92.16 92.16c-25.6 25.6-25.6 66.56 0 92.16s66.56 25.6 92.16 0l92.16-92.16c25.6-25.6 25.6-66.56 0-92.16s-66.56-25.6-92.16 0z m0 0" fill="#FF9E3F"></path>
        <path d="M256 512c0-35.84-30.72-61.44-61.44-61.44H61.44C30.72 445.44 0 476.16 0 512s30.72 61.44 61.44 61.44h128c35.84 0 66.56-25.6 66.56-61.44z m0 0" fill="#FFC38C"></path>
        <path d="M783.36 332.8l92.16-92.16c25.6-25.6 25.6-66.56 0-92.16s-66.56-25.6-92.16 0l-92.16 92.16c-25.6 25.6-25.6 66.56 0 92.16s66.56 25.6 92.16 0z m0 0" fill="rgba(255,255,255,0.6)"></path>
        <path d="M783.36 691.2c-25.6-25.6-66.56-25.6-92.16 0s-25.6 66.56 0 92.16l92.16 92.16c25.6 25.6 66.56 25.6 92.16 0s25.6-66.56 0-92.16l-92.16-92.16z m0 0" fill="#ff6419"></path>
        <path d="M957.44 445.44h-128c-35.84 0-61.44 30.72-61.44 66.56 0 35.84 30.72 61.44 61.44 61.44h128c35.84 0 61.44-30.72 61.44-61.44 5.12-35.84-25.6-66.56-61.44-66.56z m0 0" fill="#EF6D00"></path>
        <path d="M512 768c-35.84 0-61.44 30.72-61.44 61.44v128c0 35.84 30.72 61.44 61.44 61.44 35.84 0 61.44-30.72 61.44-61.44v-128c0-35.84-25.6-61.44-61.44-61.44z m0 0" fill="#FF8800"></path>
        <path d="M512 0c-35.84 0-66.56 30.72-66.56 66.56v128c0 30.72 30.72 61.44 66.56 61.44 35.84 0 61.44-30.72 61.44-61.44V66.56C573.44 30.72 547.84 0 512 0z m0 0" fill="#fff1e4"></path>
      </svg>
      <span class="loading__text">加载中...</span>
    </span>
    
  </div>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style lang="scss" scoped>
  @keyframes loading-rotate {
    100% {
      transform: rotate(1turn);
    }
  }
  .loading {

    @at-root #{&}__container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -52%, 0);
      z-index: 1000;
    }

    @at-root #{&}__icon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 180px;
      height: 160px;
      text-align: center;
      background-color: #ffffff;
      filter: drop-shadow(0.5px 0.5px 3px rgba(176, 176, 176, 0.3));
      border-radius: 8px;

      svg {
        font-size: 60px;
        animation: loading-rotate 0.9s linear infinite;
      }
    }

    @at-root #{&}__text {
      margin-top: 20px;
    }
  }
</style>
