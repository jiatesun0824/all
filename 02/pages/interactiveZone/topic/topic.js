const API = getApp().API;
const $App = getApp();
const utils = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticImageUrl: $App.staticImageUrl,
    resourcePath: $App.resourcePath,
    obj: {},
    disccuss: [],
    userId: null,
    id: null,
    replyuserId: null,
    resourcePath: $App.resourcePath,
    editQestion: false,
    editMsg: null,
    clickId: null,
    topicId: null,
    noMore: false,
    isShowDetail: false,
    emptyPageObj: {},
    userInfoStatus: wx.getStorageSync('userInfoStatus')
  },
  navigateParams: {},
  replyPage: 1,
  load: 0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.load = 0;
    this.setData({
      id: options.id,
      userId: getApp().globalData.id
    });
    setTimeout(() => {
      this.navigateParams = {
        id: this.data.id,
        title: this.data.obj.title,
      }
    }, 300);

  },
  getTopicDetail() {
    let that = this;
    API.getTopicDetail({
      id: that.data.id
    }).then(res => {
      if (res.success) {
        let obj = res.obj;
        obj.publishTime = utils.changeTime(obj.publishTime);
        that.setData({
          obj: obj,
          isShowDetail: true
        });
      } else {
        that.setData({
          isShowDetail: false,
          emptyPageObj: {
            imgUrl: that.data.staticImageUrl + 'issue.png',
            title: res.message,
          }
        });
      }
    });
  },
  /**获取文本高度判断是否超出 */
  getHeightOver() {
    var query = wx.createSelectorQuery()
    let disccuss = this.data.disccuss;
    disccuss.forEach((item, index) => {
      wx.createSelectorQuery().selectAll(`.item${index}`).boundingClientRect(res => {
        if (res[0].height > 128) {
          item.over = true;
          item.show = true;
        } else {
          if (!item.over && !item.show) {
            item.over = false;
            item.show = false;
          }
        }
      }).exec()
    });
    setTimeout(() => {
      this.setData({
        disccuss: disccuss
      })
    }, 50)
  },
  getDisccussList() {
    this.load++;
    let that = this;
    let params = {
      businessId: this.data.id,
      page: 1,
      limit: 5
    }
    API.getReplyList(params).then(res => {
      if (res.success) {
        let disccuss = res.datalist;
        disccuss.forEach(item => {
          item.gmtModified = utils.changeTime(item.gmtModified);
          if (item.content) {
            if (item.content.length > 105) {
              item.over = true;
              item.show = true;
            } else {
              item.over = false;
              item.show = false;
            }
          }
          if (item.authorPic) {
            if (item.authorPic.match('operationPlatform/robotManage/')) {
              item.authorPic = `${that.data.resourcePath}${item.authorPic}`
            }
          }
        });
        that.setData({
          disccuss: disccuss,
          reviews: res.totalCount
        });
        if (that.load != 1) {
          wx.createSelectorQuery().select('.discuss-list').boundingClientRect(function(rect) {
            // 使页面滚动到底部
            if (rect) {
              wx.pageScrollTo({
                scrollTop: rect.top
              })
            }
          }).exec();
        }
        setTimeout(() => {
          this.getHeightOver();
        }, 300)
      }
    });
  },
  settingClik(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let topicid = e.currentTarget.dataset.topicid;
    let replyid = e.currentTarget.dataset.replyid;
    let msg = this.data.disccuss[index];
    this.setData({
      editQestion: true,
      editMsg: msg,
      clickId: id,
      topicId: topicid,
      replyuserId: replyid
    });

  },
  deletedReply(e) {
    let that = this;
    let params = {
      id: this.data.clickId,
      isDeleted: 1
    }
    API.getZoneReplyUpdate(params).then(res => {
      if (res.success) {
        wx.showToast({
          title: '删除成功',
        });
        that.data.reviews--;
        that.setData({
          editQestion: false,
          reviews: that.data.reviews
        });
        that.getDisccussList();
      }
    })


  },
  /**收藏 */
  collection() {
    let that = this;
    let params = {
      contentId: this.data.id,
      nodeType: 7,
      detailType: 1,
      blockType: 2
    }
    $App.sd.track("btnclick", { "btnid": "collection" });
    if (!this.data.obj.collectFlag) {
      params.status = 1;
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          wx.showToast({
            icon: 'none',
            title: '收藏成功~可在我的收藏里查看~',
          });
          that.data.obj.collectFlag = 1;
          that.setData({
            obj: that.data.obj
          });
        }
      })
    } else {
      params.status = 0;
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          wx.showToast({
            icon: 'none',
            title: '取消收藏成功',
          });
          that.data.obj.collectFlag = 0;
          that.setData({
            obj: that.data.obj
          });
        }
      })
    }


  },
  /**点赞 */
  getZoneStatus(e) {
    let that = this;
    let contentId = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let params = {
      contentId: contentId,
      nodeType: 8,
      detailType: 2,
      blockType: 2
    }
    $App.sd.track("btnclick", { "btnid": "getZoneStatus" });
    if (!that.data.disccuss[index].likeFlag) {
      params.status = 1;
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          that.data.disccuss[index].likeFlag = 1;
          that.data.disccuss[index].likeCount += 1;
        }
        that.setData({
          disccuss: that.data.disccuss
        });
      })
    } else {
      params.status = 0;
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          that.data.disccuss[index].likeFlag = 0;
          that.data.disccuss[index].likeCount -= 1;
        }
        that.setData({
          disccuss: that.data.disccuss
        });
      })
    }
  },
  cancelEdit() {
    this.setData({
      editQestion: false,
    });
  },
  /**展开全文/收起**/
  showAllText(e) {
    let index = e.currentTarget.dataset.index;
    let disccuss = this.data.disccuss;
    disccuss[index].over = !disccuss[index].over;
    this.setData({
      disccuss: disccuss
    })
  },
  /**参与讨论 */
  toJoin(e) {
    wx.setStorageSync('userInfoStatus', 1)
    this.setData({
      userInfoStatus: 1
    })
    $App.sd.track("btnclick", { "btnid": "toJoin" });
    if (e.detail.userInfo) {
      API.saveMinProNickName({
        nickName: e.detail.userInfo.nickName,
        headPic: e.detail.userInfo.avatarUrl,
        sex: e.detail.userInfo.gender,
        province: e.detail.userInfo.province,
        city: e.detail.userInfo.city
      })
    }
    let that = this;
    wx.navigateTo({
      url: `../joinDisscuss/joinDisscuss?id=${that.data.obj.id}&title=${that.data.obj.title}`,
    });
  },
  /**编辑话题讨论回复 */
  editDisscuss(e) {
    let that = this;
    let msg = JSON.stringify(e.currentTarget.dataset.msg);
    this.setData({
      editQestion: false
    })
    wx.navigateTo({
      url: `../joinDisscuss/joinDisscuss?&id=${that.data.clickId}&title=${that.data.obj.title}&topicId=${that.data.topicId}&edit=${true}`,
    })
  },
  /**预览图片 */
  previewImage: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let itemPic = e.currentTarget.dataset.item;
    let url = itemPic.map(item =>
      this.data.resourcePath + item.url);
    wx.previewImage({
      current: url[index],
      urls: url
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    if (!this.data.noMore) {
      this.replyPage++;
      let params = {
        businessId: this.data.id,
        page: this.replyPage,
        limit: 5
      }
      API.getReplyList(params).then(res => {
        if (res.success) {
          if (res.datalist.length != 0) {
            let disccuss = res.datalist;
            disccuss.forEach(item => {
              item.gmtModified = utils.changeTime(item.gmtModified);
              if (item.content) {
                if (item.content.length > 105) {
                  item.over = true;
                  item.show = true;
                } else {
                  item.over = false;
                  item.show = false;
                }
              }
              if (item.authorPic.match('operationPlatform/robotManage/')) {
                item.authorPic = `${that.data.resourcePath}${item.authorPic}`
              }
            });
            that.setData({
              disccuss: that.data.disccuss.length != 0 ? that.data.disccuss.concat(disccuss) : disccuss,
            });
            setTimeout(() => {
              this.getHeightOver();
            }, 500)
          } else {
            that.setData({
              noMore: true
            })
          }
        }
      });
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      $App.sd.track("btnclick", { "btnid": "onShareAppMessage" });
    }
    let that = this;
    return {
      title: '快来讨论这个话题吧~',
      path: `/pages/interactiveZone/topic/topic?id=${that.navigateParams.id}`,
      success: function(res) {　　　　　　 // 转发成功之后的回调　　　
        wx.showToast({
          title: '已分享成功',
        })
      },
    }
  },
  // 大数据埋点
  bigDataSellingPoints() {
    $App.sd.track("pageview", {});
  },
  onShow() {
    this.setData({
      userInfoStatus: wx.getStorageSync('userInfoStatus')
    })
    $App.userLoginStatus.then(() => {
      this.getTopicDetail()
      this.bigDataSellingPoints()
      this.getDisccussList();
    })
  }
})