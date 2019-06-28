import {
  resourcePath,
  defaultImg
} from '../../utils/config.js'
import regeneratorRuntime from '../../utils/runtime.js';
import utils from '../../utils/utils.js';
let API = getApp().API, curPage = 1, myCompoundUrl = getApp().myCompoundUrl, $App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // windowHeight: 0,
    // windowWidth: 0,
    staticImageUrl: getApp().staticImageUrl,
    hasHouse: true,
    houseList: [],
    isMoreList: true,
    id: null, // 选择的户型的id
    // 埋点数据
    previousPath: '',
    nowPath: '',
    testHouseType: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init(options)
  },
  init(options) {
    $App.userLoginStatus.then(() => {
      this.setPointFunc() // 埋点
      options.item && this.routerToThreeHouse(options) // 分享跳转      
    }) // 埋点
  },
  setPointFunc() {
    // 初始化屏幕宽高
    let that = this;
    // ZB 埋点 190311 start
    let page = getCurrentPages(), previousPath = page.length > 1 ? page[page.length - 2].route : '',
      nowPath = page[page.length - 1].route;
    this.setData({
      previousPath: previousPath,
      nowPath: nowPath
    })
    // ZB 埋点 190311 end
    $App.sellingPoint(API, '', this.data.nowPath, this.data.previousPath, '设计我家');
  },
  async getExperienceHouseType() {
    let { obj, success } = await API.getbasehouselist({
      experience: 1,
      livingId: 0,
      pageSize: 10,
      curPage: 1
    })
    success && obj.length > 0 && this.setData({ testHouseType: obj.find(n => n.experienceIndex === 1) })
  },
  routerToThreeHouse(options) {
    let item = JSON.parse(options.item)
    let params = {
      houseId: item.houseId,
      vrResourceUuid: item.uuid,
      newFullHousePlanId: item.planId,
      mainTaskId: item.mainTaskId,
    }
    wx.navigateTo({ url: `/pages/three-house/three-house?item=${JSON.stringify(params)}` })
  },
  async toDesign() {
    let item = this.data.testHouseType
    let houseItem = null
    if (this.data.houseList.length === 1) {
      houseItem = this.data.houseList[0]
    } else {
      let { obj, success } = await API.addFullHouse({ houseId: item.id})
      houseItem = {
        houseId: item.id,
        vrResourceUuid: '',
        newFullHousePlanId: obj.fullHouseId,
        mainTaskId: obj.mainTaskId,
      }
    }
    $App.sellingPoint(API, 'toDesign', this.data.nowPath, this.data.previousPath, '设计我家');
    wx.navigateTo({ url: `/pages/three-house/three-house?item=${JSON.stringify(houseItem)}` })
    $App.sd.track("btnclick", { "btnid": "designMyHome" })    
  },
  designMyHome() {
    $App.sellingPoint(API, 'designMyHome', this.data.nowPath, this.data.previousPath, '设计我家');
    // 开始设计跳转页面。
    let item = this.data.houseList.find(n => n.id == this.data.id)
    wx.navigateTo({ url: `/pages/three-house/three-house?item=${JSON.stringify(item)}`})
    $App.sd.track("btnclick", { "btnid": "designMyHome" })
  },
  // radioChange(e) {
  //   this.setData({ id: e.detail.value })
  // },
  chooseRadio(e) {
    $App.sellingPoint(API, 'chooseRadio', this.data.nowPath, this.data.previousPath, '设计我家');
    this.setData({ id: e.currentTarget.dataset.id})
  },
  mydecoration() {
    let that = this;
    let params = {
      curPage: curPage,
      pageSize: 5,
      probationHouseId: 0,
      taskType: 0
    }
    API.myDecorationPlan(params).then(res => {
      if (res.success) {
        if (res.obj === -1) {
          that.setData({ hasHouse: false, houseList: [] })
        } else {
          let flag = true;
          if (res.datalist) {
            flag = !(res.datalist.length === 1 && res.datalist[0].experienceIndex == 1)
            this.setData({
              isMoreList: true,
              hasHouse: flag,
              houseList: res.datalist,
              id: res.datalist[0].id
            });
          } else {
            this.setData({ hasHouse: false, houseList: []})
          }
        }
      } else {
        this.setData({ hasHouse: false, houseList: [] })        
      }
    })
  },
  /**
   * 下拉加载更多
   */
  lower() {
    if (this.data.isMoreList) {
      curPage++;
      let that = this;
      let params = {
        curPage: curPage,
        pageSize: 5,
        probationHouseId: 0,
        taskType: 0
      }
      API.myDecorationPlan(params).then(res => {
        console.log(res);
        if (res.status) {
          if (res.obj === -1) {
            that.setData({
              hasHouse: false
            });
          } else {        
            that.setData({
              hasHouse: true,
              houseList: that.data.isMoreList ? that.data.houseList.concat(res.datalist) : that.data.houseList,
            });
          }
        } else {
          that.setData({
            isMoreList: false, // 没有更多数据了
          });
          curPage = 1; // 重置
        }
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
    $App.userLoginStatus.then(() => {
      curPage =1
      this.getExperienceHouseType() // 虎丘体验户型      
      this.mydecoration()
      $App.sd.track("pageview", {});
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})