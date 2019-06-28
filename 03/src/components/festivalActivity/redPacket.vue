<template>
     <div class='red-packet' id='red-packet'>
        <!-- 规则说明按钮 -->
        <div class='explain-btn' @click='explain("explain")'>活动规则</div>
        <!-- 活动规则 -->
        <popUpBox :popUpObj='popUpObj' @shut='shut' v-if='isPopUpBox'></popUpBox>
        <!-- 顶图 -->
        <div class='poster'></div>
        <!-- 红包列表框 -->
        <div class='content'>
            <div class='title'></div>
            <div class='hint-text'>每签到3次可以抽取2019元现金大奖</div>
            <div class='red-packet-list'>
                <div class='item'
                        v-for='(item, index) in redPacketList'
                        :key='index'
                        :class='index == 0 || index == 7 ? "" : "left"'>
                    <div :class='item.state' class="item-img"></div>
                    <div class='icon' v-if='item.haveLotteryChance && item.haveLotteryChance == 1'>抽奖</div>
                    <div :class='date-item.signinDay == 0?"date-color":"date"'>{{date-item.signinDay == 0 ? '今天' : item.signinDay}}</div>
                </div>
            </div>
            <div class='red-packet-btn' :class='redPacket.isSignIn == 1 ?"font-color":""' @click='getsignIn("redPacket")'>
                {{redPacket.isSignIn == 1 ? '今日已经签到，记得明天再来哦' : '立即签到拆红包'}}
            </div>
        </div>
     </div>
</template>

<script>
    import popUpBox from '@/components/festivalActivity/pop-up-box';
    import festivalActivity from "@/mixin/festivalActivity"
    export default {
        name: "redPacket",
        mixins:[festivalActivity],
        components:{
            popUpBox
        },
        data() {
            return {
                popUpObj: {},
                isPopUpBox: false,
                redPacketList: [],
                dateIndex: '',
                redPacket: {},
                date: new Date().getDate()
            }
        },
        mounted() {
            this.getUserSignInRecordList();
        },
        created() {

        },
        methods: {
            shut() {
                // type ? this.popUpType = type : null
                this.isPopUpBox = !this.isPopUpBox
                this.isPopUpBox ? this.stop() : this.move();
            },
            explain(type) {
                this.popUpObj = {popUpType: type}
                this.shut()
            },
            /**签到领红包 */
            getsignIn(type) {
                if (this.redPacketList[this.dateIndex].receiveStatus && this.redPacketList[this.dateIndex].receiveStatus == 1) {
                    // this.popUpObj = {
                    //     popUpType: type,
                    //     title: '今日已经签到过了',
                    //     text: '记得明天在来哦~'
                    // }
                    // this.shut()
                    return
                }
                this.API.getsignIn({activityId: this.urlParams.activityId}).then(res => {
                    console.log(res);
                    if (res.success) {
                        this.popUpObj = {
                            popUpType: type,
                            price: res.obj.redPacketAmount,
                            haveLotteryChance: res.obj.haveLotteryChance,
                            text: '已存入微信钱包'
                        }
                        this.getUserSignInRecordList()
                        this.shut()
                    } else {
                        // this.$toast(res.message)
                        this.popUpObj = {
                            popUpType: type,
                            title: res.message,
                            text: '记得明天再来哦~'
                        }
                        this.shut()
                    }
                })
            },
            /**获取签到列表 */
            getUserSignInRecordList() {
                this.API.getUserSignInRecordList({activityId: this.urlParams.activityId}).then(res => {
                    this.redPacketList = res.datalist.slice(0, 14)
                    this.redPacketList.forEach((item, index) => {if (item.signinDay == this.date) {
                        this.dateIndex = index
                        this.redPacket = item
                    }})
                    this.redPacketList.forEach((item, index) => {
                        if (index - this.dateIndex < 0 && (!item.receiveStatus || item.receiveStatus == 0)) {
                            console.log('过期未领取')
                            item.state = 'one'
                        }
                        if (index - this.dateIndex < 0 && (item.receiveStatus && item.receiveStatus == 1)) {
                            console.log('过期已领取')
                             item.state = 'two'
                        }
                        if (index - this.dateIndex == 0 && (!item.receiveStatus || item.receiveStatus == 0)) {
                            console.log('今天未领取')
                             item.state = 'four'
                        }
                        if (index - this.dateIndex == 0 && (item.receiveStatus && item.receiveStatus == 1)) {
                            console.log('今天已领取')
                             item.state = 'three'
                        }
                        if (index - this.dateIndex > 0) {
                            console.log('时机还未成熟')
                             item.state = 'five'
                        }
                     })
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .red-packet{
        overflow: hidden;
        .explain-btn{
            position: absolute;
            top: 420px;
            right: 0;
            z-index: 10;
            width: 56px;
            height: 140px;
            line-height: 28px;
            padding: 15px 14px 0 16px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            color: #d4283e;
            background-color: #ffcc99;
            border-radius: 20px 0px 0px 20px;
        }
        .poster{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 657px;
            background-image: url('/static/image/year/spring_banner.png');
            background-size: cover;
            z-index: 9;
        }
        .content{
            width: 710px;
            height: 600px;
            // margin-top: 600px;
            margin: 600px auto 40px;
            background-image: url('/static/image/year/spring_bg.png');
            background-size: 100% 100%;
            overflow: hidden;
            .title{
                width: 334px;
	            height: 47px;
                margin: 40px auto 0;
                background-image: url('/static/image/year/spring_title_01.png');
                background-size: cover;
            }
            .hint-text{
                margin: 20px auto 20px;
                font-size: 28px;
                color: #99827a;
                text-align: center;
            }
            .red-packet-list{
                width: 660px;
                margin: 0 auto;
                padding: 10px 5px;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                .left{
                    margin-left: 43px;
                }
                .item{
                    position: relative;
                    margin-bottom: 30px;
                    .item-img{
                        width: 56px;
                        height: 64px;
                        border-radius: 10px;
                        background-size: cover;
                    }
                    .icon{
                        position: absolute;
                        top: -5px;
                        right: -30px;
                        width: 56px;
                        line-height: 30px;
                        font-size: 20px;
                        border-radius:  15px 15px 15px 0;
                        text-align: center;
                        background-color: #c22f3d;
                        color: #fff;
                    }
                    .one{
                         background-image: url('/static/image/year/spring_redbag_01.png');
                    }
                    .two{
                         background-image: url('/static/image/year/spring_redbag_02.png');
                    }
                    .three{
                         background-image: url('/static/image/year/spring_redbag_03.png');
                    }
                    .four{
                         background-image: url('/static/image/year/spring_redbag_04.png');
                    }
                    .five{
                         background-image: url('/static/image/year/spring_redbag_05.png');
                    }
                    .date{
                        margin-top: 15px;
                        font-size: 24px;
                        font-weight: bold;
                        color: #99827a;
                        text-align: center;
                    }
                    .date-color{
                        color: #c22f3d;
                        margin-top: 15px;
                        font-size: 24px;
                        font-weight: bold;
                        text-align: center;
                    }
                }
            }
            .red-packet-btn{
                width: 480px;
                height: 88px;
                line-height: 88px;
                margin: 0 auto;
                font-size: 32px;
                text-align: center;
              background-image: linear-gradient(180deg,
                #ffbf7f 0%,
                #f59f49 100%),
              linear-gradient(
                  #d4283e,
                  #d4283e);
              background-blend-mode: normal,
              normal;
              box-shadow: 0px 10px 20px 0px
              rgba(248, 169, 89, 0.4);
              border-radius: 44px;
                color: #c22f3d;
                &:active{
                    background-color: #b63233;
                }
            }
            .font-color{
               opacity: 0.4;
               color: #fff;
            }
        }
    }

</style>
