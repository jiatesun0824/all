<!-- 城市选择器 -->
<template>
  <div class="city-selector">
    <div class="tab borderBottom text-center">
      <div class="tab-icon tab-back" @click="$router.back()"></div>选择城市
    </div>
    <div class="sel-wrapper">
      <div class="sel-province-city clearfix">
        <scroll :listenScroll="listenScroll" :probeType="probeType" :pullup="true" :beforeScroll="true" :scrollX="true"
          :refreshScroll="true" :data="allAreaData" class="sel-city left">
          <div>
            <div>
              <div class="city-item text-center relative" :class="{'active': cityIndex === -1}" @click.self="selectCity('', -1)">
                常用&热门
              </div>
              <div class="city-item text-center relative" v-for="(item, index) in allAreaData" :key="index" @click.self="selectCity(item, index)"
                :class="{'active': cityIndex === index}">
                {{item.areaName}}
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
        </scroll>
        <scroll :listenScroll="listenScroll" :probeType="probeType" :pullup="true" :beforeScroll="true" :scrollX="true"
          :refreshScroll="true" :data="hotSelCityData" class="sel-area left">
          <div>
            <div class="us-citybox" v-show="cityIndex === -1">
              <p class="t-city">常用城市</p>
              <div class="area-box">
                <div class="area-item text-center relative" v-for="(item, index) in usSelCityData"
                  :key="index" @click.self="selectMainCity(item)">
                  {{item.areaName}}
                </div>
              </div>
              <p class="t-city">热门城市</p>
              <div class="area-box">
                <div class="area-item text-center" v-for="(item, index) in hotSelCityData" :key="index" @click.self="selectMainCity(item)">
                  {{item.areaName}}
                </div>
              </div>
            </div>

            <div class="area-box" v-show="cityIndex !== -1">
              <div class="area-item text-center" v-for="(item, index) in selCityData" :key="index" @click="selectMainCity(item)">
                {{item.areaName}}
              </div>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from "Vuex";
  import {
    isArray,
    isEmpty,
    debounce
  } from "lodash";
  import mixins from "@/mixins/mixin";
  import {
    getAllAreaByQuery
  } from "@/api/home";

  export default {
    mixins: [mixins],
    data() {
      return {
        cityIndex: -1,
        selCityData: [],
        usSelCityData: [],
        hotSelCityData: [],
        allAreaData: []
      };
    },
    created() {
      this.requestGetAllArea({
        pid: 0,
        levelId: 1
      }, res => {
        this.allAreaData = res.obj;
        let obj = {
          areaCode: "",
          areaName: "全国",
          areaNamePinyin: null,
          baseAreaVos: null,
          id: null,
          levelId: null,
          pid: null,
        }
        this.allAreaData.unshift(obj);
      });
      !isEmpty(this.allAreaData) && this.localAreaDataFilter();
    },
    methods: {
      requestGetAllArea(data, callback) {
        getAllAreaByQuery(data).then(res => {
          callback(res);
        });
      },
      selectCity: debounce(function (item, index) {
        this.cityIndex = index;
        if(item.areaName=="全国") {
        this.selCityData = [{
          areaCode: "",
          areaName: "全国",
          areaNamePinyin: null,
          baseAreaVos: null,
          id: null,
          levelId: null,
          pid: null,
        }];
        }else{
          this.requestGetAllArea({
          pid: item.areaCode,
          levelId: 2
        }, res => {
          this.selCityData = res.obj;
        });
        }
      }, 20),
      localAreaDataFilter() {
        //随便搞点常用城市
        this.usSelCityData = [{
            areaCode: "",
            areaName: "全国"
          },
          {
            areaCode: "442000",
            areaName: "中山"
          }
        ];
        //热门城市
        this.hotSelCityData = [{
            areaCode: "110100",
            areaName: "北京"
          },
          {
            areaCode: "310100",
            areaName: "上海"
          },
          {
            areaCode: "440100",
            areaName: "广州"
          },
          {
            areaCode: "330100",
            areaName: "杭州"
          },
          {
            areaCode: "500100",
            areaName: "重庆"
          },
          {
            areaCode: "610100",
            areaName: "西安"
          },
          {
            areaCode: "510100",
            areaName: "成都"
          }
        ];
      },
      selectMainCity: debounce(function (item) {
        this.$store.state.citySelector.item = item;
        this.$store.state.citySelector.robItem = item;
        this.$router.go(-1);
      }, 20)
    },
    watch: {
      allAreaData(val) {
        !isEmpty(val) && this.localAreaDataFilter();
      }
    }
  };

</script>
<style lang='scss' scoped>
  .city-selector {
    .tab {
      background-color: #fff;
      font-size: 32px;
      height: 85px;
      line-height: 85px;
      color: #333;
      position: fixed;
      z-index: 1;
      width: 100%;

      .tab-icon {
        display: inline-block;
        width: 44px;
        height: 44px;
        position: absolute;

        top: 50%;
        transform: translateY(-50%);
        background-size: 100%;
      }

      .tab-back {
        background-image: url("./images/nav_icon_back_black.png");
        left: 30px;
      }
    }

    .sel-wrapper {
      position: absolute;
      top: 85px;
      left: 0;
      width: 100%;
      background-color: #fff;
      overflow: auto;
      height: 100%;

      &.dropdown-enter-active,
      &.dropdown-leave-active {
        transition: all 0.3s linear;
      }

      &.dropdown-enter,
      &.dropdown-leave-active {
        transform: translate3d(0, -100%, 0);
      }

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
        .sel-city {
          width: 37%;
          background-color: #fff;
          position: absolute;
          left: 0;

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
          position: fixed;
          right: 0;
          background-color: #f5f5f5;
          top: 85px;

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
            display: flex;
            flex-wrap: wrap;
            margin: 31px 40px 11px;

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
        .sel-city {
          width: 37%;
          background-color: #fff;
          position: absolute;
          left: 0;

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

              input[type="checkbox"]:checked+label {
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
  }

</style>
