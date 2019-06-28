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
    uploadedImg: [],
    bottomHeight: 0,
    text: '',
    imgIdArr: [],
    edit: false,
    pics: [],
    focus: true,
    userInfoStatus: wx.getStorageSync('userInfoStatus')
  },
  deletedLastPic: false,
  imgArr: [],
  sendFlag: true,
  count: 0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (options.edit) {
      wx.setNavigationBarTitle({
        title: '编辑问答',
      });
      this.initEditData(options.id);
      this.setData({
        edit: options.edit,
        id: options.id
      });

    } else {
      wx.setNavigationBarTitle({
        title: '发布问答',
      })
    }
    this.getCount();

  },
  getCount() {
    if (this.data.pics.length != 0) {
      this.count = this.data.uploadedImg.length + this.data.pics.length;
    } else {
      this.count = this.data.uploadedImg.length;
    }
  },
  /**初始化编辑事件 */
  initEditData(id) {
    let that = this;
    API.getTopicDetail({
      id: id
    }).then(res => {
      if (res.success) {
        let obj = res.obj;
        obj.publishTime = utils.changeTime(obj.publishTime);
        that.setData({
          obj: obj
        });
        if (this.data.obj.pics) {
          this.setData({
            text: that.data.obj.title,
            pics: that.data.obj.pics
          });
          let idArr = this.data.obj.picIds.split(',');
          idArr.forEach(item => {
            this.data.imgIdArr.push(item);
          });
          this.setData({
            imgIdArr: that.data.imgIdArr
          });
        } else {
          this.setData({
            text: that.data.obj.title,
          });
        }
      }
    })
  },
  keyboardSwitch() {
    let that = this;
    this.setData({
      focus: !that.data.focus
    });
  },
  /**上传照片至后台 */
  toUploadImg() {
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
          if (res.status) {
            that.data.imgIdArr.push(res.obj.resId);
            that.setData({
              imgIdArr: that.data.imgIdArr
            });
            if (index == that.imgArr.length - 1) {
              that.uploadFlag = true;
            }
          } else {
            wx.showToast({
              icon: 'none',
              title: res.message,
            });
            that.data.uploadedImg.map((uploadItem, idx)=>{
              if (uploadItem == item){
                that.data.uploadedImg.splice(idx, 1);
                that.setData({
                  uploadedImg: that.data.uploadedImg
                })
              }
            });    
          }
        })
      });
    }
  },
  /**发送问答 */
  sendQuestion() {
    let that = this;
    if (this.sendFlag) {
      if (this.data.text.trim()) {
        that.sendFlag = false;
        let params = {
          status: 1,
          title: this.data.text,
          blockTypeValueKey: 'askAndAnswer'
        }
        if (this.data.uploadedImg.length != 0) {
          let picIds = this.data.imgIdArr.join(',');
          params.picIds = picIds
        } else if (this.data.pics.length != 0) {
          let picIds = this.data.imgIdArr.join(',');
          params.picIds = picIds
          this.uploadFlag = true;
        } else if (this.deletedLastPic && this.data.uploadedImg.length == 0) {
          params.picIds = 0;
          this.uploadFlag = true;
        } else {
          this.uploadFlag = true;
        }
        if (this.uploadFlag) {
          if (!this.data.edit) {
            this.toSend(params);
          } else {
            params.id = this.data.obj.id;
            this.editSend(params);
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '正在上传照片，请稍后再点击~',
          });
          that.sendFlag = true;
        }

      } else {
        wx.showToast({
          icon: 'none',
          title: '请输入内容~',
        })
      }
    }
  },
  toSend(params) {
    this.setData({
      userInfoStatus: 1
    })
    let that = this;
    $App.sd.track("btnclick", { "btnid": "toSend" });
    // 取出图片id，并组装成字符串
    API.getZoneTopicAdd(params).then(res => {
      if (res.success) {
        wx.showToast({
          title: '发布成功',
        });
        setTimeout(() => {
          this.setRouterType(1)
          wx.navigateBack()
          that.sendFlag = true;
        }, 500);
      } else {
        wx.showToast({
          icon: 'none',
          title: res.message,
        });
        that.sendFlag = true;
      }
    })
  },
  setRouterType(type) {
    let prevPage = getCurrentPages()[getCurrentPages().length - 2]
    prevPage.setData({ routerType: type})
  },
  editSend(params) {
    let that = this;
    API.getZoneTopicUpdate(params).then(res => {
      if (res.success) {
        wx.showToast({
          title: '编辑成功',
        });
        setTimeout(() => {
          wx.navigateBack();
          that.sendFlag = true;
        }, 500);
      } else {
        wx.showToast({
          icon: 'none',
          title: res.message,
        });
        that.sendFlag = true;
      }
    })
  },
  /**
   * 删除上传照片
   */
  deletedUpload(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let uploadedImg = this.data.uploadedImg;
    uploadedImg.splice(index, 1);
    let imgIdArr = this.data.imgIdArr;
    imgIdArr.splice(index, 1);
    $App.sd.track("btnclick", { "btnid": "deletedUpload" });
    this.setData({
      uploadedImg: uploadedImg,
      imgIdArr: imgIdArr
    })

  },
  deletedPic(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    this.data.pics.splice(index, 1);
    this.data.imgIdArr.splice(index, 1);
    $App.sd.track("btnclick", { "btnid": "deletedPic" });
    if (this.data.pics.length == 0) {
      this.deletedLastPic = true
    }
    this.setData({
      imgIdArr: that.data.imgIdArr,
      pics: that.data.pics
    })
  },
  /**文本框聚焦 */
  textareaFocus(e) {
    this.setData({
      bottomOptShow: true,
      bottomHeight: e.detail.height
    })
  },
  /**文本框输入文字 */
  textareaInput(e) {
    this.setData({
      text: e.detail.value
    });
    console.log(this.data.bottomHeight, '中文')
  },
  /**文本框失去焦点 */
  textareaBlur() {
    this.setData({
      bottomHeight: 0
    })
  },
  /**
   * 上传照片
   */
  uploaded() {
    let that = this;
    this.getCount();
    $App.sd.track("btnclick", { "btnid": "uploaded" });
    if (this.count < 6) {
      wx.chooseImage({
        count: 6 - this.count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          that.imgArr = res.tempFilePaths;
          that.setData({
            uploadedImg: that.data.uploadedImg ? that.data.uploadedImg.concat(that.imgArr) : that.imgArr
          });
          that.toUploadImg();
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '最多只能上传6张照片哦~',
      });
    }
  },
  // 大数据埋点
  bigDataSellingPoints() {
    $App.sd.track("pageview", {});
  },
  onShow(){
    this.setData({ userInfoStatus: wx.getStorageSync('userInfoStatus') })
    this.bigDataSellingPoints()
  }

})