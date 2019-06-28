// pages/desginType/desginType.js
let API = getApp().API, $App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 大数据埋点
  bigDataSellingPoints() {
    $App.sd.track("pageview", {});
  },
  goHouse(){
    $App.sd.track("btnclick", { "btnid": "goHouse" });
    wx.navigateTo({
      url: '/pages/plan/selection-house-type/selection-house-type?navaPage=first',
    })
  },
  goPlan(){
    $App.sd.track("btnclick", { "btnid": "goPlan" });
    wx.navigateTo({
      url: '/pages/plan/selection-scheme/selections-scheme?navaPage=first',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getContent() {
    let that = this
    API.getMyDegianPlan({
      pageSize: 5,
      curPage: 1,
      houseId: '',
      state: 1,
    })
      .then(res => {
        if (res.success) {
          this.setData({
            planList: res.datalist
          })
          if(res.datalis.length>0){
            return
          }else{
            API.getUserHouseTypeList({
              pageSize: 5,
              curPage: 1
            })
              .then(res => {
                if (res.obj) {
                  if (res.obj.houselist.length > 0) {
                    wx.navigateTo({
                      url: '/pages/plan/selection-house-type/selection-house-type?navaPage=first',
                    })
                  }else{
                    wx.navigateTo({
                      url: '/pages/plan/case-house-type/case-house-type?type=search',
                    })
                  }
                }
              })
          }
        }
      })
  },
  getSearchResluts: function (message) {
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
        } 
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.bigDataSellingPoints()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})