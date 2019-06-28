<template>
  <div class="upload__container">
    <div class="upload__header">
      <span class="upload__header--back" @click="$router.back()"></span>
      <span class="upload__header--title">上传户型图</span>
    </div>
    <div class="upload__content">
      <div class="upload__tip">提交后，工作人员会及时将您上传的户型更新在系统中</div>
      <div class="upload__form">
        <div class="form__item">
          <span class="item__label">所在地区</span>
          <house-address class="item__address"></house-address>
        </div>
        <div class="form__item">
          <span class="item__label">所在小区</span>
          <input class="item__text" type="text" placeholder="请输入小区名称" v-model="villageName">
        </div>
        <div class="form__item">
          <span class="item__label">户型名称</span>
          <input class="item__text" type="text" placeholder="请输入户型名称所属楼、栋编码" v-model="villageCode">
        </div>
        <div class="form__item">
          <span class="item__label">户型面积</span>
          <input class="item__text" type="number" placeholder="请输入户型面积（㎡）" maxlength="4" v-model="villageArea">
        </div>
        <div class="form__item">
          <span class="changeWidth">户型图</span>
          <div>
            <!--<button class="item__upbtn needsclick" @click="uploadTrigger">上传</button>-->
            <div class="uploadImg_box">
              <div class="uploadImg" @click="uploadTrigger"></div>
              <img v-if="villageImg" :src="villageImg" class="item__img">
              <input type="file" accept="image/png,image/jpeg,image/jpg" @change="uploadImg($refs.typeImg.files.item(0))" ref="typeImg">
            </div>
            <div class="upload_demo">
              <div class="upload_demoImg"></div>
              <div class="upload_demo_text">
                  <p>*上传示例</p>
                  <p>请尽量上传尺寸标注清晰、规范的户型图，拍照时保持纸张平整，手机与纸张平行。</p>
              </div>
            </div>
          </div>
        </div>
        <div class="form__item">
          <span class="item__label item_desc_text">户型描述</span>
          <textarea class="item__desc" v-model="villageDesc" placeholder="请描述户型的具体信息（选填）"></textarea>
        </div>
        <div class="form__submit">
          <button class="form__submit--btn" :class="{active: isSubmit}" @click="isSubmit && submitHouseInfo()">提交</button>
        </div>
      </div>
    </div>
    <select-upload-pic v-if="showUploadType" :showUploadTypeStatus.sync="showUploadType" @selectedPic="uploadImg"></select-upload-pic>
  </div>
</template>

<script>
import HouseAddress from 'components/HouseAddress';
import { mapGetters, mapActions } from 'Vuex';
import selectUploadPic from 'components/SelectUploadPic/index.vue';
import transformIMG from 'utils/transformUploadImg';
import { get } from 'lodash';

export default {
  name: 'upload-house-type',
  data() {
    return {
      villageName: '',
      villageCode: '',
      villageArea: '',
      villageImg: '',
      villageImgFile: '',
      villageImgFileName: '',
      villageDesc: '',
      showUploadType: false
    }
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    ...mapGetters('area', ['selectCity']),
    isSubmit() {
      return !!this.villageName && !!this.villageCode && !!this.villageArea && !!this.villageImgFile
    }
  },
  methods: {
    ...mapActions('uploadHouseInfo', ['uploadHouseInfo']),
    uploadTrigger() {
      if(navigator.camera) { return this.showUploadType = true; };
			this.$refs.typeImg.click();
    },
    async uploadImg(file) {
      let data = await transformIMG(file);
      if(data) {
        this.villageImgFile = data.file;
        this.villageImgFileName = data.fileName;
        this.villageImg = URL.createObjectURL(data.file);
      }
    },
    submitHouseInfo() {
      let formData = new FormData();
      formData.append('cityInfo', this.selectCity.join(''));
      formData.append('userId', get(this.userInfo, 'id'));
      formData.append('msgId', get(this.userInfo, 'id'));
      let keyList = ['villageName', 'villageCode', 'villageArea', 'villageImgFile', 'villageDesc'];
      ['livingInfo', 'houseName', 'houseArea', 'file', 'description'].forEach((item, index) => {
        if(item === 'file') { return formData.append(item, this[keyList[index]], this.villageImgFileName); };
        formData.append(item, this[keyList[index]]);
      });

      this.uploadHouseInfo(formData);
    }
  },
  components: {
    HouseAddress,
    selectUploadPic
  }
}
</script>

<style lang="scss" scoped>
.upload {

  @at-root #{&}__container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
  }

  @at-root #{&}__header {
    flex: 0 0 auto;
    position: relative;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 36px;
    background-color: #fff;
    //border-bottom: 1px solid #ddd;

    @at-root #{&}--back {
      position: absolute;
      top: 50%;
      left: 20px;
      width: 45px;
      height: 45px;
      background-image: url("./images/nav_icon_back_black.png");
      background-position: 50%;
      background-size: cover;
      transform: translateY(-50%);
    }
  }

  @at-root #{&}__tip {
    height: 80px;
    line-height: 80px;
    padding: 0 30px;
    font-size: 28px;
    color: #ff6419;
    background-color: #fff5f0;
  }

  @at-root #{&}__form {
    padding: 30px;

    @at-root .form {
      @at-root #{&}__item {
        display: flex;
        min-height: 90px;
        align-items: center;
        .upload_demo{
          display: flex;
          align-items: center;
          margin: 30px 0 30px 20px;
          .upload_demoImg{
            width: 160px;
            height: 160px;
            background: no-repeat center url("./images/type_pic_example.png");
            background-size: 100%;
            margin-right: 20px;
          }
          .upload_demo_text{
             flex: 1;
          }
          p:nth-of-type(1){
            color: #ff6419;
            font-size: 24px;
            line-height: 48px;
          }
          p:nth-of-type(2){
            color: #999999;
            font-size: 22px;
            line-height: 48px;
            text-align: justify;
          }
        }
        .changeWidth{
          display: inline-block;
          width: 260px;
          font-size: 30px;
          color: #747474;
        }
        .uploadImg_box{
           display: flex;
          input{
            position: absolute;
            width: 160px;
            height: 160px;
            opacity: 0;
          }
        }
         .uploadImg{
            width: 160px;
            height: 160px;
           background: no-repeat center url("./images/type_pic_add.png");
           background-size: 100%;
           margin-left: 20px;
           margin-top: 20px;
         }
        @for $i from 1 through 5 {
          &:nth-of-type(#{$i}) {
            border-bottom: 1px solid #f5f5f5;
          }
        }

        &:nth-of-type(5) {
          .item__label {
            letter-spacing: 10px;
          }
        }
        .item_desc_text{
          width: 160px;
          margin-top: -70px;
        }

        @at-root .item {

          @at-root #{&}__label {
            line-height: 90px;
            font-size: 30px;
            color: #747474;
            margin-right: 20px;
          }
          @at-root #{&}__address {
            height: 70px;
            line-height: 70px;
            font-size: 30px;
            margin-left: 20px;
            &:before {
              border: none!important;
            }
          }

          @at-root #{&}__text {
            flex: 1 1 auto;
            //background-color: #efefef;
            height: 70px;
            font-size: 28px;
            text-indent: 20px;
            color: #333;
            border-radius: 0;
            -webkit-appearance: none;

            &::-webkit-input-placeholder {
              color: rgb(187, 187, 187);
            }
          }

          @at-root #{&}__upbtn {
            position: relative;
            width: 190px;
            height: 60px;
            border: none;
            font-size: 26px;
            color: #fff;
            background-color: #ff6419;
            border-radius: 50px;

            input {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              opacity: 0;
            }
          }

          @at-root #{&}__img {
            width: 160px;
            height: 160px;
            margin-left: 20px;
            margin-top: 20px;
          }

          @at-root #{&}__desc {
            display: block;
            width: 100%;
            min-height: 180px;
            line-height: 34px;
            text-indent: 20px;
            font-size: 28px;
            border-radius: 20px;
            padding: 40px 0;
            box-sizing: border-box;
            &::-webkit-input-placeholder {
              color: rgb(187, 187, 187);
            }
          }
        }
      }

      @at-root #{&}__submit {
        margin-top: 20px;

        @at-root #{&}--btn {
          width: 100%;
          height: 80px;
          line-height: 80px;
          font-size: 0.3rem;
          color: #fff;
          background-color: #cccccc;
          border: none;
          border-radius: 0.5rem;

          &.active {
            background-color: #ff6419;
          }
        }
      }
    }
  }
}

</style>

