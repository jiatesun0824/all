// pages/desginDetail/desginDetail.js
const API = getApp().API;
let $App = getApp();
let share = require('../../utils/shareConfig.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcePath: getApp().resourcePath,
    staticImageUrl: getApp().staticImageUrl,
    id: '',
    detail: '',
    commentList: '',
    totalCount: '',
    commentList: [],
    commentTxt: '',
    totalCount: 0,
    inputFlag: false,
    planInfo: '',
    houseInfo: '',
    deleteFlag: false,
    deleteType: '',
    deleteCommentId: '',
    userId: wx.getStorageSync("id"),
    isShowDetail: false,
    emptyPageObj: {},
    commentTotal: 0,
    scrollId: '',
    scrollHeight: '1150rpx',
    pageSize: 10,
    addImg: [],
    addImgId: [],
    addPlanId: '',
    addPlanImg: '',
    addPlanTitle: '',
    addPlanItem: '',
    planType: '',
    foucusFlag: false,
    bottomHeight: 0,
    oPPo: false,
    submitFlag: false,
    userInfoStatus: wx.getStorageSync('userInfoStatus')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight
    })
    if (options.id) {
      this.setData({
        // id: options.id
        id: options.id //10765  //10757 
      })
    }

    $App.userLoginStatus.then(() => {
      this.getDetail()
      this.getComment();
    })
  },
  magnifyCommentImage(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url]
    })
  },
  getDetail() {
    let that = this;
    console.log(this.data.id, 'sssss')
    let parm = {
      id: this.data.id
    }
    API.getTopicDetail(parm).then(res => {
      if (res.success) {
        res.obj.publishTime = this.changeTiem(res.obj.publishTime)
        this.setData({
          detail: res.obj,
          isShowDetail: true
        })
        if (res.obj.planId) {
          let parm = {
            id: res.obj.planId,
            type: res.obj.planType
          }
          API.getPlanDetail(parm).then(res => {
            if (res.obj) {
              that.setData({
                planInfo: res.obj
              })
            }
          })
        }
        if (res.obj.houseId) {
          let parm = {
            id: res.obj.houseId
          }
          API.getHouseDetail(parm).then(res => {
            if (res.obj) {
              that.setData({
                houseInfo: res.obj
              })
            }
          })
        }
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


  changeTiem(tiem) {
    let dateTime = new Date(tiem.replace(/\-/g, '/'))
    let y = dateTime.getFullYear()
    let m = dateTime.getMonth() + 1
    let d = dateTime.getDate()
    let leadTime = new Date().getTime() - dateTime,
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
    if (leadTime / 1000 / 3600 / 48 > 1) {
      date = '2天前'
    }
    if (leadTime / 1000 / 3600 / 72 > 1) {
      date = '3天前'
    }
    if (leadTime / 1000 / 3600 / 168 > 1 && leadTime / 1000 / 3600 / 168 < 2) {
      date = '1周前'
    }
    if (leadTime / 1000 / 3600 / 168 > 2 && leadTime / 1000 / 3600 / 168 < 3) {
      date = '2周前'
    }
    if (leadTime / 1000 / 3600 / 168 > 3 && leadTime / 1000 / 3600 / 168 < 4) {
      date = '3周前'
    }
    if (leadTime / 1000 / 3600 / 168 > 4) {
      date = '一个月前'
    }
    if (leadTime / 1000 / 3600 / 24 / 365 > 1) {
      date = '一年前'
    }
    return date;
  },

  getComment() {
    API.getReplyList({
        businessId: this.data.id,
        page: 1,
        limit: this.data.pageSize,
        order: this.data.order
      })
      .then(res => {
        for (let i = 0; i < res.datalist.length; i++) {
          res.datalist[i].gmtCreate = this.changeTiem(res.datalist[i].gmtCreate);
          if (res.datalist[i].authorPic) {
            if (res.datalist[i].authorPic.match('operationPlatform/robotManage/')) {
              res.datalist[i].authorPic = `${this.data.resourcePath}${res.datalist[i].authorPic}`
            }
          }
        }
        this.setData({
          commentList: res.datalist,
          commentTotal: res.totalCount
        })
      })
  },
  commentInput(e) {
    this.setData({
      commentTxt: e.detail.value
    })
  },
  submitComment(e) {
    wx.setStorage({
      key: 'userInfoStatus',
      data: '1',
    })
    this.setData({
      userInfoStatus: 1
    })
    if (e.detail.userInfo) {
      API.saveMinProNickName({
        nickName: e.detail.userInfo.nickName,
        headPic: e.detail.userInfo.avatarUrl,
        sex: e.detail.userInfo.gender,
        province: e.detail.userInfo.province,
        city: e.detail.userInfo.city
      })
    }
    let str = this.data.commentTxt.replace(/\s+/g, "");
    if (str == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return;
    }
    let that = this;
    let pic = this.data.addImgId.join(',')
    console.log(pic, 'ppppppp')
    let parms = {
      topicId: this.data.id,
      content: this.data.commentTxt,
      blockTypeValueKey: 'designReform',
      picIds: pic,
      planType: this.data.planType,
      planId: this.data.addPlanId
    }
    if (this.data.submitFlag == false) {
      this.setData({
        submitFlag: true
      })
      API.getZoneReplyAdd(parms).then(res => {
        if (res.success) {
          wx.showToast({
            title: '发布成功',
          })
          that.setData({
            commentTxt: '',
            addImg: [],
            addImgId: [],
            addPlanId: '',
            addPlanImg: '',
            addPlanTitle: '',
            addPlanItem: '',
            planType: '',
            inputFlag: false,
            scrollId: 'comment'
          })
          this.setData({
            submitFlag: false
          })
          console.log(that.data.commentTxt)
          setTimeout(() => {
            that.getComment();

          }, 1000)

        }
      })
    }
  },
  focus() {
    $App.sd.track("btnclick", { "btnid": "focus" });
    this.setData({
      foucusFlag: true,
      inputFlag: true
    })
  },
  inputBlur() {
    this.setData({
      foucusFlag: false,
      bottomHeight: 0
    })
    if (this.data.commentTxt == '' && this.data.addPlanId == '' && this.data.addImg.length < 1) {
      this.setData({
        inputFlag: false
      })
    }
  },
  houseTodetail(e) {
    let item = e.currentTarget.dataset.item
    $App.sd.track("btnclick", { "btnid": "houseTodetail" });
    wx.navigateTo({
      url: '/pages/house-type/house-details/house-details?houseId=' + item.id + '&type=search&sdId=' + this.data.id,
    })
  },
  toHouseDetail(e) {
    $App.sd.track("btnclick", { "btnid": "toHouseDetail" });
    let item = e.currentTarget.dataset.item
    console.log(item)
    let id, mainTaskId;
    API.copyPlan({
      fullHouseDesignPlanId: item.newFullHousePlanId,
      mainTaskId: item.mainTaskId,
      supplyDemandId: this.data.id
    }).then(res => {
      // API.copyPlan(item.planRecommendedId).then(res => {
      let list = res.obj.split(',');
      id = list[0];
      mainTaskId = list[1];
      wx.navigateTo({
        url: '/pages/house-type/house-details/house-details?type=myPlan&houseId=' + item.houseId + '&templateId=' + '' + '&fullHousePlanId=' + id + '&mainTaskId=' + mainTaskId + '&sdId=' + this.data.id

      })
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
    this.setData({
      userInfoStatus: wx.getStorageSync('userInfoStatus')
    })
    this.setData({
      addPlanId: this.data.addPlanId,
      addPlanImg: this.data.addPlanImg,
      addPlanTitle: this.data.addPlanTitle,
      addPlanItem: this.data.addPlanItem,
      planType: this.data.planType
    });
    wx.getSystemInfo({
      success: function(res) {
        if (res.model == 'OPPO R11s' || res.model == 'OPPO R9s') {
          that.setData({
            oPPo: true,
          })

        }
      },
    })
    if (this.data.addPlanId != '') {
      this.setData({
        inputFlag: true
      })
    }
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
    console.log("1231231")
    this.setData({
      pageSize: this.data.pageSize + 5
    })
    this.getComment();
  },
  reFearch(e) {
    this.setData({
      pageSize: this.data.pageSize + 5
    })
    this.getComment();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let imgurl = '';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      $App.sd.track("btnclick", { "btnid": "onShareAppMessage" });
    }
    this.data.detail.planPicUrl ? imgurl = planPicUrl : imgurl = housePicUrl
    let obj = share.shareUrl('/pages/desginDetail/desginDetail?id=' + this.data.id, '快来评论这个设计改造吧', '', imgurl)
    return obj;
  },
  collection() {
    let that = this;
    let params = {
      contentId: this.data.id,
      nodeType: 7,
      detailType: 1,
      blockType: 4
    }
    $App.sd.track("btnclick", { "btnid": "collection" });
    if (!this.data.detail.collectFlag) {
      params.status = 1;
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          wx.showToast({
            title: '收藏成功',
          });
          that.data.detail.collectFlag = 1;
          that.setData({
            detail: that.data.detail
          });
        }
      })
    } else {
      params.status = 0;
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          wx.showToast({
            title: '取消收藏成功',
          });
          that.data.detail.collectFlag = 0;
          that.setData({
            detail: that.data.detail
          });
        }
      })
    }



  },
  getZoneStatus(e) {
    let that = this;
    let contentId = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let params = {
      contentId: contentId,
      nodeType: 8,
      detailType: 2,
      blockType: 4
    }
    $App.sd.track("btnclick", { "btnid": "getZoneStatus" });
    if (!that.data.commentList[index].likeFlag) {
      console.log("点赞")
      params.status = 1;
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          that.data.commentList[index].likeFlag = 1;
          that.data.commentList[index].likeCount += 1;
        }
        that.setData({
          commentList: that.data.commentList
        });
      })
    } else {
      params.status = 0;
      console.log("取消点赞")
      API.getZoneStatus(params).then(res => {
        if (res.success) {
          that.data.commentList[index].likeFlag = 0;
          that.data.commentList[index].likeCount -= 1;
        }
        that.setData({
          commentList: that.data.commentList
        });
      })
    }

  },
  delete(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      deleteFlag: true,
      deleteType: type
    })
    let id = e.currentTarget.dataset.id
    if (id) {
      this.setData({
        deleteCommentId: id
      })
    }
  },
  cancelDelete() {
    this.setData({
      deleteFlag: false
    })
  },
  deleteFun() {
    let that = this;
    if (this.data.deleteType == 'post') {
      let params = {
        id: this.data.detail.id,
        isDeleted: 1
      }
      API.getZoneTopicUpdate(params).then(res => {
        console.log(res);
        if (res.success) {
          wx.showToast({
            title: '删除成功',
          });
          that.setData({
            deleteFlag: false
          })
          setTimeout(() => {
            wx.navigateBack({})
          }, 1000)
        }
      })
    } else if (this.data.deleteType == 'comment') {
      let params = {
        id: this.data.deleteCommentId,
        isDeleted: 1
      }
      API.getZoneReplyUpdate(params).then(res => {
        if (res.success) {
          wx.showToast({
            title: '删除成功',
          });
          that.setData({
            deleteFlag: false
          });
          that.getComment();
        }
      })
    }
  },
  toEdit() {
    if (this.data.planInfo) {
      let img = this.data.planInfo.planPicPath ? this.data.planInfo.planPicPath : this.data.planInfo.coverPath;
      let name = this.data.planInfo.designName ? this.data.planInfo.designName : this.data.planInfo.planName;
      let id = this.data.planInfo.businessId ? this.data.planInfo.businessId : this.data.planInfo.designPlanRecommendId;
      console.log(id, '9999999999999')
      wx.navigateTo({
        url: '/pages/publishDesgin/publishDesgin?type=edit&planImg=' + img + '&planName=' + name + '&planTime=' + this.data.planInfo.gmtCreate + '&planId=' + id + '&content=' + this.data.detail.content + '&mainId=' + this.data.id + '&planType=' + this.data.detail.planType
      })
    } else if (this.data.houseInfo) {
      wx.navigateTo({
        url: '/pages/publishDesgin/publishDesgin?type=edit&houseImg=' + this.data.houseInfo.largeThumbnailPath + '&houseName=' + this.data.houseInfo.houseName + '&houseTime=' + this.data.houseInfo.gmtCreate + '&houseId=' + this.data.houseInfo.id + '&content=' + this.data.detail.content + '&type=edit&mainId=' + this.data.id,
      })
    }
  },
  toThreeD(e) {
    let planType;
    if (e.currentTarget.dataset.type == 'master') {
      planType = this.data.detail.planType;

    }
    if (e.currentTarget.dataset.type == 'salver') {

      planType = this.data.commentList[e.currentTarget.dataset.index].planType
    }
    let item = e.currentTarget.dataset.item
    let mainTaskId;
    if (planType == 1) { //jyk 1130 因发布时发现bug 所以if else走的相同逻辑 之后重构
      API.copyPlan({
        fullHouseDesignPlanId: item.newFullHousePlanId,
        mainTaskId: item.mainTaskId,
        supplyDemandId: this.data.id
      }).then(res => {
        let list = res.obj.split(',');
        item.id = list[0];
        mainTaskId = list[1]

        let routerQueryType = 'seven',
          webUrl = null,
          sevenObj = null
        planType == 4 ? (webUrl = $App.wholeHouse3dUrl, sevenObj = {
            uuid: item.fullHousePlanUUID,
            token: wx.getStorageSync('token'),
            platformCode: 'brand2c',
            operationSource: 0,
            planId: item.id,
            routerQueryType: 'seven',
            customReferer: $App.wxUrl,
            platformNewCode: 'miniProgram',
            isTask: 1,
            isRender: 0,
            houseId: item.houseId || 0,
            taskType: 3,
            sdId: this.data.id,
            rc: 1,
            mainTaskId: mainTaskId
          }) :
          (webUrl = $App.sevenUrl, sevenObj = {
            token: wx.getStorageSync('token'),
            platformCode: 'brand2c',
            operationSource: 0,
            planId: item.planRecommendedId || item.businessId,
            routerQueryType: routerQueryType,
            customReferer: $App.wxUrl,
            platformNewCode: 'miniProgram',
            isTask: 1,
            taskType: 1,
            houseId: item.houseId || 0,
            sdId: this.data.id,
            rc: 0,
            mainTaskId: item.mainTaskId
          })
        for (let key in sevenObj) {
          webUrl += key + '=' + sevenObj[key] + '&'
        }

        getApp().data.webUrl = webUrl;
        wx.navigateTo({
          url: '/pages/web-720/web-720'
        });
      })
    } else {
      let routerQueryType = 'seven',
        webUrl = null,
        sevenObj = null
      planType == 4 ? (webUrl = $App.wholeHouse3dUrl, sevenObj = {
          uuid: item.fullHousePlanUUID,
          token: wx.getStorageSync('token'),
          platformCode: 'brand2c',
          operationSource: 0,
          planId: item.id,
          routerQueryType: 'seven',
          customReferer: $App.wxUrl,
          platformNewCode: 'miniProgram',
          isTask: 1,
          isRender: 0,
          houseId: item.houseId || 0,
          taskType: 3,
          sdId: this.data.id,
          rc: 1,
          mainTaskId: mainTaskId
        }) :
        (webUrl = $App.sevenUrl, sevenObj = {
          token: wx.getStorageSync('token'),
          platformCode: 'brand2c',
          operationSource: 0,
          planId: item.planRecommendedId || item.businessId,
          routerQueryType: routerQueryType,
          customReferer: $App.wxUrl,
          platformNewCode: 'miniProgram',
          isTask: 1,
          taskType: 1,
          houseId: item.houseId || 0,
          sdId: this.data.id,
          rc: 0,
          mainTaskId: item.mainTaskId
        })
      for (let key in sevenObj) {
        webUrl += key + '=' + sevenObj[key] + '&'
      }
      getApp().data.webUrl = webUrl;
      wx.navigateTo({
        url: '/pages/web-720/web-720'
      });
    }

  },
  scroll() {
    if (this.data.scrollId == 'top') {
      this.setData({
        scrollId: 'comment'
      })
    } else {
      this.setData({
        scrollId: 'top'
      })
    }
  },
  addImg() {
    let num = 3
    if (this.data.addImg.length >= 3) {
      wx.showToast({
        title: '图片不得超过3张',
        icon: 'none'
      });
      return;
    }
    wx.chooseImage({
      count: 3,
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        if (res.tempFiles.length + this.data.addImg.length > num) {
          wx.showToast({
            title: '图片不得超过3张',
          })
          return;
        }
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          API.uploadFileIssuedImage({
            'platform': 'mini',
            'module': 'demand',
            'type': 'image',
            'path': res.tempFilePaths[i]
          }).then(res => {
            if (res.success) {
              wx.showToast({
                title: '上传成功',
                icon: 'success'
              });
              let imgArr = this.data.addImg;
              let imgIdArr = this.data.addImgId
              imgArr.push(res.obj.url);
              imgIdArr.push(res.obj.resId);
              this.setData({
                addImg: imgArr,
                addImgId: imgIdArr
              });
              if (this.data.addImgId.length > 0) {
                this.setData({
                  inputFlag: true
                })
              }
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none'
              });
            }
          })
        }
      }
    })
  },
  addPlan() {
    wx.navigateTo({
      url: '/pages/plan/selection-scheme/selections-scheme?navaPage=comment'
    })
  },
  commentDel(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 'plan') {
      this.setData({
        addPlanId: '',
        addPlanImg: '',
        addPlanTitle: '',
        addPlanItem: '',
        planType: ''
      })
    } else {
      let index = e.currentTarget.dataset.index;
      let addImgId = this.data.addImgId;
      let addImg = this.data.addImg;
      addImgId.splice(index, 1);
      addImg.splice(index, 1)
      this.setData({
        addImgId: addImgId,
        addImg: addImg
      });
    }
  },
  foucus(e) {
    console.log(e)
    console.log(e.detail.height)
    this.setData({
      bottomHeight: e.detail.height
    })
    this.setData({
      foucusFlag: true
    })
  },
  inputFoucs() {
    if (!this.data.foucusFlag) {
      this.setData({
        foucusFlag: true
      })
    }
  }
})