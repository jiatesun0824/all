//taskType 0装进我家  1产品替换
let API = getApp().API
let $App = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    resourcePath: getApp().resourcePath,
    staticImageUrl: getApp().staticImageUrl,
    sevenUrl: getApp().sevenUrl,
    curPage: 1,
    pageSize1: 10,
    spaceFunctionId: "",
    houseId: "",
    isSort: 0,
    contentlist: [],
    listIndex: -1,
    isShowRechristen: false,
    isShowhouseInfo: false,
    message: "加载中",
    deleteFlag: false,
    deleteIndex: '',
    getContentListFlag: true,
    emptyPageObj: {},
    renamePlanType: '',
    renamePlanId: '',
    rename: '',
    reTaskId: '',
    reRenderState: '',
    loopFlag: true,
    planType: '',
    isPublish: '',
    selectIndex: -1,
    // rzd181226元旦红包活动，收集fromId start
    formId: [],
    formIndex: 0,
    // rzd181226元旦红包活动，收集fromId end

    regid: '', // 元旦活动regid
    // 随机文案
    titleArr: [
      {
        val: '这是2019年的红包，你收下吧！'
      },
      {
        val: 'Hi~我给自己家设计了一套装修方案，快来帮我看看鸭'
      },
      {
        val: '这是我们未来的家，亲爱的一起来看看吧~'
      },
      {
        val: '以后就在这样的客厅聚会，点开嗨起！'
      },
      {
        val: '快来看看我梦想中的家，还有红包可以拿！'
      },
      {
        val: '我家由我造，一起来设计自己家鸭~'
      }
    ],
    randomTitle: '这是2019年的红包，你收下吧！',
    i: 0, //记录分享事件调用次数
    spaceList: [],
    isShowDeleteHouseDialog: false,
    id: '',
    houseItem: {},
    // 埋点数据
    previousPath: '',
    nowPath: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    // rzd 埋点 190214 start
    let page = getCurrentPages(), previousPath = page.length > 1 ? page[page.length - 2].route : '',
      nowPath = page[page.length - 1].route;
    this.setData({
      previousPath: previousPath,
      nowPath: nowPath
    })
    // rzd 埋点 190214 end
    new $App.newNav() // 注册快速导航组件
    this.sellingPoint()
    // 用户数据
    this.setData({
      loopFlag: true
    })
    this.getSearchResluts('加载数据');
    this.getUserAccount()
    API.joinRedPacketAct({
      actId: 'c9b0f32324ef47b49f38bda52c85f1d7' || '3d127fded17d49d593f53c085d70b59c'
    }).then(response => {
      this.setData({
        regid: response.obj
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */

  //埋点
  sellingPoint(event) {
    let page = getCurrentPages(), previousPath = page.length > 1 ? page[page.length - 2].route : '',
      nowPath = page[page.length - 1].route
    API.sellingPoint({
      uid: wx.getStorageSync('openId'),
      cp: nowPath,
      lp: previousPath,
      e: event ? event : '',
      pt: '我的方案'
    })
  },
  query: function() {
    if (this.data.loopFlag) {
      let _this = this;
      _this.getSearchResluts('加载数据')
      setTimeout(() => {
        _this.query();
      }, 45000);
      return;
    }
  },
  onShow: function() {
    this.query();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      loopFlag: false
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      loopFlag: false
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */

  onReachBottom: function() {
    if (this.data.getContentListFlag) {
      if (this.data.totalCount > this.data.contentlist.length) {
        this.data.pageSize1 += 10
        this.getSearchResluts()
      }
    }
  },
  goYuandan(){
    wx.navigateTo({ url: '/pages/yuandan-activity/yuandan-activity?activityname=yuandan' }) 
  },
  // rzd181226元旦红包活动，收集fromId start
  getFormId(e) {
    this.data.formIndex++;
    this.data.formId.push(e.detail.formId);
    this.setData({
      formId: this.data.formId,
      formIndex: this.data.formIndex
    })
    if (this.data.formIndex >= 4) {
      API.collectMiniUserFormId(this.data.formId).then(res => {
        this.setData({
          formIndex: 0,
          formId: []
        })
      })
    }
  },
  // rzd181226元旦红包活动，收集fromId end
  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function(res) {
    let that = this;
    let item = res.target.dataset.item, routerQueryType = res.target.dataset.type, webUrl = null, sevenObj = null
    if (item.isSuccess == 0 || item.isSuccess == 1) {
      wx.showModal({
        title: '提示',
        content: '正在渲染，请稍后…',
        confirmText: '确定',
        cancelText: '取消',
        cancelColor: '#999999',
        confirmColor: '#ff6419'
      })
      return;
    } else if (item.isSuccess == 3) {
      wx.showModal({
        title: '提示',
        content: '渲染失败，不可分享…',
        confirmText: '确定',
        cancelText: '取消',
        cancelColor: '#999999',
        confirmColor: '#ff6419'
      })
      return;
    }
    // if (res.from === 'menu') {
    //   return $App.shareAppMessageObj
    // }
    if (res.from === 'button') {
      let imgurl;
      item.planPicPath ? imgurl = this.data.resourcePath + item.planPicPath : imgurl = this.data.staticImageUrl + 'design_def.png'
      item.newFullHousePlanId ? (webUrl = $App.wholeHouse3dUrl, sevenObj = {
          uuid: item.vrResourceUuid,
          token: wx.getStorageSync('token'),
          platformCode: 'brand2c',
          operationSource: 0,
          planId: item.newFullHousePlanId,
          routerQueryType: 'seven',
          customReferer: $App.wxUrl,
          platformNewCode: 'miniProgram',
          // formId: formId,
          isRender: 0,
          isTask: 1,
          houseId: item.houseId || 0,
          taskType: item.planRenderType
        }) :
        (webUrl = this.data.sevenUrl, sevenObj = {
          token: wx.getStorageSync('token'),
          platformCode: 'brand2c',
          operationSource: 0,
          planId: item.businessId,
          routerQueryType: routerQueryType,
          customReferer: $App.wxUrl,
          platformNewCode: 'miniProgram',
          isTask: 1,
          taskType: item.planRenderType,
          houseId: item.houseId || 0
        })
      for (let key in sevenObj) { webUrl += key + '=' + sevenObj[key] + '&' }
      webUrl = encodeURIComponent(webUrl)
      let shareObj = {
        title: item.designName,
        path: '/pages/home/home?shareType=720&url=' + webUrl,
        imageUrl: imgurl,
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      }
      return shareObj;
    }
  },
  topSwitch: function (e) {
    let i = e.currentTarget.dataset.i, n = e.currentTarget.dataset.n,
      ttt, id = e.currentTarget.dataset.id
    i == -1 ? this.setData({isShowhouseInfo:false}):this.setData({ isShowhouseInfo:true})
    this.setData({
      id: id,
      selectIndex: i,
      houseItem: e.currentTarget.dataset.item
    })
    // if (n == this.data.houseItem[i]) //不可重复点击
    //   return
    this.getSearchResluts()
  },
  sureDelete(e) {
    let that = this;
    let item = this.data.houseItem
    API.deleteMyDesignPlanAndTask({houseId:item.id})
      .then(res => {
        if (res.status) {
          wx.showToast({
            title: '删除成功',
            duration: 2000,
          })
          that.setData({ isShowDeleteHouseDialog: false, isShowhouseInfo: false,selectIndex:-1 ,id:''})
          that.getUserAccount()
          that.getSearchResluts('加载数据');
        } else {
          wx.showToast({
            title: '删除失败',
            duration: 2000,
          })
          this.setData({ isShowDeleteHouseDialog: false })
          that.getSearchResluts('加载数据')
          that.getUserAccount()
        }
      })
  },
  goRechristen(e) {
    this.cancel();
    let item = e.currentTarget.dataset.item
    let pId, taskId;
    { { item.planHouseType == 1 ? pId = item.businessId : pId = item.newFullHousePlanId } }
    { { item.planHouseType == 1 ? taskId = item.taskId : taskId = item.mainTaskId } }
    { { pId == null ? pId = 0 : pId = pId } }
    this.setData({
      listIndex: -1,
      isShowRechristen: true,
      renamePlanType: item.planHouseType,
      renamePlanId: pId,
      rename: '',
      reTaskId: taskId,
      reRenderState: item.renderState
    });
  },
  cancel() {
    this.setData({
      isShowRechristen: false
    });
  },
  toLanding(e) {
    let curr = e.currentTarget.dataset
    let id = curr.type == 1 ? curr.id : curr.iid
    let item = e.currentTarget.dataset.item
    let tys = curr.type == 1 ? 0 : 1;
    let urls = 'https://720.sanduspace.com/static/sxw/landingpage/mobildecoration.html';
    let url = '/pages/landing/landing?info=1&id=' + id + '&type=' + tys + '&url=' + urls;
    API.getAskState({ askType: 'askQuotation', taskId: item.taskId}).then(res=>{
      if(res.status){
        wx.navigateTo({
          url: url,
        })

      }
    })
    this.sellingPoint('free-offer')
  },
  showOperateBox(e) {
    let index,
      item = e.currentTarget.dataset.item
    if (e.target.dataset.index == this.data.listIndex) {
      index = -1;
    } else {
      index = e.target.dataset.index;
    }
    this.setData({
      listIndex: index
    });

  },

  // 获取用户户型
  getUserAccount: function(message) {
    let that = this
    API.getAllHouse().then(res => {
      if (res.obj) {
        this.setData({
          spaceList: res.obj
        })
      } else {
        wx.showToast({
          title: '未获取到你的户型信息',
        })
      }
    })
  },


  getSearchResluts: function(message) {
    this.data.getContentListFlag = false
    API.getMyDegianPlan({
        pageSize: this.data.pageSize1,
        curPage: this.data.curPage,
        houseId: this.data.id
      })
      .then(res => {
        //designTemplateId!=-1 && houseId存在可以继续装修
        this.data.getContentListFlag = true
        if (res.datalist && res.datalist.length > 0) {
          this.setData({ contentlist: res.datalist, totalCount: res.obj })
        } else {
          this.setData({
            contentlist: [],
            totalCount: 0,
            emptyPageObj: {
              imgUrl: this.data.staticImageUrl+'huxing_bg_no.png',
              title: '您还没有用过我们的产品呢',
              btnText: '去体验',
              url: '/pages/plan/house-case/house-case',
              switchTab: 'switchTab'
            }
          })
        }
      })
  },
  cancelFlag(e) {
    let key = e.currentTarget.dataset.key
    if (key == -1) {
      return;
    } else {
      this.setData({
        listIndex: -1
      })
    }
  },
  toThreeD(e) {
    let routerQueryType = e.currentTarget.dataset.type, item = e.currentTarget.dataset.item, webUrl = null, sevenObj = null
    if (item.planHouseType == 3 && !item.vrResourceUuid) {
      wx.showModal({
        title: '提示',
        content: '该方案正在渲染中，请稍后~',
        confirmText: '确定',
        cancelText: '取消',
        cancelColor: '#999999',
        confirmColor: '#ff6419'
      })
      return;
    }
    item.newFullHousePlanId ? (webUrl = $App.wholeHouse3dUrl, sevenObj = {
        uuid: item.vrResourceUuid,
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        operationSource: 0,
        planId: item.newFullHousePlanId,
        routerQueryType: 'seven',
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram',
        // formId: formId,
        isRender: 0,
        isTask: 1,
        houseId: item.houseId || 0,
        taskType: item.planRenderType,
        mainTaskId: item.mainTaskId
      }) :
      (webUrl = this.data.sevenUrl, sevenObj = {
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        operationSource: 0,
        planId: item.businessId,
        routerQueryType: routerQueryType,
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram',
        isTask: 1,
        taskType: item.planRenderType,
        houseId: item.houseId || 0
      })
    for (let key in sevenObj) { webUrl += key + '=' + sevenObj[key] + '&' }
    getApp().data.webUrl = webUrl
    wx.navigateTo({ url: '/pages/web-720/web-720' })
    this.sellingPoint('toThreeD-btn')
    // if (routerQueryType === 'video') {
    //   API.getDesignPlanResourceId({
    //     id: item.cpId,
    //     remark: routerQueryType
    //   })
    //     .then(res => {
    //       if (res.success) { return res.datalist[0].id } else { return false }
    //     })
    //     .then(res => {
    //       if (res) {
    //         API.getDesignPlanResource({ thumbId: res })
    //           .then(res => {
    //             res.success ? this.toVideo(res.obj.url) : wx.showToast({ title: '打开失败', icon: 'none' })
    //           })
    //       }
    //     })
    // } else {
    // }
  },
  enlargeImage(url) { // 查看大图
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  toVideo(url) {
    wx.navigateTo({
      url: '/pages/template/video/video?url=' + url
    })
  },
  deletebtn(e) { //删除按钮
    var that = this;
    that.setData({
      deleteFlag: !that.data.deleteFlag,
      deleteIndex: e.currentTarget.dataset.index
    })

  },
  closeDialog() {
    this.setData({ isShowDeleteHouseDialog: false })
  },
  showDeleteHouseDialog() {
    this.setData({ isShowDeleteHouseDialog: true })
  },
  delete(e) { //删除装修
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该方案？',
      confirmText: '确定',
      cancelText: '取消',
      cancelColor: '#999999',
      confirmColor: '#ff6419',
      success(res) {
        if (res.confirm) {
          let item = e.currentTarget.dataset.item
          let planId, taskId, renderState, planType, params;
          item.planHouseType == 1 ? taskId = item.taskId : taskId = item.mainTaskId;
          item.planHouseType == 1 ? planId = item.businessId : planId = item.newFullHousePlanId
          planId == null ? planId = 0 : planId = planId
          taskId = taskId;
          renderState = item.renderState;
          planType = item.planHouseType;
          params = { 'planId': planId, 'taskId': taskId, 'renderState': renderState, 'planType': planType }
          API.deleteMyDesignPlanAndTask(params)
            .then(res => {
              that.setData({ deleteFlag: false, deleteIndex: '' })
              if (res.status) {
                wx.showToast({
                  title: '删除成功',
                  duration: 2000,
                  complete: function () {
                    setTimeout(function () {
                      that.getSearchResluts('加载数据');
                      that.getUserAccount()
                      that.setData({ listIndex: -1 });
                    }, 2000) //延迟时间
                  }
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  duration: 2000,
                  complete: function () {
                    setTimeout(function () { that.getSearchResluts('加载数据'); that.getUserAccount() }, 2000) //延迟时间
                  }
                })
              }
            })
        }
      }
    })
  },
  tohousetype() { // 去装修
    wx.navigateTo({
      url: '/pages/house-type/house-type/house-type',
    })
  },
  getRename(e) {
    this.setData({
      rename: e.detail.value
    })
  },
  rename() {
    if (this.data.rename == '') {
      wx.showToast({
        title: '请输入方案名称',
        duration: 2000
      })
      return;
    }
    var that = this
    API.planReanme({
        planName: this.data.rename,
        planType: this.data.renamePlanType,
        planId: this.data.renamePlanId,
        taskId: this.data.reTaskId,
        renderState: this.data.reRenderState
      })
      .then(res => {
        if (res.obj) {
          wx.showToast({
            title: '重命名成功',
            duration: 2000,
            complete: function () {
              setTimeout(function () {
                that.setData({ isShowRechristen: false });
                that.getSearchResluts('加载数据');
              }, 2000) //延迟时间
            }
          })
        } else {
          wx.showToast({
            title: '重命名失败',
            duration: 2000,
            complete: function () {
            }
          })
        }
      })
  },
  deletePlan(e) {
    let id = e.currentTarget.dataset.id
    planType = e.currentTarget.dataset.planType
    API.deleteMyPlan({
      planType: planType,
      planId: id
    })
      .then(res => {
      })

  },
  toHouseDeatil(e) {
    wx.setStorageSync('specifyId', 0)
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/house-type/house-details/house-details?type=myPlan&houseId=' + item.houseId + '&templateId=' + item.templateId + '&fullHousePlanId=' + item.newFullHousePlanId + '&mainTaskId=' + item.mainTaskId
    })
    this.sellingPoint('continue-finish')
  },
  sharePlan(item, type) {
    let webUrl = null, sevenObj = null
    if (item.planHouseType == 3 && !item.vrResourceUuid) {
      wx.showModal({
        title: '提示',
        content: '该方案正在渲染中，请稍后分享~',
        confirmText: '确定',
        cancelText: '取消',
        cancelColor: '#999999',
        confirmColor: '#ff6419'
      })
      return;
    }
    item.newFullHousePlanId ? (webUrl = $App.wholeHouse3dUrl, sevenObj = {
        uuid: item.vrResourceUuid,
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        operationSource: 0,
        planId: item.newFullHousePlanId,
        routerQueryType: 'seven',
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram',
        // formId: formId,
        isRender: 0,
        isTask: 1,
        houseId: item.houseId || 0,
        taskType: item.planRenderType
      }) :
      (webUrl = this.data.sevenUrl, sevenObj = {
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        operationSource: 0,
        planId: item.businessId,
        routerQueryType: routerQueryType,
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram',
        isTask: 1,
        taskType: item.planRenderType,
        houseId: item.houseId || 0
      })
    for (let key in sevenObj) { webUrl += key + '=' + sevenObj[key] + '&' }
    getApp().data.webUrl = webUrl
    let shareObj = {
      title: item.designName,
      path: '/pages/home/home?shareType=720&url=' + webUrl,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
    return shareObj;
  },
  goPublishNews(e) {
    $App.sellingPoint(API, 'MyPlangoPublishNews', this.data.nowPath, this.data.previousPath, '我的方案');
    let item = e.currentTarget.dataset.item
    if (item.isSuccess == 0 || item.isSuccess == 1) {
      wx.showToast({
        icon: 'none',
        title: '请等待方案渲染完成',
      })
      return;
    }
    if (item.isSuccess == 3) {
      wx.showToast({
        icon: 'none',
        title: '方案渲染失败,请重新渲染',
      })
      return;
    }
    let type = 'plan'
    item.planHouseType == 1 ? (this.setData({
      planType: 3
    })) : (this.setData({
      planType: 4
    }))
    if (!item.planPicPath) {
      item.planPicPath = ''
    }
    let planId;
    item.planHouseType == 1 ? planId = item.businessId : planId = item.newFullHousePlanId
    if (item.supplyDemandId == null || item.supplyDemandId == 0) { //发布
      wx.navigateTo({
        url: '/pages/publishMessage/publishMessage?' + 'imgUrl=' + item.planPicPath + '&id=' + planId + '&planType=' + this.data.planType + '&type=' + type
      })
    } else { //回复
      API.checkSD(item.supplyDemandId).then(res=>{
        if(res.obj==0){
          let planId;
          item.newFullHousePlanId ? planId = item.newFullHousePlanId : planId = item.businessId
          wx.navigateTo({
            url: '/pages/decoration/supplyDetail/supplyDetail?id=' + item.supplyDemandId + '&addPlanId=' + planId + '&addPlanImg=' + item.planPicPath + '&planType=' + this.data.planType + '&editFlag=1' + '&uId=' + item.supplyDemandPublisherId
          })
        }else if (res.obj==1){
          wx.showToast({
            title: '互动区信息已删除，无法回复~',
            icon:'none',
            duration:3000
          })
        }
      })
    }
  },
  previewImage: function(e) {
    var that = this,
      src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  toChoose(e) {
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.i,
      skiptype = e.currentTarget.dataset.skiptype;
    if (skiptype == 'askDesign') {
      $App.sellingPoint(API, 'MyPlanaskDesign', this.data.nowPath, this.data.previousPath, '我的方案');
    } else if (skiptype =='askQuotation') {
      $App.sellingPoint(API, 'MyPlanaskQuotation', this.data.nowPath, this.data.previousPath, '我的方案');
    }
    API.getAskState({askType:skiptype,taskId:item.taskId}).then(res=>{
      if(res.status){
        if (skiptype =='askDesign'){
          this.setData({ ['contentlist['+index+'].askDesign']: '1' })
        } else if (skiptype == 'askQuotation'){
          this.setData({ ['contentlist['+index+'].askQuotation']: '1' })
        }
        wx.navigateTo({
          url: '/pages/mine/my-favorite-fitment/choose-designer/choose-designer?type=' + e.currentTarget.dataset.type + '&planPicPath=' + item.planPicPath + '&msgBody=' + (item.planHouseType == 1 ? item.businessId : item.newFullHousePlanId) + '&msgType=' + (item.planHouseType == 1 ? 2 : 3),
        })
      }
    })
  },
  noTo(e) {
    let item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '提示',
      content: (item.isSuccess == 0||item.isSuccess == 1) ? "方案正在渲染，请稍后~" : "方案渲染失败~",
      showCancel: false,
    })
  },
})