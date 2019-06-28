<template>
  <div class="chat">
    <header>
      <i class="icon-left" @click="$router.back()"></i>
      <div class="title">{{friendName}}</div>
    </header>
    <div class="advbox" v-if="fromWhere==2">
      <div class="adv">
        <div class="title">{{supplyDemandInfo.title?supplyDemandInfo.title:'该供求信息已下架或删除！'}}</div>
        <div class="tit"><span class="mr73" v-if="supplyDemandInfo.gmtModified">发布时间：{{supplyDemandInfo.gmtModified}}</span>　　　<span
            v-if="supplyDemandInfo.viewNum">浏览：{{supplyDemandInfo.viewNum}}</span></div>
      </div>
    </div>
    <div class="inpu-box">
      <div class="inpu_head">
        <input type="text" class="inpu" @focus="InFocus" @blur="InBulr" v-model="inpuValue">
        <span class="send" v-if="inpuValueShow" @click="send">发送</span>
        <img class="sendImg" v-else src="./images/photo@2x.png" @click="openImg" alt="">
        <input type="file" ref="headPic" style="display: none;" @change="uploadPic($refs.headPic.files.item(0))" accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp"
          class="file">
      </div>
      <div class="inpu_img" v-show="(!isInpuValue)&&imgBoxShow">
        <div class="wrapper" ref="imgScroll">
          <div class="wrapper_box" ref="imgboxcontent">
            <div class="img-box" v-for="(item, index) in sendImgs" :key="index" ref="imgitem">
              <img :src="item" alt="">
              <img class="img_del" @click="delImg(index)" src="./images/pic_icon_delete.png" alt="">
            </div>
            <div id="imgLast"></div>
          </div>
        </div>
        <div class="inpu_but">
          <span class="imgSp" @click="openImg" v-if="sendImgs.length<9">相册</span>
          <span class="imgSp" v-else style="color:#666">相册</span>
          <span class="imgBut" v-if="sendImgs.length>0" @click="sendImg">发送</span>
        </div>
      </div>

    </div>
    <div class="bscroll" ref="bscroll">
      <div class="box" :style="fromWhere==2?'padding-top:2.5rem;':'',imgBoxShow?'padding-bottom:5rem;':'padding-bottom:2rem;'">
        <div class="silder" v-for="(item, index) in chatMessage" v-cloak :key="index">
          <div class="time" v-show="item.showTime">
            {{item.time}}
          </div>
          <div class="messbox" v-if="item.msgType==0">
            <div class="con">
              <img class="port" src="../../images/headpic.png" :style="item.direction!=1?'float:left;':'float:right;'">
              <div class="mess" :style="item.direction!=1?'background: #fff;float:left;color:#333;margin-left:15px;':'background: #ff7634;float:right;color:#fff;margin-right:15px;'">
                {{item.msgBody}}
                <span class="mess_left" v-if="item.direction!=1"></span>
                <span class="mess_right" v-else></span>
              </div>
            </div>
          </div>
          <div class="messImg" v-else-if="item.msgType==1">
            <div class="img_con">
              <img class="port" src="../../images/headpic.png" :style="item.direction!=1?'float:left;':'float:right;'">
              <div class="imgBox" :style="item.direction!=1?'float:left;margin-left:15px;':'float:right;margin-right:15px;'" v-if="item.msgBody!='发送方不在线'">
                <img class="msgImg" @click.self="imgPreSrc=item.msgBody;imgPreShow= true;" :src="item.msgBody | filterImg" ref="msgImgItem" alt="">
              </div>
              <div class="mess" v-else :style="item.direction!=1?'background: #fff;float:left;color:#333;margin-left:15px;':'background: #ff7634;float:right;color:#fff;margin-right:15px;'">
                {{item.msgBody}}
                <span class="mess_left" v-if="item.direction!=1"></span>
                <span class="mess_right" v-else></span>
              </div>
            </div>
          </div>
          <div class="messbox" v-else-if="item.msgType==4">
            <div class="con">
              <img class="port" src="../../images/headpic.png" :style="item.direction!=1?'float:left;':'float:right;'">
              <div class="mess" :style="item.direction!=1?'background: #fff;float:left;color:#333;margin-left:15px;':'background: #ff7634;float:right;color:#fff;margin-right:15px;'">
                收到一个户型，请在PC端查看
                <span class="mess_left" v-if="item.direction!=1"></span>
                <span class="mess_right" v-else></span>
              </div>
            </div>
          </div>
          <div class="messbox" v-else>
            <div class="con">
              <img class="port" src="../../images/headpic.png" :style="item.direction!=1?'float:left;':'float:right;'">
              <div class="mess" :style="item.direction!=1?'background: #fff;float:left;color:#333;margin-left:15px;':'background: #ff7634;float:right;color:#fff;margin-right:15px;'">
                收到一个方案，请在PC端查看
                <span class="mess_left" v-if="item.direction!=1"></span>
                <span class="mess_right" v-else></span>
              </div>
            </div>
          </div>
        </div>
        <div id="footer"></div>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
    <div class="imgPre" v-if="imgPreShow" @click="imgPreShow = false">
      <div class="preBox">
        <img :src="imgPreSrc | filterImg" alt="">
      </div>
    </div>
    <select-upload-pic v-if="showUploadType" :showUploadTypeStatus.sync="showUploadType" @selectedPic="uploadPic"
      @noSelImg="noSelImg"></select-upload-pic>
  </div>
</template>
<script>
  import mixins from '@/mixins/mixin';
  let scrollInterval;
  import BScroll from 'better-scroll';
  import selectUploadPic from 'components/SelectUploadPic/index.vue';
  import transformIMG from 'utils/transformUploadImg';
  import {
    uploaduserpic
  } from '@/api/user';
  import {
    getAllSupplyDemandInfo,
    addsupplydemandviewnum
  } from "@/api/home";
  import {
    mapGetters,
    mapActions
  } from "Vuex";
  import {
    adduserprivatemessage,
    getprivatemessageinfolist
  } from "@/api/user";
  import {
    setTimeout,
    setInterval,
    clearInterval
  } from 'timers';
  export default {
    mixins: [mixins],
    components: {
			selectUploadPic
		},
    data() {
      return {
        showUploadType: false,
        type: 1,
        friendid: 0,
        inpuValue: '',
        friendName: '',
        imgBoxShow: false,
        Messages: {
          pageSize: 20,
          pageNum: 1
        },
        supplyDemandInfo: {},
        sendImgs: [],
        sendRecsImg: [],
        // 图片预览
        imgPreShow: false,
        imgPreSrc:'',
        inpuValueShow: false
      };
    },
    watch: {
      chatMessage(val) {
        this.aBScroll.refresh();
        this.aBScroll.scrollToElement(document.getElementById(`footer`), 1);
      },
    },
    computed: {
      ...mapGetters('common', ['userInfo']),
      ...mapGetters('socket', ['fromWhere', 'relatedObj', 'chatMessage']),
      ...mapGetters("user", {
        friendId: "friendId"
      }),
      isInpuValue() {
        if (this.inpuValue != '') {
          this.inpuValueShow = true;
          return true;
        } else {
          this.inpuValueShow = false;
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        let bscrollDom = this.$refs.bscroll;
        this.aBScroll = new BScroll(bscrollDom, {
          probeType: 2,
          click: true
        });
        setTimeout(() => {
          this.aBScroll.refresh();
          this.aBScroll.scrollToElement(document.getElementById(`footer`), 1);
        }, 100)
        this.aBScroll.on('touchend', (pos) => {
          if (pos.y > 50) {
            this.Messages.pageNum++;
            this.getHistoryMsgList(true);
          }
        })
      })
    },
    created() {
      //this.aBScroll.refresh();
      scrollInterval = setInterval(() => {
        this.aBScroll.refresh();
        // this.aBScroll.scrollToElement(document.getElementById(`footer`),1);
      }, 2000)
      this.friendName = this.friendId.friendName; // 顶部标题

      this.Messages.contactSessionId = this.relatedObj.contactSessionId;
      this.Messages.relatedObjType = this.fromWhere;
      this.Messages.relatedObjId = this.relatedObj.relatedObjId;
      this.getHistoryMsgList(false); // 获取历史聊天记录
      //  上报位置
      var locMessage = {
        appId: 1,
        userSessionId: JSON.parse(localStorage.getItem('userInfo')).sessionId,
        loc: this.fromWhere, // 从店铺进来为1，从供求为2
        relatedObjType: this.fromWhere, // 从店铺进来为1，从供求为2
        relatedObjId: this.relatedObj.relatedObjId, // 供求或店铺ID
        contactSessionId: this.relatedObj.contactSessionId // 对方的id
      }
      this.$socket.emit('im_loc_msg_event', locMessage); // 上报位置事件

      // 重置消息为已读
      this.setHaveRead();
      // 获取供求详情
      if (this.fromWhere == 2) {
        getAllSupplyDemandInfo({
          supplyDemandId: this.relatedObj.relatedObjId
        }).then(
          res => {
            if (res.status) {
              this.supplyDemandInfo = res.obj[0];
              this.supplyDemandInfo.gmtModified = this.supplyDemandInfo.gmtModified.substr(0, 10);
            }
          }
        );
      }

    },
    beforeDestroy() {
      var locMessage = {
        appId: 1,
        userSessionId: JSON.parse(localStorage.getItem('userInfo')).sessionId,
        loc: 3
      }
      this.$socket.emit('im_loc_msg_event', locMessage);
      this.setChatMessage('setNull');
      clearInterval(scrollInterval);
    },
    methods: {
      ...mapActions('socket', ['setChatMessage']),
      ...mapActions("user", [
        "queryPrivateMessageInfoList",
        "setFriendId",
        "setMessage",
        "queryAdduserPrivateMessage"
      ]),
      InFocus() {
        this.imgBoxShow = false;
      },
      InBulr() {
       if(this.sendImgs.length>0) {
         this.imgBoxShow = true;
       }
      },
      // 初始化图片选择scroll
      InitTabScroll(type) {
        let width = 0
        for (let i = 0; i < this.sendImgs.length; i++) {
          width += (this.$refs.imgitem[0].getBoundingClientRect().width?this.$refs.imgitem[0].getBoundingClientRect().width:90);
        }
        if (this.$refs.imgitem.length >= 2) {
          this.$refs.imgboxcontent.style.width = width + 110 + 'px';
        } else {
          this.$refs.imgboxcontent.style.width = 320 + 'px';
        }
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.imgScroll, {
              startX: 0,
              click: false,
              scrollX: true,
              scrollY: false,
              eventPassthrough: 'vertical'
            })
          } else {
            this.scroll.refresh();
            this.scroll.scrollToElement(document.getElementById(`imgLast`),200);
          }
        })
      },
      // 用户打开相册，但没有拍照或选择照片
      noSelImg() {
        console.log(1);
        if(this.sendImgs.length==0) {
          this.imgBoxShow = false;
        }
      },
      // 删除图片
      delImg(index) {
        this.sendImgs.splice(index, 1);
        this.sendRecsImg.splice(index, 1);
        if (this.sendImgs.length == 0) {
          this.imgBoxShow = false;
        }
       this.InitTabScroll();
      },
      // 打开相册
      openImg() {
        this.imgBoxShow = true;
        if (navigator.camera) {
          return this.showUploadType = true;
        };
        this.$refs.headPic.click();
        setTimeout(() => {
          this.aBScroll.refresh();
          this.aBScroll.scrollToElement(document.getElementById(`footer`), 1);
        }, 100)
      },
      async uploadPic(file) {
        !navigator.camera && (this.$refs.headPic.type = 'text');
        let data = await transformIMG(file);
        data && this.uploadHeadPic(data);
        !navigator.camera && (this.$refs.headPic.type = 'file');
      },
      uploadHeadPic({
        file,
        fileName
      }) {
        let formData = new FormData();
        formData.append('file', file, fileName);
        formData.append('type', 'image');
        try {
          this.API.uploadMessImg(formData).then(res => {
          if (res.resultCode == "SUCCESS") {
            this.sendImgs.push(URL.createObjectURL(file));
            this.sendRecsImg.push(res.data.picPath);
            this.InitTabScroll();
          } else {
            this.$toast('请选择有效图片！');
          }
        })
        }catch(e) {
          this.$toast('请选择有效图片！');
        }
      },
      // 发送图片消息
      sendImg() {
        this.sendRecsImg.map(item => {
          var chatMessage = {
            fromAppId: 1,
            fromUserSessionId: JSON.parse(localStorage.getItem('userInfo')).sessionId,
            toUserSessionId: this.relatedObj.contactSessionId,
            msgBody: item,
            relatedObjType: this.fromWhere,
            relatedObjId: this.relatedObj.relatedObjId,
            relatedObjOwnerSessionId: this.relatedObj.contactSessionId,
            msgType: 1
          }
          this.$socket.emit('im_chat_msg_event', chatMessage);
          let sliderItem = {
            direction: 1,
            fromUserName: JSON.parse(localStorage.getItem('userInfo')).userName,
            msgBody: item,
            time: '',
            toUserName: this.friendName,
            msgType: 1
          }
          if (this.chatMessage.length == 0) {
            let date = new Date();
            let h = date.getHours();
            let min = date.getMinutes();
            sliderItem.time = h + ':' + (min >= 10 ? min : '0' + min);
            sliderItem.showTime = true;
          }
          let data = {
            item: sliderItem,
            isPullup: false
          }
          this.setChatMessage(data);
          this.sendImgs = [];
          this.sendRecsImg = [];
          this.InitTabScroll();
          this.imgBoxShow = false;
          setTimeout(() => {
            this.aBScroll.refresh();
            this.aBScroll.scrollToElement(document.getElementById(`footer`), 200);
          }, 100)
        })
      },
      // 发送文本的消息
      send() {
        if (!this.inpuValue) return;
        var chatMessage = {
          fromAppId: 1,
          fromUserSessionId: JSON.parse(localStorage.getItem('userInfo')).sessionId,
          toUserSessionId: this.relatedObj.contactSessionId,
          msgBody: this.inpuValue,
          relatedObjType: this.fromWhere,
          relatedObjId: this.relatedObj.relatedObjId,
          relatedObjOwnerSessionId: this.relatedObj.contactSessionId,
          msgType: 0
        }
        this.$socket.emit('im_chat_msg_event', chatMessage);
        let sliderItem = {
          direction: 1,
          fromUserName: JSON.parse(localStorage.getItem('userInfo')).userName,
          msgBody: this.inpuValue,
          time: '',
          toUserName: this.friendName,
          msgType: 0
        }
        if (this.chatMessage.length == 0) {
          let date = new Date();
          let h = date.getHours();
          let min = date.getMinutes();
          sliderItem.time = h + ':' + (min >= 10 ? min : '0' + min);
          sliderItem.showTime = true;
        }
        let data = {
          item: sliderItem,
          isPullup: false
        }
        this.setChatMessage(data);
        this.inpuValue = '';
        this.inpuValueShow = false;
        if(this.sendImgs.length>0) {
          this.imgBoxShow = true;
        }else {
          this.imgBoxShow = false;
        }
        setTimeout(() => {
          this.aBScroll.refresh();
          this.aBScroll.scrollToElement(document.getElementById(`footer`), 200);
        }, 100)
      },
      getHistoryMsgList(isPullup) { // 获取历史聊天记录, isPullup判断是否为下拉刷新动作，用于加载更多聊天记录
        this.API.historyMsgList(this.Messages).then(res => {
          if (res.resultCode == 'SUCCESS' && res.data.list.length > 0) {
            let chatList = [];
            if (isPullup) {
              chatList = res.data.list;
              chatList.map((item, index) => {
                if (index == chatList.length - 1) {
                  item.showTime = true;
                } else {
                  item.showTime = false;
                }
              })
            } else {
              chatList = res.data.list.reverse();
              chatList.map((item, index) => {
                if (index == 0) {
                  item.showTime = true;
                } else {
                  item.showTime = false;
                }
              })
            }
            chatList.map((item, index) => {
              let data = {
                item: item,
                isPullup: isPullup
              }
              this.setChatMessage(data);
            })
          } else if (res.resultCode == 'SUCCESS' && res.data.list.length == 0) {
            if (isPullup) {
              this.$toast('没有更多消息!');
            }
          } else {
            this.setChatMessage('setNull');
          }
        })
      },
      setHaveRead() { // 重置消息为已读
        this.API.resetUnreadMsg(this.relatedObj.contactSessionId, this.fromWhere, this.relatedObj.relatedObjId)
      }
    }
  };

</script>
<style lang="scss" scoped>
  @import "../../../../styles/header.scss";
  @import './styles/chat.scss'

</style>
