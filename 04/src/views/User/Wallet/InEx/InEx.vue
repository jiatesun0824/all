<template>
  <div class="inex">
      <header>
			<i class="icon-left" @click="$router.go(-1)"></i>
			<div class="title">收支明细</div>
	  </header>
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
      <div class="allmon">
          <div class="date">
            <!-- <div class="mon">4月</div>
            <div class="year">2018年</div> -->
            <span class="date-tit" @click="isShowData">{{selyear}}年{{selmonth}}月</span> <img class="top_icon" src="../images/wallet_icon_down.png" alt="">
            <br />
            <!-- <div class="inandout">
              <span class="inandout_tit">收入</span><span class="inandout_num">￥{{commissionTotal}}</span>
              <span class="inandout_tit">返现</span><span class="inandout_num">￥{{expensesCommissionTotal}}</span>
            </div> -->
          </div>
      </div>
     <div class="card" v-if="totalCount!=0">
            <div class="cardmain">
                <div class="item">
                    <div class="title">收入</div>
                    <div class="tit">￥{{commissionTotal}}</div>
                </div>
                <div class="item">
                    <div class="title">返现</div>
                    <div class="tit">￥{{expensesCommissionTotal}}</div>
                </div>
                <span class="fenge"></span>
            </div>
      </div>
      <div class="tab" v-if="totalCount!=0">
        <div class="tabitem" v-for="(item, index) in tab" :key="index" :class="item.sel?'active':''" @click="selTab(item, index)">
          {{item.name}}
          <span v-if="item.sel" class="sp"></span>
        </div>
      </div>
      <div class="main" v-if="totalCount!=0">
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
            ref="wrapperScroll">
            <div class="itembox" :style="datalist.length==0?'background-color:#fafafa':''">
              <div class="item" v-for="(item, index) in datalist" :key="index" v-if="curTabIndex == 0" v-cloak>
                <div class="item_tit">
                  <span class="dot">●</span>
                  <span class="date_tit">{{item.commisionIntime}}</span>
                  <span class="moneynum">{{item.statusName}}</span>
                </div>
                <div class="name">佣金收入 <span style="color:#ff6419"></span> {{item.commision}}</div>
              </div>
              <div class="item" v-for="(item, index) in datalist" :key="index" v-if="curTabIndex == 1 && item.status == 0" v-cloak>
                <div class="item_tit">
                  <span class="dot">●</span>
                  <span class="date_tit">{{item.commisionIntime}}</span>
                  <span class="moneynum">{{item.statusName}}</span>
                </div>
                <div class="name">佣金收入 <span style="color:#ff6419"></span> {{item.commision}}</div>
              </div>
              <div class="item" v-for="(item, index) in datalist" :key="index" v-if="curTabIndex == 2 && item.status == 1" v-cloak>
                <div class="item_tit">
                  <span class="dot">●</span>
                  <span class="date_tit">{{item.commisionIntime}}</span>
                  <span class="moneynum">{{item.statusName}}</span>
                </div>
                <div class="name">佣金收入 <span style="color:#ff6419"></span> {{item.commision}}</div>
              </div>
              <div class="emptyBox" v-if="datalist.length==0" >
                <div class="emptyImg_box">
                  <img class="empty_img" src="../images/wallet_icon_empty.png" alt="">
                </div>
                <div class="empty_tit">
                  暂无该月收支记录哦！
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
      <div class="emptyBox" v-if="totalCount==0" >
                <div class="emptyImg_box">
                  <img class="empty_img" src="../images/wallet_icon_empty.png" alt="">
                </div>
                <div class="empty_tit">
                  您暂时没有收支记录哦！
                </div>
                <div class="empty_tit">
                  赶快去推荐方案给业主赚取佣金吧！
                </div>
                <div class="empty_but">
                    <span class="eb" @click="$router.push('/recom')">逛逛方案</span>
                </div>
      </div>
  </div>
</template>
<script>
import mixins from "@/mixins/mixin";
export default {
  mixins: [mixins],
  // 收支明细
  data(){
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
       commissionTotal: 0,
       expensesCommissionTotal: 0,

       curTabIndex: 0, 

       tab: [
         {
           name: '全部',
           sel: true
         },
         {
           name: '未返现',
           sel: false
         },
         {
           name: '已返现',
           sel: false
         }
       ],
       seltab: 0,

       totalCount: 0
      }
  },
  created(){
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

       this.getMyincomeexpenses()
  },
  methods:{
    // 选择日期
    handlePicker0Confirm (v) {
        this.yearMonth = v[0].value + v[1].value;
        this.showDate = false;
        this.picker0.anchor = v;
        this.selyaer  = v[0].value.substr(0,4);
        this.selmonth = v[1].index+1;
        this.curPage = 1;
         this.getMyincomeexpenses();
      },
      handlePickerCancel() {
        this.showDate = false;
      },
      isShowData() {
        this.$refs.picker0.show();
        this.showDate = true;
      },
     // 选择日期  
     selTab(item, index) {
       this.tab.map(i=> {
         i.sel = false;
       })
       item.sel = true;
       
       this.curTabIndex = index;
     },
     pulldown() {

     },
     loadmore() {
       this.curPage++;
       this.getMyincomeexpenses('loadmore');
     },

     getMyincomeexpenses(from) {
       this.API.myincomeexpenses(this.curPage,this.pageSize,this.selyear,this.selmonth).then(res=> {
         if(res.message == 'success') {
           this.totalCount = res.obj.commissionInfoCount;
           this.commissionTotal = res.obj.commissionTotal;
           this.expensesCommissionTotal = res.obj.expensesCommissionTotal;
           this.datalist = this.datalist.concat(res.obj.commisionInfoList);
         }
         else if(from == 'loadmore'){
           this.$toast('没有更多数据')
         }else {
           this.datalist = [];
           this.commissionTotal = 0;
           this.expensesCommissionTotal = 0;
         } 
       })
     },
  }
}
</script>
<style lang="scss" scoped>
   @import '../../../../styles/header.scss';
    @import './styles/inex.scss';
</style>


