<template>
  <div class="issue">
    <header class="issue-header">
      <i class="icon-left" @click="$router.push('/user')"></i>
      <div class="title">{{$route.meta.title}}</div>
      <div class="right" @click="goRelease()">
        <img src="./images/release_icon_add_2.png">
      </div>
    </header>
    <div class="tab">
      <div class="tabitem br" :style="navActive?'color:#ff6419':'color:#333'" @click="haveSend">已发布</div>
      <div class="tabitem " :style="navActive?'color:#333':'color:#ff6419'" @click="haveDown">已下架</div>
    </div>
    <scroll v-if="listShow" class="wrapper"
      :listenScroll = "listenScroll"
      :probeType = "probeType"
      :pullup = "true"
      :beforeScroll = "true"
      :scrollX = "true" 
      :refreshScroll = "true"  
      :data = "slider"
      @scrollToEnd="loadmore"
      ref = "wrapperScroll">
      <div class="box">
        <div class="item" v-for="(item,index) in slider" :key="index" v-cloak>
          <div class="content">
            <img class="item_img" :src="filterImg(item.supplyDemandCoverPic.picPath)" alt="">
            <!-- <img class="item_img" v-lazy="item.supplyDemandCoverPic && filterImg(item.supplyDemandCoverPic.picPath)"> -->
            <!-- <img v-if="!item.supplyDemandCoverPic" class="item_img" src="../images/banner_01.png"> -->
            <div class="detail">
              <div class="title">{{item.title}}</div>
              <div class="tit" v-text="[item.cityAddress, item.districtAddress, item.streetAddress].filter(item => item).join('-')"></div>
              <div class="info">
                <div class="info_item"><img class="icon" src="./images/list_icon_see.png"><span class="icontit">{{item.viewNum}}</span></div>
                <!-- <div class="info_item"><img class="icon" src="./images/list_icon_contact.png"><span class="icontit">1000</span></div> -->
                <div class="info_item"><img class="icon" src="./images/list_icon_time.png"><span class="icontit">{{item.gmtModifiedtit}}</span></div>
              </div>
            </div>
          </div>
          <div class="but">
            <div class="butitem" @click="edit(item)">编辑</div>
            <div class="butitem" @click="item.pushStatus === 0?down(item):issue(item)">{{item.pushStatus === 0?'下架':'上架'}}</div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="noList" v-show="emptyShow">
      <div class="imgbox">
        <img src="../images/list_icon_empty.png">
      </div>
      <div class="tit">
        您暂时没有发布信息哦！ <br />
        返回首页看看有没有您需要的服务！
      </div>
      <div class="but" @click="goShop">
        <span class="butSp">返回首页</span>
      </div>
    </div>
    <!-- <div class="noList" v-show="nolistShow">
      <div class="imgbox">
        <img src="/static/images/list_icon_empty.png" alt="">
      </div>
      <div class="tit">
        暂无相关信息
      </div>
    </div> -->
  </div>
</template>
<script>
import mixins from "@/mixins/mixin";
import { updatemysupplydemandstatus, getallsupplydemandinfo } from "@/api/user";
import { mapGetters, mapActions } from 'Vuex';
import { debounce } from 'lodash';
export default {
  mixins: [mixins],
  // 发布
  data() {
    return {
      listShow: true,
      nolistShow: false,
      emptyShow: false,
      slider: [],
      Mark: {
        mark: "MySupplydemandinfo",
        curPage: 1,
        pageSize: 10,
        pushStatus: 0 // 0上架中，1已下架
      },
      navActive: true //控制顶部导航文字颜色
    };
  },
  computed: {
    ...mapGetters('common', ['userInfo'])
  },
  created() {
    this.loadData(this.Mark);
  },
  // activated() {
  //   this.Mark.curPage=1;
  //   this.loadData(this.Mark);
  // },
  methods: {
    ...mapActions('release', ['clearReleaseData', 'setFrom']),
    goRelease() {
      this.setFrom('mine')
      this.$router.push('/chooseRelease');
    },
    // 编辑
    edit(item) {
      this.clearReleaseData();
      sessionStorage.setItem('editRelease', JSON.stringify(item));
      this.$router.push({name: 'homeService', params: {type: item.supplyDemandCategoryId}, query: {typeName: '编辑发布信息', releaseId: item.supplyDemandId}});
    },
    // 列表发布
    issue: debounce(function(item) {
      this.$confirm({
        title: "提示",
        msg: "确认恢复此条信息吗？"
      }).success(instance => {
        instance.close();
        var h = {
          supplyDemandId: item.supplyDemandId,
          pushStatus: 0
        };
        updatemysupplydemandstatus(h).then(res => {
          if (res.status) {
            this.Mark.pushStatus = 1;
            this.loadData(this.Mark);
            this.$toast("发布成功");
          }
        });
      });
    }, 20),
    // 列表下架
    down: debounce(function(item) {
      this.$confirm({
        title: "提示",
        msg: "确认下架此条信息吗？"
      }).success(instance => {
        instance.close();
        var h = {
          supplyDemandId: item.supplyDemandId,
          pushStatus: 1
        };
        updatemysupplydemandstatus(h).then(res => {
          if (res.status) {
            this.Mark.curPage=1;
            this.loadData(this.Mark);
          }
        });
      });
    }, 20),
    haveSend() {
      this.Mark.curPage = 1;
      this.Mark.pushStatus = 0;
      this.navActive = true;
      this.loadData(this.Mark);
    },
    haveDown() {
      this.Mark.curPage = 1;
      this.Mark.pushStatus = 1;
      this.navActive = false;
      this.loadData(this.Mark);
    },
    loadData(Mark) {
      this.slider =[];
      getallsupplydemandinfo(Mark).then(res => {
        if (res.status) {
          this.slider = res.obj;
          this.listShow = true;
          this.emptyShow = false;
          this.slider.map(item=> {
            this.dateDiff(item)
          })
        } else {
          this.slider = [];
          this.listShow = false;
          this.emptyShow = true;
        }
      });
    },
    // 加载更多
    loadmore() {
      this.Mark.curPage++;
      getallsupplydemandinfo(this.Mark).then(res => {
        if (res.obj.length>0) {
          this.slider = this.slider.concat(res.obj);
          this.listShow = true;
          this.emptyShow = false;
          this.slider.map(item=> {
            this.dateDiff(item)
          })
        } else {
         this.$toast('没有更多数据');
        }
      });
    },
    // 计算时间差
    dateDiff(item) {
           item.gmtModified = this.timeFn(item.gmtModified)
           if(item.gmtModified[0]>=365){
             item.gmtModifiedtit = '一年前'
           }else if(item.gmtModified[0]>=30) {
             item.gmtModifiedtit = '一月前'
           }else if(item.gmtModified[0]>=7) {
             item.gmtModifiedtit = '一周前'
           }else {
             if(item.gmtModified[0]>=1) {
               item.gmtModifiedtit = item.gmtModified[0]+'天前'
             }else if(item.gmtModified[1]>=1) {
               item.gmtModifiedtit = item.gmtModified[1]+'小时前'
             }else if(item.gmtModified[2]>=1) {
               item.gmtModifiedtit = item.gmtModified[2]+'分钟前'
             }else if(item.gmtModified[3]>=1) {
               item.gmtModifiedtit = item.gmtModified[3]+'秒前'
             }
          }
    },
    filterImg(img) {
      return this.userInfo.resourcesUrl + img;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/header.scss";
</style>

<style lang="scss" scoped>
.issue {
  background: #f5f5f5;
  height: 100%;
  position: relative;
  overflow: auto;

  .issue-header {
    .title {
      font-family: PingFang-SC-Medium;
    }
    .right {
      display: flex;
      align-items: center;
      height: 100%;

      img {
        width: 44px;
      }
    }
  }

  .tab {
    position: fixed;
    top: 88px;
    left: 0;
    width: 100%;
    height: 80px;
    line-height: 80px;
    background: #fff;
    border-top: solid 1px #e8e8e8;
    box-sizing: border-box;
    z-index: 2;
    .tabitem {
      font-size: 28px;
      font-family: PingFang-SC-Medium;
      color: #333;
      text-align: center;
      float: left;
      width: 50%;
      box-sizing: border-box;
    }
    .br {
      border-right: solid 1px #e8e8e8;
    }
    .active {
      color: #ff662e;
    }
  }
  .wrapper {
    .box {
      padding-top: 168px;
      .item {
        padding: 30px;
        padding-bottom: 0;
        box-sizing: border-box;
        background: #fff;
        margin: 20px 0;
        .content {
          background: #fafafa;
          padding: 20px;
          font-size: 0px;
          display: flex;
          justify-content: flex-start;
          .item_img {
            flex-basis: 200px;
            width: 200px;
            height: 150px;
          }
          .detail {
            flex: 1;
            display: inline-block;
            margin-left: 20px;
            height: 150px;
            overflow: hidden;
            .title {
              font-size: 28px;
              font-family: PingFang-SC-Medium;
              color: #333;
              height: 50px;
              line-height: 50px;
              margin-bottom: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .tit {
              font-size: 24px;
              color: #999;
              margin-bottom: 22px;
              height: 30px;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
            }
            .info {
              height: 50px;
              line-height: 50px;
              .info_item {
                display: inline-block;
                font-size: 0px;
                margin-right: 35px;
              }
              .icon {
                width: 20px;
                height: 20px;
                vertical-align: middle;
                object-fit: contain;
                margin-top: -1.5px;
              }
              .icontit {
                font-size: 20px;
                font-family: PingFang-SC-Medium;
                color: #999;
                vertical-align: middle;
                margin-left: 5px;
              }
            }
          }
        }
        .but {
          height: 80px;
          line-height: 80px;
          .butitem {
            position: relative;
            width: 50%;
            box-sizing: border-box;
            font-size: 28px;
            font-family: PingFang-SC-Medium;
            color: #333;
            float: left;
            text-align: center;

            &:nth-of-type(1) {
              &:after {
                content: '';
                position: absolute;
                top: 50%;
                right: 0;
                width: 2px; /*no*/
                height: 24px;
                transform: translateY(-50%) scaleX(0.5);
                background-color: #e4e4e4;
              }
            }
          }
        }
      }
    }
  }
  .noList {
    padding-top: 335px;
    .imgbox {
      text-align: center;
      img {
        width: 171px;
        height: 151px;
      }
    }
    .tit {
      margin-top: 49px;
      margin-bottom: 219px;
      text-align: center;
      font-size: 24px;
      line-height: 48px;
      color: #999;
    }
    .but {
      text-align: center;
      .butSp {
        width: 220px;
        height: 80px;
        background-color: #f5f5f5;
        border-radius: 40px;
        border: solid 2px #ff6419;
        font-size: 32px;
        color: #ff6419;
        display: inline-block;
        line-height: 80px;
      }
    }
  }
}
</style>
