// pages/plan/selection-scheme/selections-scheme.js
let API = getApp().API,
  myForEach = getApp().myForEach;
let $App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'myPlan',
    conditionActive: -1,
    childConditionActive: [0, -1, -1],
    staticImageUrl: getApp().staticImageUrl,
    resourcePath: getApp().resourcePath,
    getCaseParams: {
      spaceType: '',
      designPlanStyleId: '',
      spaceArea: ''
    },
    curPage: 1,
    pageSize: 10,
    totalCount: 0,
    favoriteRequest: true,
    collectRequest: true,
    emptyPageObj: {},
    recommendCaseList: [],
    spaceList: [],
    areaList: [],
    styleList: [],
    isCheck: -1,
    planList: [],
    planHouseType: '',
    spaceFuctionId: '',
    planType: '',
    selectIndex: -1,
    navaPage:'',
    change:'',
    content:'',
    editFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // new $App.newNav() // 注册快速导航组件
    this.getContent()
    if (options.navaPage){
      this.setData({
        navaPage: options.navaPage
      })
    }
    if (options.change){
      this.setData({
        change: options.change
      })
    }
    if(options.content){
      this.setData({
        content:options.content
      })
    }
    if (options.isEdit){
      this.setData({
        editFlag:true
      })
    }
  },
  // 获取内容区数据
  getContent() {
    API.getMyDegianPlan({
      pageSize: this.data.pageSize,
      curPage: this.data.curPage,
      houseId:'',
      state: 1,
      beDecorate:1
    })
      .then(res => {
        if (res.success) {
          this.setData({
            planList: res.datalist
          })
        }
        if(!res.datalist){
          wx.navigateTo({
            url: '/pages/plan/case-house-type/case-house-type?type=search',
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("9987897987")
    console.log(this.data.content)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'menu') {
      return $App.shareAppMessageObj
    }
  },

  // 获取方案筛选条件

  // 上拉加载
  onReachBottom() {

    this.setData({
      pageSize: this.data.pageSize + 10
    })
    this.getContent()
  },
  switchCheck(e) {
    let index = e.currentTarget.dataset.index
    if (index === this.data.isCheck) {
      index = -1
    }
    $App.sd.track("btnclick", { "btnid": "switchCheck" });
    this.setData({
      isCheck: index
    })
  },
  confirmBtn() {
    if (this.data.isCheck==-1){
      wx.showToast({
        title: '请选择方案',
        icon:'none'
      })
      return;
    }
    $App.sd.track("btnclick", { "btnid": "confirmBtn" });
    if (!this.data.editFlag) {
      if (this.data.navaPage != 'comment'){
        let plan = this.data.planList[this.data.isCheck],
        planId = plan.businessId || plan.newFullHousePlanId
        let planType;
        this.data.planList[this.data.isCheck].businessId ? planType =3 : planType=4
        wx.navigateTo({
          url: '/pages/publishDesgin/publishDesgin?planId=' + planId + '&planImg=' + plan.planPicPath + '&planName=' + plan.designName + '&planTime=' + plan.gmtCreate+'&planFlag=true&planType='+planType+'&content='+this.data.content,
        })
      }else{
        let planType,
          flag = true,
          pages = getCurrentPages(), //当前页面 
          prevPage = pages[pages.length - 2]; //上一页面
        // if (this.data.type == 'myPlan') {
        this.data.planList[this.data.isCheck].planHouseType == 1 ? planType = 3 : planType = 4
        prevPage.setData({
          addPlanId: this.data.planList[this.data.isCheck].newFullHousePlanId || this.data.planList[this.data.isCheck].businessId,
          addPlanImg: this.data.planList[this.data.isCheck].planPicPath,
          addPlanTitle: this.data.planList[this.data.isCheck].designName,
          planType: planType,
          addPlanItem: this.data.planList[this.data.isCheck]
        })
        wx.navigateBack({
          delta: 1
        })
      }
    } else {
     
        let planType,
          flag = true,
          pages = getCurrentPages(), //当前页面 
          prevPage = pages[pages.length - 2]; //上一页面
        // if (this.data.type == 'myPlan') {
        this.data.planList[this.data.isCheck].planHouseType == 1 ? planType = 3 : planType = 4
        prevPage.setData({
          planId: this.data.planList[this.data.isCheck].newFullHousePlanId || this.data.planList[this.data.isCheck].businessId,
          planImg: this.data.planList[this.data.isCheck].planPicPath,
          planName: this.data.planList[this.data.isCheck].designName,
          planType: planType,
          planTime: this.data.planList[this.data.isCheck].gmtCreate
        })
        wx.navigateBack({
          delta: 1
        })
      
    }
  },

  /*跳转720*/
  go720(e) {
    let type = e.currentTarget.dataset.type,
      item = e.currentTarget.dataset.item,
      routerQueryType = null,
      webUrl = null,
      sevenObj = null
    if (type === 'video') {
      API.getRecommendedVideoId({
          planRecommendedId: item.designPlanRecommendId || item.planRecommendedId,
          remark: type
        })
        .then(res => {
          if (res.success) {
            return res.datalist[0].id
          } else {
            return false
          }
        })
        .then(res => {
          if (res) {
            API.getRecommendedVideoMessage({
                thumbId: res
              })
              .then(res => {
                res.success ? this.toVideo(res.obj.url) : wx.showToast({
                  title: '打开失败',
                  icon: 'none'
                })
              })
          }
        })
    } else {
      type === '720' ? routerQueryType = 'seven' : routerQueryType = 'roam'
      item.fullHousePlanUUID ? (webUrl = $App.wholeHouseUrl, sevenObj = {
          uuid: item.fullHousePlanUUID,
          embedded: 1
        }) :
        (webUrl = $App.sevenUrl, sevenObj = {
          token: wx.getStorageSync('token'),
          platformCode: 'brand2c',
          operationSource: 1,
          planId: item.designPlanRecommendId || item.planRecommendedId,
          routerQueryType: routerQueryType,
          customReferer: $App.wxUrl,
          platformNewCode: 'miniProgram'
        })
      for (let key in sevenObj) {
        webUrl += key + '=' + sevenObj[key] + '&'
      }
      getApp().data.webUrl = webUrl
      wx.navigateTo({
        url: '/pages/web-720/web-720'
      })
    }
  },
  toThreeD(e) {
    let routerQueryType = e.currentTarget.dataset.type,
      item = e.currentTarget.dataset.item,
      webUrl = null,
      sevenObj = null
    if (item.planHouseType == 3 && !item.vrResourceUuid) {
      wx.showModal({
        title: '提示',
        content: '该方案正在渲染中，请稍后~',
        confirmText: '确定',
        cancelText: '取消',
        cancelColor: '#999999',
        confirmColor: '#ff6419'
      })
      return;
    }
    item.newFullHousePlanId ? (webUrl = $App.wholeHouse3dUrl, sevenObj = {
        uuid: item.vrResourceUuid,
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        operationSource: 0,
        planId: item.newFullHousePlanId,
        routerQueryType: 'seven',
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram',
        // formId: formId,
        isRender: 0,
        isTask: 1,
        houseId: item.houseId || 0,
        taskType: item.planRenderType
      }) :
      (webUrl = this.data.sevenUrl, sevenObj = {
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        operationSource: 0,
        planId: item.businessId,
        routerQueryType: routerQueryType,
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram',
        isTask: 1,
        taskType: item.planRenderType,
        houseId: item.houseId || 0
      })
    for (let key in sevenObj) {
      webUrl += key + '=' + sevenObj[key] + '&'
    }
    getApp().data.webUrl = webUrl
    wx.navigateTo({
      url: '/pages/web-720/web-720'
    })
  },
})