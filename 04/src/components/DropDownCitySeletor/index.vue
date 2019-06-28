<!--  -->
<template>
  <div class="drop-down-city-seletor">
    <div class="sel-wrapper" @touchmove.prevent >
      <div class="sel-city-area clearfix" v-if="localAreaData && storeAreaItem.areaName!='全国'">
        <scroll beforeScroll :listenScroll="listenScroll"
          :probeType="probeType"
          :pullup="true"
          :data="localAreaData"
          :key="refreshScroll"
          class="sel-city left"
          ref="cityScroll">
          <div>
            <div>
              <div class="city-item text-center relative" @click.stop="selectArea(storeAreaItem, -1)" :class="{'active': addressIndex === -1}">
                {{storeAreaItem.areaName}}
              </div>
              <div class="city-item text-center relative" v-for ="(item, index) in localAreaData" :key="index" @click.stop="selectArea(item, index)" :class="{'active': addressIndex === index}">
                {{item.areaName}}
              </div>
            </div>
          </div>
        </scroll>
        <scroll beforeScroll :listenScroll="listenScroll"
          :probeType="probeType" :pullup="true"
          :refreshScroll="true"
          :data="selCountryData" class="sel-area left" >
          <div>
              <div class="area-box">
                  <div class="area-checkbox relative" v-if="addressIndex === -1">
                      <input type="checkbox" :value="storeAreaItem.areaName" v-model="storeAreaItem.state">
                      <label :for="storeAreaItem.areaName"> {{ storeAreaItem.areaName}} </label>
                  </div>
                  <div class="area-checkbox relative" 
                      v-for="(item, index) in selCountryData" 
                      :key="index" v-if="addressIndex != -1">
                      <input type="checkbox" :value="item.areaName" @click="getSelectArea(item)" checked="true" v-model="item.state" >
                      <label :for="item.areaName">{{item.areaName}}</label>
                  </div>
              </div>
          </div>
        </scroll>
      </div>
      <div class="sel-reset relative" v-if="storeAreaItem.areaName!='全国'">
        <div class="sel-reset-box reset text-center" @click="resetData">重置</div>
        <div class="sel-reset-box comfirm text-center active" @click="comfirm">确定</div>
        <div class="divider divider-horizontal divider-top"></div>
        <div class="divider divider-horizontal divider-bottom"></div>
        <div class="divider divider-vertical divider-center"></div>
      </div>
      <div class="sel-switch-city text-center" :style="storeAreaItem.areaName=='全国'?'border-top:solid 4px #f5f5f5':''" @click="openCityWarpper"><i></i>切换城市</div>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/mixin";
import { getAllAreaByQuery } from "@/api/home";
import { cloneDeep, find, debounce } from 'lodash';
export default {
  name: "DropDownCitySeletor",
  mixins: [mixins],
  props: {
    refresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localAreaData: [],
      selCountryData: [],
      addressIndex: -1
    };
  },
  computed: {
    storeAreaItem() {
      return (
        this.$store.state.citySelector && cloneDeep(this.$store.state.citySelector.item)
      );
    },
    refreshScroll() {
      if(this.refresh) this.$refs.cityScroll.refresh()
    }
  },
  created() {
    this.requestGetAllArea(
      { pid: this.storeAreaItem.areaCode, levelId: 3 },
      res => {
        this.localAreaData = res.obj;
      }
    );
  },
  methods: {
    resetData() {
      this.addressIndex = -1;
    },
    openCityWarpper() {
      this.$router.push("/citySelector");
    },
    requestGetAllArea(data, callback) {
      getAllAreaByQuery(data).then(res => {
        callback(res);
      });
    },
    selectArea: debounce(function(item, index) {
      if (index == -1) {
        this.storeAreaItem.areaCode = this.$store.state.citySelector.item.areaCode;
      } else {
        this.storeAreaItem.areaCode = item.areaCode;
      }
      // console.log("selectArea:" + this.storeAreaItem.areaCode);
      this.requestGetAllArea({ pid: item.areaCode, levelId: 4 }, res => {
        this.selCountryData = res.obj.length ? res.obj : [{areaCode: '', areaName: '不限'}];
      });
      this.addressIndex = index;
    }, 20),
    getSelectArea(item) {
      this.storeAreaItem.areaCode = item.areaCode;
    },
    comfirm: debounce(function() {
      let selectArea;
      if(this.addressIndex === -1) {
        selectArea = { city: this.storeAreaItem.areaCode }
      }
      else {
        if(!find(this.selCountryData, { state: true })) {
          selectArea = { district: this.storeAreaItem.areaCode }
        }
        else {
          if(this.storeAreaItem.areaCode) {
            selectArea = { street: this.selCountryData.filter(item => item.state).map(item => item.areaCode).join(',') }
          }
          else {
            selectArea = { district: this.localAreaData[this.addressIndex]['areaCode'] }
          }
        }
      }
      // console.log("comfirm:" + this.storeAreaItem.areaCode);
      this.$emit("comfirm", selectArea);
    }, 20)
  }
};
</script>
<style lang='scss' scoped>
.sel-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /*max-height: 3rem*/
  background-color: #fff;
  overflow: auto;
  
  .sel {
    margin: 20px;
    font-size: 0;
    .sel-item {
      display: block;
      float: left;
      margin: 10px;
      width: 30%;
      height: 80px;
      line-height: 80px;
      text-align: center;
      font-size: 28px;
      color: #333;
      background-color: #f5f5f5;
      /*box-shadow: 0 0.02rem 0.02rem #aaa*/
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 5px;
      &.current-sel {
        background-color: #fff1eb;
        color: #ff6419;
      }
    }
  }

  .sel-province-city {
    height: 726px;
    .sel-city {
      width: 37%;
      background-color: #fff;
      position: absolute;
      left: 0;
      height: 726px;
      .city-item {
        padding: 31px 0;
        font-size: 28px;
        &.active {
          background-color: #f5f5f5;
        }
        &.active:before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 40px;
          background-color: #ff6419;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
        }
      }
    }
    .sel-area {
      width: 63%;
      position: absolute;
      right: 0;
      height: 726px;
      background-color: #f5f5f5;
      top: 0;
      .us-citybox {
        .t-city {
          padding: 30px 42px 9px;
          font-size: 28px;
          color: #333;
        }
        .area-box {
          .local-city::before {
            content: "";
            background-image: url("./images/list_icon_position.png");
            width: 20px;
            height: 20px;
            display: inline-block;
            position: absolute;
            left: 25px;
            top: 50%;
            background-size: 100%;
            transform: translateY(-50%);
          }
        }
      }
      .area-box {
        margin: 31px 40px 11px;
        display: flex;
        flex-wrap: wrap;
        .area-item {
          font-size: 28px;
          border-radius: 10px;
          padding: 15px 0;
          background-color: #fff;
          width: 45%;
          margin-bottom: 20px;
        }
        .area-item:nth-child(2n + 1) {
          margin-right: 10%;
        }
      }
    }
  }
  .sel-auto-height {
    height: 336px;
  }
  .sel-city-area {
    height: 726px;
    .sel-city {
      width: 37%;
      background-color: #fff;
      position: absolute;
      left: 0;
      height: 726px;
      .city-item {
        padding: 31px 0;
        font-size: 28px;
        &.active {
          background-color: #f5f5f5;
        }
        &.active:before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 40px;
          background-color: #ff6419;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
        }
      }
    }
    .sel-area {
      width: 63%;
      position: absolute;
      right: 0;
      height: 726px;
      background-color: #f5f5f5;
      .area-box {
        margin: 31px 50px 11px 160px;
        padding-bottom: 20px;
        .area-checkbox {
          padding: 15px 0;
          font-size: 28px;
          margin-bottom: 20px;
          input[type="checkbox"] {
            -webkit-appearance: none;
            background-image: url("./images/list_icon_check_nor.png");
            height: 30px;
            vertical-align: middle;
            width: 30px;
            background-size: 100%;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          input[type="checkbox"]:checked {
            background-image: url("./images/list_icon_check_sel.png");
          }
          input[type="checkbox"]:checked + label {
            color: #ff6419;
          }
        }
      }
    }
  }
  .sel-reset {
    background-color: #fff;
    display: flex;
    .sel-reset-box {
      width: 50%;
      font-size: 32px;
      padding: 29px 0;
    }

    .divider-center {
      left: 50%;
      transform: scaleX(0.5);
    }
  }
  .sel-switch-city {
    background-color: #fff;
    font-size: 32px;
    padding: 29px 0;
    i {
      background-image: url("./images/list_icon_exchange.png");
      display: inline-block;
      background-size: 100%;
      width: 36px;
      height: 36px;
      vertical-align: bottom;
      margin-right: 20px;
    }
  }
}
.sel-sort-box {
  background-color: #fff;
  .sort-item {
    padding: 31px 0;
    font-size: 28px;
    color: #333333;
  }
  .active {
    color: #ff6419;
  }
}
</style>