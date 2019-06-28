const utils = require('../../../utils/utils.js');
const API = getApp().API;
const $App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    staticImageUrl: $App.staticImageUrl,
    resourcePath: $App.resourcePath,
    toppingSet: false,
    editQestion: false, // 编辑问答
    bottomOptShow: false, // 底部操作栏隐藏
    inputFlag: false,
    answerCount: null,
    inputFlag: false,
    id: null,
    obj: null,
    uploadedImg: [],
    imgIdArr: [],
    replyText: '',
    replyList: [],
    replyId: null,
    replyUserId: null,
    bestAnswer: null,
    noMore: false,
    isIOS: false,
    height: 0,
    isShowDetail: false,
    emptyPageObj: {},
    fucos: false,
    bottomShow: true,
    oPPo: false,
    scrollId: '',
    widowHeight: '800',
    userInfoStatus: wx.getStorageSync('userInfoStatus')
  },
  replyPage: 1,
  imgArr: [],
  sendFlag: true,
  isIOS78: false,
  load: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      widowHeight: wx.getSystemInfoSync().windowHeight
    })
    let that = this;
    this.setData({
      id: options.id,
      userId: $App.globalData.id,
    });
    this.load = 0;
  },
  /**初始化数据 */
  init() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        if (res.platform == 'ios') {
          that.setData({
            isIOS: true
          });
        }
      },
    });
    $App.userLoginStatus.then(() => {
      this.getDetail()
      this.getReplyList();
      this.bigDataSellingPoints()
    })
  },
  // 大数据埋点
  bigDataSellingPoints() {
    $App.sd.track("pageview", {});
  },
  /**获取详情 */
  getDetail() {
    let that = this;
    API.getTopicDetail({
      id: that.data.id
    }).then(res => {
      if (res.success) {
        let obj = res.obj;
        obj.publishTime = utils.changeTime(obj.publishTime);
        if (obj.authorPic) {
          if (obj.authorPic.match('operationPlatform/robotManage/')) {
            obj.authorPic = `${that.data.resourcePath}${obj.authorPic}`
          }
        }
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
    })
  },
  /**删除问答 */
  deleteQuestion() {
    let that = this;
    let params = {
      id: this.data.obj.id,
      isDeleted: 1
    }
    API.getZoneTopicUpdate(params).then(res => {
      if (res.success) {
        wx.showToast({
          title: '删除成功',
        });
        that.setData({
          editQestion: false,
          bottomShow: true
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '../interactiveZone',
          })
        }, 500)
      }
    })
  },
  /**编辑问答 */
  toEditQuestion() {
    this.setData({
      editQestion: false,
      bottomShow: true
    });
    let id = this.data.obj.id;
    wx.navigateTo({
      url: `../issue/issue?id=${id}&edit=${true}`,
    });
  },
  /**评论列表*/
  getReplyList() {
    this.load++;
    let that = this;
    this.replyPage = 1;
    let params = {
      businessId: this.data.id,
      page: 1,
      limit: 5
    }
    API.getReplyList(params).then(res => {
      if (res.success) {
        let replyList = res.datalist;
        replyList.forEach(item => {
          item.gmtCreate = utils.changeTime(item.gmtCreate);
          if (item.authorPic) {
            if (item.authorPic.match('operationPlatform/robotManage/')) {
              item.authorPic = `${that.data.resourcePath}${item.authorPic}`
            }
          }
        })
        that.setData({
          replyList: replyList,
          answerCount: res.totalCount
        });

      }
    });
  },
  /***收藏问答***/
  collection() {
    let that = this;
    let params = {
      contentId: this.data.id,
      nodeType: 7,
      detailType: 1,
      blockType: 1
    }
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
  /**发送评论 */
  getZoneReplyAdd(e) {
    
    wx.setStorage({
      key: 'userInfoStatus',
      data: '1',
    })
    this.setData({
      userInfoStatus: 1
    })
    this.onLoad()
    let that = this;
    if (this.sendFlag) {
      // 有文字没有图片
      if (this.data.replyText.trim() && this.data.uploadedImg.length == 0) {
        this.uploadFlag = true;
      }
      // 有文字或者有图片
      if (this.data.replyText.trim() || this.data.uploadedImg.length != 0) {
        // 图片是否上传完毕
        if (this.uploadFlag) {
          let params = {
            blockTypeValueKey: 'askAndAnswer',
            topicId: this.data.id,
            content: this.data.replyText,
          }
          this.sendFlag = false;
          if (this.data.uploadedImg.length != 0) {
            let picIds = that.data.imgIdArr.join(',');
            params.picIds = picIds
          }

          API.getZoneReplyAdd(params).then(res => {
            that.inputBlur();
            if (res.success) {
              that.getReplyList();
              wx.showToast({
                title: res.message,
              });
              that.data.answerCount++;
              this.setData({
                uploadedImg: [],
                imgIdArr: [],
                replyText: '',
                noMore: false,
                answerCount: that.data.answerCount
              });

              this.sendFlag = true;
              this.setData({
                scrollId: 'comment'
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: res.message,
              })
            }
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: '正在上传照片，请稍后再发送',
          })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '评论内容不可为空'
        })
      }
    }

  },
  /**判断是否有最佳回答 */
  isHasBestReply() {
    let repayArr = this.data.replyList.map(item => {
      if (item.isBestAnswer == 1) {
        return 1;
      } else {
        return 0;
      }
    });
    let hasBestRepay = repayArr.indexOf(1) != -1 ? true : false;
    return hasBestRepay;
  },
  /**
   * 设为最佳回答、置顶。
   */
  setBestAnswer(e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let params = {};
    $App.sd.track("btnclick", { "btnid": "setBestAnswer" });
    if (type == 'setting') {
      // 判断是否有最佳回答
      let hasBestRepay = this.isHasBestReply();
      if (hasBestRepay) {
        wx.showToast({
          icon: 'none',
          title: '要先取消其他最佳回答才可重新设置哦~',
        });
        that.setData({
          toppingSet: false,
          bottomShow: true,
        });
        return;
      } else {
        params = {
          id: this.data.replyId,
          isBestAnswer: 1,
          isTop: 1,
        }
      }
    } else if (type == "cancel") {
      params = {
        id: this.data.replyId,
        isBestAnswer: 0,
        isTop: 0,
      }
    }
    API.getZoneReplyUpdate(params).then(res => {
      if (res.success) {
        let text = type == 'setting' ? '置为最佳回答成功' : '取消最佳回答成功'
        wx.showToast({
          title: text,
        });
        that.setData({
          toppingSet: false,
          bottomShow: true,
        });
        setTimeout(() => {
          that.getReplyList();
        }, 500)
      }
    })





  },
  /**
   * 删除评论
   */
  deleteAnswer(e) {
    let that = this;

    let params = {
      id: this.data.replyId,
      isDeleted: 1
    }
    API.getZoneReplyUpdate(params).then(res => {
      if (res.success) {
        wx.showToast({
          title: '删除成功',
        });
        that.data.answerCount--;
        that.setData({
          toppingSet: false,
          bottomShow: true,
          answerCount: that.data.answerCount
        });
        that.getReplyList();
      }
    })
  },
  /**
   * 点赞
   */
  getZoneStatus(e) {
    let that = this;
    let contentId = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let params = {
      contentId: contentId,
      nodeType: 8,
      detailType: 2,
      blockType: 1
    }
    if (!that.data.replyList[index].likeFlag) {
      params.status = 1;
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          that.data.replyList[index].likeFlag = 1;
          that.data.replyList[index].likeCount += 1;
        }
        that.setData({
          replyList: that.data.replyList
        });
      })
    } else {
      params.status = 0;
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          that.data.replyList[index].likeFlag = 0;
          that.data.replyList[index].likeCount -= 1;
        }
        that.setData({
          replyList: that.data.replyList
        });
      })
    }

  },

  /**
   * 上传照片
   */
  uploadToImg() {
    let that = this;
    this.uploadFlag = false;
    if (this.imgArr.length != 0) {
      this.imgArr.forEach((item, index) => {
        API.uploadFileIssuedImage({
          'platform': 'mini',
          'module': 'demand',
          'type': 'image',
          'path': item
        }).then(res => {
          if (res.success) {
            that.data.imgIdArr.push(res.obj.resId);
            that.setData({
              imgIdArr: that.data.imgIdArr
            });
            if (index == that.imgArr.length - 1) {
              setTimeout(() => {
                that.uploadFlag = true;
              }, 300)
            }
          } else {
            wx.showToast({
              icon: 'none',
              title: res.message,
            })
          }
        })

      });
      this.setData({
        bottomOptShow: true,
        inputFlag: true,
        height: 0
      });

    }

  },

  /**
   * 置顶设置弹窗事件
   */
  settingClik(e) {
    this.setData({
      toppingSet: true,
      bottomShow: false,
      replyId: e.currentTarget.dataset.id,
      replyUserId: e.currentTarget.dataset.replyid,
      bestAnswer: e.currentTarget.dataset.isbestanswer
    });

  },
  /**
   * 取消置顶设置弹窗事件
   */
  cancelSetting() {
    this.setData({
      toppingSet: false,
      bottomShow: true,
    })
  },
  /**
   * 编辑弹窗
   */
  editQestionClik() {
    this.setData({
      editQestion: true,
      bottomShow: false,
    })
  },
  /**
   * 取消编辑弹窗
   */
  cancelEditQuestion() {
    this.setData({
      editQestion: false,
      bottomShow: true
    })
  },
  /**
   * 上传照片
   */
  uploadImg() {
    let that = this;
    let count = 3 - this.data.uploadedImg.length;
    if (this.data.uploadedImg.length < 3) {
      wx.chooseImage({
        count: count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          that.imgArr = res.tempFilePaths;
          that.setData({
            uploadedImg: that.data.uploadedImg ? that.data.uploadedImg.concat(res.tempFilePaths) : res.tempFilePaths
          });
          that.uploadToImg();
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '最多只能上传3张照片哦~',
      });
    }
  },
  deleteImg(e) {
    let index = e.currentTarget.dataset.index;
    let uploadedImg = this.data.uploadedImg;
    uploadedImg.splice(index, 1);
    let imgIdArr = this.data.imgIdArr;
    imgIdArr.splice(index, 1);
    this.setData({
      uploadedImg: uploadedImg,
      imgIdArr: imgIdArr
    })

  },
  textAreaInput(e) {
    this.setData({
      replyText: e.detail.value
    })
  },
  confirm() {
    if (this.data.replyText.trim() || this.data.uploadedImg.length != 0) {
      this.setData({
        bottomOptShow: true,
        inputFlag: true,
        height: 0
      });
    } else {
      this.setData({
        bottomOptShow: false,
        inputFlag: false,
        height: 0
      });
    }
  },
  inputFocus(e) {
    let height = e.detail.height;
    if (this.data.oppo) {
      if (e.detail.height != 325) {
        height = 325;
      }
    }
    this.setData({
      bottomOptShow: true,
      height: height,
      inputFlag: true,
      focus: true,
    });
  },
  inputBlur() {
    this.setData({
      bottomOptShow: false,
      inputFlag: false,
      height: 0,
      focus: false
    })
  },

  inputReTract() {
    let that = this;
    if (this.data.replyText.trim() || this.data.uploadedImg.length != 0) {
      this.setData({
        bottomOptShow: true,
        inputFlag: true,
        focus: !that.data.focus,
        height: 0,
      })
    } else {
      this.setData({
        bottomOptShow: false,
        inputFlag: false,
        height: 0,
        focus: !that.data.focus
      });
    }
  },
  /**评论列表预览图片 */
  previewImage: function(e) {
    let index = e.currentTarget.dataset.index;
    let itemPic = e.currentTarget.dataset.item;
    let url = itemPic.map(item =>
      this.data.resourcePath + item.url);
    wx.previewImage({
      current: url[index],
      urls: url
    });
  },

  onBottom() {
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
            let replyList = res.datalist;
            replyList.forEach(item => {
              item.gmtCreate = utils.changeTime(item.gmtCreate);
              if (item.authorPic){
               if (item.authorPic.match('operationPlatform/robotManage/')) {
                 item.authorPic = `${that.data.resourcePath}${item.authorPic}`
               }
             }
            });

            that.setData({
              replyList: that.data.replyList.length != 0 ? that.data.replyList.concat(replyList) : replyList,
            });

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
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      $App.sd.track("btnclick", { "btnid": "onShareAppMessage" });
    }
    return {
      title: '快来评论这个问答吧~',
      path: `/pages/interactiveZone/interlocutionDetail/interlocutionDetail?id=${that.data.id}`,
      success: function(res) {　　　　　　 // 转发成功之后的回调　　　
        wx.showToast({
          title: '已分享成功',
        })
      },
    }
  },
  onShow() {
    console.log("wx.getStorageSync('userInfoStatus')", wx.getStorageSync('userInfoStatus'))
    this.setData({
      userInfoStatus: wx.getStorageSync('userInfoStatus')
    })
    this.init();
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        if (res.model == 'iPhone 7 Plus<iPhone9,2>') {
          that.isIOS78 = true;
        }
        if (res.model == 'OPPO R11s' || res.model == 'OPPO R9s') {
          that.setData({
            oPPo: true,
          })

        }
      },
    })
  },
})