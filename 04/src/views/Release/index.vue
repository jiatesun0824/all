<template>
  <div class="release__container" @touchmove.prevent>
    <div class="release__header">
      <span class="release__header--back" @click="toReleaseType"></span>
      <div class="release__header--title" v-text="title"></div>
      <span class="release__header--submit" :class="{active: isRelease}" @click="isRelease && submitReleaseInfo()">发布</span>
    </div>
    <div class="release__content">
      <scroll beforeScroll :swipeTime="1000" :click="false" ref="releaseScroll">
        <div class="release__scroll">
          <div class="release__upload">
            <div class="release__upload--btn needsclick" :class="{active: !!uploadImageList.length}" @click="selectUploadPic">
              <img class="release__upload--img" v-if="uploadImageList.length" v-lazy="uploadImageList[0].url">
            </div>
            <input type="file" style="display: none;" ref="uploadField" @change="uploadPic($refs.uploadField.files.item(0))" accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp">
          </div>
          <div class="release__type" :key="setRealseType">
            <div class="release__type--item" v-for="(item, index) in releaseTypeList" :key="index">
              <span class="release__type--wrap" @click="changeType(index)">
                <i class="release__type--icon" :class="{active: item.active}"></i>
                <span v-text="item.label"></span>
              </span>
            </div>
          </div>
          <div class="release__info">
            <div class="info__item">
              <span class="info__label">区域</span>
              <div class="info__input">
                <div class="info__text" @click="showCitySelect = !showCitySelect">
                  <input type="text" placeholder="请选择" readonly v-model="selectAreaValue" :key="setAreaValue">
                </div>
                <i class="info__icon"></i>
              </div>
            </div>
            <div class="info__item">
              <span class="info__label">详细地址</span>
              <div class="info__input">
                <input type="text" placeholder="请输入" v-model="releaseData.address" maxlength="20">
              </div>
            </div>
            <div class="info__item">
              <span class="info__label">类别</span>
              <div class="info__input" @click="showInfoTypePannel">
                <div class="info__text">
                  <input type="text" placeholder="请选择" readonly v-model="selectInfoTypeValue" :key="setInfoTypeValue">
                </div>
                <i class="info__icon"></i>
              </div>
            </div>
            <div class="info__item">
              <span class="info__label">标题</span>
              <div class="info__input">
                <input type="text" placeholder="请输入" v-model="releaseData.title" maxlength="50">
              </div>
            </div>
            <div class="info__item">
              <span class="info__label">描述</span>
              <div class="info__input">
                <input type="text" placeholder="请输入" v-model="releaseData.description" maxlength="2000">
              </div>
            </div>
            <!-- <div class="info__item">
              <span class="info__label">联系人</span>
              <div class="info__input">
                <input type="text" placeholder="请输入" v-model="releaseData.contact" maxlength="10" @blur="onBlurRefreshScroll">
              </div>
            </div> -->
            <!-- <div class="info__item">
              <span class="info__label">手机号</span>
              <div class="info__input">
                <input type="number" placeholder="请输入" maxlength="11" v-model="releaseData.phone" @input="limitNum" @blur="onBlurRefreshScroll">
              </div>
            </div> -->
          </div>
          <div class="release__range">
            <div class="range__title">发布范围</div>
            <div class="range__content" :key="setRangeList">
              <div class="range__item" v-for="(item, index) in releaseRangeList" :key="index">
                <span class="range__wrap" @click="changeRange(index)">
                  <i class="range__icon" :class="{active: item.active}"></i>
                  <span v-text="item.name"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <div class="info__type" v-show="showInfoType" @click="showInfoTypeContent = false">
      <transition name="slideup" @after-leave="showInfoType = false">
        <div class="type__content" v-if="showInfoTypeContent">
          <div class="type__list" @click.stop>
            <div class="type__item"
              :class="{active: item.active}"
              v-for="(item, index) in releaseInfoTypeList"
              :key="index" v-text="item.name"
              @click="selectInfoType(item, index)"></div>
          </div>
          <div class="type__cancel" @click.stop="showInfoTypeContent = false">取消</div>
        </div>
      </transition>
    </div>
    <city-select :show.sync="showCitySelect" :items="allAreaData" @result="selectedCity"></city-select>
    <select-upload-type v-if="showUploadType" :showUploadTypeStatus.sync="showUploadType" @selectedPic="uploadPic"></select-upload-type>
  </div>
</template>

<script>
import { map, isEmpty, find, get, values } from 'lodash';
import { mapGetters, mapActions } from 'Vuex';
import citySelect from 'components/CitySelect/index.vue';
import selectUploadType from 'components/SelectUploadPic/index.vue';
import transformIMG from 'utils/transformUploadImg';

export default {
  name: 'release',
  props: ['type'],
  data() {
    return {
      title: `${this.$route.query.typeName}发布`,
      isEditRelease: !!this.$route.query.releaseId,
      isFromIssue: false,
      releaseTypeList: [
        {
          label: '供应方',
          value: 1,
          active: true
        },
        {
          label: '需求方',
          value: 2,
          active: false
        }
      ],
      selectAreaValue: '',
      releaseRangeList: [
        {
          key: 'decorationCompany',
          name: '装修公司'
        },
        {
          key: 'designer',
          name: '设计师'
        },
        {
          key: 'proprietor',
          name: '随选网(业主平台)'
        },
        {
          key: 'builder',
          name: '施工单位'
        },
        {
          key: 'materialShop',
          name: '家居建材门店'
        }
      ],
      showInfoType: false,
      showInfoTypeContent: false,
      selectInfoTypeValue: '',
      showCitySelect: false,
      showUploadType: false
    }
  },
  computed: {
    ...mapGetters('common', ['allAreaData']),
    ...mapGetters('release', ['uploadImageList', 'areaSeleced', 'releaseInfoTypeList', 'releaseData']),
    setRealseType() {
      this.releaseTypeList = this.releaseTypeList.map(item => Object.assign(item, { active: item.value == this.releaseData.type }));
    },
    setInfoTypeValue() {
      this.selectInfoTypeValue = get(find(this.releaseInfoTypeList, {active: true}), 'name') || '';
      setTimeout(() => {
        this.releaseData.supplyDemandCategoryId = this.type + ',' + get(find(this.releaseInfoTypeList, {active: true}), 'id');
      }, 200);
    },
    setAreaValue() {
      this.selectAreaValue = values(this.areaSeleced).join('') || '';
    },
    setRangeList() {
      this.releaseRangeList = this.releaseRangeList.map(item => Object.assign(item, {active: !!this.releaseData[item.key]}));
    },
    isRelease() {
      return !!this.uploadImageList.length && !!this.releaseData.province && !!this.releaseData.city && !!this.releaseData.district && !!this.releaseData.supplyDemandCategoryId && !!this.releaseData.title && !!this.releaseData.description && !!find(this.releaseRangeList, {active: true})
    }
  },
  methods: {
    ...mapActions('common', ['getAllAreaData']),
    ...mapActions('release', ['setCurrentImg', 'uploadImg', 'queryInfoTypeList', 'releaseInfo', 'initEditData']),
    delay(time) {
      return new Promise(resolve => setTimeout(() => resolve(true)), time)
    },
    toReleaseType() {
      this.$confirm({
        title: '提示',
        msg: '信息尚未发布，确认离开吗？'
      })
      .success(instance => {
        instance.close();
        this.isEditRelease ? this.$router.replace('/user/issue') : this.$router.push('/chooseRelease');
      })
    },
    changeType(index) {
      this.releaseTypeList = map(this.releaseTypeList, (item, i) => Object.assign(item, {active: i === index}));
      this.releaseData.type = index + 1;
    },
    changeRange(index) {
      this.releaseRangeList
      .splice(index, 1, Object.assign(this.releaseRangeList[index], {active: !this.releaseRangeList[index].active}))
      .forEach(item => Object.assign(this.releaseData, {[item.key]: Number(item.active)}));
    },
    showInfoTypePannel() {
      [this.showInfoType, this.showInfoTypeContent] = Array(2).fill(true);
    },
    selectUploadPic() {
      if(isEmpty(this.uploadImageList)) {
        if(navigator.camera) { return this.showUploadType = true; };
        return this.$refs.uploadField.click();
      }

      this.$router.push('/imgBox');
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
    selectedCity(cityList) {
      this.selectAreaValue = [1,2,3,4].map(item => cityList[`itemName${item}`]).join('');
      this.releaseData.province = cityList['itemValue1'];
      this.releaseData.city = cityList['itemValue2'];
      this.releaseData.district = cityList['itemValue3'];
      this.releaseData.street = cityList['itemValue4'];
      this.areaSeleced.provinceName = cityList['itemName1'];
      this.areaSeleced.cityName = cityList['itemName2'];
      this.areaSeleced.districtName = cityList['itemName3'];
      this.areaSeleced.streetName = cityList['itemName4'];
    },
    selectInfoType(item, i) {
      this.releaseInfoTypeList.forEach((item, index) => Object.assign(item, {active: index === i}));
      this.selectInfoTypeValue = item.name;
      this.releaseData.supplyDemandCategoryId = `${this.type},${item.id}`;
      this.showInfoTypeContent = false;
    },
    // limitNum() {
    //   this.releaseData.phone = this.releaseData.phone.length > 11 ? this.releaseData.phone.slice(0, 11) : this.releaseData.phone;
    // },
    submitReleaseInfo() {
      // if(!/^(13|14|15|16|17|18|19)\d{9}$/.test(this.releaseData.phone)) return this.$toast('请填写正确的手机号！');
      let data = Object.assign(this.releaseData, {coverPicId: this.uploadImageList.map(item => item.id).join(',')});
      this.releaseInfo(this.isEditRelease ? Object.assign(data, { id: this.$route.query.releaseId }) : data);
    },
    resetScrollHeight() {
      let that = this;
      window.addEventListener('resize', function() {
        that.$refs.releaseScroll.$el.scrollTop = 0;
        Array.from(Array(5)).forEach(() => {
          requestAnimationFrame(() => {
            that.$refs.releaseScroll && that.$refs.releaseScroll.refresh();
          });
        })
      }, false);
    }
  },
  components: {
    citySelect,
    selectUploadType
  },
  async created() {
    this.getAllAreaData();
    this.queryInfoTypeList(Number(this.type));
    await this.delay(100);
    this.isEditRelease && this.isFromIssue && this.initEditData();
    this.resetScrollHeight();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.isFromIssue = from.name === 'issue';
    })
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', () => {}, false);
    next();
  }
}
</script>

<style lang="scss" scoped>
.release {
  @at-root #{&}__container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #eee;
  }

  @at-root #{&}__header {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 36px;
    padding: 0 30px;
    background-color: #fff;
    border-bottom: 1px solid #ddd; /*no*/

    @at-root #{&}--back {
      width: 45px;
      height: 45px;
      background-image: url("./images/nav_icon_back_black.png");
      background-position: 50%;
      background-size: cover;
    }

    @at-root #{&}--submit {
      color: #b0b0b0;

      &.active {
        color: #ff6419;
      }
    }
  }

  @at-root #{&}__content {
    flex: 1;
    overflow: hidden;
    padding: 20px;
  }

  @at-root #{&}__upload {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 285px;
    margin-bottom: 20px;
    background-color: #fff;

    @at-root #{&}--btn {
      position: relative;
      width: 300px;
      height: 225px;
      font-size: 0;
      border: dotted 1px #e8e8e8;
      background-color: #fafafa;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("./images/release_icon_camera_normal.png");
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: 30%;
      }

      &.active:after {
        background-image: url("./images/release_icon_camera_active.png");
      }
    }

    @at-root #{&}--img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  @at-root #{&}__type {
    display: flex;
    height: 100px;
    padding: 30px;
    margin-bottom: 20px;
    font-size: 28px;
    color: #333;
    background-color: #fff;
    box-sizing: border-box;

    @at-root #{&}--item {
      flex-basis: 50%;
    }

    @at-root #{&}--wrap {
      padding: 15px 15px 15px 0;
    }

    @at-root #{&}--icon {
      display: inline-block;
      width: 35px;
      height: 35px;
      margin: 2px 40px 0 0;
      vertical-align: middle;
      background-image: url("./images/release_icon_select_nor.png");
      background-size: 90%;
      // background-position: 50%;
      background-repeat: no-repeat;

      &.active {
        background-image: url("./images/release_icon_select_sel.png");
      }
    }
  }

  @at-root #{&}__info {
    padding: 0 30px;
    background-color: #fff;

    @at-root .info {

      @at-root #{&}__item {
        display: flex;
        align-items: center;
        height: 100px;
        font-size: 28px;

        &:not(:nth-last-of-type(1)) {
          border-bottom: 1px solid #e8e8e8; /*no*/
        }

        &:not(:nth-of-type(2)) {
          .info__label:before {
            content: '\2731';
            position: absolute;
            left: -24px;
            top: 2px;
            font-size: 10px;
            color: #ff6419;
          }
        }

      }

      @at-root #{&}__label {
        position: relative;
        flex-basis: 190px;
        color: #666;
      }

      @at-root #{&}__input {
        flex: 1;
        display: flex;
        align-items: center;
        height: 80px;
        align-items: center;

        input {
          flex-basis: 100%;
          height: 100%;
        }
      }

      @at-root #{&}__text {
        flex: 1;
        display: flex;
        height: 80px;
      }

      @at-root #{&}__icon {
        flex-basis: 30px;
        height: 30px;
        background-image: url("./images/porfile_icon_open.png");
        background-size: cover;
        filter: brightness(50%);
      }
    }
  }

  @at-root #{&}__range {

    @at-root .range {

      @at-root #{&}__wrap {
        padding: 15px 15px 15px 0;
      }

      @at-root #{&}__title {
        margin: 40px 0;
        text-indent: 30px;
        font-size: 24px;
        color: #999;
      }

      @at-root #{&}__content {
        display: flex;
        flex-wrap: wrap;
        padding: 0 30px;
        background-color: #fff;
      }

      @at-root #{&}__item {
        flex-basis: 50%;
        height: 100px;
        line-height: 100px;
        font-size: 28px;
        color: #333;
      }

      @at-root #{&}__icon {
        display: inline-block;
        width: 35px;
        height: 35px;
        margin: -4px 40px 0 0;
        vertical-align: middle;
        background-image: url("./images/release_icon_select_nor.png");
        background-size: 90%;
        background-position: 50%;
        background-repeat: no-repeat;

        &.active {
          background-image: url("./images/release_icon_select_sel.png");
        }
      }
    }
  }

  @at-root .info {

    @at-root #{&}__type {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 10;

      @at-root .type {

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
    }
  }

  @at-root .pictrue {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
}
</style>
