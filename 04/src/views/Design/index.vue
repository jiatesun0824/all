<template>
  <div class="design">
    <div class="design_header">
      <span>设计</span>
    </div>
    <div class="tab">
      <div class="tab_item" v-for="(item, index) in tab" :key="index" @click="openToast(index)">
        <span :style="item.active?'color:#ff6419':''">{{item.tit}}</span>
        <img :src="item.active?require('../../../static/images/home_icon_down_sel2.png'):require('../../../static/images/home_icon_down_nor.png')"
          alt="">
      </div>
    </div>
    <div class="selBox_area" :style="toastShow?'top:2.346667rem;':'top:-100%'">
      <div class="bg" @click="closeToast"></div>
      <div class="selBox_area_box" v-if="areaShow">
        <div class="area_item" v-for="(item, index) in areas" :key="index" @click="selArea(item, index)" :style="item.active?'background:#fff1eb;color:#ff6419;':''">
          {{item.tit}}
        </div>
      </div>
      <div class="selBox_type_box" v-if="typeShow">
        <div class="type_item" v-for="(item, index) in type" @click="selType(item, index)" :key="index" :style="item.active?'background:#fff1eb;color:#ff6419;':''">
          {{item.tit}}
        </div>
      </div>
    </div>
    <scroll v-if="!noMessShow" class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true"
      :beforeScroll="true" :scrollX="true" :refreshScroll="true" :data="datalist" @scrollToEnd="loadmore" ref="wrapperScroll">
      <div class="box">
        <div class="item" v-for="(item, index) in datalist" :key="index">
          <div class="imgBxo">
            <img class="item_img" v-if="item.planSourceType==2" :src="item.pic | filterImg" alt="">
            <img class="item_img" :src="item.pic | filterImg" v-if="item.planSourceType==1&&item.renderState==1" alt="">
            <img class="item_img" v-if="item.planSourceType==1&&item.renderState!=1" src="./images/design_bg_pic.png"
              alt="">
            <div class="del" @click="delPlan(item, index)" v-if="item.permitDeleted">
              <img src="./images/me_icon_delete.png" alt="">
            </div>
            <div class="renderImg">
              <img src="./images/photo.png" @click.stop="$router.push({name: 'photoview', params: {page: 'design', id: item.sceneId}})"
                v-if="item.renderPic" alt="">
              <img src="./images/fullview.png" @click="sel720(index, 0)" v-if="item.render720" alt="">
              <img src="./images/roam.png" @click="sel720(index, 1)" v-if="item.renderRoam" alt="">
              <img src="./images/video.png" @click="selVideo(index)" v-if="item.renderVideo" alt="">
            </div>
            <!-- <div class="renderState_s" v-if="item.planSourceType==1&&item.renderState==1">
              <span>{{item.taskType==1?'由产品替换生成':'由装进我家生成'}}</span>
            </div> -->
            <div class="renderState" v-if="item.planSourceType==1&&item.renderState!=1">
              <span :style="item.renderState==2?'color:#fff':'color:#ff6419'">{{item.renderState==2?'正在渲染中...':'渲染失败！'}}
                |</span>
              <span>{{item.taskType==1?'由产品替换生成':'由装进我家生成'}}</span>
            </div>
            <img class="qrcode" v-if="item.renderState==1||item.planSourceType==2" @click="showQrBox(item)" src="./images/page_icon_qr.png"
              alt="">
          </div>

          <div class="item_footer">
            <div class="title">
              <span>{{item.name}}</span>
              <img src="./images/design_icon_edit.png" v-if="item.permitUpdateName" @click="showEditBox(item, index)" alt="">
            </div>
            <div class="tit">
              <span>{{item.spaceType}}</span> | <span>{{item.spaceArea}}m²</span>
              <div class="date">{{item.ctime}}</div>
            </div>
            <div></div>
          </div>
        </div>
        <div class="haveFooter" v-if="showHvF">---　已到底　---</div>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>

      </div>
    </scroll>
    <div class="editBox" v-if="editBoxShow">
      <div class="editmain">
        <div class="edit_title">方案重命名</div>
        <input type="text" placeholder="不超过15个字" v-model="editPlanName">
        <div class="edit_but">
          <div @click="editBoxShow = false">取消</div>
          <div @click="editPlanNameFn">确定</div>
        </div>
      </div>
    </div>
    <div class="qrBox" v-if="qrBoxShow">
      <div class="qi_main">
        <div class="close">
          <img src="./images/pop_nav_icon_close.png" @click="qrBoxShow = false" alt="">
        </div>
        <div id="qrDiv">
          <swiper class="swiper-wrapper" :options="swiperOption">
            <swiper-slide class="swiper-box" v-for="(item, index) in qrlist" :key="index">
              <div class="qrdiv" :id="'qrimg'+index">
                <div class="qr_title">{{item.renderingTypeStr}}</div>
                <div class="qr_img">
                  <vue-qr :text="item.qrUrl"></vue-qr>
                </div>
              </div>
            </swiper-slide>
          </swiper>
           <div class="dotbox" v-if="qrlist.length>1">
                  <div class="dot_item" v-for="(item, index) in qrlist" :key="index" :style="index==activeIndex?'background:#ff6419;width:0.2rem;':''"></div>
           </div>
        </div>
        <div class="qr_tit" v-if="qrlist.length>1">左滑可查看其他二维码</div>
        <div class="but" :style="qrlist.length<=1?'margin-top: 1rem;':''" @click="saveQr(activeIndex)">分享二维码</div>
      </div>
    </div>
    <div class="empty" v-if="noMessShow">
      <div class="em_box">
        <img src="./images/list_icon_empty.png" alt="">
        <div>暂无相关数据...</div>
      </div>
    </div>
    <div class="loadImg" v-if="loadShow">
      <div class="loadimgbox">
        <img src="./images/loading.gif" alt="">
      </div>
    </div>
    <shareComponent shareWay='image' :shareShow.sync="shareShow" :isQr="isQr"></shareComponent>
  </div>
</template>
<script>
  import mixins from '@/mixins/mixin';
  import shareComponent from "@/components/shareComponent/index";
  import html2canvas from 'html2canvas';
  import VueQr from 'vue-qr';
  import { debounce } from 'lodash';
  import {
    mapState
  } from 'vuex';
  import {
    getPlanQrCodeUrlList
  } from "@/api/design";
  export default {
    mixins: [mixins],
    components: {
      shareComponent,
      VueQr
    },
    data() {
      return {
        qrIMgUrl: "",
        qrImgBoxShow: false,
        // swiper
        swiperOption: {
          thet: this,
          effect: "coverflow",
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: "auto",
          initialSlide: 0, // 默认页面
          // loop: true,
          observer: true,
          observeParents: true,
          coverflowEffect: {
            rotate: 0,
            stretch: 35,
            depth: 100,
            modifier: 1,
            slideShadows: false
          },
          on: {
            transitionEnd() {}
          },
        },
        activeIndex: 0,
        // 页面控件
        datalist: [],
        toastShow: false,
        areaShow: false,
        typeShow: false,
        noMessShow: true,
        shareShow: false,
        isQr: true,
        showHvF: false,
        loadShow: false,
        // 获取基础数据
        Mark: {
          spaceFunctionId: null,
          planSourceType: 1,
          start: 0,
          limit: 10
        },
        remark: '',
        // 页面基础数据
        tab: [{
            tit: '全部空间',
            active: false
          },
          {
            tit: '移动端渲染生成',
            active: false
          }
        ],
        areas: [{
            tit: '全部空间',
            spaceFunctionId: null,
            active: true
          },
          {
            tit: '客餐厅',
            spaceFunctionId: 3,
            active: false
          },
          {
            tit: '卧室',
            spaceFunctionId: 4,
            active: false
          },
          {
            tit: '厨房',
            spaceFunctionId: 5,
            active: false
          },
          {
            tit: '卫生间',
            spaceFunctionId: 6,
            active: false
          },
          {
            tit: '书房',
            spaceFunctionId: 7,
            active: false
          }
        ],
        type: [{
            tit: '移动端渲染生成',
            active: true,
            planSourceType: 1
          },
          {
            tit: 'PC端渲染生成',
            active: false,
            planSourceType: 2
          }
        ],
        // 编辑
        editPlanName: '',
        editPlanId: 0,
        editIndex: 0,
        editBoxShow: false,

        // 二维码
        qrBoxShow: false,
        qrlist: [],
      }
    },
    watch: {
      editPlanName(val) {
        if (val.length >= 15) {
          this.editPlanName = val.substr(0, 15);
        }
      }
    },
    computed: mapState({
      serverUrl: state => state.serverUrl,
      resourcesUrl: state => state.resourcesUrl,
      comComponentsShow: state => state.comComponentsShow,
      view720Title: state => state.view720.view720Title,
      view720Url: state => state.view720.view720Url,
      loadfailTxt: state => state.view720.loadfailTxt,
      loadingFlag: state => state.loadingFlag,
      spaceList: state => state.spaceList,
      designNavFlag: state => state.design.designNavFlag,
      navListSwiper() {
        return this.$refs.navListSwiper.swiper;
      },
      contentSwiper() {
        return this.$refs.contentSwiper.swiper;
      }
    }),
    created() {
      this.getData();
    },
    mounted() {
      this.$nextTick(()=>{
           this.initSwiper();
      })
    },
    methods: {
       // 全景图片点击事件
    sel720 (index, type) {

      if (this.$route.path == '/view720') return;
     // if(this.datalist[index].isSuccess !== 2) return;
      //this.$store.commit('audioAutoPlay');
      sessionStorage.setItem('operationSource', 0);
      sessionStorage.setItem('groupPlanId', this.datalist[index].cpId);
      sessionStorage.setItem('cpId', this.datalist[index].cpId);
      sessionStorage.setItem('view720Id', this.datalist[index].cpId);
          sessionStorage.setItem('isTask', 1) // 我的任务
      this.$store.state.fasttype = 'renderScene';
      
      this.$store.state.goBackPath = this.$route.path;
      if (type==0) {
				this.$store.state.detailsSeeType = '';
        this.remark = '720';
        sessionStorage.setItem('routerQueryType', 'seven');
			} else if (type==1) {
				this.$store.state.detailsSeeType = '2';
				this.remark = 'roam';
        sessionStorage.setItem('routerQueryType', 'roam');
			} else if (type==2) {
				this.$store.state.detailsSeeType = '2';
        this.remark = 'video';
			}
      this.API.getPictureList({
        id: this.datalist[index].cpId,
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
    },
      // 图片集点击事件
      selPhoto(index) {
        this.$store.state.photoView.photoViewId = this.datalist[index].planId;
        this.API.getPictureList({
          id: this.datalist[index].cpId,
          // id: this.datalist[index].planId,
          remark: 'photo'
        }).then((response) => {
          if (response) {
            if (response.totalCount == 0) {
              this.$store.commit('popupMsg', '当前设计没有图片');
              this.$store.commit('showPopup');
            } else {
              this.$store.state.photoView.photoViewSmall = response.datalist;
              this.$store.state.smallTitle = this.datalist[index].name;
              this.$store.commit('showComComponents', false);
              this.$router.push('/photoview');
            }
          }
        });
      },
      selRoam(index) {
        if (this.$route.path == '/view720') {
          return;
        }
        this.$store.state.isDesign = false;
        this.$store.state.goBackPath = this.$route.path;
        sessionStorage.setItem('operationSource', 0);
        sessionStorage.setItem('renderingType', 8);
        sessionStorage.setItem('msgId', 'design');
        sessionStorage.setItem('routerQueryType', 'roam');
        this.$store.commit('audioAutoPlay');
        this.$store.state.detailsSeeType = '2';
        this.$store.state.view720.view720Id = this.datalist[index].planId;
        sessionStorage.setItem('planId', this.datalist[index].planId);
        sessionStorage.setItem('planRecommendedId', this.datalist[index].thumbId);
        sessionStorage.setItem('cpId', this.datalist[index].cpId);
        sessionStorage.setItem('view720Id', this.datalist[index].cpId);
        sessionStorage.setItem('groupPlanId', this.datalist[index].cpId);
        sessionStorage.setItem('groupType', 1); // 设置组合替换类型 区分方案跟我的设计
        this.API.getPictureList({
          id: this.datalist[index].cpId,
          remark: 'roam'
        }).then((response) => {
          if (response) {
            if (response.totalCount == 0) {
              this.$store.commit('popupMsg', '当前设计没有720多点全景');
              this.$store.commit('showPopup');
            } else {
              this.$store.state.view720.view720Small = response.datalist;
              this.$store.state.smallTitle = this.datalist[index].name;
              this.$store.commit('showComComponents', false);
              this.$store.state.view720LoadingFlag = true;
              this.$store.state.fasttype = 'renderScene';
              // this.$store.state.fasttype = 'design';
              this.$router.push('/view720');
            }
          }
        });
      },
      selVideo(index) {
        sessionStorage.setItem('renderingType', 6);
        this.$store.state.videoView.videoViewId = this.datalist[index].planId;
        this.$store.state.goBackPath = this.$route.path;
        this.$store.state.detailsSeeType = '2';
        this.API.getPictureList({
          id: this.datalist[index].cpId,
          remark: 'video'
        }).then((response) => {
          if (response) {
            if (response.totalCount == 0) {
              this.$store.commit('popupMsg', '当前设计没有漫游视频');
              this.$store.commit('showPopup');
            } else {
              this.$store.state.videoView.videoViewSmall = response.datalist;
              localStorage.setItem('_videoPreviewImage_', this.$store.state.videoView.videoViewSmall[0].picPath); // 缓存视频预览图
              this.$store.state.videoView.videoViewTitle = this.datalist[index].name;
              this.$store.commit('showComComponents', false);
              this.$store.state.fasttype = 'design';
              this.$store.state.showVideo = true;
              this.$router.push('/videoview');
              //              setTimeout(() => {
              //                this.$router.push('/videoview');
              //              }, 500);
            }
          }
        });
      },
      saveQr(index) {
        this.loadShow = true;
          let id = "#qrimg"+index;
          this.$nextTick(() => {
            html2canvas(document.querySelector(id), {
              useCORS: true, //（图片跨域相关）
              allowTaint: false, //允许跨域（图片跨域相关）
              taintTest: true //是否在渲染前测试图片
            }).then(canvas => {
              sessionStorage.setItem('qrImgUrl', JSON.stringify(canvas.toDataURL("image/jpeg")));
              this.shareShow = true;
              this.loadShow   = false;
            })
          })
      },
      // 删除方案
      delPlan(item, index) {
        this.$confirm({
            title: '提示',
            msg: '确定删除吗？'
          })
          .success(instance => {
            instance.close();
            let data;
            if (item.renderState == 1) {
              data = {
                planId: item.sceneId,
                planHouseType: item.planHouseType
              }
            } else {
              data = {
                planId: item.taskId?item.taskId:item.cpId,
                planHouseType: item.planHouseType
              }
            }
            this.API.deleteMyDesignPlanAndTask(data).then(res => {
              if (res.success) {
                this.Mark.start = 0;
                this.getData();
              }
            })
          })
      },
      initSwiper() {
      let that = this
      this.swiperOption.on.transitionEnd = function() {
        that.activeIndex = this.activeIndex
      }
    },
      showQrBox(item) {
        let data = {
          planId: item.sceneId
        }
        getPlanQrCodeUrlList(data).then(res => {
          if (res.success) {
            this.qrlist = res.datalist;
            this.qrBoxShow = true;
          }
        })
      },
      // 展示修改名称弹框
      showEditBox(item, index) {
        this.editPlanId = item.sceneId;
        this.editIndex = index;
        this.editBoxShow = true;
        this.editPlanName = '';
      },
      // 修改名称
      editPlanNameFn() {
        let data = {
          planId: this.editPlanId,
          planName: this.editPlanName
        }
        this.API.updatePlanName(data).then(res => {
          if (res.success) {
            this.editBoxShow = false;
            this.$set(this.datalist[this.editIndex], "name", this.editPlanName);
          }
        })
      },
      // 选择空间
      selArea(item, index) {
        this.Mark.start = 0;
        this.Mark.spaceFunctionId = item.spaceFunctionId;
        this.$set(this.tab[0], "tit", item.tit);
        this.areas.map(sitem => {
          sitem.active = false;
        })
        this.$set(this.areas[index], "active", true);
        this.closeToast()
        this.getData();
      },
      // 选择类型
      selType(item, index) {
        this.Mark.start = 0;
        this.Mark.planSourceType = item.planSourceType;
        this.$set(this.tab[1], "tit", item.tit);
        this.type.map(sitem => {
          sitem.active = false;
        })
        this.$set(this.type[index], "active", true);
        this.closeToast();
        this.getData();
      },
      getData() {
        this.API.myDesignPlanMobile(this.Mark).then(res => {
          if (res.success && res.datalist.length > 0) {
            this.datalist = res.datalist;
            this.noMessShow = false;
          }else {
             this.datalist = [];
             this.noMessShow = true;
          }
        })
      },
      closeToast() {
        this.toastShow = false;
        this.tab.map(item => {
          item.active = false;
        })
      },
      openToast(index) {
        if(this.tab[index].active) {
          this.$set(this.tab[index], 'active', false);
          this.toastShow = false;
          this.areaShow = false;
          this.typeShow = false;
        }else {
          this.tab.map(item => {
          item.active = false;
          })
          this.$set(this.tab[index], 'active', true);
          if (index == 0) {
            this.toastShow = true;
            this.areaShow = true;
            this.typeShow = false;
          } else {
            this.toastShow = true;
            this.typeShow = true;
            this.areaShow = false;
          }
        }
      },
      loadmore() {
        this.Mark.start += 10;
        this.API.myDesignPlanMobile(this.Mark).then(res => {
          if (res.success&&res.datalist.length>0) {
            this.datalist = this.datalist.concat(res.datalist);
            this.noMessShow = false;
            this.showHvF = false;
          }else {
            this.showHvF = true;
          }
        })
      }

    }
  }

</script>
<style lang="scss" scoped>
  @import './styles/design.scss';

</style>
