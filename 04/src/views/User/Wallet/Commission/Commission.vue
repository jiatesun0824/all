<template>
  <div class="commission">
     <header>
			<i class="icon-left" @click="$router.go(-1)"></i>
			<div class="title">我的佣金</div>
	  </header>
      <div class="head">
          <div class="rental">
            <!-- <img class="rental_icon" src="../images/wallet_bg_commission.png" alt=""> -->
            <span class="rental_tit">累计佣金</span>
          </div>
          <div class="rentalnum">￥{{commisionTotal}}</div>
          <!-- <div class="income">
              <div class="income_item">
                <div class="income_tit">今日收入</div>
                <div class="income_num">100.00</div>
              </div>
              <div class="income_item ml">
                <div class="income_tit">昨日收入</div>
                <div class="income_num">200.00</div>
              </div>
          </div> -->
      </div>
      <div class="top">
        <div class="ctitle">佣金明细</div>
        <div class="date">
              <!-- <div class="mon">4月</div>
              <div class="year">2018年</div> -->
              <span class="date-tit" @click="isShowData">{{selyear}}年{{selmonth}}月</span> <img class="top_icon" src="../images/wallet_icon_down.png" alt="">
              <div class="money">￥{{commisionMonthTotal}}</div>
        </div>
      </div>
          <!-- <div class="money">￥5000.00</div> -->
      <div class="main">
          <!-- <div class="icon_box">
            <img class="top_icon" src="../../images/banner_01.png" alt="">
          </div> -->
        <!-- <div class="top_tit">
          明细周期　2018年4月1日-2018年4-30日
        </div> -->
         <!--选择日期-->
          <div class="select-date" :class="showDate?'select-date-active':''">
            <awesome-picker
              style="z-index: 1000002"
              ref="picker0"
              :colorConfirm="picker0.colorConfirm"
              :colorCancel="picker0.colorCancel"
              :data="picker0.data"
              :anchor="picker0.anchor"
              @cancel="handlePickerCancel"
              @confirm="handlePicker0Confirm">
            </awesome-picker>
          </div>
      <!--<div class="shade"  v-show="showDate"></div>-->
      <!--选择日期-->
        <scroll class="wrapper"
            :probeType="probeType" 
            :listenScroll="listenScroll" 
            :pullup = "true"
            :pulldown = "true"
            :beforeScroll = "true"
            :scrollX = "true" 
            :data = "datalist"
            :refreshScroll = "true"
            @pulldown="pulldown"
            @scrollToEnd="loadmore"
            ref="wrapperScroll" :style="datalist.length==0?'background-color: #fafafa':''">
            <div class="itembox">
              <div class="item" v-for="(item, index) in datalist" :key="index">
                <div class="item_tit">
                  <span class="dot">●</span>
                  <span class="date_tit">{{item.commisionIntime}}</span>
                  <span class="moneynum">+￥{{item.commision}}</span>
                </div>
                <div class="name">{{item.uitCompanyName}}完成与{{item.userName}}的装修</div>
              </div>
              <div class="emptyBox" v-if="datalist.length==0" >
                <div class="emptyImg_box">
                  <img class="empty_img" src="../images/wallet_icon_empty.png" alt="">
                </div>
                <div class="empty_tit">
                  暂无该月佣金记录哦！
                </div>
              </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            </div>
        </scroll>
      </div>
  </div>
</template>
<script>
import mixins from "@/mixins/mixin";
export default {
  mixins: [mixins],
  // 佣金
  data() {
    return{
      datalist:[],
      // 选择日期
      showDate: false,
        year: 0,
        month: 0,
        yearMonth: '',
        picker0: {
          colorConfirm: '#ff6419',
          colorCancel: '#333333',
          anchor: [],
          data: [[], []]
        },
        dateIndex: 0,

        curPage: 1,
        pageSize: 10,

        selyear: '',
        selmonth:'',

       // 选择日期
       commisionTotal: 0, // 累计佣金
       commisionMonthTotal: 0,  // 当月佣金总和
    }
  },
  created() {
     // 选择日期
      let date = new Date();
      this.selyear = date.getFullYear();
      this.selmonth = date.getMonth()+1;

      let Year = [];
      let Month = [];
      for (let i = 2018; i <= date.getFullYear(); i++) {
        this.picker0.data[0].push(i + '年');
        Year.push(i);
      };
      for (let i = 1; i <= 12; i++) {
        this.picker0.data[1].push(i + '月');
        Month.push(i);
      };
      this.picker0.anchor = [this.picker0.data[0].length - 1, date.getMonth()];
      this.year = Year[this.picker0.data[0].length - 1];
      this.month = Month[date.getMonth()] - 1;
      this.yearMonth = this.year + '年' + this.month + '月';
       // 选择日期

       this.getmycommissioninfo();

  },
  methods: {
     // 选择日期
    handlePicker0Confirm (v) {
        this.yearMonth = v[0].value + v[1].value;
        this.showDate = false;
        this.picker0.anchor = v;
        this.selyaer  = v[0].value.substr(0,4);
        this.selmonth = v[1].index+1;
        this.curPage = 0;
        this.getmycommissioninfo();
      },
      handlePickerCancel() {
        this.showDate = false;
      },
      isShowData() {
        this.$refs.picker0.show();
        this.showDate = true;
      },
     // 选择日期
    pulldown() {

    },
    getmycommissioninfo(from) {
      this.API.mycommissioninfo({
        curPage: this.curPage,
        pageSize: this.pageSize,
        year: this.selyear,
        month: this.selmonth
      }).then(res=> {
        if(res.message == 'success') {
          this.datalist = this.datalist.concat(res.obj.monthCommissionVoList);
          this.commisionTotal = res.obj.commisionTotal;
          this.commisionMonthTotal = res.obj.commisionMonthTotal;
        }else if(from == 'loadmore') {
          this.$toast('没有更多数据')
        }else{
          this.datalist = [];
          this.commisionMonthTotal = 0;
        }
      })
    },
    loadmore() {
      this.curPage++;
      this.getmycommissioninfo('loadmore');
    },
  }
}
</script>
<style lang="scss" scoped>
    @import '../../../../styles/header.scss';
    @import './styles/commission.scss';
</style>


