<template>
    <div class='award' id='award'>
        <popUpBox :popUpObj='popUpObj' @shut='shut' v-if='isPopUpBox'></popUpBox>
        <div class='title'></div>
        <div class='text'>每签到3次可获得一次抽奖机会，去<a href="#red-packet">签到</a></div>
        <!-- 抽奖框 -->
        <div class='award-box'>
            <div class='contetn-box'>
                <div :class='(item.active == 0 || item.active == active || index == 4)?"item-box-active":"item-box"'
                        v-for='(item, index) in awardList'
                        :key='index'>
                    <img class='item-content' :src='item.prizeImg' v-if='index != 4'>
                    <!-- <div class='item-content-text'>{{item.prizeName}}</div> -->
                    <div class='item-content-text' v-if='index == 4' @click='getLottery'>{{item.prizeName}}</div>
                </div>
            </div>
        </div>
        <div class='time'>
            已签到
            <b>{{awardData.signInCount}}</b
            >次，剩余
            <b>{{awardData.lotteryRemainCount}}</b>
            次抽奖机会
            <div class='btn' @click='record("record")'>中奖记录</div>
        </div>
        <div class='probability-box'>
            <p>你目前的中奖概率为{{awardData.lotteryRate}}%<br>体验【装修我家】和【产品替换】可提升中奖概率</p>
            <div class='probability-btn' @click='go720'>立即体验</div>
        </div>
        <div class='footer'>
            如有疑问，请添加客服微信(suixuanwang001)咨询，<button v-clipboard:copy="'suixuanwang001'" v-clipboard:success="copy">点击复制</button>
        </div>
    </div>
</template>

<script>
    import popUpBox from '@/components/festivalActivity/pop-up-box';
    import festivalActivity from "@/mixin/festivalActivity"
    import { mapMutations } from 'vuex'
    export default {
        name: "award",
        mixins:[festivalActivity],
        components:{ popUpBox },
        data() {
            return {
                popUpObj: {},
                isPopUpBox: false,
                awardList: [],
                recordList: [],
                award: {text: '2019元现金'},
                active: 0,
                isaward: true,
                // awardData: {}
            }
        },
        mounted() {
            this.init();
        },
        created() {
        },
        methods: {
          ...mapMutations(['setAward']),
            shut() {
                this.isPopUpBox = !this.isPopUpBox
                this.isPopUpBox ? this.stop() : this.move();
            },
            /**数据初始化 */
            init() {
                //抽奖转盘列表
                this.API.getAwardList({
                    actId: this.urlParams.wheelId // 转盘id
                }).then(res => {
                    if (res.success && res.datalist) {
                        this.awardList = res.datalist
                        this.awardList.splice(4,0,{prizeName: '立即抽奖'})
                        this.awardList.forEach((item, index) => {
                            switch (index) {
                                case 0: item.active = 1; break;
                                case 1: item.active = 2; break;
                                case 2: item.active = 3; break;
                                case 3: item.active = 8; break;
                                case 4: item.active = 0; break;
                                case 5: item.active = 4; break;
                                case 6: item.active = 7; break;
                                case 7: item.active = 6; break;
                                case 8: item.active = 5; break;
                            }
                        })
                    }
                    if (res.message == '活动已结束') {
                         this.popUpObj = {
                            popUpType: 'finish',
                            title: '您来晚啦',
                            text: '—— 活动已结束 ——',
                            btnText: '前去体验'
                        }
                        this.shut()
                    }
                })
                //中奖纪录列表
                this.API.getPrizeList({
                   actId: this.urlParams.wheelId, // 活动id
                   pageNum: 1,
                   pageSize: 10
                }).then(res => {
                    if (res.datalist) {
                        this.recordList = res.datalist
                    }
                })
                // 用户参加抽奖信息
                this.setAwardData({vm: this})
                // this.API.getLotteryWheelNeedData({activityId: this.urlParams.activityId}).then(res => {
                //     if (res.obj) {
                //         this.awardData = res.obj
                //     }
                // })
            },
            /**查看中奖纪录 */
            record(type) {
                this.API.getPrizeList({
                   actId: this.urlParams.wheelId, // 活动id
                   pageNum: 1,
                   pageSize: 10
                }).then(res => {
                    if (res.datalist) {
                        this.recordList = res.datalist
                         this.popUpObj = {
                            popUpType: type,
                            recordList:  this.recordList
                        }
                        this.shut()
                    }
                })

            },
            /**抽奖 */
            getLottery() {
                if (!this.isaward || this.awardData.lotteryRemainCount < 1) {
                    this.$toast('您目前没有抽奖机会，签到每满3次就可以抽奖哦~')
                    return
                }
                this.API.getLottery({
                    activityId: this.urlParams.activityId,
                    actLuckWheelId: this.urlParams.wheelId
                }).then(res => {
                    console.log(res)
                    if (res.obj) {
                        this.award = res.obj;
                        this.start();
                    } else {
                        this.$toast(res.message)
                    }
                })
            },
            start() {
                this.isaward = false
                let i = 0;
                let k = 100;
                let awarDindex;
                this.awardList.forEach((item, index) => {
                    console.log(item.prizeId, this.award.awardId)
                    if (item.prizeId == this.award.prizeId) {awarDindex = item.active}
                })
                let j = setInterval(() => {
                    i = i + 100
                     this.active == 8 ?  this.active = 1 : this.active++
                    if (i > 3200) {
                        if ( this.active == awarDindex) {
                            clearInterval(j)
                            this.isaward = true
                            if (this.award.prizeName == '谢谢参与') {
                                this.popUpObj = {
                                    popUpType: 'award',
                                    title: '很遗憾，本次未中奖',
                                    text: '体验【装修我家】和【产品替换】可提高中奖概率哦~',
                                    btnText: '前去体验'
                                }
                            } else {
                                this.popUpObj = {
                                    popUpType: 'award',
                                    title: '恭喜您，抽中了',
                                    content: this.award.prizeName,
                                    // text: '添加微信(suixuanwang001)领取奖品',
                                    // btnText: '点击复制微信号'
                                }
                                if (this.award.prizeName == '10度币') {
                                    this.popUpObj.text = '奖品在24小时内充值到账'
                                } else if (this.award.prizeName == '1000套室内设计资料') {
                                    this.popUpObj.text = '添加微信(suixuanwang001)领取奖品'
                                    this.popUpObj.btnText = '点击复制微信号'
                                } else {
                                    this.popUpObj.text = '奖品在24小时内存入您的微信钱包'
                                    this.popUpObj.btnText = ''
                                }
                            }
                            setTimeout(() => {
                                this.shut()
                                this.setAwardData({vm: this})
                            }, 300)
                        }
                    }
                }, k)
            }
        }
    }
</script>

<style scoped lang="scss">
    .award{
        padding: 40px;
        font-size: 28px;
        .title{
            width: 476px;
	        height: 91px;
            margin: 0 auto;
            background-image: url('/static/image/year/spring_title_03.png');
            background-size: cover;
        }
        .text{
            height: 35px;
            line-height: 35px;
            color: #fddbb0;
            display: flex;
            justify-content: center;
            a{
                font-size: 28px;
                color: #fddbb0;
                border-bottom: 1px solid #fddbb0;
            }
        }
        .award-box{
	        height: 670px;
            padding: 20px;
            margin: 60px 0 25px;
            border-radius: 20px;
            background-color: #ffe66b;
            .contetn-box{
                height: 630px;
                padding-top: 15px;
                background-color: #990a1c;
                border-radius: 10px;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                .item-box{
                    width: 192px;
                    height: 192px;
                    margin-left: 14px;
                    background: rgba($color: #ffdbb0, $alpha: 0.8);
                    border-radius: 10px;
                    .item-content{
                        display: block;
                        height: 180px;
                        background-color: #ffdbb0;
                        border-radius: 10px;
                    }
                }
                .item-box-active{
                    width: 192px;
                    height: 192px;
                    margin-left: 14px;
                    background: rgba($color: #ffb86c, $alpha: 0.8);
                    border-radius: 10px;
                    .item-content{
                        display: block;
                        height: 180px;
                        background-image: linear-gradient(180deg, #ffe66b 0%, #ffb86c 100%);
                        border-radius: 10px;
                    }
                    .item-content-text{
                        height: 180px;
                        padding: 20px 40px 0;
                        // background-color: #ffe66b;
                        background-image: linear-gradient(180deg, #ffe66b 0%, #ffb86c 100%);
                        text-align: center;
                        border-radius: 10px;
                        font-size: 52px;
                        font-weight: bold;
                        color: #c12034;
                        &:active{
                            background-image: linear-gradient(180deg, #ffe66b 0%, #ffdbb0 100%);
                        }
                    }
                }
            }
        }
        .time{
            // height: 64px;
            line-height: 64px;
            color: #fddbb0;
            display: flex;
            justify-content: center;
            b{
                margin: 0 5px;
                line-height: 57px;
                font-size: 40px;
                color: #fff;
            }
            .btn{
                width: 160px;
	            // height: 64px;
                line-height: 64px;
                margin-left: 20px;
                font-size: 28px;
                border-radius: 32px;
                background-color: #fddbb0;
	            text-align: center;
                color: #c22f3d;
                &:active{
                    background-color: #ffb86c;
                }
            }
        }
        .probability-box{
            height: 224px;
            margin: 50px 0 40px;
            background-color: #b32b38;
            border-radius: 10px;
            overflow: hidden;
            p{
                margin-top: 20px;
                font-size: 28px;
                line-height: 45px;
                text-align: center;
                color: #fddbb0;
            }
            .probability-btn{
                width: 250px;
                // height: 64px;
                line-height: 64px;
                margin: 20px auto 0;
                border-radius: 32px;
                color: #c22f3d;
                background-color: #fddbb0;
                text-align: center;
                &:active{
                    background-color: #ffb86c;
                }
            }

        }
        .footer{
            font-size: 24px;
            color: #fddbb0;
            text-align: center;
            button{
                background-color: #c22f3d;
                color: #fddbb0;
                border-bottom: 1px solid #fddbb0;
            }
        }
    }
</style>
