
<template>
  <div class="robOrder">
    <div class="header">
      <i class="icon-left" @click="$router.push('/')"></i>
      <div class="title">平台派单</div>
      <i class="icon-set" @click="$router.push('/mycumser_set')"></i>
    </div>
    <div class="tab-box">
       <div class="tab-item" v-for="(item,index) in tabItem" :key="index" :class="{'active':item.active}" @click="changeTab(item)">{{item.name}}</div>
    </div>
    <scroll :probeType="probeType"
            ref="scroll"
            :pullup="true"
            @scrollToEnd="scrollToEnd"
            :listenScroll="listenScroll" v-if="orderList.datalist.length!=0">
      <div class="robOrder-content">
          <div class="item-list" @click.stop="item.priceStatus==0 ? $router.push(`/offerPrice/${item.priceId}`): $router.push(`/orderDetail/${item.priceId}`)" v-for="(item,index) in orderList.datalist" :key="index">
              <div class="item-haeder">
                  <div class="info">
                    <p>{{item.userName}}</p>
                    <p>{{item.mobile}}</p>
                  </div>
                  <div class="state" v-if="item.priceStatus==0">待报价</div>
                  <div class="state" v-else-if="item.priceStatus==1">报价成功，等待平台反馈 </div>
                  <div class="state" v-else-if="item.priceStatus==4">已选中</div>
                  <div class="state" v-else>已取消</div>
              </div>
              <div class="decoration-style">
                 <p>{{item.areaName}} · {{item.houseAcreage}}㎡ · {{item.bedroomNum}}室{{item.livingRoomNum}}厅{{item.toiletNum}}卫  </p>
                 <p>{{item.decorateHouseTypeInfo==0 ? '新房装修' : '旧房改造'}} · {{item.decorateStyleInfo}} · 预算{{item.decorateBudgetInfo}}</p>
                 <p><i class="ic_gps"></i>{{item.provinceInfo}}·{{item.cityInfo}}</p>
              </div>
              <div class="item-bottom" v-if="item.priceStatus==0&&item.offerRemainingTime">
                <div class="view720">
                  <img :src="item.planPicPath | filtersIMg" alt="">
                  <div class="img-3D" @click.stop="go720(item)"><span>3D全景</span></div>
                </div>
                <div class="info-state">报价后，自动匹配与业主预算最符合的装修公司派单 <span></span></div>
                <div class="time">
                  <img src="./images/offer@2x.png" alt="">
                  <p @click.stop="$router.push(`/offerPrice/${item.priceId}`)">立即报价</p>
                  <p>剩余时间 {{item.offerRemainingTime | timeFilter}}</p>
                </div>
              </div>
          </div>
      </div>
    </scroll>
    <dispatchtit :dispathShow='dispathShow' @closeDispath='dispathShow = false'></dispatchtit>
    <div class="empty" v-if="orderList.datalist.length==0">
      <img src="./images/list_empty.png" alt="">
      <div class="">您暂时还没有客户哦！</div>
    </div>
  </div>
</template>

<script>
  import minix from "@/mixins/mixin";
  import { robOrderList } from 'api/home';
  export default {
    mixins: [minix],
    name: "index",
    components:{

    },
    data(){
      return {
        dispathShow: false,
        orderList:'',
        hasData:true,
        start:1,
        limit:10,
        priceStatus:1,
        times:[],
        tabItem:[
          { name:'全部',active:true,type:0},
          { name:'待报价',active:false,type:1},
          { name:'已取消',active:false,type:2}
        ]
      }
    },
     // 描点定位
    beforeRouteEnter(to, from, next) {
      to.meta.keepNotAlive = false;
      next();
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepNotAlive = !(to.name === 'orderDetail');
      let keepAliveComponent = this.$parent.$vnode.parent;
      if (keepAliveComponent && from.meta.keepNotAlive) {
        delete keepAliveComponent.componentInstance.cache[keepAliveComponent.componentInstance.keys[0]];
        keepAliveComponent.componentInstance.keys = [];
      }
      next();
    },
    activated() {
      if(!(localStorage.getItem('dispathShow')/1==1)) {
        this.dispathShow = true;
        localStorage.setItem('dispathShow', 1);
      }else {
        this.dispathShow = false;
      }
    },
    created(){
      this.orderListMs(this.priceStatus);
    },
    mounted(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.$refs.scroll.refresh()
        },200)
      })
    },
    methods:{
      scrollToEnd(){
        if(this.hasData){
          this.start++;
          this.orderListMs(this.priceStatus);
        }
      },
      orderListMs(){
        robOrderList({ priceStatus:this.priceStatus,start:this.start,limit:this.limit }).then((res)=>{
          if(res.success){
            this.start==1 ?  this.orderList=res : this.orderList.datalist=this.orderList.datalist.concat(res.datalist);
            this.orderList.datalist.map(item=>{
                item.planRecommendedId=item.designplanId;
            })
            this.timer();
            if(res.datalist.length==0&&this.start!=1){ this.$toast('我是有底线的！');this.hasData=false;}
            setTimeout(()=>{
              this.$refs.scroll.refresh()
            },200)
          }
        })
      },
      changeTab(item){
            this.orderList.datalist=[];
          this.start=1;this.limit=10;
          this.hasData=true;
          this.tabItem.map(res=>{
             res.active=false;
          })
         item.active=true;
         item.type==0 ?  this.priceStatus=1: item.type==1 ? this.priceStatus=2 : this.priceStatus=3;
         this.orderListMs(this.priceStatus)
      },
      timer(){
        this.orderList.datalist.map((res,index)=>{
           if(res.offerRemainingTime){
              clearInterval(this.times[index]);
              let date = new Date(res.endTime);
              if(index == 0 ) {
                console.log("第一条数据第一次初始值："+res.offerRemainingTime);
              }
             // res.SystemTimeAfterCountdown = date.getTime() + res.offerRemainingTime; // 倒计时之后的系统时间
              res.SystemTimeAfterCountdown =date.getTime();
              this.times[index]=setInterval(()=>{
                if(res.offerRemainingTime>=1000){
                 // res.offerRemainingTime=res.offerRemainingTime-1000;
                 if(index == 0) {
                      console.log("第一条数据后续每个一秒间隔值："+res.offerRemainingTime);
                 }
                   let time = new Date();
                   res.offerRemainingTime = res.SystemTimeAfterCountdown - time.getTime();
                   if(index == 0) {
                      console.log("第一条数据后续每个一秒间隔值："+res.offerRemainingTime);
                   }
                }else{
                  clearInterval(this.times[index])
                }
              },1000)
           }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .robOrder{
     height: 100%;
     background-color: #fafafa;
     overflow: hidden;
     .empty {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 4rem;
        margin-top: -2rem;
        text-align: center;
        font-size: 24px;
        color: #666;
        line-height: 48px;
        overflow: hidden;
        background-color: #f7f7f7;
        img {
            width: 2rem;
            height: 2rem;
        }
    }
    .header{
       display: flex;
       background-color: #fff;
       .title{
         flex: 1;
         height: 88px;
         line-height: 88px;
         text-align: center;
         font-size: 34px;
         color: #333333;
       }
      .icon-set{
        display: block;
        width: 88px;
        height: 88px;
        background: no-repeat center url("./images/icon-Set-up@2x.png");
        background-size: 40%;
      }
    }
    .tab-box{
        height: 88px;
        line-height: 88px;
        background-color: #fff;
        display: flex;
       .tab-item{
         color: #333333;
         font-size: 24px;
         flex: 1;
         text-align: center;
         position: relative;
       }
      .active{
        color: #ff6419;
        &:after{
          content: '';
          position: absolute;
          width: 46px;
          height: 4px;
          background-color: #ff6419;
          border-radius: 2px;
          bottom: 0;
          left: 102px;
        }
      }
    }
    .robOrder-content{
       padding: 30px 30px 180px 30px;
       .item-list{
           padding: 40px;
           background-color: #fff;
           margin-bottom: 20px;
           .item-haeder{
             position: relative;
             border-bottom: 1px solid #f7f7f7;
             padding-bottom: 28px;
             .info{
               p{
                 font-size: 36px;
                 color: #333333;
                 line-height: 36px;
               }
               p:nth-of-type(2){
                 font-size: 28px;
                 margin-top: 12px;
               }
             }
             .state{
               position: absolute;
               right: 0;
               top: 0;
               color: #ff6419;
               font-size: 28px;
             }
           }
         .decoration-style{
           padding-top: 28px;
           p{
             color: #666666;
             font-size: 24px;
             line-height: 42px;
           }
           .ic_gps{
              display: inline-block;
              width: 24px;
             height: 24px;
             background: no-repeat center url("./images/icon-dingwei.png");
             background-size: 100%;
             vertical-align: middle;
             margin-right: 5px;
           }
         }
         .item-bottom{
           .view720{
             position: relative;
             height: 349px;
             img{
               height: 349px;
               width: 100%;
             }
             .img-3D{
               width: 180px;
               height: 68px;
               background-image: linear-gradient(-53deg,
                 #29cccc 0%,
                 #2cd9ba 60%,
                 #2ee5a8 100%),
               linear-gradient(
                   #29cccc,
                   #29cccc);
               background-blend-mode: normal,
               normal;
               border-radius: 34px;
               opacity: 0.8;
               color: #fff;
               line-height: 68px;
               font-size: 28px;
               text-align: center;
               position: absolute;
               top: 50%;
               left: 50%;
               transform: translate(-50%,-50%);
               span{
                 &:after{
                   content: '';
                   display: inline-block;
                   width: 0;
                   height: 0;
                   border-top: 12px solid transparent;
                   border-left: 20px solid #fff;
                   border-bottom:12px solid transparent;
                   vertical-align: middle;
                   margin-left: 10px;
                   margin-top: -6px;
                 }
               }
             }
           }
           .info-state{
             height: 56px;
             line-height: 56px;
             background-color: #ffeded;
             border-radius: 4px;
             text-align: center;
             margin-top: 24px;
             color: #ff4545;
             font-size: 24px;
             position: relative;
             span{
               position: absolute;
               bottom: -10px;
               left: 50%;
               display: inline-block;
               width: 0;
               height: 0;
               border-right: 8px solid transparent;
               border-top: 10px solid #ffeded;
               border-left:8px solid transparent;
               margin-left: -8px;
             }
           }
           .time{
             margin-top: 20px;
              img{
                 display: block;
                 height: 88px;
                 width: 88px;
                 margin: 0 auto;
              }
             p:nth-of-type(1){
               line-height: 32px;
               color: #333333;
               font-size: 24px;
               text-align: center;
               margin-top: 10px;
             }
             p:nth-of-type(2){
               line-height: 32px;
               color: #ff6419;
               font-size: 24px;
               text-align: center;
               margin-top: 15px;
             }
           }
         }
       }
    }
  }

</style>
