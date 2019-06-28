// pages/plan/selection-house-type/selection-house-type.js
let API = getApp().API,
  myForEach = getApp().myForEach;
let $App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'myHouse',
    conditionActive: -1,
    childConditionActive: [0, -1, -1],
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
    staticImageUrl: getApp().staticImageUrl,
    useList: [],
    resourcePath: getApp().resourcePath,
    imgList: [],
    navaPage:'',
    change: '',
    content:'',
    editFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    new $App.newNav() // 注册快速导航组件
    // this.getConditionMetadata() // 获取户型筛选条件  
    this.getSearchResluts()
    if (options.navaPage){
      this.setData({
        navaPage: options.navaPage
      })
    }
    if (options.change) {
      this.setData({
        change: options.change
      })
    }
    if (options.content) {
      this.setData({
        content: options.content
      })
    }
    if (options.isEdit) {
      this.setData({
        editFlag: true
      })
    }
  },
  getSearchResluts: function(message) {
    let that = this
    API.getUserHouseTypeList({
        pageSize: that.data.pageSize,
        curPage: 1
      })
      .then(res => {
        if (res.obj) {
          for (let i = 0; i < res.obj.houselist.length; i++) {
            res.obj.houselist[i].houseTypeStr = res.obj.houselist[i].houseTypeStr.substr(0, 6)
            if (res.obj.houselist[i].totalArea != null) {
              res.obj.houselist[i].totalArea = res.obj.houselist[i].totalArea + 'm²'
            }
          }

          if (res.obj.houselist.length > 0) {
            this.setData({
              useList: res.obj.houselist
            })
          }
        } else {
          that.setData({
            message: res.message
          })
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
  onReachBottom: function() {
    this.setData({
      pageSize: pageSize+=5
    })
    if (this.data.type ='myHouse'){
      this.getSearchResluts()
    }else{
      this.getRecommendCaseList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'menu') {
      return $App.shareAppMessageObj
    }
  },
  // 顶部切换
  changeType(e) {
    this.setData({
      type: e.currentTarget.dataset.type,
      isCheck: -1
    })
    this.data.type == 'myHouse' ? this.getSearchResluts() : this.getRecommendCaseList()
  },
  // 收藏tab切换
  switchCondition(e) {
    let index = e.currentTarget.dataset.index
    if (index === this.data.conditionActive) {
      index = -1
    }
    this.setData({
      conditionActive: index
    })
  },
  closeCaseCondition() {
    this.setData({
      conditionActive: -1
    })
  },
  // 上拉加载
  onReachBottom() {
    if (this.data.pageSize >= this.data.totalCount) {
      return
    } else {
      this.setData({
        pageSize: this.data.pageSize + 10
      })
    }
    this.getRecommendCaseList()
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
    if (this.data.isCheck == -1) {
      wx.showToast({
        title: '请选择户型',
        icon: 'none'
      })
      return;
    }
    $App.sd.track("btnclick", { "btnid": "confirmBtn" });
    if (!this.data.editFlag){
      let house = this.data.useList[this.data.isCheck],
        houseTitle = this.data.useList[this.data.isCheck].houseCommonCode ? this.data.useList[this.data.isCheck].houseCommonCode : this.data.useList[this.data.isCheck].houseName
      wx.navigateTo({
        url: '/pages/publishDesgin/publishDesgin?houseId=' + house.id + '&houseImg=' + house.thumbnailPath + '&houseTitle=' + houseTitle + '&houseTime=' + house.gmtModified+'&houseFlag=true&content='+this.data.content,
      })
    }else{
    let planType;
    let pages = getCurrentPages(); //当前页面 
    let prevPage = pages[pages.length - 2]; //上一页面
    prevPage.setData({
      houseId: this.data.useList[this.data.isCheck].id,
      houseImg: this.data.useList[this.data.isCheck].thumbnailPath,
      houseTitle: this.data.useList[this.data.isCheck].houseCommonCode ? this.data.useList[this.data.isCheck].houseCommonCode : this.data.useList[this.data.isCheck].houseName,
      houseTime: this.data.useList[this.data.isCheck].gmtCreate
    })
    wx.navigateBack({
      delta: 1
    })
    }
  },
  examineImg(e) {
    let imgArr = [];
    for (let i = 0, len = this.data.useList.length; i < len; i++) {
      imgArr.push(this.data.resourcePath + this.data.useList[i].largeThumbnailPath);
    }
    this.setData({
      imgList: imgArr
    });
    wx.previewImage({
      //当前显示下表
      current: this.data.imgList[e.currentTarget.dataset.index],
      //数据源
      urls: this.data.imgList
    })
  },
})