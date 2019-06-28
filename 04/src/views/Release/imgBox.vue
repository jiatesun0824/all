<template>
  <div class="imgBox">
    <header>
      <i class="icon-left" @click="$router.back()"></i>
      <div class="title" v-text="`${uploadImageList.length}张`"></div>
      <!-- <div class="right" @click="$router.back()">确定</div> -->
    </header>
    <div class="wrapper">
      <div class="content">
        <ul>
          <li v-for="(item,index) in uploadImageList" :key="index">
            <img :src="item.url">
            <i class="ic-del" @click.self="deleteCurrentImg(index)"></i>
          </li>
          <li class="add-box needsclick" @click="showSelectUpload">
            <input type="file" ref="uploadField" style="display: none;" @change="uploadPic($refs.uploadField.files.item(0))" class="upload-img" accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp">
            <img src="./images/release_icon_add.png" class="add-img">
          </li>
        </ul>
      </div>
    </div>
    <select-upload-type v-if="showUploadType" :showUploadTypeStatus.sync="showUploadType" @selectedPic="uploadPic"></select-upload-type>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'Vuex';
import selectUploadType from 'components/SelectUploadPic/index.vue';
import transformIMG from 'utils/transformUploadImg';

export default {
  name: "imgBox",
  data() {
    return {
      showUploadType: false
    }
  },
  computed: {
    ...mapGetters("release", ["uploadImageList"])
  },
  methods: {
    ...mapActions("release", [
      "deleteCurrentImg",
      "setCurrentImg",
      "uploadImg"
    ]),
    showSelectUpload() {
      if(this.uploadImageList.length === 9) { return this.$toast("最多只能上传9张！"); }
      if(navigator.camera) { return this.showUploadType = true; };
      return this.$refs.uploadField.click();
    },
    async uploadPic(file) {
      !navigator.camera && (this.$refs.uploadField.type = 'text');

      let index = this.uploadImageList.length;

      let data = await transformIMG(file);

      if(data) {
        let status = await this.uploadImg({
            index, ...data
          });

        if(status) { this.$router.push('/imgBox'); }
      }

      !navigator.camera && (this.$refs.uploadField.type = 'file');
    },
    limitImgSize(size) {
      if((size / (1024 * 1024)) >= 1) {
        this.$refs.uploadField.type = 'file'
        this.$toast('不能上传大于1M的图片！');
        return false;
      }
      return true;
    }
  },
  components: {
    selectUploadType
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.imgBox {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
header {
  display: flex;
  height: 88px;
  line-height: 88px;
  position: relative;
  color: #333;
  background-color: #fff;
  .icon-left {
    position: absolute;
    left: 0;
    top: 0;
  }
  .title {
    width: 100%;
    text-align: center;
    font-size: 36px;
  }
  .right {
    position: absolute;
    right: 30px;
    top: 0;
    color: #ff6419;
    font-size: 36px;
  }
}

.wrapper {
  flex: 1;
  margin-top: 20px;
  .content {
    width: 95%;
    height: 100%;
    margin: 0 auto;
    padding: 0 30px;
    box-sizing: border-box;
    background: #fff;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      position: relative;
      flex-basis: 31%;
      margin-top: 30px;
      img {
        width: 100%;
        height: 150px;
      }
      .ic-del {
        position: absolute;
        top: -20px;
        right: -20px;
      }
    }
    li:nth-child(3n-1) {
      margin-left: 3.5%;
      margin-right: 3.5%;
    }
    .add-box {
      flex-basis: 31%;
      height: 150px;
      background: #f5f5f5;
      position: relative;
      margin-top: 25px;
      // margin-left: 25px;
      .upload-img {
        width: 0;
        height: 150px;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
        opacity: 0;
        -ms-filter: "alpha(opacity=0)";
      }
      .add-img {
        position: absolute;
        width: 36px;
        height: 36px;
        top: 50%;
        left: 50%;
        z-index: 9;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
