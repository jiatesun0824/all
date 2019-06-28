// pages/yuandan-activity/yuandan-activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yuanDanActivityUrl: getApp().sxwSqueezePage + 'nydact?',
    staticImageUrl: getApp().staticImageUrl
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },
  init() {
    this.setData({ yuanDanActivityUrl: this.data.yuanDanActivityUrl + 'token=' + wx.getStorageSync('token') }) 
    console.log(this.data.yuanDanActivityUrl, 'yuanDanActivityUrl')
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
  onShareAppMessage: function (res) {
    return {
      title: '新年到红包到',
      path: "/pages/home/home?shareType=active&url=" + encodeURIComponent('/pages/yuandan-activity/yuandan-activity'),
      imageUrl: `${this.data.staticImageUrl}share_pic_redbag.png`,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})