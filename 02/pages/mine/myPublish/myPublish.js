import {
  resourcePath
} from '../../../utils/config.js'
let API = getApp().API;
let $App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcePath: resourcePath,
    type: 0,
    curPage: 1,
    pageSize: 5,
    List: [],
    emptyPageObj: {},
    staticImageUrl: getApp().staticImageUrl,
    sDDefaultImg: '',
    // 埋点数据
    previousPath: '',
    nowPath: '',
    itemType: 0,
    userId: '',
    blockType: 'askAndAnswer',
    topicFlag: 0,
    topicImg: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.hideShareMenu();
    new $App.newNav() // 注册快速导航组件
    var userId = wx.getStorageSync('id');
    this.setData({
      sDDefaultImg: this.data.staticImageUrl + 'news_pic_nor.png',
      userId: userId
    })
  },

  // ZB NewPublish 
  changeItem(e) {
    var type = e.currentTarget.dataset.type,
      blockType = e.currentTarget.dataset.blocktype
    this.setData({
      itemType: type,
      blockType: blockType,
      pageSize: 10,
    })
    $App.sd.track("btnclick", { "btnid": blockType });
    if (blockType == "topic") {
      this.setData({
        topicFlag: 1,
        List: []
      })
    } else {
      this.setData({
        topicFlag: 0,
        List: []
      })
    }
    this.getList(blockType)
  },

  getList(blockType) {
    API.getTopicList({
        userId: this.data.userId,
        blockTypeValueKey: blockType,
        Limit: this.data.pageSize,
        Start: 1,
        topicFlag: this.data.topicFlag
      })
      .then(res => {
        if (res.datalist.length > 0) {
          let arr = res.datalist;
          this.setData({
            List: arr,
          });
        } else {
          this.setData({
            List: []
          })
          if (this.data.itemType == 0) {
            this.setData({
              emptyPageObj: {
                imgUrl: this.data.staticImageUrl + 'me_bg_no.png',
                title: `您还没有发布问答\n有问题，群众帮你解决~`,
                btnText: '去看看',
                url: '/pages/interactiveZone/interactiveZone?tabIndex=' + 0,
                navigateTo: true
              }
            })
          } else if (this.data.itemType == 1) {
            this.setData({
              emptyPageObj: {
                imgUrl: this.data.staticImageUrl + 'me_bg_no.png',
                title: `您没有发布话题\n快去参与话题，和大家一起讨论~`,
                btnText: '去看看',
                url: '/pages/interactiveZone/interactiveZone?tabIndex=' + 0,
                navigateTo: true
              }
            });
          } else if (this.data.itemType == 2) {
            this.setData({
              emptyPageObj: {
                imgUrl: this.data.staticImageUrl + 'me_bg_no.png',
                title: '您还没有发布的设计改造\n发布你的户型或方案让设计师帮你看看 ~',
                btnText: '去看看',
                url: '/pages/interactiveZone/interactiveZone?tabIndex=' + 2,
                navigateTo: true
              }
            });
          }
        }
      })
  },
  changeTiem(item) {
    let leadTime = new Date().getTime() - new Date(item.replace(/\-/g, '/')),
      date;
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
      date = '1天前';
    }
    return date;
  },
  delete: function(e) {
    let id = e.currentTarget.dataset.id,that = this;
    $App.sd.track("btnclick", { "btnid": "delete" });
    wx.showModal({
      title: '提示',
      content: '确认删除么？',
      success: function(sm) {
        if (sm.confirm) {
          API.getZoneTopicUpdate({
              isDeleted: 1,
              id: id
            })
            .then(res => {
              that.getList(that.data.blockType)
            })
        }
      }
    })
  },
  deleteFn: function(e) {
    let id = e.currentTarget.dataset.id,that = this;
    $App.sd.track("btnclick", { "btnid": "deleteFn" });
    wx.showModal({
      title: '提示',
      content: '确认删除么？',
      success: function(sm) {
        if (sm.confirm) {
          API.getZoneReplyUpdate({
              isDeleted: 1,
              id: id
            })
            .then(res => {
              that.getList(that.data.blockType)
            })
        }
      }
    })
  },
  editFun: function(e) {
    let type = e.currentTarget.dataset.type, //1问答  //2话题讨论   //4设计改造
      item = e.currentTarget.dataset.item
    if (type == 1) {
      $App.sd.track("btnclick", { "btnid": "issue" });
      wx.navigateTo({
        url: `/pages/interactiveZone/issue/issue?id=${item.id}&edit=${true}`,
      })
    } else if (type == 2) {
      $App.sd.track("btnclick", { "btnid": "joinDisscuss" });
      wx.navigateTo({
        url: `/pages/interactiveZone/joinDisscuss/joinDisscuss?id=${item.replyId}&edit=${true}&title=${item.title}&topicId=${item.id}`,
      })
    } else if (type == 4) {
      $App.sd.track("btnclick", { "btnid": "publishDesgin" });
      if (item.planId) {
        wx.navigateTo({
          url: '/pages/publishDesgin/publishDesgin?type==edit&planImg=' + item.coverPicPath + '&planTime=' + item.gmtCreate + '&planId=' + item.planId + '&content=' + item.content + '&mainId=' + this.data.id
        })
      } else if (item.houseId) {
        wx.navigateTo({
          url: '/pages/publishDesgin/publishDesgin?type==edit&houseImg=' + item.coverPicPath + '&houseTime=' + item.gmtCreate + '&houseId=' + item.houseId + '&type=edit&mainId=' + item.id + '&content=' + item.content,
        })
      }
    }

  },
  toPublish() {
    wx.navigateTo({
      url: '/pages/publishMessage/publishMessage',
    })
  },
  toDetail: function(e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    if (type == 'question') {
      let answerCount = e.currentTarget.dataset.count;
      $App.sd.track("btnclick", { "btnid": "myPublishQuestion" });
      wx.navigateTo({
        url: `/pages/interactiveZone/interlocutionDetail/interlocutionDetail?id=${id}&answerCount=${answerCount}`,
      })
    } else if (type == 'topic') {
      $App.sd.track("btnclick", { "btnid": "myPublishTopic" });
      wx.navigateTo({
        url: `/pages/interactiveZone/topic/topic?id=${id}`,
      })
    } else if (type == 'design') {
      $App.sd.track("btnclick", { "btnid": "myPublishDesign" });
      wx.navigateTo({
        url: '/pages/desginDetail/desginDetail?id=' + id,
      })
    }
  },
  // 大数据埋点
  bigDataSellingPoints() {
    $App.sd.track("pageview", {});
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
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.getList(this.data.blockType)
    this.bigDataSellingPoints()
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
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let num = this.data.pageSize + 5;
    let blockType = this.data.blockType
    this.setData({
      pageSize: num
    })
    this.getList(blockType)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
})