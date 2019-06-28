<template>
  <div class="selectUploadType" :key="showContent" @click="closeShowUpload">
    <transition name="slideup" @after-leave="$emit('update:showUploadTypeStatus', false)">  
        <div class="selectUploadType__content" v-if="showUploadTypeContent">
          <div class="selectUploadType__list" @click.stop>
            <div class="selectUploadType__item"
              :class="{active: item.active}"
              v-for="(item, index) in uploadType"
              :key="index" v-text="item.name"
              @click="selectUploadType(index)"></div>
          </div>
          <div class="selectUploadType__cancel" @click="closeShowUpload">取消</div>
        </div>
      </transition>
  </div>
</template>

<script>
import lrz from 'lrz';

export default {
  name: 'selectUploadPic',
  props: {
    showUploadTypeStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadType: [
        {
          name: '拍照',
          active: false
        },
        {
          name: '从相册选择',
          active: false
        }
      ],
      showUploadTypeContent: false,
      nativeCamera: navigator.camera
    }
  },
  computed: {
    showContent() {
      setTimeout(() => {
        this.showUploadTypeContent = this.showUploadTypeStatus;
      })
    }
  },
  methods: {
    closeShowUpload() {
      this.showUploadTypeContent = false;
      this.$emit('noSelImg')
    },
    selectUploadType(i) {
      this.uploadType.forEach((item, index) => Object.assign(item, {active: index === i}));
      this.showNativePictureList(i ? 'picture' : 'camera');
    },
    showNativePictureList(type) {
      let that = this;
      let selectTypeData = {
        quality: 50,
        destinationType: this.nativeCamera.DestinationType.DATA_URL,
        sourceType: type === 'picture' ? this.nativeCamera.PictureSourceType.PHOTOLIBRARY : this.nativeCamera.PictureSourceType.CAMERA
      };

      this.nativeCamera.getPicture(function(imageURI){
        that.$emit('selectedPic', 'data:image/jpeg;base64,'+imageURI);
        that.$emit('update:showUploadTypeStatus', false);
      }, function(e){
        that.$emit('update:showUploadTypeStatus', false);
        console.log('没有选择图片或拍照！')
      }, selectTypeData);
    }
  }
}
</script>

<style lang="scss">
.selectUploadType {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;

  @at-root #{&}__content {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    &.slideup-enter-active{
      transition: all 200ms ease
    }
    &.slideup-leave-active {
      transition: all 150ms ease
    }

    &.slideup-enter, &.slideup-leave-active {
      transform: translate3d(0, 100%, 0)
    }
  }

  @at-root #{&}__list {
    margin-bottom: 20px;
    font-size: 36px;
    color: #333;
    border-radius: 12px;
    font-family: PingFang-SC-Medium;
    background-color: rgba(255, 255, 255, 0.95);
  }

  @at-root #{&}__item {
    position: relative;
    height: 100px;
    line-height: 100px;
    text-align: center;

    &:not(:nth-last-of-type(1)):after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px; /*no*/
      background-color: #ddd;
      transform: scaleY(0.5);
    }

    &.active {
      color: #ff6419;
    }
  }

  @at-root #{&}__cancel {
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 36px;
    color: #333;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.95);
  }
}
</style>
