// pages/articlesDetail/articlesDetail.js
const API = getApp().API;
let $App = getApp();
var WxParse = require('../../utils/wxParse/wxParse.js');
let share = require('../../utils/shareConfig.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcePath: getApp().resourcePath,
    staticImageUrl: getApp().staticImageUrl,
    id:'',
    detail:'',
    commentList:[],
    commentTxt:'',
    totalCount:0,
    inputFlag:false,
    userId:wx.getStorageSync("id"),
    deleteFlag:false,
    deleteType:'',
    deleteCommentId:'',
    commentTotal:0,
    isShowDetail:false,
    emptyPageObj:{},
    scrollId:'',
    scrollHeight: '1150rpx',
    pageSize:10,
    submitFlag: false,
    userInfoStatus: wx.getStorageSync('userInfoStatus')
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight
    })
    if(options.id){
      this.setData({
        id:options.id
      })
    }
    $App.userLoginStatus.then(() => {
      this.getDetail()
      this.getComment();
    })
  },
  getDetail(){
    let that = this;
    let parm={
      id:this.data.id
    }
    API.getTopicDetail(parm).then(res => {
      if (res.success){
        res.obj.publishTime = this.changeTiem(res.obj.publishTime);
        that.setData({
          detail:res.obj,
          isShowDetail:true,
          emptyPageObj: {
            imgUrl: that.data.staticImageUrl + 'issue.png',
            title: res.message,
          }
        });
        WxParse.wxParse('article', 'html', this.data.detail.jsonContent, this, 0);
        console.log(this.data.detail,'99')
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
    let leadTime = new Date().getTime() - dateTime, date;
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
    if (leadTime / 1000 / 3600 / 168 > 1 && leadTime/1000/3600/168<2) {
      date = '1周前'
    }
    if (leadTime / 1000 / 3600 / 168 > 2 && leadTime/1000/3600/168<3) {
      date = '2周前'
    }
    if (leadTime / 1000 / 3600 / 168 > 3 && leadTime/1000/3600/168<4) {
      date = '3周前'
    }
    if (leadTime / 1000 / 3600 / 168 > 4) {
      date = '一个月前'
    }
    if (leadTime / 1000 / 3600 / 24 / 365> 1) {
      date = '一年前'
    }
    return date;
  },
  getComment() {
    API.getReplyList({ businessId: this.data.id, page: 1, limit: this.data.pageSize, order: this.data.order })
      .then(res => {
        for(let i=0;i<res.datalist.length;i++){
          res.datalist[i].gmtCreate = this.changeTiem(res.datalist[i].gmtCreate);
          if (res.datalist[i].authorPic) {
            if (res.datalist[i].authorPic.match('operationPlatform/robotManage/')) {
              res.datalist[i].authorPic = `${this.data.resourcePath}${res.datalist[i].authorPic}`
            }
          }
        }
        console.log(res.datalist)
        this.setData({
          commentList:res.datalist,
          commentTotal: res.totalCount
        })
      })
  },
  commentInput(e){
    $App.sd.track("btnclick", { "btnid": "commentInput" });
    this.setData({
      commentTxt:e.detail.value
    })
  },
  submitComment(e){
    wx.setStorage({
      key: 'userInfoStatus',
      data: '1',
    })
    this.setData({
      userInfoStatus: 1
    })
    if(e.detail.userInfo){
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
      this.setData({
        commentTxt:''
      })
      return;
    }
    let that = this;
    let parms={
      topicId: this.data.id,
      content:this.data.commentTxt,
      blockTypeValueKey: 'share'
    }
    if(this.data.submitFlag == false){
      this.setData({
        submitFlag:true
      })
      $App.sd.track("btnclick", { "btnid": "submitComment" });
      API.getZoneReplyAdd(parms).then(res=>{
        if(res.success){
          wx.showToast({
            title: '发布成功',
          })
          that.setData({
            commentTxt:'',
            inputFlag:false,
            scrollId:'comment'
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
  focus(){
    this.setData({
      inputFlag:true
    })
  },
  inputBlur(){
    if (this.data.commentTxt == ''){
      this.setData({
        inputFlag:false
      })
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
    this.setData({
      userInfoStatus: wx.getStorageSync('userInfoStatus')
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      $App.sd.track("btnclick", { "btnid": "onShareAppMessage" });
    }
    let obj = share.shareUrl('/pages/articlesDetail/articlesDetail?id=' + this.data.id, '快来评论这个博文吧', '', this.data.resourcePath + this.data.detail.coverPicPath)
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
      blockType: 3
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
  delete(e){
    let type =e.currentTarget.dataset.type
    this.setData({
      deleteFlag:true,
      deleteType: type
    })
    let id = e.currentTarget.dataset.id
    if(id){
      this.setData({
        deleteCommentId:id
      })
    }
  },
  cancelDelete(){
    this.setData({
      deleteFlag: false
    })
  },
  deleteFun(){
    let that = this;
    $App.sd.track("btnclick", { "btnid": "deleteFun" });
    if(this.data.deleteType=='post'){
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
        }
      })
    } else if (this.data.deleteType=='comment'){
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
  scroll(){
    $App.sd.track("btnclick", { "btnid": "scroll" });
    if(this.data.scrollId=='top'){
      this.setData({
        scrollId:'comment'
      })
    }else{
      this.setData({
        scrollId:'top'
      })
    }
  }

})