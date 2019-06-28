<template>
  <div class="message">
    <header>
      <i class="icon-left" @click="$router.back()"></i>
      <div class="title">消息</div>
    </header>
    <div class="message__nav" v-if="userType!=11">
      <span class="message__nav--item" :class="{active: item.active}" v-for="(item, index) in messageNav" :key="index"
        v-text="item.name" @click="changeMessageTab(index)"></span>
    </div>
    <swiper class="message__swiper" :options="messageSwiperOptions" ref="messageSwiper" v-if="userType!=11">
      <swiper-slide :class="{'swiper-no-swiping': !i}" v-for="(nav, i) in messageNav" :key="i">
        <template v-if="!i">
          <scroll v-if="!noMessShow" class="wrapper" :listenScroll="listenScroll" :probeType="3" pullup beforeScroll
            :scrollX="true" :refreshScroll="true" :data="slider" @scrollToEnd="loadData" ref="wrapperScroll">
            <div class="box">
              <div class="slider" v-for="(item,index) in slider" :key="index">
                <span v-if="item.unreadMsg!=0" class="unReadMsgTit">{{item.unreadMsg>99?'99+':item.unreadMsg}}</span>
                <div class="content" @touchstart='touchStart($event, index)' @touchmove="removeMsg($event, index)"
                  @touchend="touchEnd($event, index)" data-type="0" @click="tochat(item)" ref="contentRef">
                  <div class="port">
                    <img class="port-img" :src="item.friendPicPath ? (userInfo.resourcesUrl+item.friendPicPath) : require('../images/headpic.png')">
                  </div>
                  <div class="info">
                    <div class="name">
                      {{item.contactName}}  
                    </div>
                    <span v-if="item.relatedObjType==1&&item.objOwnByContact" class="relatedObjTypeTit">店铺</span>
                    <div class="mess" v-if="item.msgType==0">
                      {{item.lastMsg}}
                    </div>
                    <div class="mess" v-else-if="item.msgType==1">[图片]</div>
                    <div class="mess" v-else-if="item.msgType==4">收到一个户型，请在PC端查看</div>
                    <div class="mess" v-else>收到一个方案，请在PC端查看</div>
                    <div class="date">{{item.sendTime}}</div>
                  </div>
                </div>
                <div class="remove" ref='remove' @click="remove($event, item, index)">
                  删除
                </div>
              </div>
            </div>
            <div class="noslider">没有更多数据...</div>
          </scroll>
          <div class="noMess" v-else>
            <div class="iconbox">
              <img class="icon" src="../images/detail_icon_empty.png">
            </div>
            <div class="tit">
              您暂时没有收到信息哦！
            </div>
            <div class="tit">
              逛逛首页看看有没有您需要的服务！
            </div>
            <div class="but" @click="goShop">
              <span>逛逛首页</span>
            </div>
          </div>
        </template>
        <template v-else>
          <scroll v-if="systemMsgList && !!systemMsgList.length || userInfo.oldServiceFlag && !!userInfo.leftTime && userInfo.leftTime <= 5 || userInfo.tipsFlag"
            :data="systemMsgList" beforeScroll pullup @scrollToEnd="loadMore">
            <div class="system__message" v-load-more="!isAllData" v-all-loaded="isAllData">
              <div class="system__message--item" v-if="userInfo.oldServiceFlag && !!userInfo.leftTime && userInfo.leftTime <= 5 || userInfo.tipsFlag && userInfo.remainingDays">
                <p class="system__message--top">系统消息</p>
                <p class="system__message--bottom">
                  您{{userInfo.oldServiceFlag ? '账户' : userInfo.serviceType ? '试用' : '使用'}}期限还剩{{remainingDays}}天，请及时续费；
                  <span class="system__message--cs" @click="$router.push('/cumstomer')">联系客服 »</span>
                </p>
              </div>
              <div class="system__message--item" @click="goFeed(item)" v-for="(item, index) in systemMsgList" :key="index">
                <p class="system__message--top">
                  <span v-text="item.title"></span>
                  <span class="system__message--time" v-text="item.gmtModified"></span>
                </p>
                <p class="system__message--bottom" v-text="item.content"></p>
              </div>
            </div>
          </scroll>
          <div class="empty__sysMsg" v-else>
            <i class="empty__icon"></i>
            <span class="empty__text">暂无系统消息</span>
          </div>
        </template>
      </swiper-slide>
    </swiper>
    <div v-if="userType==11" style="width: 100%;height: 100%;">
      <scroll class="wrapper" v-if="systemMsgList && !!systemMsgList.length || userInfo.oldServiceFlag && !!userInfo.leftTime && userInfo.leftTime <= 5 || userInfo.tipsFlag"
        :data="systemMsgList" beforeScroll pullup @scrollToEnd="loadMore">
        <div class="system__message" v-load-more="!isAllData" v-all-loaded="isAllData">
          <div class="system__message--item" v-if="userInfo.oldServiceFlag && !!userInfo.leftTime && userInfo.leftTime <= 5 || userInfo.tipsFlag && userInfo.remainingDays">
            <p class="system__message--top">系统消息</p>
            <p class="system__message--bottom">
              您{{userInfo.oldServiceFlag ? '账户' : userInfo.serviceType ? '试用' : '使用'}}期限还剩{{remainingDays}}天，请及时续费；
              <span class="system__message--cs" @click="$router.push('/cumstomer')">联系客服 »</span>
            </p>
          </div>
          <div class="system__message--item" @click="goFeed(item)" v-for="(item, index) in systemMsgList" :key="index">
            <p class="system__message--top">
              <span v-text="item.title"></span>
              <span class="system__message--time" v-text="item.gmtModified"></span>
            </p>
            <p class="system__message--bottom" v-text="item.content"></p>
          </div>
        </div>
      </scroll>
      <div class="empty__sysMsg" v-else>
        <i class="empty__icon"></i>
        <span class="empty__text">暂无系统消息</span>
      </div>
    </div>
  </div>
</template>
<script>
  import mixins from '@/mixins/mixin';
  import {
    mapGetters,
    mapActions
  } from 'Vuex';
  import {
    getPrivateMessageList,
    deluserprivatemessage
  } from '@/api/user';
  export default {
    mixins: [mixins],
    data() {
      return {
        messageNav: [{
            name: '留言消息',
            active: true
          },
          {
            name: '系统消息',
            active: false
          }
        ],
        messageSwiperOptions: {
          notNextTick: true,
          freeMode: false,
          preventLinksPropagation: false,
          on: {
            slideChangeTransitionStart: () => {
              let index = this.messageSwiper.activeIndex;
              this.messageNav.forEach((item, i) => item.active = i === index);
              this.messageSwiper.slideTo(index, 100, false);
              this[['queryChatList', 'querySysMsg'][index]]();
            }
          }
        },
        startX: 0, //触摸位置
        endX: 0, //结束位置

        pulldownbool: true,
        slider: [],
        noMessShow: false,
        sysMsgStart: 0,
        curPage: 1,
        start: 1
      };
    },
    watch: {
      haveUnRead(val) {
        if(val) {
          this.queryChatList();
        }
      }
    },
    computed: {
      ...mapGetters('socket', ['chatMessage', 'haveUnRead']),
      ...mapGetters('common', ['userInfo']),
      ...mapGetters('user', ['MessageList', 'friendId', 'systemMsgList', 'systemMsgCount']),
      messageSwiper() {
        return this.$refs.messageSwiper.swiper;
      },
      isAllData() {
        return this.systemMsgList.length === this.systemMsgCount;
      },
      remainingDays() {
        let distanceDay = new Date(new Date(new Date().toLocaleDateString()) - new Date(this.userInfo.loginDay)).getDate();
        return this.userInfo.oldServiceFlag ? Math.abs(distanceDay - (this.userInfo.leftTime + 1)) : Math.abs(
          distanceDay - (this.userInfo.remainingDays + 1));
      }
    },
    created() {
      this.queryChatList();
      this.userType = JSON.parse(localStorage.getItem('userInfo')).userType;
      this.userType == 11 && this.querySysMsg();
    },
    methods: {
      goFeed(item) {
        if(item.taskId&&item.messageType==2) {
          this.$router.push({
            path:'/feedDeatil',
            query:{
              feedbackId: item.taskId
            }
          })
        }
      },
      ...mapActions('user', [
        'queryPrivateMessageList',
        'setFriendId',
        'queryDeluserPrivateMessage',
        'querySysMsg'
      ]),
      ...mapActions('socket', ['setFromWhere', 'setRelateObj', 'setUnRead']),
      changeMessageTab(index) {
        this.curPage = 1;
        this.messageNav.forEach((item, i) => item.active = i === index);
        this.messageSwiper.slideTo(index, 100, false);
        this[['queryChatList', 'querySysMsg'][index]]();
      },
      queryChatList() {
        this.API.userContactList().then(res => {
          if (res.resultCode == 'SUCCESS' && res.data.length > 0) {
            this.slider = res.data;
            let haveUnRead = false;
            this.slider.map(item=> {
              if(item.unreadMsg == 0) {
                haveUnRead = false;
              }else {
                haveUnRead = true;
                return;
              }
            })
            if (haveUnRead) {
              this.setUnRead(true);
            }else {
              this.setUnRead(false);
            }
            this.noMessShow = false;
          } else {
            this.noMessShow = true;
          }
        })
      },
      tochat(item) {
        var friendId = {
          friendId: '',
          friendName: item.contactName,
          type: 1
        };
        this.setFriendId(friendId);

        this.setFromWhere(item.relatedObjType); // 设定此条消息是店铺还是供求
        let relatedObj = { // 创建会话上传位置信息
          relatedObjId: item.relatedObjId, // 供求或店铺ID
          contactSessionId: item.contactSessionId // 会话对方的id
        }
        this.setRelateObj(relatedObj);

        this.$router.push("/user/chat");
      },
      remove(e, item, index) {  
        this.API.removeContact(item.contactSessionId, item.relatedObjType, item.relatedObjId).then(res => {
          if (res.resultCode == 'SUCCESS') {
            this.API.userContactList().then(res => {
              if (res.resultCode == 'SUCCESS' && res.data.length > 0) {
                this.slider = res.data;
                this.noMessShow = false;
                this.restSlide();
              } else {
                this.noMessShow = true;
              }
            })

          }
        });
      },
      //滑动开始
      touchStart(e, index) {
        // 记录初始位置
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.$refs.contentRef.forEach((item, i) => {
          index !== i && item.removeAttribute('style')
        });
        if (e.target !== this.msgEle) this.msgEle = e.target;
      },
      removeMsg(e, index) {
        if (this.msgEle === e.target && e.target.style.transform.indexOf(`${this.$refs.remove[index].offsetWidth}px`) >
          -1 && e.changedTouches[0].clientX - this.startX < 0 || this.msgEle === e.target && e.target.style.transform.indexOf(
            '(0px)') > -1 && e.changedTouches[0].clientX - this.startX > 0 || !e.target.style.transform && e.changedTouches[
            0].clientX - this.startX > 0) return;
        if (Math.abs(e.changedTouches[0].clientY - this.startY) < 10 && Math.abs(e.changedTouches[0].clientX - this.startX) <=
          this.$refs.remove[index].offsetWidth) {
          this.moveDirect = e.changedTouches[0].clientX - this.startX > 0 ? 'right' : 'left';
          e.target.style.transform = `translateX(${e.changedTouches[0].clientX - this.startX}px)`;
        }
      },
      touchEnd(e, index) {
        if (Math.abs(e.changedTouches[0].clientY - this.startY) < 30) {
          if (this.moveDirect === 'left') {
            e.target.style.transform = `translateX(-${this.$refs.remove[index].offsetWidth}px)`;
          } else {
            e.target.style.transform = 'translateX(0px)';
          }
        }
      },
      //复位滑动状态
      restSlide() {
        let contents = document.querySelectorAll(".content");
        // 复位
        for (let i = 0; i < contents.length; i++) {
          contents[i].style.transform = 'translateX(0px)';
        }

      },
      // 留言消息加载更多
      loadData() {
        this.curPage++;
        getPrivateMessageList({
          curPage: this.curPage,
          pageSize: 10,
          type: 1
        }).then(res => {
          if (res.status) {
            this.slider = this.slider.concat(res.obj);
            this.noMessShow = false;
          }
        });
      },
      // 系统消息加载更多
      loadMore() {
        if (!this.isAllData) {
          this.start++;
          this.querySysMsg({
            start: this.start
          });
        }
      }
    }
  };

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';

</style>
<style lang="scss" scoped>
  .message {
    width: 100%;
    height: 100%;
    padding-top: 90px;
    box-sizing: border-box;
    overflow: hidden;

    @at-root #{&}__content {
      width: 100%;
      height: 100%;
      padding-top: 90px;
      overflow: hidden;
      box-sizing: border-box;
    }

    @at-root #{&}__nav {
      display: flex;
      height: 88px;

      @at-root #{&}--item {
        flex-basis: 50%;
        position: relative;
        height: 100%;
        line-height: 88px;
        text-align: center;
        font-size: 28px;

        &:nth-of-type(1) {

          &:before {
            content: '';
            position: absolute;
            top: 50%;
            right: 0;
            width: 1px;
            /*no*/
            height: 50%;
            background-color: #e8e8e8;
            transform: translateY(-50%) scaleX(0.5);
          }

        }

        &.active {
          color: #ff6419;

          &:after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 15%;
            height: 3px;
            background-color: #ff6419;
            transform: translateX(-50%);
          }
        }
      }
    }

    @at-root #{&}__swiper {
      height: 100%;
      background-color: #f5f5f5;
    }

    .wrapper {
      .box {
        margin-top: 20px;

        .slider {
          width: 100%;
          height: 140px;
          display: block;
          position: relative;

          .unReadMsgTit {
            position: absolute;
            left: 12%;
            top: 15%;
            background: red;
            width: 38px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            color: #fff;
            font-size: 12px;
            border-radius: 50%;
            z-index: 100;
          }

          .content {
            display: flex;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: #fff;
            //    设置过渡动画
            transition: 0.3s;
            z-index: 1;

            .port {
              flex-basis: 140px;
              width: 140px;
              height: 140px;
              float: left;
              display: flex;
              align-items: center;
              justify-content: center;
              pointer-events: none;

              .port-img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
              }
            }

            @at-root .info {
              flex: 1;
              position: relative;
              height: 140px;
              padding-top: 35px;
              box-sizing: border-box;
              pointer-events: none;
              position: relative;
              .relatedObjTypeTit {
                  position: absolute;
                  top: 0.433333rem;
                  left: 35%;
                  width: 0.8rem;
                  /* height: 0.466667rem; */
                  /* line-height: 0.46667rem; */
                  color: #fff;
                  font-size: 0.16rem;
                  background: #ff6419;
                  padding: 0.05rem 0;
                  text-align: center;
                  text-align: center;
                  box-sizing: border-box;
                }

              &:after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 1px;
                /*no*/
                background-color: #f5f5f5;
                transform: scaleY(0.5);
              }

              .name {
                font-family: PingFang-SC-Medium;
                font-size: 32px;
                color: #333;
                width: 3.5rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                position: relative;
                padding-right: 60px;
                box-sizing: border-box;
              }

              .mess {
                font-family: PingFang-SC-Medium;
                font-size: 24px;
                color: #666;
                margin-top: 20px;
                width: 500px;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 0.34rem;
                padding-top: 0.02rem;
                white-space: nowrap;
              }

              .date {
                position: absolute;
                top: 39px;
                right: 30px;
                font-family: PingFang-SC-Medium;
                font-size: 24px;
                color: #666;
              }
            }
          }

          .content[data-type="0"] {
            transform: translateX(0px);
          }

          .content[data-type="1"] {
            transform: translateX(-140px);
          }

          .remove {
            position: absolute;
            width: 140px;
            height: 140px;
            background: #ff6419;
            right: 0;
            top: 0;
            color: #fff;
            text-align: center;
            font-family: PingFang-SC-Medium;
            font-size: 32px;
            line-height: 140px;
          }
        }

        
      }
      .noslider {
          height: 140px;
          line-height: 140px;
          color: #999;
          font-size: 0px;
        }
    }

    .noMess {
      height: 100%;

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

    @at-root .system {

      @at-root #{&}__message {

        @at-root #{&}--item {
          padding: 20px 30px;
          margin: 20px 0;
          background-color: #fff;
          font-size: 30px;
        }

        @at-root #{&}--top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 36px;
        }

        @at-root #{&}--time {
          font-size: 20px;
          color: #999;
        }

        @at-root #{&}--bottom {
          margin-bottom: 15px;
          font-size: 24px;
          color: #999;
        }

        @at-root #{&}--cs {
          color: #ff6419;
        }
      }
    }

    @at-root .empty {

      @at-root #{&}__sysMsg {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin-top: 20px;
        background-color: #fff;
      }

      @at-root #{&}__icon {
        width: 180px;
        height: 180px;
        margin: -100px 0 40px;
        background-image: url(../images/empty_system_msg.png);
        background-repeat: no-repeat;
        background-size: contain;
      }

      @at-root #{&}__text {
        font-size: 22px;
        color: #aaa;
      }
    }
  }

</style>
