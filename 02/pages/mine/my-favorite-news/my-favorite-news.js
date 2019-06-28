// pages/mine/my-favorite-news/my-favorite-news.js
import {
  resourcePath
} from '../../../utils/config.js'
let API = getApp().API
let $App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticImageUrl: getApp().staticImageUrl,
    resourcePath: getApp().resourcePath,
    itemType:1,
    showList:[],
    emptyPageObj: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
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
    this.getList();
    this.bigDataSellingPoints()
  },
  // 大数据埋点
  bigDataSellingPoints() {
    $App.sd.track("pageview", {});
  },
  getList(){
    let that = this;
    let parms={
      type: that.data.itemType,
      pageSize:10,
      curPage:1
    }
    if (that.data.itemType == 1){
      API.getFavoriteAsk(parms).then(res=>{
        if (res.success && res.totalCount > 0){
          that.setData({
            showList: res.datalist
          })
        }else{
          that.setData({
            showList:[],
            emptyPageObj: {
              imgUrl: that.data.staticImageUrl + 'me_bg_no.png',
              title: `您还没有收藏问答\n看看别人碰到了什么问题？`,
              btnText: '去看看',
              url: '/pages/interactiveZone/interactiveZone?tabIndex=' + 0,
              navigateTo: true
            }
          })
        }
      })
    }else if (that.data.itemType==2){
      API.getFavoriteTopic(parms).then(res => {
        if (res.success && res.totalCount > 0) {
          that.setData({
            showList: res.datalist
          })
        } else {
          that.setData({
            showList: [],
            emptyPageObj: {
              imgUrl: that.data.staticImageUrl + 'me_bg_no.png',
              title: `您还没有收藏话题\n去互动区看看，大家都在热议什么~`,
              btnText: '去看看',
              url: '/pages/interactiveZone/interactiveZone?tabIndex=' + 0,
              navigateTo: true
            }
          })
        }
      })
    } else if (that.data.itemType == 3) {
      API.getFavoriteShare(parms).then(res => {
        if (res.success && res.totalCount > 0) {
          that.setData({
            showList: res.datalist
          })
        } else {
          that.setData({
            showList: [],
            emptyPageObj: {
              imgUrl: that.data.staticImageUrl + 'me_bg_no.png',
              title: `您还没有收藏大咖分享\n互动区很多精彩大咖分享，去看看吧`,
              btnText: '去看看',
              url: '/pages/interactiveZone/interactiveZone?tabIndex=' + 1,
              navigateTo: true
            }
          })
        }
      })
    } else if (that.data.itemType == 4) {
      API.getFavoriteDesign(parms).then(res => {
        if (res.success && res.totalCount > 0) {
          that.setData({
            showList: res.datalist
          })
        } else {
          that.setData({
            showList: [],
            emptyPageObj: {
              imgUrl: that.data.staticImageUrl + 'me_bg_no.png',
              title: `您还没有收藏的设计改造`,
              btnText: '去看看',
              url: '/pages/interactiveZone/interactiveZone?tabIndex=' + 2,
              navigateTo: true
            }
          })
        }
      })
    }
  },
  /*处理发布时间*/
  changeTiem(tiem) {
    let leadTime = new Date().getTime() - new Date(tiem.replace(/\-/g, '/')), date;
    if (leadTime / 1000 / 60 < 1) {
      date = '刚刚';
    }
    if (leadTime / 1000 / 60 > 1 && leadTime / 1000 / 60 < 60) {
      date = (leadTime / 1000 / 60).toFixed(0) + '分钟前';
    }
    if (leadTime / 1000 / 3600 > 1 && leadTime / 1000 / 3600 < 59) {
      date = (leadTime / 1000 / 3600).toFixed(0) + '小时前';
    }
    if (leadTime / 1000 / 3600 / 24 > 1) {
      date = (leadTime / 1000 / 3600 / 24).toFixed(0) + '天前';
    }
    return date;
  },
  changeItem(e) {
    var type = e.currentTarget.dataset.type, blockType = e.currentTarget.dataset.blocktype
    this.setData({ itemType: type, blockType: blockType, showList:[] })
    $App.sd.track("btnclick", { "btnid": blockType });
    this.getList()
  },
  navigate(e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    $App.sd.track("btnclick", { "btnid": type });
    if (type == 'plan') {
      wx.navigateTo({
        url: '/pages/casesDetail/casesDetail?id=' + id,
      })
    } else if (type == 'post') {
      wx.navigateTo({
        url: '/pages/articlesDetail/articlesDetail?id=' + id,
      })
    } else if (type == 'design') {
      wx.navigateTo({
        url: '/pages/desginDetail/desginDetail?id=' + id,
      })
    } else if (type == 'question') {
      let answerCount = e.currentTarget.dataset.count;
      wx.navigateTo({
        url: `/pages/interactiveZone/interlocutionDetail/interlocutionDetail?id=${id}&answerCount=${answerCount}`,
      })
    } else if (type == 'topic') {
      wx.navigateTo({
        url: `/pages/interactiveZone/topic/topic?id=${id}`,
      })
    }
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
    if (this.data.totalCount > this.data.limit) {
      this.data.limit += 10;
      this.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})