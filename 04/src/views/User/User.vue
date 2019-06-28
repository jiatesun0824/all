<template>
  <div class="user">
     <div class="header">
         <img class="cimg" @click="checkout" src="./images/mine_icon_setting.png">
         <!-- <div class="port">
             <img @click.stop="set" class="portimg" :src="userInfo.userPic ? (userInfo.resourcesUrl+userInfo.userPic) : require('./images/headpic.png')">
         </div>
         <div class="phonebox">
             <span class="phone">{{userInfo.loginPhone}}</span>
         </div>
         <div class="integralbox" @click="account">
            <span class="integral">{{integral}}</span>
            <span class="integral_tit">度币</span>
            <img  class="integral_icon" src="./images/mine_icon_more.png">
         </div> -->
         <div class="info">
            <img @click.stop="set" class="leftportimg" :src="userInfo.userPic ? (userInfo.resourcesUrl+userInfo.userPic) : require('./images/headpic.png')">
            <div class="leftinfo">
              <div class="line1">
                 <span class="phone">{{userInfo.loginPhone}}</span><span v-if="userInfo.userType==11" class="status" @click="$router.push('/ia')">{{checkStatus}}</span>
              </div>
              <!-- appStore审核专用判断 -->
              <div class="line2" v-if="userInfo.loginPhone != 13713539354">
                 <div class="leftintegralbox"  @click="account">
                    <span class="integral">{{integral}}</span>
                    <span class="integral_tit">度币</span>
                    <img  class="integral_icon" src="./images/mine_icon_more.png">
                 </div>
              </div>
            </div>
         </div>
     </div>
     <div class="line"></div>
     <div class="main">
         <div class="item" @click="issue" v-if="userInfo.userType/1!=11">
             <div class="item_imgbox">
                 <img  class="item_img" src="./images/mine_icon_release.png">
             </div>
             <div class="item_tit">我的发布</div>
         </div>
         <div class="item" @click="invite" v-if="userInfo.userType/1===11">
             <div class="item_imgbox">
                 <img  class="item_img" src="./images/mine_icon_invite.png">
             </div>
             <div class="item_tit">我的邀请</div>
         </div>
          <div class="item mr0" @click="message">
             <div class="item_imgbox">
                 <span v-if="haveStystemUnRead" class="redDot"></span>
                 <span v-if="haveUnRead" class="redDot"></span>
                 <img  class="item_img" src="./images/mine_icon_news.png">
             </div>
             <div class="item_tit">我的消息</div>
         </div>
         <div class="item mr0" @click="wallet" v-if="userInfo.userType/1===11">
             <div class="item_imgbox">
                 <img  class="item_img" src="./images/mine_icon_wallet.png">
             </div>
             <div class="item_tit">我的钱包</div>
         </div>
          <div class="item mr0" @click="collect">
             <div class="item_imgbox">
                 <img  class="item_img" src="./images/mine_icon_collect.png">
             </div>
             <div class="item_tit">我的收藏</div>
         </div>
         <div class="item" @click="replace">
             <div class="item_imgbox">
                 <img  class="item_img" src="./images/mine_icon_task.png">
             </div>
             <div class="item_tit">我的方案</div>
         </div>
         <div class="item" @click="myModule" v-if="userInfo.userType/1!=11">
             <div class="item_imgbox">
                 <img  class="item_img" src="../../../static/images/mine_icon_House type.png">
             </div>
             <div class="item_tit">我的户型</div>
         </div>
         <div class="item" @click="feedback">
             <div class="item_imgbox">
                 <img  class="item_img" src="./images/mine_icon_help.png">
             </div>
             <div class="item_tit">意见反馈</div>
         </div>
         <div class="item" @click="busCard" v-if="cardShow">
             <div class="item_imgbox">
                 <img  class="item_img" src="./images/mine-icon-card.png">
             </div>
             <div class="item_tit">我的名片</div>
         </div>
     </div>
     <router-view></router-view>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'Vuex';
import { getUserBalance } from 'api/account';
import { check, checkinfo, reCheck, isauthorize } from '@/api/check';
export default {
  inject:['reFresh'],
  data() {
    return {
      integral: 0,
      checkStatus: '',
      cardShow: false
    };
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    ...mapGetters('socket', ['haveUnRead', 'haveStystemUnRead'])
  },
  methods: {
    ...mapActions('socket', ['setUnRead', 'setChatMessage', 'sethaveStystemUnRead', 'setCardComeNUm', 'setCardOptNum']),
    // 检验用户有名片权限
    checKCard() {
      // this.reFresh();  刷新当前路由
      this.API.checkUserHaveUserCard().then(res=> {
        if(res.success&&res.obj==1) {
          this.cardShow = true;
        }else {
          this.cardShow = false;
        }
      })
    },
    // 检验中介是否认证
    cCheck() {
				isauthorize().then(res=> {
						this.checkStatus = res.message;
				})
			},
    // 获取用户度币数
    _getIntegral() {
      let userName = this.userInfo.mobile;
      let pwd = localStorage.getItem('pwd');
      getUserBalance({
        account: userName,
        password: pwd
      }).then(res => {
        if (res.status) {
          this.integral = Math.floor(res.obj.balanceIntegral).toString();
        }
      });
    },
    updateNewMsg() {
        // 更新我的消息状态 （是否有新消息）
        this.API.personalNewsIsRead({
          userId: JSON.parse(localStorage.getItem('userInfo')).id
        }).then(res => {
          if (res) {
            if (res.obj != 0) {
              this.sethaveStystemUnRead(true)
            } else {
              this.sethaveStystemUnRead(false)
            }
          }
        });
      },
    // 去名片
    busCard() {
      this.$router.push("/busCard");
    },
    // 去意见反馈
    feedback() {
        this.$router.push("/feedback");
      },
    //   去度币
    account() {
      this.$router.push("/account");
    },
    //   去戶型
    myModule() {
      this.$router.push("/myModule");
    },
    // 去发布
    issue() {
      this.$router.push("/user/issue");
    },
    // 去钱包
    wallet() {
      this.$router.push("/user/wallet");
    },
    // 去设置
    set() {
      this.$router.push("/user/set");
    },
    // 去邀请
    invite() {
      this.$router.push("/user/invite");
    },
    // 去留言
    message() {
      this.$router.push("/user/message");
    },
    // 去收藏
    collect() {
      this.$router.push("/collect");
    },
    // 去收藏
    replace() {
      this.$router.push("/replace");
    },
    // 去退出
    checkout() {
      this.$router.push("/checkout");
    }
  },
  socket() {

  },
  created() {
    this._getIntegral();
    this.cCheck();
    this.checKCard();
  },
  activated() {
    this._getIntegral();
    this.cCheck();
    this.updateNewMsg();
    this.checKCard();
  }
};
</script>
<style lang="scss" scoped>
.user {
  width: 100%;
  height: 100%;
  .header {
    height: 368px;
    padding-top: 73px;
    box-sizing: border-box;
    position: relative;
    background-image: url("./images/mine_bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .cimg {
      position: absolute;
      top: 30px;
      right: 50px;
      width: 44px;
      height: 44px;
    }
    .port {
      text-align: center;
      margin-bottom: 20px;
      .portimg {
        width: 148px;
        height: 148px;
        border-radius: 50%;
      }
    }
    .phonebox {
      text-align: center;
      margin-top: 20px;
      margin-bottom: 28px;
      .phone {
        font-size: 32px;
        font-family: PingFang-SC-Medium;
        color: #333;
      }
    }
    .integralbox {
      text-align: center;
      .integral {
        color: #ff662e;
        font-size: 40px;
        font-family: PingFang-SC-Medium;
        vertical-align: middle;
      }
      .integral_tit {
        color: #999;
        font-size: 28px;
        font-family: PingFang-SC-Medium;
        vertical-align: middle;
      }
      .integral_icon {
        width: 28px;
        height: 28px;
        background: #c2c2c2;
        vertical-align: middle;
        border-radius: 50%;
      }
    }
    .info {
      padding-top: 62px;
      padding-left: 80px;
      .leftportimg {
        width: 148px;
        height: 148px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 50px;
      }
      .leftinfo {
        vertical-align: middle;
        display: inline-block;
        .line1 {
          margin-bottom: 28px;
          line-height: 40px;
          .phone {
              font-size: 32px;
              font-family: PingFang-SC-Medium;
              color: #333;
          }
          .status {
            margin-left: 40px;
            display: inline-block;
            padding: 0 10px;
            height: 40px;
            line-height: 45px;
            color: #fff;
            font-size: 24px;
            text-align: center;
            background-image: linear-gradient(-90deg, 
              #ff6e2e 0%, 
              #f7b456 100%), 
            linear-gradient(
              #ff6419, 
              #ff6419);
            background-blend-mode: normal, 
              normal;
            box-shadow: 0px 4px 7px 0px 
              rgba(255, 110, 46, 0.38);
            border-radius: 20px;
          }
        }
        .line2 {
          .leftintegralbox {
            .integral {
              color: #ff662e;
              font-size: 40px;
              font-family: PingFang-SC-Medium;
              vertical-align: middle;
            }
            .integral_tit {
              color: #999;
              font-size: 28px;
              font-family: PingFang-SC-Medium;
              vertical-align: middle;
            }
            .integral_icon {
              width: 28px;
              height: 28px;
              background: #c2c2c2;
              vertical-align: middle;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
  .line {
    height: 30px;
    background: #f5f5f5;
  }
  .main {
    overflow: hidden;
    background: #fff;
    padding: 73px 43px;
    padding-bottom: 33px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .item {
      width: 33%;
      margin-bottom: 40px;
      .item_imgbox {
        text-align: center;
        margin-bottom: 30px;
        position: relative;
        .redDot {
          position: absolute;
          width: 20px;
          height: 20px;
          left: 60%;
          top: 0;
          border-radius: 50%;
          background: red;
        }
        .item_img {
          width: 100px;
          height: 100px;
        }
      }
      .item_tit {
        font-size: 28px;
        color: #333;
        font-family: PingFang-SC-Medium;
        text-align: center;
      }
    }
  }
}
</style>
