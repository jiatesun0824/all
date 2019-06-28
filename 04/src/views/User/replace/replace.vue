<template>
    <div class="replace">
        <header>
            <i class="icon-left" @click="$router.push('/user')"></i>
            <div class="title">我的方案</div>
        </header>
        <scroll v-show="listShow" class="wrapper"
            :probeType="probeType"
            :listenScroll="listenScroll"
            :pullup = "true"
            :pulldown = "true"
            :beforeScroll = "true"
            :scrollX = "true"
            :data = "datalist"
            :refreshScroll = "true"
            @pulldown="pulldown"
            @scrollToEnd="loadmore"
            ref="wrapperScroll">
            <div class="box">
                <div class="slider" v-for="(item, index) in datalist" :key="index">
                    <div class="head">
                        <div class="title" v-if="item.renderTypesStr/1 === 1">照片级</div>
                        <div class="title" v-if="item.renderTypesStr/1 === 2">720全景</div>
                        <div class="title" v-if="item.renderTypesStr/1 === 3">多点全景</div>
                        <div class="title" v-if="item.renderTypesStr/1 === 4">漫游视频</div>
                        <div class="datetit">{{item.gmtCreate}}</div>
                    </div>
                    <div class="main">
                        <img class="imgleft" :src="imgPath+item.smallPicPath" @click="sel720(index)">
                        <div class="divright">
                            <div class="name">
                                <span class="name-tit">{{item.taskType ? '替换渲染' : '装进我家'}}</span>
                                <span class="namevalue">{{item.designName}}</span>
                            </div>
                            <div class="status" v-if="item.isSuccess === 0 || item.isSuccess === 1">装修中...</div>
                            <div class="status" v-if="item.isSuccess === 2">装修完成</div>
                            <div class="status" v-if="item.isSuccess === 3">装修失败</div>
                            <div class="why" v-if="item.isSuccess === 3">失败原因 : {{item.failReason}}</div>
                        </div>
                        <div class="delete" @click.stop="delBut(item, index)"></div>
                    </div>
                    <div class="but" v-if="item.isSuccess === 3" @click.stop="goaccount">
                        <span class="but-tit">查看退款</span>
                        <i class="icon-right"></i>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        </scroll>
        <!-- <confirm :popupshow="showFlag" :text="text" @cancel="cancel" @confirm="confirm"></confirm> -->
        <div class="noList" v-show="!listShow">
          <div class="imgbox">
              <img src="../images/list_icon_empty.png">
          </div>
          <div class="tit">
            您暂时没有任务哦！ <br />
            返回首页看看有没有您需要的服务！
          </div>
          <div class="but" @click="goShop">
            <span class="butSp">返回首页</span>
          </div>
        </div>
    </div>
</template>
<script>
import mixins from "@/mixins/mixin";
import { getMyReplaceRecord, deteleMyTaskAndDesign } from "@/api/user";
import { mapGetters } from "Vuex";
import { debounce } from 'lodash';
export default {
  mixins: [mixins],
  data() {
    return {
      // 请求参数
      Mark: {
        limit: 10,
        operationUserId: JSON.parse(localStorage.getItem('userInfo')).id,
        start: 0
      },
      // img资源地址
      imgPath: "",
      // 返回值
      datalist: [],
      listShow: true,
      // 提示
      showFlag: false,
      text: "是否删除该任务",
      // 删除的item
      delItem: {}
    };
  },
  computed: {
    ...mapGetters("common", ["userInfo"])
  },
  // 描点定位
    beforeRouteEnter(to, from, next) {
      if(from.name === 'user'||from.name==='fastDecorate'){
        to.meta.isCache = true;
      }
      next();
    },
    beforeRouteLeave(to, from, next){
      if(to.name === 'view720' || to.name === 'photoview'){
          from.meta.isCache = false;
       }
      next();
    },
  activated() {
    if(this.$route.meta.isCache){
      this.Mark.start=0;
      this.main();
    }
  },
  methods: {
    main(){
      var that = this;
      this.imgPath = JSON.parse(localStorage.getItem('userInfo')).resourcesUrl;
      that.Mark.operationUserId = JSON.parse(
        localStorage.getItem("userInfo")
      ).id.toString();
      this.getMyReplaceRecord();
    },
    goaccount() {
      this.$router.push("/account");
    },
    // 下拉刷新
    pulldown() {
      this.Mark.start = 0;
      this.getMyReplaceRecord();
    },
    loadmore() {
      this.Mark.start+=10;
      getMyReplaceRecord(this.Mark).then(res => {
        if(res.datalist) {
          // var datalist = this.datalist;
          // datalist.concat(res.datalist);
          //  var s = new Set();
          //  datalist.forEach(x => s.add(x));
          //  this.datalist = Array.from(s);
          // this.datalist = datalist;
          this.datalist = this.datalist.concat(res.datalist);
        }
      });
    },
    getMyReplaceRecord() {
      getMyReplaceRecord(this.Mark).then(res => {
        if (res.datalist.length === 0) {
          this.listShow = false;
        } else {
          this.listShow = true;
          // this.datalist = [];
          // var datalist = res.datalist;
          // var s = new Set();
          // datalist.forEach(x => s.add(x));
          // this.datalist = Array.from(s);
          this.datalist = res.datalist;
        }
      });
    },
    delBut: debounce(function(item, index) {
      var that = this;
      that.delItem = {
        id: item.id,
        taskId: item.taskId
      };
      this.$confirm({
        title: "",
        msg: "是否删除该任务"
      }).success(instance => {
        deteleMyTaskAndDesign(that.delItem).then(res => {
          if (res.success) {
             instance.close();
             this.datalist.splice(index, 1);
             if(this.datalist.length == 0) {
               this.listShow = false;
             }
            //  that.Mark.start = 0;
            // getMyReplaceRecord(that.Mark).then(res => {
            //   if (res.datalist.length === 0) {
            //     this.listShow = false;
            //   } else {
            //     this.listShow = true;
            //     this.datalist = [];
            //     var datalist = res.datalist;
            //     var s = new Set();
            //     datalist.forEach(x => s.add(x));
            //     this.datalist = Array.from(s);
            //   }
            // });
          }
        });
      });
    }, 20),
    // 全景图片点击事件
    sel720: debounce(function(index) {
      if (this.$route.path == '/view720') return;
      if(this.datalist[index].isSuccess !== 2) return;
      // this.$store.commit('audioAutoPlay');
      sessionStorage.setItem('operationSource', 0);
      sessionStorage.setItem('groupPlanId', this.datalist[index].businessId);
      sessionStorage.setItem('cpId', this.datalist[index].businessId);
      sessionStorage.setItem('view720Id', this.datalist[index].businessId);
          sessionStorage.setItem('isTask', 1) // 我的任务
      this.$store.state.fasttype = 'renderScene';
      this.$store.state.goBackPath = this.$route.path;
      if (this.datalist[index].renderTypesStr == 2) {
				this.$store.state.detailsSeeType = '';
        this.remark = '720';
        sessionStorage.setItem('routerQueryType', 'seven');
			} else if (this.datalist[index].renderTypesStr == 3) {
				this.$store.state.detailsSeeType = '2';
				this.remark = 'roam';
        sessionStorage.setItem('routerQueryType', 'roam');
			} else if (this.datalist[index].renderTypesStr == 4) {
				this.$store.state.detailsSeeType = '2';
				this.remark = 'video';
			}
      this.API.getPictureList({
        id: this.datalist[index].businessId,
        remark: this.remark
      }).then((response) => {
        if (response) {
          if (!response.datalist.length) return;
          sessionStorage.setItem('planId', response.datalist[0].businessId);
          this.$store.state.smallTitle = this.datalist[index].planName;
          this.$store.state.view720LoadingFlag = true;
          if (this.remark == 'video') {
            this.$store.state.showVideo = true;
            this.$router.push('/videoview');
            this.$store.state.videoView.videoViewSmall = response.datalist;
            localStorage.setItem('_videoPreviewImage_', this.$store.state.videoView.videoViewSmall[0].picPath); // 缓存视频预览图
          } else {
            this.$store.state.view720.view720Small = response.datalist[0].picPath;
            this.$router.push({name: 'view720', params: {uuid: this.datalist[index].fullHousePlanUUID}});
          }
        }
      });
    }, 20)
  }
};
</script>
<style lang="sass" scoped>
   @import '../../../styles/header.scss'
   @import '~views/User/replace/replace.scss'
</style>

