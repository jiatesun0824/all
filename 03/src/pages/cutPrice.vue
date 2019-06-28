<template>
    <div class="page" :class="{'overhide':overhide}">
         <div class="page-content">
            <div v-if="detailData">
              <div class="page-info" v-if="awardList.length>0">
                <ul :style="{top:changeTop}" :class="{'transition':isTransition}">
                  <li v-for="item in awardList" :key="item">{{item.message}}</li>
                </ul>
              </div>
              <div class="page-rule">
                <img src="/static/image/cutPrice/plan_banner(1).png" alt="" class="plan_banner">
                <div class="activity-rule" @click="$refs.ruleDialog.show();mask=true;">活动规则</div>
              </div>
              <!--//砍价商品-->
              <goodsCut @changeState="changeState" @changeHint='changeHint' @showShare="posterShareShow=true"></goodsCut>
              <!--//体验装进我家-->
              <experienceHome v-if="isSXW && urlParams.isUser != 2"></experienceHome>
              <!--//砍价列表-->
              <cutList v-if="urlParams.isUser == 2"></cutList>
              <!--活动规则-->
              <ruleDialog ref="ruleDialog"></ruleDialog>
              <!--砍价详情-->
              <cutDetailDialog></cutDetailDialog>
              <!--//开始砍价-->
              <startCutDialog></startCutDialog>
              <!-- //体验成功-->
              <experienceDialog></experienceDialog>
              <!--收货地址-->
              <deliveryAddressDialog></deliveryAddressDialog>
              <!--报存图片-->
              <saveImageDialog></saveImageDialog>
              <!--提交成功-->
              <submitDialog></submitDialog>
              <!-- 海报组件 -->
              <poster-share :registrationId='registrationId' v-if='posterShareShow' @close='posterShareShow = false'></poster-share>
            </div>
           <!---->
           <div class="toast" v-show="toast">{{msg}}</div>
           <!-- 判断是否有砍价机会弹框 -->
           <div class='iscutprice-dialog' v-show='hint'>
             <div>
               <i class='shut-icon' @click='close'></i>
               <img src='/static/image/cutPrice/pop_icon_on.png' class='iscutprice-icon'/>
               <p>{{iscutpriceText}}</p>
             </div>
           </div>
           <!--未开始与结束弹窗-->
           <div class="activity-dialog" v-show="activityDialog">
             <div v-if="activityParam.statusCode=='ACT_UNBEGIN'">
               <img src="/static/image/cutPrice/pic_03.png" alt="">
               <p>活动未开始，敬请期待！</p>
               <p>开始时间：{{detailData.begainTime}}</p>
             </div>
             <div v-else-if="activityParam.statusCode=='ACT_ENDED'||activityParam.statusCode=='ACT_ENDED_UN_CUT'">
               <img src="/static/image/cutPrice/pic_04.png" alt="" class="end-img">
               <p>活动已结束</p>
               <p>下期活动即将开启，敬请期待！</p>
             </div>
             <div class="btn" @click="toWx">返回首页</div>
           </div>
         </div>
         <div class="mask" v-show="mask"></div>
    </div>
</template>

<script>
    import { mapGetters,mapActions } from 'Vuex'
    import { indexMixin } from "@/mixin";
    import goodsCut from '@/components/cutPrice/goodsCut'; //砍价商品
    import cutList from '@/components/cutPrice/cutList';   //砍价列表
    import experienceHome from '@/components/cutPrice/experienceHome'; //体验装进我家
    import ruleDialog from '@/components/cutPrice/rule-dialog'; //活动规则
    import cutDetailDialog from '@/components/cutPrice/cutDetail-dialog'; //砍价详情
    import startCutDialog from '@/components/cutPrice/startCut-dialog'; //开始砍价
    import experienceDialog from '@/components/cutPrice/experience-dialog'; //体验成功
    import deliveryAddressDialog from '@/components/cutPrice/deliveryAddress-dialog'; //收货地址
    import saveImageDialog from '@/components/cutPrice/saveImage-dialog'; //报存图片
    import submitDialog from '@/components/cutPrice/submit-dialog'; //报存图片
    import posterShare from '@/components/poster-share';//生成海报
    export default {
        name: "cutPrice",
        mixins: [indexMixin],
        components:{
          goodsCut,
          cutList,
          experienceHome,
          ruleDialog,
          cutDetailDialog,
          startCutDialog,
          experienceDialog,
          deliveryAddressDialog,
          saveImageDialog,
          submitDialog,
          posterShare
        },
        data(){
          return{
            posterShareShow:false,
            activityDialog:false,
            mask:false,
            overhide:false,
            toast:false,
            isTransition:true,
            msg:'',
            awardList: '',//领取奖励列表
            topIndex:0,
            timer:'',
            iscutprice: 2,
            iscutpriceText: '你今天的砍价机会已用完，请明天再来！',
            hint: false,
            registrationId: ''
          }
        },
        watch:{  //处理蒙层底部不滚动
          'mask':function () {
               if(this.mask){
                  this.overhide=true
               }else {
                 this.overhide=false
               }
          }
        },
        computed:{
          ...mapGetters('cutprice',['activityParam','experienceShowDialog','urlParams','detailData']),
          changeTop(){
            return -this.topIndex*0.64+'rem';
          },
          isSXW(){
             if(this.urlParams.appId=="wx42e6b214e6cdaed3"){ //是否是随选网   企业小程序不显示体验活动
               return true
             }else{
               return false
             }
          }
        },
      created(){
        // console.log(this.activityParam)
          document.title ='砍价活动';
          // 链接上获取是 isUser=1;直接进入 ； isUser=2 好友进入  actId 活动id  砍价后才有的regId ,cutPrice体验后砍的价格 只显示一次
          this.setUrlParams(this.$route.query);
          // if(this.urlParams.cutPrice==true){
          //    this.mask=true;
          //    this.setDialog({ experienceShowDialog:true });
          // }
          this.commonMs(this.urlParams.isUser,this.urlParams.actId,this.urlParams.regId);//公共掉的接口
        },
        methods:{
          ...mapActions('cutprice',['setActivityParam','setDetailData','setAwardList','setCutRecord','setDialog','setUrlParams']),
          async commonMs(isUser,actId,regId,type){ //首页调用  砍价之后调用
            //小程序到h5需要传递的参数 及判断------------------------------------------------------------------
            if(isUser==2){ //好友进入
              const res4=await this.API.getInviteCutStatus({actId:actId,regId:regId});
              if(res4.obj=='ACT_ENDED_CUT'||res4.obj=='ACT_ENDED_UN_CUT'){//砍价活动结束时有2中情况 砍了 与未砍
                res4.obj=='ACT_ENDED_CUT' ? res4.obj='ACT_ENDED' : '';
                this.activityDialog=true;
              }
              let obj={
                statusCode:res4.obj,
                registrationId:regId
              }
              if(res4.success)this.setActivityParam(obj);
              //alert(JSON.stringify(this.activityParam))
            } else { //非好友进入
              //活动开始
              const res=await this.API.getRegStatus({actId:actId});
              if(res.success) {  //结束之后存值
                if((res.obj.statusCode=='ACT_ENDED'||res.obj.statusCode=='ACT_UNBEGIN')&&(res.obj.registrationId==''||res.obj.registrationId==undefined)){ //判断是否已经结束及是否砍过价
                  this.activityDialog=true;
                }
                this.registrationId = res.obj.registrationId;
                console.log(res.obj, 'res.obj');
                console.log(res.obj.registrationId, 'registrationId')
                this.setActivityParam(res.obj)
              }else { ////活动不存在时显示  活动结束
                if(res.exceptionCode==404){
                  this.setActivityParam({
                    statusCode:'ACT_ENDED',
                    registrationId:''
                  });
                  this.activityDialog=true
                }
              };
             //向小程序传值 自己砍价后吧regid 传给小程序
              //alert(res.obj.registrationId)
              if(type==1){
                try {
                  wx.miniProgram.postMessage({ data: {regId: res.obj.registrationId} });
                  this.data.registrationId = res.obj.registrationId
                }catch (e) {

                }
              }
            }
            //公共调用的方法------------------------------------------------------------------------------------------
            //活动详情
            const res1=await this.API.getActAndRegDetails({actId:actId,regId:this.activityParam.registrationId});
            if(res1.success) this.setDetailData(res1.obj);
            document.title =res1.obj && res1.obj.actName;
            wx.miniProgram.postMessage({ data: {produceName: res1.obj && res1.obj.productName,shareImg:res1.obj && (this.baseUrl.resourceURL+ res1.obj.shareImg)} });
            //获取领奖消息列表
            const res2=await this.API.getWxActBargainAwardMsgRandomList({actId:actId});
            if(res2.success) {this.awardList=res2.obj;this.animatetop()}
            //砍价记录
            if(this.activityParam.registrationId) {
              this.API.getInviteRecordList({regId:this.activityParam.registrationId,pageNum:1,pageSize:20}).then(res3=>{
                if(res3.success) this.setCutRecord(res3.datalist);
              });
            }
          },
          changeHint(e) {
            this.hint = true;
            this.iscutpriceText = e
          },
          close() {
            this.hint = false;
          },
          toWx(){
            let url='';
            if(this.urlParams.appId=="wx42e6b214e6cdaed3"){ //随选网
              url="/pages/home/home"
            }else { //企业小程序
              url="/pages/index/index"
            }
            try {
              wx.miniProgram.switchTab({
                url: url
              })
            }catch (e) {

            }
          },
          changeState(){
            this.commonMs(this.urlParams.isUser,this.urlParams.actId,this.activityParam.registrationId,1);
          },
          animatetop(){
            this.timer=setInterval(()=>{
              this.isTransition=true;
              if(this.awardList){
                if(this.topIndex < this.awardList.length-1){
                  this.topIndex ++;
                }else{
                  this.isTransition=false;
                  this.topIndex=0;
                }
              }
            },5000)
          }
        },
        destroyed(){
          clearInterval(this.timer)
        }
    }
</script>

<style scoped lang="scss">
  @import "../css/cutPrice";
</style>
