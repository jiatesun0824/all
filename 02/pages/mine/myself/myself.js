let $App = getApp(),
  API = getApp().API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticImageUrl: $App.staticImageUrl,
    userInfo: '',
    wxInfo: '',
    notLoginImgUrl: '',
    isgetPhone: false,
    issBindingMobile: false,
    // renderMessageIsRead: 1, // Socket消息
    timer: null,
    getSystemNewsListTimer: null,
    isShow: true,
    // 埋点数据
    previousPath: '',
    nowPath: '',
    planNum: '',
    isShow: true,
    isRead: true
  },
  commentIsRead: 1, //评论消息
  userChatIsRead: 1, //聊天消息
  isReadInteractiveLast: 1, // 互动消息
  //埋点
  sellingPoint(event) {
    let page = getCurrentPages(),
      previousPath = page.length > 1 ? page[page.length - 2].route : '',
      nowPath = page[page.length - 1].route
    API.sellingPoint({
      uid: wx.getStorageSync('openId'),
      cp: nowPath,
      lp: previousPath,
      e: event ? event : '',
      pt: '我的'
    })
  },
  goMyfavorite() {
    this.sellingPoint('my-favorite')
  },
  closeMyInteractionBox() {
    this.setData({
      isShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  seeKHUxing() {
    $App.sellingPoint(API, 'MineseeKHUxing', this.data.nowPath, this.data.previousPath, '我的');
  },
  myHUxing() {
    $App.sellingPoint(API, 'MinemyHUxing', this.data.nowPath, this.data.previousPath, '我的');
  },
  myPublish() {
    $App.sellingPoint(API, 'MinemyPublish', this.data.nowPath, this.data.previousPath, '我的');
  },
  onLoad: function(options) {
    // rzd 埋点 190214 start
    let page = getCurrentPages(), previousPath = page.length > 1 ? page[page.length - 2].route : '',
      nowPath = page[page.length - 1].route;
    this.setData({
      previousPath: previousPath,
      nowPath: nowPath
    })
    // rzd 埋点 190214 end
    wx.hideShareMenu();
    this.init() // 初始化
    this.sellingPoint();
  },
  init() { // 初始化
    new $App.bindingPhone()
    this.setData({
      wxInfo: getApp().globalData
    })
    getApp().mySocket.on('im_unread_msg_event', content => {
      this.setData({
        systemNewIsRead: 0
      })
    })
    // 互动区消息提醒
    getApp().mySocket.on('im_push_msg_event', content => {
      if (content.msgCode == "PUSH_INTERACTIVE_MSG")
        this.setData({
          isRead: false
        })
    })
    this.getUserMessage() // 获取用户头像
  },
  getUserMessage() {
    getApp().globalData.userInfo && this.setData({
      wxInfo: getApp().globalData
    })
  },
  getInfo(e) {
    if (e.detail.userInfo) {
      getApp().globalData.userInfo = e.detail.userInfo;
    }
    this.setData({
      wxInfo: getApp().globalData
    })
    API.saveMinProNickName({
      nickName: e.detail.userInfo.nickName,
      headPic: e.detail.userInfo.avatarUrl,
      sex: e.detail.userInfo.gender,
      province: e.detail.userInfo.province,
      city: e.detail.userInfo.city
    })
  },
  routerToMyModule(e) { // 跳转至我的模块
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  isRead() {
    let arr = [
      API.commentMessage({
        curPage: 0,
        pageSize: 1,
        isRead: 0,
      }), //评论消息
      API.getUserChatList({
        userSessionId: wx.getStorageSync('uuid')
      }), //聊天消息
      API.getInteractiveLastTotal() // 互动消息
    ];
    Promise.all(arr)
      .then((results) => {
        {
          if (results[0].obj) {
            this.commentIsRead = results[0].obj[0].isRead;
          } else {
            this.commentIsRead = 1
          }
        } {
          if (results[1].data) {
            let flag = 1;
            for (let i = 0; i < results[1].data.length; i++) {
              if (results[1].data[i].unreadMsg > 0) {
                flag = 0;
                break;
              }
            }
            this.userChatIsRead = flag
          }
        } {
          if (results[2].success) {
            this.isReadInteractiveLast = results[2].totalCount;
          }
        }
        this.setData({
          isRead: this.userChatIsRead == 1 && this.isReadInteractiveLast == 0,
        })
      })
  },

  //方案数量
  getUserPlanCount() {
    API.getUserPlanCount().then(res => {
      if (res.status) {
        this.setData({
          planNum: res.obj
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onShowInit() // 初始化
  },
  onShowInit() { // onshow初始化
    this.isRead()
    this.getUserInfo()
    this.getIsBindingMobile()
    this.getUserPlanCount()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'menu') {
      return $App.shareAppMessageObj
    }
  },
  getUserInfo: function() {
    API.getUserDuBiMessage()
      .then(res => {
        this.setData({
          userInfo: res.obj
        })
      })
  },
  showBIndingPhoneBox() { // 打开绑定手机
    this.bindingPhoneShow()
  },
  getIsBindingMobile() {
    // 检验手机号是否存在
    let url = `/v2/user/center/isUserMobileBinded`
    API.getIsBindingMobile()
      .then(res => {
        if (res.success) {
          if (res.obj === 0) {
            this.setData({
              issBindingMobile: false
            })
          } else if (res.obj === 1) {
            this.setData({
              issBindingMobile: true
            })
          }
        } else {
          this.setData({
            issBindingMobile: false
          })
        }
      })
  },
  bindPhoneCallBack() {
    this.setData({
      issBindingMobile: true
    })
    this.getUserInfo()
  },
  toMyAccount() {
    wx.navigateTo({
      url: '/pages/mine/my-account/my-account',
    })
  }
})