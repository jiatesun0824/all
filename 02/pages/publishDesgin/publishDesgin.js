// pages/publishDesgin/publishDesgin.js
let API = getApp().API, $App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticImageUrl: getApp().staticImageUrl,
    resourcePath: getApp().resourcePath,
    planFlag:false,
    houseFlag:false,
    planImg:'',
    planName:'',
    planTime:'',
    planId:'',
    houseId:'',
    houseImg:'',
    houseTitle:'',
    houseTime:'',
    content:'',
    editFlag:false,
    planType:'',
    mainId:'',
    submitFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.planId){

      this.setData({
        planImg: options.planImg,
        planName: options.planName,
        planTime: options.planTime,
        planId: options.planId,
        planFlag: true,
        planType:options.planType
      })
    }else if(options.houseId){
      this.setData({
        houseId: options.houseId,
        houseImg: options.houseImg,
        houseTitle: options.houseTitle,
        houseTime: options.houseTime,
        houseFlag: true
      })
    }
    if (options.content){
      this.setData({
        content:options.content
      })
    }
    if (options.type=="edit"){
      console.log("987879879798789")
      this.setData({
        editFlag:true,
        mainId: options.mainId
      })
    }
  },
  textInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  delPlan(){
    this.setData({
      planImg: '',
      planName: '',
      planTime: '',
      planId: ''
    })
  },
  delHouse(){
    this.setData({
      houseId: '',
      houseImg: '',
      houseTitle: '',
      houseTime: ''
    })
  },
  add(){
      // wx.navigateTo({
      //   url: '/pages/plan/selection-scheme/selections-scheme?navaPage=first&change=change',
      // })
      console.log(this.data.editFlag)
    if (this.data.editFlag){
      if (this.data.planFlag){
        wx.navigateTo({
          url: '/pages/plan/selection-scheme/selections-scheme?content='+this.data.content+'&isEdit=yes',
        })
      }else{
        wx.navigateTo({
          url: '/pages/plan/selection-house-type/selection-house-type?content=' + this.data.content +'&isEdit=yes',
        })
      }
    }else{
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        navaPage:'first',
        change:'change',
        content: this.data.content
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  submit(){
    let params; 
    if(this.data.planId){
      params= {
        title:this.data.planTitle,
        content: this.data.content,
        // coverPicId:this.data.planImg,
        planId: this.data.planId,
        planType:this.data.planType,
        blockTypeValueKey:'designReform',
      }
    }
    if(this.data.houseId){
      params = {
        title: this.data.houseTitle,
        content: this.data.content,
        // coverPicId: this.data.houseImg,
        blockTypeValueKey: 'designReform',
        houseId :this.data.houseId
      }
    }
    if(this.data.submitFlag == false){
        if(params==undefined){
          if(this.data.planFlag){
            wx.showToast({
              title: '请添加方案',
              icon:'none'
            })  
          }else{
            wx.showToast({
              title: '请添加户型',
              icon:'none'
            })
          }
          return;
        }
        this.setData({
          submitFlag: true
        })
      let str = this.data.content.replace(/\s+/g, "");
      if (str == '') {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return;
      }
      $App.sd.track("btnclick", { "btnid": "submit" });
      if(this.data.editFlag){
          params.id=this.data.mainId
        API.getZoneTopicUpdate(params).then(res =>{
          if (res.success) {
            wx.showToast({
              title: '发布成功',
            })
            setTimeout(() => { 
              wx.navigateBack({
                delta:2
              })
             }, 2000);
          } else {
            wx.showToast({
              title: '发布失败',
              icon: 'none'
            })
            this.setData({
              submitFlag: false
            })
          }
        })
      }else{
        let str = this.data.content.replace(/\s+/g, "");
        if (str == '') {
          wx.showToast({
            title: '请输入内容',
            icon: 'none'
          })
          return;
        }
      API.getZoneTopicAdd(params).then(res => {
        if (res.success) {
          wx.showToast({
            title: '发布成功',
          })
          setTimeout(() => { 
            // wx.navigateTo({ url: '/pages/interactiveZone/interactiveZone?navigateType=desgin'}) 
              // wx.navigateTo({ url: '/pages/interactiveZone/interactiveZone?navigateType=desgin' });
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 4];
              prevPage.setData({
                tabIndex:2
              })
              wx.navigateBack({
                delta:3
              })
            this.setData({
              submitFlag: false
            })  
            }, 2000);
        } else {
          wx.showToast({
            title: '发布失败',
            icon: 'none'
          })
          this.setData({
            submitFlag: false
          })
        }
      })
      }
    }else{
      return;
    }
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

  }
})