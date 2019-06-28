// pages/publishCase/publishCase.js
const API = getApp().API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resourcePath: getApp().resourcePath,
    staticImageUrl: getApp().staticImageUrl,
    styleList:[],
    styleFlag:false,
    spaceFlag:false,
    roomArray: ['1室', '2室', '3室', '4室', '5室', '6室', '7室', '8室', '9室', '10室'],
    livingAry: ['1厅', '2厅', '3厅', '4厅', '5厅', '6厅', '7厅', '8厅', '9厅', '10厅'],
    spaceIndex:[0,0],
    spaceTxt:'',
    styleTxt:'',
    styleIndex:0,
    content: [{ str1: '' }],
    windowHeight:'1000rpx',
    houseTypeImg:'',
    houseTypeImgId:''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getConditionMetadata();
    this.getHeight();
  },
  getHeight(){
    let that=this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight+'px'
        })
      },
    })
  },
  getConditionMetadata() { // 获取方案筛选条件  
    API.getConditionMetadata()
      .then(res => {
        if (res.status) {
          this.setData({
            styleList: res.obj[0].designPlanStyleVoList,
          })
        } else {
          this.setData({
            styleList: []
          })
        }
      })
  },
  space(){
    this.setData({
      spaceFlag:true
    })
  },
  style(){
    this.setData({
      styleFlag: true
    })
  },
  bindChange(e) {
    let val = e.detail.value;
    this.setData({
      spaceIndex:val
    })
  },
  spaceCancle(){
    this.setData({
      spaceIndex:[0,0],
      spaceFlag:false
    })
  },
  spaceConfirm(){
    let txt = this.data.roomArray[this.data.spaceIndex[0]] + this.data.livingAry[this.data.spaceIndex[1]]
    console.log(txt)
    this.setData({
      spaceTxt: txt,
      spaceFlag: false
    })
    console.log(this.data.spaceTxt)
  },
  styleCheck(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      styleIndex:index
    })
  },
  styleCancle(){
    this.setData({
      styleIndex:0,
      styleFlag:false
    })
  },
  styleConfirm(){
    this.setData({
      styleTxt: this.data.styleList[this.data.styleIndex].styleName,
      styleFlag: false
    })
  },
  addHouseImg(){
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
          API.uploadFileIssuedImage({
            'platform': 'mini',
            'module': 'demand',
            'type': 'image',
            'path': res.tempFilePaths[0]
          }).then(res => {
            if (res.success) {
              this.setData({
                houseTypeImg:res.obj.url,
                houseTypeImgId:res.obj.resId
              })
            } else {
              wx.showToast({ title: '上传失败', icon: 'none' });
            }
          })
      }
    })
  },
  /*标题*/
  titleBlur(e) {
    let i = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
    this.setData({
      title: e.detail.value.replace(i, '').replace(/\s+/g, '')
    });
  },
  textInput(e) {
    let id = e.currentTarget.dataset.id;
    let obj = this.data.content;
    obj[id].str1 = e.detail.value
    this.setData({
      content: obj
    })
  },
  addImg() {
    let that = this;
    let num = 10
    if (this.data.content.length >= 10) {
      wx.showToast({ title: '图片不得超过10张', icon: 'none' });
      return;
    }
    wx.chooseImage({
      count: 9,
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        if (res.tempFiles.length + this.data.content.length > num) {
          wx.showToast({
            title: '图片不得超过10张',
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
              wx.showToast({ title: '上传成功', icon: 'success' });
              let index = this.data.content.length - 1, obj = this.data.content
              obj[index].pic = (res.obj.url)
              obj[index].picId = (res.obj.resId)
              obj[index + 1] = { str1: '' }
              console.log(obj,'1')
              let imgArr = this.data.addImg;
              let imgIdArr = this.data.addImgId
              imgArr.push(res.obj.url);
              imgIdArr.push(res.obj.resId);
              this.setData({
                addImg: imgArr,
                addImgId: imgIdArr
              });
              that.setData({
                content: obj
              });

            } else {
              wx.showToast({ title: '上传失败', icon: 'none' });
            }
          })
        }

      }
    })

  },
  deleteImg(e) {
    let index = e.currentTarget.dataset.index;
    let obj = this.data.content;
    obj[index].pic = '';
    obj[index].picId = '';
    if (obj[index].str1 == '' && obj[index].pic == '' && obj.length > 1) {
      obj.splice(index, 1);
    }
    let addImgId = this.data.addImgId;
    let addImg = this.data.addImg;
    addImgId.splice(index, 1);
    addImg.splice(index, 1)
    this.setData({
      content: obj,
      addImgId: addImgId,
      addImg: addImg
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

  }
})