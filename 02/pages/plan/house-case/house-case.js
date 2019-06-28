let myForEach = getApp().myForEach,
  mySplitUrl = getApp().mySplitUrl,
  myCompoundUrl = getApp().myCompoundUrl,
  $App = getApp(),
  API = getApp().API
import {
  shareTitle
} from '../../../utils/config.js';
import {
  emptyTemplate
} from '../../../component/emptyTemplate/emptyTemplate'
Page({
  emptyTemplate, // 无数据组件
  /**
   * 页面的初始数据
   */
  data: {
    staticImageUrl: $App.staticImageUrl,
    spaceList: [],
    areaList: [],
    styleList: [],
    types: 0,
    recommendCaseList: [],
    resourcePath: getApp().resourcePath,
    sevenUrl: getApp().sevenUrl,
    wholeHouseUrl: getApp().wholeHouseUrl,
    pageSize: 5,
    isShow: true,
    totalCount: 0,
    fitmentWayList: [],
    fitmentPriceList: [{ name: '全部', value: '' }],
    fitmentWayActive: 0,
    fitmentPriceActive: 0,
    decoratePriceList: [],
    showList: [],
    showChose: false,
    showChoseType: '',
    spaceTypeName: '客餐厅',
    styleName: '装修风格',
    fitmentWayName: '装修方式',
    fitmentPriceName: '装修价格',
    spaceType: 3,
    designPlanStyleId: '',
    decoratePriceType: '',
    extInfoList: [],
    // 埋点数据
    previousPath: '',
    nowPath: ''
  },
  kfViewBut() {
    $App.sellingPoint(API, 'plankfViewBut', this.data.nowPath, this.data.previousPath, '方案');
  },
  onLoad: function(options) {
    this.init(options)
    // rzd 埋点 190214 start
    let page = getCurrentPages(), previousPath = page.length > 1 ? page[page.length - 2].route : '',
      nowPath = page[page.length - 1].route;
    this.setData({
      previousPath: previousPath,
      nowPath: nowPath
    })
    $App.sellingPoint(API, '', this.data.nowPath, this.data.previousPath, '方案');
    // rzd 埋点 190214 end
  },
  init(options) { // 初始化
    let that = this
    this.getDesignplanconditionmetadata() // 获取空间
    this.isSevenShare(options) // 是否720分享
    this.getFitmentQuote() // 获取专修报价筛选条件
    new this.emptyTemplate() // 注册组件
    $App.userLoginStatus.then(res => {
      this.sellingPoint()
      $App.sellingPoint(API, '', this.data.nowPath, this.data.previousPath, '方案');
    })
    this.isComeFromCode(options) // 二维码扫码进入
    options.isExperience && wx.setStorageSync("isExperience", options.isExperience); // 砍价体验活动
  },
  isComeFromCode(options) { // 来源于二维码
    if (options.scene) {
      let scene = options.scene
      if (scene.includes('i') && scene.includes('t') && scene.includes('b') && scene.includes('s')) {
        this.comeFromGrass(options)
      } else {
        this.posterSharePanorama(options)
      }
      // switch(true) {
      //   case scene.includes('i') && scene.includes('t') && scene.includes('b') && scene.includes('s'): this.comeFromGrass(); 
      //   case scene.includes('id'): this.posterSharePanorama(options); break;
      // }
    }
  },
  posterSharePanorama(options) { // 720海报二维码
    if (options.scene) {
      API.getJsonData({
        id: options.scene
      }).then(res => {
        let shareTimer = setInterval(() => {
          if (wx.getStorageSync('token')) { // 获取token后再进行跳转  
            console.log(res, 'swq')
            getApp().data.webUrl = myCompoundUrl(Object.assign(JSON.parse(res.obj.jsonData), {
              token: wx.getStorageSync('token')
            }))
            wx.navigateTo({
              url: '/pages/web-720/web-720'
            })
            clearInterval(shareTimer)
          }
        }, 100)
      })
    }
  },
  comeFromGrass(options) { // 来源于通用版版本的二维码
    let scene = decodeURIComponent(options.scene), sceneObj = mySplitUrl(scene)
    getApp().data.webUrl = myCompoundUrl({
      url: getApp().grassSevenUrl,
      renderId: sceneObj.i,
      sceneType: sceneObj.t,
      planSourceType: sceneObj.s || '',
      hasChanged: sceneObj.b || '',
      qrCodeType: sceneObj.c || 0,
      customReferer: getApp().wxUrl,
      platformCode: 'miniProgram',
      platformNewCode: 'miniProgram',
      isRender: 0
    })
    wx.navigateTo({
      url: '/pages/web-720/web-720',
    })
  },
  routerToCaseDetails(e) {
    let id = e.currentTarget.dataset.id,
      type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/case-details/case-details?id=${id}&type=${type || 0}`
    })
  },
  getFitmentQuote() { // 获取装修报价筛选条件
    API.getFitmentQuote()
      .then(res => {
        let arr = []
        if (res.code === 200) {
          arr = res.list
          arr.unshift({
            name: '全部',
            sonList: [],
            value: ''
          })
          myForEach(arr, (value) => {
            value.sonList.unshift({
              name: '全部',
              value: ''
            })
          })
        }
        this.setData({
          fitmentWayList: arr,
        })
      })
  },
  isSevenShare(options) {
    if (options.item) { // 720
      let item = Object.assign(JSON.parse(options.item))
      item.url = decodeURIComponent(item.url)
      let shareTimer = setInterval(() => {
        if (wx.getStorageSync('token')) { // 获取token后再进行跳转       
          getApp().data.webUrl = myCompoundUrl(Object.assign(item, {
            token: wx.getStorageSync('token')
          }))
          console.log('中文焦点', getApp().data.webUrl)
          wx.navigateTo({
            url: '/pages/web-720/web-720'
          })
          clearInterval(shareTimer)
        }
      }, 100)
    } else if (options.url) { // 视频
      wx.navigateTo({
        url: '/pages/video/video?url=' + options.url
      })
    } else if (options.scene) { // 表示通用版本扫码
      // let scene = decodeURIComponent(options.scene), sceneObj = mySplitUrl(scene)
      // getApp().data.webUrl = myCompoundUrl({
      //   url: getApp().grassSevenUrl,8
      //   renderId: sceneObj.i,
      //   sceneType: sceneObj.t,
      //   planSourceType: sceneObj.s || '',
      //   hasChanged: sceneObj.b || '',
      //   customReferer: $App.wxUrl,
      //   platformCode: 'brand2c',
      //   platformNewCode: 'miniProgram'
      // })
      // wx.navigateTo({
      //   url: '/pages/web-720/web-720?type=grass',
      // })
    }
  },
  getDesignplanconditionmetadata() {
    $App.userLoginStatus.then(res => {
      this.getRecommendCaseList(this.setObj())
    })
  },
  onShow: function() {
    this.getConditionMetadata();
  },
  sellingPoint(event) {
    let page = getCurrentPages(),
      previousPath = page.length > 1 ? page[page.length - 2].route : '',
      nowPath = page[page.length - 1].route
    console.log(previousPath);
    API.sellingPoint({
      uid: wx.getStorageSync('openId'),
      cp: nowPath,
      lp: previousPath,
      e: event ? event : '',
      pt: '方案'
    })
  },
  onReachBottom: function() {
    if (this.data.pageSize < this.data.totalCount && this.data.isShow) {
      this.setData({
        pageSize: this.data.pageSize + 5
      })
      this.getRecommendCaseList(this.setObj())
    }
  },

  onPullDownRefresh: function() {
    if (!this.data.isShow)
      return;
    this.getConditionMetadata() // 获取方案筛选条件
    wx.stopPullDownRefresh() //在标题栏中显示加载
  },
  onShareAppMessage: function(res) {
    if (res.from === 'menu') {
      return {
        title: shareTitle,
        path: `/pages/plan/house-case/house-case`,
        success(res) {},
        fail(err) {}
      }
      // return $App.shareAppMessageObj

    }
  },
  getConditionMetadata() { // 获取方案筛选条件  
    API.getConditionMetadata()
      .then(res => {
        if (res.status) {
          let obj = res.obj.map((value) => {
            value.designPlanStyleVoList.unshift({
              styleName: '全部',
              styleCode: ''
            });
            return value
          })
          this.setData({
            spaceList: obj,
            areaList: obj[0].designPlanAreaList,
            styleList: obj[0].designPlanStyleVoList,
          })
          $App.userLoginStatus.then(res => {
            this.getRecommendCaseList(this.setObj())
          })
        } else {
          this.setData({
            spaceList: [],
            areaList: [],
            styleList: []
          })
        }
      })
  },
  getRecommendCaseList(o) { // 获取方案列表
    let obj = {
      spaceType: o ? o.spaceType : '',
      designPlanStyleId: o ? o.designPlanStyleId : '',
      decoratePriceType: this.data.fitmentWayActive == 0 ? '' : this.data.fitmentWayList[this.data.fitmentWayActive].value,
      decoratePriceRange: this.data.fitmentPriceActive == 0 ? '' : this.data.fitmentPriceList[this.data.fitmentPriceActive].value,
    }
    // if (this.data.fitmentPriceActive) obj.decoratePriceType = this.data.fitmentWayList[this.data.fitmentWayActive].value;
    let recommendationPlanSearchVo = {
      houseType: obj.spaceType || 3, // 默认请求客餐厅数据，181122随选网UI调整去掉全部
      designStyleId: obj.designPlanStyleId || '',
      displayType: 'decorate',
      decoratePriceType: obj.decoratePriceType,
      decoratePriceRange: obj.decoratePriceRange,
      platformCode: 'selectDecoration'
    }
    let parm = {
      "recommendationPlanSearchVo": recommendationPlanSearchVo,
      "pageVo": {
        start: 0,
        pageSize: this.data.pageSize,
      }
    }
    //shopPlatformType: 2,
    API.getNewRecommendCaseList(parm).then(res => {
      let flags = res.datalist && res.success;
      this.setData({
        showList: flags ? res.datalist : [],
        totalCount: flags ? res.totalCount : 0
      })
      this.emptyTemplateShow(flags ? 'hide' : 'show')
    })
  },
  showChoseClose() {
    this.setData({
      showChose: false,
    })
  },
  setObj() {
    let obj = {
      spaceType: this.data.spaceType || 3,
      designPlanStyleId: this.data.designPlanStyleId || '',
      decoratePriceType: this.data.fitmentWayActive,
    }
    this.showChoseClose();
    return obj;
  },
  styleTypeFun: function(e) {
    let dataset = e.currentTarget.dataset,
      styleList = this.data.spaceList[dataset.index].designPlanStyleVoList;
    this.setData({
      spaceType: dataset.info.houseType || 3,
      spaceTypeName: dataset.info.houseName || '客餐厅',
      styleName: '装修风格',
      designPlanStyleId: '',
      styleList
    })
    this.getRecommendCaseList(this.setObj())
  },
  styleCodeFun: function(e) {
    let styleName = e.currentTarget.dataset.info.styleName
    this.setData({
      styleName: styleName == '全部' ? '装修风格' : styleName,
      designPlanStyleId: e.currentTarget.dataset.info.styleCode || '',
    })
    this.getRecommendCaseList(this.setObj())
  },
  switchFitmentWay(e) { // 切换装修方式
    let fitmentWayName = e.currentTarget.dataset.info.name
    this.setData({
      fitmentWayName: fitmentWayName == '全部' ? '装修方式' : fitmentWayName,
      fitmentWayActive: e.currentTarget.dataset.info.value,
      fitmentPriceList: e.currentTarget.dataset.info.sonList,
      fitmentPriceName: '装修价格',
      fitmentPriceActive: 0
    })
    this.getRecommendCaseList(this.setObj())
  },
  switchFitmentPrice(e) {  // 切换装修价格
    let fitmentPriceName = e.currentTarget.dataset.info.name
    this.setData({
      fitmentPriceName: fitmentPriceName == '全部' ? '装修价格' : fitmentPriceName,
      fitmentPriceActive: e.currentTarget.dataset.info.value
    })
    this.getRecommendCaseList(this.setObj())
  },
  showChose(e) {
    let types = e.currentTarget.dataset.types;
    let flag = types == this.data.types
    this.setData({
      showChose: flag ? !this.data.showChose : true,
      types: types
    })
    if (types / 1 == 1) {
      $App.sellingPoint(API, 'planshowChoseSpaceType', this.data.nowPath, this.data.previousPath, '方案');
    } else if (types / 1 == 2) {
      $App.sellingPoint(API, 'planshowChoseStyleType', this.data.nowPath, this.data.previousPath, '方案');
    } else if (types / 1 == 3) {
      $App.sellingPoint(API, 'planshowChoseFangshiType', this.data.nowPath, this.data.previousPath, '方案');
    } else if (types / 1 == 4) {
      $App.sellingPoint(API, 'planshowChosePrice', this.data.nowPath, this.data.previousPath, '方案');
    }
  },
})