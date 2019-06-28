import { resourcePath, defaultImg} from '../../../utils/config.js'
let API = getApp().API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcePath: resourcePath,
    companyId:'',
    teamList:[],
    defaultImg: defaultImg,
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let id=options.companyId;
    this.setData({
      companyId:id,
      type:options.type
    })
    this.getList();
  },
  getList() {
    API.getCompanyDesignerList({ companyId: this.data.companyId, platformValue: 2 }).then(res => { // 增加平台标识
      if (res.code == 200) {
        let deArr=[],gzArr=[];
        for(let i=0;i<res.data.length;i++){
          if(res.data[i].businessType == 6){
            gzArr.push(res.data[i])
          }else{
            deArr.push(res.data[i])
          }
        }
        if(this.data.type==1){
          this.setData({teamList:deArr})
        }else{
          this.setData({teamList:gzArr})
        }
        
      } 
    })
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  toDetail(e){  
    let id = e.currentTarget.dataset.id
    if (id == undefined || id == null) {
      wx.showToast({
        title: '该设计师未创建店铺',
        icon: 'none',
        duration: 500
      })
    } else {
      wx.navigateTo({
        url: '/pages/decoration/companyDetail/companyDetail?id=' + id,
      })
    }
  }
})