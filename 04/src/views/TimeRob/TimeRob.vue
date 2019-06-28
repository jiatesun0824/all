<template>
  <div class="timeRob">
    <header>
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">限时快抢</div>
    </header>
    <div class="tab">
      <div class="silder_tab" v-for="(item, index) in tab" :key='index' @click="selTab(index)">
        <span :style="item.active?'color:#ff6419':''">{{item.tit}}</span>
        <img class="silder_tab_picon" v-if="index!=2" :src="item.active?require('./images/arrow_active.png'):require('./images/arrow.png')"
          alt="">
        <img class="silder_tab_jicon" v-else src="./images/@2xselect.png" alt="">
      </div>
    </div>
    <scroll class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true" :beforeScroll="true"
      :scrollX="true" :refreshScroll="true" :data="datalist" @scrollToEnd="loadmore" ref="wrapperScroll">
      <div class="box">
        <div class="robitem" v-for="(item, index) in datalist" :key="index" @click="goRobDetail(item)">
          <!-- <img src="./images/icon-qiang-02@2x.png" class="robitem_statusimg" v-if="item.orderStatus!=0" alt="">
          <img src="./images/icon-qiang@2x.png" class="robitem_statusimg" v-else alt="" @click.stop="seckillpost(item)"> -->
          <img src="./images/yiqiangwan@2x.png" class="robitem_status_qwimg" v-if="item.orderStatus==1" alt="">
          <div class="dc_rob" v-if="item.orderStatus==0" @click.stop="seckillpost(item)">立即抢单</div>
          <div class="robitem_title">
            <span>{{item.budgetInfo}}</span>
            <span class="status_tit" v-if="item.orderStatus==1">客官，来迟了一步</span>
          </div>
          <div class="robitem_pos">
            <img class="robitem_posimg" src="./images/icon-dingwei.png" alt="">
            <span>{{item.positionInfo}}</span>
          </div>
          <div class="robitem_info">
            {{item.decorateStyleInfo}} · {{item.houseAcreageInfo}}
          </div>
          <div class="robitem_info">
            {{item.decorateHouseTypeInfo}} · {{item.decorateTypeInfo}}
          </div>
          <div class="robitem_pricename">
            <span class="robitem_price">度币：{{item.priceInfo}}</span>
            <div class="robitem_name">
              <img src="./images/icon-name@2x.png" alt="">
              <span>{{item.userName}}</span>
            </div>
          </div>
          <div class="paynow" v-if="item.orderStatus==2" @click.stop='showRobPay(item, index)'>
            <div class="pay_iconBox">
              <img src="./images/payment@2x.png" alt="">
            </div>
            <div class="pay_tit">立即支付</div>
            <div class="pay_time">剩余时间　{{item.remainingTime | timeFilterFen}}</div>
          </div>
        </div>
        <div class="" v-show="loadmoreNo" style="text-align:center;font-size:0.14rem;color:#666;">加载到底了....</div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </scroll>
    <div class="budget" :class="budGetShow?'budget_active':'budget_false'" @click.stop="colseBudget">
      <div class="budget_main">
        <div class="budget_item" v-for="(item, index) in budget" :key="index" @click="selBudGet(item, index)">
          <span :style="item.active?'color:#ff6419':''">{{item.name}}</span>
          <img class="bugget_activeimg" v-show="item.active" src="./images/sel_gou.png" alt="">
        </div>
      </div>
    </div>

    <div class="screen" :class="screenShow?'screen_active':'screen_false'">
      <div class="screen_main">
        <div class="screen_confirm">
          <span class="rebuild" @click="reSet">重置</span>
          <span class="sure" @click="closeScreen">确定</span>
        </div>
        <scroll class="wrapper">
          <div class="box">
            <div class="screen_item">
              <div class="screen_title">
                设计风格
              </div>
              <div class="screen_butBox">
                <div class="screen_but" v-for="(sitem, sindex) in styleList" :key="sindex" :class="sitem.active?'screen_butActive':''"
                  @click="selectType(sitem, sindex, 'style')">
                  {{sitem.name}}
                </div>
              </div>
            </div>
            <div class="screen_item">
              <div class="screen_title">
                装修方式
              </div>
              <div class="screen_butBox">
                <div class="screen_but" v-for="(sitem, sindex) in decorateTypeList" :key="sindex" :class="sitem.active?'screen_butActive':''"
                  @click="selectType(sitem, sindex, 'decorate')">
                  {{sitem.name}}
                </div>
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
          </div>
        </scroll>

      </div>
    </div>
    <robpay :robShow='robShow' :time='time' @payNow='payNow' @closePay='closePay'></robpay>
    <robpayfail :robPayFailShow='robPayFailShow' @closePayFail='robPayFailShow= false'></robpayfail>
    <div class="noCount" v-show="noCountShow">
      <div class="noCount_main">
        <img class="qiangdan" src="./images/icon-qiangdan@2x.png" alt="">
        <div class="qiangdan_tit">每日一次抢单机会，您今日已用完咯</div>
        <div class="noCount_but" @click="noCountShow = false">知道了，再看看</div>
      </div>
    </div>
  </div>
</template>
<script>
  let timeInter;
  import {
    mapGetters, mapActions
  } from 'Vuex'
  import mixins from '@/mixins/mixin';
  import {
    setInterval,
    clearInterval
  } from 'timers';
  export default {
    mixins: [mixins],
    data() {
      return {
        robPayFailShow: false,
        robShow: false, // 支付弹框
        time: '', // 支付弹框内倒计时
        tab: [{
            tit: '全国',
            active: false
          },
          {
            tit: '预算',
            active: false
          },
          {
            tit: '筛选',
            active: false
          }
        ],
        budget: [],
        datalist: [],
        styleList: [],
        decorateTypeList: [],
        baseProductStyleId: '', // 用户选中的风格
        decorateTypeValue: '', // 用户选中的装修方式
        decorateBudgetValue: -1, // 用户选中的预算范围,
        cityCode: '', // 市区编码，默认全国为空

        SeckillResidueCount: 0, // 今日抢单剩余次数

        curPayItem: {}, // 当前选择的支付的订单
        budGetShow: false, // 预算
        screenShow: false, // 筛选
        noCountShow: false, // 用户无抢单机会

        times: [],
        start: 0,
        loadmoreNo: false
      }
    },
    watch: {
      robItem(val) {
        this.start= 0;
        this.getData();
      },
      isCancle(val) {
        if(val) {
          this.start=0;
          this.getData()
          // 加载风格，预算，装修方式数据, 今日剩余抢单次数
          this.getReadyData();
           this.setIsCancle(false);
        }
      },
      isPaySuc(val) {
        if(val) {
          this.start=0;
          this.getData()
          // 加载风格，预算，装修方式数据, 今日剩余抢单次数
          this.getReadyData();
          this.setIsPaySuc(false);
        }
      }
    },
    computed: {
      ...mapGetters('citySelector', ['robItem']),
      ...mapGetters('rob', ['isCancle', 'isPaySuc'])
    },
    activated() {
      this.start=0;
      this.getData()
      // 加载风格，预算，装修方式数据, 今日剩余抢单次数
      this.getReadyData();
      this.tab.map((item) => {
        item.active = false;
      })
    },
     // 描点定位
    beforeRouteEnter(to, from, next) {
      to.meta.keepNotAlive = false;
      next();
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepNotAlive = !(to.name === 'timerobdetail');
      let keepAliveComponent = this.$parent.$vnode.parent;
      if (keepAliveComponent && from.meta.keepNotAlive) {
        delete keepAliveComponent.componentInstance.cache[keepAliveComponent.componentInstance.keys[0]];
        keepAliveComponent.componentInstance.keys = [];
      }
      next();
    },
    created() {
      this.getData()
      // 加载风格，预算，装修方式数据, 今日剩余抢单次数
      this.getReadyData();
    },
    methods: {
      ...mapActions("rob", ['setIsCancle', 'setIsPaySuc']),
      showRobPay(item, index) {
        this.robShow = true;
        this.curPayItem = item;
        this.time = item.remainingTime;
        clearInterval(timeInter);
        let date = new Date();
        let SystemTimeAfterCountdown = date.getTime() + this.time; // 倒计时之后的系统时间
        timeInter = setInterval(() => {
          if (this.time >= 1000) {
            let time = new Date();
            this.time = SystemTimeAfterCountdown - time.getTime();
          } else {
            clearInterval(timeInter);
            this.robShow = false;
            this.start= 0;
            this.getData();
          }
        }, 1000)
      },
      // 关闭支付弹框按钮；
      closePay() {
        this.robShow = false;
      },
      // 支付
      payNow() {
        this.API.timeRobPay(this.curPayItem.id).then(res => {
          if (res.obj.payStatus == 0) {
            this.setIsPaySuc(true)
            this.robShow = false;
            this.$router.push({
              path: '/mycumser_detail',
              query: {
                orderId: res.obj.orderId,
                paysucc: true
              }
            })
          } else if (res.obj.payStatus == 2) {
            this.robShow = false;
            this.robPayFailShow = true;
          } else {
            this.$toast(res.obj.message);
          }
        })
      },
      // 筛选
      selectType(sitem, sindex, type) {
        if (type == 'style') {
          this.styleList.map((item, index) => {
            item.active = false;
          })
          this.styleList.splice(sindex, 1, { ...this.styleList[sindex],
            active: true
          });
          this.baseProductStyleId = this.styleList[sindex].value;
        } else {
          this.decorateTypeList.map((item, index) => {
            item.active = false;
          })
          this.decorateTypeList.splice(sindex, 1, { ...this.decorateTypeList[sindex],
            active: true
          });
          this.decorateTypeValue = this.decorateTypeList[sindex].value;
        }
      },
      // 抢单
      seckillpost(item) {
        this.API.seckill(item.id).then(res => {
          if (res.obj.status == 1) {
            this.start = 0;
            this.getData();
            this.curPayItem = item;
            this.robShow = true;
            this.time = res.obj.remainingTime;
            let date = new Date();
            let SystemTimeAfterCountdown = date.getTime() + this.time; // 倒计时之后的系统时间
            clearInterval(timeInter);
            timeInter = setInterval(() => {
              if (this.time >= 1000) {
                let time = new Date();
                this.time = SystemTimeAfterCountdown - time.getTime();
              } else {
                clearInterval(timeInter);
                this.robShow = false;
                this.start= 0;
                this.getData();
              }
            }, 1000)
          } else if (res.obj.status == 3) {
            this.noCountShow = true;
          } else {
            this.$toast(res.obj.message);
          }
        })
      },
      // 去详情
      goRobDetail(item) {
        this.$router.push({
          path: '/timerobdetail',
          query: {
            item: item
          }
        })
      },
      // 列表加载
      async getData(type) {
        this.cityCode = this.robItem.areaCode;
        this.tab.splice(0, 1, { ...this.tab[0],
          tit: this.robItem.areaName
        });
        let Mark = {
          decorateTypeValue: this.decorateTypeValue,
          baseProductStyleId: this.baseProductStyleId,
          decorateBudgetValue: this.decorateBudgetValue,
          cityCode: this.cityCode,
          start: this.start,
          limit: 10
        }
        await this.API.getRobList(Mark).then(res => {
          if (res.success) {
              if (type=='loadmore') {
                if(res.obj) {
                  this.datalist = this.datalist.concat(res.obj);
                  this.timer();
                }else {
                  this.loadmoreNo = true;
                } 
              }else {
                if(res.obj) {
                  this.datalist = res.obj;
                  this.timer();
                }else {
                   this.datalist = [];
                   this.$toast('暂无该类型订单')
                }
              }
          }
        })
      },
      loadmore() {
        this.start += 10;
        this.getData('loadmore');
      },
      // 筛选重置
      reSet() {
        this.decorateTypeList.map((item, index) => {
          item.active = false;
          if (item.name == '全部') {
            item.active = true;
          }
        })
        this.styleList.map((item, index) => {
          item.active = false;
          if (item.name == '全部') {
            item.active = true;
          }
        })
        this.decorateTypeValue = '';
        this.baseProductStyleId = '';
      },
      // 筛选确定
      closeScreen() {
        this.start= 0;
        this.getData();
        this.screenShow = false;
        this.tab.splice(2, 1, { ...this.tab[2],
          active: false
        });
      },
      // 关闭预算下拉
      colseBudget() {
        this.budGetShow = false;
        this.tab.splice(1, 1, { ...this.tab[1],
          active: false
        });
      },
      // 预算范围选择
      selBudGet(sitem, sindex) {
        this.budGetShow = false;
        this.tab.splice(1, 1, { ...this.tab[1],
          active: false
        });
        this.budget.map((item, index) => {
          item.active = false;
          if (index == sindex) {
            item.active = true;
          }
        })
        this.decorateBudgetValue = sitem.value;
        this.start= 0;
        this.getData();
      },
      // 顶部导航切换
      selTab(sindex) {
        if (this.budGetShow) {
          this.tab.splice(1, 1, { ...this.tab[1],
            active: false
          });
          this.budGetShow = false;
          return;
        }
        this.tab.map((item, index) => {
          item.active = false;
          if (sindex == index) {
            item.active = true;
          }
        })
        switch (sindex) {
          case 0:
            this.$router.push('/citySelector');
            break;
          case 1:
            this.budGetShow = true;
            break;
          case 2:
            this.screenShow = true;
            break;
        }
      },
      timer() {
        this.datalist.map((res, index) => {
          if (res.remainingTime != 0) {
            clearInterval(this.times[index]);
            let date = new Date();
            res.SystemTimeAfterCountdown = date.getTime() + res.remainingTime; // 倒计时之后的系统时间
            this.times[index] = setInterval(() => {
              if (res.remainingTime >= 1000) {
                let time = new Date();
                res.remainingTime = res.SystemTimeAfterCountdown - time.getTime();
              } else {
                clearInterval(this.times[index]);
                this.start= 0;
                this.getData();
              }
            }, 1000)
          }
        })
      },
      // 基础数据加载
      getReadyData() {
        // 获取今天抢单剩余次数
        this.API.getSeckillResidueCount().then(res => {
          this.SeckillResidueCount = res.totalCount;
        })
        // 获取风格
        this.API.getSelectStyleList().then(res=> {
          this.styleList = res.obj;
          this.styleList.map(item => {
            item.active = false;
          })
          this.styleList.unshift({
            name: '全部',
            active: true
          });
        })
        // 获取装修方式
        this.API.getSelectList().then(res => {
          this.decorateTypeList = res.obj;
          this.decorateTypeList.map(item => {
            item.active = false;
          })
          this.decorateTypeList.unshift({
            name: '全部',
            active: true
          });
        })
        // 获取预算范围
        this.API.getBudGetList().then(res => {
          this.budget = res.obj;
          this.budget.map(item => {
            item.active = false;
          })
          this.budget.splice(0, 1, { ...this.budget[0],
            active: true
          });
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import '../../styles/header.scss';
  @import './styles/timeRob.scss';

</style>
