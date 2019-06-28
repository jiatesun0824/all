// pages/my-exchange-news/my-exchange-news.js
import {
  resourcePath
} from '../../utils/config.js'
let API = getApp().API;
let $App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcePath: resourcePath,
    staticImageUrl: $App.staticImageUrl,
    messageList: [],
    pageSize: 10,
    messageTypeString: ["收藏", "点赞", "回复"],
    messageBlockType: ["", "问答", "话题", "大咖分享", "设计改造"],
    emptyPageObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  toDetail(e) {
    let id = e.currentTarget.dataset.item.topicId,
      type = e.currentTarget.dataset.item.blockType,
      id2 = e.currentTarget.dataset.item.id
    let parms = [];
    parms.push(id2)
    API.getMessageRead(parms).then(res => {
      if (res.success) {
        if (type == 1) {
          wx.navigateTo({
            url: `/pages/interactiveZone/interlocutionDetail/interlocutionDetail?id=${id}`
          })
        } else if (type == 2) {
          wx.navigateTo({
            url: `/pages/interactiveZone/topic/topic?id=${id}`,
          })
        } else if (type == 3) {
          wx.navigateTo({
            url: '/pages/articlesDetail/articlesDetail?id=' + id,
          })
        } else if (type == 4) {
          wx.navigateTo({
            url: '/pages/desginDetail/desginDetail?id=' + id,
          })
        }
      }
    })
  },
  getMessageList() {
    let params = {
      curPage: 1,
      pageSize: this.data.pageSize
    }
    API.getMessageList(params).then(res => {
      if (res.success) {
        let list = res.datalist;
        list.forEach(item => {
          console.log(item.headPic);
          if (item.headPic) {
            if (item.headPic.match('operationPlatform/robotManage/')) {
              item.headPic = `${this.data.resourcePath}${item.headPic}`
            }
          }

        })
        this.setData({
          messageList: list
        })
      } else {
        this.setData({
          messageList: [],
          emptyPageObj: {
            imgUrl: this.data.staticImageUrl + 'me_bg_no.png',
            title: '暂时还没有消息哦~',
          }
        });
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
    this.getMessageList()
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
      pageSize: this.data.pageSize + 5
    })
    this.getMessageList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})