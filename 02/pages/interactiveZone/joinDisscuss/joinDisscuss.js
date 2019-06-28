const utils = require('../../../utils/utils.js');
const API = getApp().API;
const $App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticImageUrl: $App.staticImageUrl,
    resourcePath: $App.resourcePath,
    focusFlag: false,
    height: 0,
    userAddress: '选择位置',
    uploadedImg: [],
    imgIdArr: [],
    pics: [],
    focus: false,
    text: '',
    userInfoStatus: wx.getStorageSync('userInfoStatus')
  },
  imgArr: [],
  id: null,
  obj: {},
  edit: false,
  deletedLastPic: false,
  sendFlag: true,
  allCount: null,
  uploadFlag: false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.id = options.id;
    this.title = options.title
    this.setData({
      title: options.title
    });
    if (options.edit) {
      this.edit = true;
      this.topicId = options.topicId
      wx.setNavigationBarTitle({
        title: '编辑讨论',
      });
      setTimeout(() => {
        this.editReplyDetail();

      }, 300);
    } else {
      wx.setNavigationBarTitle({
        title: '参与讨论',
      });
      this.count = 0;
      this.allCount = 6 - this.count;
    }


  },
  // 大数据埋点
  bigDataSellingPoints() {
    $App.sd.track("pageview", {});
  },
  onShow(){
    this.bigDataSellingPoints()
    this.setData({
      userInfoStatus: wx.getStorageSync('userInfoStatus')
    })
  },
  /**获取评论详情*/
  editReplyDetail() {
    let params = {
      businessId: this.topicId,
      id: this.id,
      page: 1,
      limit: 5
    }
    API.getReplyList(params).then(res => {
      if (res.success) {
        this.setData({
          obj: res.datalist[0],
          text: res.datalist[0].content,
        });
        if (res.datalist[0].pics) {
          this.setData({
            pics: res.datalist[0].pics
          });
        };
        this.getCount();
      }
    })
  },
  areaInput(e) {
    this.setData({
      text: e.detail.value,
    });
  },
  deletePicImg(e) {
    let index = e.currentTarget.dataset.index;
    this.data.pics.splice(index, 1);
    if (this.data.pics.length == 0) {
      this.deletedLastPic = true
    }
    this.count--;
    this.allCount++;
    this.setData({
      pics: this.data.pics
    });
  },
  toUploadImg() {
    let that = this;
    this.uploadFlag = false;
    if (this.imgArr.length != 0) {
      this.imgArr.forEach((item, index) =>
        API.uploadFileIssuedImage({
          'platform': 'mini',
          'module': 'demand',
          'type': 'image',
          'path': item
        }).then(res => {
          if (res.status) {
            that.data.imgIdArr.push(
              res.obj.resId
            );
            that.setData({
              imgIdArr: that.data.imgIdArr
            });
            if (index == that.imgArr.length - 1) {
              setTimeout(() => {
                that.uploadFlag = true;
              }, 500)
            }

          } else {
            wx.showToast({
              icon: 'none',
              title: res.message,
            });
            that.data.uploadedImg.map((uploadItem, idx) => {
              if (uploadItem == item) {
                that.data.uploadedImg.splice(idx, 1);
                that.setData({
                  uploadedImg: that.data.uploadedImg
                })
              }
            });
          }
        })
      );
    }
  },
  deleteImg(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    this.data.uploadedImg.splice(index, 1);
    this.data.imgIdArr.splice(index, 1);
    this.allCount++;
    $App.sd.track("btnclick", { "btnid": "deleteImg" });
    this.setData({
      uploadedImg: that.data.uploadedImg
    });
  },
  getCount() {
    if (this.data.pics) {
      this.count = this.data.uploadedImg.length + this.data.pics.length;
    } else {
      this.count = this.data.uploadedImg.length;
    }
    this.allCount = 6 - this.count;
  },
  chooseImg() {
    let that = this;
    $App.sd.track("btnclick", { "btnid": "chooseImg" });
    if (this.count < 6) {
      wx.chooseImage({
        count: that.allCount,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          that.imgArr = res.tempFilePaths;
          that.setData({
            uploadedImg: that.data.uploadedImg ? that.data.uploadedImg.concat(that.imgArr) : that.imgArr
          });
          that.toUploadImg();
          that.allCount = that.allCount - that.imgArr.length;
        }
      });

    } else {
      wx.showModal({
        title: '提示',
        content: '最多只能上传6张照片哦~',
      });
    }
  },
  /**发送讨论 */
  release() {
    let that = this;
    if (this.data.uploadedImg.length == 0) {
      this.uploadFlag = true;
    }
    $App.sd.track("btnclick", { "btnid": "release" });
    if (this.uploadFlag) {
      if (this.sendFlag) {
        if (this.data.text.trim()) {
          let params = {
            content: this.data.text,
            blockTypeValueKey: 'topic',
          };
          if ((this.data.uploadedImg.length != 0 || this.data.pics.length != 0) && !this.deletedLastPic) { // 判断有无图片
            if (this.data.pics) {
              let picsId = that.data.pics.map(item => item.id);
              picsId.forEach(item => {
                that.data.imgIdArr.push(item);
              })
              this.setData({
                imgIdArr: that.data.imgIdArr
              })
            }
            let picIds = that.data.imgIdArr.join(',');
            params.picIds = picIds;
          } else if (this.deletedLastPic && this.data.uploadedImg.length == 0) {
            params.picIds = 0;
          }
          if (this.edit) { // 判断是编辑修改 还是 新发布
            params.id = this.id
            this.replyUpdata(params);
          } else {
            params.topicId = this.id
            this.replyAdd(params);
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '请输入内容',
          });
        }
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '正在上传照片，请稍等',
      })
    }



  },
  replyAdd(params) {
    let that = this;
    this.sendFlag = false;
    API.getZoneReplyAdd(params).then(res => {
      if (res.success) {
        wx.showToast({
          title: '发布成功',
        });
        setTimeout(() => {
          wx.navigateBack();
          this.sendFlag = true;
        }, 500);
      } else {
        wx.showToast({
          icon: 'none',
          title: res.message,
        })
      }
    })
  },
  replyUpdata(params) {
    let that = this;
    this.sendFlag = false;
    API.getZoneReplyUpdate(params).then(res => {
      if (res.success) {
        wx.showToast({
          title: '修改成功',
        });
        setTimeout(() => {
          wx.navigateBack();
          this.sendFlag = true;
        }, 500);
      } else {
        wx.showToast({
          icon: 'none',
          title: res.message,
        })
      }
    })
  },
  chooseAddress() {
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          userAddress: res.name
        })
      },
    })
  },
  /**编辑文字完成 */
  editFinished() {
    this.setData({
      focusFlag: false,
    });
  },
  inputfocus(e) {
    this.setData({
      focusFlag: true,
      focus: true,
      height: e.detail.height
    });
  },
  inputBlur(e) {
    this.setData({
      height: 0
    });
  },
  inputRetract() {
    let that = this;
    this.setData({
      focus: !that.data.focus,
    });
  },
  inputComfirm() {
    this.setData({
      height: 0,
      focusFlag: true,
    });
  }
})