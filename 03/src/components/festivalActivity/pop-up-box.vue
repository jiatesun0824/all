<template>
     <div class='pop-up-box'>
         <div class='shut' @click='shut' v-if='popUpObjs.popUpType != "finish"'></div>
         <div class='content'>
             <!-- 活动规则 -->
            <div class='explain-box'  v-if='popUpObjs.popUpType == "explain"'>
                <div class='title'>活动规则</div>
                <div class='text'>
                    <p>1、活动时间：2019年1月31日-2月9日；</p>
                    <p>2、活动期间，每人每天最多获得3张拼图，每人限领取一张卖座网通兑电影票，送完为止，需前往卖座网兑换使用，部分地区不支持；</p>
                    <p>3、每日签到获得的现金、抽奖获得的红包、2019元现金将直接发放至微信零钱；</p>
                    <p>4、体验“装修我家”和“产品替换”功能可提高中奖率，抽中1000套室内设计资料请添加微信suixuanwang001领取，度币可用于购买随选网版权收费方案；</p>
                    <p>5、活动期间所有奖励请在结束前领取，逾期作废；</p>
                    <p>6、本活动最终解释权归深圳市三度空间有限责任公司所有。</p>
                </div>
            </div>
            <!-- 红包 -->
            <div class='red-packet-box' v-if='popUpObjs.popUpType == "redPacket" || popUpObjs.popUpType == "finish"'>
                <div :class='popUpObjs.price?"price":"price-active"'>{{popUpObjs.price?'￥' + popUpObjs.price : popUpObjs.title}}</div>
                <p :class='popUpObjs.price?"price-text":"price-text-active"'>{{popUpObjs.text ? popUpObjs.text : "参加活动要趁早哦~"}}</p>
                <p class='text' v-if='(popUpObjs.popUpType != "finish" && popUpObjs.haveLotteryChance == 0) && !popUpObjs.btnText'>连续签到3天<br/>可以抽取2019元现金大奖</p>
                <div class='text-box' v-if=' popUpObjs.popUpType == "redPacket" && popUpObjs.haveLotteryChance == 1'>
                    <p>恭喜获得抽取2019元现金大奖的机会</p>
                    <a class='btn' href="#award" @click="shut" >前去抽奖</a>
                </div>
                <div class='text-box' v-if='popUpObjs.popUpType == "finish"'>
                    <p>不如去体验一下家装黑科技吧</p>
                    <a class='btn' href="#award" @click="experience">{{popUpObjs.btnText}}</a>
                </div>
            </div>
            <!-- 中奖记录 -->
            <div class='record' v-if='popUpObjs.popUpType == "record"'>
                <div class='title'>中奖记录</div>
                <div class='record-list' v-if='popUpObjs.recordList && popUpObjs.recordList.length > 0'>
                    <div class='record-item' v-for='(item, index) in popUpObjs.recordList' :key='index'>
                        <div class='record-title'>
                            {{item.prizeName}}
                            <span v-if='item.prizeName == "1000套设计资料"' @click='goGet'>领取</span>
                            <span v-else>已发放</span>
                        </div>
                        <div class='date'>{{item.lotteryTime}}</div>
                    </div>
                </div>
                <div class='empty' v-else>
                    <div></div>
                    <p>暂时还没有记录哦~</p>
                </div>
            </div>
            <!-- 中奖 -->
            <div class='award' v-if='popUpObjs.popUpType == "award"'>
                <div class='award-icon'></div>
                <p class='text'>{{popUpObjs.title}}</p>
                <p class='award-name' v-if='popUpObjs.content'>{{popUpObjs.content}}</p>
                <p class='get-award'>{{popUpObjs.text}}</p>
                <button class='award-btn' v-if='popUpObjs.btnText == "点击复制微信号"' v-clipboard:copy="'suixuanwang001'" v-clipboard:success="copy">点击复制微信号</button>
                <div class='award-btn' v-else-if='popUpObjs.btnText' @click='go720'>{{popUpObjs.btnText}}</div>
            </div>
         </div>
     </div>
</template>

<script>
    import {mapActions} from 'Vuex'
    import festivalActivity from "@/mixin/festivalActivity"
    export default {
        name: "popUpBox",
        mixins:[festivalActivity],
        props: {
            popUpObj: {
                type: Object,
                value: {}
            }
        },
        data() {
            return {
                popUpObjs: {}
            }
        },
        created() {
            this.popUpObjs = this.popUpObj
        },
        methods: {
            ...mapActions('festivalActivity',['setAwardData']),
            shut(type) {
                if(this.popUpObjs.popUpType == "redPacket") {this.setAwardData({vm: this})}
                this.$emit('shut')
            },
            goGet() {
                this.popUpObjs = {
                    popUpType: 'award',
                    // title: '恭喜您，抽中了',
                    content: '1000套设计资料',
                    text: '添加微信(suixuanwang001)领取奖品',
                    btnText: '点击复制微信号'
                }
            },
            
        }
    }
</script>

<style scoped lang="scss">
    .pop-up-box{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 11;
        width: 100%;
        height: 100%;
        background: rgba($color: #000000, $alpha: 0.6);
        .shut{
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            width: 56px;
	        height: 56px;
            background-image: url('/static/image/720_icon_close_share.png');
            background-size: 100% 100%;
        }
        .content{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            .explain-box{
                width: 590px;
                padding: 40px;
                background-color: #ffffff;
                border-radius: 20px;
                .title{
                    margin-bottom: 35px; 
                    font-size: 32px;
                    text-align: center;
                    font-weight: bold;
                    color: #333333;
                }
                .text{
                    font-size: 24px;
                    margin-bottom: 35px;
                    color: #333333;
                    p{
                        line-height: 35px;
                    }
                }
            }
            .red-packet-box{
                width: 560px;
                height: 739px;
                border-radius: 20px;
                background-size: 100% 100%;
                background-image: url('/static/image/year/spring_pop_redbag.png');
                overflow: hidden;
                .price-active{
                    margin-top: 200px;
                    line-height: 100px;
                    font-size: 56px;
                    font-weight: bold;
                    color: #999;
                    text-align: center;
                }
                .price{
                    margin-top: 200px;
                    line-height: 100px;
                    font-size: 88px;
                    color: #c22f3d;
                    text-align: center;
                }
                .price-text{
                    margin-top: 40px;
                    font-size: 28px;
                    color: #c22f3d;
                    text-align: center;
                }
                .price-text-active{
                    margin-top: 40px;
                    font-size: 28px;
                    color: #999;
                    text-align: center;
                }
                .text{
                    font-size: 28px;
                    line-height: 40px;
                    margin-top: 160px;
                    color: #f5cdab;
                    text-align: center;
                }
                .text-box{
                    margin-top: 130px;
                    p{
                        color: #f5cdab;
                        font-size: 28px;
                        text-align: center;
                    }
                    .btn{
                        display: block;
                        width: 480px;
                        height: 88px;
                        line-height: 88px;
                        margin: 60px auto 0;
                        font-size: 32px;
                        font-weight: bold;
                        text-align: center;
                        color: #bf363b;
                        background-color: #f5cdab;
                        border-radius: 6px;
                    }
                }
            }
            .record{
                width: 590px;
                background-color: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                .title{
                    padding: 35px 0; 
                    font-size: 32px;
                    text-align: center;
                    font-weight: bold;
                    color: #333333;
                    border-bottom: 1px solid #e8e8e8;
                }
                .record-list{
                    padding: 0 40px 10px;
                    height: 660px;
                    overflow-y: scroll;
                    .record-item{
                         padding: 40px;
                         border-bottom: 1px solid #e8e8e8;
                         .record-title{
                            height: 48px;
                            font-size: 28px;
                            font-weight: bold;
                            color: #333333;
                            display: flex;
                            justify-content: space-between;
                            span{
                                color: #999999;
                            }
                            div{
                                width: 88px;
                                height: 48px;
                                line-height: 48px;
                                font-size: 24px;
                                background-color: #c22f3d;
                                border-radius: 24px;
                                text-align: center;
                                color: #fff;
                            }
                         }
                         .date{
                             font-size: 24px;
                             color: #999999;
                         }
                    }
                }
                .empty{
                    div{
                        width: 290px;
	                    height: 290px;
                        margin: 80px auto 30px;
                        background-image: url('/static/image/year/prize_pop_no.png');
                        background-size: cover;
                    }
                    p{
                        margin-bottom: 100px;
                        font-size: 24px;
                        color: #999999;
                        text-align: center;
                    }
                }
            }
            .award{
                width: 590px;
                padding: 40px;
                background-color: #ffffff;
                border-radius: 20px;
                .award-icon{
                    width: 356px;
	                height: 294px;
                    margin: 0 auto;
                    background-image: url('/static/image/year/prize_pop_01.png');
                    background-size: cover;
                }
                p{
                    text-align: center;
                }
                .text{
                    color: #333333;
                    font-size: 40px;
                    font-weight: bold;
                }
                .award-name{
                    margin: 30px auto 0;
                    font-size: 48px;
                    color: #c22f3d;
                }
                .get-award{
                    margin-top: 40px;
                    font-size: 28px;
                    color: #999999;
                }
                .award-btn{
                    display: block;
                    width: 460px;
                    height: 80px;
                    line-height: 80px;
                    margin: 20px auto 0;
                    background-color: #c22f3d;
                    color: #fff;
                    text-align: center;
                    border-radius: 40px;
                }
            }
        }
    }
</style>