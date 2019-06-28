<template>
  <div class="collect">
    <header>
      <i class="icon-left" @click="$router.push('/user')"></i>
      <div class="title">{{$route.meta.title}}</div>
    </header>
    <div class="nav">
      <div class="item" @click="selRoom">{{spaceValue}}<img class="sel-icon" :src="roomShow?selIconSrc:nolIconSrc"></div>
      <div class="item" @click="selStyle">{{styleValue}} <img class="sel-icon" :src="styleShow?selIconSrc:nolIconSrc"></div>
    </div>
    <div v-if="selBox" class="selBox" @click="closeSelBox()">
      <div class="selContent">
        <div class="selItem" @click.stop="selType(item)" v-for="item in allType" :key="item.tit">
          {{item.name}}
        </div>
      </div>
    </div>
    <scroll v-if="!noMessShow" class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true"
      :beforeScroll="true" :scrollX="true" :refreshScroll="true" :data="datalist" @scrollToEnd="loadmore" ref="wrapperScroll">
      <div class="box">
        <!-- <div class="slider" v-for="(item, index) in datalist" :key="index">
                    <img class="itemBg" :src="userInfo.resourcesUrl+item.coverPath">
                    <div class="havecopy" v-if="(item.copyRightPermission==1&&item.havePurchased==0) || (item.copyRightPermission==0&&item.havePurchased==1)">
                        <span style="float: left" >{{item.planName}}</span>
                        <span style="float: right">{{item.releaseTime}}</span>
                    </div>
                    <div class="nocopy" v-else>
                        <div class="itemname">{{item.planName}}</div>
                        <div class="itemdate">{{item.releaseTime}}</div>
                    </div>
                    <img @click.stop="collectItem(item, index)" class="collectBut" :src="item.collect?require('../images/collect_pre.png'):require('../images/collect_nor.png')">
                    <div class="itemType">
                        <img @click.stop="$router.push({name: 'photoview', params: {page: 'plan', id: item.planRecommendedId}})" src="../images/ic_msg.png">
                        <img @click.stop="sel720(index)"  src="../images/ic_720.png">
                    </div>
                    <div class="copyRightPrice"  v-if="item.copyRightPermission==1&&item.havePurchased==0">
                        <span>￥{{item.planPrice}}</span>  <span class="copyRightPrice_tit">版权费</span> 
                    </div>
                    <div class="copyRightPrice" v-if="item.copyRightPermission==0&&item.havePurchased==1" style="color:#999">
                        <span style="text-decoration:line-through;">￥{{item.planPrice}}</span>  <span class="copyRightPrice_tit" style="color:#999;background:#fafafa;">已购买</span>
                    </div>
                </div> -->
        <plan-item showLabel v-for="(item, index) in datalist" @showDecoratePriceBox="showDecoratePriceBox" :key="index"
          :index="index" :itemData="item" :showEnterDecorate="item.recommendedType !==1? true: false" :ref="`recomItem${index}`"
          @click.native="goCaseDetails(item)"></plan-item>

        <br />
        <br />
        <br />
        <br />
        <div class="noMore" v-if="noMore">没有更多数据</div>
        <br />
        <br />
        <br />
      </div>
    </scroll>
    <div class="noMess" v-if="noMessShow">
      <div class="iconbox">
        <img class="icon" src="../images/list_icon_empty.png">
      </div>
      <div class="tit">
        您暂时没有相关收藏哦！
      </div>
      <div class="tit">
        返回首页看看有没有您需要的服务！
      </div>
      <div class="but" @click="$router.push('/recom')">
        <span>逛逛方案</span>
      </div>
    </div>
  </div>
</template>
<script>
  import mixins from '@/mixins/mixin'
  import {
    mapGetters,
    mapState,
    mapActions,
    mapMutations
  } from 'Vuex'
  import planItem from 'components/PlanItem';
  import {
    getCollectList,
    getDesignStyleList,
    getFavoritesList,
    getSpace,
    delDesingPlanCollect
  } from "@/api/user"
  import {
    debounce
  } from 'lodash';
  import {
    pick,
    values,
    get,
    isEqual,
    isArray
  } from 'lodash';
  export default {
    mixins: [mixins],
    components: {
      planItem
    },
    data() {
      return {
        nolIconSrc: require('../images/home_icon_down_nor.png'),
        selIconSrc: require('../images/home_icon_down_sel2.png'),
        roomType: [],
        styleType: [],
        allType: [],
        num: 3,
        selBox: false, // 控制选择界面展示状态
        roomShow: false, //控制房型数据的展示
        styleShow: false, //控制风格数据的展示

        spaceValue: '客餐厅',
        styleValue: '风格',

        Mark: {
          pageVo:{
             start: 0,
             pageSize: 10
          },
          recommendationPlanSearchVo:{
            spaceArea: "",
            designStyleId: '',
            //favoriteBid: '',
            houseType: '3',
            //livingName: '',
          //  msgId: '580',
          //  token: JSON.parse(localStorage.ge tItem('token'))
          }
        },
        houseType: '3',
        datalist: [],
        data: [],
        noMessShow: false,

        noMore: false
      }
    },
    computed: {
      ...mapGetters('common', ['userInfo']),
      ...mapGetters('recom', [
        'navgateList',
      ]),
    },
    // 描点定位
    beforeRouteEnter(to, from, next) {
      to.meta.keepNotAlive = false;
      next();
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepNotAlive = !(to.name === 'view720' || to.name === 'photoview');
      let keepAliveComponent = this.$parent.$vnode.parent;
      if (keepAliveComponent && from.meta.keepNotAlive) {
        delete keepAliveComponent.componentInstance.cache[keepAliveComponent.componentInstance.keys[0]];
        keepAliveComponent.componentInstance.keys = [];
      }
      next();
    },
    methods: {
      ...mapActions('caseDetail', ['setCaseDetail', 'setDisplayType']),
      get,
      isEqual,
      goCaseDetails(item) {
        this.$router.push({
          path: '/caseDetails'
        })
        this.setCaseDetail(item);
        if (item.public) {
          this.setDisplayType(0)
        } else {
          this.setDisplayType(1)
        }
      },
      showDecoratePriceBox(item) {
        this.decoratePriceList = item
        this.decoratePriceBox = true
      },
      sel720: debounce(function (index) {
        if (this.$route.path == '/view720') return;
        this.$store.state.goBackPath = this.$route.path;
        sessionStorage.setItem('operationSource', 1);
        sessionStorage.setItem('routerQueryType', 'seven');
        sessionStorage.setItem('msgId', 'recommended');
        // this.$store.commit('audioAutoPlay');
        this.$store.state.isCollectIndex = index;
        this.$store.state.view720.view720Id = this.data[index].planRecommendedId;
        sessionStorage.setItem('view720Id', this.data[index].planRecommendedId);
        sessionStorage.setItem('planId', this.data[index].planId);
        sessionStorage.setItem('groupPlanId', this.data[index].planRecommendedId);
        sessionStorage.setItem('groupType', 0); // 设置组合替换类型
        sessionStorage.setItem('bid', this.data[index].bid);
        this.$store.state.detailsSeeType = '';
        this.API.recomGetPictureList({
          planRecommendedId: this.data[index].planRecommendedId,
          remark: '720'
        }).then((response) => {
          if (response) {
            if (response.totalCount === 0) {
              this.$store.commit('popupMsg', '当前设计图没有720°全景');
              this.$store.commit('showPopup');
              return;
            }
            sessionStorage.setItem('planRecommendedId', this.data[index].planRecommendedId);
            this.$store.state.renderSign = false;
            this.$store.commit('showComComponents', false);
            this.$store.state.view720.view720Small = response.datalist;
            this.$store.state.smallTitle = this.data[index].planName;
            this.$store.state.fromPath = 'recom';
            this.$store.state.view720LoadingFlag = true;
            this.$store.state.recomSelIndex = index;
            this.$store.state.fasttype = 'recommended';
            this.$router.push('/view720');
          }
        });
      }, 20),
      collectItem(item) {
        var data = {
          fid: item.bid,
          msgId: JSON.parse(localStorage.getItem('userInfo')).id,
          token: localStorage.getItem('token')
        }
        delDesingPlanCollect(data).then(res => {
          if (res.success) {
            getCollectList(this.Mark).then((res) => {
              if (res.datalist.length === 0) {
                this.noMessShow = true
              } else {
                this.noMessShow = false;
                this.datalist = res.datalist;
                this.data = res.datalist;
                this.datalist.map(item => {
                  item.collect = true;
                })
              }
            })
          }
        })

      },
      // 顶部tab栏切换与选择
      // 切换房型选择
      selRoom() {
        this.allType = this.roomType
        if (this.styleShow || this.areaShow) {
          this.showClose();
          this.roomShow = true;
          this.selBox = true;
        } else if (this.selBox) {
          this.allClose();
        } else {
          this.roomShow = true;
          this.styleShow = false;
          this.areaShow = false;
          this.selBox = true;
        }
      },
      // 加载更多
      loadmore() {
        this.Mark.pageVo.start += 10;
        getCollectList(this.Mark).then((res) => {
          if (res.datalist.length > 0) {
            this.datalist = this.datalist.concat(res.datalist);
            this.data = this.data.concat(res.datalist);
            this.noMore = false;
            this.datalist.map(item => {
              item.collect = true;
            })
          } else {
            // this.$toast('没有更多数据')
            this.noMore = true;
          }
        })
      },
      // 切换风格选择
      selStyle() {
        this.allType = this.styleType;
        if (this.roomShow || this.areaShow) {
          this.showClose();

          this.styleShow = true;
          this.selBox = true;
        } else if (this.selBox) {
          this.allClose();
        } else {
          this.roomShow = false;
          this.styleShow = true;
          this.areaShow = false;
          this.selBox = true;
        }
      },
      // 关闭tab栏
      closeSelBox() {
        this.selBox = false;
      },
      // 选择类型
      selType(item) {
        this.selBox = false;
        if (item.type === "houseType") {
          this.spaceValue = item.name;
          this.houseType = item.value.toString();
          this.Mark.recommendationPlanSearchVo.houseType = item.value.toString();
          console.log( this.houseType)
        } else {
          this.styleValue = item.name;
          this.Mark.recommendationPlanSearchVo.houseType =  this.houseType;
          this.Mark.recommendationPlanSearchVo.designStyleId = item.id.toString();
            console.log(this.houseType)
        }
        getCollectList(this.Mark).then((res) => {
          if(res.datalist==null){
            this.datalist = [];
            this.noMessShow = true
            this.roomShow = false;
            this.styleShow = false;
          }
          // else if (res.datalist.length === 0) {
          //   this.noMessShow = true
          //   this.roomShow = false;
          //   this.styleShow = false;
          // } 
          else {
            this.noMessShow = false;
            this.roomShow = false;
            this.styleShow = false;
            this.datalist = res.datalist;
            this.data = res.datalist;
            this.datalist.map(item => {
              item.collect = true;
            })
          }
        })
      },
      // 归零所有选择状态
      showClose() {
        this.roomShow = false;
        this.styleShow = false;
        this.areaShow = false;
      },
      // 归零所有状态
      allClose() {
        this.showClose();
        this.selBox = false;
      }
    },
    created() {
      // 定义默认可选择类型为房型
      getSpace().then((res) => {
        this.roomType = res.datalist;
        this.allType = this.roomType;
      })
      var data = {
        houseName: this.spaceValue
      }
      getDesignStyleList(data).then((res) => {
        this.styleType = res.datalist;
        this.Mark.recommendationPlanSearchVo.houseType = '3';
        getCollectList(this.Mark).then((res) => {
          if (res.datalist==null) {
             this.data=[];
            this.noMessShow = true
          } else {
            this.noMessShow = false;
            this.datalist = res.datalist;
            this.data = res.datalist;
            this.datalist.map(item => {
              item.collect = true;
            })
          }
        })
      })
    }

  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';

</style>
<style lang="scss" scoped>
  .collect {
    box-sizing: border-box;
    background: #f5f5f5;
    height: 100%;
    padding-top: 176px;
    overflow: auto;

    .nav {
      position: fixed;
      top: 88px;
      left: 0;
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: 88px;
      align-items: center;
      background: #fff;
      border-top: solid 1px #f8f8f8;
      z-index: 2;

      .item {
        color: #333;
        font-size: 32px;

        .sel-icon {
          width: 10px;
          height: 10px;
          vertical-align: middle;
          margin-left: 10px;
        }
      }
    }

    .selBox {
      background: rgba(0, 0, 0, 0.3);
      position: fixed;
      top: 176px;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;

      .selContent {
        background: #fff;
        padding: 20px;
        display: flex;
        flex-wrap: wrap;

        .selItem {
          width: 216px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          background: #f5f5f5;
          margin: 10px;
          color: #333;
          font-size: 24px;
        }
      }
    }

    .wrapper {
      .box {
        padding: 0 30px;
        margin-top: 20px;
        background: #fff;

        .noMore {
          text-align: center;
          font-size: 24px;
          color: #999;
        }

        .slider {
          position: relative;
          width: 100%;
          height: 500px;
          background: #fff;
          border-radius: 10px;
          padding-top: 20px;

          .copyRightPrice {
            font-size: 40px;
            color: #ff6419;
            padding: 24px 0;
            margin-top: 37.5px;

            .copyRightPrice_tit {
              display: inline-block;
              width: 80px;
              height: 32px;
              font-size: 22px;
              color: #ff6419;
              background: #ffeee5;
              line-height: 32px;
              vertical-align: middle;
              text-align: center;
            }
          }

          .itemBg {
            width: 100%;
            height: 400px;
            border-radius: 10px;
          }

          .itemname {
            height: 55px;
            line-height: 55px;
            font-size: 32px;
            color: #333;
          }

          .itemdate {
            height: 50px;
            line-height: 50px;
            font-size: 24px;
            color: #999;
          }

          .collectBut {
            position: absolute;
            top: 30px;
            right: 30px;
            z-index: 1;
            width: 42px;
            height: 40px;
          }

          .havecopy {
            span {
              height: 55px;
              line-height: 55px;
              font-size: 32px;
              color: #333;
            }

            span:nth-last-of-type(1) {
              height: 50px;
              line-height: 50px;
              font-size: 24px;
              color: #999;
            }
          }

          .itemType {
            position: absolute;
            bottom: 130px;
            right: 0;
            width: 100%;
            height: 100px;
            z-index: 1;
            text-align: center;

            img {
              width: 60px;
              height: 60px;
              margin: 0 20px;
            }
          }
        }
      }
    }

    .tit {
      margin-top: 40px;
      font-size: 24px;
      height: 50px;
      line-height: 50px;
      color: #999;
      text-align: center;
    }

    .noMess {
      .iconbox {
        margin-top: 207px;
        text-align: center;
        margin-bottom: 49px;

        .icon {
          width: 171px;
          height: 151px;
        }
      }

      .tit {
        text-align: center;
        font-size: 24px;
        color: #999;
        line-height: 48px;
      }

      .but {
        margin-top: 219px;
        text-align: center;

        span {
          display: inline-block;
          width: 220px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          color: #ff6419;
          font-size: 32px;
          border: solid 2px #ff6419;
          border-radius: 40px;
        }
      }
    }
  }

</style>
