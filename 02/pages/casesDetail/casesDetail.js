// pages/casesDetail/casesDetail.js
const API = getApp().API;
const $App = getApp();
var WxParse = require('../../utils/wxParse/wxParse.js');
let share = require('../../utils/shareConfig.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticImageUrl: getApp().staticImageUrl,
    resourcePath: getApp().resourcePath,
    id: '',
    detail: '',
    commentTotal: '',
    totalCount: '',
    commentList: [],
    commentTxt: '',
    totalCount: 0,
    inputFlag: false,
    planInfo: '',
    emptyPageObj: {},
    isShowDetail: false,
    picArr: [],
    scrollId: '',
    userId: wx.getStorageSync("id"),
    scrollHeight: '1150rpx',
    pageSize: 10,
    imgTotal: 1,
    swiperCurrent: 1,
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
        id: options.id
      })
    }
    $App.userLoginStatus.then(() => {
      this.getDetail()
      this.getComment();
    })
  },
  getDetail() {
    let that = this
    let parm = {
      id: this.data.id
    }
    API.getTopicDetail(parm).then(res => {
      console.log(res);
      if (res.success) {
        res.obj.publishTime = this.changeTiem(res.obj.publishTime)
        that.setData({
          detail: res.obj,
          isShowDetail: true
        });
        if (res.obj.jsonContent) {
          var str = res.obj.jsonContent
          var imgReg = /<img.*?(?:>|\/>)/gi;
          //匹配src属性
          var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
          var arr = str.match(imgReg);
          console.log('所有已成功匹配图片的数组：' + arr);
          var src = [];
          var srcArr = [];
          if (arr != null) {
            for (var i = 0; i < arr.length; i++) { 
              src = arr[i].match(srcReg);
              srcArr.push(src[1])
            }
          }
          this.setData({
            picArr: srcArr
          })
          if (res.obj.planId) {
            this.setData({
              imgTotal: this.data.picArr.length + 1
            })
          } else {
            this.setData({
              imgTotal: this.data.picArr.length
            })
          }

        }

        WxParse.wxParse('article', 'html', this.data.detail.jsonContent, this, 0);
        if (res.obj.planId) {
          let parm = {
            id: res.obj.planId,
            type: 1
          }
          API.getPlanDetail(parm).then(res => {
            if (res.obj) {
              that.setData({
                planInfo: res.obj
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
    let parms = {
      topicId: this.data.id,
      content: this.data.commentTxt,
      blockTypeValueKey: 'share'
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
            inputFlag: false,
            scrollId: 'comment'
          })
          this.setData({
            submitFlag: false
          })
          setTimeout(() => {
            that.getComment();

          }, 1000)
        }
      })
    }
  },
  focus() {
    this.setData({
      inputFlag: true
    })
  },
  inputBlur() {
    if (this.data.commentTxt == '') {
      this.setData({
        inputFlag: false
      })
    }
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
  onShareAppMessage: function() {
    let obj = share.shareUrl('/pages/casesDetail/casesDetail?id=' + this.data.id, '快来评论这个案例吧', '', this.data.resourcePath + this.data.detail.coverPicPath)
    return obj;
  },
  collection() {
    let that = this;
    let params = {
      contentId: this.data.id,
      nodeType: 7,
      detailType: 1,
      blockType: 3
    }
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
      blockType: 3
    }
    if (!that.data.commentList[index].likeFlag) {
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
        if (res.success) {
          wx.showToast({
            title: '删除成功',
          });
          that.setData({
            deleteFlag: false
          })
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









  toThreeD(e) {
    let planType;
    if (e.currentTarget.dataset.type == 'master') {
      planType = this.data.detail.planType;
      $App.sellingPoint(API, 'supplyDetailtoThreeDmaster', this.data.nowPath, this.data.previousPath, '信息详情');
    }
    if (e.currentTarget.dataset.type == 'salver') {
      $App.sellingPoint(API, 'supplyDetailtoThreeDsalver', this.data.nowPath, this.data.previousPath, '信息详情');
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
  swiper(e) {
    this.setData({
      swiperCurrent: e.detail.current + 1
    })
  },
  formToThreeDD(e) {
    // if (e.detail.target.dataset.type =='push'){
    //     flagn = 1;
    //     this.routerToHouseSearch(e.detail.target.dataset.item, e.detail.formId);
    // }else{
    //     if (flagn)
    //         return;
    let item = e.currentTarget.dataset.item,
      routerQueryType = 'seven',
      webUrl = null,
      sevenObj = null,
      planHT
    wx.setStorageSync('caseItem', item)
    // if (this.data.isRender === 0 && this.data.isRecommonPlan === 1) { // 推荐方案立即装修
    //   wx.navigateTo({ url: '/pages/search-houseType/search-houseType?type=plan' })
    //   return 
    // }

    if (item.planHouseType) {
      planHT = item.planHouseType
    } else if (item.spaceType) {
      item.spaceType == 13 ? planHT = 2 : planHT = 1
    } else {
      item.spaceFunctionId == 13 ? planHT = 2 : planHT = 1
    }

    item.fullHousePlanUUID ? (webUrl = $App.wholeHouse3dUrl, sevenObj = {
        uuid: item.fullHousePlanUUID,
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        planId: item.designPlanRecommendId || item.planRecommendedId,
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram',
        isRender: 0,
        groupPrimaryId: item.groupPrimaryId || '',
        houseId: item.houseId || '',
        templateId: item.templateId,
        planHouseType: planHT,
        operationSource: 0,
        isGoods: ''
      }) :
      (webUrl = $App.sevenUrl, sevenObj = {
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        operationSource: 1,
        planId: item.designPlanRecommendId || item.planRecommendedId,
        routerQueryType: routerQueryType,
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram',
        isRender: 0,
        shopId: 0,
        isGoods: ''
      });
    if (this.data.sdId) {
      sevenObj = Object.assign(sevenObj, {
        sdId: this.data.sdId
      })
    }
    if (this.data.isRender === 1) {
      Object.assign(sevenObj, {
        taskSource: 0,
        planHouseType: 0,
        taskType: 0,
        totalFee: 0,
        fullHousePlanAction: this.data.renderParams.fullHousePlanId ? 2 : 1,
        renderTaskType: 'panorama_render',
        groupPrimaryId: item.groupPrimaryId,
        houseId: this.data.renderParams.houseId,
        templateId: this.data.templateId,
        designTempletId: this.data.templateId,
        spaceFunctionId: item.spaceType || item.spaceFunctionId,
        fullHousePlanId: this.data.renderParams.fullHousePlanId || '',
        taskId: this.data.renderParams.mainTaskId || '',
        preRenderSceneId: this.data.renderParams.preRenderSceneId || '',
        // planId: '87792'
      }, item.spaceType === 13 ? {
        bizType: 2
      } : {});

    }

    for (let key in sevenObj) {
      webUrl += key + '=' + sevenObj[key] + '&'
    }

    getApp().data.webUrl = webUrl;

    /** // 渲染参数
     * "houseId": 413485,
     * "operationSource": 1, // 1 方案进 0 我的进
     * "planHouseType": 3,
     * "planRecommendedId": 293555,
     * "renderTaskType": "panorama_render",
     * "taskSource": 1, // 0 C端
     * "taskType": 1,  // 0 自动渲染 1 产品替换
     * "totalFee": 10,
     * "fullHousePlanAction": 2,  // 1 第一次渲染 2 替换旧方案且不产生新的全屋方案 3 替换旧方案并且产生新的全屋方案
     * "templateId": 392023,
     * "groupPrimaryId": 0,
     * "houseGuidePicInfoId": 529,
     * "designTempletId": 392023,
     * "spaceFunctionId": 4,
     * "fullHousePlanId": 274,
     * "taskId": 52396,
     * "preRenderSceneId": 47560
     */
    wx.navigateTo({
      url: '/pages/web-720/web-720'
    });

    console.log(webUrl)
    // }
  },
})