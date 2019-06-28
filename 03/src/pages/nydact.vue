<template>
  <div class="nydact">
    <img src="/static/image/nydact/page_bg_top.png" alt="" class="pageBg_img">
    <a class="rule" href="#rule">
        活动规则
    </a>
    <div class="main">
      <!-- 活动介绍 -->
      <div class="act_itro" style="margin-top: -2rem;">
        <img class="act_title" src="/static/image/nydact/page_title_01.png" alt="">
        <div class="act_text">
          在随选网使用<span class="colorb36">【产品替换】</span>功能设计自己想要的装修方案，并分享给好友<span class="colorf62">（在【我的】-【我的方案】中查看）</span>，好友通过你分享的小程序进入随选网（需为随选网新用户），你就可以获得话费啦，邀请人数越多，话费越多哦~
        </div>
        <div class="but" @click="toWx(0)">
          去产品替换
        </div>
      </div>
      <!-- 当前红包获取状态 -->
      <div class="act_itro">
        <img class="act_title" src="/static/image/nydact/page_title_02.png" alt="">
        <div class="act_data">
          <div class="act_text">
            您已邀请了<span class="colorb36"> {{dataDetail.currentInviteNum}} </span>人
          </div>
          <div class="act_text" v-if="diffNum&&nextBao">
            还差 <span class="colorb36">{{diffNum}}</span>人就可以领取 <span class="colorb36">{{nextBao}}</span> 话费了哦~
          </div>
          <div class="act_tit">
            点击红包可直接拆开领取
          </div>
        </div>
        <div class="act_status">
          <div class="item_stepbox">
            <div class="item_step" v-for="(item, index) in status" :key="index">
              <div class="step_tit" :style="(item.canAward||item.hasAward)?'color: #bf363b;':'color:#999'">邀请{{item.requestInviteNum}}人</div>
              <div class="step_cao" :style="index==0?'padding-top:1.6rem':''">
                <div v-if="index!=0" class="step_line" :style="(item.canAward||item.hasAward)?'background:#bf363b':'background:#dcdcdc'"></div>
                <img :src="(item.canAward||item.hasAward)?'/static/image/nydact/redbag_dot_02.png':'/static/image/nydact/redbag_dot_01.png'"
                  alt="">
                <div v-if="index!=3" class="step_line"  :style="(item.canAward||item.hasAward)?(showBrindex===index?'background:#bf363b;border-radius: 0 0 0.08rem 0.08rem;':'background:#bf363b;'):'background:#dcdcdc'"></div>
              </div>
            </div>
          </div>
          <div class="item_imgbox">
            <div class="item_img" v-for="(item, index) in status" :key="index">
              <img v-if="item.hasAward" src="/static/image/nydact/redbag_open.png" class="Can" alt="">
              <img v-else-if="item.canAward" @click="getEnvelopes(index+1)" class="Can" src="/static/image/nydact/redbag_usable.png" alt="">
              <img v-else class="unCan"  src="/static/image/nydact/redbag_dis.png" alt="" @click="unCanGet">
              <div class="recval" v-if="item.hasAward">{{item.redPacketDesc}}<br /><span>已领取</span></div>
              <div class="val" v-else>{{item.redPacketDesc}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 活动流程步骤介绍 -->
      <div class="act_itro" style="padding:0">
        <img class="act_img" src="/static/image/nydact/page_bg_step.png" alt="">
      </div>
      <!-- 活动规则 -->
      <div class="act_itro" id="rule">
        <img class="act_title" src="/static/image/nydact/page_title_03.png" alt="">
        <div class="act_list" v-for="(item, index) in rule" :key="index">
          <div class="con">
            <div class="left">
              <span>{{index+1}}</span>
            </div>
            <div class="right">{{item.tit}}</div>
          </div>
        </div>
      </div>
      <img class="page_icon" src="/static/image/nydact/page_bg_logo.png" alt="">
    </div>
    <!-- 获取红包弹框 -->
    <div class="toast1" v-if="get" >
        <div class="box">
            <div class="title">恭喜获得{{getTit}}元话费</div>
            <div class="tit">输入手机号直接领取</div>
            <div class="inputbox">
                <input class="phone" v-model="phone" type="number" placeholder="请输入充值手机号">
                <div class="codebox">
                    <input class="code" v-model="code" placeholder="请输入验证码" type="number">
                    <div class="codebut" v-if="phoneTrue" @click="getCode">{{codetit}}</div>
                    <div class="codebut" v-else style="color:#999">获取验证码</div>
                </div>
                <div class="submit" @click="submit">确定充值</div>
            </div>
            <img class="colse_icon" @click="closeToast(1)" src="/static/image/nydact/pop_icon_close.png" alt="">
        </div>
    </div>
    <!-- 获取红包成功弹框 -->
    <div class="toast1" v-if="getsuc">
        <div class="box">
            <div class="title">恭喜获得{{haveGetBao}}元话费</div>
            <div class="tit">充值账号：{{haveGetNum}}</div>
            <div class="suctitle">话费充值已提交</div>
            <div class="suctit">24小时内即可到账</div>
            <img class="colse_icon"  @click="closeToast(2)" src="/static/image/nydact/pop_icon_close.png" alt="">
        </div>
    </div>
    <!-- 获取红包失败弹框 -->
    <div class="toast1" v-if="getfail">
        <div class="box">
            <div class="failtitle">您来晚啦</div>
            <div class="failtit">本次话费已发放完毕</div>
            <div class="failtit">不如体验一下家装黑科技吧</div>
            <div class="failbut" @click="toWx(1)">前往体验</div>   
        </div>
    </div>
    <!-- 绑定手机号异常， 领取不能领的红包等相关小提示 -->
    <div class="pop" v-if="popShow">
        <div>{{popMessage}}</div>
    </div>
  </div>
</template>
<script>
import { indexMixin } from "@/mixin"
import { setTimeout } from 'timers';
let time
  export default {
    mixins: [indexMixin],
    data() {
      return {
        //   规则
        rule: [{
            tit: '活动时间：2019年01月09日-15日0点;'
          },
          {
            tit: '分享通过"产品替换"功能渲染的方案给好友 (需为随选网新用户), 且好友进入随选网视为邀请有效;'
          },
          {
            tit: '话费红包需要在活动结束前领取, 逾期作废;'
          },
          {
            tit: '本活动最终解释权归深圳市三度空间有限责任公司所有。'
          }
        ],
        // 用户操作后的参数
        regId: '', // 任务id
        diffNum: 0, // 差几人
        nextBao: '', // 下一个可领的红包
        haveGetBao: 0, // 用户获得多少红包
        haveGetNum:'', // 用户充值的手机号
        curIndex:0, // 用户选择的红包
        showBrindex:0, // 当前邀请人到达那个阶段
        // 展示与插件控制数据
        dataDetail: {}, // 活动详情数据
        // 进度条状态
        status: [],
        // get红包弹框
        get: false,
        getTit: '', // 弹框提示 
        // get红包成功弹框
        getsuc: false,
        // get红包失败弹框
        getfail: false,
        // 手机号
        phone: '',
        phoneTrue: false, // 手机号是否合格
        // 验证码
        code: '',
        codetit: '获取验证码', // 获取验证码按钮文本
        i: 60, // 验证码倒计时
        // 绑定手机失败提示
        popShow: false,
        popMessage: '',
        ciOrOnline: false
      }
    },
    watch: {
      // 手机格式监听
        phone(val) {
            if(val.length>11&&/^1/.test(val)) {
                this.phone = val.substr(0, 11);
                this.phoneTrue = true;
            }else if(val.length==11&&/^1/.test(val)){
                this.phoneTrue = true;
            }else {
                 this.phoneTrue = false;
            }
        }
    },
    created() {
      // 记录邀请信息(好友通过分享链接进入时) ,此regid用分享过来的regid
      // this.API.recordInvitation({regId: }).then(res=> {

      // })
      this.getDetail();
    },
    methods: {
      toWx(type){
            // type 为1，去首页；为0，去产品提换
            let sevenObj = JSON.stringify({
              platformCode: 'brand2c',
              operationSource: 1,
              planId: this.ciOrOnline ? 140084 : 168088,
              routerQueryType: 'seven',
              customReferer: 'https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html',
              platformNewCode: 'miniProgram',
              isRender: 0,
              shopId: '',
              isGoods: '',
              url: `https://720.${this.ciOrOnline ? 'ci.' :''}sanduspace.com/v-seven.html#/`
            })
            let url= type==1?"/pages/plan/house-case/house-case":'/pages/web-720/web-720?item=' + sevenObj;
            try {
              if(type==1) {
                wx.miniProgram.switchTab({
                  url: url
                })
              }else {
                wx.miniProgram.navigateTo({
                  url: url
                })
              }
            } catch (e) {

            }
      },
      // 领取不能领的红包
      unCanGet() {
         this.popFun('该红包还未生效哦~');
      },
      // 弹框方法
      popFun(message) {
            this.popShow = true;
            this.popMessage = message;
            setTimeout(()=> {
              this.popShow = false;
              this.popMessage = '';
            }, 2000)
      },
      // 获取活动详情
      getDetail() {
        document.title = '活动详情'
        //  || 'c9b0f32324ef47b49f38bda52c85f1d7' || '3d127fded17d49d593f53c085d70b59c'
        this.API.getUserRedPacketActAndRegDetails({actId:this.ciOrOnline ? '2ee41ff4d09344c6837c5e70b68e0411' : 'e80dd05839d54890b86190303a1f73c3'}).then(res=> {
        if(res.success) {
          if(res.obj.actStatus=='ACT_ONGOING') {
            this.dataDetail = res.obj;
            this.status = res.obj.awardList;
            this.regId = this.dataDetail.regId;
            this.status.map((item, index)=> {
              if(this.dataDetail.currentInviteNum>=15) {
                this.diffNum= null;
                this.nextBao = null;
                 this.showBrindex = 3;
              }else if(this.dataDetail.currentInviteNum>=10) {
                this.diffNum= 15-this.dataDetail.currentInviteNum;
                this.showBrindex = 2;
                this.nextBao = '20元';
              }else if(this.dataDetail.currentInviteNum>=3) {
                this.diffNum= 10-this.dataDetail.currentInviteNum;
                this.nextBao = '10元';
                this.showBrindex = 1;
              }else if(this.dataDetail.currentInviteNum>=1){
                this.diffNum= 3-this.dataDetail.currentInviteNum;
                this.nextBao = '5元';
                this.showBrindex = 0;
              }else {
                this.diffNum= 1;
                this.nextBao = '2元';
              }
            })
          } else if(res.obj.actStatus=='ACT_ENDED') {
            this.getfail = true;
          } else if (res.obj.actStatus=='ACT_UNBEGIN') {
            this.popFun('活动未开始')
          } else {
            this.popFun(res.message);
          }
        }else {
           this.popFun(res.message);
        }
      })
      },
      // 获取验证码
        getCode() {
            if(this.i==60) {
                time = setInterval(()=>{
                    this.i--;
                    this.codetit = this.i+'s';
                    if(this.i<1) {
                        this.codetit = '获取验证码';
                        clearInterval(time);
                        this.i = 60;
                    }
                },1000)
                this.API.getYSms({phoneNumber:this.phone,msgId:'123'}).then(res=>{

                })
            }
        },
        // 确定绑定手机号
        submit(){
          this.API.bindRechargeMobile({regId: this.regId, mobile: this.phone, validationCode: this.code}).then(res=>{
            if(res.success) {
              this.API.receiveRedPacket({regId: this.regId,redPacketSeq: this.curIndex}).then(res=>{
                  if(res.success) {
                    this.get = false;
                    this.codetit = '获取验证码';
                    clearInterval(time);
                    this.phone = '';
                    this.i = 60;

                    this.getsuc = true;
                    this.haveGetBao = res.obj.packetAmount;
                    this.haveGetNum = res.obj.rechargeMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                    // this.getDetail();
                  }else if(res.exceptionCode/1==403){
                      this.get = false;
                      this.codetit = '获取验证码';
                      clearInterval(time);
                      this.phone = '';
                      this.i = 60;

                      this.getfail = true;
                  }else {
                       this.popFun(res.message);
                  }
                })
            }else {
               this.popFun(res.message);
            }
          })
        },
        // 领红包
        getEnvelopes(index) {
            this.API.isRechargeMobileBind({regId: this.regId}).then(res=> {
              if(res.success) {
                if(res.obj) {// 用户已绑定手机号，直接领红包
                  this.API.receiveRedPacket({regId: this.regId,redPacketSeq: index}).then(res=>{
                    if(res.success) {
                      this.getsuc = true;
                      this.haveGetBao = res.obj.packetAmount;
                      this.haveGetNum = res.obj.rechargeMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                      this.getDetail();
                    }else if(res.exceptionCode/1==403){
                      this.getfail = true;
                    }else {
                       this.popFun(res.message);
                    }
                  })
                }else {// 用户未绑定手机号，先绑定手机号再领红包
                  switch(index) {
                    case 1 : this.getTit = '2';break;
                    case 2 : this.getTit = '5';break;
                    case 3 : this.getTit = '10';break;
                    case 4 : this.getTit = '20';break;
                  }
                  this.get = true;
                  this.curIndex = index;
                }
              }else {
                 this.popFun(res.message);
              }
            })
        },
        // 关闭弹框
        closeToast(type) {
            if(type==1) {
                this.get = false;
                this.codetit = '获取验证码';
                clearInterval(time);
                this.phone = '';
                this.i = 60;
            }else {
                this.getsuc = false;
                this.getDetail()
            }
        }
    }
  }

</script>
<style lang="scss" scoped>
  @import "../css/nydact";

</style>
