<template>
  <div class="space__container">
    <div class="space__form">
      <div class="form__item" v-for="(item, index) in conditionInfo" :key="index">
        <div class="form__item--content">
          <!--<span class="form__item&#45;&#45;label" v-html="`${item.conditionLabel}：`"></span>-->
          <span class="form__item--value" @click="showCoditionPannel(index)" :class="{'active':item.active}">
                <span v-if="!(item.selectedCondition && item.selectedCondition.includes('.png'))" v-text="index==0 ? item.selectedCondition : item.conditionLabel "></span>
                <img class="form__item--img" v-else :src="userInfo.resourcesUrl+item.selectedCondition" />
              </span>
        </div>
        <div class="condition" v-if="item.active">
          <div class="condition__item" v-for="(condition, key) in item.conditionData" :key="key" @click="selectConditionSearch(condition, index)" :class="{'bgActive':item.selectedCondition==condition.name}">
            <span class="condition__item--name" v-if="condition.name" v-text="condition.name"></span>
            <div class="condition__item--imgbox" v-else>
              <img class="condition__item--img" v-if="condition.picPath !== '全部'" :src="userInfo.resourcesUrl+condition.picPath">
              <span class="condition__item--name" v-else v-text="condition.picPath"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <scroll beforeScroll pullup :data="searchSpaceList" @scrollToEnd="loadMore">
      <div class="space__content">
        <!--<div class="space__mask" v-if="spaceMask"></div>-->
        <div class="space__shell" v-if="searchSpaceList" v-load-more="!isAllData" v-all-loaded="isAllData">
          <div class="space__list" v-if="searchSpaceList.length">
            <img-item v-for="(item, index) in searchSpaceList" :key="index" :itemData="item"></img-item>
          </div>
          <empty v-else></empty>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'Vuex';
import ImgItem from 'components/HouseTypeImgItem';
import { get, find, isArray, debounce } from 'lodash';

export default {
  name: 'house-space',
  data() {
    return {
      computeCondition: '',
      condition: [
        {
          labelName: '空间',
          dataName: 'spaceList'
        },
        {
          labelName: '面积',
          dataName: 'areaList'
        },
        {
          labelName: '形状',
          dataName: 'shapeList'
        }
      ],
      selectConditionList: {
        spaceFunctionId: 3,
        areaValue: 17,
        spaceShape: ''
      },
      start: 0,
      spaceMask:false
    }
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    ...mapGetters('space', ['spaceList', 'areaList', 'shapeList', 'searchSpaceList', 'spaceCount']),
    isAllData() {
      return isArray(this.searchSpaceList) && (this.searchSpaceList.length === this.spaceCount);
    },
    conditionInfo: {
      get() {
        if(
          get(this.computeCondition, '0.conditionData')
          && get(this.computeCondition, '1.conditionData')
          && get(this.computeCondition, '2.conditionData')
        ) { return this.computeCondition};
        this.computeCondition = Array.from(new Array(3)).map((item, index, input) => {
          return {
            conditionLabel: this.condition[index]['labelName'],
            selectedCondition: get(this[this.condition[index]['dataName']], '0.name') || get(this[this.condition[index]['dataName']], '0.picPath'),
            active: false,
            conditionData: this[this.condition[index]['dataName']]
          }
        });
        console.log(this.computeCondition)
        return this.computeCondition;
      },
      set({index, data}) {
        this.computeCondition.splice(index, 1, data)
      }
    }
  },
  methods: {
    ...mapActions('space', ['initConditionQuery', 'queryAreaList', 'querySpaceSearchList']),
    showCoditionPannel: debounce(function(index) {
      this.spaceMask=!this.spaceMask;
      this.conditionInfo = {
        index: index,
        data: Object.assign(this.conditionInfo[index], {active: !this.conditionInfo[index]['active']})
      };

    }, 20),
    async selectConditionSearch(...args) {
      let [data, index] = args;
      this.conditionInfo = {
        index: index,
        data: Object.assign(this.conditionInfo[index], {
          active: false,
          selectedCondition: get(data, 'name') || get(data, 'picPath')
        })
      };

      if(!index) {
        await this.queryAreaList(data.valuekey);

        this.conditionInfo = {
          index: 1,
          data: Object.assign(this.conditionInfo[1], {
            selectedCondition: get(this.areaList, '0.name'),
            conditionData: this.areaList
          })
        }

        this.selectConditionList = Object.assign(this.selectConditionList, {
          spaceFunctionId: data.value,
          areaValue: get(find(this.areaList, get(this.conditionInfo, '1.name')), 'value'),
          spaceShape: get(find(this.shapeList, {picPath: get(this.conditionInfo, '2.selectedCondition')}), 'value')
        });
      }
      else {
        this.selectConditionList = Object.assign(this.selectConditionList, {
          spaceFunctionId: get(find(this.spaceList, {name: get(this.conditionInfo, '0.selectedCondition')}), 'value'),
          areaValue: get(find(this.areaList, {name: get(this.conditionInfo, '1.selectedCondition')}), 'value'),
          spaceShape: get(find(this.shapeList, {picPath: get(this.conditionInfo, '2.selectedCondition')}), 'value')
        });
      }

      this.start = 0
      this.querySpaceSearchList(this.selectConditionList);
    },
    loadMore() {
      if(!this.isAllData) {
        this.start++;
        this.querySpaceSearchList({...this.selectConditionList, start: this.start});
      }
    }
  },
  components: {
    ImgItem
  },
  created() {
    this.initConditionQuery();
  }
}
</script>

<style lang="scss" scoped>
  .space {

    @at-root #{&}__container{
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    @at-root #{&}__form {
      background-color: #fff;
      display: flex;
      position: relative;
      z-index: 11;
      @at-root .form {
        @at-root #{&}__item {
          flex: 1;
          font-size: 30px;
          text-align: center;
          &:not(:nth-last-of-type(1)) {
            border-bottom: 1px solid #eee;/*no*/
          }
          &:nth-of-type(2){

          }
          @at-root #{&}--content {
            //padding-left: 30px;
          }

          @at-root #{&}--label {
            color: #747474;
            height: 88px;
            line-height: 88px;
          }

          @at-root #{&}--value {
            height: 88px;
            line-height: 88px;
            display: inline-block;
            //margin-left: 40px;
            color: #494949;
            //padding: 0 30px;
            &::after{
              content: '';
              display: inline-block;
              width: 0;
              height: 0;
              border-bottom: 10px transparent solid;
              border-right: 10px transparent solid;
              border-left: 10px transparent solid;
              border-top: 10px #333 solid;
              margin-left: 10px;
             position: relative;
              top: 5px;
              transition: all 0.5s;
            }
          }
          .active{
            color: #ff6419;
            &::after{
              border-top: 10px #ff6419 solid;
              transform: rotate(180deg);
              top: -5px;
            }
          }


          @at-root #{&}--img {
            width: auto;
            height: 40px;
            filter: brightness(0.55) invert(1);
            transform: translateY(20%);
          }
        }
      }

      @at-root .condition {
        display: flex;
        flex-wrap: wrap;
        padding: 15px 60px;
        font-size: 26px;
        background-color: #fff;
        box-sizing: border-box;
        position: absolute;
        top: 88px;
        left: 0;
        z-index: 11;
        @at-root #{&}__item {
          display: flex;
          justify-content: center;
          align-items: center;
          width:180px;
          height: 80px;
          border-radius: 5px;
          background-color: #f8f8fa;
          margin: 15px;
          @at-root #{&}--imgbox {
            display: flex;
            align-items: center;
            height: 100%;
          }

          @at-root #{&}--img {
            width: auto;
            height: 67%;
            line-height: 0.8rem;
            object-position: 50%;
            object-fit: cover;
            filter: brightness(0.55) invert(1);
          }
        }
        .bgActive{
          background-color: #fff1eb;
          color: #ff6419;
        }
      }

    }

    @at-root #{&}__shell {
      padding-bottom: 30px;
      background-color: #fff;
    }
    @at-root #{&}__mask {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 9;
    }
    @at-root #{&}__list {
      display: flex;
      flex-wrap: wrap;
      padding: 15px;
    }
  }
</style>
