
<template>
  <div class='personal-publicity' >
    <div class='poster'></div>
    <!-- 红人大咖 -->
    <div class='master-box'>
      <div class='title-box'><span></span>红人大咖<span></span></div>
      <div class='master-info gradient' v-for='(masterItem, masterIndex) in masterList' :key='masterIndex'>
        <!-- 个人信息盒子 -->
        <div class='master-message'>
          <img :src="masterItem.headImg" alt="">
          <div class='message'>
            <div class='name'>{{masterItem.name}}</div>
            <p>{{masterItem.company}}</p>
            <p>{{masterItem.profession}}</p>
            <div class='btn' @click='goAppointment(masterItem)'>预约设计</div>
          </div>
        </div>
        <!-- 个人经验 -->
        <div class='experience' v-html="masterItem.experience"></div>
        <!-- 个人一键方案 -->
        <div class='project-box' v-if='masterItem.plan.length > 0'>
          <div class='project-title'><span></span>{{masterItem.gender == '女'?'她':'他'}}的一键方案</div>
          <div class='projec-list'>
            <swiper :options='swiperOption' class='swiper'>
              <swiper-slide class='swiper-slide' v-for='(item, index) in masterItem.plan' :key='index'>
                <div class='identification' v-show='item.planTableType == 2 || item.planTableType == 3'>全屋</div>
                <div class='panorama-icon' @click='go720(item.planRecommendedId)'></div>
                <img :src="item.coverPath?resourceURL + item.coverPath:'../../static/image/design_def.png'" class='projec-img' alt="">
                <div class='footer'>
                  <div class='name'>{{item.planName}}</div>
                  <div class='type'>{{item.styleName}}  |  {{item.spaceAreas}}㎡</div>
                  <img :src="masterItem.userPicPath?resourceURL + masterItem.userPicPath:'../../static/image/index.png'" class='head' alt="">
                  <div class='quantity-box'>
                    <div class='browse'>浏览{{item.visitCount}}</div>
                    <div class='right-box'>
                      <div class='collect' @click='isCollectOrLike(item, index, "isFavorite", masterIndex)'>
                        <span :class='item.isFavorite == 1 ? "active" : ""'></span>
                        {{item.collectNum>999?'999+':item.collectNum}}
                      </div>
                      <div class='praise' @click='isCollectOrLike(item, index, "isLike", masterIndex)'>
                        <span :class='item.isLike == 1 ? "active" : ""'></span>
                        {{item.likeNum>999?'999+':item.likeNum}}
                      </div>
                    </div>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <!-- 个人案例 -->
        <div class='project-box' v-if='masterItem.al.length > 0'>
          <div class='project-title'><span></span>{{masterItem.gender == '女'?'她':'他'}}的案例</div>
          <div class='projec-list'>
            <swiper :options='swiperOption' class='swiper'>
              <swiper-slide class='swiper-slide' v-for='(item, index) in masterItem.al' :key='index'>
                <img :src="item.picPath?resourceURL + item.picPath:'../../static/image/design_def.png'" class='case-img' @click='goCaseDetail(item.caseId)'>
                <div class='footer'>
                  <div class='name'>{{item.caseTitle}}</div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
    </div>
    <!-- 跟多红人 -->
    <div class='more-box gradient'>
      <div class='title-box'><span></span>更多红人大咖<span></span></div>
      <div class='more-list'>
        <div class='more-item' v-for='(item, index) in more' :key='index' @click='routerToShopDetails(item.id)'>
          <img :src="item.img" alt="">
          <div class='name'>{{item.name}}</div>
          <div class='region'>{{item.region}}</div>
        </div>
      </div>
      <div class='title-box'><span></span>我也要上红人榜<span></span></div>
      <div class='form-box'>
        <input type="text" placeholder="请输入姓名" maxlength="20" v-model="userName">
        <div :class='city?"city city-color":"city"' @click='selectCity'>{{city?city.provinceName + city.cityNamea : '所在地区'}}<span></span></div>
        <input type="text" placeholder="请输入联系电话" v-model="userPhone">
        <div class='btn' @click='goIdentification'>认证随选网设计师</div>
      </div>
    </div>
    <!-- 异常提示 -->
    <div class='anomaly' v-if='isAnomaly'><span>{{anomalyText}}</span></div>
    <!-- 预约弹窗 -->
    <appointment 
      v-if='siShowAppointment' 
      :isIdentification='isIdentification'
      :userId='userId'
      :shopId='shopId'
      :userAppointmentObj='userAppointmentObj'
      @showPromptDialogBox='showPromptDialogBox'
      @goAppointment='goAppointment'></appointment>
    <!-- 选择城市 -->
    <awesome-picker 
      ref="picker" 
      :data='picker.cityList'
      colorConfirm='#29cccc'
      @confirm='confirmCity'>
    </awesome-picker>
  </div>
</template>

<script>
/* 组件方式引用 */
import 'swiper/dist/css/swiper.css'
import appointment from '@/components/appointment' //预约
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { indexMixin } from '@/mixin'
import { mapGetters } from 'vuex'
import { setInterval, clearInterval } from 'timers'
export default {
  name: 'pernolPublicity',
  mixins: [indexMixin],
  data () {
    return {
      swiperOption: {
          height: 615,
          speed: 500,//切换速度
          watchOverflow: true, //当没有足够的slide切换时，例如只有1个slide（非loop），swiper会失效且隐藏导航等。默认不开启这个功能。
          loop: false,//开启循环模式
          slidesPerView: 1,
          spaceBetween: 15,
          preventClicksPropagation: true,//阻止click冒泡。拖动Swiper时阻止click事件。
          simulateTouch: false,//鼠标模拟手机触摸。默认为true，Swiper接受鼠标点击、拖动。
          pagination: {
            el: '.swiper-pagination',
          },
          on: {
            touchEnd: function (event) {
              //你的事件
            },
          }
      },
      city: null,
      picker: {
        defaultCity: [
          {index: 0, value: 'A'},
          {index: 1, value: 'A-b'},
        ],
        cityList:[],
      },
      userAppointmentObj: {
          verificationCode: '',
          appointmentName: '',
          appointmentPhone: ''
      },
      shopId: '',
      siShowAppointment: false,
      isIdentification: false,
      isAnomaly: false,
      anomalyText: '',
      hintText: '',
      userName: '',
      userPhone: ''
    }
  },
  computed: {
    ...mapGetters(['userId']),
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    userInputFlag () { // 成为网红的表单
      let phoneFlag = /^1[345789]\d{9}$/.test(this.userPhone), 
          nameFlag = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(this.userName)
      !(phoneFlag && this.userName) ? (this.hintText = !nameFlag ? '请输入名称' : '请输入正确的手机号') : null
      return phoneFlag && this.userName
    },
  },
  components: {
    swiper,
    swiperSlide,
    appointment
  },
  created: function () {
    document.title = '红人新势力'
    this.init() // 初始化
  },
  methods: {
    init() {
      this.getCityList(); // 获取城市信息
      this.disposePlanList(); // 获取方案
      this.getUserMessage(); // 获取用户信息
    },
    routerToShopDetails (id) {
      this.isMiniprogram ? wx.miniProgram.navigateTo({ url: `/pages/decoration/companyDetail/companyDetail?id=${id}` }) : null
    },
    goCaseDetail(id) {
      console.log(this.isMiniprogram)
      this.isMiniprogram ? wx.miniProgram.navigateTo({ url: `/pages/caseDetail/caseDetail?id=${id}` }) : null
    },
    go720(planRecommendedId) {
      console.log(planRecommendedId)
      //let token = sessionStorage.getItem('token')
      let url = `${this.recommendCaseRouterUrl}token=${JSON.parse(sessionStorage.getItem('token'))}&customReferer=https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html&planId=${planRecommendedId}&routerQueryType=seven&operationSource=1&platformCode=brand2c&isRender=0&platformNewCode=miniProgram`
       window.location.href = url
        // =
        // `${this.recommendCaseRouterUrl}
        //   token=${token}
        //   &platformCode=brand2c
        //   &operationSource=1
        //   &planId=${planRecommendedId}
        //   &routerQueryType=seven
        //   &routerQueryType=seven&customReferer=https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html
        //   &platformNewCode=miniProgram&formId=the`
        // platformCode=brand2c
        // &operationSource=1
        // &planId=${planRecommendedId}
        // &routerQueryType=seven&customReferer=https%3A%2F%2Fservicewechat.com%2Fwx0d37f598e1028825%2Fdevtools%2Fpage-frame.html
        // &platformNewCode=miniProgram
        // &formId=the%20formId%20is%20a%20mock%20one
        // &isRender=0
        // &shopId=135
        // &isGoods=
    },
    /**获取用户信息*/
    getUserMessage () {
      this.API.getUserMessage({ id: this.userId}).then(res => {
        if (res.obj) {
          this.userAppointmentObj.appointmentName = res.obj.nickName
          this.userAppointmentObj.appointmentPhone = res.obj.mobile
        }
      })
    },
    /**处理方案列表 */
    disposePlanList() {
      this.masterList.forEach((item, index) => {
        this.getRecommendationplan({companyId: item.companyId, shopId: item.shopId, index: index});
        this.getShopHeadPic({shopId: item.shopId, platformValue: 2}, index);
      })
    },
    getShopHeadPic(param, index){
      this.API.getShopHeadPic(param).then(res => {
          this.masterList[index].userPicPath = res.data.logoUrl;
      });
    },
    /**请求设计师数据 */
    getRecommendationplan(obj) {
      // 方案
      this.API.getRecommendationplan({
        "recommendationPlanSearchVo":{
          "companyId": obj.companyId,
          "shopId": obj.shopId,
          "displayType":"decorate",
          "platformCode":"selectDecoration",
          "enterType":"shop"
        },
        "pageVo":{"pageSize": 10,"start": 1}
      }).then(res => {
        if (res.datalist) {
          this.masterList[obj.index].plan = res.datalist
          this.masterList[obj.index].plan.sort((a, b) => {
            return b.likeNum - a.likeNum
          })
        }
      })
      // 案例
      this.API.getCase({pageNo: 1, pageSize: 10, shopId: obj.shopId}).then(res => {
          console.log(res)
          if (res.datalist) {
            this.masterList[obj.index].al = res.datalist
            this.masterList[obj.index].al.sort((a, b) => {
            return b.browseCount - a.browseCount
          })
          }
      })
    },
    /**点赞收藏 */
    isCollectOrLike (item, index, type, masterIndex) { // 收藏点赞
      this.API[type === 'isFavorite' ? 'isFavoriteCase' : 'isLikeCase']({
        status: item[type] === 0 ? 1 : 0,
        recommendId: type === 'isFavorite' ? item.planRecommendedId : undefined,
        designId: type === 'isFavorite' ? undefined : item.planRecommendedId,
        designPlanType: item.spaceFunctionId == 13 ? 2 : 1
      }).then(res => {
        let text = (item[type] === 1 ? '取消' : '') + (type === 'isFavorite' ? '收藏' : '点赞') + (res.success ? '成功' : '失败')
        if (res.success) {
          console.log(masterIndex)
          console.log(this.masterList[masterIndex].plan[index][type])
          let flag = this.masterList[masterIndex].plan[index][type] === 0
          this.masterList[masterIndex].plan[index][type] = flag ? 1 : 0
          this.masterList[masterIndex].plan[index][type === 'isFavorite' ? 'collectNum' : 'likeNum'] += flag ? 1 : -1
        }
        // this.showPromptDialogBox(text)
      })
    },
    /**请求城市列表 */
    getCityList() {
      this.API.getAllCityData().then(res => {
        res.status && res.obj ? (this.$set(this.picker, 'cityList', this.setCityData(res.obj))) : null
      })
    },
    /**处理城市列表数据 */
    setCityData (data = []) {
      return data.map((value, index) => {
        return {
          value: value.areaName,
          children: value.baseAreaVos.map((child, count) => { child.baseAreaVos = []; return { value: child.areaName, index: count, code: child.areaCode}}),
          index: index,
          code: value.areaCode
        }
      })
    },
    confirmCity(e) {
      this.city = {
        provinceCode: this.picker.cityList[e[0].index].code,
        provinceName: this.picker.cityList[e[0].index].value,
        cityCode: this.picker.cityList[e[0].index].children[e[1].index].code,
        cityNamea: this.picker.cityList[e[0].index].children[e[1].index].value
      }
    },
    /**异常提示 */
    showPromptDialogBox(text) {
      this.isAnomaly = true,
      this.anomalyText = text.message,
      setTimeout(() => { 
        this.isAnomaly = false 
        if (text.userPhone) {
          this.userAppointmentObj.appointmentPhone = text.userPhone
          this.goAppointment()
        }
      }, 1500)
    },
    /**弹框出现禁止页面上下滑动 */
    stop () {
        document.body.style.overflow='hidden';
        document.body.style.height='100%';      
        document.html.style.overflow='hidden';
        document.html.style.height='100%';      
        document.addEventListener("touchmove", (e)=>{e.preventDefault(); e.stopPropagation();}, false);//禁止页面滑动
        // e.stopPropagation();
        //             e.preventDefault();
    },
    /**弹框关闭开启页面上下滑动 */
    move(){
        document.body.style.overflow='';//出现滚动条
        document.body.style.height='auto'; 
        document.html.style.overflow='';//出现滚动条
        document.html.style.height='auto'; 
        document.removeEventListener("touchmove", (e)=>{e.preventDefault()}, false);       
    },
    goAppointment(item) {
      this.siShowAppointment = !this.siShowAppointment
      if (item) {
        item == 'isIdentification' ? this.isIdentification = true :  this.shopId = item.shopId
      }
      if (this.siShowAppointment) {
        this.stop()
      } else {
        this.move()
      }
    },
    goIdentification() {
      if (!this.userInputFlag) {
        this.showPromptDialogBox({message: this.hintText})
        return
      }
      if (!this.city) {
        this.showPromptDialogBox({message: '请选择所在地区'})
        return
      }
      this.API.submitOnlineSensationForm({
          provinceCode: this.city.provinceCode,
          cityCode: this.city.cityCode,
          mobile: this.userPhone,
          userName: this.userName,
          businessType: 1,
          sourceType: 1
      }).then(res => {
          if (res.success) {
            this.goAppointment('isIdentification')
          } else {
            this.showPromptDialogBox({message: res.message})
          }
      })
    },
    /**打开选择器 */
    selectCity() {
      this.$refs.picker.show();
    },
  }
}
</script>

<style scoped lang='scss'>
 @import '../css/personal-publicity.scss';
</style>
