<template>
    <div class="feedRecord">
        <header>
            <i class="icon-left" @click="$router.go(-1)"></i>
            <div class="title">反馈记录</div>
        </header>
        <scroll  class="wrapper" 
            :listenScroll="listenScroll" 
            :probeType="probeType" 
            :pullup="true"
            :beforeScroll="true" 
            :scrollX="true" 
            :refreshScroll="true" 
            :data="datalist" 
            ref="wrapperScroll">
            <div class="box">
                <div class="item" v-for="(item, index) in datalist" :key="index" @click="$router.push({path:'feedDeatil',query:{feedbackId: item.feedbackId}})">
                    <div class="line" v-if="item.dealStatus==1&&item.isRead==0"></div>
                    <div class="title">{{item.feedbackContent}}</div>
                    <div class="tit">{{item.gmtCreate.substr(0, 16)}}</div>
                    <div class="status" :style="item.dealStatus!=0?'color:#88cc66':'color:#999'">{{item.dealStatus!=0?'已回复':'未回复'}}</div>
                </div>
                <div class="data_tit" v-if="datalist.length==10">- 只展示最近10条记录 -</div>
            </div>
        </scroll>
        <div class="noMess" v-if="empty">
            <div class="iconbox">
                <img class="icon" src="../images/list_icon_empty.png">
            </div>
            <div class="tit">
                暂无相关记录
            </div>
        </div>
    </div>
</template>
<script>
import mixins from '@/mixins/mixin'
export default {
    mixins: [mixins],
    data() {
        return {
            datalist: [],
            empty: false
        }
    },
    created() {
        this.API.feedbackList().then(res=> {
            if(res.success) {
                this.datalist = res.datalist;
                this.empty = false;
            }else{
                this.empty = true;
            }
        })
    }
}
</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/feedRecord.scss';
</style>