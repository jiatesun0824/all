let mySplitUrl = getApp().mySplitUrl, myCompoundUrl = getApp().myCompoundUrl, $App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webUrl: '',
    initialUrl: getApp().threeHouseUrl,
    staticImageUrl: getApp().staticImageUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options)
  },
  init(options) {
    let item = JSON.parse(options.item)
    console.log(item, '我是item')
    let routerParams = {
      houseId: item.houseId,
      uuid: item.vrResourceUuid,
      token: wx.getStorageSync('token'),
      planId: item.newFullHousePlanId,
      operationSource: 0,
      platformCode: 'brand2c',
      mainTaskId: item.mainTaskId,
      customReferer: 'https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html',
      platformNewCode: 'miniProgram',
      isRender: 0,
      isTask: 1,
      taskType: 3,
      uid: wx.getStorageSync('uuid'),
      aid: wx.getStorageSync('appId')
    }
    Object.keys(routerParams).forEach((value) => { this.data.initialUrl += `${value}=${routerParams[value]}&` })
    console.log(this.data.initialUrl, 'weburl')
    this.setData({ webUrl: this.data.initialUrl})
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
    $App.sd.track("pageview", {});
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
  // onShareAppMessage: function (res) {
  //   let that = this
  //   let item = mySplitUrl(res.webViewUrl)
  //   delete item.token
  //   delete item.url
  //   let path = `/pages/designMyhome/designMyhome?item=${JSON.stringify(item)}`
  //   if (res.from === 'menu') {
  //     return {
  //       title: '我在随选网设计了一套方案，分享给你看看',
  //       imageUrl: `${this.data.staticImageUrl}wechat_share_02.png`,
  //       path: path,
  //       success(res) {
  //         console.log(path, 'res')
  //       },
  //       fail(err) {
  //         console.log(err, 'err')
  //       }
  //     }
  //   }
  // }
})